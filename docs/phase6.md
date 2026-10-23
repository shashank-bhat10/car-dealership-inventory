# Phase 6 Setup Plan — Inventory Logic 🚗

Phase 6 builds on the completed **Vehicle CRUD from Phase 5** and introduces actual inventory movement.

## Current Baseline

    Phase 1  ✅ PostgreSQL
    Phase 2  ✅ FastAPI + PostgreSQL
    Phase 3  ✅ User + Vehicle Models
    Phase 4  ✅ Authentication + JWT
    Phase 5  ✅ Vehicle CRUD + Search
    Phase 6  🚧 Inventory Logic

**Before Phase 6:** 43 tests passing

**After Phase 6:** 56 tests passing

**Phase 6 added:** 13 tests

---

# Phase 6 Objective

Implement two inventory operations:

    PURCHASE
    RESTOCK

The inventory flow will be:

                    Vehicle Inventory
                           │
              ┌────────────┴────────────┐
              ↓                         ↓
         PURCHASE                    RESTOCK
              ↓                         ↓
       Quantity − N                Quantity + N
              ↓                         ↓
        Validate stock             Validate quantity
              │                         │
              └────────────┬────────────┘
                           ↓
                       updated_at

The key distinction is:

> **Phase 5 manages vehicle records. Phase 6 manages inventory movement.**

---

# Step 1 — Create Inventory Request Schema

Create a reusable Pydantic schema:

    class InventoryQuantity(BaseModel):
        quantity: int = Field(gt=0)

This gives us:

    quantity = 1      ✅
    quantity = 10     ✅
    quantity = 0      ❌
    quantity = -5     ❌

Both purchase and restock will use the same validation.

---

# Step 2 — Create Inventory Response Schema

Create:

    class InventoryResponse(BaseModel):
        message: str
        vehicle: VehicleResponse

This ensures FastAPI can properly serialize the SQLAlchemy `Vehicle` object.

Example response:

    {
        "message": "Vehicle purchased successfully",
        "vehicle": {
            "id": 1,
            "make": "Toyota",
            "model": "Camry",
            "quantity": 3
        }
    }

---

# Step 3 — Purchase Vehicle

Implement:

    POST /api/vehicles/{vehicle_id}/purchase

Request:

    {
        "quantity": 2
    }

If the current inventory is:

    quantity = 5

The result will be:

    5 - 2 = 3

Response:

    {
        "message": "Vehicle purchased successfully",
        "vehicle": {
            "id": 1,
            "make": "Toyota",
            "model": "Camry",
            "quantity": 3
        }
    }

---

# Step 4 — Prevent Over-Purchasing

Business rule:

    requested quantity <= available quantity

For example:

    Available = 3
    Requested = 5

Return:

    400 Bad Request

with:

    {
        "detail": "Insufficient vehicle quantity"
    }

The inventory must remain unchanged:

    quantity = 3

---

# Step 5 — Purchase Validation

Reject:

    {
        "quantity": 0
    }

and:

    {
        "quantity": -2
    }

Expected:

    422 Unprocessable Entity

Validation is handled by:

    Field(gt=0)

---

# Step 6 — Purchase Vehicle Not Found

Request:

    POST /api/vehicles/999999/purchase

Expected:

    404 Not Found

Response:

    {
        "detail": "Vehicle not found"
    }

---

# Step 7 — Verify Purchase `updated_at`

Before purchase:

    quantity = 5
    updated_at = T1

After purchase:

    quantity = 3
    updated_at = T2

Verify:

    T2 != T1

This confirms that SQLAlchemy's existing `onupdate` behavior works correctly.

---

# Step 8 — Create Restock Tests

Create:

    tests/
    └── vehicles/
        ├── test_purchase_vehicle.py
        └── test_restock_vehicle.py

Start with a failing test for:

    POST /api/vehicles/{vehicle_id}/restock

---

# Step 9 — Restock Vehicle

Implement:

    POST /api/vehicles/{vehicle_id}/restock

Request:

    {
        "quantity": 10
    }

If the current quantity is:

    5

The result will be:

    5 + 10 = 15

