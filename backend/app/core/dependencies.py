from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_access_token
from app.core.db import get_db
from bson import ObjectId

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db = Depends(get_db)
) -> dict:
    """
    Dependency to extract and validate the current user from JWT token.
    Raises 401 if token is invalid or user not found.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    try:
        # Fetch user from MongoDB
        users_collection = db["users"]
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        
        if user is None:
            raise credentials_exception
        
        # Return user document without hashed_password
        return {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "created_at": user.get("created_at")
        }
    except Exception:
        raise credentials_exception
