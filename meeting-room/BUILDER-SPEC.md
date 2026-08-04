# BUILDER-SPEC.md

Single source of truth for **חדר הישיבות** (Meeting Room), the fourth engine in Eyal's daily family.
Live at `https://eyalg1980.github.io/simpla-lab/meeting-room/`, inside the `simpla-lab` repo.

Anything that generates, filters, stamps or archives an idea reads this file first. Rules live here, never copied into a skill or a prompt.

---

## 0. What this engine is

The first three engines make cheap output: a post is 20 minutes, a video is a few hours. This one makes expensive output: an app is days.

So the equation is inverted. **The value is not in producing ideas. It is in lowering the cost of execution and in having a mechanism that says no.**

A daily feed that throws three app ideas a day produces 40 ideas and zero apps within two weeks, and becomes a guilt generator. The panel exists to prevent exactly that.

**Definition of success:** one built app per two weeks, and a rejection list Eyal trusts enough not to read.

---

## 1. The cast

Four roles. Not named characters. Each has a fixed angle, a fixed writing voice, and a sentence it must never produce.

| key | role | angle | voice | never says |
|---|---|---|---|---|
| `visionary` | הרעיונאי | Capabilities released in the last 30 days he can build on **now**: a new MCP, a new model, a new API. A capability scanner, not a headline scanner. | Short, eager. Always opens with "ראיתי ש" | "זה בטוח" |
| `pain` | חוקר הכאבים | Eyal himself. Things he did manually more than once, with evidence. | Dry, evidence-first. "שלוש פעמים החודש" | "יהיה מגניב אם" |
| `teacher` | המורה | The syllabi: UI/UX at John Bryce, and מיישם AI בארגונים. | Asks, does not propose. "איך זה נראה על מסך בכיתה?" | "נבנה קודם ונראה" |
| `pm` | מנהל המוצר | The filter and the expansion into a product. | Sharp, decides, justifies in one line. | "בואו נבנה את כולם" |

**המהנדס is not a character.** Effort estimation is an authority of `pm`, expressed as the `effort` tag on every card.

### Hard rules per advisor

**visionary**

- Must name the concrete capability and its release date. An idea with no dated capability is invalid and gets dropped before it reaches the table.
- Never proposes a category ("a tool for X"). Proposes what the new capability now makes possible that was impossible last month.
- Max 2 ideas per day.

**pain**

- Every idea carries `evidence`: what Eyal actually did, how many times, in what period. Evidence comes from the inbox (`inbox.json`), from task-management history, or from something he said in a session. Never invented.
- An idea with an invented or vague evidence line is invalid. "You probably do this a lot" is not evidence.
- Max 2 ideas per day.

**teacher**

- Every idea maps to a named lesson or module in the syllabus, and states which one.
- Phrased as a question about the classroom screen, not as a feature request.
- Max 2 ideas per day.

**pm**

- Never generates ideas. Only filters, expands, tags and explains.
- Reads `decisions.json` **before** filtering, every single time.
- Selects at most 3, from at least 12 candidates. If the pool has fewer than 12, the meeting still runs but `pm.note` says so out loud.
- Every rejection gets exactly one line of reason. No rejection without a reason.
- Every surviving pitch gets a counter-note authored by a **different** advisor than the one who raised it. No counter-note, no pitch.

---

## 2. Data files

All under `meeting-room/data/`. Daily and weekly runs edit only these. `index.html` is never touched by an automated run.

```
meeting-room/
  index.html
  BUILDER-SPEC.md
  data/
    ideas.json        the table: raw ideas, live pool
    meetings.json     weekly meetings, the developed pitches
    decisions.json    every decision Eyal made, the learning signal
    products.json     the studio: approved products and their pages
    inbox.json        what Eyal threw on the table himself
    inspiration.json  the portfolio: the link library he feeds
    portraits.json    the clay portraits and the exact prompts that made them
  img/<key>.png       the four committed portrait files
```

### ideas.json

```json
{
  "updated": "2026-08-02",
  "ideas": [
    {
      "id": "I-2026-0231",
      "title": "סטייטים",
      "line": "מסך אחד נכנס, כל המצבים שלא ציירת יוצאים",
      "advisor": "visionary",
      "createdAt": "2026-08-01",
      "capability": { "name": "Figma MCP component states", "releasedAt": "2026-07-28" },
      "evidence": null,
      "lesson": null,
      "sourceInboxId": null,
      "status": "pool",
      "snoozes": 0,
      "touchedAt": "2026-08-01"
    }
  ]
}
```

`status` is one of: `pool` (on the table), `pitched` (developed into a meeting card), `approved`, `rejected`, `archived` (auto, after 14 days untouched, or after the third snooze).

