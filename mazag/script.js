/* ============================================================
   מזג — script.js
   One shared file for all eight screens. Every setup function
   checks that its elements exist before wiring anything up,
   so the same file is safe to load on every page.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- nav drawer, present on every screen ----------
     The drawer is a native <dialog>. showModal() brings focus trapping,
     Escape to close, the top layer and correct screen-reader semantics
     with no code of ours, so all we wire up is open, close and
     click-on-the-backdrop. */

  function setupNavDrawer() {
    var toggle = document.getElementById("menu-toggle");
    var close = document.getElementById("menu-close");
    var drawer = document.getElementById("nav-drawer");
    if (!toggle || !drawer || typeof drawer.showModal !== "function") return;

    toggle.addEventListener("click", function () {
      drawer.showModal();
      toggle.setAttribute("aria-expanded", "true");
    });

    if (close) {
      close.addEventListener("click", function () {
        drawer.close();
      });
    }

    // clicking the dimmed area outside the panel closes it
    drawer.addEventListener("click", function (event) {
      if (event.target === drawer) drawer.close();
    });

    drawer.addEventListener("close", function () {
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    });
  }

  /* ---------- toast, announced as well as shown ---------- */

  function toast(message) {
    var region = document.getElementById("toast-region");
    if (!region) return;
    region.textContent = "";
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    region.appendChild(el);
    window.setTimeout(function () {
      if (el.parentNode === region) region.removeChild(el);
    }, 2400);
  }

  /* ---------- התקנה ----------
     beforeinstallprompt נורה פעם אחת ולא ניתן להפעלה מחדש, ולכן האירוע
     נשמר ומוגש למשתמשת ברגע שנוח לה ולא ברגע שנוח לדפדפן. */

  var deferredInstall = null;

  function setupInstall() {
    var box = document.getElementById("install-prompt");
    if (!box) return;

    var accept = document.getElementById("install-accept");
    var dismiss = document.getElementById("install-dismiss");
    var KEY = "mazag.install-dismissed";

    function dismissed() {
      try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; }
    }

    window.addEventListener("beforeinstallprompt", function (event) {
      event.preventDefault();
      deferredInstall = event;
      if (!dismissed()) box.hidden = false;
    });

    accept.addEventListener("click", function () {
      box.hidden = true;
      if (!deferredInstall) return;
      deferredInstall.prompt();
      deferredInstall.userChoice.then(function (choice) {
        if (choice.outcome === "accepted") toast("מזג הותקנה");
        deferredInstall = null;
      });
    });

    dismiss.addEventListener("click", function () {
      box.hidden = true;
      try { localStorage.setItem(KEY, "1"); } catch (e) { /* חלון פרטי */ }
    });

    /* כבר מותקנת: אין מה להציע */
    if (window.matchMedia("(display-mode: standalone)").matches) box.hidden = true;
  }

  /* ---------- התראות ----------
     תזכורת מקומית. הדפדפן לא מתזמן התראה עתידית בלי שרת, ולכן ההגדרה
     נשמרת והבדיקה נעשית בכל פתיחה של האפליקציה. מה שזה לא עושה נאמר
     במפורש במסך, כדי שלא תישבר הבטחה. */

  var NOTIFY_KEY = "mazag.notify";

  function loadNotify() {
    try { return JSON.parse(localStorage.getItem(NOTIFY_KEY) || "null"); }
    catch (e) { return null; }
  }

  function saveNotify(v) {
    try { localStorage.setItem(NOTIFY_KEY, JSON.stringify(v)); return true; }
    catch (e) { return false; }
  }

  function notifyBody() {
    var cfg = loadNotify();
    if (cfg && cfg.style === "teaser" && window.Mazag) {
      return Mazag.dayCard(new Date()).headline;
    }
    return "התחזית של היום מחכה לך";
  }

  /* נקראת בכל טעינה של כל מסך: אם הגיעה השעה והיום עוד לא קיבל תזכורת, שולחת */
  function runDueNotification() {
    var cfg = loadNotify();
    if (!cfg || !cfg.on) return;
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    var now = new Date();
    var today = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
    if (cfg.lastSent === today) return;

    var parts = String(cfg.time || "07:30").split(":");
    var due = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
                       Number(parts[0]) || 7, Number(parts[1]) || 30, 0);
    if (now < due) return;

    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then(function (reg) {
        if (reg.active) reg.active.postMessage({ type: "mazag-notify", body: notifyBody() });
      });
    }
    cfg.lastSent = today;
    saveNotify(cfg);
  }

  function setupNotifications() {
    var enable = document.getElementById("notify-enable");
    if (!enable) return;

    var time = document.getElementById("notify-time");
    var test = document.getElementById("notify-test");
    var state = document.getElementById("notify-state");
    var styles = Array.prototype.slice.call(document.querySelectorAll("[name=notify-style]"));

    var cfg = loadNotify() || { on: false, time: "07:30", style: "quiet" };
    time.value = cfg.time;
    styles.forEach(function (r) { r.checked = r.value === cfg.style; });

    function render() {
      if (!("Notification" in window)) {
        state.textContent = "הדפדפן הזה לא תומך בהתראות.";
        enable.disabled = true;
        return;
      }
      if (Notification.permission === "denied") {
        state.textContent = "ההתראות חסומות בהגדרות הדפדפן, וצריך לפתוח אותן שם.";
        enable.disabled = true;
        return;
      }
      if (Notification.permission === "granted" && cfg.on) {
        state.textContent = "התזכורת פעילה לשעה " + cfg.time + ".";
        enable.textContent = "כיבוי התזכורת";
        return;
      }
      state.textContent = "התזכורת כבויה.";
      enable.textContent = "הפעלת תזכורת";
    }

    function collect() {
      cfg.time = time.value || "07:30";
      var picked = styles.filter(function (r) { return r.checked; })[0];
      cfg.style = picked ? picked.value : "quiet";
    }

    enable.addEventListener("click", function () {
      collect();
      if (cfg.on) {
        cfg.on = false;
        saveNotify(cfg);
        render();
        return toast("התזכורת כובתה");
      }
      Notification.requestPermission().then(function (result) {
        if (result !== "granted") { render(); return toast("בלי הרשאה אין תזכורת"); }
        cfg.on = true;
        saveNotify(cfg);
        render();
        toast("התזכורת פעילה");
      });
    });

    test.addEventListener("click", function () {
      collect(); saveNotify(cfg);
      if (!("Notification" in window)) return toast("הדפדפן הזה לא תומך בהתראות");
      Notification.requestPermission().then(function (result) {
        if (result !== "granted") return toast("בלי הרשאה אין תזכורת");
        navigator.serviceWorker.ready.then(function (reg) {
          if (reg.active) reg.active.postMessage({ type: "mazag-notify", body: notifyBody() });
        });
      });
    });

    [time].concat(styles).forEach(function (el) {
      el.addEventListener("change", function () { collect(); saveNotify(cfg); render(); });
    });

    render();
  }

  /* ---------- קול ----------
     מסונתז ולא מוקלט. שלושה צלילים קצרים לא מצדיקים שלושה קבצים ועוד
     בקשות רשת, וסינתזה גם נותנת שליטה מלאה על העדינות שהמותג דורש.
     כבוי כברירת מחדל: צליל שנפתח לבד בבוקר הוא סיבה מוכרת להסרה. */

  var SOUND_KEY = "mazag.sound";
  var audioCtx = null;

  function soundOn() {
    try { return localStorage.getItem(SOUND_KEY) === "1"; } catch (e) { return false; }
  }

  function ctx() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) audioCtx = new AC();
    /* דפדפנים משהים את ההקשר עד למחווה של המשתמשת */
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  /* גל סינוס יחיד עם דעיכה מעריכית. בלי התקפה חדה, שלא יישמע כמו התראה */
  function tone(freq, seconds, gain) {
    var c = ctx();
    if (!c) return;
    var osc = c.createOscillator();
    var amp = c.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    amp.gain.setValueAtTime(0, c.currentTime);
    amp.gain.linearRampToValueAtTime(gain, c.currentTime + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + seconds);
    osc.connect(amp); amp.connect(c.destination);
    osc.start(); osc.stop(c.currentTime + seconds + 0.02);
  }

  /* שלושה צלילים, ולא יותר. כל אחד קשור לפעולה אחת */
  var SOUNDS = {
    reveal: function () { tone(392, 0.7, 0.05); window.setTimeout(function () { tone(587.33, 0.9, 0.035); }, 110); },
    save:   function () { tone(523.25, 0.35, 0.05); },
    tick:   function () { tone(880, 0.08, 0.025); }
  };

  function play(name) {
    if (!soundOn()) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var fn = SOUNDS[name];
    if (fn) { try { fn(); } catch (e) { /* הקשר חסום, לא שווה להפיל מסך בגלל צליל */ } }
  }

  function setupSound() {
    var box = document.getElementById("sound-toggle");
    if (!box) return;
    box.checked = soundOn();
    box.addEventListener("change", function () {
      try { localStorage.setItem(SOUND_KEY, box.checked ? "1" : "0"); } catch (e) { /* חלון פרטי */ }
      if (box.checked) play("tick");
      toast(box.checked ? "צליל פועל" : "צליל כבוי");
    });
  }

  /* ---------- ערכת נושא ----------
     שלושה מצבים. מערכת היא ברירת המחדל ולא מסמנת כלום על השורש, ולכן
     שינוי ההגדרה במכשיר משתקף מיד בלי שהאפליקציה צריכה לדעת עליו. */

  var THEME_KEY = "mazag.theme";

  function setupTheme() {
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-theme-choice]"));
    var media = window.matchMedia("(prefers-color-scheme: dark)");

    /* ברירת המחדל היא בהיר ולא מערכת. מכשיר שמוגדר כהה מקבל כהה רק אם
       המשתמשת בחרה בכך במפורש, או בחרה במפורש ללכת אחרי המכשיר */
    function choice() {
      try { return localStorage.getItem(THEME_KEY) || "light"; }
      catch (e) { return "light"; }
    }

    function resolved() {
      var c = choice();
      return (c === "dark" || (c === "system" && media.matches)) ? "dark" : "light";
    }

    /* הלוגו הוא תמונה, ו-CSS לא מחליף src. גרסה לבנה בלבד תיפול על המצב
       הידני, ולכן ההחלפה נעשית כאן ומכסה את שלושת המצבים */
    function paint() {
      var mode = resolved();
      document.documentElement.dataset.theme = mode;
      var want = mode === "dark" ? "assets/images/logo-new-dark.webp" : "assets/images/logo-new.webp";
      Array.prototype.forEach.call(
        document.querySelectorAll(".app-header__logo, .splash__logo"),
        function (img) { if (img.getAttribute("src") !== want) img.setAttribute("src", want); });
      var c = choice();
      items.forEach(function (b) {
        var on = b.dataset.themeChoice === c;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
    }

    items.forEach(function (b) {
      b.addEventListener("click", function () {
        try { localStorage.setItem(THEME_KEY, b.dataset.themeChoice); }
        catch (e) { /* חלון פרטי, המצב עדיין יחול עד הרענון */ }
        paint();
      });
    });

    /* שינוי ההגדרה במכשיר משנה כלום אלא אם נבחר "מערכת" */
    if (media.addEventListener) media.addEventListener("change", paint);

    paint();
  }

  /* ---------- which card is on show ----------
     By default the forecast shows the card the date itself selects: where the
     day sits on the arc, and in what tone. The archive links back with
     ?date=YYYY-MM-DD so one forecast page serves every day in the archive
     instead of a file per day. */

  function hebrewDate(d) {
    var days = ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"];
    function two(n) { return n < 10 ? "0" + n : String(n); }
    return days[d.getDay()] + ", " + two(d.getDate()) + "." + two(d.getMonth() + 1) + "." + d.getFullYear();
  }

  function requestedDate() {
    var m = /[?&]date=(\d{4})-(\d{2})-(\d{2})/.exec(window.location.search);
    if (!m) return new Date();
    var d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0);
    return isNaN(d.getTime()) ? new Date() : d;
  }

  function setupCardRouting() {
    var hero = document.getElementById("hero-card");
    var text = document.getElementById("forecast-text");
    if (!hero || !text) return;

    var skeleton = document.getElementById("forecast-skeleton");
    var skelText = document.getElementById("forecast-skeleton-text");
    var errorBox = document.getElementById("forecast-error");
    var guestErr = document.getElementById("guest-error");
    var why = document.getElementById("card-why");
    var stamp = document.querySelector(".forecast__date");

    function reveal() {
      play("reveal");
      if (skeleton) skeleton.hidden = true;
      if (skelText) skelText.hidden = true;
      hero.hidden = false;
      text.hidden = false;
    }

    function fail(box) {
      if (skeleton) skeleton.hidden = true;
      if (skelText) skelText.hidden = true;
      hero.hidden = true;
      text.hidden = true;
      if (why) why.hidden = true;
      if (box) box.hidden = false;
    }

    /* התאריך ידוע תמיד, גם כשהתחזית עוד לא, ולכן הוא נכתב לפני כל יציאה
       מוקדמת. אחרת מצב הטעינה מציג תאריך דמה מה-HTML */
    if (stamp) stamp.textContent = hebrewDate(new Date());

    /* מצבים נגישים לבדיקה, ולא רק לתיאור במסמך */
    var forced = /[?&]state=(loading|error)/.exec(window.location.search);
    if (forced && forced[1] === "loading") return;          // השלד נשאר
    if (forced && forced[1] === "error") return fail(errorBox || guestErr);

    /* קישור עם תאריך שאינו תאריך הוא הכשל האמיתי היחיד כאן, וכך הוא נראה */
    var raw = /[?&]date=([^&]+)/.exec(window.location.search);
    var when;
    if (raw) {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(decodeURIComponent(raw[1]));
      when = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0) : null;
      if (!when || isNaN(when.getTime())) return fail(guestErr || errorBox);
    } else {
      when = new Date();
    }

    var card;
    try { card = Mazag.dayCard(when); }
    catch (e) { return fail(errorBox || guestErr); }
    if (!card) return fail(errorBox || guestErr);

    hero.alt = card.alt;
    text.textContent = card.text;
    if (stamp) stamp.textContent = hebrewDate(when);
    if (why) why.textContent = "הירח היום ב" + card.phaseHe + ", ביסוד " + card.elementHe +
      ". מספר היום " + card.dayNumber + ".";

    /* השלד יורד רק כשיש באמת מה להראות, ולא כשהקוד סיים לרוץ */
    hero.addEventListener("load", reveal, { once: true });
    hero.addEventListener("error", function () { fail(errorBox || guestErr); }, { once: true });
    hero.src = card.image;
    if (hero.complete && hero.naturalWidth) reveal();
  }

  /* ---------- save and share on the forecast screen ---------- */

  function setupForecastActions() {
    var save = document.getElementById("save-btn");
    var share = document.getElementById("share-btn");

    if (save) {
      save.addEventListener("click", function () {
        var pressed = save.getAttribute("aria-pressed") === "true";
        save.setAttribute("aria-pressed", pressed ? "false" : "true");
        var label = save.querySelector(".action-button__label");
        if (label) label.textContent = pressed ? "שמור" : "נשמר";
        if (!pressed) play("save");
        toast(pressed ? "הוסר מהארכיון" : "נשמר בארכיון שלך");
      });
    }

    if (share) {
      share.addEventListener("click", function () {
        var payload = {
          title: "מזג",
          text: "התחזית שלי להיום",
          url: window.location.href
        };
        // Web Share exists on most phones; on desktop we fall back quietly.
        if (navigator.share) {
          navigator.share(payload).catch(function () { /* dismissed by the user */ });
          return;
        }
        if (navigator.clipboard) navigator.clipboard.writeText(payload.url);
        toast("הקישור הועתק");
      });
    }
  }

  /* ---------- edit mode: live percentages, kept summing to 100 ---------- */

  function setupWeights() {
    var form = document.getElementById("weights-form");
    if (!form) return;

    var ranges = Array.prototype.slice.call(form.querySelectorAll(".method-row__range"));
    if (!ranges.length) return;

    function render() {
      var total = ranges.reduce(function (sum, r) { return sum + Number(r.value); }, 0);
      ranges.forEach(function (range) {
        var row = range.closest(".method-row");
        var out = row ? row.querySelector(".method-row__pct") : null;

        // paint the travelled part of the track, which a native range does not do
        var min = Number(range.min);
        var max = Number(range.max);
        var travelled = max === min ? 0 : ((Number(range.value) - min) / (max - min)) * 100;
        range.style.setProperty("--travelled", travelled + "%");

        if (!out) return;
        // show each weight as a share of the whole, so the column always reads as 100
        var share = total === 0 ? 0 : Math.round((Number(range.value) / total) * 100);
        out.textContent = share + "%";
      });
    }

    ranges.forEach(function (range) {
      range.addEventListener("input", render);
    });

    // הגרירה פתוחה לכולם. רק השמירה תלויה במנוי, ולכן רק היא מתחלפת כאן
    var lock = document.getElementById("weights-lock");
    var controls = document.getElementById("weights-controls");
    var pro = Mazag.isPro();
    if (lock && controls && !pro) {
      lock.hidden = false;
      controls.hidden = true;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var button = form.querySelector("button[type=submit]");
      if (!button) return;

      // the width is locked by aria-busy styling, so the row does not jump
      button.setAttribute("aria-busy", "true");
      window.setTimeout(function () {
        button.removeAttribute("aria-busy");
        toast("המשקולות נשמרו, הן יחולו על התחזית הבאה");
      }, 700);
    });

    render();
  }

  /* ---------- subscription: one flag, two faces ---------- */

  function setupPlan() {
    var toggle = document.getElementById("plan-toggle");
    if (!toggle) return;

    var badge = document.getElementById("plan-badge");
    var title = document.getElementById("plan-title");
    var note  = document.getElementById("plan-note");
    var card  = document.getElementById("plan-status");

    function render() {
      var pro = Mazag.isPro();
      if (card) card.classList.toggle("plan-card--pro", pro);
      badge.textContent = pro ? "מנוי פעיל" : "מצב נוכחי";
      title.textContent = pro ? "מנוי מזג" : "חשבון חינם";
      note.textContent = pro
        ? "השליטה במשקולות פתוחה. אפשר לשנות, לשמור, ולחזור אחורה."
        : "את רואה את התחזית ואת המשקולות, ואת יכולה לגרור אותן ולראות מה קורה. השמירה סגורה.";
      toggle.textContent = pro ? "ביטול המנוי לבדיקה" : "הפעלת מנוי לבדיקה";
    }

    toggle.addEventListener("click", function () {
      var ok = Mazag.setPro(!Mazag.isPro());
      if (!ok) return toast("לא הצלחנו לשמור במכשיר. אם הדפדפן במצב פרטי, זו הסיבה.");
      render();
      toast(Mazag.isPro() ? "המנוי פעיל, מסך המשקולות פתוח" : "המנוי בוטל");
    });

    render();
  }

  /* ---------- archive: empty state is reachable at archive.html?state=empty ---------- */

  function setupArchive() {
    var grid = document.getElementById("archive-grid");
    var empty = document.getElementById("archive-empty");
    var skeleton = document.getElementById("archive-skeleton");
    if (!grid || !empty) return;

    function done() { if (skeleton) skeleton.hidden = true; grid.hidden = false; }

    if (window.location.search.indexOf("state=empty") > -1) {
      if (skeleton) skeleton.hidden = true;
      grid.hidden = true;
      empty.hidden = false;
      return;
    }

    // built from the same engine the forecast uses, so a tile always opens the
    // card it shows. a hand written list would drift the first time a card moved.
    var today = new Date();
    var html = "";
    for (var i = 0; i < 12; i++) {
      var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i, 12, 0, 0);
      var card = Mazag.dayCard(d);
      var iso = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
      html +=
        '<li class="archive__item">' +
          '<a href="daily-forecast.html?date=' + iso + '">' +
            '<img class="archive__thumb" src="' + card.thumb + '" alt="' + card.alt + '" width="93" height="139" loading="lazy" />' +
            '<span class="archive__date">' + pad(d.getDate()) + "." + pad(d.getMonth() + 1) + "." + String(d.getFullYear()).slice(2) + '</span>' +
          '</a>' +
        '</li>';
    }
    grid.innerHTML = html;
    done();
  }

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  /* ---------- splash: hands off to the forecast on its own ---------- */

  function setupSplash() {
    if (!document.querySelector(".splash__loader")) return;
    window.setTimeout(function () {
      window.location.href = "daily-forecast.html";
    }, 1800);
  }

  /* ---------- onboarding ----------
     Opens once on the first visit, and any time from the menu. It is a real
     <dialog>, so focus trapping and Escape come for free. The last step is the
     birth date rather than another picture, because ending onboarding on an
     action beats ending it on a close button. */

  var SEEN_KEY = "mazag.onboarded";

  function setupOnboarding() {
    var dialog = document.getElementById("onboarding");
    if (!dialog || typeof dialog.showModal !== "function") return;

    var steps = Array.prototype.slice.call(dialog.querySelectorAll(".onboard__step"));
    var dots = Array.prototype.slice.call(dialog.querySelectorAll(".dots__item"));
    var next = document.getElementById("onboard-next");
    var back = document.getElementById("onboard-back");
    var skip = document.getElementById("onboard-skip");
    var birth = document.getElementById("onboard-birth");
    var current = 0;

    function render() {
      steps.forEach(function (s, i) { s.hidden = i !== current; });
      dots.forEach(function (d, i) { d.setAttribute("aria-selected", i === current ? "true" : "false"); });
      back.hidden = current === 0;
      next.textContent = current === steps.length - 1 ? "בואי נתחיל" : "המשך";
    }

    function finish() {
      try { window.localStorage.setItem(SEEN_KEY, "1"); } catch (e) { /* private window */ }
      if (birth && birth.value && Mazag.read(birth.value)) {
        var existing = Mazag.loadProfile() || {};
        existing.birth = birth.value;
        Mazag.saveProfile(existing);
        dialog.close();
        window.location.href = "profile.html";
        return;
      }
      dialog.close();
    }

    next.addEventListener("click", function () {
      if (current < steps.length - 1) { current++; render(); return; }
      finish();
    });

    /* the extra-details link must not throw away a date already typed, and must
       not leave onboarding armed to reopen on the next screen */
    var more = document.getElementById("onboard-more");
    if (more) {
      more.addEventListener("click", function (event) {
        event.preventDefault();
        try { window.localStorage.setItem(SEEN_KEY, "1"); } catch (e) { /* private window */ }
        if (birth && birth.value && Mazag.read(birth.value)) {
          var existing = Mazag.loadProfile() || {};
          existing.birth = birth.value;
          Mazag.saveProfile(existing);
        }
        dialog.close();
        window.location.href = "profile.html#details";
      });
    }

    back.addEventListener("click", function () {
      if (current > 0) { current--; render(); }
    });

    skip.addEventListener("click", function () {
      try { window.localStorage.setItem(SEEN_KEY, "1"); } catch (e) { /* private window */ }
      dialog.close();
    });

    dots.forEach(function (d, i) {
      d.addEventListener("click", function () { current = i; render(); });
    });

    render();

    // open on the first visit of the welcome screen, or on demand from anywhere
    var seen;
    try { seen = window.localStorage.getItem(SEEN_KEY); } catch (e) { seen = "1"; }
    var isWelcome = document.querySelector(".brand-block");
    var asked = window.location.search.indexOf("onboarding=1") > -1;

    if (asked || (!seen && isWelcome)) dialog.showModal();

    var opener = document.getElementById("open-onboarding");
    if (opener) {
      opener.addEventListener("click", function (event) {
        event.preventDefault();
        current = 0; render();
        dialog.showModal();
      });
    }
  }

  /* ---------- the breakdown panel on the forecast ----------
     Expanded with grid-template-rows 0fr to 1fr rather than height,
     because height is not animatable without forcing a layout pass. */

  function setupBreakdown() {
    var toggle = document.getElementById("breakdown-toggle");
    var panel = document.getElementById("breakdown-panel");
    if (!toggle || !panel) return;

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      panel.dataset.open = open ? "false" : "true";
    });
  }

  /* ---------- the personal reading, shared by the profile and the chart ---------- */

  /* the astrology and the chinese rows now carry the drawing for that exact sign
     and that exact animal, instead of one generic icon standing in for twelve */
  function chartRows(reading) {
    return [
      { icon: "assets/icons/sign-" + reading.sign.key + ".webp", kicker: "אסטרולוגיה",
        title: "מזל " + reading.sign.he, meta: "יסוד " + reading.sign.element, text: reading.sign.text },
      { icon: "assets/icons/method-numerology.webp", kicker: "נומרולוגיה",
        title: "מספר " + reading.lifePath.number, meta: "מספר הדרך שלך", text: reading.lifePath.text },
      { icon: "assets/icons/method-tarot.webp", kicker: "טארוט",
        title: reading.card.name, meta: "קלף לידה " + reading.card.number, text: reading.card.text },
      { icon: "assets/icons/cy-" + reading.chinese.key + ".webp", kicker: "אסטרולוגיה סינית",
        title: "שנת ה" + reading.chinese.animal, meta: String(reading.chinese.year), text: reading.chinese.text }
    ];
  }

  function renderChart(list, reading) {
    list.innerHTML = "";
    chartRows(reading).forEach(function (r) {
      var li = document.createElement("li");
      li.className = "chart-card";
      var badge = r.icon
        ? '<img class="chart-card__icon" src="' + r.icon + '" alt="" width="44" height="44" />'
        : '<span class="chart-card__icon chart-card__icon--placeholder" aria-hidden="true"></span>';
      li.innerHTML =
        badge +
        '<div class="chart-card__body">' +
          '<span class="chart-card__kicker">' + r.kicker + "</span>" +
          '<h2 class="chart-card__title">' + r.title + "</h2>" +
          '<span class="chart-card__meta">' + r.meta + "</span>" +
          '<p class="chart-card__text">' + r.text + "</p>" +
        "</div>";
      list.appendChild(li);
    });
  }

  /* ---------- profile: two tabs, but only once there is something to show ---------- */

  function setupProfile() {
    var form = document.getElementById("profile-form");
    if (!form) return;

    var name  = document.getElementById("profile-name");
    var birth = document.getElementById("profile-birth");
    var time  = document.getElementById("profile-time");
    var place = document.getElementById("profile-place");
    var error = document.getElementById("birth-error");
    var clear = document.getElementById("profile-clear");

    var tabs        = document.getElementById("profile-tabs");
    var tabForecast = document.getElementById("tab-forecast");
    var tabDetails  = document.getElementById("tab-details");
    var panForecast = document.getElementById("panel-forecast");
    var panDetails  = document.getElementById("panel-details");
    var chartList   = document.getElementById("profile-chart-list");
    var lead        = document.getElementById("profile-lead");

    function showTab(which) {
      var wantForecast = which === "forecast";
      tabForecast.classList.toggle("is-active", wantForecast);
      tabDetails.classList.toggle("is-active", !wantForecast);
      tabForecast.setAttribute("aria-selected", String(wantForecast));
      tabDetails.setAttribute("aria-selected", String(!wantForecast));
      panForecast.hidden = !wantForecast;
      panDetails.hidden = wantForecast;
    }

    /* the tabs only earn their place once a birth date exists, because before
       that the forecast tab would open onto nothing */
    function refresh(preferred) {
      var saved = Mazag.loadProfile() || {};
      var reading = saved.birth ? Mazag.read(saved.birth) : null;
      if (!reading) {
        tabs.hidden = true;
        panForecast.hidden = true;
        panDetails.hidden = false;
        return;
      }
      renderChart(chartList, reading);
      if (lead) {
        lead.textContent = saved.name
          ? saved.name + ", זו הקריאה הכללית שלך לפי " + reading.pretty
          : "קריאה כללית לפי " + reading.pretty;
      }
      tabs.hidden = false;
      showTab(preferred || (location.hash === "#details" ? "details" : "forecast"));
    }

    var saved = Mazag.loadProfile() || {};
    if (saved.name)  name.value  = saved.name;
    if (saved.birth) birth.value = saved.birth;
    if (saved.time && time)   time.value  = saved.time;
    if (saved.place && place) place.value = saved.place;

    tabForecast.addEventListener("click", function () { showTab("forecast"); });
    tabDetails.addEventListener("click", function () { showTab("details"); });

    function showError(message) {
      error.textContent = message;
      error.hidden = false;
      birth.setAttribute("aria-invalid", "true");
    }

    function clearError() {
      error.hidden = true;
      birth.removeAttribute("aria-invalid");
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearError();

      if (!birth.value) return showError("צריך תאריך לידה כדי לחשב משהו אמיתי.");

      var reading = Mazag.read(birth.value);
      if (!reading) return showError("התאריך הזה לא נראה תקין. אפשר לנסות שוב?");

      var year = Number(birth.value.slice(0, 4));
      var now = new Date().getFullYear();
      if (year < 1900 || year > now) return showError("שנת הלידה צריכה להיות בין 1900 להיום.");

      var ok = Mazag.saveProfile({
        name:  name.value.trim(),
        birth: birth.value,
        time:  time ? time.value : "",
        place: place ? place.value.trim() : ""
      });
      if (!ok) return showError("לא הצלחנו לשמור במכשיר. אם הדפדפן במצב פרטי, זו הסיבה.");

      toast("נשמר");
      refresh("forecast");
      panForecast.scrollIntoView({ block: "start", behavior: "smooth" });
    });

    if (clear) {
      clear.addEventListener("click", function () {
        /* מדיניות הפרטיות מבטיחה מחיקה של כל מה שנשמר, ולכן הכפתור הזה
           מוחק את כל מרחב השמות של האפליקציה ולא רק את הפרופיל.
           איסוף המפתחות קודם, ומחיקה אחר כך: מחיקה תוך כדי מעבר על
           localStorage מזיזה את האינדקסים ומדלגת על מפתחות. */
        try {
          var keys = [];
          for (var i = 0; i < window.localStorage.length; i++) {
            var k = window.localStorage.key(i);
            if (k && k.indexOf("mazag.") === 0) keys.push(k);
          }
          keys.forEach(function (k) { window.localStorage.removeItem(k); });
        } catch (e) { /* חלון פרטי או אחסון חסום */ }

        name.value = "";
        birth.value = "";
        if (time) time.value = "";
        if (place) place.value = "";
        clearError();
        refresh("details");
        toast("הכל נמחק מהמכשיר");
      });
    }

    refresh();
  }

  /* ---------- my chart: the same reading, on its own screen ---------- */

  function setupChart() {
    var empty  = document.getElementById("chart-empty");
    var result = document.getElementById("chart-result");
    var list   = document.getElementById("chart-list");
    var lead   = document.getElementById("chart-lead");
    if (!empty || !result || !list) return;

    var profile = Mazag.loadProfile();
    var reading = profile && profile.birth ? Mazag.read(profile.birth) : null;
    if (!reading) return;   // the empty state is already the default in the markup

    empty.hidden = true;
    result.hidden = false;
    if (lead) {
      lead.textContent = profile.name
        ? profile.name + ", זו הקריאה הכללית שלך לפי " + reading.pretty
        : "קריאה כללית לפי " + reading.pretty;
    }
    renderChart(list, reading);
  }

  /* ---------- אינדקס לסטאגר ----------
     ה-CSS מחשב את ההשהיה מ- --i, וכאן הוא נכתב. הריצה היא אחרי
     setupArchive כי הארכיון בונה את הפריטים שלו בזמן ריצה, ופריט
     שנוצר אחרי הכתיבה היה נשאר בלי אינדקס ונכנס יחד עם הראשון. */
  function setupStagger() {
    var lists = document.querySelectorAll(".method-list, .method-cards, .archive:not(#archive-skeleton)");
    Array.prototype.forEach.call(lists, function (list) {
      Array.prototype.forEach.call(list.children, function (el, i) {
        el.style.setProperty("--i", i);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupNavDrawer();
    setupTheme();
    setupSound();
    setupOnboarding();
    setupCardRouting();
    setupForecastActions();
    setupBreakdown();
    setupProfile();
    setupChart();
    setupWeights();
    setupPlan();
    setupInstall();
    setupNotifications();
    runDueNotification();
    setupArchive();
    setupSplash();
    setupStagger();
  });
})();
