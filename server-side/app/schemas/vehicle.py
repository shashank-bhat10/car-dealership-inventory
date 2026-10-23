from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class VehicleCreate(BaseModel):
    make: str = Field(min_length=1, max_length=50)
    model: str = Field(min_length=1, max_length=50)
    category: str = Field(min_length=1, max_length=50)
    price: Decimal = Field(gt=0)
    quantity: int = Field(ge=0)


class VehicleUpdate(BaseModel):
    make: str | None = Field(default=None, min_length=1, max_length=50)
    model: str | None = Field(default=None, min_length=1, max_length=50)
    category: str | None = Field(default=None, min_length=1, max_length=50)
    price: Decimal | None = Field(default=None, gt=0)
    quantity: int | None = Field(default=None, ge=0)

class InventoryQuantity(BaseModel):
    quantity: int = Field(gt=0)


class VehicleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    make: str
    model: str
    category: str
    price: float
    quantity: int
    created_at: datetime
    updated_at: datetime

class InventoryResponse(BaseModel):
    message: str
    vehicle: VehicleResponse
