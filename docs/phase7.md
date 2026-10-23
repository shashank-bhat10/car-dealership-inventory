# Phase 7 — Authorization: USER vs ADMIN 🔐

Phase 7 builds on the completed **Authentication from Phase 4**, **Vehicle CRUD from Phase 5**, and **Inventory Logic from Phase 6**.

The goal is to introduce **role-based authorization** so that different users have different permissions.

---

# Current Baseline

    Phase 1  ✅ PostgreSQL
    Phase 2  ✅ FastAPI + PostgreSQL
    Phase 3  ✅ User + Vehicle Models
    Phase 4  ✅ Authentication + JWT
    Phase 5  ✅ Vehicle CRUD + Search
    Phase 6  ✅ Inventory Logic
    Phase 7  🚧 Authorization

Phase 6 currently has:

    56 tests passing

Phase 7 will add authorization and role-based access tests.

---

# Phase 7 Objective

Introduce two user roles:

    USER
    ADMIN

The authorization flow will be:

    Request
       ↓
    JWT Authentication
       ↓
    Identify User
       ↓
    Load User from Database
       ↓
    Check Role
       ↓
    ┌───────────────┐
    │               │
    ↓               ↓
    USER           ADMIN
    ↓               ↓
    Allowed        Allowed
    or             or
    Forbidden      Forbidden

The key distinction is:

> **Authentication determines who the user is. Authorization determines what the user is allowed to do.**

---

# Phase 7 Workflow

    Phase 7A
    User Role Design
            ↓
    Phase 7B
    Database Migration
            ↓
    Phase 7C
    Update User Schema
            ↓
    Phase 7D
    Update Authorization Logic
            ↓
    Phase 7E
    USER Authorization Tests 🔴
            ↓
    Phase 7F
    USER Authorization Implementation 🟢
            ↓
    Phase 7G
    ADMIN Authorization Tests 🔴
            ↓
    Phase 7H
    ADMIN Authorization Implementation 🟢
            ↓
    Phase 7I
    Protect Vehicle APIs
            ↓
    Phase 7J
    Test Unauthenticated Requests
            ↓
    Phase 7K
    Complete Authorization Test Suite
            ↓
    Phase 7L
    Git Commit

---

# Phase 7A — Add User Role

The existing `User` model should contain a role field.

The model will conceptually contain:

    User
    ────────────────
    id
    username
    email
    password_hash
    role
    created_at
    updated_at

Possible roles:

    USER
    ADMIN

We should use an **enum** rather than arbitrary strings.

This prevents invalid values such as:

    manager
    superuser
    random_role

unless they are explicitly added to the application's role definition.

---

# Phase 7B — Database Migration

The `users` table already exists, so create an Alembic migration to add the role column.

Conceptually:

    Existing users table
            ↓
       Add role column
            ↓
       Default = USER
            ↓
    Existing users remain valid

Existing users should not become invalid after the migration.

The migration should provide a default value for existing records.

Expected database structure:

    users
    │
    ├── id
    ├── username
    ├── email
    ├── password_hash
    ├── role
    ├── created_at
    └── updated_at

---

# Phase 7C — Update User Schema

The user response can expose the user's role.

Example:

    {
        "id": 1,
        "email": "user@example.com",
        "role": "USER"
    }

The following must never be exposed:

    password
    password_hash

The API response should only contain safe user information.

---

# Phase 7D — Update Authorization Logic

The existing authentication system already identifies the current user.

We will use the authenticated user to determine their role.

The safer flow is:

    Request
       ↓
    JWT
       ↓
    Identify User
       ↓
    Load User from Database
       ↓
    Check Role
       ↓
    Allow / Reject

We should not blindly trust role information supplied by the client.

---

# Create Authorization Dependencies

The existing authentication dependency should continue to provide:

    get_current_user()

Create an additional dependency for administrator access:

    require_admin()

Conceptually:

    @router.post(...)
    def create_vehicle(
        current_user = Depends(require_admin)
    ):
        ...

The `require_admin()` dependency will:

    Get current user
          ↓
    Check user.role
          ↓
    Is ADMIN?
       /     \
     YES      NO
      ↓        ↓
    Allow    403

---

# Phase 7E — HTTP Status Codes

## Unauthenticated Request

If the request does not contain a valid JWT:

    401 Unauthorized

Flow:

    No Token
       ↓
    Protected Endpoint
       ↓
    401 Unauthorized

---

## Authenticated USER Accessing ADMIN Endpoint

If a valid USER attempts an ADMIN-only operation:

    403 Forbidden

Flow:

    USER
      ↓
    Valid JWT
      ↓
    Admin-only endpoint
      ↓
    Role = USER
      ↓
    403 Forbidden

The distinction is:

    401 = Not authenticated

    403 = Authenticated but not authorized

---

# Phase 7F — Apply Authorization to Vehicle APIs

The permission structure will be:

