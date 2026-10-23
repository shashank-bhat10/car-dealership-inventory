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


def test_register_user():
    cleanup_users()

    response = client.post(
        "/api/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "Test@123",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    assert "password" not in data
    assert "password_hash" not in data


def test_register_duplicate_email():
    cleanup_users()

    client.post(
        "/api/auth/register",
        json={
            "username": "firstuser",
            "email": "duplicate@example.com",
            "password": "Test@123",
        },
    )

    response = client.post(
        "/api/auth/register",
        json={
            "username": "seconduser",
            "email": "duplicate@example.com",
            "password": "Test@456",
        },
    )

    assert response.status_code == 409
    assert response.json()["detail"] == "Email already registered"

def test_register_duplicate_username():
    cleanup_users()

    client.post(
        "/api/auth/register",
        json={
            "username": "sameuser",
            "email": "first@example.com",
            "password": "Test@123",
        },
    )

    response = client.post(
        "/api/auth/register",
        json={
            "username": "sameuser",
            "email": "second@example.com",
            "password": "Test@456",
        },
    )

    assert response.status_code == 409
    assert response.json()["detail"] == "Username already registered"