**`revived` and `snoozed` are decision actions, never resting statuses.** לא עכשיו returns the idea to `pool` with a bumped `snoozes` and a refreshed `touchedAt`. הרם returns it to `pool` too. Only `decisions.json` remembers that it happened. An idea sitting in a status no filter reads is an idea that silently leaves the game, which is exactly the failure this engine exists to prevent.

`snoozes` counts how many times Eyal pressed לא עכשיו on this idea. It is written by the browser and must be carried by the weekly run. On the **third** snooze (`MAX_SNOOZE`) the idea flips to `archived` and is added to the meeting's rejects with the reason "נדחה 3 פעמים, נסגר אוטומטית". An idea he keeps deferring is an idea he is not going to build, and saying so out loud is cheaper than letting it haunt the table.

`capability` is required for `visionary`, `evidence` for `pain`, `lesson` for `teacher`. The other two are `null`.

### meetings.json

```json
{
  "current": "M-2026-W31",
  "meetings": [
    {
      "id": "M-2026-W31",
      "date": "2026-08-02",
      "reviewed": 18,
      "rejected": 15,
      "pmNote": "סיננתי 18, נשארו 3. השבוע כל השלושה נופלים על אותו קו.",
      "tally": { "visionary": [9,1], "pain": [5,1], "teacher": [4,1] },
      "pitches": [
        {
          "id": "P-31-01",
          "ideaId": "I-2026-0231",
          "title": "סטייטים",
          "one": "לוקח מסך אחד ומחזיר את כל המצבים שלא ציירת.",
          "who": "אתה, וכל כיתת UI/UX בשיעור 6",
          "pain": "יצא MCP חדש של Figma שקורא מצבי קומפוננטות.",
          "mainScreen": "מפת הסטייטים",
          "screens": ["מפת הסטייטים", "העלאת מסך", "כרטיס סטייט", "ייצוא ל-Figma"],
          "whyNow": "היכולת קיימת מהשבוע, ואף אחד עוד לא עטף אותה בכלי",
          "effort": "weekend",
          "by": "visionary",
          "counterBy": "pain",
          "counter": "אתה עצמך לא נתקלת בזה אפילו פעם אחת החודש.",
          "state": "pending"
        }
      ],
      "rejects": [
        { "ideaId": "I-2026-0198", "title": "מחולל תמונות לפוסטים", "why": "יש כזה טוב ובחינם", "advisor": "visionary" }
      ],
      "pattern": null
    }
  ]
}
```

`effort` is one of `session` (up to 3 hours, one file), `weekend`, `project` (which usually means not now).
`state` is one of `pending`, `approved`, `snoozed`, `archived`, `building`, `live`. A pitch keeps `snoozed` and `archived` as its resting state even though the underlying idea returns to `pool`, because the card has to remember what Eyal did to it this week.
`rejects[].advisor` carries the advisor who raised the rejected idea, so השולחן can filter rejections by advisor.
`pattern` is filled only on the meeting where the 5th product completed (see section 6).

### decisions.json

This is the engine's memory and the reason it is an advisor rather than a generator.

```json
{
  "decisions": [
    {
      "at": "2026-08-02",
      "meetingId": "M-2026-W31",
      "ideaId": "I-2026-0231",
      "title": "סטייטים",
      "advisor": "visionary",
      "effort": "weekend",
      "action": "approved",
      "reason": null,
      "weight": 1
    }
  ],
  "readBack": "אתה מאשר כלים שאתה משתמש בהם בעצמך ופוסל כלים שנועדו לאחרים."
}
```

`action`: `approved` | `snoozed` | `archived` | `revived`.
`weight`: `approved` = 1, `snoozed` = 0.5, `archived` = -1, **`revived` = 3**. Reviving something the pm rejected is the strongest signal in the system, because it is Eyal correcting the filter directly.

### inbox.json

```json
{
  "items": [
    { "id": "IN-0044", "at": "2026-07-30", "text": "שוב חיפשתי הצעה ישנה כדי להעתיק סעיף", "kind": "voice", "consumedBy": "I-2026-0233" }
  ]
}
```

`kind`: `text` | `voice`. `consumedBy` is set once an advisor turned it into an idea. Unconsumed items older than 30 days are surfaced to `pain` with priority.

### products.json

```json
{
  "products": [
    {
      "id": "PR-004",
      "slug": "states",
      "title": "סטייטים",
      "approvedAt": "2026-08-02",
      "fromPitch": "P-31-01",
      "concept": "", "goal": "", "audience": "",
      "screens": [], "dataSchema": "", "buildPrompt": "",
      "screenArchitectUrl": null,
      "liveUrl": null,
      "status": "building"
    }
  ]
}
```

