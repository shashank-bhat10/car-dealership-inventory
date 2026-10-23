from datetime import UTC, datetime

from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from sqlalchemy import CheckConstraint, DateTime, Numeric, String


class Vehicle(Base):
    __tablename__ = "vehicles"

    __table_args__ = (
    CheckConstraint("quantity >= 0", name="check_vehicle_quantity_non_negative"),
    CheckConstraint("price > 0", name="check_vehicle_price_positive"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)

    make: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    model: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    category: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    price: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    quantity: Mapped[int] = mapped_column(
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

