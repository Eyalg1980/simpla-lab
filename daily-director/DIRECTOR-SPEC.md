# Daily Director — Daily Generation Spec

You are generating today's edition of Eyal Gershon's daily video-ideas brief ("הבמאי היומי"). Live at https://eyalg1980.github.io/simpla-lab/daily-director/ — a 3-tab static app rendering `videos.json` (daily ideas feed), `competitions.json` (video competitions tracker), `inspiration.json` (link library).

## Who Eyal is (for idea selection)
Founder of Simpla (UX+AI studio, Tel Aviv), teaches UX/AI at John Bryce, heavy Higgsfield user (Cinema Studio, Kling, Veo, Nano Banana, Shorts Studio), HeyGen for avatars, trained LoRAs on Fal.ai (empathyportrait/moments/movement), made a Weavy short film. His content worlds for video: וידאו ארט, סרטוני הסבר (AI/UX/סקילים), קונספטואלי, סרטוני תחרויות, תיעוד תהליך.

## Daily flow
1. Read current `videos.json` and `competitions.json` first. Never repeat hooks from the last 14 days.
2. Research fresh: AI video tool news, viral video formats, and NEW open competitions (sources: https://aifilmcontests.com/, https://open-arthouse.com/, https://higgsfield.ai/contests, https://www.kajimelo.com/ai-film-festivals). Verify deadlines on the competition's own site before adding.
3. Write 2-3 new video ideas (Hebrew, Eyal's voice, no em dashes). Each idea: `world` (one of his content worlds), `hook` (one line), `concept` (2-3 sentences), `execution` (concrete: which Higgsfield/HeyGen tools, format, length, aspect ratios), `why` (why now), optional `competition` + `srcUrl`. At least once a week: one idea that crosses with his post brainstormer content (same asset, two channels).
4. Update `competitions.json`: refresh `updated` date; mark passed deadlines as "נסגר" (keep 30 days then remove); add newly found competitions with 1-2 tailored ideas each; every idea must play to Eyal's unfair advantages (education, UX, Hebrew/Israeli angle, clay/LoRA visual languages).
5. Add up to 2 "שווה צפייה" items per day (real links only).
6. When Eyal sends inspiring videos, analyze format/technique and add to `inspiration.json` with a one-line "מה לגנוב מזה" desc.

## Data schemas
Match the existing JSON structures exactly. New day objects go to the TOP of `days`. Validate with `python3 -m json.tool`.

## Publish
Same repo flow as the post brainstormer (see /CLAUDE.md in repo root): clone simpla-lab, edit files under `daily-director/`, commit, push BOTH `main` and `gh-pages` with the token from your instructions. Verify with WebFetch (sandbox blocks curl to github.io).

## Buttons contract
"עוד רעיונות" and "פתח לתסריט" copy commands that Eyal pastes into Claude. When handling "פתח לתסריט": produce a full breakdown in chat — logline, 45-90s script, shot list (per shot: duration, camera, action), and ready Higgsfield prompts per shot (name the model). Do not publish scripts to the site.
