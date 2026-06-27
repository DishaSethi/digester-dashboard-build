import os
import json
import time
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_experimental.text_splitter import SemanticChunker
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.database import get_supabase
from app.agent.tool import scrape_url
from app.config import settings

# Initialize Gemini clients
embeddings = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-001",
    google_api_key=settings.GEMINI_API_KEY
)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=settings.GEMINI_API_KEY,
    temperature=0.2
)

async def run_agent_pipeline(digest_id: str, url: str) -> dict:
    db = get_supabase()

    try:
        # 1. Scrape the content
        content = await scrape_url(url)

        # 2. Generate embedding for the new content
        query_vector = embeddings.embed_query(content[:8000])

        # 3. Retrieve "Memory" from Supabase via pgvector RPC match function
        rpc_result = db.rpc("match_knowledge_chunks", {
            "query_embedding": query_vector,
            "match_threshold": 0.7,
            "match_count": 3
        }).execute()

        memories = [m['content'] for m in rpc_result.data] if rpc_result.data else []
        memory_context = "\n".join(memories) if memories else "No relevant past insights."

        # 4. Synthesize with Gemini
        system_prompt = "You are an expert technical summarizer and knowledge concierge."
        user_prompt = f"""
        Analyze this article and provide exactly 3 actionable, highly impactful bullet points.

        Article Content: {content[:10000]}

        Your Past Knowledge (Context Match): {memory_context}

        Format Requirement: You MUST return a valid JSON object with exactly two keys:
        "insight": A list of 3 bullet point strings.
        "context_match": A string explaining how this connects to past data or "New independent data".
        """

        response = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt)
        ])

        # Parse the output to ensure it's valid JSON
        try:
            result_data = json.loads(response.content)
        except json.JSONDecodeError:
            clean_content = response.content.replace("```json", "").replace("```", "").strip()
            try:
                result_data = json.loads(clean_content)
            except json.JSONDecodeError:
                result_data = {
                    "insight": [line.strip("- ") for line in response.content.split("\n") if line.strip()][:3],
                    "context_match": "Failed to parse structured JSON context."
                }

        # 5. Save the result back to Supabase and mark completed
        db.table("digests").update({
            "status": "completed",
            "result": result_data
        }).eq("id", digest_id).execute()

        # 6. Build Vector Memory with Quota-Safe Fallback
        # 6. Build Vector Memory with Quota-Safe Fallback
        memory_records = []
        try:
            chunk_source_text = content[:12000]

            semantic_chunker = SemanticChunker(
                embeddings,
                breakpoint_threshold_type="percentile"
            )
            semantic_docs = semantic_chunker.create_documents([chunk_source_text])

            for doc in semantic_docs[:5]:
                chunk_text = doc.page_content
                raw_emb = await embeddings.aembed_query(chunk_text)
                # Ensure the embedding is a flat list of floats
                chunk_embedding = raw_emb[0] if isinstance(raw_emb, list) and isinstance(raw_emb[0], list) else raw_emb

                memory_records.append({
                    "digest_id": digest_id,
                    "content": chunk_text,
                    "embedding": chunk_embedding
                })
                time.sleep(0.2)

            print(f"🧠 Successfully generated semantic memory chunks.")

        except Exception as rate_limit_error:
            print(f"⚠️ Semantic chunking rate limit hit. Falling back to recursive text splitting...")
            memory_records = []

            fallback_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
            fallback_chunks = fallback_splitter.split_text(content[:8000])

            for chunk_text in fallback_chunks[:5]:
                try:
                    raw_emb = await embeddings.aembed_query(chunk_text)
                    # Flattens the array if LangChain nests it inside another list
                    chunk_embedding = raw_emb[0] if isinstance(raw_emb, list) and isinstance(raw_emb[0], list) else raw_emb

                    memory_records.append({
                        "digest_id": digest_id,
                        "content": chunk_text,
                        "embedding": chunk_embedding
                    })
                    time.sleep(0.5)
                except Exception:
                    continue

        if memory_records:
            db.table("knowledge_chunks").insert(memory_records).execute()
            print(f"💾 Saved {len(memory_records)} chunks to pgvector database storage.")

        print(f"✅ Gemini Agent completed pipeline successfully for {digest_id}")
        return result_data

    except Exception as e:
        db.table("digests").update({"status": "failed"}).eq("id", digest_id).execute()
        print(f"❌ Gemini Agent pipeline failed: {str(e)}")
        raise e