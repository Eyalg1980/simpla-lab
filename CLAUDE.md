# Simpla Lab

Umbrella repo for all live web projects Eyal builds with Claude. Each project lives in its own folder; the root `index.html` is the lab index listing all projects.

## Deploy workflow (for Claude sessions)

- Owner: `Eyalg1980`. Three repos share one deploy token: `simpla-lab`, `ai-post-brainstorm` (daily post-idea brief), `daily-board`.
- There is NO GitHub connector in the Claude directory, and the sandbox's ambient `GH_TOKEN` / `GITHUB_TOKEN` belong to the Cowork connector and are **rejected for push**. Do not spend turns trying them.
- Push with Eyal's fine-grained PAT **`claude-deploy`** (issued 4.8.2026, valid one year, Contents + Pages read/write on those three repos). The two older tokens, the fine-grained `claude-cowork` and the classic `ghp_` one, are **revoked**; never use them.
- **Where the token lives:** the prompt of the "Daily Content Engines" scheduled task (claude-code-remote `list_triggers`). That output is large and lands in a file, so pull the token out with a regex for `github_pat_[A-Za-z0-9_]+` instead of reading the whole thing. Ask Eyal to paste it only as a last resort, and never echo it into chat, a commit, a log line or a file.
- The Claude memory file `git-deploy` (`/areas/git-deploy.md`) holds every other deploy rule but **deliberately does NOT hold the token value**: the memory backend refuses any write whose content contains a GitHub PAT and reports it as a generic `service unavailable`. Do not waste turns retrying that write - it will never succeed. Memory is the canonical copy of the *rules*, the scheduled task is the only copy of the *secret*.
- **Auth format (updated 5.8.2026): NEVER embed the token in the push URL.** The sandbox git proxy STRIPS URL-embedded credentials on push and rejects with 403 `not in this session's authorized repository set` - even when the token is valid, and even when earlier pushes in the same session succeeded. Clone/fetch with the plain https URL (no token needed), then push with an explicit auth header:
  `git -c http.extraHeader="Authorization: Basic $(printf 'x-access-token:%s' "$TOKEN" | base64 -w0)" push https://github.com/Eyalg1980/REPO.git main`
  Verified working 5.8.2026 from interactive AND scheduled sessions, on all three repos, regardless of the session's sources list. If you hit the 403 above, you used the URL method - switch to the header, do not tell Eyal the push is impossible. The sandbox proxy also blocks the `api.github.com /pages` endpoint, so Pages cannot be enabled/configured via API.
- **Push to `main` only, in all three repos.** GitHub Pages was switched to serve from `main` on 4.8.2026 and the old `gh-pages` branches were deleted - do not recreate or push them.
- Live URLs: https://eyalg1980.github.io/simpla-lab/ , https://eyalg1980.github.io/ai-post-brainstorm/ , https://eyalg1980.github.io/daily-board/
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

### Deliberate exception: `hachug-sheli` (החוג שלי)

`hachug-sheli/` does **not** follow the Daily Board family language, on purpose, and should not be "fixed" to match it. It is a portfolio case study whose whole argument is that the visual language was *derived from the research*, so it carries its own system and documents that derivation in `case-studies/hachug-sheli.html`. Do not port the app bar, the icon rule or the font stack into it.