Response:

    {
        "message": "Vehicle restocked successfully",
        "vehicle": {
            "id": 1,
            "make": "Toyota",
            "model": "Camry",
            "quantity": 15
        }
    }

---

# Step 10 — Test Purchase + Restock Together

Verify that inventory can move in both directions:

    Initial
    10
     ↓
    Purchase 4
     ↓
    6
     ↓
    Restock 7
     ↓
    13

This verifies that the two operations work correctly together.

---

# Step 11 — Restock Validation

Reject:

    {
        "quantity": 0
    }

and:

    {
        "quantity": -3
    }

Expected:

    422 Unprocessable Entity

---

# Step 12 — Restock Vehicle Not Found

Request:

    POST /api/vehicles/999999/restock

Expected:

    404 Not Found

Response:

    {
        "detail": "Vehicle not found"
    }

---

# Step 13 — Verify Restock `updated_at`

Before restock:

    quantity = 5
    updated_at = T1

After restock:

    quantity = 10
    updated_at = T2

Verify:

    T2 != T1

---

# Step 14 — Run Phase 6 Tests

## Purchase Tests

Run:

    pytest tests/vehicles/test_purchase_vehicle.py -v

Expected:

    7 passed

## Restock Tests

Run:

    pytest tests/vehicles/test_restock_vehicle.py -v

Expected:

    6 passed

---

# Step 15 — Run Entire Test Suite

Run:

    pytest tests -v

Expected:

    56 passed

This confirms that Phase 6 has not broken Phases 1–5.

---

# Step 16 — Git Commit

Check the current Git status:

    git status

Stage the changes:

    git add .

Commit the Phase 6 implementation:

    git commit -m "feat: implement inventory purchase and restock logic"

Finally, verify the working tree:

    git status

Expected:

    nothing to commit, working tree clean

---

# Phase 6 Test Plan

| Feature | Tests |
|---|---:|
| Purchase successfully | 1 |
| Purchase entire stock | 1 |
| Prevent over-purchasing | 1 |
| Purchase quantity = 0 | 1 |
| Purchase negative quantity | 1 |
| Purchase vehicle not found | 1 |
| Purchase `updated_at` | 1 |
| Restock successfully | 1 |
| Restock after purchase | 1 |
| Restock quantity = 0 | 1 |
| Restock negative quantity | 1 |
| Restock vehicle not found | 1 |
| Restock `updated_at` | 1 |
| **Total Phase 6** | **13** |

---

# Phase 6 Completion Criteria

## Purchase

- [ ] InventoryQuantity schema
- [ ] InventoryResponse schema
- [ ] Purchase endpoint
- [ ] Purchase decreases quantity
- [ ] Purchase entire stock allowed
- [ ] Over-purchasing prevented
- [ ] Purchase quantity validation
- [ ] Purchase 404 handling
- [ ] Purchase `updated_at` verified

## Restock

- [ ] Restock endpoint
- [ ] Restock increases quantity
- [ ] Restock after purchase verified
- [ ] Restock quantity validation
- [ ] Restock 404 handling
- [ ] Restock `updated_at` verified

## Testing & Git

- [ ] 13 Phase 6 tests passing
- [ ] All previous tests passing
- [ ] 56 total tests passing
- [ ] Git commit created

---

# Final Phase 6 Architecture

                    FastAPI
                       │
                       ↓
              Vehicle Inventory API
                       │
          ┌────────────┴────────────┐
          ↓                         ↓
      Purchase                   Restock
          │                         │
          ↓                         ↓
   Validate quantity        Validate quantity
          │                         │
          ↓                         ↓
   Check availability        Find vehicle
          │                         │
          ↓                         ↓
    quantity -= N             quantity += N
          │                         │
          └────────────┬────────────┘
                       ↓
                  db.commit()
                       ↓
                  updated_at
                       ↓
                 PostgreSQL

---

# Phase 6 End Result

Phase 6 introduces the actual dealership inventory business logic.

**Phase 5:**

    Vehicle CRUD
    Create → Read → Update → Delete → Search

**Phase 6:**

    Inventory Movement
    Purchase → Quantity decreases
    Restock → Quantity increases

After completing Phase 6, the system will be ready for:

**Phase 7 — Authorization: USER vs ADMIN**