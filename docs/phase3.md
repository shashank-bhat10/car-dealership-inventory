# Phase 3 — Database Models

## Objective

Create the database models for the Car Dealership Inventory System using **SQLAlchemy** and **PostgreSQL**.

The two main models are:

- `User`
- `Vehicle`

We will follow **Test-Driven Development (TDD)** throughout this phase.

---

# Phase 3 Workflow

    Phase 3A
    SQLAlchemy + PostgreSQL Setup
            ↓
    Phase 3B
    User Model
            ↓
    Phase 3C
    Vehicle Model
            ↓
    Phase 3D
    Write Model Tests
            ↓
    Phase 3E
    Configure Alembic
            ↓
    Phase 3F
    Create & Apply Database Migration
            ↓
    Phase 3G
    Verify Tables in PostgreSQL

---

# Phase 3A — SQLAlchemy + PostgreSQL Setup

## Tasks

- Install SQLAlchemy
- Install PostgreSQL driver
- Create `database.py`
- Configure PostgreSQL connection
- Create SQLAlchemy engine
- Create session factory
- Create SQLAlchemy `Base` class

## Expected Architecture

    FastAPI
       ↓
    SQLAlchemy
       ↓
    PostgreSQL

---

# Phase 3B — User Model

Create the `User` SQLAlchemy model.

## `users` Table

| Column | Type | Constraints | Purpose |
|---|---|---|---|
| `id` | Integer | Primary Key | Unique user ID |
| `username` | String | Unique, Not Null | Username |
| `email` | String | Unique, Not Null | User email |
| `password_hash` | String | Not Null | Hashed password |
| `role` | String | Not Null | `user` or `admin` |
| `created_at` | DateTime | Not Null | Account creation time |

## Important

Never store the user's plain-text password.

Store:

    password_hash

Authentication and password hashing will be implemented in **Phase 4**.

---

# Phase 3C — Vehicle Model

Create the `Vehicle` SQLAlchemy model.

## `vehicles` Table

| Column | Type | Constraints | Purpose |
|---|---|---|---|
| `id` | Integer | Primary Key | Unique vehicle ID |
| `make` | String | Not Null | Vehicle manufacturer |
| `model` | String | Not Null | Vehicle model |
| `category` | String | Not Null | SUV, Sedan, etc. |
| `price` | Decimal | Not Null | Vehicle price |
| `quantity` | Integer | Not Null | Available stock |
| `created_at` | DateTime | Not Null | Creation time |
| `updated_at` | DateTime | Not Null | Last update time |

## Business Constraints

    price > 0
    quantity >= 0

Quantity must never become negative.

---

# Phase 3D — Write Model Tests

Follow the TDD process:

    Write Test
        ↓
    Run Test
        ↓
    RED ❌
        ↓
    Implement Model
        ↓
    Run Test
        ↓
    GREEN ✅
        ↓
    Refactor

## User Model Tests

Test that:

- A user can be created
- Username is required
- Email is required
- Username must be unique
- Email must be unique
- Password hash is stored
- Default role is `user`

## Vehicle Model Tests

Test that:

- A vehicle can be created
- Make is required
- Model is required
- Category is required
- Price is required
- Quantity is required
- Price cannot be negative
- Quantity cannot be negative

---

# Phase 3E — Configure Alembic

Use **Alembic** for database migrations.

## Tasks

- Install Alembic
- Initialize Alembic
- Configure PostgreSQL connection
- Connect Alembic to SQLAlchemy models
- Configure model metadata

## Expected Architecture

    SQLAlchemy Models
            ↓
         Alembic
            ↓
        Migration
            ↓
        PostgreSQL

---

# Phase 3F — Create & Apply Migration

Generate the migration:

    alembic revision --autogenerate -m "create user and vehicle tables"

Apply the migration:

    alembic upgrade head

This should create:

    PostgreSQL Database
    │
    ├── users
    └── vehicles

---

# Phase 3G — Verify PostgreSQL Tables

Connect to PostgreSQL:

    psql -U postgres

Connect to the project database:

    \c car_dealership

List tables:

    \dt

Expected result:

    users
    vehicles

Check the structure:

    \d users

And:

    \d vehicles

---

# Final Phase 3 Structure

By the end of Phase 3, the backend should contain something similar to:

    server-side/
    │
    ├── app/
    │   ├── __init__.py
    │   ├── main.py
    │   ├── database.py
    │   │
    │   └── models/
    │       ├── __init__.py
    │       ├── user.py
    │       └── vehicle.py
    │
    ├── tests/
    │   ├── __init__.py
    │   ├── test_user_model.py
    │   └── test_vehicle_model.py
    │
    ├── alembic/
    │   ├── versions/
    │   └── ...
    │
    ├── alembic.ini
    ├── requirements.txt
    └── ...

---

# Phase 3 Completion Checklist

- [ ] SQLAlchemy installed
- [ ] PostgreSQL driver installed
- [ ] `database.py` created
- [ ] PostgreSQL connection configured
- [ ] SQLAlchemy engine configured
- [ ] Session factory configured
- [ ] `Base` class created
- [ ] `User` model created
- [ ] `Vehicle` model created
- [ ] User model tests written
- [ ] Vehicle model tests written
- [ ] Tests pass
- [ ] Alembic installed
- [ ] Alembic configured
- [ ] Migration generated
- [ ] Migration applied
- [ ] `users` table verified
- [ ] `vehicles` table verified
- [ ] Changes committed to Git
- [ ] AI co-author added to commits where AI was used

---

# Phase 3 End Result

                     FastAPI
                        │
                        ▼
                    SQLAlchemy
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
            User                Vehicle
              │                   │
              └─────────┬─────────┘
                        ▼
                     Alembic
                        │
                        ▼
                   PostgreSQL

---

# Next Phase

After Phase 3 is complete, move to:

**Phase 4 — Authentication**

    Register
        ↓
    Password Hashing
        ↓
    Login
        ↓
    JWT Token
        ↓
    Protected Routes