from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.database import get_db
from app.schemas.auth import RegisterRequest, RegisterResponse
from app.models.user import User, UserRole

from app.core.dependencies import get_current_user

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)

from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    RegisterResponse,
    TokenResponse,
    UserResponse,
)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    user_data: RegisterRequest,
    db: Session = Depends(get_db),
):
    existing_email = db.scalar(
        select(User).where(User.email == user_data.email)
    )

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    existing_username = db.scalar(
        select(User).where(User.username == user_data.username)
    )

    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already registered",
        )

    user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        role=UserRole.USER,
    )


    db.add(user)
    db.commit()
    db.refresh(user)

    return user

@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    user_data: LoginRequest,
    db: Session = Depends(get_db),
):
    user = db.scalar(
        select(User).where(User.email == user_data.email)
    )

    if not user or not verify_password(
        user_data.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
    data={
        "sub": str(user.id),
    }
)

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user