/* ============================================================
   appbar.js · הכותרת העליונה הקבועה
   בר אחד לכל המסכים, נבנה ב-JS ולא מועתק לארבעה קבצים,
   כדי שתיקון אחד יגיע לכולם.

   שימוש: <body data-back="class.html"> קובע לאן חוזרים.
   בלי התכונה, החזרה היא למסך החיפוש. data-back="" מבטל את
   הכפתור (מסך הבית). data-title דורס את שם המסך.

   הכפתור מנסה קודם את ההיסטוריה של הדפדפן, כדי שהחזרה תרגיש
   כמו החזרה של הטלפון, ורק אם אין היסטוריה פנימית הוא מנווט.
   ============================================================ */
(function () {
  var body = document.body;
  var back = body.getAttribute('data-back');
  if (back === null) back = 'home.html';

  var bar = document.createElement('header');
  bar.className = 'appbar';

  // חץ RTL: מצביע ימינה, כי "אחורה" בעברית היא לכיוון ימין
  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'appbar-back';
  btn.innerHTML = ARROW;
  btn.setAttribute('aria-label', 'חזרה');
  if (!back) { btn.disabled = true; btn.setAttribute('aria-hidden', 'true'); }

  btn.addEventListener('click', function () {
    var internal = document.referrer && document.referrer.indexOf(location.host) > -1;
    if (history.length > 1 && (internal || location.protocol === 'file:')) { history.back(); return; }
    var q = (window.Kids && window.Kids.param) ? '?kids=' + encodeURIComponent(window.Kids.param()) : '';
    location.href = back + q;
  });

  var name = document.createElement('span');
  name.className = 'appbar-name';
  name.textContent = body.getAttribute('data-title') || 'החוג שלי';

  var pad = document.createElement('span');
  pad.className = 'appbar-pad';

  bar.appendChild(btn);
  bar.appendChild(name);
  bar.appendChild(pad);
  body.insertBefore(bar, body.firstChild);
})();
