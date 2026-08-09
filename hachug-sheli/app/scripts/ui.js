/* ============================================================
   ui.js · אייקונים, אווטארים ואזורים נפתחים
   שלושה דברים שחוזרים בכל מסך, במקום אחד.

   1) ICON  · אייקוני קו בצבע יחיד שיורשים currentColor.
              אין כאן אמוג'י: אייקון ניווט צריך להשתנות עם
              הצבע של ההורה ולהישאר חד בכל גודל.
   2) AVATAR· דמויות SVG פרמטריות לילדים, נבנות ממתכון
              ב-classes.json ולא מקובץ תמונה, כדי שאפשר יהיה
              להוסיף ילד בלי מעצב.
   3) ACC    · אזורים נפתחים. כל כותרת שאפשר לפתוח מקבלת חץ
              שמסתובב, כדי שהאפורדנס יהיה גלוי לפני הלחיצה.
   ============================================================ */
(function () {
  /* ---------- 1. אייקונים ---------- */
  var P = { fill: 'none', sw: 1.8 };
  var RAW = {
    search:   '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>',
    heart:    '<path d="M12 20s-7-4.3-7-9a4 4 0 017-2.6A4 4 0 0119 11c0 4.7-7 9-7 9z"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
    user:     '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20a7.5 7.5 0 0115 0"/>',
    chevron:  '<path d="M9 5l7 7-7 7"/>',
    down:     '<path d="M5 9l7 7 7-7"/>',
    pin:      '<path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    clock:    '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    wallet:   '<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18M16.5 14.5h1.5"/>',
    group:    '<circle cx="9" cy="9" r="3.4"/><path d="M3 19a6 6 0 0112 0"/><path d="M16 6.4a3.4 3.4 0 010 5.2M17.5 19a6 6 0 00-1.7-4.2"/>',
    car:      '<path d="M4 16v2.5M20 16v2.5"/><rect x="3" y="10.5" width="18" height="5.5" rx="2"/><path d="M5.5 10.5l1.8-4A2 2 0 019.2 5h5.6a2 2 0 011.9 1.4l1.8 4"/><path d="M6.8 13.2h.01M17.2 13.2h.01"/>',
    list:     '<path d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01"/>',
    map:      '<path d="M9 4.5L3.5 7v12.5L9 17l6 2.5 5.5-2.5V4.5L15 7z"/><path d="M9 4.5V17M15 7v12.5"/>',
    tag:      '<path d="M4 11.5V5a1 1 0 011-1h6.5a2 2 0 011.4.6l7 7a2 2 0 010 2.8l-5.5 5.5a2 2 0 01-2.8 0l-7-7A2 2 0 014 11.5z"/><path d="M8 8h.01"/>',
    check:    '<path d="M5 12.5l4.5 4.5L19 7"/>',
    bell:     '<path d="M6.5 10a5.5 5.5 0 0111 0c0 4 1.5 5.5 1.5 5.5H5S6.5 14 6.5 10z"/><path d="M10 19a2.2 2.2 0 004 0"/>',
    share:    '<circle cx="17.5" cy="6" r="2.6"/><circle cx="6.5" cy="12" r="2.6"/><circle cx="17.5" cy="18" r="2.6"/><path d="M8.8 10.8l6.4-3.5M8.8 13.2l6.4 3.5"/>',
    plus:     '<path d="M12 5.5v13M5.5 12h13"/>',
    sparkle:  '<path d="M12 4l1.9 5.1L19 11l-5.1 1.9L12 18l-1.9-5.1L5 11l5.1-1.9z"/>',
    trophy:   '<path d="M7.5 4h9v4.5a4.5 4.5 0 01-9 0z"/><path d="M7.5 5.5H5a2.5 2.5 0 002.5 2.5M16.5 5.5H19a2.5 2.5 0 01-2.5 2.5"/><path d="M12 13v3M9 20h6M10 16.5h4"/>',

    /* --- זהות התחום של החוג. היה כאן אמוג'י צבעוני, והוחלף באייקוני קו
           שיורשים currentColor, כי אמוג'י לא מתחלף במצב נבחר, מרונדר
           אחרת בכל מערכת הפעלה, ומאבד קריאות מתחת ל-20 פיקסלים. --- */
    sport:    '<circle cx="12" cy="12" r="8.6"/><path d="M12 3.9l4.7 3.4-1.8 5.5H9.1L7.3 7.3z"/><path d="M16.7 7.3l4.4 1.5M7.3 7.3L2.9 8.8M9.1 12.8l-2.7 4.8M14.9 12.8l2.7 4.8"/>',
    art:      '<path d="M12 3.6c-4.8 0-8.6 3.6-8.6 8.1s3.8 8.1 8.6 8.1c1.2 0 2-.8 2-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .9-1.8 1.9-1.8h1.4c2.4 0 4.3-2 4.3-4.4 0-3.7-3.8-5.8-8.6-5.8z"/><path d="M7.9 11.4h.01M10.6 8.1h.01M14.7 8.5h.01"/>',
    tech:     '<rect x="4" y="8.2" width="16" height="11.3" rx="3"/><circle cx="12" cy="3.6" r="1.5"/><path d="M12 5.1v3.1M9.6 13.2h.01M14.4 13.2h.01M9.4 16.6h5.2M4 12.6H2.4M20 12.6h1.6"/>',
    dance:    '<circle cx="14.2" cy="4.5" r="2.1"/><path d="M14.2 7.1l-3.6 3.3 2.5 2.7-1.3 6.6M12.6 12.9l4.6 1.7M10.6 10.4L6.4 12M11.8 19.7L7.4 21.6"/>',

    /* --- גליפים שהיו תווי טקסט (✓ ! × ★) והפכו לאייקונים --- */
    x:        '<path d="M6.6 6.6l10.8 10.8M17.4 6.6L6.6 17.4"/>',
    alert:    '<circle cx="12" cy="12" r="8.6"/><path d="M12 7.6v5M12 16.2h.01"/>',
    star:     '<path d="M12 3.6l2.6 5.3 5.8.9-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.2-4.1 5.8-.9z"/>',
    edit:     '<path d="M4 20h4l10.5-10.5a2.1 2.1 0 000-3l-1-1a2.1 2.1 0 00-3 0L4 16z"/><path d="M13.5 6.5l4 4"/>',
    trash:    '<path d="M4.5 6.5h15M9.5 6.5V4.8a1.3 1.3 0 011.3-1.3h2.4a1.3 1.3 0 011.3 1.3v1.7"/><path d="M6.5 6.5l.9 12.2a1.6 1.6 0 001.6 1.5h6a1.6 1.6 0 001.6-1.5l.9-12.2"/>',
    mail:     '<rect x="3" y="5.5" width="18" height="13" rx="2.6"/><path d="M3.6 7l7.3 5.4a1.9 1.9 0 002.2 0L20.4 7"/>',
    link:     '<path d="M10.5 13.5a4 4 0 005.7 0l3-3a4 4 0 10-5.7-5.7l-1.2 1.2"/><path d="M13.5 10.5a4 4 0 00-5.7 0l-3 3a4 4 0 105.7 5.7l1.2-1.2"/>'
  };

  // אייקונים שממולאים במקום להיות קו, כמו כוכב הדירוג
  var FILLED = { star: 1 };

  function icon(name, cls) {
    var d = RAW[name];
    if (!d) return '';
    var filled = FILLED[name];
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" ' +
      'fill="' + (filled ? 'currentColor' : P.fill) + '" stroke="currentColor" stroke-width="' +
      (filled ? 1.2 : P.sw) +
      '" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
  }

  /* ---------- תפוסה: מקור אמת אחד לצבע ולנוסח ----------
     היה כאן פער: מסך החיפוש סימן חוג עם 6 מקומות בתג ירוק "יש מקום",
     ובאותו רגע דף החוג הציג עליו בר אדום. אותו חוג, שתי הצהרות מנוגדות. */
  function spots(cls) {
    var n = cls.spotsLeft;
    if (n <= 2) return { level: 'low',  short: 'נותרו ' + n + ' מקומות', long: 'נותרו ' + n + ' מקומות בלבד בקבוצה הזו' };
    if (n <= 5) return { level: 'few',  short: 'נותרו ' + n + ' מקומות', long: 'נותרו ' + n + ' מקומות בקבוצה הזו' };
    return { level: 'open', short: 'יש מקום', long: 'יש מקום בקבוצה, ' + n + ' מתוך ' + cls.groupSize + ' פנויים' };
  }

  // מחליף כל <i data-ic="search"></i> באייקון אמיתי
  function paint(root) {
    (root || document).querySelectorAll('[data-ic]').forEach(function (el) {
      if (el.dataset.icPainted) return;
      el.innerHTML = icon(el.getAttribute('data-ic')) + el.innerHTML;
      el.dataset.icPainted = '1';
    });
  }

  /* ---------- 2. אווטארים ---------- */
  // כל תסרוקת היא פונקציה של צבע, כדי שהוספת ילד תהיה שורה ב-JSON
  var HAIR = {
    curly: function (c, c2) {
      return '<g fill="' + c + '"><circle cx="19" cy="20" r="8.5"/><circle cx="32" cy="14" r="10"/>' +
        '<circle cx="45" cy="20" r="8.5"/><circle cx="14.5" cy="29" r="6.5"/><circle cx="49.5" cy="29" r="6.5"/></g>';
    },
    short: function (c) {
      return '<path d="M13 30c0-11.5 8.5-19 19-19s19 7.5 19 19c0-6.5-6.5-10-19-10s-19 3.5-19 10z" fill="' + c + '"/>';
    },
    bun: function (c) {
      return '<circle cx="32" cy="7.5" r="6.5" fill="' + c + '"/>' +
        '<path d="M13 30c0-11.5 8.5-19 19-19s19 7.5 19 19c0-6.5-6.5-10-19-10s-19 3.5-19 10z" fill="' + c + '"/>';
    },
    long: function (c) {
      return '<path d="M12 31c0-12.5 9-21 20-21s20 8.5 20 21v15c0 2.2-2.3 3.4-4.2 2.1l-1.3-.9V33c0-8-6.1-12-14.5-12S17.5 25 17.5 33v14.2l-1.3.9C14.3 49.4 12 48.2 12 46z" fill="' + c + '"/>';
    },
    cap: function (c, c2) {
      return '<path d="M13 29c0-11 8.5-19.5 19-19.5S51 18 51 29z" fill="' + c + '"/>' +
        '<rect x="8" y="27" width="48" height="6" rx="3" fill="' + (c2 || c) + '"/>';
    }
  };

  var ACC = {
    freckles: '<g fill="#C98A66" opacity=".75"><circle cx="21" cy="36" r="1.1"/><circle cx="24.5" cy="38" r="1.1"/>' +
              '<circle cx="43" cy="36" r="1.1"/><circle cx="39.5" cy="38" r="1.1"/></g>',
    glasses:  '<g fill="none" stroke="#17252A" stroke-width="2" opacity=".8">' +
              '<circle cx="25" cy="33" r="6"/><circle cx="39" cy="33" r="6"/><path d="M31 33h2"/></g>',
    none:     ''
  };

  function avatar(kid, size) {
    var a = kid.avatar || {};
    var skin = a.skin || '#F2C6A0';
    var hair = a.hair || '#3B2A1E';
    var hair2 = a.hair2 || hair;
    var bg = a.bg || '#E6F4F2';
    var style = HAIR[a.style] ? a.style : 'short';
    var s = size || 64;

    return '' +
      '<svg class="kidav" width="' + s + '" height="' + s + '" viewBox="0 0 64 64" role="img" ' +
      'aria-label="' + (kid.name || '') + '">' +
        '<circle cx="32" cy="32" r="32" fill="' + bg + '"/>' +
        // כתפיים, כדי שהדמות לא תרחף
        '<path d="M11 64c1.5-11 10-17 21-17s19.5 6 21 17z" fill="' + (a.shirt || '#FFFFFF') + '"/>' +
        // אוזניים
        '<circle cx="14.5" cy="33" r="4" fill="' + skin + '"/><circle cx="49.5" cy="33" r="4" fill="' + skin + '"/>' +
        // פנים
        '<rect x="14" y="14" width="36" height="36" rx="17" fill="' + skin + '"/>' +
        HAIR[style](hair, hair2) +
        // לחיים
        '<g fill="#F08A8A" opacity=".38"><circle cx="21.5" cy="37.5" r="4"/><circle cx="42.5" cy="37.5" r="4"/></g>' +
        // עיניים
        '<g fill="#17252A"><ellipse cx="25.5" cy="32" rx="2.3" ry="2.7"/><ellipse cx="38.5" cy="32" rx="2.3" ry="2.7"/></g>' +
        '<g fill="#fff" opacity=".9"><circle cx="26.3" cy="31.1" r=".8"/><circle cx="39.3" cy="31.1" r=".8"/></g>' +
        // חיוך
        '<path d="M27 40.5c1.6 2 3.2 3 5 3s3.4-1 5-3" fill="none" stroke="#17252A" ' +
        'stroke-width="2" stroke-linecap="round"/>' +
        (ACC[a.acc] || '') +
      '</svg>';
  }

  /* ---------- 3. אזורים נפתחים ---------- */
  // כל <section class="fold"> עם <h2 class="fold-h"> מקבל חץ ומתנהג כאקורדיון
  function foldable(root) {
    (root || document).querySelectorAll('.fold').forEach(function (sec) {
      var head = sec.querySelector('.fold-h');
      var body = sec.querySelector('.fold-b');
      if (!head || !body || head.dataset.foldReady) return;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fold-btn';
      btn.innerHTML = '<span class="fold-t">' + head.innerHTML + '</span>' +
        '<span class="fold-arrow">' + icon('down') + '</span>';
      head.innerHTML = '';
      head.appendChild(btn);
      head.dataset.foldReady = '1';

      var open = sec.hasAttribute('data-open');
      function apply() {
        sec.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        body.hidden = !open;
      }
      btn.addEventListener('click', function () { open = !open; apply(); });
      apply();
    });
  }

  /* ---------- 4. משוב: toast והכרזה לקורא מסך ----------
     כל פעולה שמשנה מצב חייבת להיראות וגם להישמע. עד עכשיו רשימת
     התוצאות נבנתה מחדש בכל שינוי בחירת ילד בלי ששום דבר הוכרז. */
  var liveEl = null;
  function live() {
    if (liveEl) return liveEl;
    liveEl = document.createElement('p');
    liveEl.className = 'sr-only';
    liveEl.setAttribute('role', 'status');
    liveEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(liveEl);
    return liveEl;
  }
  function announce(msg) { live().textContent = msg; }

  var toastEl = null, toastT = null;
  function toast(msg, opts) {
    opts = opts || {};
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = icon(opts.icon || 'check') + '<span>' + msg + '</span>' +
      (opts.action ? '<button type="button" class="toast-act">' + opts.action + '</button>' : '');
    toastEl.classList.add('on');
    if (opts.action && opts.onAction) {
      toastEl.querySelector('.toast-act').addEventListener('click', function () {
        toastEl.classList.remove('on');
        opts.onAction();
      });
    }
    announce(msg);
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('on'); }, opts.ms || 3600);
  }

  /* ---------- 5. שלד טעינה ----------
     הדאטה כאן סינכרונית, אבל מסך שמראה מה עומד להגיע במקום לקפוץ
     מריק למלא הוא ההבדל בין דמו לבין מוצר. */
  function skeleton(n, kind) {
    var one = '<div class="skel skel-' + (kind || 'card') + '" aria-hidden="true"></div>';
    return new Array((n || 3) + 1).join(one);
  }

  window.UI = {
    icon: icon, paint: paint, avatar: avatar, foldable: foldable, spots: spots,
    toast: toast, announce: announce, skeleton: skeleton, HAIR: HAIR
  };

  document.addEventListener('DOMContentLoaded', function () { paint(); foldable(); });
  if (document.readyState !== 'loading') { paint(); foldable(); }
})();
