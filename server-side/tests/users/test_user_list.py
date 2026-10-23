from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_admin_can_list_users(admin_headers):
    response = client.get(
        "/api/users",
        headers=admin_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)