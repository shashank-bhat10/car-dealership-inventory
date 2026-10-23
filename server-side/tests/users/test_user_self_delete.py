def test_admin_cannot_delete_themselves(admin_headers, client):
    me_response = client.get(
        "/api/auth/me",
        headers=admin_headers,
    )

    assert me_response.status_code == 200

    admin_id = me_response.json()["id"]

    response = client.delete(
        f"/api/users/{admin_id}",
        headers=admin_headers,
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Admin cannot delete their own account"