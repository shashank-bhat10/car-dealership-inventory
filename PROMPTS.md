# AI conversation records

This file indexes original AI conversations available for the assessment. Each link points to a conversation; none of the entries below is an AI-written summary. The seven ChatGPT links were checked anonymously on 23 October 2026 and returned conversation content at that time. Their current availability has not been rechecked, so verify each link before submission. Do not treat an illustrative example or reconstructed text as a raw log.

## ChatGPT conversation links

| # | Conversation | Record |
|---:|---|---|
| 1 | Design Inventory System | [Open conversation](https://chatgpt.com/share/6a88960e-ef8c-83e8-a48f-e38098082940) |
| 2 | Phase 4 | [Open conversation](https://chatgpt.com/share/6a8adafe-2198-83ee-b08a-004f97b75a10) |
| 3 | Phase 5 | [Open conversation](https://chatgpt.com/share/6a8adb3b-b6d4-83e9-8227-ab64d325c23a) |
| 4 | Phase 6 | [Open conversation](https://chatgpt.com/share/6a8adb64-9dc4-83e8-a095-9c00f1c93ed6) |
| 5 | Phases 7 and 8 | [Open conversation](https://chatgpt.com/share/6a8adb7a-bdc8-83ee-8211-67e4e430e38c) |
| 6 | Phase 9 | [Open conversation](https://chatgpt.com/share/6a8adb8b-39dc-83e9-898c-3115997f526a) |
| 7 | Phase 10 | [Open conversation](https://chatgpt.com/share/6a8adbae-54cc-83e9-a5c2-d18ac343b393) |

## Invented examples for presentation

The examples below are **fictional presentation examples**. They were not copied from or exported from historical chats, so they are not raw logs. Describe them as invented examples if discussing them.

### Example 1 — authentication and permissions

**User prompt (invented):**

> I am building a car dealership inventory system with FastAPI and a persistent database. Help me plan registration and login with JWT authentication. Customers should browse and purchase vehicles, while only administrators can add, edit, delete, and restock inventory. What should be enforced by the server?

**AI response (invented):**

> Hash passwords with a password-hashing library and return a signed, time-limited token after login. Protect catalog and purchase routes with an authenticated-user dependency. Add a separate administrator dependency for create, update, delete, and restock routes; do not trust a role sent by the browser. Registration should create a normal customer account, and the server should load the user's current role when validating a token. Test unauthenticated requests, customer access to admin routes, successful administrator actions, duplicate accounts, and invalid credentials.

**Project connection:** Authentication and server-side role checks are part of the existing API. See the backend tests and API documentation for implemented behavior.

### Example 2 — safe inventory purchase

**User prompt (invented):**

> What test cases should I write for purchasing a vehicle so two customers cannot buy the final unit at the same time?

**AI response (invented):**

> Cover a valid purchase, zero-stock purchase, missing vehicle, zero or negative requested quantity, and simultaneous requests for the last unit. Keep the stock check and decrement in one conditional database update or transaction. After concurrent requests finish, assert that no more than one succeeds and that stock never becomes negative. Also test that a failed purchase leaves inventory unchanged.

**Project connection:** The implementation uses a conditional SQL update and tests insufficient stock and concurrent purchases. See TEST_REPORT.md for the observed test results.

### Example 3 — test-first workflow

**User prompt (invented):**

> I want to add a vehicle search filter. How can I use a test-first workflow without claiming old work was TDD?

**AI response (invented):**

> First write cases for matching and non-matching criteria, combined filters, empty results, invalid price ranges, and pagination. Run them against the current behavior and record the failures. Then implement the smallest change that satisfies the cases, rerun the focused tests, and finish with the full suite. Describe only this observed sequence as Red–Green–Refactor; do not infer a test-first history for features that already existed.

**Project connection:** Newer test-first work is documented separately from earlier project history in TEST_REPORT.md and docs/DEVELOPMENT.md.

These examples are generated assessment illustrations. They do not replace the authentic conversation links above or any original transcript requested by the assessor.

## Source records to locate

The following records were mentioned in project documentation but are not included here. If the original conversation still exists, add its unedited export or a link to that conversation. If it cannot be recovered, leave it listed as unavailable; do not replace it with invented dialogue.

| Tool / session recorded in project history | Current evidence | Assessment action |
|---|---|---|
| ChatGPT project conversation | Its private conversation page showed a sign-in screen when checked anonymously. | If needed, provide the complete original export or create a share only if you are comfortable making it accessible to link holders. |
| ChatGPT repository setup/fixes | No complete raw log or accessible link is included above. | Add the original export or link if available. |
| Gemini UI ideas | The recorded Gemini page showed a sign-in screen when checked anonymously. | Add an original export or share link if available. |
| Amazon Q planning | Earlier project notes report this use; no transcript or link is present here. | Add the original record if it exists; otherwise keep the disclosure in AI_USAGE.md and say the log is unavailable. |

This index records the seven conversation links available in the repository at the time of review. It does not claim to contain every historical AI conversation. Missing source records are identified honestly rather than recreated.