`status`: `building` | `live` | `parked`.

### inspiration.json

```json
{
  "items": [
    { "title": "Figma MCP component states", "url": "https://figma.com", "note": "היכולת שהרעיונאי הביא השבוע", "at": "2026-07-28" }
  ]
}
```

Newest first. `note` says why it is here, not what it is. A link with no `note` is a bookmark, not inspiration.

### portraits.json

```json
{
  "portraits": [
    { "key": "visionary", "role": "הרעיונאי", "jobId": "…", "url": "https://…", "prompt": "Portrait bust of …" }
  ],
  "baseStyle": "coral red, mustard yellow, teal and cream palette, 3D Pop art …",
  "model": "nano_banana_pro", "aspect": "1:1", "resolution": "1k"
}
```

`prompt` is the per-advisor line only. The shared house style lives once in `baseStyle` and is concatenated at generation time, so a restyle is a one-line change instead of four. `url` is the original Higgsfield CDN link, kept only as an `onerror` fallback behind the committed `img/<key>.png`.

---

## 3. The lifecycle of an idea

```
inbox  ->  pool  ->  pitched  ->  decision  ->  product page  ->  screens  ->  live app  ->  post
```

1. **Capture.** Eyal drops a line into `inbox.json` from the לשולחן box, text or voice, any time.
2. **Daily run (06:57, Sun to Fri).** Each advisor adds at most 2 one-line ideas to `ideas.json` with `status: "pool"`. `pain` reads unconsumed inbox items first. Cheap to read: one line each.
3. **Auto-archive.** On every daily run, any pool idea with `touchedAt` older than 14 days flips to `archived`. This is silent, no notification, and it writes a `decisions.json` entry with `action: "archived"`.
4. **Weekly run (Sunday 06:57).** `pm` reads `decisions.json`, reads the whole pool, rejects with one line each, and develops at most 3 into full pitch cards with counter-notes. Writes a new meeting into `meetings.json` and flips those ideas to `pitched`.
5. **Decision.** Eyal presses one of three buttons on the card. The stamp lands. A `decisions.json` entry is written.
   - **One approval per meeting.** The moment one pitch is approved, בונים is disabled on the other two. Two builds in one week is the failure mode this engine exists to prevent, and the UI enforces it rather than trusting good intentions.
   - A pitch tagged `project` asks for a confirmation before it can be approved, because `project` usually means not now.
   - **בונים** creates a product entry in `products.json` with `status: "building"`, and only this pitch continues.
   - **לא עכשיו** returns the idea to the pool with a refreshed `touchedAt` (it gets another 14 days) and bumps `snoozes`. The third one archives it (see `snoozes` in section 2).
   - **לארכיון** requires a reason. Without one the action does not happen. The reason and the title are pushed into the current meeting's `rejects`, so Eyal's own rejections join `pm`'s and stay visible on השולחן.
6. **Build chain.** The approved product page opens in the studio, `screen-architect` receives the card and builds desktop and mobile screens, which produce a build prompt, which publishes into `simpla-lab`. Card in the morning, live link in the evening.
7. The other two pitches stay cards. **Zero work is spent on what was not chosen.**

---

## 4. Cadence

| when | what |
|---|---|
| Sun to Fri 06:57 | daily: up to 6 new one-liners on the table, auto-archive sweep |
| Sunday 06:57 | weekly: full meeting, up to 3 developed pitches, they stay all week |
| 08:00 | morning brief includes a חדר הישיבות section: on Sunday the three pitches, otherwise what landed on the table |

Runs inside the existing **Daily Content Engines** scheduled task (`trig_01DWroUKnJzYLgwBbMph5XQa`), which pushes to `main` (Pages serves from `main` since 4.8.2026).

The weekly pitches do **not** refresh mid-week. A meeting stays on the screen until the next Sunday, even if Eyal never opened it. Refreshing them would turn the meeting back into a feed.

---

## 5. The visual language

Two halves in one screen. This is deliberate and load-bearing: warm for the people, cold for the decision.

**Warm (top).** Cream `#F3EADB`, ink `#2A2318`. Clay portraits of the three advisors, house style shared with "ביוגרפיה של אובייקט", generated in Higgsfield with the standard base prompt (coral / mustard / teal / cream, 3D pop art clay, matte, studio lighting, clean cream background, no text no logos). Under each: what it submitted this week and how many passed. `pm` sits to the side in a dark card with the opening paragraph and the counters.

