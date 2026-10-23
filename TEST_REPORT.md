# Resumed assessment improvements — 24 October 2026

The existing application was retained. This pass adds server-side stock filtering before pagination and resets the frontend page when the stock filter changes. The supplied Word assessment was reread; its missing personal AI reflection and raw-log requirements remain explicitly outstanding.

## Executed checks for this pass

Use the environment variables and commands documented below. Run backend pytest processes sequentially against a given TEST_DATABASE_URL: fixtures recreate tables.

| Check | Actual result |
|---|---|
| Baseline frontend `npm run test:run` | 72 passed, 7 files |
| Baseline backend `python -m pytest -q --tb=short -k 'not stock_filter_applies_before_pagination'` | 119 passed, 2 new tests deselected, 1 warning, 51.39 seconds |
| New backend tests before implementation: `python -m pytest -q --tb=line tests/vehicles/test_vehicle_search.py` | 2 failed, 3 passed: sold-out row was returned instead of available row |
| New frontend tests before implementation (stock request serialization and filter/page reset) | Both failed as expected; 14 existing component cases passed |
| Final backend `python -m pytest -q --tb=short` | **121 passed, 1 warning**, 54.48 seconds, exit 0 |
| Final frontend `npm run test:run` | **74 passed across 8 files**, 3.24 seconds, exit 0 |
| `npm run lint` | Passed, exit 0 |
| `npm run build` | Passed, 1,824 modules; JS 279.63 kB / 84.28 kB gzip; CSS 53.69 kB / 9.98 kB gzip |
| `git diff --check` | Passed |

The first baseline backend run overlapped accidentally with a focused run using the same test database. The baseline produced 115 passes, 2 failures and 2 setup errors; the focused run produced 1 pass, 1 failure and 3 setup errors. These conflicted runs are not regression evidence. After both ended, the sequential baseline and targeted red runs above completed. An intermediate JSX handler syntax error also failed frontend tests/lint/build; it was corrected before the successful final checks. Existing service tests were preserved, with the additional serialization case in `stockFilter.test.js`.

The remaining backend warning is the existing Starlette/httpx TestClient deprecation. No new coverage measurement, PostgreSQL full-suite run, deployment or browser screenshot capture is claimed in this pass. Existing genuine screenshots remain applicable to the unchanged visual layout. Unsupported coverage percentages were removed from docs/phase8.md. Test-first execution is recorded here, not retroactively manufactured in old commits.

---

# Test report — 24 October 2026 review

Environment: Windows, Python 3.14.0, Node.js 24.19.0, npm 11.17.0. Original checkout: `39f649b` on `codex/project-review`. This section records commands actually executed in this session. Historical results follow separately.

## Baseline before implementation

- Existing backend suite: **91 passed, 1 warning**, 40.75 seconds. New test files were excluded from this baseline command because they had been authored while the original sandboxed runner was stalled.
- Existing frontend suite: **65 passed**, 6 files.
- ESLint: **2 errors, 1 warning** in auth exports and the details-page effect.
- Dependency installation succeeded after network escalation. Initial npm audit reported **9 vulnerabilities** (7 high, 2 moderate).
- Initial sandboxed Vitest failed before collecting tests with an EPERM cache error. Rerunning outside the sandbox passed. The original sandboxed backend runner produced no result; the completed baseline was the explicit external run above.

## New test-first work

| Focused command | Red, before behavior change | Green |
|---|---|---|
| `python -m pytest -q --tb=line tests/vehicles/test_inventory_safety.py tests/auth/test_registration_validation.py` | 26 failed, 2 passed | 28 passed |
| `npm run test:run -- src/pages/__tests__/AuthForms.test.jsx src/pages/__tests__/VehicleDetails.test.jsx` | 2 failed, 14 passed | Passed in full suite |
| `npm run test:run -- src/pages/__tests__/VehicleList.test.jsx` | 2 failed, 12 passed | Passed in full suite |
| `python -m pytest -q --tb=short tests/test_main.py` | 2 failed, 1 passed | Passed in full suite |

The first concurrent-purchase run returned four HTTP 200 responses for a single available unit. After the atomic update, exactly one request succeeds and three return 400, with final stock zero. A separate deterministic stale-session regression guards against a passing concurrency test merely due to lucky scheduling. Restocking tests verify that another session's increment is preserved.

Validation cases include explicit nulls, whitespace-only fields, precision/price bounds, invalid list filters, boolean/string/fractional inventory quantities, empty/short passwords and bcrypt's UTF-8 byte limit. Frontend additions cover login success/failure, registration payload/success, customer admin-control visibility, unsupported marketing claims, pagination and preserving search focus.

These are newly observed red/green results, not retrospective claims about original TDD. The user asked for completed changes to be committed after verification, so failing intermediate states were not committed. Refactoring separated the auth provider from its hook and kept vehicle loading local to its effect without disabling lint rules.

## Final executed checks

From `server-side/` in PowerShell:

```powershell
$env:DATABASE_URL = 'sqlite:///./app-test.db'
$env:TEST_DATABASE_URL = 'sqlite:///./test-suite.db'
$env:JWT_SECRET_KEY = 'test-secret-key-for-tests'
.venv\Scripts\python.exe -m pytest -q --tb=short
```

**119 passed, 1 warning in 60.34 seconds**, exit 0. Includes authentication, permissions, search, create/update/delete, purchasing, restocking, validation and real fresh-database migration tests. The warning is the existing Starlette/httpx TestClient deprecation.

From `client-side/`:

| Command | Actual result |
|---|---|
| `npm ci` | Installed locked dependencies; initial advisory count above |
| `npm audit fix` (two compatible passes) | Final result: 0 vulnerabilities |
| `npm run test:run` | 72 passed across 7 files, 3.39 seconds, exit 0 |
| `npm run lint` | Passed, no reported errors/warnings |
| `npm run build` | Passed: 1,824 modules; JS 279.57 kB (84.25 kB gzip), CSS 53.69 kB (9.98 kB gzip) |

No separate TypeScript or backend static-type/lint configuration exists; none is claimed. Coverage was not measured. No PostgreSQL server was exercised locally in this session. The GitHub Actions run for the completed code commit [0b80a8a](https://github.com/shashank-bhat10/car-dealership-inventory/actions/runs/40031974177) succeeded, including its PostgreSQL migration smoke test and frontend lint. That run verifies the code commit before the documentation-only edits in this report update.

## Genuine browser checks

FastAPI was started after successful Alembic migrations against a separate `review-demo.db` file. Vite was started on loopback port 5173. A demonstration `example.com` account was registered through the UI and promoted in that demo database using the README's admin setup procedure.

Observed in the actual browser: registration/login; admin add vehicle; purchase stock 3 → 2; restock 2 → 3; edit price 4,500,000 → 4,450,000; search; disabled Sold Out at stock 0. Desktop and mobile layouts were inspected. Mobile navigation/logout had been hidden by existing CSS and are now visible; category filters wrap. A mobile viewport check found document width equal to scroll width. Screenshots are in `outputs/review/`; demonstration prices/accounts are not real inventory or user data.

Delete/cancel, error/retry and customer permission flows are additionally covered by automated tests; they are not claimed as a complete browser end-to-end suite. No public deployment, exhaustive accessibility audit or load test is claimed.

## Historical report (retained, not rerun evidence)

The following report was already in the repository. Its external CI/clean-clone claims were not independently revalidated during this session.

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
