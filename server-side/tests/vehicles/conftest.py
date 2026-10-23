import pytest
from fastapi.testclient import TestClient

from app.database import SessionLocal
from app.main import app
from app.models.user import User


client = TestClient(app)

@pytest.fixture
def admin_token(admin_headers):
    return admin_headers["Authorization"].replace("Bearer ", "")

@pytest.fixture
def auth_headers():
    db = SessionLocal()

    try:
        db.query(User).delete()
        db.commit()
    finally:
        db.close()

    # Create regular user
    user_response = client.post(
        "/api/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "Test@123",
        },
    )

    assert user_response.status_code == 201

    # Create admin
    admin_response = client.post(
        "/api/auth/register",
        json={
            "username": "adminuser",
            "email": "admin@example.com",
            "password": "Test@123",
        },
    )

    assert admin_response.status_code == 201

    # Change admin role
    db = SessionLocal()

    try:
        admin = db.query(User).filter(
            User.email == "admin@example.com"
        ).first()

        admin.role = "ADMIN"
        db.commit()
    finally:
        db.close()

    # Login regular user
    user_login = client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "Test@123",
        },
    )

    assert user_login.status_code == 200

    # Login admin
    admin_login = client.post(
        "/api/auth/login",
        json={
            "email": "admin@example.com",
            "password": "Test@123",
        },
    )

    assert admin_login.status_code == 200

    return {
        "user": {
            "Authorization": (
                f"Bearer {user_login.json()['access_token']}"
            )
        },
        "admin": {
            "Authorization": (
                f"Bearer {admin_login.json()['access_token']}"
            )
        },
    }


@pytest.fixture
def admin_headers(auth_headers):
    return auth_headers["admin"]


@pytest.fixture
def user_headers(auth_headers):
    return auth_headers["user"]