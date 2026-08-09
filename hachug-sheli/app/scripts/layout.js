/* ============================================================
   layout.js · מעטפת הדסקטופ
   הרינדור במובייל קפוא. הקובץ הזה לא נוגע בו: הוא נכנס לפעולה רק
   מעל 1200 פיקסלים, ואז מעביר כמה צמתים לתוך עמודה צדדית דביקה,
   ומחזיר אותם למקומם המדויק כשחוזרים למובייל.

   למה JS ולא CSS בלבד: הסדר במובייל הוא עובדות, ואז תיאום, ואז
   התוכן הארוך, ובסוף הכפתורים. בדסקטופ העמודה הצדדית צריכה להחזיק
   את המחיר ואת הכפתורים ביחד, בלי לגלול. גריד לבדו לא יכול לעשות
   את זה בלי לשנות את סדר ה-DOM, וזה היה מזיז את המובייל.
   ============================================================ */
(function () {
  var MQ = window.matchMedia('(min-width: 1200px)');

  /* מה עובר לעמודה הצדדית, לפי מסך. הבורר הראשון שנמצא, נלקח. */
  var SIDE = {
    'class.html':    ['.facts-card', '.coord-msg', '.coord', '#cta-trial', '#cta-full'],
    'checkout.html': ['.summary-card', '#c-cta', '.trust']
  };

  var file = (location.pathname.split('/').pop() || 'home.html');
  var picks = SIDE[file];
  if (!picks) return;

  var screen = document.querySelector('.screen');
  if (!screen) return;

  /* סדר ה-DOM המקורי נשמר פעם אחת. השחזור מרכיב אותו מחדש בדיוק,
     ולכן חזרה למובייל אחרי שינוי גודל מחזירה את המסך לקדמותו. */
  var original = Array.prototype.slice.call(screen.children);
  var isHero = function (el) {
    return el.classList.contains('hero-block') || el.classList.contains('hero-band');
  };

  function toDesktop() {
    if (screen.classList.contains('has-side')) return;

    var main = document.createElement('div');
    main.className = 'main-col';
    var side = document.createElement('aside');
    side.className = 'side-col';
    side.setAttribute('aria-label', 'סיכום ופעולות');

    var isPick = function (el) {
      return picks.some(function (sel) { return el.matches(sel); });
    };

    // הבאנר נשאר ילד ישיר ונפרש על שני הטורים
    original.forEach(function (el) {
      if (isHero(el)) return;
      (isPick(el) ? side : main).appendChild(el);
    });
    if (!side.childNodes.length) return;

    screen.appendChild(main);
    screen.appendChild(side);
    screen.classList.add('has-side');
  }

  function toMobile() {
    if (!screen.classList.contains('has-side')) return;
    original.forEach(function (el) { screen.appendChild(el); });
    var m = screen.querySelector('.main-col'), s = screen.querySelector('.side-col');
    if (m) m.remove();
    if (s) s.remove();
    screen.classList.remove('has-side');
  }

  function apply() { MQ.matches ? toDesktop() : toMobile(); }

  apply();
  if (MQ.addEventListener) MQ.addEventListener('change', apply);
  else MQ.addListener(apply);
})();
