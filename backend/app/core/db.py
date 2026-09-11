from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings
from typing import Any

# Global MongoDB client and database instances

db_client: Any = None
db: Any = None


async def connect_to_mongo():
    """Connect to MongoDB using Motor (async driver)."""
    global db_client, db

    try:
        db_client = AsyncIOMotorClient(settings.MONGODB_URL)
        db = db_client[settings.MONGODB_DB_NAME]

        # Verify connection by pinging the server
        await db_client.admin.command("ping")

        print(f"✓ Connected to MongoDB: {settings.MONGODB_DB_NAME}")

    except Exception as e:
        print(f"✗ Failed to connect to MongoDB: {e}")
        raise


async def close_mongo_connection():
    """Close MongoDB connection."""
    global db_client

    if db_client:
        db_client.close()
        print("✓ MongoDB connection closed")


def get_db() -> Any:
    """Get the database instance."""
    return db