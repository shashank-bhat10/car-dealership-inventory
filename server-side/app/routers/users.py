from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserRoleUpdate
router = APIRouter(
    prefix="/api/users",
    tags=["Users"],
)


# =========================
# Request Schema
# =========================

class UserUpdate(BaseModel):
    username: str | None = None
    email: EmailStr | None = None


# =========================
# List Users
# =========================

@router.get("")
def list_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    users = db.query(User).all()

    return [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        }
        for user in users
    ]


# =========================
# Get User
# =========================

@router.get("/{user_id}")
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
    }


# =========================
# Update User
# =========================

@router.patch("/{user_id}")
@router.patch("/{user_id}")
def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    # Find user
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # Check duplicate username
    if user_data.username is not None:
        existing_username = (
            db.query(User)
            .filter(
                User.username == user_data.username,
                User.id != user_id,
            )
            .first()
        )

        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username already exists",
            )

    # Check duplicate email
    if user_data.email is not None:
        existing_email = (
            db.query(User)
            .filter(
                User.email == user_data.email,
                User.id != user_id,
            )
            .first()
        )

        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already exists",
            )

    # Update username
    if user_data.username is not None:
        user.username = user_data.username

    # Update email
    if user_data.email is not None:
        user.email = user_data.email

    db.commit()
    db.refresh(user)

    return {
        "message": "User updated successfully",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        },
    }

@router.patch("/{user_id}/role")
def update_user_role(
    user_id: int,
    role_data: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.role = role_data.role

    db.commit()
    db.refresh(user)

    return {
        "message": "User role updated successfully",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        },
    }


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if user.id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin cannot delete their own account",
        )

    deleted_user = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
    }

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully",
        "user": deleted_user,
    }