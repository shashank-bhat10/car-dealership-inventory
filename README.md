# Car Dealership Inventory System

**Author: Shashank Bhat**

A full-stack inventory application built with React, Tailwind CSS, FastAPI, SQLAlchemy, PostgreSQL and JWT authentication. Customers can browse, search and purchase vehicles. Administrators can add, edit, delete and restock vehicles.

## Features

- Register, log in and log out.
- Protected vehicle listing, details and search endpoints.
- Search by make, model, category and price range.
- Purchase vehicles and reduce stock; purchasing is disabled at zero stock.
- Admin forms to add and edit make, model, category, price and quantity.
- Admin-only deletion and restocking, enforced by the backend.
- Persistent database storage and Alembic migrations.
- Backend tests, React component tests and GitHub Actions checks.

## Architecture

React calls the REST API using HTTP and sends a JWT in the `Authorization` header. FastAPI validates requests and permissions. SQLAlchemy reads and writes the database. Alembic creates and updates the database tables.

| Part | Technology |
|---|---|
| Frontend | HTML5, CSS3, React, Tailwind CSS, Vite |
| Backend | Python, FastAPI, Pydantic |
| Storage | PostgreSQL; file-based SQLite is also supported |
| Authentication | JWT, password hashing, USER and ADMIN roles |
| Testing | pytest, FastAPI TestClient, Vitest, React Testing Library |

## Local setup

Use Python 3.12, Node.js 24, npm and PostgreSQL 16 (the version used in CI). Two terminals are needed: one for the backend and one for the frontend.

### 1. Clone

```bash
git clone https://github.com/shashank-bhat10/car-dealership-inventory.git
cd car-dealership-inventory
```

### 2. Create the backend virtual environment

```bash
cd server-side
python -m venv .venv
```

Linux/macOS:

```bash
.venv/bin/python -m pip install -r requirements.txt
cp .env.example .env
```

Windows PowerShell:

```powershell
.venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
```

The environment belongs inside `server-side/.venv`. Commands below are run from `server-side`, unless stated otherwise.

### 3. Create databases and configure `.env`

In PostgreSQL, create separate application and disposable test databases:

```sql
CREATE DATABASE car_dealership;
CREATE DATABASE car_dealership_test;
```

Edit `server-side/.env` with your local PostgreSQL username and password:

```dotenv
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/car_dealership
TEST_DATABASE_URL=postgresql://postgres:your_password@localhost:5432/car_dealership_test
JWT_SECRET_KEY=replace_with_a_long_random_secret
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=development
```

Both the application and Alembic use **`DATABASE_URL`**. Never commit `.env` or real credentials. The tests reset tables in `TEST_DATABASE_URL`, so it must point to a separate disposable database.

For a local SQLite setup instead of PostgreSQL, use `DATABASE_URL=sqlite:///./car_dealership.db` and `TEST_DATABASE_URL=sqlite:///./car_dealership_test.db`. These are persistent files, not in-memory databases.

### 4. Run migrations before starting the backend

Linux/macOS:

```bash
.venv/bin/python -m alembic upgrade head
.venv/bin/python -m uvicorn app.main:app --reload
```

Windows PowerShell:

```powershell
.venv\Scripts\python.exe -m alembic upgrade head
.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Run `alembic upgrade head` for every fresh application database and after pulling migration changes. Starting the API alone does not create tables. Re-running the upgrade command is safe.

- API: <http://127.0.0.1:8000>
- Interactive API documentation: <http://127.0.0.1:8000/docs>

### 5. Start the frontend

In a second terminal, from the repository root:

```bash
cd client-side
npm ci
npm run dev
```

Open <http://localhost:5173>. The frontend calls `http://127.0.0.1:8000`; keep both servers running.

### 6. Try the admin workflow

