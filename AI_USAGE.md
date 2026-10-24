# My AI Usage

This disclosure distinguishes current, observable work from tool-use statements recorded in earlier project documentation. Conversation records are indexed in [PROMPTS.md](PROMPTS.md); test evidence is in [TEST_REPORT.md](TEST_REPORT.md).

## Codex — 24 October 2026 review

Codex inspected the supplied assessment and existing repository, added failing regression tests for the stock filter, changed the API and frontend so the stock filter applies before pagination, corrected unsupported coverage claims, updated documentation, ran automated checks, and committed and pushed the changes. The existing application was retained.

The recorded final checks were 121 backend tests passed with one existing deprecation warning, 74 frontend tests passed, and frontend lint and production build passed. TEST_REPORT.md also records failed intermediate attempts, including overlapping backend tests that interfered with the shared test database and a temporary JSX syntax error that was fixed before the final run. These checks were performed by Codex.

A public share of the Codex conversation was briefly created, then removed from the current project files at Shashank's request. The URL remains in an earlier public Git commit and the share must be revoked separately in ChatGPT Settings → Data controls → Shared links → Manage. It must not be recreated.

## Earlier AI-use records

Earlier project documentation records ChatGPT assistance with repository setup and fixes. It also reports Amazon Q planning assistance and Gemini UI ideas. These records are preserved as historical disclosures; not all original conversations or exports are available in this checkout. PROMPTS.md identifies the accessible links and missing records. No missing transcript is reconstructed here.

## Owner reflection

The README contains a clearly labeled owner reflection draft based on documented decisions and events. It was drafted by Codex and should be retained only if it accurately reflects Shashank's view. It distinguishes Codex-run checks from the owner's actions and does not claim personal testing that is not evidenced.

## Git attribution

The repository audit records historical commits made with AI assistance whose messages lacked co-author trailers. Those immutable commits were not rewritten to add trailers. New AI-assisted commits from the recent review use:

```text
Co-authored-by: Codex <AI@users.noreply.github.com>
```

The required blank lines before the trailer are preserved in the new commits.
