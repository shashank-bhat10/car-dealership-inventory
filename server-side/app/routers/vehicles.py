from decimal import Decimal
from app.core.dependencies import get_current_admin
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.vehicle import Vehicle
from app.schemas.vehicle import (
    InventoryQuantity,
    InventoryResponse,
    VehicleCreate,
    VehicleResponse,
    VehicleUpdate,
)


router = APIRouter(
    prefix="/api/vehicles",
    tags=["Vehicles"],
)


@router.post(
    "",
    response_model=VehicleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_vehicle(
    vehicle_data: VehicleCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    vehicle = Vehicle(
        make=vehicle_data.make,
        model=vehicle_data.model,
        category=vehicle_data.category,
        price=vehicle_data.price,
        quantity=vehicle_data.quantity,
    )

    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)

    return vehicle


@router.get(
    "",
    response_model=list[VehicleResponse],
)
def list_vehicles(
    make: str | None = None,
    model: str | None = None,
    category: str | None = None,
    min_price: Decimal | None = None,
    max_price: Decimal | None = None,
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    query = select(Vehicle)

    if make is not None:
        query = query.where(Vehicle.make == make)

    if model is not None:
        query = query.where(Vehicle.model == model)

    if category is not None:
        query = query.where(Vehicle.category == category)

    if min_price is not None:
        query = query.where(Vehicle.price >= min_price)

    if max_price is not None:
        query = query.where(Vehicle.price <= max_price)

    offset = (page - 1) * limit

    query = query.offset(offset).limit(limit)

    vehicles = db.scalars(query).all()

    return vehicles
  

@router.get(
    "/{vehicle_id}",
    response_model=VehicleResponse,
)
def get_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
):
    vehicle = db.get(Vehicle, vehicle_id)

    if vehicle is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )

    return vehicle


@router.post(
    "/{vehicle_id}/purchase",
    response_model=InventoryResponse,
)
def purchase_vehicle(
    vehicle_id: int,
    purchase_data: InventoryQuantity,
    db: Session = Depends(get_db),
):
    vehicle = db.get(Vehicle, vehicle_id)

    if vehicle is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )

    if purchase_data.quantity > vehicle.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient vehicle quantity",
        )

    vehicle.quantity -= purchase_data.quantity

    db.commit()
    db.refresh(vehicle)

    return {
        "message": "Vehicle purchased successfully",
        "vehicle": vehicle,
    }


@router.put(
    "/{vehicle_id}",
    response_model=VehicleResponse,
)
def update_vehicle(
    vehicle_id: int,
    vehicle_data: VehicleUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    vehicle = db.get(Vehicle, vehicle_id)

    if vehicle is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )

    update_data = vehicle_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(vehicle, field, value)

    db.commit()
    db.refresh(vehicle)

    return vehicle

@router.delete(
    "/{vehicle_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    vehicle = db.get(Vehicle, vehicle_id)

    if vehicle is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )

    db.delete(vehicle)
    db.commit()

    return None

@router.post(
    "/{vehicle_id}/restock",
    response_model=InventoryResponse,
)
def restock_vehicle(
    vehicle_id: int,
    restock_data: InventoryQuantity,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    vehicle = db.get(Vehicle, vehicle_id)

    if vehicle is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )

    vehicle.quantity += restock_data.quantity

    db.commit()
    db.refresh(vehicle)

    return {
        "message": "Vehicle restocked successfully",
        "vehicle": vehicle,
    }