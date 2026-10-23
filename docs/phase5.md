# Phase 5 — Vehicle Inventory API 🚗

Now that authentication is complete, Phase 5 will implement the **core dealership inventory functionality**.

The goal is to build the CRUD API for vehicles while maintaining the same **TDD → implementation → test → commit** workflow used in Phase 4.

---

# Phase 5 Objective

Implement the following endpoints:

    POST   /api/vehicles
    GET    /api/vehicles
    GET    /api/vehicles/{vehicle_id}
    PUT    /api/vehicles/{vehicle_id}
    DELETE /api/vehicles/{vehicle_id}

The complete flow will become:

    Authenticated User
            ↓
           JWT
            ↓
       Vehicle API
            ↓
       PostgreSQL

---

# Phase 5 Workflow

    Phase 5A
    Vehicle Model & Database Design
            ↓
    Phase 5B
    Vehicle Schema
            ↓
    Phase 5C
    Create Vehicle Tests 🔴
            ↓
    Phase 5D
    Create Vehicle Implementation 🟢
            ↓
    Phase 5E
    List Vehicles Tests 🔴
            ↓
    Phase 5F
    List Vehicles Implementation 🟢
            ↓
    Phase 5G
    Get Vehicle Tests 🔴
            ↓
    Phase 5H
    Get Vehicle Implementation 🟢
            ↓
    Phase 5I
    Update Vehicle Tests 🔴
            ↓
    Phase 5J
    Update Vehicle Implementation 🟢
            ↓
    Phase 5K
    Delete Vehicle Tests 🔴
            ↓
    Phase 5L
    Delete Vehicle Implementation 🟢
            ↓
    Phase 5M
    Search & Filtering
            ↓
    Phase 5N
    Authentication + Authorization
            ↓
    Phase 5O
    Complete Inventory Test Suite

---

# Phase 5A — Vehicle Database Model

Create the SQLAlchemy vehicle model:

    app/models/vehicle.py

A vehicle will contain the following fields:

| Column | Type | Constraints | Purpose |
|---|---|---|---|
| `id` | Integer | Primary Key | Unique vehicle ID |
| `make` | String | Not Null | Vehicle manufacturer |
| `model` | String | Not Null | Vehicle model |
| `year` | Integer | Not Null | Manufacturing year |
| `price` | Decimal | Not Null | Vehicle price |
| `mileage` | Integer | Not Null | Vehicle mileage |
| `color` | String | Not Null | Vehicle color |
| `fuel_type` | String | Not Null | Petrol, Diesel, Electric, etc. |
| `transmission` | String | Not Null | Manual or Automatic |
| `status` | String | Not Null | Available, Sold, etc. |
| `created_at` | DateTime | Not Null | Creation time |
| `updated_at` | DateTime | Not Null | Last update time |

## Example Vehicle

    {
        "make": "Toyota",
        "model": "Camry",
        "year": 2024,
        "price": 28500,
        "mileage": 12000,
        "color": "White",
        "fuel_type": "Petrol",
        "transmission": "Automatic",
        "status": "available"
    }

## Business Constraints

    price > 0
    mileage >= 0
    year > 0
    status must contain a valid inventory status

The vehicle quantity/availability rules will be expanded later during the inventory logic phase.

## Database Migration

After creating the model, create an Alembic migration.

    SQLAlchemy Model
            ↓
       Alembic Migration
            ↓
        PostgreSQL
            ↓
       vehicles table

### Commit

    git add .
    git commit -m "feat: add vehicle database model"

---

# Phase 5B — Vehicle Schemas

Create Pydantic schemas for API validation.

The schemas will include:

    VehicleCreate
    VehicleUpdate
    VehicleResponse
    VehicleListResponse

This separates the database model from the API request and response models.

    Database Model
          ≠
    API Request/Response

For example:

    VehicleCreate
          ↓
    POST request

    VehicleResponse
          ↓
    API response

---

# Phase 5C — Create Vehicle Test 🔴

Write the test before implementing the endpoint.

Target endpoint:

    POST /api/vehicles

Test flow:

    Authenticated User
            ↓
       POST vehicle
            ↓
        201 Created

The test should verify:

- Status code
- Returned vehicle ID
- Make
- Model
- Year
- Price
- Mileage
- Color
- Fuel type
- Transmission
- Status
- Database persistence

The test should initially fail:

    Test
      ↓
    RED ❌

---

# Phase 5D — Create Vehicle Implementation 🟢

Create the vehicle router:

    app/routers/vehicles.py

Register the router in:

    app/main.py

Implement:

    POST /api/vehicles

The endpoint flow will be:

    Request
       ↓
    Pydantic validation
       ↓
    Authentication
       ↓
    SQLAlchemy
       ↓
    PostgreSQL
       ↓
    201 Created

After implementation:

    Test
      ↓
    GREEN ✅

---

# Phase 5E/F — List Vehicles

Implement:

    GET /api/vehicles

Test cases will verify:

