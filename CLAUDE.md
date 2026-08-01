# Simpla Lab

Umbrella repo for all live web projects Eyal builds with Claude. Each project lives in its own folder; the root `index.html` is the lab index listing all projects.

## Deploy workflow (for Claude sessions)

- Owner: `Eyalg1980`. Related repo: `ai-post-brainstorm` (daily post-idea brief).
- The Cowork GitHub connector binds repos per session and usually has NO push access here. Push with Eyal's fine-grained PAT "claude-cowork" (scoped to this repo + ai-post-brainstorm, Contents + Pages read/write). Ask Eyal to paste it if not available in the session.
- Push over git HTTPS with the PAT as password (username `x-access-token`). The sandbox proxy blocks the `api.github.com /pages` endpoint, so Pages cannot be enabled/configured via API.
- GitHub Pages serves from the `gh-pages` branch (auto-enabled by pushing that branch). After every change to `main`, also update `gh-pages`: `git branch -f gh-pages main && git push origin gh-pages`.
- Live URLs: https://eyalg1980.github.io/simpla-lab/ and https://eyalg1980.github.io/ai-post-brainstorm/
- The egress proxy blocks direct curl to `*.github.io`; verify deploys with the WebFetch tool instead.
- When adding a project: create `<project>/index.html`, add a card for it in the root `index.html`, push both branches.
- Language: Hebrew RTL, mobile-first. No em dashes in any copy (Eyal's rule).

## Design language (the Daily Board family, settled 1.8.2026)

All the live apps (Daily Board, Post Brainstorm, Daily Director) and this lab index share one structure. New projects follow it:

- **Sticky app bar** at the top of every screen: a round back button on the right (RTL arrow pointing right, driven by an internal `navHist` stack, disabled when there is nowhere to go back to), the wordmark centred, a spacer on the left. Any new screen must be reached through the app's `go()` helper so the in-app back button and the phone's own back gesture both work.
- **One accent colour per app**, used for all its chrome (app bar, tabs, hero, primary buttons, footer): Daily Board yellow `#FFE94A`, Post Brainstorm coral `#FF6B5E`, Daily Director neon green `#71F73C`. Content inside an app may carry a second level of colour by tag, but never a third.
- **Icons are single-colour inline stroke SVG** that inherit `currentColor`, kept in one icon map per file. NO emojis, no icon fonts. RTL-asymmetric glyphs (checklists, speech bubbles) are mirrored with `transform="translate(24,0) scale(-1,1)"`.
- Dashed pills and dashed borders are the family texture. Rubik for Hebrew, Poppins for the Latin wordmarks.
- Bump the page version stamp on every UI change, Eyal's in-app browser caches aggressively.
- NOTE: several Claude sessions edit these repos in parallel. Always `git fetch` and rebase onto the remote before pushing, never force-push over someone else's commit.
