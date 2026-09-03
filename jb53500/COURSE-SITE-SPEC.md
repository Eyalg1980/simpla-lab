# COURSE-SITE-SPEC

The reference specification for a **John Bryce course workspace site**. `jb53500/index.html` in this repo is the working implementation and the template: copy it, empty the data, refill.

Last verified against the live file: 23.8.2026.

---

## 0. What this thing is

One self-contained HTML file that serves a whole course to three different audiences at once:

- **pedagogy** (the syllabus and the project method),
- **lecturers** (what to demonstrate in every meeting, how to grade),
- **sales and marketing** (personas, differentiation, objections).

It is not a marketing page and not an LMS. It is the single place where "what does this course actually contain" is answered, so that every lecturer, every cohort and every salesperson works from the same file.

Design constraints that follow from that:

- **One file.** No build step, no framework, no bundler. It opens by double-click from a USB stick and it deploys by copying one file.
- **No backend.** Anything that needs a server is out of scope, including real authentication.
- **Content lives in data, not in markup.** Everything that changes between course versions sits in JavaScript consts at the bottom of the file.

The only network dependency is Google Fonts (Heebo for Hebrew, Poppins for Latin). Offline it falls back to system fonts and stays fully usable.

---

## 1. Document shell

```
<html lang="he" dir="rtl">
  <head>  meta, title, favicon (inline SVG data URI + .ico + apple-touch-icon), theme-color, fonts
  <style> ~560 lines, tokens first, then layout, components, responsive, print, gate
  <body>
    #gate            access overlay, covers everything until a role is chosen
    header.mtop      mobile-only sticky bar: brand chip, course name, current area name
    .shell
      aside.rail     264px navy sidebar: .brand, nav#nav, .rail-foot (version + who is logged in)
      main.main > .wrap
        section.page#p-home
        section.page#p-<area>   one per area
  <script>          data consts, render functions, section builder, gate
```

### Tokens

```
--navy:#1B2D6B      structure: rail, table headers, headings
--coral:#E4002B     John Bryce red: accents, section icons, active states
--char:#3D3D3D      charcoal, replaces the old yellow accent
--cream:#F6F5F3     page ground        --paper:#FFFFFF  cards
--ink / --ink-2 / --ink-3           text, secondary, tertiary
--line:#E2E2E2  --dash:#C9C9C9      borders
--radius:8px  --radius-s:5px  --rail:264px  --max:1420px
```

Hebrew body text is Heebo. Latin words and all numerals that should read left-to-right get `class="en"` (Poppins, `direction:ltr`, `display:inline-block`).

---

## 2. Areas and navigation

An area is `<section class="page" id="p-KEY">`. Only the one with `.on` is displayed.

```js
setArea('syllabus')   // toggles .on on the page and on the nav button, updates #msec, scrolls to top
```

Every nav button carries `data-p="KEY"` and **two labels**:

```html
<button data-p="syllabus"><svg class="ico">…</svg>
  <span class="nl">סילבוס ומפגשים</span>   <!-- desktop, full -->
  <span class="ns">סילבוס</span>            <!-- mobile tab bar, short -->
</button>
```

The seven areas in the reference build: `home`, `syllabus`, `project`, `guide`, `teachers`, `marketing`, `glossary`. Add or drop areas freely; keep `home` first and keep `FULL` in the gate section in sync.

Home is a hero with four `data-ed` stat tiles plus a `.quick` grid of `.qb` buttons carrying `data-go="KEY"`, which are the same navigation by another route.

### Responsive

| breakpoint | what changes |
|---|---|
| ≤1100px | rail narrows to 224px, 3-4 column grids collapse to 2 |
| ≤900px | **rail becomes a fixed bottom tab bar**, `.mtop` appears, `.nl` hides and `.ns` shows, `.wrap` gets 100px bottom padding |
| ≤700px | all grids to one column, hero and card padding shrink, tables keep a min-width and scroll |
| print | rail hidden, all accordions forced open |

---

## 3. The auto-section contract

**This is the rule that shapes how you author every page.** Write each page as a *flat* list of elements. Do not nest anything in wrappers.

```html
<section class="page" id="p-syllabus">
  <div class="hero">…</div>
  <h2 class="sec">מפת המודולים</h2>
  <table id="modmap"></table>
  <h2 class="sec">הסילבוס המפורט</h2>
  <div class="legend">…</div>
  <div id="mods"></div>
</section>
```

On load, `buildSections()` walks every page and turns each `h2.sec` plus all following siblings, up to the next `h2.sec`, into a collapsible `.sect` that starts **closed**. It injects the icon badge, the title span and the chevron, sets `role="button"`, `tabindex="0"` and `aria-expanded`, and binds click, Enter and Space.

Two consequences you must not forget:

