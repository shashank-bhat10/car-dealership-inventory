def create_test_user(client):
    response = client.post(
        "/api/auth/register",
        json={
            "username": "loginuser",
            "email": "login@example.com",
            "password": "Test@123",
        },
    )

    assert response.status_code == 201


def test_login_user(client):
    create_test_user(client)

    response = client.post(
        "/api/auth/login",
        json={
            "email": "login@example.com",
            "password": "Test@123",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert len(data["access_token"]) > 0
