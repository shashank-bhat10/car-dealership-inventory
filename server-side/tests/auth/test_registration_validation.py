import pytest


@pytest.mark.parametrize('changes', [
    {'username': '   '}, {'password': ''}, {'password': 'short'},
    {'password': 'a' * 73}, {'password': '界' * 25},
])
def test_registration_rejects_invalid_input(client, changes):
    response = client.post('/api/auth/register', json={
        'username': 'shashank', 'email': 'shashank@example.com',
        'password': 'Example123!', **changes,
    })
    assert response.status_code == 422
