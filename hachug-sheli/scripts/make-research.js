/* ============================================================
   make-research.js · מייצר את לוח המחקר של הקייס
   הרצה מתוך תיקיית hachug-sheli:   node scripts/make-research.js

   עד 9.8.2026 הקובץ content/shots/hachug-sheli-research.png היה נכס
   ידני, ולכן הוא נשאר עם פרצופי אמוג'י צהובים ועם אמוג'י פרסונה גם
   אחרי שהמוצר עבר לאייקוני קו. עכשיו הוא נבנה מכאן:
   - עקומת הרגש מסומנת בפרצופי קו בצבע יחיד ובציון 1 עד 5, כך שהיא
     קריאה גם בשחור לבן ובהדפסה
   - הפרסונה מקבלת אווטאר קו ולא אמוג'י
   - הקנבס נחתך לגובה התוכן. הגרסה הקודמת בזבזה 38 אחוז מהגובה על ריק
   ============================================================ */
const { chromium } = require('playwright');
const path = require('path');

const OUT = path.join(path.resolve(__dirname, '..'), 'content', 'shots');

const T = { primary: '#0F766E', ink: '#17252A', muted: '#5B6B6E', border: '#E3EBEA' };

/* שישה שלבי המסע, מימין לשמאל. score הוא ציון הרגש 1 עד 5 */
const STAGES = [
  { name: 'מזהה צורך',            score: 3, tone: 'flat' },
  { name: 'מחפשת בוואטסאפ',       score: 1, tone: 'bad'  },
  { name: 'מתקשרת לברר מקום',     score: 2, tone: 'bad'  },
  { name: 'משווה ומחליטה',        score: 3, tone: 'flat' },
  { name: 'נרשמת בקליק',          score: 5, tone: 'good' },
  { name: 'שיעור הניסיון',        score: 5, tone: 'good' }
];

const NOTES = [
  { kind: 'pain', text: 'כאב: "אין לי מושג אם יש מקום פנוי בלי להתקשר". ארבעה מתוך חמישה מרואיינים' },
  { kind: 'pain', text: 'כאב: המידע מפוזר, אין מקום אחד להשוואה. חמישה מתוך חמישה' },
  { kind: 'touch', text: 'נקודת מגע קריטית: רגע בדיקת הזמינות' },
  { kind: 'opp',  text: 'הזדמנות: זמינות בזמן אמת ושריון שיעור ניסיון בקליק, היפוך נקודת השפל' }
];

/* פרצוף קו בצבע יחיד. עקומת הפה נגזרת מהציון, ולכן אותו אייקון
   מייצג את כל חמש הרמות בלי להסתמך על צבע */
