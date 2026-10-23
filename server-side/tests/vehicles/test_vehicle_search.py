import pytest
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


@pytest.mark.parametrize('endpoint', ['/api/vehicles', '/api/vehicles/search'])
def test_stock_filter_applies_before_pagination(endpoint, admin_headers, user_headers):
    sold_out = create_vehicle(admin_headers, make='Toyota', model='Empty',
                              category='Sedan', price=20000, quantity=0)
    available = create_vehicle(admin_headers, make='Toyota', model='Available',
                               category='Sedan', price=21000, quantity=1)
    response = client.get(endpoint, headers=user_headers,
                          params={'in_stock': 'true', 'limit': 1})
    assert response.status_code == 200
    assert [vehicle['id'] for vehicle in response.json()] == [available['id']]
    unfiltered = client.get(endpoint, headers=user_headers,
                            params={'in_stock': 'false', 'limit': 1})
    assert [vehicle['id'] for vehicle in unfiltered.json()] == [sold_out['id']]
    assert client.get(endpoint, headers=user_headers,
                      params={'in_stock': 'true', 'limit': 1, 'page': 2}).json() == []


def create_vehicle(headers, *, make, model, category, price, quantity):
    response = client.post(
        "/api/vehicles",
        headers=headers,
        json={
            "make": make,
            "model": model,
            "category": category,
            "price": price,
            "quantity": quantity,
        },
    )
    assert response.status_code == 201
    return response.json()


def test_search_vehicles_by_make_model_category_and_price_range(
    admin_headers, user_headers
):
    create_vehicle(
        admin_headers,
        make="Toyota",
        model="Camry",
        category="Sedan",
        price=25000,
        quantity=5,
    )
    create_vehicle(
        admin_headers,
        make="Toyota",
        model="RAV4",
        category="SUV",
        price=32000,
        quantity=2,
    )
    create_vehicle(
        admin_headers,
        make="Honda",
        model="Civic",
        category="Sedan",
        price=22000,
        quantity=3,
    )

    response = client.get(
        "/api/vehicles/search",
        params={
            "make": "toyota",
            "model": "cam",
            "category": "sedan",
            "min_price": 20000,
            "max_price": 30000,
        },
        headers=user_headers,
    )

    assert response.status_code == 200
    results = response.json()
    assert len(results) == 1
    assert results[0]["make"] == "Toyota"
    assert results[0]["model"] == "Camry"


def test_search_vehicles_by_free_text_matches_make_or_model(
    admin_headers, user_headers
):
    create_vehicle(
        admin_headers,
        make="Toyota",
        model="Camry",
        category="Sedan",
        price=25000,
        quantity=5,
    )

    response = client.get(
        "/api/vehicles/search?q=toy",
        headers=user_headers,
    )

    assert response.status_code == 200
    assert [vehicle["model"] for vehicle in response.json()] == ["Camry"]


def test_search_rejects_an_inverted_price_range(user_headers):
    response = client.get(
        "/api/vehicles/search?min_price=30000&max_price=20000",
        headers=user_headers,
    )

    assert response.status_code == 422
    assert response.json()["detail"] == (
        "min_price must be less than or equal to max_price"
    )
