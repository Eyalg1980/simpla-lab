/* ============================================================
   kids.js · בוחר הילדים וחישוב ההתאמה
   נגזר מהמחקר: דנה מנהלת שני ילדים בראש ובאקסל. הבחירה היא
   אווטארים שנדלקים ונכבים, לא צ'קבוקסים, כי זה ההקשר הרגשי
   הנכון וכי זה מהיר יותר באגודל אחד.
   ============================================================ */
(function () {
  var D = window.APP_DATA;
  if (!D) return;

  var DAYS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
  var toMin = function (t) { var p = t.split(':'); return (+p[0]) * 60 + (+p[1]); };

  /* ---------- מצב הבחירה ---------- */
  // נשמר בכתובת כדי שהבחירה תשרוד מעבר בין מסכים, בלי אחסון בדפדפן
  function readSelection() {
    var q = new URLSearchParams(location.search).get('kids');
    if (!q) return D.kids.map(function (k) { return k.id; });   // ברירת מחדל: כולם
    if (q === 'none') return [];
    return q.split(',').filter(function (id) {
      return D.kids.some(function (k) { return k.id === id; });
    });
  }
  var selected = readSelection();

  function selectionParam() { return selected.length ? selected.join(',') : 'none'; }

  // כל קישור פנימי נושא איתו את הבחירה
  function propagate() {
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || /^(https?:|mailto:|#)/.test(href)) return;
      var base = href.split('?')[0].split('#')[0];
      if (!/\.html$/.test(base)) return;
      var hash = href.indexOf('#') > -1 ? href.slice(href.indexOf('#')) : '';
      a.setAttribute('href', base + '?kids=' + encodeURIComponent(selectionParam()) + hash);
    });
  }

  /* ---------- חישוב ההתאמה ---------- */
  // מחזיר רשימת ממצאים לכל ילד מול חוג. כל ממצא הוא עובדה, לא ציון כולל,
  // כי הורה רוצה לדעת מה בדיוק לא מתאים ולא מספר מ-1 עד 10.
  function fitFor(kid, cls) {
    var out = { kid: kid, ok: [], warn: [], block: [] };
    var f = kid.gender === 'f';
    var G = {
      age:   f ? 'בת ' : 'בן ',
      free:  f ? 'פנויה ביום ' : 'פנוי ביום ',
      loves: f ? 'לא נוגע בתחומים שהיא אוהבת היום, וזה יכול להיות דווקא טוב'
               : 'לא נוגע בתחומים שהוא אוהב היום, וזה יכול להיות דווקא טוב',
      atKid: f ? 'ואצלה זה בדרך כלל לא עובד' : 'ואצלו זה בדרך כלל לא עובד'
    };

    if (kid.age < cls.ageMin || kid.age > cls.ageMax) {
      out.block.push(G.age + kid.age + ', והקבוצה היא לגילאי ' + cls.ageMin + ' עד ' + cls.ageMax);
    } else {
      out.ok.push('בול בטווח הגילאים של הקבוצה');
    }

    var clash = (kid.schedule || []).filter(function (s) {
      return s.day === cls.day && toMin(s.from) < toMin(cls.to) && toMin(cls.from) < toMin(s.to);
    });
    if (clash.length) {
      out.block.push('מתנגש עם ' + clash[0].what + ' ביום ' + cls.day + ' ' + clash[0].from);
    } else {
      out.ok.push(G.free + cls.day + ' בשעה הזאת');
    }

    var shared = (kid.interests || []).filter(function (i) { return cls.tags.indexOf(i) > -1; });
    if (shared.length >= 2) out.ok.push('מתחבר ל' + shared.slice(0, 2).join(' ול'));
    else if (shared.length === 1) out.ok.push('מתחבר ל' + shared[0]);
    else out.warn.push(G.loves);

    var against = (kid.avoid || []).filter(function (i) { return cls.tags.indexOf(i) > -1; });
    if (against.length) out.warn.push('החוג מתויג ' + against[0] + ', ' + G.atKid);

    if (cls.travelMin > 12) out.warn.push(cls.travelMin + ' דקות נסיעה, בדקו מול שעת האיסוף');
    else out.ok.push(cls.travelMin + ' דקות מהבית');

    out.verdict = out.block.length ? 'block' : (out.warn.length ? 'warn' : 'ok');
    return out;
  }

  /* ---------- רינדור בוחר האווטארים ---------- */
  function renderPicker(host) {
    host.className = 'kidpick';
    host.innerHTML = '';

    var label = document.createElement('p');
    label.className = 'kidpick-label';
    label.textContent = 'למי מחפשים?';
    host.appendChild(label);

    var row = document.createElement('div');
    row.className = 'kidpick-row';

    D.kids.forEach(function (k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'kidchip kid-' + k.colorKey + (selected.indexOf(k.id) > -1 ? ' on' : '');
      b.setAttribute('aria-pressed', selected.indexOf(k.id) > -1 ? 'true' : 'false');
      b.innerHTML =
        '<span class="kidchip-face">' + k.emoji + '</span>' +
        '<span class="kidchip-name">' + k.name + '</span>' +
        '<span class="kidchip-age">' + k.age + '</span>';
      b.addEventListener('click', function () {
        var i = selected.indexOf(k.id);
        if (i > -1) selected.splice(i, 1); else selected.push(k.id);
        renderPicker(host);
        propagate();
        document.dispatchEvent(new CustomEvent('kids:change', { detail: { selected: selected.slice() } }));
      });
      row.appendChild(b);
    });

    host.appendChild(row);

    var hint = document.createElement('p');
    hint.className = 'kidpick-hint';
    var one = selectedKids()[0];
    hint.textContent = selected.length === 0
      ? 'אף ילד לא מסומן, אז רואים את הכל'
      : (selected.length === D.kids.length
          ? 'כל הילדים מסומנים'
          : (one.gender === 'f' ? 'מסומנת ' : 'מסומן ') + one.name + ' בלבד');
    host.appendChild(hint);
  }

  function selectedKids() {
    return D.kids.filter(function (k) { return selected.indexOf(k.id) > -1; });
  }

  /* ---------- API ---------- */
  window.Kids = {
    all: D.kids,
    data: D,
    get selected() { return selectedKids(); },
    param: selectionParam,
    fitFor: fitFor,
    mount: function (sel) {
      var host = document.querySelector(sel);
      if (host) renderPicker(host);
      propagate();
    },
    onChange: function (fn) { document.addEventListener('kids:change', fn); }
  };
})();
