from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def create_vehicle(admin_headers):
    response = client.post(
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
    assert response.status_code == 201
    return response.json()["id"]


def test_regular_user_cannot_create_vehicle(user_headers):
    response = client.post(
        "/api/vehicles",
        headers=user_headers,
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


def test_regular_user_cannot_update_vehicle(admin_headers, user_headers):
    vehicle_id = create_vehicle(admin_headers)

    response = client.put(
        f"/api/vehicles/{vehicle_id}",
        headers=user_headers,
        json={"price": 23000},
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"


def test_regular_user_cannot_delete_vehicle(admin_headers, user_headers):
    vehicle_id = create_vehicle(admin_headers)

    response = client.delete(
        f"/api/vehicles/{vehicle_id}",
        headers=user_headers,
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"


def test_regular_user_cannot_restock_vehicle(admin_headers, user_headers):
    vehicle_id = create_vehicle(admin_headers)

    response = client.post(
        f"/api/vehicles/{vehicle_id}/restock",
        headers=user_headers,
        json={"quantity": 10},
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"