| Endpoint | USER | ADMIN |
|---|:---:|:---:|
| Create vehicle | ❌ | ✅ |
| List vehicles | ✅ | ✅ |
| Get vehicle | ✅ | ✅ |
| Search vehicles | ✅ | ✅ |
| Update vehicle | ❌ | ✅ |
| Delete vehicle | ❌ | ✅ |
| Purchase vehicle | ✅ | ✅ |
| Restock vehicle | ❌ | ✅ |

This gives the application meaningful role-based behavior.

---

# Vehicle Authorization Flow

## Create Vehicle

    POST /api/vehicles

    USER
      ↓
    403 Forbidden

    ADMIN
      ↓
    201 Created

---

## List Vehicles

    GET /api/vehicles

    USER
      ↓
    200 OK

    ADMIN
      ↓
    200 OK

---

## Get Vehicle

    GET /api/vehicles/{vehicle_id}

    USER
      ↓
    200 OK

    ADMIN
      ↓
    200 OK

---

## Update Vehicle

    PUT /api/vehicles/{vehicle_id}

    USER
      ↓
    403 Forbidden

    ADMIN
      ↓
    200 OK

---

## Delete Vehicle

    DELETE /api/vehicles/{vehicle_id}

    USER
      ↓
    403 Forbidden

    ADMIN
      ↓
    204 No Content

---

## Purchase Vehicle

    POST /api/vehicles/{vehicle_id}/purchase

    USER
      ↓
    Allowed

    ADMIN
      ↓
    Allowed

---

## Restock Vehicle

    POST /api/vehicles/{vehicle_id}/restock

    USER
      ↓
    403 Forbidden

    ADMIN
      ↓
    Allowed

---

# Phase 7G — USER Authorization Tests 🔴

Create:

    tests/
    └── authorization/
        ├── test_user_permissions.py
        └── test_admin_permissions.py

USER tests should verify:

    ✓ USER can list vehicles
    ✓ USER can get vehicle
    ✓ USER can search vehicles
    ✓ USER can purchase vehicle
    ✓ USER cannot create vehicle
    ✓ USER cannot update vehicle
    ✓ USER cannot delete vehicle
    ✓ USER cannot restock vehicle

The initial authorization tests should fail:

    Write Test
        ↓
    Run Test
        ↓
    RED ❌
        ↓
    Implement
        ↓
    GREEN ✅

---

# Phase 7H — ADMIN Authorization Tests 🔴

ADMIN tests should verify:

    ✓ ADMIN can create vehicle
    ✓ ADMIN can update vehicle
    ✓ ADMIN can delete vehicle
    ✓ ADMIN can restock vehicle
    ✓ ADMIN can purchase vehicle
    ✓ ADMIN can list vehicles
    ✓ ADMIN can search vehicles

These tests should initially fail before the authorization implementation is completed.

---

# Phase 7I — Test Unauthenticated Requests

Protected endpoints must also be tested without a JWT.

Example:

    No JWT
       ↓
    POST /api/vehicles
       ↓
    401 Unauthorized

Test protected operations such as:

    POST /api/vehicles

    PUT /api/vehicles/{vehicle_id}

    DELETE /api/vehicles/{vehicle_id}

    POST /api/vehicles/{vehicle_id}/purchase

    POST /api/vehicles/{vehicle_id}/restock

The tests confirm that authentication and authorization work together.

---

# Phase 7J — Authorization Test Structure

Expected structure:

    tests/
    │
    ├── auth/
    │   ├── test_register.py
    │   ├── test_login.py
    │   └── test_me.py
    │
    ├── vehicles/
    │   ├── test_create.py
    │   ├── test_list.py
    │   ├── test_get.py
    │   ├── test_update.py
    │   ├── test_delete.py
    │   ├── test_search.py
    │   ├── test_purchase_vehicle.py
    │   └── test_restock_vehicle.py
    │
    └── authorization/
        ├── test_user_permissions.py
        └── test_admin_permissions.py

---

# Phase 7K — TDD Workflow

Continue the same TDD process used in Phase 6:

    1. Write failing test
            ↓
    2. Run test → RED 🔴
            ↓
    3. Implement minimum code
            ↓
    4. Run test → GREEN 🟢
            ↓
    5. Refactor
            ↓
    6. Run complete test suite
            ↓
    7. Commit changes

Do not implement everything at once.

Recommended order:

    User Role
        ↓
    Database Migration
        ↓
    USER Authorization Test
        ↓
    USER Authorization Implementation
        ↓
    ADMIN Authorization Test
        ↓
    ADMIN Authorization Implementation
        ↓
    Protect Vehicle Endpoints
        ↓
    Unauthenticated Tests
        ↓
    Complete Test Suite

---

# Phase 7L — Expected Tests

Depending on the exact test structure, expect approximately **15–20 additional tests**.

