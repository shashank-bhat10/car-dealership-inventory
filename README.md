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

Use Python 3.12 (CI) or 3.14 (verified locally), Node.js 24, npm and PostgreSQL 16 (CI), or file-based SQLite. Two terminals are needed: one for the backend and one for the frontend.

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

Search accepts `q`, `make`, `model`, `category`, `min_price`, `max_price`, `in_stock`, `page` and `limit`. Purchase and restock requests use a JSON body such as `{"quantity": 1}`. Every vehicle has an ID, make, model, category, price and quantity.

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
npm run lint
npm run build
```

See [TEST_REPORT.md](TEST_REPORT.md) for observed results and limitations. [GitHub Actions](https://github.com/shashank-bhat10/car-dealership-inventory/actions/workflows/tests.yml) runs backend tests, a fresh PostgreSQL migration/API smoke test, frontend tests and the production build. [Development evidence](docs/DEVELOPMENT.md) records the new Red–Green–Refactor sequences; earlier commits are not presented as proof of original test-first development.

## Reliability and API details

Stock purchases use a conditional SQL UPDATE that checks available quantity and subtracts in one statement. Restocking also uses SQL arithmetic so concurrent increments are not lost. These operations are tested against stale sessions and concurrent buyers using a persistent SQLite test database.

Registration JSON: `{"username":"shashank","email":"shashank@example.com","password":"choose-your-own-password"}`. Login accepts email/password and returns `access_token` and `token_type`. Send `Authorization: Bearer <access_token>` for protected requests. Registration always creates USER accounts; the server reads the current role from the database.

Create/update vehicle JSON uses `make`, `model`, `category`, `price`, `quantity`. Create requires all five; update accepts supplied fields and rejects explicit null. Names are trimmed, price must be positive with at most two decimal places and eight integer digits, and quantity must be a nonnegative JSON integer. Purchase/restock require a positive JSON integer quantity. Passwords require at least six characters and at most 72 UTF-8 bytes (the existing bcrypt implementation's limit).

Responses: 201 for registration/creation, 200 for successful reads/login/updates/inventory operations, 204 for deletion, 400 for insufficient stock, 401 for missing/invalid authentication or failed login, 403 for insufficient role, 404 for missing vehicles, 409 for duplicate registration, and 422 for invalid input. `/db-test` returns 200 when storage is reachable or a generic 503 without exposing connection errors. See `/docs` for exact request/response schemas and the additional admin user-management routes.

Both listing and search support page numbers starting at 1, limits 1–100 and nonnegative ordered price ranges. Listing uses exact field matches; search uses case-insensitive partial matches. Catalog navigation fetches 100 vehicles per page. Its in-stock toggle filters in the database before pagination, so available vehicles are not missed on later pages. Both API routes accept `in_stock=true`. Prices are displayed in INR. A purchase changes inventory only; no payment is taken.

Optional frontend configuration: copy `client-side/.env.example` to `.env` and set `VITE_API_BASE_URL`. It is public configuration, never a place for secrets. Restart Vite after changes. For deployment, configure the allowed frontend origin in `server-side/app/main.py`; the current CORS settings are for local development.

Generate your own JWT secret, for example with `python -c "import secrets; print(secrets.token_urlsafe(48))"`, and store it only in your untracked backend `.env`. Do not reuse example values. `TEST_DATABASE_URL` is currently required by settings; keep it distinct from the application database. The test fixture drops test tables.

## Screenshots

Captured from the running application on 24 October 2026 with a separate, persistent local demo database. Vehicle prices and the `example.com` account are demonstration data. These are genuine browser captures, not mockups. Older screenshots remain in `outputs/` as historical assets.

### Login
![Login](outputs/review/login.png)

### Inventory on desktop
![Desktop inventory](outputs/review/inventory-desktop.png)

### Inventory on mobile
<img src="outputs/review/inventory-mobile.png" alt="Mobile inventory with navigation and logout controls" width="390" />

### Sold out
![Sold-out vehicle](outputs/review/sold-out.png)

## Verification and project audit

The 24 October review ran **121 backend tests** and **74 frontend tests** successfully, plus ESLint and the Vite production build. `npm audit fix` applied compatible updates and reported **0 vulnerabilities**. No coverage percentage is claimed. See [TEST_REPORT.md](TEST_REPORT.md) for commands, baseline failures, warnings and browser evidence, and [the repository audit](docs/REPOSITORY_AUDIT.md) for requirements, names/credits, Git-history findings and interview guidance.

## My AI Usage

**Tools and use.** AI tools have supported planning, implementation, test design, debugging and documentation. Project records name ChatGPT and Codex, and earlier notes report Amazon Q planning and Gemini UI ideas. The original records are incomplete; see [AI_USAGE.md](AI_USAGE.md) and [PROMPTS.md](PROMPTS.md).

**How AI suggestions were checked.** AI-generated changes were checked against the existing application and its automated tests, lint and production build. The measured results and limits are recorded in [TEST_REPORT.md](TEST_REPORT.md). Attribute tool-run checks accurately; do not present them as manual work unless you performed them.

### Reflection draft

*Positive first-person draft. Keep it only if it accurately reflects the owner’s experience.*

My experience using AI as part of this project has been positive. It helped me explore implementation options, clarify requirements, consider edge cases, and make progress from ideas to a working application. I found it most useful as a collaborator: it offered suggestions and alternatives, while I remained responsible for the decisions and the finished result.

The process also reinforced the value of checking suggestions against the project and its tests. I want to be able to explain the important design choices in my own words and discuss both the benefits and limits of AI assistance during the interview.

**Conversation records.** [PROMPTS.md](PROMPTS.md) indexes available original AI conversation links and identifies source records that were not found. It labels invented presentation examples clearly and keeps them separate from historical conversation links.

New AI-assisted commits disclose Codex as co-author. Historical AI use and commit attribution exceptions are documented in [AI_USAGE.md](AI_USAGE.md).
## Assessment submission

Use [the assessment checklist and demonstration guide](docs/ASSESSMENT_CHECKLIST.md) to review the supplied kata requirements. The source records listed in PROMPTS.md should be added only if they can be recovered, and the reflection draft should be used only if it accurately describes the owner’s experience. No guarantee of selection is claimed.
