"""Regression tests against persistent SQLite or the configured test database."""
from concurrent.futures import ThreadPoolExecutor

import pytest
from fastapi import HTTPException

from app.models.vehicle import Vehicle
from app.routers.vehicles import purchase_vehicle, restock_vehicle
from app.schemas.vehicle import InventoryQuantity
from tests.conftest import TestingSessionLocal


@pytest.fixture
def vehicle_id(client, admin_headers):
    response = client.post('/api/vehicles', headers=admin_headers, json={
        'make': 'Toyota', 'model': 'Camry', 'category': 'Sedan',
        'price': 25000, 'quantity': 1,
    })
    assert response.status_code == 201
    return response.json()['id']


def test_purchase_checks_database_stock_not_stale_session(vehicle_id):
    with TestingSessionLocal() as first, TestingSessionLocal() as second:
        cached = second.get(Vehicle, vehicle_id)
        purchase_vehicle(vehicle_id, InventoryQuantity(quantity=1), first, None)
        assert cached.quantity == 1  # Another request has already sold this unit.
        with pytest.raises(HTTPException) as error:
            purchase_vehicle(vehicle_id, InventoryQuantity(quantity=1), second, None)
        assert error.value.status_code == 400


def test_restock_preserves_another_sessions_increment(vehicle_id):
    with TestingSessionLocal() as first, TestingSessionLocal() as second:
        cached = second.get(Vehicle, vehicle_id)
        restock_vehicle(vehicle_id, InventoryQuantity(quantity=2), first, None)
        assert cached.quantity == 1
        result = restock_vehicle(vehicle_id, InventoryQuantity(quantity=3), second, None)
        assert result['vehicle'].quantity == 6


def test_concurrent_buyers_cannot_sell_one_unit_twice(client, user_headers, vehicle_id):
    def buy(_):
        return client.post(f'/api/vehicles/{vehicle_id}/purchase',
                           headers=user_headers, json={'quantity': 1}).status_code

    with ThreadPoolExecutor(max_workers=4) as pool:
        statuses = list(pool.map(buy, range(4)))
    assert sorted(statuses) == [200, 400, 400, 400]
    assert client.get(f'/api/vehicles/{vehicle_id}', headers=user_headers).json()['quantity'] == 0


@pytest.mark.parametrize('payload', [{'make': '   '}, {'price': 1.001}, {'price': 100000000}, {'quantity': True}])
def test_create_rejects_invalid_fields(client, admin_headers, payload):
    data = dict(make='Toyota', model='Camry', category='Sedan', price=25000, quantity=1)
    assert client.post('/api/vehicles', headers=admin_headers, json=data | payload).status_code == 422


@pytest.mark.parametrize('field', ['make', 'model', 'category', 'price', 'quantity'])
def test_update_rejects_explicit_null(client, admin_headers, vehicle_id, field):
    assert client.put(f'/api/vehicles/{vehicle_id}', headers=admin_headers,
                      json={field: None}).status_code == 422


@pytest.mark.parametrize('query', ['page=0', 'limit=0', 'limit=101', 'min_price=-1', 'min_price=10&max_price=1'])
def test_list_rejects_invalid_filters(client, user_headers, query):
    assert client.get(f'/api/vehicles?{query}', headers=user_headers).status_code == 422


@pytest.mark.parametrize('action', ['purchase', 'restock'])
@pytest.mark.parametrize('quantity', [True, '1', 1.5])
def test_inventory_requires_integer_quantity(client, admin_headers, vehicle_id, action, quantity):
    assert client.post(f'/api/vehicles/{vehicle_id}/{action}', headers=admin_headers,
                       json={'quantity': quantity}).status_code == 422
