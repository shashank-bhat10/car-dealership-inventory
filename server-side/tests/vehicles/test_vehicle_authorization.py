from fastapi.testclient import TestClient
from sqlalchemy import delete

from app.database import SessionLocal
from app.main import app
from app.models.user import User, UserRole


client = TestClient(app)


def cleanup_users():
    db = SessionLocal()

    try:
        db.execute(delete(User))
        db.commit()
    finally:
        db.close()


def create_user(username, email, password="Test@123"):
    response = client.post(
        "/api/auth/register",
        json={
            "username": username,
            "email": email,
            "password": password,
        },
    )

    assert response.status_code == 201


def login_user(email, password="Test@123"):
    response = client.post(
        "/api/auth/login",
        json={
            "email": email,
            "password": password,
        },
    )

    assert response.status_code == 200

    return response.json()["access_token"]


def create_admin_user():
    create_user(
        "adminuser",
        "admin@example.com",
    )

    db = SessionLocal()

    try:
        user = db.query(User).filter(
            User.email == "admin@example.com"
        ).first()

        user.role = UserRole.ADMIN

        db.commit()
    finally:
        db.close()


def create_vehicle():
    create_admin_user()

    token = login_user("admin@example.com")

    return client.post(
        "/api/vehicles",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": 25000,
            "quantity": 5,
        },
    )

def test_regular_user_cannot_create_vehicle():
    cleanup_users()

    create_user(
        "regularuser",
        "regular@example.com",
    )

    token = login_user("regular@example.com")

    response = client.post(
        "/api/vehicles",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": 25000,
            "quantity": 5,
        },
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"


def test_regular_user_cannot_update_vehicle():
    cleanup_users()

    create_user(
        "regularuser",
        "regular@example.com",
    )

    token = login_user("regular@example.com")

    vehicle_response = create_vehicle()

    assert vehicle_response.status_code == 201

    vehicle_id = vehicle_response.json()["id"]

    response = client.put(
        f"/api/vehicles/{vehicle_id}",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "price": 23000,
        },
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"


def test_regular_user_cannot_delete_vehicle():
    cleanup_users()

    create_user(
        "regularuser",
        "regular@example.com",
    )

    token = login_user("regular@example.com")

    vehicle_response = create_vehicle()

    assert vehicle_response.status_code == 201

    vehicle_id = vehicle_response.json()["id"]

    response = client.delete(
        f"/api/vehicles/{vehicle_id}",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"


def test_regular_user_cannot_restock_vehicle():
    cleanup_users()

    create_user(
        "regularuser",
        "regular@example.com",
    )

    token = login_user("regular@example.com")

    vehicle_response = create_vehicle()

    assert vehicle_response.status_code == 201

    vehicle_id = vehicle_response.json()["id"]

    response = client.post(
        f"/api/vehicles/{vehicle_id}/restock",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "quantity": 10,
        },
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"