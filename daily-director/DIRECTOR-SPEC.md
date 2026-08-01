# Daily Director — Daily Generation Spec

You are generating today's edition of Eyal Gershon's daily video-ideas brief ("הבמאי היומי"). Live at https://eyalg1980.github.io/simpla-lab/daily-director/ — a 3-tab static app rendering `videos.json` (daily ideas feed), `competitions.json` (video competitions tracker), `inspiration.json` (link library).

**This file is the single source of truth for content and data format.** The `daily-director` skill routes to this file; it never copies rules from here. If a rule changes, change it HERE only.

## Who Eyal is (for idea selection)
Founder of Simpla (UX+AI studio, Tel Aviv), teaches UX/AI at John Bryce, heavy Higgsfield user (Cinema Studio, Kling, Veo, Nano Banana, Shorts Studio), HeyGen for avatars, trained LoRAs on Fal.ai (empathyportrait/moments/movement), made a Weavy short film. His content worlds for video: וידאו ארט, סרטוני הסבר (AI/UX/סקילים), קונספטואלי, סרטוני תחרויות, תיעוד תהליך.

## Daily flow
1. Read current `videos.json` and `competitions.json` first. Never repeat hooks from the last 14 days.
2. Research fresh: AI video tool news, viral video formats, and NEW open competitions (sources: https://aifilmcontests.com/, https://open-arthouse.com/, https://higgsfield.ai/contests, https://www.kajimelo.com/ai-film-festivals). Verify deadlines on the competition's own site before adding.
3. Write 2-3 new video ideas (Hebrew, Eyal's voice, no em dashes). Each idea: `world`, `hook` (one line), `concept` (2-3 sentences), `execution` (concrete: which Higgsfield/HeyGen tools, format, length, aspect ratios), `why` (why now), optional `competition` + `srcUrl`, and a **required `prompts` object** (see below). At least once a week: one idea that crosses with his post brainstormer content (same asset, two channels).
4. Update `competitions.json`: refresh `updated` date; mark passed deadlines as "נסגר" (keep 30 days then remove); add newly found competitions with 1-2 tailored ideas each; every idea must play to Eyal's unfair advantages (education, UX, Hebrew/Israeli angle, clay/LoRA visual languages).
5. Add up to 2 "שווה צפייה" items per day (real links only).
6. When Eyal sends inspiring videos, analyze format/technique and add to `inspiration.json` with a one-line "מה לגנוב מזה" desc.

## The `prompts` object (required on every idea)
Generated UP FRONT at idea-creation time, never on demand. The app renders one copy button per key. Four keys, all four required unless genuinely inapplicable:

- `video` — ENGLISH prompt ready to paste into an AI video model (Veo 3 / Kling 3 / Higgsfield Cinema Studio). Must include subject, camera move, lighting, palette, mood, aspect ratio. One paragraph, no line breaks.
- `script` — HEBREW command Eyal pastes into Claude to develop the full screenplay. Phrase it as an instruction that names the hook in quotes and asks for logline, timed Hebrew VO, shot list, and per-shot generation prompts.
- `image` — ENGLISH prompt for the single hero still / storyboard key frame. Same visual language as `video`, no camera move, end with "no text" when the frame should stay clean.
- `raw` — HEBREW plain text brief, `\n` separated: hook, world, competition (if any), concept, execution, why now. This is the editable version Eyal pastes anywhere.

Hebrew inside `video` and `image` prompts is forbidden; image models mangle Hebrew. Any Hebrew titling is added in edit, so leave negative space and say so in the prompt.

## Visual languages (reusable, do not reinvent per idea)
- **Clay** (house style for the "ביוגרפיה של אובייקט" series and most object-led ideas): `Claymation stop-motion style, handcrafted plasticine, visible fingerprints in clay, cream studio background, coral yellow teal palette, soft studio lighting, shallow depth of field` plus aspect ratio. Proven in the hamburger storyboard.
- **Editorial kinetic** (explainers): deep charcoal background, kinetic typography, coral and warm yellow accents, minimal geometric composition, generous negative space.
- **Optimistic near-future** (competition/conceptual): Mediterranean warm light, sand cream and soft teal, human and hopeful rather than cold sci-fi, shallow depth of field.

## Data schemas
Match the existing JSON structures exactly. New day objects go to the TOP of `days`. Validate with `python3 -m json.tool`.

## Storyboards
Full breakdowns Eyal approves get published to `daily-director/storyboards/<slug>/index.html` (built on the shared template, see below) and the idea gets a **`storyboardUrl`** field pointing at it. `storyboardUrl` is what flips the card's primary button from the black "פתח תסריט" to the green "סטוריבורד", so never leave it out once a board is published, and never put a storyboard link in `srcUrl` (that field is for the source that inspired the idea).

Every storyboard page is built from the SHARED template in `storyboards/_shared/` and carries nothing of its own beyond data. A page contains only: head with `<link rel="stylesheet" href="../_shared/sb.css">`, `<body><div id="sb"></div>`, one `<script>` defining `window.SB`, and `<script src="../_shared/sb.js"></script>`. No inline `<style>`, no per-page rendering code. If a page needs a new capability, extend `sb.js` and `sb.css` so every page gains it at once, never fork one page.

Fixed furniture, identical on every page:
- A **sticky app bar** at the top: round back button to `../../` on the right, the daily director wordmark centred, matching the daily-board pattern.
- Then the hero: kicker pill, title with the green mark on the second line, logline, spec pills.
- Then, ONLY when the film is finished, the finished video in full, above the whole storyboard. Set `film: {src:"...mp4", ratio:"1"|"16"|"9"}` or `{youtube:"id"}`. Leave it `null` while the film does not exist.

**The section order is enforced by `sb.js`, not by the page**, so it can never drift: `סינופסיס` (optional), `אווירה והלך רוח`, `סיפור רקע`, `קריינות`, `שוט-ליסט`, `הערות הפקה`. Every section is collapsible with a chevron on the side. Defaults: `סינופסיס`, `אווירה והלך רוח` and `סיפור רקע` start CLOSED; `קריינות`, `שוט-ליסט` and `הערות הפקה` start OPEN. The open/closed state is remembered per page in localStorage.

- **סינופסיס** is the film told as prose in Eyal's voice, 5-7 short paragraphs, what actually happens beat by beat, ending on the thesis line. Add `en` for the English version under 300 words; the template renders it as a collapsible block with its own copy button, because competition cover sheets ask for exactly that.
- **שוט-ליסט** is the shot cards: generated frames, per-shot duration, camera, model pill, and copy-prompt buttons. Prefer TWO prompts per shot, one for the opening frame and one for the motion, returned by the page's `shots.prompts(shot, ratio)` function. When a film has more than one delivery ratio, add `shots.ratios` and give each shot per-ratio `img` and prompt fields; the switch then swaps frames and prompts together.
- **אווירה והלך רוח** is the direction the shot prompts do not carry on their own: the emotional tone, pacing, camera discipline, material behaviour, light and sound, plus 3-5 short rule pills. One copy button copies the whole block as a directive.
- **סיפור רקע** is the researched history behind the subject in Eyal's voice, 3-4 paragraphs, ending on the angle the film leaves open. One copy button. It doubles as the source material for the written post, so it must be factual and specific with real dates and names.

Reference implementation: `storyboards/skill-vs-prompt/` (it also shows the ratio switch). All published boards run on this template. Daily runs do NOT create storyboards; only an explicit "פתח תסריט" request does.

## Design language (locked)
The app's visual language is black/white video-matte frames, chunky Rubik 900 type, and neon green (#71F73C) hand-drawn scribbles (inspired by Artem Shcherbakov's director portfolio, per Eyal's request). Daily runs edit ONLY the JSON files, never index.html.

## Publish
Same repo flow as the post brainstormer (see /CLAUDE.md in repo root): clone simpla-lab, edit files under `daily-director/`, commit, push BOTH `main` and `gh-pages` with the token from your instructions. Verify with WebFetch (sandbox blocks curl to github.io).

## Prompt engine (single source for every copy button)
`index.html` builds every copied command from one set of functions instead of hand-written strings: `pBrief` (who Eyal is + read this spec and the reference storyboard first), `pDeliver` (the six required outputs, in the storyboard page's own order), `pRules` (visual and voice constraints) and `pClose` (style-test first, then publish). On top of them sit `buildScriptPrompt` (an idea), `buildCompPrompt` (a competition idea, with the competition's theme, prize, deadline, notes and a mandatory check of the real submission terms), `buildMoreIdeas` and `buildMoreCompIdeas`.

Two consequences to preserve:
- Every prompt-producing button, on both tabs, targets the SAME deliverable: a published storyboard page plus the JSON update. That is why the outputs are numbered in the page's section order.
- The card's four prompt buttons and its big primary button share one bank, so the `script` button is the builder's output, not free text from `videos.json`. Never reintroduce a hand-written command string in the markup; extend the builders instead.

## Buttons contract
- **"עוד רעיונות"** and the per-competition variant: copy a Hebrew command Eyal pastes into Claude. Handling it means generating new ideas per this spec and publishing them.
- **"העתק פרומפט"** on a competition idea: the full competition brief plus the idea, ending in the same storyboard deliverable. Verify the real submission terms on the competition site before writing, and correct the card if they differ.
- **"פתח תסריט"** (black button, shown only while the idea has no `storyboardUrl`): produce a full breakdown in chat — logline, 45-90s script, shot list (per shot: duration, camera, action), and ready generation prompts per shot (name the model). Offer 2 style-test frames before the full set. Publish to `storyboards/` only if Eyal approves the result.
- **The four prompt buttons**: pure clipboard copies of the `prompts` object. No Claude round trip needed, which is the point.
