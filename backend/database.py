import os
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from dotenv import load_dotenv

# Load .env file
load_dotenv()

logger = logging.getLogger("yumzo")

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "yumzo_db")

def get_database():
    try:
        client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
        # Test connection with ping
        client.admin.command('ping')
        logger.info(f"✅ Successfully connected to MongoDB Atlas!")
        print(f"✅ MongoDB Atlas Connected | DB: {DB_NAME}")
        return client[DB_NAME], "MongoDB Atlas (Cloud)"
    except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
        logger.warning(f"⚠️ MongoDB Atlas connection failed: {e}")
        print(f"⚠️ MongoDB Atlas connection failed: {e}")
        print("⚠️ Falling back to in-memory mongomock database")
        import mongomock
        mock_client = mongomock.MongoClient()
        return mock_client[DB_NAME], "PyMongo Mongomock (In-Memory Fallback)"

db, db_type = get_database()

users_collection       = db["users"]
restaurants_collection = db["restaurants"]
foods_collection       = db["foods"]
orders_collection      = db["orders"]
