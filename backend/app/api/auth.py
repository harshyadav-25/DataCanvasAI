from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user import UserCreate, UserOut, Token
from app.services.auth_service import signup_user, authenticate_user
from app.core.dependencies import get_current_user
from app.core.db import get_db

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def signup(
    payload: UserCreate,
    db = Depends(get_db)
) -> UserOut:
    """
    Register a new user.
    
    - **name**: User's full name
    - **email**: User's unique email (will be lowercased)
    - **password**: Password with minimum 8 characters
    
    Returns: UserOut with id, name, email (no password)
    """
    result = await signup_user(db, payload.name, payload.email, payload.password)
    return UserOut(**result)


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db = Depends(get_db)
) -> Token:
    """
    Login with email and password.
    
    - **username**: User's email (form field named username for OAuth2 compatibility)
    - **password**: User's password
    
    Returns: JWT access token
    """
    token = await authenticate_user(db, form_data.username, form_data.password)
    return Token(access_token=token, token_type="bearer")


@router.get("/me", response_model=UserOut)
async def get_current_user_info(
    current_user: dict = Depends(get_current_user)
) -> UserOut:
    """
    Get current authenticated user's information.
    
    Requires: Valid JWT token in Authorization header
    
    Returns: UserOut with user's id, name, email
    """
    return UserOut(**current_user)
