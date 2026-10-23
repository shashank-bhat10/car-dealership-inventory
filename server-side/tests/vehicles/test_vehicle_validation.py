from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_create_vehicle_with_zero_price(admin_headers):
    response = client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": 0,
            "quantity": 5,
        },
    )

    assert response.status_code == 422


def test_create_vehicle_with_negative_price(admin_headers):
    response = client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": -1000,
            "quantity": 5,
        },
    )

    assert response.status_code == 422


def test_create_vehicle_with_negative_quantity(admin_headers):
    response = client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": 25000,
            "quantity": -1,
        },
    )

    assert response.status_code == 422


def test_create_vehicle_with_missing_make(admin_headers):
    response = client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "model": "Camry",
            "category": "Sedan",
            "price": 25000,
            "quantity": 5,
        },
    )

    assert response.status_code == 422