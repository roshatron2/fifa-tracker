from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

# Lazy initialization - client and db are created on first use
_client = None
_db = None

def _get_client():
    """Get or create MongoDB client (lazy initialization)"""
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(settings.MONGO_URI)
    return _client

def _get_db():
    """Get or create database instance (lazy initialization)"""
    global _db
    if _db is None:
        _db = _get_client()[settings.DATABASE_NAME]
    return _db

# Export client for direct access (e.g., in main.py)
# Use __getattr__ for Python 3.7+ module-level attribute access
def __getattr__(name):
    if name == 'client':
        return _get_client()
    raise AttributeError(f"module '{__name__}' has no attribute '{name}'")

async def get_database():
    """Get database dependency for dependency injection"""
    return _get_db()
