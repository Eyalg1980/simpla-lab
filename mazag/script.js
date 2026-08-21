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

  document.addEventListener("DOMContentLoaded", function () {
    setupNavDrawer();
    setupCardRouting();
    setupForecastActions();
    setupWeights();
    setupArchive();
    setupSplash();
  });
})();
