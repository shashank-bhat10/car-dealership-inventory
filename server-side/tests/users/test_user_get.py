from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_admin_can_get_user(admin_headers):
    # First get the list of users.
    list_response = client.get(
        "/api/users",
        headers=admin_headers,
    )

    assert list_response.status_code == 200

    users = list_response.json()

    admin = next(
        user
        for user in users
        if user["email"] == "admin@example.com"
    )

    user_id = admin["id"]

    # Now get the individual user.
    response = client.get(
        f"/api/users/{user_id}",
        headers=admin_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == user_id
    assert data["username"] == "adminuser"
    assert data["email"] == "admin@example.com"
    assert data["role"] == "ADMIN"


def test_admin_get_user_not_found(admin_headers):
    response = client.get(
        "/api/users/999999",
        headers=admin_headers,
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"