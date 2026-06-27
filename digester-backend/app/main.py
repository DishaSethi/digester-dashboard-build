from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.database import get_supabase
from app.agent.workflow import run_agent_pipeline
from app.config import settings

app = FastAPI(
    title="Digester Async Core Engine",
    description="Product Layer gateway handling async Gemini AI Agent executions.",
    version="1.0.0"
)

# Enable CORS so your Vercel frontend can securely communicate with your backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your specific Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Payload Schema
class DigestRequest(BaseModel):
    url: str

@app.get("/")
def read_root():
    return {"status": "online", "engine": "Digester Agentic Core"}

@app.post("/api/digest", status_code=202)
async def process_url_digest(payload: DigestRequest, background_tasks: BackgroundTasks):
    """
    Decoupled Ingestion Endpoint:
    Instantly returns a 202 status code to keep UI snappy, offloading
    the heavy Gemini agentic pipeline to a background task runner.
    """
    if not payload.url:
        raise HTTPException(status_code=400, detail="A valid URL must be provided.")

    db = get_supabase()

    try:
        # 1. Initialize tracking row in Supabase 'digests' table
        # Since 'id' is generated automatically by Supabase (UUID), we capture it from the response.
        data = db.table("digests").insert({
            "url": payload.url,
            "status": "processing"
        }).execute()

        if not data.data:
            raise Exception("No data returned from database insert.")

        digest_id = data.data[0]["id"]

    except Exception as e:
        print(f"❌ Database setup error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database insertion failed: {str(e)}")

    # 2. Hand off the scraping, embedding, and synthesis task to the background Gemini runner
    background_tasks.add_task(run_agent_pipeline, digest_id, payload.url)

    # 3. Respond immediately to keep the client snappy
    return {
        "message": "Ingestion successful. Async pipeline processing started.",
        "status": "processing",
        "digest_id": digest_id
    }

@app.get("/api/digest/{digest_id}")
async def get_digest_status(digest_id: str):
    """
    Polling Endpoint:
    Allows the frontend to check whether the Gemini pipeline is 'processing', 'completed', or 'failed'.
    """
    db = get_supabase()
    try:
        result = db.table("digests").select("*").eq("id", digest_id).execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Digest tracking ID not found.")

        return result.data[0]

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch status: {str(e)}")