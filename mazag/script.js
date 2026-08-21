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

  /* ---------- which card is on show ----------
     The archive links to daily-forecast.html?card=the-moon and similar, so
     one forecast page serves every day in the archive instead of nine
     near-identical files. Without the parameter it falls back to the star. */

  var CARDS = {
    "the-star": {
      alt: "קלף הכוכב: אישה כורעת ומוזגת מים אל בריכה תחת כוכב זהב גדול",
      text: "היום מזמין אותך לעצור לרגע ולהקשיב למה שמתרחש בפנים. שיחה קצרה או סימן מקרי יכולים לכוון אותך נכון. סמכי על התחושות שלך, הן יודעות."
    },
    "the-moon": {
      alt: "קלף הירח: סהר מעל שני מגדלים ושביל שמתפתל אל האופק",
      text: "לא הכל צריך להיות ברור היום. יש דברים שמתבהרים רק אחרי שנותנים להם ללכת בשקט. אם משהו מרגיש עמום, זה בסדר לחכות איתו יום נוסף."
    },
    "the-sun": {
      alt: "קלף השמש: שמש זהובה עם פנים מעל גן חמניות וילד על סוס לבן",
      text: "יום נדיב במיוחד. מה שתתחילי בו הבוקר ייקח אותך רחוק יותר משנדמה לך. אל תקטיני את השמחה הקטנה שתגיע, היא הסימן."
    },
    "the-priestess": {
      alt: "קלף הכוהנת: אישה עוטת גלימה יושבת בין שני עמודים עם סהר לרגליה",
      text: "את יודעת את התשובה כבר עכשיו, גם אם עוד לא ניסחת אותה במילים. היום כדאי להקשיב פנימה לפני שמבקשים עצה מבחוץ."
    },
    "the-wheel": {
      alt: "קלף הגלגל: גלגל זהב עם סמלי מזלות מרחף בין עננים",
      text: "משהו זז היום בלי שביקשת. במקום להיאבק בכיוון, שווה לבדוק לאן הוא מוביל. לפעמים שינוי קטן בתזמון פותח דלת שלמה."
    },
    "the-hermit": {
      alt: "קלף הנזיר: דמות עטופה גלימה על רכס מושלג אוחזת פנס זהב",
      text: "היום מבקש קצת מרחב לבד. לא בריחה, אלא רגע של שקט שבו את שומעת את עצמך. אור אחד קטן מספיק כדי לראות את הצעד הבא."
    }
  };

  function setupCardRouting() {
    var hero = document.getElementById("hero-card");
    var text = document.getElementById("forecast-text");
    if (!hero || !text) return;

    var match = /[?&]card=([a-z-]+)/.exec(window.location.search);
    var key = match && CARDS[match[1]] ? match[1] : null;
    if (!key) return;

    hero.src = "assets/images/card-" + key + ".webp";
    hero.alt = CARDS[key].alt;
    text.textContent = CARDS[key].text;
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
    if (!grid || !empty) return;

    if (window.location.search.indexOf("state=empty") > -1) {
      grid.hidden = true;
      empty.hidden = false;
    }
  }

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
        Mazag.saveProfile({});
        name.value = "";
        birth.value = "";
        if (time) time.value = "";
        if (place) place.value = "";
        clearError();
        refresh("details");
        toast("הפרטים נמחקו מהמכשיר");
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

  document.addEventListener("DOMContentLoaded", function () {
    setupNavDrawer();
    setupOnboarding();
    setupCardRouting();
    setupForecastActions();
    setupBreakdown();
    setupProfile();
    setupChart();
    setupWeights();
    setupPlan();
    setupArchive();
    setupSplash();
  });
})();
