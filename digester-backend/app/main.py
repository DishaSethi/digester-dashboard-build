from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import DigestRequest, DigestResponse
from app.config import settings

app = FastAPI(
    title="Digester Async Core Engine",
    description="Product Layer gateway handling async AI Agent executions.",
    version="1.0.0"
)

# Enable CORS so your Vercel frontend can securely communicate with your local/EC2 backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your specific Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "online", "engine": "Digester Agentic Core"}

@app.post("/api/digest", response_model=DigestResponse, status_code=202)
async def process_url_digest(payload: DigestRequest, background_tasks: BackgroundTasks):
    """
    Decoupled Ingestion Endpoint:
    Instantly returns a 202 status code to keep UI snappy, offloading
    the heavy agentic pipeline to a background task runner.
    """
    if not payload.url:
        raise HTTPException(status_code=400, detail="A valid URL must be provided.")

    # TODO: Initialize tracking row in Supabase 'digests' table
    db=get_supabase()

    try:
        data=db.table("digests").insert({
            "url":payload.url,
            "status":"processing"
        }).execute()

        digest_id=data.data[0]["id"]
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Database insertion failed:{str(e)}")

    background_tasks.add_task(run_agent_pipeline,digest_id,payload.url)
    # TODO: Hand off the task to the background Agent runner

    return {
        "message": "Ingestion successful. Async pipeline processing started.",
        "status": "processing",
        "digest_id":digest_id
    }