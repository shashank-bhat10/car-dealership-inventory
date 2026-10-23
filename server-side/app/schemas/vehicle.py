from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class VehicleCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    make: str = Field(min_length=1, max_length=50)
    model: str = Field(min_length=1, max_length=50)
    category: str = Field(min_length=1, max_length=50)
    price: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    quantity: int = Field(ge=0, strict=True)


class VehicleUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    make: str | None = Field(default=None, min_length=1, max_length=50)
    model: str | None = Field(default=None, min_length=1, max_length=50)
    category: str | None = Field(default=None, min_length=1, max_length=50)
    price: Decimal | None = Field(default=None, gt=0, max_digits=10, decimal_places=2)
    quantity: int | None = Field(default=None, ge=0, strict=True)

    @field_validator('make', 'model', 'category', 'price', 'quantity', mode='before')
    @classmethod
    def reject_explicit_null(cls, value):
        # Omitted fields remain unchanged; supplied fields cannot clear required data.
        if value is None:
            raise ValueError('Vehicle fields cannot be null')
        return value

class InventoryQuantity(BaseModel):
    quantity: int = Field(gt=0, strict=True)


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
