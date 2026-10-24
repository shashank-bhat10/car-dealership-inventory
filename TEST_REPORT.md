# Latest submission verification — 24 October 2026

Code revision verified: `b337c2591d95eb55b5615fcf5a56b3b043caa01e` from a fresh public clone of `codex/project-review`. The submission update after this run changes documentation and adds genuine screenshots; it does not change application code. The original working database was not used for this rehearsal.

## Clean setup actually executed

```powershell
git clone --branch codex/project-review --single-branch https://github.com/shashank-bhat10/car-dealership-inventory.git <new-directory>
cd <new-directory>\server-side
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt --disable-pip-version-check --quiet
# Configure an untracked .env with distinct rehearsal-app.db and rehearsal-test.db
# SQLite URLs, a freshly generated random JWT secret, and ENVIRONMENT=development.
.venv\Scripts\python.exe -m alembic upgrade head
.venv\Scripts\python.exe -m alembic upgrade head
.venv\Scripts\python.exe -m app.seed_demo
.venv\Scripts\python.exe -m pytest -q --tb=short
```

The new virtual environment was created using the installed Python 3.14 interpreter through the existing environment's interpreter. No installed project dependencies were copied into the fresh environment. The new application database was migrated, the second upgrade succeeded without schema changes, and the seed command added four demo vehicles. The test database had a separate file URL.

From the clone's `client-side/`:

```powershell
npm ci --no-fund
npm run test:run
npm run lint
$env:VITE_API_BASE_URL = 'http://127.0.0.1:8765'
npm run build
npm run preview -- --host 127.0.0.1 --port 5173 --strictPort
```

The backend was started with `.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8765`. This temporary API port keeps the rehearsal distinct from the normal README default of port 8000. The preview origin remained on allowed local port 5173.

| Executed check | Actual result |
|---|---|
| Fresh Python dependency installation | Passed from requirements.txt, exit 0 |
| `npm ci --no-fund` | 261 packages installed; 0 vulnerabilities reported |
| Alembic upgrade, repeated | Both passed, exit 0 |
| Development SQLite seed | 4 vehicles added, exit 0 |
| Full backend pytest suite | **125 passed, 1 existing Starlette/httpx deprecation warning**, 55.65 seconds, exit 0 |
| Frontend Vitest suite | **76 passed in 8 files**, 3.36 seconds, exit 0 |
| ESLint | Passed, exit 0 |
| Vite production build | Passed; 1,824 modules, JS 280.08 kB / 84.42 kB gzip, CSS 54.02 kB / 10.09 kB gzip |
| Clean-clone tracked-file status after tests/demo | Clean; local environment, database, dependencies and build artifacts are ignored |

## Live browser and API rehearsal

Against that clean clone and its disposable database, the browser showed successful customer registration and login, a populated four-vehicle catalog, Toyota search, purchase reducing stock 3 to 2, no-match search recovery, and combined SUV/price/in-stock filters returning the Honda CR-V. The Mazda at zero stock had a disabled Sold Out button. Logout returned to sign-in; direct navigation to `/vehicles` while logged out redirected to sign-in.

A separate demo admin was registered and promoted in the local application database using the documented procedure. The browser added a Kia Seltos at price 2,000,000 and quantity 2, edited the price to 1,950,000, restocked from 2 to 3, then deleted it. The list returned to the four seed vehicles. An authenticated HTTP request subsequently confirmed the deleted ID returns 404.

Fresh HTTP requests to the live API additionally confirmed 401 without authentication; 403 for customer create, update, delete and restock; 400 for purchase at zero stock; 422 for a zero purchase quantity; 404 for a missing vehicle; and 401 for an incorrect password. Combining make, model, category, price and in-stock query parameters returned the expected single vehicle.

Genuine browser captures are `outputs/review/rehearsal-filters.png` and `outputs/review/rehearsal-admin.png`. All accounts and vehicles used in this rehearsal are demonstration data. This is an observed browser rehearsal, not a committed unattended end-to-end test suite. No PostgreSQL local run, coverage measurement, full accessibility audit, load test or public deployment is claimed.

