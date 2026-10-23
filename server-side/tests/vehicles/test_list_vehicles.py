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

    response = client.get("/api/vehicles")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 1

    vehicle = data[0]

    assert vehicle["make"] == "Toyota"
    assert vehicle["model"] == "Camry"
    assert vehicle["category"] == "Sedan"
    assert float(vehicle["price"]) == 25000
    assert vehicle["quantity"] == 5