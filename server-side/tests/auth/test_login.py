from fastapi.testclient import TestClient
from sqlalchemy import delete

from app.database import SessionLocal
from app.main import app
from app.models.user import User


client = TestClient(app)


def cleanup_users():
    db = SessionLocal()

    try:
        db.execute(delete(User))
        db.commit()
    finally:
        db.close()


def create_test_user():
    response = client.post(
        "/api/auth/register",
        json={
            "username": "loginuser",
            "email": "login@example.com",
            "password": "Test@123",
        },
    )

    assert response.status_code == 201


def test_login_user():
    cleanup_users()
    create_test_user()

    response = client.post(
        "/api/auth/login",
        json={
            "email": "login@example.com",
            "password": "Test@123",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert len(data["access_token"]) > 0