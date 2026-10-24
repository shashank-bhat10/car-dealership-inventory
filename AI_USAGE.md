# My AI Usage

## Confirmed ChatGPT assistance

ChatGPT was used for requirement review, test writing, code changes, debugging, documentation and GitHub operations. In the current fixes it helped:

- Write and run failing tests for the missing admin editor.
- Implement editing through `updateVehicle` and separate the form from the details page.
- Write and run failing tests against fresh migrated databases.
- Fix and simplify Alembic configuration and SQLite migration compatibility.
- Correct setup/test instructions and add GitHub Actions.
- Check conversation links without signing in.

The exact new test-first commits and observed results are listed in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md). No earlier implementation is retrospectively claimed to have followed TDD.

## Earlier tool-use statements

The earlier documentation states that Amazon Q assisted project planning and Gemini assisted UI ideas. No Amazon Q raw conversation/export was available in the repository. The Gemini URL returned a sign-in page when requested anonymously. These statements remain disclosed, but they are not represented as complete, verified conversation records.

Seven existing ChatGPT share pages returned conversation data without authentication. One private ChatGPT URL did not. See [PROMPTS.md](PROMPTS.md) for the accessible records and remaining gaps.

## Historical commit attribution audit

The following commits were created with ChatGPT assistance during repository setup, but their messages omitted an AI co-author trailer:

| Commit | AI involvement |
|---|---|
| `516aa60306082c9d86d152f09a7e5656a091936c` | ChatGPT created the initial README/repository commit using the GitHub tool. |
| `0826cd6c537595277202b8601552c1c606f72c92` | ChatGPT prepared and uploaded the initial project snapshot using the GitHub tools. |

This audit supplies the missing attribution without rewriting published commits. It does not retroactively add trailers to those immutable commits. All commits in the current fixes include:

```text
Commit subject

Description of the change and verification.


Co-authored-by: ChatGPT <chatgpt@users.noreply.github.com>
```

The two empty lines immediately before the trailer are intentional.

## Reflection on the recorded workflow

**Reflection on the recorded workflow (drafted by Codex):** AI assistance helped turn broad assessment requirements into focused checks and changes while retaining the existing application. The strongest example is inventory safety: failing tests exposed overselling, and a conditional database update made the stock check and decrement atomic. The later stock-filter tests exposed another concrete issue: filtering only the displayed page could hide available vehicles elsewhere in the database.

AI output also required correction. An overlapping test run interfered with the shared test database, an intermediate frontend edit introduced a syntax error, and an older document contained unsupported coverage claims. These were identified and corrected, with the failed attempts and final verification recorded in TEST_REPORT.md. This experience supports using executable tests, reviewed diffs and accurate documentation as evidence, rather than treating generated code or confident prose as proof of correctness.

Shashank supplied the requirements, directed the work to preserve the existing project, and requested improvements and transparent AI attribution. Codex performed the recorded implementation, automated checks and documentation edits. This reflection describes observable work; it does not claim that Shashank personally ran those checks, independently reviewed each change, or had particular learning experiences. A personal account cannot be inferred from assistant activity.

## Records still needed

The full raw export or public share link for the private ChatGPT conversation, the Gemini conversation, Amazon Q usage, and the ChatGPT sessions used for the repository fixes must be supplied by the account owner. No substitute conversations or AI-written summaries are presented as raw logs.

## Codex review on 24 October 2026

Codex inspected the existing repository and assessment, wrote and ran regression tests before behavior changes, fixed stock concurrency and validation, improved UI accessibility and mobile navigation, updated dependencies, captured actual application screenshots, and prepared documentation and Git changes. Results are in TEST_REPORT.md. The codebase was retained rather than recreated.

No new Gemini or Amazon Q use is claimed. Existing statements above describe prior repository records and were not independently revalidated in this session. Historical ChatGPT trailer text and commit author records were retained during the later repository history rewrite, which removed the obsolete README attribution. New assisted commits use `Co-authored-by: Codex <AI@users.noreply.github.com>` with two empty lines before the trailer.

A public share snapshot of this Codex review was created and then removed from the current PROMPTS.md at Shashank’s request. It must still be revoked in ChatGPT settings; the previous Git commit retains its URL. Other missing records remain unavailable. This document is a disclosure summary, not a raw conversation log.

### Trailer spacing correction

The backend review commit includes the truthful Codex co-author trailer, but Git default cleanup collapsed the requested two blank lines to one. Subsequent review commits use `--cleanup=verbatim` to preserve exact spacing. The later history rewrite preserved that trailer and its spacing.
