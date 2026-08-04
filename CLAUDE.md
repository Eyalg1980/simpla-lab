# Simpla Lab

Umbrella repo for all live web projects Eyal builds with Claude. Each project lives in its own folder; the root `index.html` is the lab index listing all projects.

## Deploy workflow (for Claude sessions)

- Owner: `Eyalg1980`. Related repo: `ai-post-brainstorm` (daily post-idea brief).
- The Cowork GitHub connector binds repos per session and usually has NO push access here. Push with Eyal's fine-grained PAT "claude-cowork" (scoped to this repo + ai-post-brainstorm, Contents + Pages read/write). The token is stored in the Claude memory file `git-deploy` (/areas/git-deploy.md) - read it from there; only ask Eyal to paste it if memory is unavailable.
- Push over git HTTPS with the PAT as password (username `x-access-token`). The sandbox proxy blocks the `api.github.com /pages` endpoint, so Pages cannot be enabled/configured via API.
- GitHub Pages serves from `main` (switched 4.8.2026). A single push to `main` goes live. The old `gh-pages` branches were deleted - do not recreate or push them.
- Live URLs: https://eyalg1980.github.io/simpla-lab/ and https://eyalg1980.github.io/ai-post-brainstorm/
- The egress proxy blocks direct curl to `*.github.io`; verify deploys with the WebFetch tool instead.
- When adding a project: create `<project>/index.html`, add a card for it in the root `index.html`, push `main`.
- Language: Hebrew RTL, mobile-first. No em dashes in any copy (Eyal's rule).

## Design language (the Daily Board family, settled 1.8.2026)

All the live apps (Daily Board, Post Brainstorm, Daily Director) and this lab index share one structure. New projects follow it:

- **Sticky app bar** at the top of every screen: a round back button on the right (RTL arrow pointing right, driven by an internal `navHist` stack, disabled when there is nowhere to go back to), the wordmark centred, a spacer on the left. Any new screen must be reached through the app's `go()` helper so the in-app back button and the phone's own back gesture both work.
- **One accent colour per app**, used for all its chrome (app bar, tabs, hero, primary buttons, footer): Daily Board yellow `#FFE94A`, Post Brainstorm coral `#FF6B5E`, Daily Director neon green `#71F73C`. Content inside an app may carry a second level of colour by tag, but never a third.
- **Icons are single-colour inline stroke SVG** that inherit `currentColor`, kept in one icon map per file. NO emojis, no icon fonts. RTL-asymmetric glyphs (checklists, speech bubbles) are mirrored with `transform="translate(24,0) scale(-1,1)"`.
- Dashed pills and dashed borders are the family texture. Rubik for Hebrew, Poppins for the Latin wordmarks.
- Bump the page version stamp on every UI change, Eyal's in-app browser caches aggressively.
- NOTE: several Claude sessions edit these repos in parallel. Always `git fetch` and rebase onto the remote before pushing, never force-push over someone else's commit.

## Responsive contract (settled 1.8.2026)

The apps are **mobile-first and the mobile rendering is frozen**. Desktop is added on top, never by editing a mobile rule.

- **All desktop CSS lives in `@media (min-width:1024px)` blocks appended at the END of the stylesheet.** Never change an existing rule to "make it work on both". If a mobile pixel moves, the change is wrong. Verify with a full-page screenshot diff at 390px before pushing: only live content (a clock) and the version stamp may differ.
- **Breakpoints:** `1024px` = desktop (side rail + 2 columns). `1500px` = 3 columns. Storyboard pages step up at `1440px`. Nothing between 0 and 1023px is ever targeted.
- **Desktop shell:** the bottom nav (Daily Board) / sticky tab pill (Post Brainstorm, Daily Director) becomes a **fixed 236px rail on the RIGHT**, and the app bar moves to the top of that rail carrying the wordmark and the back button. Shared tokens, declared inside the media block:
  `--rail:236px; --band:1400px; --gut:28px; --railx:max(0px, calc(50% - (var(--band) / 2)))`
  Body becomes `max-width:var(--band); padding:0 var(--gut) 56px; padding-inline-start:calc(var(--rail) + var(--gut))`, and both the rail and the app bar are pinned with `right:var(--railx)` so the rail stays glued to the content band instead of the screen edge.
- **The rail must never disappear mid-session.** Post Brainstorm's rail lives inside `#scr-app`, so the approach screen keeps it alive with `#scr-app:not(.active){display:block}` plus `#scr-app:not(.active) > *:not(.navwrap){display:none !important}`.
- **Where JS writes an inline `display`** (Post Brainstorm's `apply()` stamps `display:block|none` on `#feed`/`#approaches`/`#links`), a stylesheet grid cannot win. Target `#approaches[style*="block"]{display:grid !important}` so the rule only fires while the tab is shown. Never use a bare `!important` there, it would pin the tab open.
- **Full-bleed heroes** (`width:100vw`, Daily Director) must be pulled back in at desktop, otherwise they run under the rail: `width:auto` plus `margin-inline: calc(var(--gut) * -1)`.
- **Cards go multi-column with `grid`, uneven card stacks with `columns`.** Grid needs `align-items:start`; anything that must span gets `grid-column:1/-1` (grid) or `column-span:all` (columns). Where the repeating cards are flat siblings of a heading (`#feed section`, `#ideas section`, `.lk-cat`), grid the parent and span the heading.
- **Tall portrait images need a height cap on desktop.** A `9/16` image at `width:100%` in a 550px column is 970px tall. Use `width:auto; max-width:100%; max-height:…; margin-inline:auto`.
- **Storyboards:** the shot list is a real frame board, `#sec-shots .sec-b` as a grid with the ratio/media switches spanning. A shot with its prompts open widens itself via `.shot:has(details[open]){grid-column:1/-1}`. `shotsBlock()` rebuilds that innerHTML on every ratio switch, so any wrapper must come from CSS, never from injected DOM.
- `sb.css` and `sb.js` are shared by every storyboard page and cache hard. **Bump the `?v=` on the `<link>` and `<script>` in all storyboard pages whenever either file changes.**