Register an account in the app. New accounts are always regular users. For a local demo, promote your own registered account using SQL in the **application** database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your_registered_email@example.com';
```

Log out and log in again. Open a vehicle and choose **Edit vehicle**. The form starts with the saved values. Edit any of the five fields, save changes, or cancel. Saving updates the displayed vehicle. A regular user has no edit control, and a direct unauthorized update request returns HTTP 403.

## API routes

| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |
| GET | `/api/vehicles` | Authenticated |
| GET | `/api/vehicles/search` | Authenticated |
| GET | `/api/vehicles/{vehicle_id}` | Authenticated |
| POST | `/api/vehicles` | Admin |
| PUT | `/api/vehicles/{vehicle_id}` | Admin |
| DELETE | `/api/vehicles/{vehicle_id}` | Admin |
| POST | `/api/vehicles/{vehicle_id}/purchase` | Authenticated |
| POST | `/api/vehicles/{vehicle_id}/restock` | Admin |

Search accepts `q`, `make`, `model`, `category`, `min_price`, `max_price`, `page` and `limit`. Purchase and restock requests use a JSON body such as `{"quantity": 1}`. Every vehicle has an ID, make, model, category, price and quantity.

## Run the tests

### Backend — Linux/macOS

Run this exact command from `server-side/`, after installing dependencies in `.venv`:

```bash
DATABASE_URL=sqlite:///./app-test.db \
TEST_DATABASE_URL=sqlite:///./test-suite.db \
JWT_SECRET_KEY=test-secret-key-for-tests \
.venv/bin/python -m pytest -q --tb=short
```

These URLs select disposable file-based SQLite databases, independently of your development database. The migration tests create additional temporary databases and exercise registration, login and vehicle updates against the migrated tables.

### Backend — Windows PowerShell

```powershell
$env:DATABASE_URL = 'sqlite:///./app-test.db'
$env:TEST_DATABASE_URL = 'sqlite:///./test-suite.db'
$env:JWT_SECRET_KEY = 'test-secret-key-for-tests'
.venv\Scripts\python.exe -m pytest -q --tb=short
```

### Frontend

From `client-side/`:

```bash
npm ci
npm run test:run
npm run build
```

See [TEST_REPORT.md](TEST_REPORT.md) for observed results and limitations. [GitHub Actions](https://github.com/shashank-bhat10/car-dealership-inventory/actions/workflows/tests.yml) runs backend tests, a fresh PostgreSQL migration/API smoke test, frontend tests and the production build. [Development evidence](docs/DEVELOPMENT.md) records the new Red–Green–Refactor sequences; earlier commits are not presented as proof of original test-first development.

## Screenshots

### Login
![Login](outputs/login.jpg)

### Inventory
![Inventory dashboard](outputs/admin/admin_dashboard.jpg)

### Add a vehicle
![Add vehicle](outputs/admin/admin_addVehicle.jpg)

### Search
![Search inventory](outputs/user/user_searchbar.jpg)

### Out of stock
![Out of stock](outputs/out_of_stock.jpg)

## My AI Usage

**ChatGPT** assisted with requirement review, writing tests, implementation, debugging, GitHub uploads and documentation. The current fixes include the admin editor, migration setup, test commands and CI workflow. The new tests were run while failing, then again after implementation and refactoring.

Earlier project documentation also records **Amazon Q** for planning and **Gemini** for UI ideas. Their accessible raw conversation records have not yet been supplied. [AI_USAGE.md](AI_USAGE.md) distinguishes confirmed work, historical claims and missing records. [PROMPTS.md](PROMPTS.md) contains verified public conversation links and explicitly lists the outstanding records.

AI helped find missing requirements and speed up implementation. The earlier review still missed the update form and migration setup, which shows why generated claims need to be checked against code and actual test results. I need to understand and explain every change I submit.

AI-assisted commits use a ChatGPT co-author trailer with two empty lines before it. The two earlier setup commits that omitted it are disclosed in the attribution audit in `AI_USAGE.md`; published history has not been rewritten to conceal that omission.
