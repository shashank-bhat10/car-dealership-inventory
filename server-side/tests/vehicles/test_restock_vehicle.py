from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_restock_vehicle(admin_headers):
    create_response = client.post(
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

    assert create_response.status_code == 201

    vehicle_id = create_response.json()["id"]

    response = client.post(
        f"/api/vehicles/{vehicle_id}/restock",
        headers=admin_headers,
        json={
            "quantity": 10,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "Vehicle restocked successfully"
    assert data["vehicle"]["id"] == vehicle_id
    assert data["vehicle"]["make"] == "Toyota"
    assert data["vehicle"]["model"] == "Camry"
    assert data["vehicle"]["quantity"] == 15


def test_restock_vehicle_after_purchase(admin_headers, user_headers):
    create_response = client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Honda",
            "model": "City",
            "category": "Sedan",
            "price": 18000,
            "quantity": 10,
        },
    )

    assert create_response.status_code == 201

    vehicle_id = create_response.json()["id"]

    purchase_response = client.post(
        f"/api/vehicles/{vehicle_id}/purchase",
        headers=user_headers,
        json={
            "quantity": 4,
        },
    )

    assert purchase_response.status_code == 200
    assert purchase_response.json()["vehicle"]["quantity"] == 6

    restock_response = client.post(
        f"/api/vehicles/{vehicle_id}/restock",
        headers=admin_headers,
        json={
            "quantity": 7,
        },
    )

    assert restock_response.status_code == 200

    data = restock_response.json()

    assert data["message"] == "Vehicle restocked successfully"
    assert data["vehicle"]["id"] == vehicle_id
    assert data["vehicle"]["quantity"] == 13


def test_restock_zero_quantity(admin_headers):
    create_response = client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Toyota",
            "model": "Corolla",
            "category": "Sedan",
            "price": 23000,
            "quantity": 5,
        },
    )

    assert create_response.status_code == 201

    vehicle_id = create_response.json()["id"]

    response = client.post(
        f"/api/vehicles/{vehicle_id}/restock",
        headers=admin_headers,
        json={
            "quantity": 0,
        },
    )

    assert response.status_code == 422

    get_response = client.get(
        f"/api/vehicles/{vehicle_id}",
        headers=admin_headers,
    )

    assert get_response.status_code == 200
    assert get_response.json()["quantity"] == 5


def test_restock_negative_quantity(admin_headers):
    create_response = client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Hyundai",
            "model": "Venue",
            "category": "SUV",
            "price": 20000,
            "quantity": 5,
        },
    )

    assert create_response.status_code == 201

    vehicle_id = create_response.json()["id"]

    response = client.post(
        f"/api/vehicles/{vehicle_id}/restock",
        headers=admin_headers,
        json={
            "quantity": -3,
        },
    )

    assert response.status_code == 422

    get_response = client.get(
        f"/api/vehicles/{vehicle_id}",
        headers=admin_headers,
    )

    assert get_response.status_code == 200
    assert get_response.json()["quantity"] == 5


def test_restock_vehicle_not_found(admin_headers):
    response = client.post(
        "/api/vehicles/999999/restock",
        headers=admin_headers,
        json={
            "quantity": 10,
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Vehicle not found"


def test_restock_vehicle_updates_updated_at(admin_headers):
    create_response = client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Toyota",
            "model": "Fortuner",
            "category": "SUV",
            "price": 40000,
            "quantity": 5,
        },
    )

    assert create_response.status_code == 201

    vehicle_id = create_response.json()["id"]

    before_updated_at = create_response.json()["updated_at"]

    response = client.post(
        f"/api/vehicles/{vehicle_id}/restock",
        headers=admin_headers,
        json={
            "quantity": 5,
        },
    )

    assert response.status_code == 200

    after_updated_at = response.json()["vehicle"]["updated_at"]

    assert after_updated_at != before_updated_at