1. **The heading text is the icon key.** `SIC` maps the exact heading string to an inline SVG path set (24x24 viewBox, stroke-only, no fill). Rename a heading and its icon silently reverts to `DEFIC`, the generic plus-in-a-circle. Update `SIC` in the same edit as the rename.
2. **Never hand-write `.sect`.** `buildSections()` skips any page that already has a direct `.sect` child, so one hand-written wrapper disables the whole mechanism for that page.

---

## 4. The editions contract

A John Bryce course usually runs in more than one format. This site carries both in one file.

```js
const ED = {
  eve:  { key:'eve',  label:'29 מפגשי ערב',  short:'ערב',  meetings:29, per:'4.5',
          study:130.5, self:95, total:225.5, when:'…', mods:[…] },
  morn: { key:'morn', label:'20 מפגשי בוקר', short:'בוקר', meetings:20, per:'6.5', … }
};
let curEd = 'eve';
```

`applyEdition(k)` does four things, in order:

1. sets `curEd`,
2. toggles `.on` across `[data-ed-set]` switch buttons,
3. rewrites `textContent` of **every** `[data-ed="field"]` element from `ED[k][field]`,
4. re-runs every render function, then `wrapTables()`.

So there are exactly two legal ways to express a value that differs between formats:

- **In markup:** `<span data-ed="meetings">29</span>`
- **In data:** paired keys with an `E` / `M` suffix, read through a helper: `mtE`/`mtM` (which meetings), `dueE`/`dueM` (submission dates), accessed as `curEd==='morn' ? s.mtM : s.mtE`.

**Never hard-code a per-format number in markup.** That is exactly how one format goes stale while the other stays correct, and nobody notices for a semester. When you change anything numeric, ask which of the two mechanisms carries it.

Content that is genuinely identical in both formats (the student guide page, for example) is plain static markup and is correct for both by construction. Say so out loud when someone asks you to verify a change "in the other format" - and then verify it anyway, in a browser.

---

## 5. The data layer

Everything below `<script>` other than functions is content. This is the whole editable surface.

| const | shape | drives |
|---|---|---|
| `ED` | `{eve, morn}`, each with stats and `mods[]` | module map table, detailed syllabus accordions, every stat tile |
| `PROJECTMAP` | `[{n,t,mod,mtE,mtM,tool,what,demo}]` | project stage table and stage accordions |
| `SUBS` | `[{n,t,mod,mtE,mtM,dueE,dueM,w,time,nocheck,what[],how[],bar,flag}]` | submission points: what is handed in, how the lecturer checks it, pass bar, red flag |
| `PREP` | per-module lecturer slides | the preparation deck |
| `TOOLS`, `TOOLCATS`, `DEPCLS` | rows + category chips + depth classes | the tools table with filtering |
| `EX` | `[{n,tag,p,u,w,a,b}]` | final-project idea cards: problem, user, what it does, AI layer, automations |
| `T`, `CATS` | `[term, hebrew, category, definition, where-taught]` | the glossary with search and category filter |
| `SIC`, `DEFIC` | heading text to SVG paths | section icons |
| `ROLE_AREAS`, `CODES`, `MASTER`, `SALT` | | the access gate |

A module inside `ED[k].mods[]`:

```js
{ n:3, t:'בניית אפליקציות', intro:'…', tools:'Whimsical, Canva, …',
  mt:'7-13', h:31.5,
  M:[ { n:'7', parts:[ { t:'אפיון אפליקציות ו-MVP',
                         top:['…'],          // topics taught
                         tools:['Whimsical'],
                         rl:['אפיון MVP'],   // rolling-project homework for that meeting
                         note:'…',           // lecturer note, optional
                         demo:'…',           // what to demonstrate on the accompanying project
                         key:'7' } ] } ] }
```

`demo` is the field that aligns lecturers: every meeting carries a written demonstration on the shared accompanying project, so no lecturer has to invent an example and no two classes see different ones.

### Render functions

One per block, all idempotent, all re-run by `applyEdition`:

`renderSyllabus` · `renderStageMap` · `renderStages` · `renderSubs` · `renderSlides` · `renderGuide` · `drawTools` · `drawTerms`

Each writes `innerHTML` into a single container id. Expand-all helpers (`allMods`, `allStages`, `allSubs`, `allSlides`, `allEx`) are wired to `.toolbar` buttons.

---

## 6. Components

**Accordions**, three flavours with one idiom: `.mod` (meetings), `.stage` (project stages), `.slide` (submissions, ideas, prep slides). Each is `-head` (click toggles `.open` on the parent), an optional `-peek` shown only while closed, and `-body` shown only while open. The chevron rotates. Print CSS forces them all open.

**Tables.** Author a plain `<table>`. `wrapTables()` wraps it in `.twx > .tw`, inserts a `.thint` hint above it ("scroll sideways to see the full table"), and turns the hint and the fade on **only when the table actually overflows**. It runs on load, on resize, and 60ms after any nav or accordion click, because a table inside a closed section has no measurable width until the section opens.