- Empty inventory
- One vehicle
- Multiple vehicles
- Correct response structure
- Correct vehicle information
- Successful response with `200 OK`

Expected response:

    GET /api/vehicles
            ↓
        200 OK
            ↓
        [
            vehicle,
            vehicle,
            vehicle
        ]

---

# Phase 5G/H — Get Single Vehicle

Implement:

    GET /api/vehicles/{vehicle_id}

Test cases:

    Existing ID → 200 OK
    Invalid ID   → 404 Not Found

Example request:

    GET /api/vehicles/1

Example response:

    {
        "id": 1,
        "make": "Toyota",
        "model": "Camry",
        "year": 2024
    }

---

# Phase 5I/J — Update Vehicle

Implement:

    PUT /api/vehicles/{vehicle_id}

Test cases:

    Existing vehicle → 200 OK
    Invalid vehicle  → 404 Not Found

Test updates to fields such as:

    price
    mileage
    status
    color
    fuel_type
    transmission

The updated values must be persisted in PostgreSQL.

---

# Phase 5K/L — Delete Vehicle

Implement:

    DELETE /api/vehicles/{vehicle_id}

Test cases:

    Existing vehicle → 204 No Content
    Invalid vehicle  → 404 Not Found

After deletion, verify that the vehicle no longer exists in the database.

---

# Phase 5M — Search & Filtering 🔎

Implement query parameters for inventory search.

## Search by Make

    GET /api/vehicles?make=Toyota

## Search by Model

    GET /api/vehicles?model=Camry

## Filter by Price

    GET /api/vehicles?min_price=10000&max_price=30000

## Filter by Year

    GET /api/vehicles?min_year=2020

## Combined Filters

    GET /api/vehicles?make=Toyota&min_price=15000&max_price=30000

Additional filters can include:

    category
    fuel_type
    transmission
    status
    min_year
    max_year
    min_price
    max_price

Tests will be written for each supported filter.

---

# Phase 5N — Authentication & Authorization 🔐

Connect the Phase 4 JWT authentication system to the vehicle API.

## Authenticated Users

The following endpoint can be accessible to authenticated users:

    GET /api/vehicles

## Authorized Staff

The following operations will require the appropriate authorization:

    POST /api/vehicles

    PUT /api/vehicles/{vehicle_id}

    DELETE /api/vehicles/{vehicle_id}

The existing `role` field will be used:

    user
    admin

The authorization flow will eventually become:

                     JWT
                      ↓
                Current User
                      ↓
                ┌─────┴─────┐
                ↓           ↓
              user         admin
                ↓           ↓
               GET         CRUD

Unauthorized requests will also be tested.

---

# Phase 5O — Complete Inventory Test Suite

At the end of Phase 5, run the complete backend test suite:

    pytest tests -v

Instead of running only:

    pytest tests/auth -v

The test structure should look approximately like:

    tests/
    │
    ├── auth/
    │   ├── test_register.py
    │   ├── test_login.py
    │   └── test_me.py
    │
    └── vehicles/
        ├── test_create.py
        ├── test_list.py
        ├── test_get.py
        ├── test_update.py
        ├── test_delete.py
        └── test_search.py

---

# Phase 5 Final Architecture

                    FastAPI
                       │
          ┌────────────┴────────────┐
          │                         │
      Auth API                 Vehicle API
          │                         │
          ↓                         ↓
       JWT Auth                CRUD + Search
          │                         │
          └────────────┬────────────┘
                       ↓
                  SQLAlchemy
                       ↓
                  PostgreSQL

---

# Phase 5 Success Criteria

| Feature | Status |
|---|---|
| Authentication | ✅ Phase 4 |
| Vehicle Model | ⬜ |
| Vehicle Migration | ⬜ |
| Vehicle Schema | ⬜ |
| Create Vehicle | ⬜ |
| List Vehicles | ⬜ |
| Get Vehicle | ⬜ |
| Update Vehicle | ⬜ |
| Delete Vehicle | ⬜ |
| Search Vehicles | ⬜ |
| Filtering | ⬜ |
| JWT-Protected Inventory | ⬜ |
| Role-Based Authorization | ⬜ |
| Vehicle TDD Suite | ⬜ |

---

# Phase 5 TDD Rule

We will continue using the same workflow:

    🔴 Write Test
          ↓
    Run Test
          ↓
    🔴 Confirm Failure
          ↓
    🟢 Implement
          ↓
    Run Tests
          ↓
    🟢 Confirm Passing
          ↓
    💾 Commit
          ↓
    Next Step

After every completed change, record the corresponding Git commit.

---

# Phase 5A — Next Step

Start with:

    Vehicle Model
          ↓
    Alembic Migration
          ↓
    PostgreSQL Verification

The first implementation target is:

    app/models/vehicle.py

Then create and apply the Alembic migration:

    alembic revision --autogenerate -m "create vehicle table"

    alembic upgrade head

After verifying the `vehicles` table in PostgreSQL, commit the change:

    git add .
    git commit -m "feat: add vehicle database model"
```