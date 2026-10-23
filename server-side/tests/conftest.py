import os

import pytest
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.database import Base, get_db
from app.main import app


load_dotenv()

TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL")

if not TEST_DATABASE_URL:
    raise ValueError("TEST_DATABASE_URL is not set")


engine = create_engine(TEST_DATABASE_URL)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


@pytest.fixture
def db_session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()

        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def admin_headers(client):
    register_response = client.post(
        "/api/auth/register",
        json={
            "username": "adminuser",
            "email": "admin@example.com",
            "password": "Admin@123",
        },
    )

    assert register_response.status_code == 201

    # Promote registered user to ADMIN directly in the test database.
    db = TestingSessionLocal()

    try:
        from app.models.user import User
        from app.models.user import UserRole

        user = db.query(User).filter(
            User.email == "admin@example.com"
        ).first()

        assert user is not None

        user.role = UserRole.ADMIN

        db.commit()
    finally:
        db.close()

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "admin@example.com",
            "password": "Admin@123",
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    return {
        "Authorization": f"Bearer {token}"
    }


@pytest.fixture
def user_headers(client):
    register_response = client.post(
        "/api/auth/register",
        json={
            "username": "normaluser",
            "email": "user@example.com",
            "password": "User@123",
        },
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "user@example.com",
            "password": "User@123",
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    return {
        "Authorization": f"Bearer {token}"
    }