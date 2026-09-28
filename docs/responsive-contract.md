# Responsive contract (settled 1.8.2026)

Read before any desktop/layout CSS work. Linked from [`CLAUDE.md`](../CLAUDE.md).

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
