# Assessment readiness and demonstration

Checked against the supplied **TDD Kata.docx** on 24 October 2026. This is an evidence guide, not a promise of selection. See README.md for setup and TEST_REPORT.md for executed checks.

| Assessment requirement | Project evidence / remaining work |
|---|---|
| Allowed backend and persistent database | FastAPI, SQLAlchemy, Alembic; PostgreSQL or file-backed SQLite |
| Registration, login, protected API | Auth routes, password hashing, JWT and database-backed role checks |
| Vehicle CRUD and search | Required routes and make/model/category/price filters; regression tests |
| Purchase and admin restock | Conditional SQL decrement prevents overselling; SQL increment prevents lost restocks |
| React, HTML5, CSS3, Tailwind | Existing React SPA, responsive inventory, authentication and admin forms |
| Sold-out purchase disabled | UI state plus server enforcement; automated tests |
| Visual presentation | Genuine desktop/mobile screenshots in README; usable states and navigation |
| Tests and report | TEST_REPORT.md records commands, failures, fixes, results and limits |
| TDD history | New red/green results are recorded honestly. Earlier commits do not prove universal test-first development; do not manufacture that history. |
| AI attribution | Required tool disclosures retained; new AI-assisted commits carry the actual tool trailer. Historical trailer-spacing exception is disclosed in AI_USAGE.md. |
| My AI Usage reflection | **Shashank must supply personal review/reflection wording.** |
| Raw AI chats / public links | **PROMPTS.md lists missing records that Shashank must supply.** |
| Public repository | Configured repository: https://github.com/shashank-bhat10/car-dealership-inventory |
| Optional deployment | No live deployment is claimed. This is optional in the assessment. |

## Five-minute demonstration

1. Start the backend and frontend using README instructions. Use a disposable demonstration database and an admin created using the documented procedure.
2. Register a customer, log in, filter vehicles, purchase one and show the updated stock. Show a sold-out vehicle with its purchase button disabled.
3. Log in as admin; create a vehicle, update its price, restock it and delete it. Explain why hiding buttons alone cannot enforce permissions.
4. Show the conditional SQL purchase update and the concurrent-buyer regression test. Explain the transaction and insufficient-stock response.
5. Show a focused test run, the test report, migrations and the AI usage records. Discuss one limitation candidly instead of claiming production completeness.

## Before sending the submission

- Open the submitted GitHub branch URL and verify that it contains the final commit and screenshots.
- Supply the missing raw records and personal reflection; keep only claims you can explain and support.
- Rehearse a fresh setup and demonstration yourself. Assistant-run checks are not a substitute for your understanding.
- Preserve history, genuine third-party license notices and required AI disclosures. Repository ownership does not imply authorship of dependencies.
