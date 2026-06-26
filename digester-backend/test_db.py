from app.database import get_supabase
from app.config import settings

def test_connection():
    print(f"DEBUG: Loading URL: '{settings.SUPABASE_URL}'")

    if not settings.SUPABASE_URL:
        print("❌ Error: SUPABASE_URL is empty! Check your .env file.")
        return

    db = get_supabase()
    # ... rest of your code ...
    if db:
        try:
            response = db.table("digests").select("*").limit(1).execute()
            print("🎉 Connection successful! Database is reachable.")
        except Exception as e:
            print(f"⚠️ Connection failed. Error: {e}")

if __name__ == "__main__":
    test_connection()