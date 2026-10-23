def create_test_user(client):
    response = client.post(
        "/api/auth/register",
        json={
            "username": "meuser",
            "email": "me@example.com",
            "password": "Test@123",
        },
    )

    assert response.status_code == 201


def login_test_user(client):
    response = client.post(
        "/api/auth/login",
        json={
            "email": "me@example.com",
            "password": "Test@123",
        },
    )

    assert response.status_code == 200

    return response.json()["access_token"]


def test_get_current_user(client):
    create_test_user(client)

    token = login_test_user(client)

    response = client.get(
        "/api/auth/me",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["username"] == "meuser"
    assert data["email"] == "me@example.com"
    assert data["role"] == "USER"

    assert "password" not in data
    assert "password_hash" not in data

def test_get_current_user_without_token(client):
    response = client.get("/api/auth/me")

    assert response.status_code == 401

def test_get_current_user_with_invalid_token(client):
    response = client.get(
        "/api/auth/me",
        headers={
            "Authorization": "Bearer invalid-token",
        },
    )

    assert response.status_code == 401