## Submission and AI records

The public repository's default branch is `main`; the assessment version is `codex/project-review`. README.md and the submission guide now link directly to that branch, and the clone command selects it explicitly. The owner supplied the personal reflection now in README.md and confirmed use of Amazon Q and Gemini as recorded in the initial README.

All seven existing public ChatGPT links were checked with fresh HTTP clients without a signed-in session or existing browser cookies. Each returned HTTP 200, a matching title and embedded conversation data. A historical private Gemini URL recovered from Git required sign-in. No Amazon Q transcript or additional supplied ChatGPT/Codex export was found in the repository records checked. PROMPTS.md describes those source gaps accurately; no private conversation was published or reconstructed.

---

# Earlier assessment improvements — 24 October 2026

The existing application was retained. This pass added server-side stock filtering before pagination and resets the frontend page when the stock filter changes. The owner reflection and anonymous-link checks were subsequently completed as recorded in the latest verification above. Additional original source records remain unavailable as listed in PROMPTS.md.

## Follow-up audit verification — 24 October 2026

The empty-catalog state now explains that inventory has not been added yet and gives administrators a direct first-vehicle action. Filtered empty results give a clear-filter action. This addresses the blank-catalog experience without inserting sample records into a user's database. The README explains that new databases start empty and instructs administrators to add demonstration vehicles through the application.

| Check | Actual result |
|---|---|
| `npm run test:run -- src/pages/__tests__/VehicleList.test.jsx` | 17 passed, 1 file, exit 0 |
| `npm run test:run` | 76 passed, 8 files, exit 0 |
| `npm run lint` | Passed, exit 0 |
| `npm run build` | Passed; 1,824 modules, JS 280.08 kB / 84.42 kB gzip, CSS 54.02 kB / 10.09 kB gzip |

The follow-up changes did not touch backend code. The latest recorded backend run remains 121 passed with one existing warning (see the section below). The configured local SQLite database had zero vehicle rows when inspected; the README screenshots were captured using a separate persistent demo database. No records were inserted into the configured application database during this audit.

## Local demo inventory and backend recheck — 24 October 2026

Added `python -m app.seed_demo`, a development-only helper that refuses non-development environments, non-SQLite databases, and catalogs that already contain vehicles. After confirming that the configured database was development SQLite with zero vehicles, the command added four demonstration vehicles, including one sold-out listing. The local database now contains Toyota Camry Hybrid (3), Honda CR-V (2), Hyundai Ioniq 5 (1), and Mazda Mazda3 (0). Prices are demonstration values in INR. No user accounts were added.

| Check | Actual result |
|---|---|
| `python -m pytest -q --tb=short tests/test_seed_demo.py` | 4 passed, 1 existing deprecation warning, exit 0 |
| `python -m pytest -q --tb=short` | **125 passed, 1 existing Starlette/httpx deprecation warning**, 96.33 seconds, exit 0 |
| Local configured database query | 4 vehicles, including 1 sold-out vehicle |

The full backend suite uses the separate test database configured by `TEST_DATABASE_URL`; the demonstration rows remain in the application database.

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
- Historical ESLint result at the original checkout: **2 errors, 1 warning** in auth exports and the details-page effect. This was corrected in a later implementation pass. The follow-up audit above reran `npm run lint` successfully on the current files.
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
- Historical only: that checkout's separate `npm run lint` check reported two errors and one warning in `AuthContext.jsx` and `VehicleDetails.jsx`. The current follow-up audit reran lint successfully, as recorded above.
- At that historical checkout, no new browser screenshot or end-to-end browser result was available because the browser binary was unavailable and its download failed. Later genuine browser checks are recorded in the current review section above.
- Test success does not complete the missing AI conversation records listed in [PROMPTS.md](PROMPTS.md).
