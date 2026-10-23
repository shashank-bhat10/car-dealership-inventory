# Development evidence

## Scope of the history

The earlier seven GitHub commits were created during repository upload, including reconstruction from project snapshots. Their ordering is not proof that all earlier backend features were originally developed test-first. No older commits were backdated, renamed or rewritten during the current fixes.

The sequences below record actual test execution during the current work. The red tests were committed and published before their implementations. Each following refactor was checked using the same tests.

## Admin vehicle editor

Command, from `client-side/`:

```bash
npm run test:run -- src/pages/__tests__/VehicleEdit.test.jsx
```

| Stage | Commit | Observed result |
|---|---|---|
| Red | `151e7dbc78fc97bce995f9de369fd1c3c327d63b` | 10 failed, 1 passed: admin edit control/form missing. |
| Green | `706b1078b77395d07a27034a372dd280c6f0f866` | Editor plus existing details tests: 22 passed. |
| Refactor | `47b19691bebd30999e78ceb35173aff61da727fa` | Extracted `EditVehicleForm`; the same 22 tests passed. |

Green/refactor verification added `src/pages/__tests__/VehicleDetails.test.jsx` to the command to check existing purchase, restock and delete behavior too.

## Fresh database migrations

Command, from `server-side/`:

```bash
DATABASE_URL=sqlite:///./app-test.db \
TEST_DATABASE_URL=sqlite:///./test-suite.db \
JWT_SECRET_KEY=test-secret-key-for-tests \
.venv/bin/python -m pytest -q tests/test_migrations.py --tb=short
```

| Stage | Commit | Observed result |
|---|---|---|
| Red | `12a9296e321f2789e590779987ef95fce8235e6e` | 2 failed: online URL mismatch and offline placeholder URL. |
| Green | `48ee5957bc5597127cc77ad4c44f45258f3a8844` | 2 passed after URL and SQLite constraint-migration fixes. |
| Refactor | `badb3d8613449bb542d84f4deb6585e1b4c43023` | 2 passed after sharing application settings and simplifying the migration environment. |

The fresh-schema smoke test uses Alembic, not `Base.metadata.create_all`. It checks migrations twice, table existence, registration, login, admin creation/update and rejection of a regular-user update. GitHub Actions additionally supplies a fresh PostgreSQL database to this test.

See [TEST_REPORT.md](../TEST_REPORT.md) for the final clean-clone suite results. See [AI_USAGE.md](../AI_USAGE.md) for the two historical commits that omitted AI trailers and the current attribution format.

## 24 October review

The new red/green observations are in [TEST_REPORT.md](../TEST_REPORT.md). Regression tests were executed before implementation for atomic inventory, input validation, auth forms/role controls, truthful UI statistics, pagination/filter focus and safe health responses. Existing Git history is untouched. The user's instruction to commit completed work after verification was followed; this review does not fabricate failing intermediate commits.
