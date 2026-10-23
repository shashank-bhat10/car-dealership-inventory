from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_vehicle_read_and_purchase_endpoints_require_authentication(client):
    requests = [
        ("GET", "/api/vehicles", None),
        ("GET", "/api/vehicles/search", None),
        ("GET", "/api/vehicles/1", None),
        ("POST", "/api/vehicles/1/purchase", {"quantity": 1}),
    ]

    for method, path, body in requests:
        response = client.request(method, path, json=body)
        assert response.status_code == 401, f"{method} {path} was not protected"
