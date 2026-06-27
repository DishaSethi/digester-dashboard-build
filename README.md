🧠 Digester: The Smart Knowledge Concierge
Digester is an AI-powered MVP designed to solve information overload. Instead of letting bookmarked articles die in a reading list, Digester ingests them, compares them against your previously saved knowledge, and delivers a highly structured, 3-bullet actionable briefing.

⚡ What it Does
Scrapes Instantly: Drop a URL into the dashboard, and the app instantly fetches the clean, LLM-ready markdown of the article.

Queries Memory: It embeds the new article and runs a semantic vector search across your database to see how it connects to, updates, or contradicts things you've read in the past.

Synthesizes & Learns: It generates a strict 3-bullet summary where each point provides a core Insight and a Context Match (how it relates to your past knowledge), then saves the new data to its memory.

## 🏗️ System Architecture

Digester operates on a clean, asynchronous pipeline designed for high-fidelity context retrieval.

```mermaid
graph TD
    %% User Flow
    A[Client UI / Dashboard] -->|1. Submits Tech Doc URL| B(FastAPI Backend)

    %% Ingestion Phase
    B -->|2. Triggers| C{Web Scraper / Extractor}
    C -->|Clean Markdown| D[LangChain Semantic Splitter]

    %% Embedding Phase
    D -->|Text Chunks| E[Gemini Embedding-001]
    E -->|3072-dim Vectors| F[(Supabase pgvector DB)]

    %% Retrieval & Synthesis
    F -->|3. Cosine Similarity Match| G[Context Retrieval]
    G -->|Past Knowledge + New Article| H[Gemini 2.5 Flash]
    H -->|4. Generates 3-Bullet Briefing| A