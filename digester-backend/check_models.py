from app.config import settings
from google import genai

# Initialize the new Google GenAI client using your existing config
client = genai.Client(api_key=settings.GEMINI_API_KEY)

print("🔍 Scanning Google's API for active embedding models...")

# Fetch all models and filter for the word "embed"
try:
    for model in client.models.list():
        if "embed" in model.name.lower():
            print(f"✅ Found: {model.name}")
except Exception as e:
    print(f"❌ Failed to fetch models: {e}")