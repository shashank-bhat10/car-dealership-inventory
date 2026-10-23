from fastapi.testclient import TestClient
from sqlalchemy import delete

from app.database import SessionLocal
from app.main import app
from app.models.vehicle import Vehicle

client = TestClient(app)


def cleanup_vehicles():
    db = SessionLocal()

    try:
        db.execute(delete(Vehicle))
        db.commit()
    finally:
        db.close()


def test_filter_vehicles_by_make(admin_headers):
    cleanup_vehicles()

    client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": 25000,
            "quantity": 5,
        },
    )

    client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Honda",
            "model": "Civic",
            "category": "Sedan",
            "price": 22000,
            "quantity": 3,
        },
    )

    response = client.get("/api/vehicles?make=Toyota")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["make"] == "Toyota"


def test_filter_vehicles_by_model(admin_headers):
    cleanup_vehicles()

    client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": 25000,
            "quantity": 5,
        },
    )

    client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Toyota",
            "model": "Corolla",
            "category": "Sedan",
            "price": 22000,
            "quantity": 3,
        },
    )

    response = client.get("/api/vehicles?model=Camry")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["model"] == "Camry"


def test_filter_vehicles_by_category(admin_headers):
    cleanup_vehicles()

    client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": 25000,
            "quantity": 5,
        },
    )

    client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Toyota",
            "model": "RAV4",
            "category": "SUV",
            "price": 30000,
            "quantity": 4,
        },
    )

    response = client.get("/api/vehicles?category=SUV")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["category"] == "SUV"


def test_filter_vehicles_by_min_price(admin_headers):
    cleanup_vehicles()

    client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": 25000,
            "quantity": 5,
        },
    )

    client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Honda",
            "model": "Civic",
            "category": "Sedan",
            "price": 15000,
            "quantity": 3,
        },
    )

    response = client.get("/api/vehicles?min_price=20000")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert float(data[0]["price"]) == 25000