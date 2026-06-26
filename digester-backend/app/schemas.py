from pydantic import BaseModel, HttpUrl
from typing import List, Optional

class DigestRequest(BaseModel):
    url: str

class BulletBriefing(BaseModel):
    insight: str
    context_match: str

class DigestResponse(BaseModel):
    message: str
    status: str
    digest_id: Optional[str] = None