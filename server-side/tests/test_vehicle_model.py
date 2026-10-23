from app.models.vehicle import Vehicle
from datetime import datetime
import pytest
from sqlalchemy.exc import IntegrityError


def test_create_vehicle():
    vehicle = Vehicle(
        make="Toyota",
        model="Camry",
        category="Sedan",
        price=25000,
        quantity=5,
    )

    assert vehicle.make == "Toyota"
    assert vehicle.model == "Camry"
    assert vehicle.category == "Sedan"
    assert vehicle.price == 25000
    assert vehicle.quantity == 5


def test_save_vehicle_to_database(db_session):
    vehicle = Vehicle(
        make="Honda",
        model="Civic",
        category="Sedan",
        price=22000,
        quantity=3,
    )

    db_session.add(vehicle)
    db_session.commit()
    db_session.refresh(vehicle)

    assert vehicle.id is not None
    assert vehicle.created_at is not None
    assert vehicle.updated_at is not None

def test_vehicle_make_is_required(db_session):
    vehicle = Vehicle(
        model="Camry",
        category="Sedan",
        price=25000,
        quantity=5,
    )

    db_session.add(vehicle)

    with pytest.raises(IntegrityError):
        db_session.commit()

    db_session.rollback()


def test_vehicle_model_is_required(db_session):
    vehicle = Vehicle(
        make="Toyota",
        category="Sedan",
        price=25000,
        quantity=5,
    )

    db_session.add(vehicle)

    with pytest.raises(IntegrityError):
        db_session.commit()

    db_session.rollback()


def test_vehicle_category_is_required(db_session):
    vehicle = Vehicle(
        make="Toyota",
        model="Camry",
        price=25000,
        quantity=5,
    )

    db_session.add(vehicle)

    with pytest.raises(IntegrityError):
        db_session.commit()

    db_session.rollback()


def test_vehicle_price_is_required(db_session):
    vehicle = Vehicle(
        make="Toyota",
        model="Camry",
        category="Sedan",
        quantity=5,
    )

    db_session.add(vehicle)

    with pytest.raises(IntegrityError):
        db_session.commit()

    db_session.rollback()


def test_vehicle_quantity_is_required(db_session):
    vehicle = Vehicle(
        make="Toyota",
        model="Camry",
        category="Sedan",
        price=25000,
    )

    db_session.add(vehicle)

    with pytest.raises(IntegrityError):
        db_session.commit()

    db_session.rollback()

def test_vehicle_quantity_cannot_be_negative(db_session):
    vehicle = Vehicle(
        make="Toyota",
        model="Camry",
        category="Sedan",
        price=25000,
        quantity=-1,
    )

    db_session.add(vehicle)

    with pytest.raises(IntegrityError):
        db_session.commit()

    db_session.rollback()

def test_vehicle_price_must_be_positive(db_session):
    vehicle = Vehicle(
        make="Toyota",
        model="Camry",
        category="Sedan",
        price=0,
        quantity=5,
    )

    db_session.add(vehicle)

    with pytest.raises(IntegrityError):
        db_session.commit()

    db_session.rollback()