# Assessment readiness and demonstration

Checked against the supplied **TDD Kata.docx** on 24 October 2026. This is an evidence guide, not a promise of selection. See README.md for setup and TEST_REPORT.md for executed checks.

## Submit the assessment branch

Use this exact URL: **https://github.com/shashank-bhat10/car-dealership-inventory/tree/codex/project-review**.

The default branch is `main`; the assessment improvements are on `codex/project-review`. The README clone command selects the assessment branch explicitly. A fresh public clone of this branch at code revision `b337c25` was installed and rehearsed on 24 October 2026. Subsequent submission changes update documentation and screenshots.

Ready-to-copy submission note:

> Car Dealership Inventory System — Shashank Bhat. Assessment version: https://github.com/shashank-bhat10/car-dealership-inventory/tree/codex/project-review. Setup and API documentation are in README.md; executed checks and browser observations are in TEST_REPORT.md; original public AI conversation links and source-record limitations are in PROMPTS.md.

| Assessment requirement | Project evidence / remaining work |
|---|---|
| Allowed backend and persistent database | FastAPI, SQLAlchemy, Alembic; PostgreSQL or file-backed SQLite |
| Registration, login, protected API | Auth routes, password hashing, JWT and database-backed role checks |
| Vehicle CRUD and search | Required routes and make/model/category/price filters; regression tests |
| Purchase and admin restock | Conditional SQL decrement prevents overselling; SQL increment prevents lost restocks |
| React, HTML5, CSS3, Tailwind | Existing React SPA, responsive inventory, authentication and admin forms |
| Sold-out purchase disabled | UI state plus server enforcement; automated tests |
| Visual presentation | Genuine desktop/mobile screenshots in README; loading, API-error, empty-catalog, and filtered-empty states; responsive navigation |
| Tests and report | TEST_REPORT.md records commands, failures, fixes, results and limits |
| TDD history | New red/green results are recorded honestly. Earlier commits do not prove universal test-first development; do not manufacture that history. |
| AI attribution | Required tool disclosures retained; new AI-assisted commits carry the actual tool trailer. Historical trailer-spacing exception is disclosed in AI_USAGE.md. |
| My AI Usage reflection | README.md contains the owner's supplied reflection: how AI was used, review of changes and recorded test results, and lessons learned. |
| Raw AI chats / public links | All seven public ChatGPT links returned conversation data anonymously on 24 October 2026. Other tool records are accounted for in PROMPTS.md: the historical Gemini URL requires sign-in; additional ChatGPT/Codex and Amazon Q exports are unavailable. |
| Public repository | Configured repository: https://github.com/shashank-bhat10/car-dealership-inventory |
| Optional deployment | No live deployment is claimed. This is optional in the assessment. |

## Prepare a fresh demonstration

Follow the README setup using a new clone of `codex/project-review`. For a local SQLite demo, choose separate file URLs for the application and disposable tests, run migrations, and run `python -m app.seed_demo` with the virtual-environment Python. The seed command adds four vehicles, including one with zero stock. It refuses an existing catalog; use a new database filename for a fresh rehearsal instead of replacing existing inventory.

Register a customer and a separate demonstration administrator through the app. For the administrator, use `demo_admin@example.com` as an example address. Promote only that registered account in the development application database. The following PowerShell command, run from `server-side/`, was checked during the rehearsal:

```powershell
@'
from sqlalchemy import text
from app.database import engine
with engine.begin() as db:
    result = db.execute(
        text("UPDATE users SET role = 'ADMIN' WHERE email = :email"),
        {"email": "demo_admin@example.com"},
    )
    print(f"Accounts promoted: {result.rowcount}")
'@ | .venv\Scripts\python.exe -
```

Expect `Accounts promoted: 1`. Use the email you actually registered. Log out and sign in as that account. Public registration always creates a customer; the local database setup step is separate from the public API.

## Five-minute demonstration

The timings below are suggested pacing, not a measured runtime.

| Time | Show | Explain |
|---|---|---|
| 0:00–0:45 | Register/sign in as a customer; open the populated inventory | Passwords are hashed; login returns a signed, expiring token. |
| 0:45–1:45 | Search Toyota, buy one unit, clear filters; combine SUV, price range and in-stock filters | Stock changes from 3 to 2. The sold-out Mazda remains unpurchasable. Filters reach the API before pagination. |
| 1:45–3:15 | Sign in as admin; add a temporary vehicle, edit its price, restock it, then delete it | Admin controls are backed by server authorization; a customer's direct API request receives 403. |
| 3:15–4:15 | Open the purchase endpoint and concurrent-buyer regression test | A single conditional SQL update checks quantity and decrements stock; only one buyer can claim the last unit. |
| 4:15–5:00 | Show test results, migration tests, README and PROMPTS.md | Explain which checks ran, what they demonstrate, and the unavailable original AI records. |

The fresh-clone browser rehearsal covered registration/login, customer purchase, combined filters, empty-search recovery, disabled sold-out purchase, logout and protected-route redirect, admin add/edit/restock/delete. Live API requests additionally verified unauthenticated access, customer rejection on all four admin actions, sold-out/invalid purchases, missing vehicles, and incorrect passwords. See TEST_REPORT.md for exact results and limits.

## Explanation notes

| Topic | Explanation grounded in this code | Evidence |
|---|---|---|
| Authentication | Registration hashes the password with bcrypt. Login verifies it and signs a JWT with the user's ID and expiry. Protected routes validate the signature and load the user from the database. | [Auth routes](../server-side/app/routers/auth.py), [security helpers](../server-side/app/core/security.py), `tests/auth/` |
| Admin permissions | `get_current_admin` checks the current database role. Hiding a button improves the interface; the server dependency enforces the rule for direct requests too. | [Dependencies](../server-side/app/core/dependencies.py), backend permission tests and live HTTP 403 checks |
| Persistent storage | SQLAlchemy uses `DATABASE_URL`; SQLite stores data in a file, or PostgreSQL can be configured. Alembic creates the schema. Tests reset only the separate `TEST_DATABASE_URL`. | [Migrations tests](../server-side/tests/test_migrations.py); two successful migration upgrades in the clean clone |
| Safe purchases | `UPDATE ... WHERE id = requested_id AND quantity >= requested_quantity` subtracts stock in the same statement. The transaction commits a successful update; failure rolls back and returns 400 or 404. Restocking uses SQL addition. | [Vehicle routes](../server-side/app/routers/vehicles.py), [stale-session and concurrent-buyer tests](../server-side/tests/vehicles/test_inventory_safety.py) |
| What tests establish | Automated checks exercise specified success/failure cases, including a four-buyer last-unit scenario on SQLite. The browser rehearsal confirms the observed user flows against a live API. | [Test report](../TEST_REPORT.md); these checks are not a proof of every possible race, deployment condition or security threat. |

Purchasing currently changes inventory only; it does not process payments or create orders. The clean-clone rehearsal used SQLite. Local PostgreSQL behavior, production load and a deployed service are not claimed by that rehearsal.

## Before sending the submission

- Submit the branch URL above, which contains the final commit and genuine screenshots.
- The reflection now uses the owner's account. Seven links were checked anonymously on 24 October 2026. Additional raw records remain unavailable; recover original exports if the assessor requires a complete record of every tool session.
- Use the walkthrough and explanation notes to rehearse personally. The recorded setup/browser checks were run by Codex; familiarity with the code remains the interviewer's question to assess.
- Preserve history, genuine third-party license notices and required AI disclosures. Repository ownership does not imply authorship of dependencies.
