// main.js - התנהגות האתר. סטודנטים: לא חובה לגעת.
(function () {
  'use strict';

  /* ---------- אייקונים ----------
     אותו עיקרון כמו באפליקציה: אייקוני קו בצבע יחיד שיורשים currentColor.
     אין כאן אמוג'י ואין קובץ אייקונים חיצוני. שימוש: <span data-ic="mail"></span> */
  const ICONS = {
    mail:     '<rect x="3" y="5.5" width="18" height="13" rx="2.6"/><path d="M3.6 7l7.3 5.4a1.9 1.9 0 002.2 0L20.4 7"/>',
    down:     '<path d="M5 9l7 7 7-7"/>',
    chevron:  '<path d="M9 5l7 7-7 7"/>',
    doc:      '<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    route:    '<circle cx="6" cy="18.5" r="2.5"/><circle cx="18" cy="5.5" r="2.5"/><path d="M8.5 18.5h6a3.5 3.5 0 000-7h-5a3.5 3.5 0 010-7h5"/>',
    mic:      '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0013 0M12 18v3M9 21h6"/>',
    group:    '<circle cx="9" cy="9" r="3.4"/><path d="M3 19a6 6 0 0112 0"/><path d="M16 6.4a3.4 3.4 0 010 5.2M17.5 19a6 6 0 00-1.7-4.2"/>',
    user:     '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20a7.5 7.5 0 0115 0"/>',
    map:      '<path d="M9 4.5L3.5 7v12.5L9 17l6 2.5 5.5-2.5V4.5L15 7z"/><path d="M9 4.5V17M15 7v12.5"/>',
    tag:      '<path d="M4 11.5V5a1 1 0 011-1h6.5a2 2 0 011.4.6l7 7a2 2 0 010 2.8l-5.5 5.5a2 2 0 01-2.8 0l-7-7A2 2 0 014 11.5z"/><path d="M8 8h.01"/>',
    sparkle:  '<path d="M12 4l1.9 5.1L19 11l-5.1 1.9L12 18l-1.9-5.1L5 11l5.1-1.9z"/>',
    check:    '<path d="M5 12.5l4.5 4.5L19 7"/>',
    scissors: '<circle cx="6.5" cy="6.5" r="2.5"/><circle cx="6.5" cy="17.5" r="2.5"/><path d="M8.7 7.9L20 18M20 6L8.7 16.1"/>',
    info:     '<circle cx="12" cy="12" r="8.6"/><path d="M12 16.4v-5M12 7.8h.01"/>',
    external: '<path d="M14 4h6v6"/><path d="M20 4l-8.5 8.5"/><path d="M18 14v4.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 014 18.5v-11A1.5 1.5 0 015.5 6H10"/>',
    link:     '<path d="M10.5 13.5a4 4 0 005.7 0l3-3a4 4 0 10-5.7-5.7l-1.2 1.2"/><path d="M13.5 10.5a4 4 0 00-5.7 0l-3 3a4 4 0 105.7 5.7l1.2-1.2"/>',
    menu:     '<path d="M4 7h16M4 12h16M4 17h16"/>'
  };

  const icon = (name) => {
    const d = ICONS[name];
    if (!d) return '';
    return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
  };

  document.querySelectorAll('[data-ic]').forEach((el) => {
    el.insertAdjacentHTML('afterbegin', icon(el.getAttribute('data-ic')));
  });

  // קישור שנפתח בלשונית חדשה מקבל סימן, ומודיע על כך לקורא מסך
  document.querySelectorAll('a[target="_blank"]').forEach((a) => {
    if (a.querySelector('svg')) return;
    a.insertAdjacentHTML('beforeend', ' ' + icon('external') +
      '<span class="sr-only">נפתח בלשונית חדשה</span>');
  });

  // Reveal on scroll, מכבד prefers-reduced-motion
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.reveal');
  const showAll = () => targets.forEach((el) => el.classList.add('is-visible'));

  if (reduced || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    // threshold 0 ולא 0.15: בלוק גבוה מהמסך במובייל לא מגיע ל-15 אחוז
    // לעולם, והתוכן שלו היה נשאר בלתי נראה
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    );
    // stagger עדין: 60ms בין אחים סמוכים, נספר בתוך ההורה ולא בכל הדף
    targets.forEach((el) => {
      const sibs = Array.prototype.filter.call(el.parentElement.children, (n) => n.classList.contains('reveal'));
      el.style.transitionDelay = Math.min(sibs.indexOf(el), 5) * 60 + 'ms';
      io.observe(el);
    });
    // רשת ביטחון: אם משהו לא נצפה תוך 3 שניות, מציגים בכל מקרה
    setTimeout(showAll, 3000);
  }

  // שנה נוכחית בפוטר
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
