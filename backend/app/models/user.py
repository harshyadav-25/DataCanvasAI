from datetime import datetime
from bson import ObjectId


def create_user_document(name: str, email: str, hashed_password: str) -> dict:
    """
    Create a MongoDB user document.
    
    Args:
        name: User's full name
        email: User's email (will be lowercased)
        hashed_password: Bcrypt hashed password
        
    Returns:
        Dictionary ready to be inserted into MongoDB
    """
    return {
        "name": name,
        "email": email.lower(),
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }


def user_doc_to_dict(user_doc: dict) -> dict:
    """
    Convert a MongoDB user document to a safe dictionary (no hashed_password).
    
    Args:
        user_doc: Raw MongoDB user document
        
    Returns:
        Safe user dictionary for API responses
    """
    return {
        "id": str(user_doc["_id"]),
        "name": user_doc["name"],
        "email": user_doc["email"],
        "created_at": user_doc.get("created_at"),
    }
