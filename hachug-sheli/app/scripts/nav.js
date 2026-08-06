/* ============================================================
   nav.js · התפריט התחתון
   מוגדר פעם אחת, כדי שהוספת מסך תהיה שורה אחת ולא ארבעה
   קבצים שצריך לזכור לעדכן. האייקונים הם קו בצבע יחיד
   שיורש את צבע הלשונית, ולא אמוג'י.
   ============================================================ */
(function () {
  var TABS = [
    { href: 'home.html', ic: 'search', label: 'חיפוש' },
    { href: 'saved.html', ic: 'heart', label: 'שמורים' },
    { href: 'family-board.html', ic: 'calendar', label: 'הלוח שלנו' },
    { href: 'profile.html', ic: 'user', label: 'פרופיל' }
  ];

  // מסכי משנה מדליקים את הלשונית שהם שייכים אליה
  var BELONGS = { 'class.html': 'home.html', 'checkout.html': 'home.html' };

  var here = location.pathname.split('/').pop() || 'home.html';
  var active = BELONGS[here] || here;

  var host = document.getElementById('nav');
  if (!host || !window.UI) return;

  host.className = 'bottom-nav';
  host.innerHTML = TABS.map(function (t) {
    var on = t.href === active;
    return '<a href="' + t.href + '"' + (on ? ' class="active" aria-current="page"' : '') + '>' +
      window.UI.icon(t.ic) + t.label + '</a>';
  }).join('');
})();
