"""Add a small, clearly marked demo catalog to a fresh local SQLite database."""

from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings
from app.database import SessionLocal, engine
from app.models.vehicle import Vehicle


DEMO_VEHICLES = (
    {
        "make": "Toyota",
        "model": "Camry Hybrid",
        "category": "Sedan",
        "price": Decimal("3349000.00"),
        "quantity": 3,
    },
    {
        "make": "Honda",
        "model": "CR-V",
        "category": "SUV",
        "price": Decimal("3125000.00"),
        "quantity": 2,
    },
    {
        "make": "Hyundai",
        "model": "Ioniq 5",
        "category": "Electric",
        "price": Decimal("4250000.00"),
        "quantity": 1,
    },
    {
        "make": "Mazda",
        "model": "Mazda3",
        "category": "Hatchback",
        "price": Decimal("1975000.00"),
        "quantity": 0,
    },
)


def seed_demo_inventory(
    *,
    environment: str | None = None,
    database_engine: Engine | None = None,
    session_factory: sessionmaker[Session] | None = None,
) -> int:
    """Seed only an empty development SQLite catalog; never overwrite inventory."""
    current_environment = settings.ENVIRONMENT if environment is None else environment
    target_engine = database_engine or engine
    target_session_factory = session_factory or SessionLocal

    if current_environment.lower() != "development":
        raise RuntimeError("Demo inventory can only be added in a development environment.")
    if target_engine.dialect.name != "sqlite":
        raise RuntimeError("Demo inventory can only be added to a local SQLite database.")

    with target_session_factory.begin() as db:
        existing_count = db.scalar(select(func.count()).select_from(Vehicle))
        if existing_count:
            raise RuntimeError(
                "The catalog already contains vehicles; no demo data was added."
            )

        db.add_all(Vehicle(**vehicle) for vehicle in DEMO_VEHICLES)

    return len(DEMO_VEHICLES)


def main() -> None:
    try:
        count = seed_demo_inventory()
    except RuntimeError as error:
        raise SystemExit(str(error)) from error
    print(f"Added {count} demo vehicles to the local development database.")


if __name__ == "__main__":
    main()