Example:

    Role Tests
    ├── USER role created correctly
    └── ADMIN role recognized

    Authentication
    └── Unauthenticated request → 401

    USER Authorization
    ├── List → allowed
    ├── Get → allowed
    ├── Search → allowed
    ├── Purchase → allowed
    ├── Create → forbidden
    ├── Update → forbidden
    ├── Delete → forbidden
    └── Restock → forbidden

    ADMIN Authorization
    ├── Create → allowed
    ├── Update → allowed
    ├── Delete → allowed
    ├── Restock → allowed
    ├── Purchase → allowed
    ├── List → allowed
    └── Search → allowed

---

# Phase 7 Completion Checklist

## User Roles

- [ ] USER role added
- [ ] ADMIN role added
- [ ] Enum used for roles
- [ ] Default role is USER
- [ ] Existing users handled correctly

## Database

- [ ] Alembic migration created
- [ ] Migration applied successfully
- [ ] `users.role` verified in PostgreSQL

## Schemas

- [ ] User response includes role
- [ ] Password is not exposed
- [ ] Password hash is not exposed

## Authorization

- [ ] `get_current_user()` implemented
- [ ] `require_admin()` implemented
- [ ] USER permissions implemented
- [ ] ADMIN permissions implemented
- [ ] 401 handling verified
- [ ] 403 handling verified

## Vehicle APIs

- [ ] Create protected
- [ ] List protected
- [ ] Get protected
- [ ] Search protected
- [ ] Update protected
- [ ] Delete protected
- [ ] Purchase permissions protected
- [ ] Restock permissions protected

## Testing

- [ ] USER authorization tests pass
- [ ] ADMIN authorization tests pass
- [ ] Unauthenticated tests pass
- [ ] All Phase 1–6 tests still pass
- [ ] Complete test suite passes

## Git

- [ ] Changes reviewed
- [ ] Changes staged
- [ ] Git commit created
- [ ] Working tree clean

---

# Phase 7 Final Architecture

                         Request
                            │
                            ▼
                        FastAPI
                            │
                            ▼
                          JWT
                            │
                            ▼
                   get_current_user()
                            │
                            ▼
                      PostgreSQL
                            │
                            ▼
                       User Role
                            │
                   ┌────────┴────────┐
                   ↓                 ↓
                  USER              ADMIN
                   │                 │
          ┌────────┼───────┐   ┌────┼─────────┐
          ↓        ↓       ↓   ↓    ↓         ↓
         GET    SEARCH  PURCHASE CRUD RESTOCK  DELETE
          │        │       │   │      │         │
          └────────┴───────┘   └──────┴─────────┘

---

# Updated Project Roadmap

    PHASE 1
    PostgreSQL Setup
            ↓
    PHASE 2
    FastAPI ↔ PostgreSQL Connection
            ↓
    PHASE 3
    Database Models
    User + Vehicle
            ↓
    PHASE 4
    Authentication
    Register + Login + JWT
            ↓
    PHASE 5
    Vehicle APIs
    Create + Read + Search + Update + Delete
            ↓
    PHASE 6
    Inventory Logic
    Purchase + Restock
            ↓
    PHASE 7
    Authorization
    USER + ADMIN
            ↓
    PHASE 8
    Backend TDD + Test Coverage
            ↓
    PHASE 9
    React Authentication
            ↓
    PHASE 10
    Vehicle Dashboard
            ↓
    PHASE 11
    Admin UI
            ↓
    PHASE 12
    Frontend Testing
            ↓
    PHASE 13
    README + Screenshots + Test Report
            ↓
    PHASE 14
    PROMPTS.md + AI Usage Documentation
            ↓
    PHASE 15
    Final Git Cleanup + Deployment

---

# Current Project Status

    Phase 1  ✅ PostgreSQL Setup
    Phase 2  ✅ FastAPI + PostgreSQL
    Phase 3  ✅ Database Models
    Phase 4  ✅ Authentication + JWT
    Phase 5  ✅ Vehicle CRUD + Search
    Phase 6  ✅ Inventory Logic — 56 tests passing
    Phase 7  🚧 Authorization — USER vs ADMIN
    Phase 8  ⏳ Backend TDD + Test Coverage
    Phase 9  ⏳ React Authentication
    Phase 10 ⏳ Vehicle Dashboard
    Phase 11 ⏳ Admin UI
    Phase 12 ⏳ Frontend Testing
    Phase 13 ⏳ Documentation + Screenshots
    Phase 14 ⏳ PROMPTS.md + AI Documentation
    Phase 15 ⏳ Git Cleanup + Deployment

---

# Phase 7 Starting Point

The first implementation step is:

    Phase 7A
    User Role
        ↓
    Phase 7B
    Alembic Migration
        ↓
    Phase 7C
    User Schema
        ↓
    Phase 7D
    Authorization Dependency

Only after these foundations are ready should we proceed with the USER and ADMIN authorization tests.