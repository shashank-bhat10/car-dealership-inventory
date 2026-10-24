from types import SimpleNamespace

import pytest
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.models.vehicle import Vehicle
from app.seed_demo import seed_demo_inventory


def make_database(tmp_path):
    database_engine = create_engine(f"sqlite:///{tmp_path / 'seed-test.db'}")
    Base.metadata.create_all(database_engine)
    return database_engine, sessionmaker(bind=database_engine)


def test_seed_demo_inventory_adds_a_small_catalog_with_a_sold_out_vehicle(tmp_path):
    database_engine, session_factory = make_database(tmp_path)

    inserted = seed_demo_inventory(
        environment="development",
        database_engine=database_engine,
        session_factory=session_factory,
    )

    with session_factory() as db:
        vehicles = db.scalars(select(Vehicle).order_by(Vehicle.id)).all()

    assert inserted == 4
    assert len(vehicles) == 4
    assert any(vehicle.quantity == 0 for vehicle in vehicles)
    database_engine.dispose()


def test_seed_demo_inventory_refuses_to_change_a_non_empty_catalog(tmp_path):
    database_engine, session_factory = make_database(tmp_path)
    with session_factory.begin() as db:
        db.add(Vehicle(make="Existing", model="Vehicle", category="Sedan", price=10000, quantity=1))

    with pytest.raises(RuntimeError, match="already contains vehicles"):
        seed_demo_inventory(
            environment="development",
            database_engine=database_engine,
            session_factory=session_factory,
        )

    with session_factory() as db:
        assert len(db.scalars(select(Vehicle)).all()) == 1
    database_engine.dispose()


def test_seed_demo_inventory_refuses_non_development_environment(tmp_path):
    database_engine, session_factory = make_database(tmp_path)

    with pytest.raises(RuntimeError, match="development environment"):
        seed_demo_inventory(
            environment="production",
            database_engine=database_engine,
            session_factory=session_factory,
        )

    database_engine.dispose()


def test_seed_demo_inventory_refuses_non_sqlite_database(tmp_path):
    database_engine, session_factory = make_database(tmp_path)
    non_sqlite_engine = SimpleNamespace(
        dialect=SimpleNamespace(name="postgresql")
    )

    with pytest.raises(RuntimeError, match="SQLite database"):
        seed_demo_inventory(
            environment="development",
            database_engine=non_sqlite_engine,
            session_factory=session_factory,
        )

    database_engine.dispose()
