from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_create_vehicle(admin_token):
    response = client.post(
        "/api/vehicles",
        headers={
            "Authorization": f"Bearer {admin_token}",
        },
        json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": 25000,
            "quantity": 5,
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["id"] is not None
    assert data["make"] == "Toyota"
    assert data["model"] == "Camry"
    assert data["category"] == "Sedan"
    assert data["price"] == 25000
    assert data["quantity"] == 5