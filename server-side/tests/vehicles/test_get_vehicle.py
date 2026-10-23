from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

def test_get_vehicle(admin_headers):
    create_response = client.post(
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

    assert create_response.status_code == 201

    created_vehicle = create_response.json()
    vehicle_id = created_vehicle["id"]

    response = client.get(f"/api/vehicles/{vehicle_id}")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == vehicle_id
    assert data["make"] == "Honda"
    assert data["model"] == "Civic"
    assert data["category"] == "Sedan"
    assert float(data["price"]) == 22000
    assert data["quantity"] == 3

def test_get_vehicle_not_found():
    response = client.get("/api/vehicles/999999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Vehicle not found"