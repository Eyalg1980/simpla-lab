/* ============================================================
   make-shots.js · מייצר את תמונות התיק מהמסכים החיים
   הרצה מתוך תיקיית hachug-sheli:   node scripts/make-shots.js
   מצלם כל מסך, מרכיב אותם בדפדפן בתוך מסגרות טלפון ומייצא
   ל-content/shots. ההרכבה נעשית ב-HTML ולא בכלי גרפי כדי
   שהעברית, הפינות והצללים ייראו בדיוק כמו במוצר.
   ============================================================ */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const BASE = 'file://' + path.join(ROOT, 'app', 'screens') + '/';
const OUT = path.join(ROOT, 'content', 'shots');

const SHOTS = [
  { key: 'home', file: 'home.html' },
  { key: 'class', file: 'class.html' },
  { key: 'checkout', file: 'checkout.html' },
  { key: 'board', file: 'family-board.html' },
  { key: 'saved', file: 'saved.html' },
  { key: 'profile', file: 'profile.html' }
];

// מידות הטלפון בקנה מידה 1, לפני ההקטנה לכל הרכבה
const PW = 428, PH = 848, PAD = 14, RAD = 38;

const KILL_ANIM = `*{animation:none!important;transition:none!important}
  .reveal{opacity:1!important;transform:none!important}`;

// מסגרת טלפון בגודל מפורש, כי transform:scale לא מקטין את מקום הפריסה
function phone(src, s, top) {
  const w = Math.round(PW * s), h = Math.round(PH * s);
  const p = Math.max(4, Math.round(PAD * s)), r = Math.round(RAD * s);
  return `<div class="ph" style="width:${w}px;height:${h}px;padding:${p}px;border-radius:${r}px;margin-top:${top || 0}px">
    <img src="${src}" style="border-radius:${r - p}px" /></div>`;
}

function page(body, css) {
  return `<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="utf-8" />
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{overflow:hidden}
  body{font-family:"Heebo","Noto Sans Hebrew","Arial Hebrew",system-ui,sans-serif}
  .ph{background:#112D2A;flex:0 0 auto;
      box-shadow:0 22px 48px rgba(6,30,28,.32), 0 5px 14px rgba(6,30,28,.16)}
  .ph img{width:100%;height:100%;display:block;object-fit:cover;object-position:top}
  .stage{display:flex;align-items:flex-start;justify-content:center}
  ${css}
</style></head><body>${body}</body></html>`;
}

(async () => {
  const b = await chromium.launch();

  /* ---- שלב 1: צילום המסכים ---- */
  const p = await b.newPage({ viewport: { width: 400, height: 820 }, deviceScaleFactor: 3 });
  const shot = {};
  for (const s of SHOTS) {
    await p.goto(BASE + s.file);
    await p.addStyleTag({ content: KILL_ANIM });
    await p.evaluate(() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-visible')));
    await p.waitForTimeout(500);
    shot[s.key] = 'data:image/png;base64,' + (await p.screenshot()).toString('base64');
    console.log('captured', s.key);
  }
  await p.close();

  const c = await b.newPage({ deviceScaleFactor: 2 });
  async function compose(w, h, body, css, file) {
    await c.setViewportSize({ width: w, height: h });
    await c.setContent(page(body, css));
    await c.waitForTimeout(350);
    await c.screenshot({ path: path.join(OUT, file) });
  }

  /* ---- ארבעת מסכי ה-MVP, רקע בהיר. סדר RTL: החיפוש מימין ---- */
  await compose(1200, 420,
    `<div class="stage">${[shot.home, shot.class, shot.saved, shot.profile, shot.checkout, shot.board]
      .map(s => phone(s, 0.39)).join('')}</div>`,
    `body{background:#F7F8F8}
     .stage{width:1200px;height:420px;gap:22px;padding-top:35px}`,
    'hachug-sheli-screens.png');

  /* ---- ההירו: שלושה מסכים על teal, עם שם המוצר בפינה ---- */
  await compose(1200, 675,
    `<div class="glow"></div>
     <div class="stage">${phone(shot.class, 0.55, 80)}${phone(shot.home, 0.55, 40)}${phone(shot.board, 0.55, 80)}</div>
     <div class="mark"><h1>החוג שלי</h1><p>כל החוגים של הילדים, במקום אחד</p></div>`,
    `body{width:1200px;height:675px;position:relative;
          background:linear-gradient(158deg,#0F766E 0%,#0B4B47 55%,#08302E 100%)}
     .glow{position:absolute;top:-320px;right:-240px;width:900px;height:900px;border-radius:50%;
           background:radial-gradient(circle,rgba(42,178,164,.55),rgba(42,178,164,0) 68%)}
     .stage{position:relative;gap:38px}
     .mark{position:absolute;right:56px;bottom:36px;text-align:right;color:#fff}
     .mark h1{font-size:50px;font-weight:900;letter-spacing:-.5px;line-height:1.1}
     .mark p{font-size:18px;font-weight:400;color:#BEE2DD;margin-top:6px}`,
    'hachug-sheli-hero.png');

  /* ---- תמונת הכרטיס באינדקס ---- */
  await compose(900, 563,
    `<div class="glow"></div>
     <div class="stage">${phone(shot.class, 0.58)}${phone(shot.home, 0.58)}</div>`,
    `body{width:900px;height:563px;position:relative;
          background:linear-gradient(158deg,#0F766E 0%,#0B4B47 60%,#08302E 100%)}
     .glow{position:absolute;top:-260px;right:-180px;width:700px;height:700px;border-radius:50%;
           background:radial-gradient(circle,rgba(42,178,164,.5),rgba(42,178,164,0) 68%)}
     .stage{position:relative;gap:44px;padding-top:45px}`,
    'hachug-sheli-thumb.png');

  await b.close();
  for (const f of fs.readdirSync(OUT).sort()) {
    console.log(f, (fs.statSync(path.join(OUT, f)).size / 1024 | 0) + 'kb');
  }
})();
