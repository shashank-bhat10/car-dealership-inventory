from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_paginate_vehicles():
    for i in range(5):
        client.post(
            "/api/vehicles",
            json={
                "make": f"Toyota{i}",
                "model": "Camry",
                "category": "Sedan",
                "price": 25000,
                "quantity": 5,
            },
        )

    response = client.get("/api/vehicles?page=1&limit=2")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 2