function faceIcon(score) {
  const mouth = {
    1: 'M8.6 16.4c1.9-2.2 4.9-2.2 6.8 0',
    2: 'M8.6 15.9c1.9-1.4 4.9-1.4 6.8 0',
    3: 'M8.6 15.2h6.8',
    4: 'M8.6 14.6c1.9 1.4 4.9 1.4 6.8 0',
    5: 'M8.4 14.2c2 2.4 5.2 2.4 7.2 0'
  }[score];
  const brows = score <= 2
    ? '<path d="M7.6 8.4l2.6 1M16.4 8.4l-2.6 1"/>'
    : (score >= 5 ? '<path d="M7.6 9.2l2.6-.9M16.4 9.2l-2.6-.9"/>' : '');
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9"/>
    <path d="M9.2 11h.01M14.8 11h.01"/>${brows}<path d="${mouth}"/></svg>`;
}

const AVATAR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="8.6" r="3.9"/><path d="M4.4 20.2a7.6 7.6 0 0115.2 0"/></svg>`;

/* קו הרגש. הנקודות ממורכזות מתחת לכרטיסי השלבים, בכיוון RTL */
function curve() {
  const n = STAGES.length, W = 1080, H = 130, pad = 26;
  const step = W / n;
  const pts = STAGES.map((s, i) => {
    const x = W - (step * i + step / 2);                 // RTL: השלב הראשון מימין
    const y = pad + (5 - s.score) / 4 * (H - pad * 2);
    return [x, y];
  });
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const dots = pts.map((p, i) => {
    const s = STAGES[i];
    const fill = s.tone === 'bad' ? '#DC2626' : (s.tone === 'good' ? T.primary : '#9AA9AB');
    const r = (s.score === 1 || s.score === 5) ? 8 : 6;
    return `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r}" fill="${fill}"/>`;
  }).join('');
  return `<svg class="curve" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
    <path d="${d}" fill="none" stroke="${T.primary}" stroke-width="3"
      stroke-linecap="round" stroke-linejoin="round"/>${dots}</svg>`;
}

const stageCards = STAGES.map(s => `
  <div class="stage ${s.tone}">
    <span class="face">${faceIcon(s.score)}</span>
    <b>${s.name}</b>
    <span class="score">רגש ${s.score} מתוך 5</span>
  </div>`).join('');

const noteCards = NOTES.map(n => `<div class="note ${n.kind}">${n.text}</div>`).join('');

const HTML = `<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="utf-8" />
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Heebo,'Segoe UI',Arial,sans-serif;background:#F1F1EE;color:${T.ink};
       width:1600px;padding:34px 40px 38px}
  h1{font-size:25px;font-weight:900;margin-bottom:20px}
  /* בכיוון RTL העמודה הראשונה יושבת מימין, ולכן הפרסונה מוצהרת ראשונה */
  .board{display:grid;grid-template-columns:420px 1fr;gap:24px;align-items:start}
  .panel{background:#fff;border-radius:20px;padding:24px 26px}

  .journey h2{font-size:16px;font-weight:700;margin-bottom:18px}
  .stages{display:grid;grid-template-columns:repeat(6,1fr);gap:12px}
  .stage{border:1.5px solid ${T.border};border-radius:14px;padding:14px 10px;text-align:center;
         display:flex;flex-direction:column;align-items:center;gap:6px;color:${T.muted}}
  .stage b{font-size:14px;color:${T.ink};line-height:1.3}
  .stage .score{font-size:12px;font-variant-numeric:tabular-nums}
  .stage .face svg{width:34px;height:34px;display:block}
  .stage.bad{border-color:#F3C4C4;background:#FDF4F4;color:#B91C1C}
  .stage.bad .face{color:#DC2626}
  .stage.good{border-color:#BFE3D8;background:#F1FAF6;color:#0F7A38}
  .stage.good .face{color:${T.primary}}
  .stage.flat .face{color:#7C8B8D}

  .curve{width:100%;height:132px;margin:6px 0 4px;display:block}

  .notes{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:6px}
  .note{border-radius:12px;padding:12px 14px;font-size:13px;line-height:1.5}
  .note.pain{background:#FDECEC;color:#7F1D1D}
  .note.touch{background:#E7F0FA;color:#1E3A5F}
  .note.opp{background:#FEF3C7;color:#7C5308}

  .persona{border-top:6px solid #E07A3F;padding-top:22px}
  .p-head{display:flex;gap:14px;align-items:center;margin-bottom:16px}
  .p-av{width:62px;height:62px;border-radius:50%;background:#F4EEE9;color:#8A6A54;
        display:grid;place-items:center;flex:0 0 auto}
  .p-av svg{width:34px;height:34px}
  .p-head h3{font-size:19px;font-weight:900}
  .p-head p{font-size:13px;color:${T.muted};line-height:1.45;margin-top:3px}
  .p-sec{margin-bottom:14px}
  .p-sec h4{font-size:12px;font-weight:700;color:#E07A3F;letter-spacing:.04em;margin-bottom:3px}
  .p-sec p{font-size:13.5px;line-height:1.55}
  .quote{border-inline-start:4px solid #E07A3F;background:#FDF6F1;border-radius:0 10px 10px 0;
         padding:12px 14px;font-size:13px;line-height:1.55;font-style:italic}
</style></head><body>
  <h1>החוג שלי · חבילת המחקר: פרסונה ומפת מסע (דנה, ההורה המתאם)</h1>
  <div class="board">
    <div class="panel persona">
      <div class="p-head">
        <span class="p-av">${AVATAR}</span>
        <div>
          <h3>דנה, 38 · "ההורה המתאם"</h3>
          <p>אמא לאיתי (7) ונועה (5) · גבעתיים · עובדת במשרה מלאה</p>
        </div>
      </div>
      <div class="p-sec"><h4>מטרות</h4>
        <p>לוח חוגים משפחתי אחד שמסתדר, ולדעת בוודאות שיש מקום לפני שמבטיחים לילד.</p></div>
      <div class="p-sec"><h4>תסכולים</h4>
        <p>מידע מפוזר בקבוצות וואטסאפ, הרשמה רק בטלפון בשעות העבודה, תשלומים בהעברות ידניות.</p></div>
      <div class="p-sec"><h4>התנהגויות</h4>
        <p>משווה שלוש עד ארבע אפשרויות לפני החלטה, מתאמת מול ההורה השני, שומרת צילומי מסך של מודעות חוגים.</p></div>
      <div class="quote">"עד שהשגתי את המדריך בטלפון, כבר לא היה מקום. הילד בכה ואני הרגשתי שנכשלתי בתיאום הכי בסיסי."</div>
    </div>

    <div class="panel journey">
      <h2>מפת מסע: מרעיון לחוג ועד שיעור הניסיון · ציון רגש 1 עד 5</h2>
      <div class="stages">${stageCards}</div>
      ${curve()}
      <div class="notes">${noteCards}</div>
    </div>
  </div>
</body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ deviceScaleFactor: 2, viewport: { width: 1600, height: 900 } });
  await p.setContent(HTML);
  await p.waitForTimeout(400);
  // הקנבס נחתך לגובה התוכן. הגרסה הידנית הקודמת השאירה שליש ריק בתחתית,
  // וזה הקטין את התוכן בכ-38 אחוז כשהתמונה מוגבלת לרוחב עמודת הטקסט
  const h = await p.evaluate(() => Math.ceil(document.body.getBoundingClientRect().height));
  await p.setViewportSize({ width: 1600, height: h });
  await p.waitForTimeout(150);
  await p.screenshot({ path: path.join(OUT, 'hachug-sheli-research.png') });
  await b.close();
  console.log('wrote hachug-sheli-research.png');
})();
