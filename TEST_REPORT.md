# Test Report

Results below come from executed commands against commit `bb42662e6d9e069aef0cf181211f64e0051df52b`. The final report commit changes documentation and database ignore rules only.

## Independent GitHub Actions verification

[Successful workflow run 39991307864](https://github.com/shashank-bhat10/car-dealership-inventory/actions/runs/39991307864) checks out the repository and installs dependencies independently. Its downloadable artifacts contain backend and frontend test output.

| Check | Observed result |
|---|---|
| Backend, including fresh PostgreSQL 16 migrations | 92 passed, 1 warning |
| Frontend | 65 passed across 6 test files |
| Frontend production build | Passed |

The extra backend test in CI is the PostgreSQL parameter of the migration smoke test, enabled by `POSTGRES_MIGRATION_TEST_URL`. The local run below exercises SQLite migrations; it does not claim local PostgreSQL verification.

## Clean-clone backend verification

A separate clone of the commit above was created with no source edits. Dependencies were installed from `server-side/requirements.txt` into a newly created `server-side/.venv`, following the README. After the work session resumed, the exact documented command was rerun in that same checkout because the earlier temporary output was unavailable. Only generated database files were present; tracked source remained unchanged.

Environment: Linux, Python 3.12.14. Result: **91 passed, 1 warning in 80.95 seconds**, exit code 0.

Command, run from `server-side/`:

```bash
DATABASE_URL=sqlite:///./app-test.db \
TEST_DATABASE_URL=sqlite:///./test-suite.db \
JWT_SECRET_KEY=test-secret-key-for-tests \
.venv/bin/python -m pytest -q --tb=short
```

The suite covers registration/login, protected API access, vehicle CRUD and search, inventory operations and validation, admin permissions, and fresh database setup. Migration tests invoke Alembic against an empty database, repeat the upgrade for idempotence, exercise registration/login and admin create/update, and verify that a regular user receives HTTP 403 when updating. They do not use `create_all` to substitute for migrations.

## Clean-clone frontend verification

The same separate checkout used Node.js 24.19.0 and a fresh `npm ci` installation. The previously completed run produced **65 passed across 6 test files** and a successful production build. These checks were preserved rather than repeated for documentation-only changes.

Commands, run from `client-side/`:

```bash
npm ci
npm run test:run
npm run build
```

The new editor tests cover admin prefilled fields and saving, regular-user exclusion, cancellation, invalid values, API failure/retry, and disabled controls while saving. Existing purchase, restock and delete tests also pass.

## Limits and remaining checks

- The backend emits one Starlette/httpx test-client deprecation warning; no tests failed. Coverage percentage was not measured.
- A separate `npm run lint` check reported two existing errors and one warning in `AuthContext.jsx` and `VehicleDetails.jsx` (Fast Refresh exports and effect/state/dependency rules). Lint is not included in the passing test/build claim above.
- No new browser screenshot or end-to-end browser result is claimed: the browser binary was unavailable and its download failed. Existing screenshots remain in the README.
- Test success does not complete the missing AI conversation records listed in [PROMPTS.md](PROMPTS.md).
