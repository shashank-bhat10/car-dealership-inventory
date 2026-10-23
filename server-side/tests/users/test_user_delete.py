def test_admin_can_delete_user(admin_headers, user_headers, client):
    # Get the normal user's ID
    me_response = client.get(
        "/api/auth/me",
        headers=user_headers,
    )

    assert me_response.status_code == 200

    user_id = me_response.json()["id"]

    # Admin deletes the user
    response = client.delete(
        f"/api/users/{user_id}",
        headers=admin_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "User deleted successfully"
    assert data["user"]["id"] == user_id


def test_deleted_user_cannot_be_found(admin_headers, user_headers, client):
    # Get the normal user's ID
    me_response = client.get(
        "/api/auth/me",
        headers=user_headers,
    )

    assert me_response.status_code == 200

    user_id = me_response.json()["id"]

    # Delete user
    delete_response = client.delete(
        f"/api/users/{user_id}",
        headers=admin_headers,
    )

    assert delete_response.status_code == 200

    # Try to get deleted user
    response = client.get(
        f"/api/users/{user_id}",
        headers=admin_headers,
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


def test_admin_cannot_delete_nonexistent_user(admin_headers, client):
    response = client.delete(
        "/api/users/999999",
        headers=admin_headers,
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


def test_normal_user_cannot_delete_user(user_headers, client):
    me_response = client.get(
        "/api/auth/me",
        headers=user_headers,
    )

    assert me_response.status_code == 200

    user_id = me_response.json()["id"]

    response = client.delete(
        f"/api/users/{user_id}",
        headers=user_headers,
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"


def test_admin_can_delete_user_from_user_list(
    admin_headers,
    user_headers,
    client,
):
    # Get normal user's ID
    me_response = client.get(
        "/api/auth/me",
        headers=user_headers,
    )

    assert me_response.status_code == 200

    user_id = me_response.json()["id"]

    # Confirm user exists in list
    list_response = client.get(
        "/api/users",
        headers=admin_headers,
    )

    assert list_response.status_code == 200

    users_before = list_response.json()

    assert any(
        user["id"] == user_id
        for user in users_before
    )

    # Delete user
    delete_response = client.delete(
        f"/api/users/{user_id}",
        headers=admin_headers,
    )

    assert delete_response.status_code == 200

    # Confirm user no longer appears
    list_response = client.get(
        "/api/users",
        headers=admin_headers,
    )

    assert list_response.status_code == 200

    users_after = list_response.json()

    assert not any(
        user["id"] == user_id
        for user in users_after
    )