import httpx
from app.config import settings

async def scrape_url(url:str)-> str:
    """
    Scrapes the URL using Jina Reader.
    It converts any webpage into LLM-friendly markdown."""

    jina_url=f"https://r.jina.ai/{url}"

    async with httpx.AsyncClient() as client:
        response=await client.get(jina_url)
        response.raise_for_status()
        return response.text