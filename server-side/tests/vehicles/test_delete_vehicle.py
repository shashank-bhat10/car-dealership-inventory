from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_delete_vehicle(admin_headers):
    create_response = client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Ford",
            "model": "Mustang",
            "category": "Sports",
            "price": 45000,
            "quantity": 2,
        },
    )

    assert create_response.status_code == 201

    vehicle_id = create_response.json()["id"]

    response = client.delete(
        f"/api/vehicles/{vehicle_id}",
        headers=admin_headers,
    )

    assert response.status_code == 204

    get_response = client.get(
        f"/api/vehicles/{vehicle_id}"
    )

    assert get_response.status_code == 404


def test_delete_vehicle_not_found(admin_headers):
    response = client.delete(
        "/api/vehicles/999999",
        headers=admin_headers,
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Vehicle not found"