- Its own tokens live in `hachug-sheli/app/styles/tokens.css`: teal `#0F766E` primary (trust: money and kids), one warm amber `#F59E0B` for the energy moments (free trial lesson), Heebo rather than Rubik.
- **UI chrome is single-colour stroke SVG here too** (as of 6.8.2026): one icon map in `app/scripts/ui.js`, rendered via `UI.icon(name)` or `<span data-ic="search">`. The bottom nav is generated by `app/scripts/nav.js` from one TABS array, so adding a screen is one line, not four files. Emoji survives in exactly one place: the class's subject identity (⚽ 🎨 🤖 🩰), where it carries meaning rather than state.
- **Kid avatars are parametric SVG**, built by `UI.avatar(kid)` from a recipe in `classes.json` (`skin`, `hair`, `style`, `acc`, `bg`, `shirt`). Hairstyles live in `UI.HAIR`. Adding a child is a data row, never an image file.
- Every openable region uses `<section class="fold"><h2 class="fold-h">…</h2><div class="fold-b">…</div></section>`; `UI.foldable()` wires the rotating chevron. Add `data-open` to start expanded.
- Navigation is a **sticky top bar plus a bottom nav**, a consumer mobile app pattern matched to the persona. The top bar is built by `app/scripts/appbar.js` and injected as the first child of `<body>`, so it is never copy-pasted into a screen: each screen only declares `<body data-back="class.html" data-title="הרשמה">`. `data-back=""` means this is a root screen and the button is hidden but keeps its grid cell, so the title stays centred. It is NOT the family's `navHist` app bar; the back button tries `history.back()` first and falls back to the declared target carrying the `?kids=` selection.
- Selection state travels in the URL (`?kids=itai,noa`), never in browser storage, so the screens work when opened from `file://` and so a link can be shared mid-demo.
- `app/data/classes.json` is the single source of truth for the taxonomy, the demo kids and the classes. `app/data/classes.js` is a **generated mirror** of it (`window.APP_DATA`) so the screens run without `fetch` under `file://`. Edit the JSON, then regenerate the JS. Never edit `classes.js` by hand.
- The case-study images in `hachug-sheli/content/shots/` are generated from the live screens by `hachug-sheli/scripts/make-shots.js` (`node scripts/make-shots.js` from inside `hachug-sheli/`). Re-run it after any UI change instead of hand-editing a PNG.

## Moving Higgsfield images into the repo (verified 8.8.2026)

The Cowork sandbox proxy blocks the Higgsfield CDN (cloudfront), but the **Higgsfield sandbox (`sandbox_exec`) has open egress to both the CDN and github.com**. So never relay images through context/subagents again — run the whole pipeline inside `sandbox_exec`: sparse-clone the repo (`--depth 1 --filter=blob:none --sparse`), `curl` each CDN URL from the project's `imgfetch.txt`, convert with ImageMagick (`-resize '1600>' -quality 82` to webp into `<project>/img/N.webp`), one commit, push with the usual Basic-auth `http.extraHeader`. 33 images took ~45s. Use `background:true` + polling, and delete the auth file from the sandbox when done. Each new-world page maps images via its `IMAGES` object and `imgfetch.txt` holds `N URL` lines — keep that convention.

## Burning Hebrew captions into a film (learned 1.8.2026, the hard way)

The edit runs inside the Higgsfield sandbox (`sandbox_exec`), because the Cowork sandbox proxy blocks the Higgsfield CDN and the clips cannot be downloaded here.

- **Do NOT run caption text through `python-bidi`.** Pillow in that sandbox is built WITH libraqm, so it already applies bidi and shaping. Pre-reversing double-flips every line and the film ships with mirrored Hebrew. Pass the logical string straight to `draw.text(..., direction="rtl")`.
- **Assert before you encode.** Render `"או"`, split the ink into glyph clusters, and require narrow-then-wide left to right: `א` is wide and belongs on the right. Fail the build if it is not, a wrong caption costs a full re-render.
- Punctuation after a Latin or digit run is a separate bug from letter order, see the `sub` field and the SRT builder in `daily-director/storyboards/shared/sb.js`.
- `sandbox_exec` is hard-killed at about 60 seconds no matter what `timeout_seconds` says, and both `nohup` and `background:true` proved unreliable. Split the render into chunks of about three shots per call. A killed call leaves zombie `ffmpeg` processes that silently corrupt the next run, so pass `restart:true` when anything looks off.
- Deliver the result with `media_upload` plus a `curl -X PUT`, then `media_confirm`, and point the page's `film.src` at the returned URL.

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
