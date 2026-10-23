# Test Report

This report records results from the local verification run for the Car Dealership Inventory System. Counts below are from executed test commands, not estimates.

## Backend

- Framework: pytest with FastAPI `TestClient`
- Result: **89 passed, 0 failed**
- Test database: separate SQLite database configured through `TEST_DATABASE_URL`
- Coverage percentage: not measured in this run

Command, run from `server-side/`:

```bash
DATABASE_URL=sqlite:////tmp/car-dealership-app.db \
TEST_DATABASE_URL=sqlite:////tmp/car-dealership-tests.db \
JWT_SECRET_KEY=test-secret-key-for-tests \
../.venv/bin/python -m pytest -q --tb=short
```

The suite covers registration and login, JWT-protected vehicle reads and purchases, admin-only vehicle changes, search by text and fields, price bounds, pagination, inventory validation, and error handling.

## Frontend

- Frameworks: Vitest and React Testing Library
- Result: **54 passed, 0 failed across 5 test files**
- Production build: **passed** with `npm run build`

Run from `client-side/`:

```bash
npm ci
npm run test:run
npm run build
```

## Combined result

| Layer | Tests passed | Tests failed | Status |
|---|---:|---:|---|
| Backend | 89 | 0 | Passed |
| Frontend | 54 | 0 | Passed |
| **Total** | **143** | **0** | **Passed** |

The backend run produced a Starlette/httpx deprecation warning from the installed test-client versions. It did not affect the test results. Backend coverage was not measured, so this report does not claim a coverage percentage.