**Seam.** A wavy cut from cream into navy carrying the word BLUEPRINT. **The seam is mandatory.** The two surfaces placed edge to edge with no transition read as two different websites.

**Cold (bottom).** Navy `#0B1622`, blueprint grid, technical type, cyan-blue ink `#8FC7DE`, mustard `#E8B33A` for the main screen and the advisor tag, coral `#F7636B` for the counter-note. Every card carries a faint `ממתין` rubber stamp that lands as a real stamp on decision: green `#2F7D5B` for אושר, red `#C9403F` for נפסל and לא עכשיו.

**The stamp is the only animation in the product.** It never appears in the warm half. The moment it touches clay it becomes a toy.

Fonts: Heebo (900 for titles), IBM Plex Mono for identifiers and grid labels.

---

## 6. The learning loop

Two mechanisms, both cheap, both mandatory.

**Per meeting.** `pm` reads `decisions.json` before filtering. Once there are at least 12 decisions, `readBack` is regenerated: one sentence, in `pm`'s voice, naming the pattern in Eyal's choices. It is shown at the top of the meeting, above the pitches. It is never longer than one sentence.

**Per five products.** When the 5th product reaches `status: "live"`, `pm` writes one paragraph into the current meeting's `pattern` field, looking for overlap across everything built:

> "יש כאן דפוס. שלושה מהכלים שבנית עושים את אותו דבר. אולי זה מוצר אחד."

This is the moment the engine stops being a feed and becomes a strategy. It runs again every 5 products.

---

## 7. The four areas

**א. הישיבה** (home). This week's meeting. Advisors on top, three pitch cards below, rejection drawer under them, the readBack sentence above everything once it exists.

**ב. השולחן.** The whole live pool, filterable by advisor, plus this week's rejections with their reasons and a הרם button on each. Reviving from here writes `action: "revived"` with weight 3.

**ג. הסטודיו.** Everything approved. A gallery of live apps on top, then a product page per product: concept, goal, audience, screens, data schema, build prompt, and once it exists a link to the live app. Same shape the storyboards got in הבמאי היומי.

**ד. התיק.** The inspiration library Eyal feeds, plus the לשולחן box, always available, text or voice.

---

## 8. Invariants

Things that break the product if they are dropped. Check these before shipping any change.

1. At most 3 pitches per meeting. Never 4.
2. Every pitch has a counter-note from a different advisor than the one who raised it.
3. Every rejection has exactly one line of reason, and is visible.
4. Every pitch has an `effort` tag.
5. `pm` reads `decisions.json` before filtering, always.
6. Only the approved pitch continues into `screen-architect`. The other two stay cards.
7. Weekly pitches never refresh mid-week.
8. `visionary` ideas must name a dated capability. No capability, no idea.
9. `pain` ideas must carry real evidence. No evidence, no idea.
10. Automated runs edit `data/*.json` only, never `index.html`.
11. One approval per meeting.
12. לארכיון without a reason is not a valid action.
13. לא עכשיו refreshes `touchedAt`, so a snooze is never a silent archive.

### How the browser enforces them

Invariants 1, 2, 4, 8 and 9 are authored by the weekly run, so the browser cannot create them, only detect their absence. `index.html` renders a red `חסר` marker in place of a missing effort tag, a missing counter-note, a counter-note authored by the same advisor who raised the pitch, a `visionary` idea with no dated capability and a `pain` idea with no evidence. A run that breaks the spec is visible on the screen instead of rendering `undefined`.

Invariants 6, 11, 12 and 13 are enforced directly in the UI.

Invariant 5 belongs entirely to the run. Invariant 7 holds by construction: the page fetches once on load and has no timer.

---

## 9. Pending decisions

A decision Eyal makes in the browser is not written back to the repo by the browser. It is mirrored into `localStorage` under `mr-pending` and replayed over the fetched data on every load, so an approval survives a refresh and is still on the screen when he comes back. The next run reads those pending entries, folds them into `decisions.json` and `products.json`, and the mirror is cleared.

Without this the stamp lies: it animates like a commitment and evaporates on reload.

## 10. Reproduction notes

- Repo: `Eyalg1980/simpla-lab`, folder `meeting-room/`, published from `main` (Pages source switched 4.8.2026).
- Skill: `meeting-room`, a thin router that fetches this file live and does not copy its rules, matching the `daily-director` pattern.
- Advisor portraits: served from `meeting-room/img/<key>.png` with the original Higgsfield URL as an `onerror` fallback. The PNGs must be committed; a CDN link is not an asset. Generated with `nano_banana_pro` (routes to `nano_banana_2`), 1:1, 1k, about 2 credits each. Prompts are stored in `data/portraits.json` so they can be regenerated identically.
