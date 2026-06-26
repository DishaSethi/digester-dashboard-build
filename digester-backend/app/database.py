from supabase import create_client, Client
from app.config import settings

# This initializes the client once when the app starts
try:
    supabase: Client = create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_KEY
    )
    print("✅ Supabase client initialized successfully.")
except Exception as e:
    print(f"❌ Failed to initialize Supabase: {e}")
    supabase = None

def get_supabase():
    return supabase