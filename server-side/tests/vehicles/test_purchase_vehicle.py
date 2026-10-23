from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_purchase_vehicle(admin_headers, user_headers):
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
        f"/api/vehicles/{vehicle_id}/purchase",
        headers=user_headers,
        json={
            "quantity": 2,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "Vehicle purchased successfully"
    assert data["vehicle"]["id"] == vehicle_id
    assert data["vehicle"]["make"] == "Toyota"
    assert data["vehicle"]["model"] == "Camry"
    assert data["vehicle"]["quantity"] == 3


def test_purchase_entire_vehicle_quantity(admin_headers, user_headers):
    create_response = client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Honda",
            "model": "Civic",
            "category": "Sedan",
            "price": 22000,
            "quantity": 5,
        },
    )

    assert create_response.status_code == 201

    vehicle_id = create_response.json()["id"]

    response = client.post(
        f"/api/vehicles/{vehicle_id}/purchase",
        headers=user_headers,
        json={
            "quantity": 5,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "Vehicle purchased successfully"
    assert data["vehicle"]["id"] == vehicle_id
    assert data["vehicle"]["quantity"] == 0


def test_purchase_more_than_available_quantity(admin_headers, user_headers):
    create_response = client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Honda",
            "model": "Accord",
            "category": "Sedan",
            "price": 28000,
            "quantity": 3,
        },
    )

    assert create_response.status_code == 201

    vehicle_id = create_response.json()["id"]

    response = client.post(
        f"/api/vehicles/{vehicle_id}/purchase",
        headers=user_headers,
        json={
            "quantity": 5,
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Insufficient vehicle quantity"

    get_response = client.get(
        f"/api/vehicles/{vehicle_id}"
    )

    assert get_response.status_code == 200
    assert get_response.json()["quantity"] == 3


def test_purchase_zero_quantity(admin_headers, user_headers):
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
        f"/api/vehicles/{vehicle_id}/purchase",
        headers=user_headers,
        json={
            "quantity": 0,
        },
    )

    assert response.status_code == 422

    get_response = client.get(
        f"/api/vehicles/{vehicle_id}"
    )

    assert get_response.status_code == 200
    assert get_response.json()["quantity"] == 5


def test_purchase_negative_quantity(admin_headers, user_headers):
    create_response = client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Hyundai",
            "model": "Creta",
            "category": "SUV",
            "price": 24000,
            "quantity": 5,
        },
    )

    assert create_response.status_code == 201

    vehicle_id = create_response.json()["id"]

    response = client.post(
        f"/api/vehicles/{vehicle_id}/purchase",
        headers=user_headers,
        json={
            "quantity": -2,
        },
    )

    assert response.status_code == 422

    get_response = client.get(
        f"/api/vehicles/{vehicle_id}"
    )

    assert get_response.status_code == 200
    assert get_response.json()["quantity"] == 5


def test_purchase_vehicle_not_found(user_headers):
    response = client.post(
        "/api/vehicles/999999/purchase",
        headers=user_headers,
        json={
            "quantity": 2,
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Vehicle not found"


def test_purchase_vehicle_updates_updated_at(admin_headers, user_headers):
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
        f"/api/vehicles/{vehicle_id}/purchase",
        headers=user_headers,
        json={
            "quantity": 2,
        },
    )

    assert response.status_code == 200

    after_updated_at = response.json()["vehicle"]["updated_at"]

    assert after_updated_at != before_updated_at