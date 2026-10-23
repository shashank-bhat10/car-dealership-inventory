def test_root_endpoint(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Car Dealership Inventory API is running"
    }


def test_database_test_endpoint(client):
    response = client.get("/db-test")

    assert response.status_code == 200
    assert response.json() == {
        "message": "PostgreSQL connection successful"
    }

def test_database_test_endpoint_failure(monkeypatch, client):
    from app import main

    class FakeEngine:
        def connect(self):
            raise Exception("Database connection failed")

    monkeypatch.setattr(main, "engine", FakeEngine())

    response = client.get("/db-test")

    assert response.status_code == 200
    assert response.json()["message"] == "PostgreSQL connection failed"
    assert response.json()["error"] == "Database connection failed"