**Cards.** `.card` in a `.grid.g2/.g3/.g4`. Modifiers: `.y` (soft positive), `.n` (soft alternative), `.dash` (dashed, for "what not to do"). Numbered cards use `<span class="num">1</span>` inside the `h4`.

**Callout.** `.callout` for a single boxed note. Keep them rare; a page of callouts reads as a page with no hierarchy.

**Chips.** `.chips > .chip` for category filters, `.chip.on` for the active one, with a `.count` line under it.

---

## 7. The access gate

A **soft barrier, deliberately not security.** Say this to the client in plain words, every time, before they ask.

- `#gate` overlays everything until a role is chosen. Role and area map:
  ```js
  const FULL = ['home','syllabus','project','guide','teachers','marketing','glossary'];
  const ROLE_AREAS = { lecturer:FULL, admin:FULL, owner:FULL, student:['syllabus','guide'] };
  ```
- `applyAccess()` hides nav buttons and home quick-cards outside the allowed list, and `setArea()` clamps any attempt to reach a forbidden area to the first allowed one. Both layers matter: hiding a button is not access control on its own.
- Codes are stored as `sha256(SALT + code)`, never as plaintext, so the code does not appear in the published source. A separate `MASTER` hash grants the `owner` role from any dropdown selection.
- The SHA-256 is a **pure-JS implementation on purpose**: `crypto.subtle` is unavailable on `file://`, and the file must work when opened by double-click.
- The chosen role persists in `localStorage`; the logout button in the rail foot clears it.

**The honest caveat, which belongs in your handover message:** the repository is public, the salt is visible in the source, and short patterned codes are brute-forceable. This keeps a casual visitor out of the lecturer material. It is not protection against anyone who tries. Real protection needs a server.

---

## 8. Traps that have actually bitten

1. **The geresh.** An ASCII apostrophe inside a single-quoted JS string terminates the string and blanks the entire site. Hebrew words carry one: ג׳ון, צ׳אטבוט, פרויקטי׳. Use the Hebrew geresh `׳` (U+05F3) or double quotes, in **every** string in the script. The gate against it: `python3 tools/jscheck.py index.html` from the private `daily-board` repo, exit 0 required before any push. A push without a passing run is a failed run.
2. **A renamed heading loses its icon.** See section 3.
3. **A per-format number written into markup.** See section 4.
4. **Verifying content in a headless browser and finding nothing.** Sections start closed, and `innerText` of a closed `.sect` is empty. Strip `closed` first:
   ```js
   document.querySelectorAll('.sect').forEach(s => s.classList.remove('closed'));
   ```
   Otherwise you will "prove" that correct text is missing.
5. **A line that starts with Latin characters** gets reordered by the bidi algorithm and jumps to the wrong end. Start every line with a Hebrew word; put brand names mid-line or at the end.
6. **Editing the site while someone else edits it.** The client edits this file himself. Before applying changes, pull, and if his version diverged, do a three-way `git merge-file` rather than overwriting. Losing his section is worse than being slow.

---

## 9. Editorial rules

The writing is half the product. These are not style preferences, they are what makes the file usable by three audiences at once.

- **Hebrew, plain, no jargon in the first screen of any area.** Terminology is introduced where it is taught, and the glossary holds the definitions.
- **Every claim concrete.** "קישור חי שנפתח בדפדפן אחר" beats "פרויקט מוגמר". A lecturer must be able to check it in ten seconds.
- **Tables carry the operational truth** (what to submit, review minutes, weight, when). Prose carries the why. Do not mix them.
- **Every area opens with a `.hero`** that says what this area is and who it is for.
- **No em dashes and no arrow characters.** Hyphen, comma, or words.
- Latin mid-line or end of line, never at the start.
- A submission point that is not graded says so loudly. Ambiguity about grading is what generates the support calls.

---

## 10. Build and publish checklist

- [ ] Source of truth read first: the syllabus document and the meetings spreadsheet. Nothing about module content is invented.
- [ ] Content modelled as data before any markup is written.
- [ ] Every page authored flat, with `h2.sec` headings, and every heading present in `SIC`.
- [ ] Every per-format value carried by `data-ed` or an `E`/`M` key pair.
- [ ] Verified in headless chromium: **both editions**, every area, sections force-opened, keyword counts checked.
- [ ] `python3 tools/jscheck.py index.html` exits 0.
- [ ] Published per `DEPLOY-RUNBOOK.md` in the repo root: auth header form, `main` only, never force-push.
- [ ] Push verified with `git fetch origin main && git log origin/main..main` returning empty.
- [ ] A local copy saved to the client's own folder, with a short README naming what each file is.
- [ ] Superseded files moved to a `TO DELETE` folder with a note explaining, per file, what replaced it and why keeping it is dangerous.

The downloadable student guide that sits next to `index.html` is built with the `hebrew-rtl-docx` skill, and must live in the same folder so the relative download link works locally as well as on Pages.
