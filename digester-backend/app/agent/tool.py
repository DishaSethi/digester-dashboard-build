import httpx
from bs4 import BeautifulSoup

async def scrape_url(url: str) -> str:
    """Scrapes a URL and returns clean, stripped text content."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(url, headers=headers)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")

            # Remove scripts, styles, and navigation noise
            for element in soup(["script", "style", "nav", "footer", "header"]):
                element.decompose()

            text = soup.get_text(separator=" ")
            # Clean up whitespace
            cleaned_text = " ".join(text.split())
            return cleaned_text if cleaned_text else "No extractable text found."

        except Exception as e:
            raise RuntimeError(f"Failed to scrape URL: {str(e)}")