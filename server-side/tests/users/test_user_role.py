def test_admin_can_promote_user_to_admin(admin_headers, user_headers, client):
    # Get the normal user's information
    me_response = client.get(
        "/api/auth/me",
        headers=user_headers,
    )

    assert me_response.status_code == 200

    user_id = me_response.json()["id"]

    # Admin promotes the user
    response = client.patch(
        f"/api/users/{user_id}/role",
        headers=admin_headers,
        json={
            "role": "ADMIN",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "User role updated successfully"
    assert data["user"]["id"] == user_id
    assert data["user"]["role"] == "ADMIN"


def test_admin_can_demote_user_to_user(admin_headers, user_headers, client):
    me_response = client.get(
        "/api/auth/me",
        headers=user_headers,
    )

    assert me_response.status_code == 200

    user_id = me_response.json()["id"]

    # Promote first
    promote_response = client.patch(
        f"/api/users/{user_id}/role",
        headers=admin_headers,
        json={
            "role": "ADMIN",
        },
    )

    assert promote_response.status_code == 200

    # Demote back to USER
    response = client.patch(
        f"/api/users/{user_id}/role",
        headers=admin_headers,
        json={
            "role": "USER",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "User role updated successfully"
    assert data["user"]["id"] == user_id
    assert data["user"]["role"] == "USER"


def test_admin_cannot_change_nonexistent_user_role(admin_headers, client):
    response = client.patch(
        "/api/users/999999/role",
        headers=admin_headers,
        json={
            "role": "ADMIN",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


def test_normal_user_cannot_change_user_role(user_headers, client):
    me_response = client.get(
        "/api/auth/me",
        headers=user_headers,
    )

    assert me_response.status_code == 200

    user_id = me_response.json()["id"]

    response = client.patch(
        f"/api/users/{user_id}/role",
        headers=user_headers,
        json={
            "role": "ADMIN",
        },
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"


def test_invalid_role_is_rejected(admin_headers, user_headers, client):
    me_response = client.get(
        "/api/auth/me",
        headers=user_headers,
    )

    assert me_response.status_code == 200

    user_id = me_response.json()["id"]

    response = client.patch(
        f"/api/users/{user_id}/role",
        headers=admin_headers,
        json={
            "role": "INVALID",
        },
    )

    assert response.status_code == 422