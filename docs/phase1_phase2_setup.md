# Car Dealership Inventory System

A full-stack web application for managing a car dealership's vehicle inventory. The system is designed to allow dealership staff to efficiently view, add, update, delete, search, and manage vehicle records through a responsive web interface.

## Project Status

🚧 **In Development**

The initial project structure and frontend setup are complete. PostgreSQL database setup and FastAPI backend connectivity have also been completed. Database models, CRUD APIs, search and filtering, frontend integration, and testing will be implemented incrementally.

---

# Phase 1 — PostgreSQL Setup

## 1. Check PostgreSQL Installation

Open Command Prompt and run:

    psql --version

You should see a PostgreSQL version similar to:

    psql (18.6)

## 2. Connect to PostgreSQL

Run:

    psql -U postgres

Enter the PostgreSQL password when prompted.

## 3. Create the Database

Inside PostgreSQL, run:

    CREATE DATABASE car_dealership;

## 4. Connect to the Database

    \c car_dealership

You should see a message confirming that you are connected to the `car_dealership` database.

## 5. Verify the Database

    \l

You should see:

    car_dealership

## 6. Exit PostgreSQL

    \q

---

# Phase 2 — FastAPI + PostgreSQL Connection

## 1. Navigate to the Backend

From the project root, run:

    cd server-side

## 2. Activate Virtual Environment

    .venv\Scripts\activate

After activation, the command prompt should show:

    (.venv)

## 3. Install Dependencies

Install the required Python packages:

    pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv

### Dependencies

- **FastAPI** — Backend web framework
- **Uvicorn** — ASGI server used to run FastAPI
- **SQLAlchemy** — ORM used to communicate with PostgreSQL
- **psycopg2-binary** — PostgreSQL driver for Python
- **python-dotenv** — Loads environment variables from the `.env` file

## 4. Save Dependencies

Run:

    pip freeze > requirements.txt

This creates or updates the `requirements.txt` file.

## 5. Create `.env`

Inside the `server-side` directory, create a file named:

    .env

Add the following:

    DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/car_dealership

Replace `YOUR_PASSWORD` with your PostgreSQL password.

For example:

    DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/car_dealership

> **Important:** Never upload the `.env` file to GitHub because it contains your database credentials.

Add the following to `.gitignore`:

    .env

## 6. Run FastAPI

From the `server-side` directory, run:

    uvicorn app.main:app --reload

The FastAPI server should start at:

    http://127.0.0.1:8000

You should see a message similar to:

    INFO: Uvicorn running on http://127.0.0.1:8000

## 7. Test FastAPI

Open the following URL in your browser:

    http://127.0.0.1:8000

Expected response:

    {
        "message": "Car Dealership Inventory API is running"
    }

## 8. Open Swagger API Documentation

FastAPI automatically provides interactive API documentation.

Open:

    http://127.0.0.1:8000/docs

Swagger can be used to view and test API endpoints directly from the browser.

## 9. Test PostgreSQL Connection

Open:

    http://127.0.0.1:8000/db-test

Expected response:

    {
        "message": "PostgreSQL connection successful"
    }

If this response is returned, FastAPI is successfully connected to PostgreSQL.

---

# Phase 1 & Phase 2 Status

| Phase | Status |
|---|---|
| Phase 1 — PostgreSQL Setup | ✅ Complete |
| Phase 2 — FastAPI + PostgreSQL Connection | ✅ Complete |
| Phase 3 — Database Models | ⏳ Next |

---

# Current Architecture

    FastAPI
       ↓
    SQLAlchemy
       ↓
    PostgreSQL Driver
       ↓
    PostgreSQL
       ↓
    car_dealership

---

# Current Project Structure

The backend currently follows this structure:

    car-dealership-inventory/
    │
    ├── server-side/
    │   │
    │   ├── .venv/
    │   │
    │   ├── app/
    │   │   ├── __init__.py
    │   │   └── main.py
    │   │
    │   ├── .env
    │   ├── .gitignore
    │   └── requirements.txt
    │
    └── client-side/

---

# Phase 3 — Database Models

The next step is to create the database models using SQLAlchemy.

The vehicle model will contain the information required to manage dealership inventory.

## Vehicle Model

The vehicle entity will eventually contain fields such as:

    Vehicle
    ├── id
    ├── make
    ├── model
    ├── year
    ├── price
    ├── mileage
    ├── color
    ├── fuel_type
    ├── transmission
    ├── status
    └── created_at

---

# Development Roadmap

    Phase 1 — PostgreSQL Setup
            ↓
    Phase 2 — FastAPI + PostgreSQL Connection
            ↓
    Phase 3 — Database Models
            ↓
    Phase 4 — CRUD APIs
            ↓
    Phase 5 — Search & Filtering
            ↓
    Phase 6 — Frontend Integration
            ↓
    Phase 7 — Testing
            ↓
    Phase 8 — Final Integration

---

# Completed Setup

The following setup tasks have been completed:

- PostgreSQL installation verified
- PostgreSQL database created
- `car_dealership` database created
- FastAPI backend configured
- Python virtual environment configured
- Required dependencies installed
- SQLAlchemy configured
- PostgreSQL driver installed
- `.env` configuration created
- FastAPI server successfully started
- FastAPI root endpoint tested
- Swagger documentation available
- PostgreSQL connection tested successfully

---

# Next Step

## Phase 3 — Database Models

The next phase is to create the SQLAlchemy models and connect them to the `car_dealership` PostgreSQL database.

After that, the project will proceed with CRUD operations for adding, viewing, updating, and deleting vehicles.