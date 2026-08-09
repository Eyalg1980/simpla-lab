/* ============================================================
   store.js · המצב שנוצר על ידי המשתמש
   שמורים והרשמות. בחירת הילדים ממשיכה לנסוע בכתובת (ראו kids.js),
   כי היא צריכה לשרוד שיתוף קישור. שמורים והרשמות הם ההפך: הם
   שייכים למכשיר ולא לקישור, ולכן הם יושבים ב-sessionStorage עם
   נפילה חיננית לזיכרון אם האחסון חסום.

   הזרעה: בפעם הראשונה נטענים השמורים לדוגמה מ-classes.json, כדי
   שהמסך לא יתחיל ריק בהדגמה. מרגע שהמשתמש נגע, המצב שלו מנצח.
   ============================================================ */
(function () {
  var KEY = 'hachug.v1';
  var mem = null;

  function read() {
    if (mem) return mem;
    var raw = null;
    try { raw = sessionStorage.getItem(KEY); } catch (e) { /* אחסון חסום */ }
    if (raw) {
      try { mem = JSON.parse(raw); } catch (e) { mem = null; }
    }
    if (!mem) {
      var seed = (window.APP_DATA && window.APP_DATA.saved) || [];
      mem = {
        saved: seed.map(function (s) {
          return { classId: s.classId, note: s.note, for: s.for.slice(), addedAgo: s.addedAgo };
        }),
        enrolled: []
      };
    }
    return mem;
  }

  function write() {
    try { sessionStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* נשאר בזיכרון */ }
    document.dispatchEvent(new CustomEvent('store:change'));
  }

  /* ---------- שמורים ---------- */
  function saved() { return read().saved; }
  function isSaved(id) { return saved().some(function (s) { return s.classId === id; }); }

  function toggleSave(id, kidIds) {
    var list = read().saved;
    var i = list.findIndex(function (s) { return s.classId === id; });
    if (i > -1) { list.splice(i, 1); write(); return false; }
    list.unshift({
      classId: id,
      note: '',
      for: (kidIds && kidIds.length) ? kidIds.slice() : (window.APP_DATA.kids || []).map(function (k) { return k.id; }),
      addedAgo: 'עכשיו'
    });
    write();
    return true;
  }

  function setNote(id, note) {
    var s = read().saved.filter(function (x) { return x.classId === id; })[0];
    if (!s) return;
    s.note = note;
    write();
  }

  /* ---------- הרשמות ----------
     ההרשמה נכנסת ללוח, ולכן חוג שנרשמנו אליו נספר גם בבדיקת
     ההתנגשויות. בלי זה, שתי הרשמות באותו סשן לאותה שעה לא היו
     מייצרות שום אזהרה, במוצר שכל התזה שלו היא מניעת התנגשויות. */
  function enrolled() { return read().enrolled; }

  function enroll(classId, kidIds, mode) {
    var list = read().enrolled;
    kidIds.forEach(function (kid) {
      if (list.some(function (e) { return e.classId === classId && e.kidId === kid; })) return;
      list.push({ classId: classId, kidId: kid, mode: mode });
    });
    write();
  }

  function isEnrolled(classId, kidId) {
    return enrolled().some(function (e) { return e.classId === classId && (!kidId || e.kidId === kidId); });
  }

  // כל החוגים שילד רשום אליהם, בפורמט של kid.schedule
  function busyFor(kidId) {
    var D = window.APP_DATA;
    return enrolled().filter(function (e) { return e.kidId === kidId; }).map(function (e) {
      var c = D.classes.filter(function (x) { return x.id === e.classId; })[0];
      return c ? { day: c.day, from: c.from, to: c.to, what: c.name, classId: c.id } : null;
    }).filter(Boolean);
  }

  window.Store = {
    saved: saved, isSaved: isSaved, toggleSave: toggleSave, setNote: setNote,
    enrolled: enrolled, enroll: enroll, isEnrolled: isEnrolled, busyFor: busyFor,
    onChange: function (fn) { document.addEventListener('store:change', fn); }
  };
})();
