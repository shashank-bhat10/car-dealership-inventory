import pytest
from fastapi import HTTPException

from app.core.dependencies import get_current_admin
from app.models.user import User, UserRole


def test_admin_user_is_allowed():
    admin = User(
        username="admin",
        email="admin@example.com",
        password_hash="hashed_password",
        role=UserRole.ADMIN,
    )

    result = get_current_admin(admin)

    assert result == admin
    assert result.role == UserRole.ADMIN


def test_normal_user_is_rejected():
    user = User(
        username="normaluser",
        email="user@example.com",
        password_hash="hashed_password",
        role=UserRole.USER,
    )

    with pytest.raises(HTTPException) as exc_info:
        get_current_admin(user)

    assert exc_info.value.status_code == 403
    assert exc_info.value.detail == "Admin access required"