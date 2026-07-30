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
