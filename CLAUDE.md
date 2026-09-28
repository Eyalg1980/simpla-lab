# Simpla Lab

Umbrella repo for all live web projects Eyal builds with Claude. Each project lives in its own folder; the root `index.html` is the lab index listing all projects.

This file is loaded into every session, so it holds only the hard rules and a map. The detail lives in the files below: read the one that matches your task before you start, not all of them.

## Read before you…

| Task | Read |
|---|---|
| Push anything, from any repo (tokens, cloning, syntax gate, verification, sandbox limits) | [`DEPLOY-RUNBOOK.md`](DEPLOY-RUNBOOK.md) |
| Touch any UI: app bar, colours, icons, fonts, and the `hachug-sheli` exception | [`docs/design-language.md`](docs/design-language.md) |
| Write desktop CSS or change a layout | [`docs/responsive-contract.md`](docs/responsive-contract.md) |
| Generate with Higgsfield, import its images, burn Hebrew captions, or plan a credit budget | [`docs/higgsfield.md`](docs/higgsfield.md) |

Each rule has exactly one home. When you learn something new, add it to the file it belongs in (or a new `docs/` file plus a row above), never a second copy here. Copies drift: that is exactly what broke the morning brief on 5.8.2026.

## Hard rules (always apply)

- **Parallel sessions.** Several Claude sessions edit these repos at once. Always `git fetch` and rebase onto the remote before pushing, never force-push over someone else's commit.
- **Deploy gate.** A push without a passing `tools/jscheck.py` run is a failed run. `daily-board` is a **private** repo and needs the auth header to clone.
- **Version stamp.** Bump the page version stamp on every UI change, Eyal's in-app browser caches aggressively.
- **Mobile is frozen.** Desktop CSS only goes in `@media (min-width:1024px)` blocks appended at the end of a stylesheet. If a mobile pixel moves, the change is wrong.
- **No emojis in UI chrome.** Icons are single-colour inline stroke SVG using `currentColor`.
- **`hachug-sheli/` is a deliberate exception** to the family design language. Never "fix" it to match.
- **Higgsfield credits are shared** with the scheduled tasks. Read `balance` immediately before and after any batch.
