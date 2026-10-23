from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_paginate_vehicles(admin_headers, user_headers):
    for i in range(5):
        client.post(
            "/api/vehicles",
            headers=admin_headers,
            json={
                "make": f"Toyota{i}",
                "model": "Camry",
                "category": "Sedan",
                "price": 25000,
                "quantity": 5,
            },
        )

    response = client.get(
        "/api/vehicles?page=1&limit=2",
        headers=user_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 2
