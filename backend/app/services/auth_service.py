from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncDatabase
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import create_user_document, user_doc_to_dict


async def signup_user(
    db: AsyncDatabase,
    name: str,
    email: str,
    password: str
) -> dict:
    """
    Register a new user.
    
    Args:
        db: MongoDB database instance
        name: User's full name
        email: User's email
        password: Plain password (will be hashed)
        
    Returns:
        UserOut dictionary with id, name, email
        
    Raises:
        HTTPException: 400 if email already exists
    """
    users_collection = db["users"]
    
    # Check if email already exists
    existing_user = await users_collection.find_one({"email": email.lower()})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )
    
    # Create new user document with hashed password
    user_doc = create_user_document(name, email, hash_password(password))
    
    # Insert into MongoDB
    result = await users_collection.insert_one(user_doc)
    
    return {
        "id": str(result.inserted_id),
        "name": name,
        "email": email.lower(),
        "created_at": user_doc["created_at"]
    }


async def authenticate_user(
    db: AsyncDatabase,
    email: str,
    password: str
) -> str:
    """
    Authenticate user and return JWT token.
    
    Args:
        db: MongoDB database instance
        email: User's email
        password: Plain password to verify
        
    Returns:
        JWT access token string
        
    Raises:
        HTTPException: 401 if email/password incorrect
    """
    users_collection = db["users"]
    
    # Find user by email
    user = await users_collection.find_one({"email": email.lower()})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create and return JWT token
    access_token = create_access_token(data={"sub": str(user["_id"])})
    return access_token
