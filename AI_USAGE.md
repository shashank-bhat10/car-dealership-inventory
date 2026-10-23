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

## Reflection

AI made requirement review and implementation faster, but its earlier review overlooked the edit form and migration setup. Executed tests, reviewable changes and a clean-clone run provide stronger evidence than an assistant's completion claim. I need to understand the code and explain the testing decisions in an interview.

## Records still needed

The full raw export or public share link for the private ChatGPT conversation, the Gemini conversation, Amazon Q usage, and the ChatGPT sessions used for the repository fixes must be supplied by the account owner. No substitute conversations or AI-written summaries are presented as raw logs.
