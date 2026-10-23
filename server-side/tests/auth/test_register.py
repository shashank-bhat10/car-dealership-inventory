def test_register_user(client):

    response = client.post(
        "/api/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "Test@123",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    assert "password" not in data
    assert "password_hash" not in data


def test_register_duplicate_email(client):
    client.post(
        "/api/auth/register",
        json={
            "username": "firstuser",
            "email": "duplicate@example.com",
            "password": "Test@123",
        },
    )

    response = client.post(
        "/api/auth/register",
        json={
            "username": "seconduser",
            "email": "duplicate@example.com",
            "password": "Test@456",
        },
    )

    assert response.status_code == 409
    assert response.json()["detail"] == "Email already registered"

def test_register_duplicate_username(client):
    client.post(
        "/api/auth/register",
        json={
            "username": "sameuser",
            "email": "first@example.com",
            "password": "Test@123",
        },
    )

    response = client.post(
        "/api/auth/register",
        json={
            "username": "sameuser",
            "email": "second@example.com",
            "password": "Test@456",
        },
    )

    assert response.status_code == 409
    assert response.json()["detail"] == "Username already registered"
