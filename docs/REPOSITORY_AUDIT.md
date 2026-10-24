# Repository audit — 24 October 2026

## Starting state

The checkout was clean on `codex/project-review`, starting at `39f649b`. No uncommitted user work was present. The existing FastAPI/SQLAlchemy backend and React/Tailwind frontend were retained. After the owner requested removal of an outdated README attribution from all repository branches, history was rewritten to remove that text while keeping the other commit content and author records.

GitHub's repository API confirmed `shashank-bhat10/car-dealership-inventory` is public, is not marked as a fork, and has default branch `main`. The configured fetch/push remote matches. Repository ownership is not the same as exclusive authorship of every line.

## Names, identities and credits

| Location | Finding and interpretation | Action |
|---|---|---|
| All locally available Git author/committer records | Shashank Bhat, `shashankbhat1200@gmail.com` is the only recorded human identity. Local Git configuration matches. | Preserved. Commit metadata is not independent proof of original code authorship. |
| Current root README and GitHub owner | Shashank Bhat / `shashank-bhat10`. | Retained; added frontend package author metadata and authentication-page footer attribution. |
| Historical README revisions | An earlier README revision contained an unverified provenance statement that conflicts with the owner's present account. | Rewrote both branches to remove the statement. The attribution-only commit became empty and was pruned; other commits and author records were retained. GitHub may still serve unreachable old commits by SHA, so this does not purge caches or existing clones. |
| Commit bodies, README, AI_USAGE.md, PROMPTS.md, docs/DEVELOPMENT.md | AI tool disclosures and co-author trailers, including historical tool-use statements. | Preserved because the assessment requires truthful AI disclosure. This session used Codex; new commits disclose that tool. |
| `client-side/src/pages/__tests__/VehicleDetails.test.jsx` | `admin@gmail.com` was a synthetic test account, not an author. | Changed to `admin@example.com`. |
| `docs/phase11.md` | `testuser1@gmail.com` was an example login identity. | Changed to `testuser1@example.com`. Phase documents remain historical notes, not current instructions or raw AI logs. |
| Backend/frontend tests, README examples, UI placeholders | `adminuser`, `normaluser`, `testuser`, `testuser1`, `admin`, `user`, and `*@example.com` represent test roles and example accounts. | Kept distinct so permission tests remain meaningful. They are not contributor identities. New screenshots use a local demo account named Shashank Bhat. |
| Login/Register, Navbar, application title | AutoVault is the existing product name. | Retained; removed unsupported fleet, usage and uptime figures. |
| `client-side/README.md`, unused React/Vite assets, package lockfiles | Scaffold/tooling references and dependency metadata. | Replaced the boilerplate frontend README. Dependency identities and licensing metadata are not reassigned to Shashank; unused assets are preserved. |
| `.gitignore` PEP 582 comment | An unrelated template example was present. | Removed the example attribution, retaining the ignore rule. |
| `server-side/alembic.ini`, `.env.example`, workflow YAML | Generic database usernames, placeholder URLs and disposable CI credentials. | These are examples, not human credits. No actual account credentials were introduced. |
| Pre-existing `outputs/` assets | Historical screenshots and demonstration identities. | Preserved; README now shows fresh screenshots from `outputs/review/`. |

Scope: tracked source, comments, tests, documentation, package metadata, Git configuration/remotes, all locally available commit authors/committers/messages, historical README identity changes and visible GitHub repository metadata. Dependency maintainer/funding links are supply-chain references, not project collaboration claims. This audit cannot certify the provenance of every dependency, image or historical code fragment.

**Ownership, authorship and history differ:** the GitHub account owns this repository; Shashank states he created the project; Git records identify who recorded changes. These facts do not justify erasing genuine credits or claiming sole authorship of third-party libraries or AI assistance. No new human contributor is asserted by this audit.

## Requirements and limits

- Required stack, persistent storage, registration/login, JWT, vehicle CRUD/search and admin permissions are implemented. Stock arithmetic runs in SQL; purchases include `quantity >= requested` in the same UPDATE, preventing simultaneous buyers from selling the last unit twice.
- Validation rejects whitespace-only vehicle fields, explicit null updates, invalid pagination/ranges, non-integer stock changes and registration passwords outside the supported bcrypt size. Prices match `Numeric(10,2)` precision.
- React provides purchasing, admin create/edit/delete/restock, search and pagination, accessible labels, loading/errors, responsive navigation, keyboard focus and reduced-motion support.
- A fresh database may have no inventory records. The catalog now distinguishes an empty inventory from filters with no matches and gives admins a direct way to add the first vehicle. README demo setup explicitly uses the admin form; no sample inventory was written into the configured local database.
- Tests use real file-based SQLite and fresh migrations. This session does not claim local PostgreSQL verification, measured coverage, full accessibility certification or a public deployment.
- Purchasing is an inventory decrement, not payment/order processing. Prices display in INR. In-stock filtering now runs in the database before pagination; server search covers make/model/category/price. An exactly full final page can offer one empty next page; Previous remains available.
- Admin editing intentionally sets an absolute stock count; use purchase/restock for movements. Audit trails, optimistic locking of admin edits, refresh tokens and rate limiting are outside this implementation.
- Tokens remain in localStorage. Public deployment still requires HTTPS, suitable CORS, strong environment secrets, backups and an appropriate session/security policy.
- PROMPTS.md lists seven existing public conversation links; additional source records and the owner's personal reflection are not present. The links' current availability has not been rechecked.

## Interview walkthrough

Trace a purchase from the React handler through `vehicleApi.js`, the authenticated request helper, FastAPI dependencies and conditional SQL UPDATE. Explain why checking stock in Python before writing fails across requests. Show stale-session and four-buyer tests, schemas, admin dependencies, migration smoke tests and React form tests. Explain the limits above instead of claiming unimplemented production features.
