def test_admin_can_update_user(admin_headers, user_headers, client):
    # Get normal user's ID
    me_response = client.get(
        "/api/auth/me",
        headers=user_headers,
    )

    assert me_response.status_code == 200

    user_id = me_response.json()["id"]

    # Admin updates the user
    response = client.patch(
        f"/api/users/{user_id}",
        headers=admin_headers,
        json={
            "username": "updateduser",
            "email": "updated@example.com",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "User updated successfully"
    assert data["user"]["id"] == user_id
    assert data["user"]["username"] == "updateduser"
    assert data["user"]["email"] == "updated@example.com"


def test_admin_can_update_only_username(
    admin_headers,
    user_headers,
    client,
):
    me_response = client.get(
        "/api/auth/me",
        headers=user_headers,
    )

    assert me_response.status_code == 200

    user_id = me_response.json()["id"]

    response = client.patch(
        f"/api/users/{user_id}",
        headers=admin_headers,
        json={
            "username": "newusername",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["user"]["username"] == "newusername"
    assert data["user"]["email"] == "user@example.com"


def test_admin_can_update_only_email(
    admin_headers,
    user_headers,
    client,
):
    me_response = client.get(
        "/api/auth/me",
        headers=user_headers,
    )

    assert me_response.status_code == 200

    user_id = me_response.json()["id"]

    response = client.patch(
        f"/api/users/{user_id}",
        headers=admin_headers,
        json={
            "email": "newemail@example.com",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["user"]["username"] == "normaluser"
    assert data["user"]["email"] == "newemail@example.com"


def test_admin_cannot_update_nonexistent_user(
    admin_headers,
    client,
):
    response = client.patch(
        "/api/users/999999",
        headers=admin_headers,
        json={
            "username": "updateduser",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


def test_normal_user_cannot_update_user(
    user_headers,
    client,
):
    me_response = client.get(
        "/api/auth/me",
        headers=user_headers,
    )

    assert me_response.status_code == 200

    user_id = me_response.json()["id"]

    response = client.patch(
        f"/api/users/{user_id}",
        headers=user_headers,
        json={
            "username": "hacker",
        },
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"


def test_admin_cannot_use_duplicate_username(
    admin_headers,
    user_headers,
    client,
):
    me_response = client.get(
        "/api/auth/me",
        headers=user_headers,
    )

    assert me_response.status_code == 200

    user_id = me_response.json()["id"]

    # Create another user
    register_response = client.post(
        "/api/auth/register",
        json={
            "username": "anotheruser",
            "email": "another@example.com",
            "password": "Another@123",
        },
    )

    assert register_response.status_code == 201

    # Try to use the existing username
    response = client.patch(
        f"/api/users/{user_id}",
        headers=admin_headers,
        json={
            "username": "anotheruser",
        },
    )

    assert response.status_code == 409
    assert response.json()["detail"] == "Username already exists"


def test_admin_cannot_use_duplicate_email(
    admin_headers,
    user_headers,
    client,
):
    me_response = client.get(
        "/api/auth/me",
        headers=user_headers,
    )

    assert me_response.status_code == 200

    user_id = me_response.json()["id"]

    # Create another user
    register_response = client.post(
        "/api/auth/register",
        json={
            "username": "anotheruser",
            "email": "another@example.com",
            "password": "Another@123",
        },
    )

    assert register_response.status_code == 201

    # Try to use the existing email
    response = client.patch(
        f"/api/users/{user_id}",
        headers=admin_headers,
        json={
            "email": "another@example.com",
        },
    )

    assert response.status_code == 409
    assert response.json()["detail"] == "Email already exists"