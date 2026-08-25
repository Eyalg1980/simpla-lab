/* ============================================================
   מזג — astro.js
   Everything here is derived from one birth date, with plain
   arithmetic and lookup tables. No network, no server, no guessing.
   Each function returns a value the user could verify by hand,
   which is the honesty the product promised in the onboarding.
   ============================================================ */

var Mazag = (function () {
  "use strict";

  /* ---------- sun sign ---------- */

  var SIGNS = [
    { key: "aries",       he: "טלה",      from: [3, 21],  to: [4, 19],  element: "אש"  },
    { key: "taurus",      he: "שור",      from: [4, 20],  to: [5, 20],  element: "אדמה" },
    { key: "gemini",      he: "תאומים",   from: [5, 21],  to: [6, 20],  element: "אוויר" },
    { key: "cancer",      he: "סרטן",     from: [6, 21],  to: [7, 22],  element: "מים" },
    { key: "leo",         he: "אריה",     from: [7, 23],  to: [8, 22],  element: "אש" },
    { key: "virgo",       he: "בתולה",    from: [8, 23],  to: [9, 22],  element: "אדמה" },
    { key: "libra",       he: "מאזניים",  from: [9, 23],  to: [10, 22], element: "אוויר" },
    { key: "scorpio",     he: "עקרב",     from: [10, 23], to: [11, 21], element: "מים" },
    { key: "sagittarius", he: "קשת",      from: [11, 22], to: [12, 21], element: "אש" },
    { key: "capricorn",   he: "גדי",      from: [12, 22], to: [1, 19],  element: "אדמה" },
    { key: "aquarius",    he: "דלי",      from: [1, 20],  to: [2, 18],  element: "אוויר" },
    { key: "pisces",      he: "דגים",     from: [2, 19],  to: [3, 20],  element: "מים" }
  ];

  var SIGN_TEXT = {
    aries: "את מתחילה דברים לפני שאת בטוחה בהם, וזה בדיוק מה שמזיז אותם. הקושי הוא לא ההתחלה, הוא הרגע שאחרי.",
    taurus: "את בונה לאט ומה שאת בונה נשאר. הנוחות שלך היא לא עצלות, היא הדרך שלך לשמור על יציבות.",
    gemini: "את מחזיקה כמה כיוונים בו זמנית וזה נראה מבחוץ כמו פיזור. בפועל זו הדרך שלך לחשוב.",
    cancer: "את קולטת מצבי רוח של אחרים לפני שהם אומרים מילה. זו מתנה, וגם משהו שצריך לדעת לכבות.",
    leo: "יש לך צורך אמיתי שיראו אותך, ואין בזה שום דבר רדוד. את פשוט מתפקדת טוב יותר כשאת לא בצל.",
    virgo: "את רואה את הפרט שלא במקום. זה הופך אותך לאמינה מאוד, ולפעמים גם קשה מדי עם עצמך.",
    libra: "את שוקלת כל צד לפני שאת מחליטה, ולכן ההחלטות שלך טובות ואיטיות. הקושי הוא לבחור בעצמך.",
    scorpio: "את לא מסתפקת בשכבה הראשונה של שום דבר. זה עושה אותך חדה, וגם עייפה לפעמים.",
    sagittarius: "את צריכה אופק. כשאין לאן להתרחב, גם דברים טובים מתחילים להרגיש צרים.",
    capricorn: "את לוקחת אחריות גם כשלא ביקשו ממך. השאלה הטובה בשבילך היא מה לא חייב להיות שלך.",
    aquarius: "את רואה את המערכת מבחוץ ולכן קל לך לשאול למה ככה. זה מבודד לפעמים, וזה גם הערך שלך.",
    pisces: "הגבול בינך לבין מה שסביבך דק. זה מקור האינטואיציה שלך וגם מה שמתיש אותך."
  };

  function sunSign(month, day) {
    for (var i = 0; i < SIGNS.length; i++) {
      var s = SIGNS[i];
      var f = s.from, t = s.to;
      if (f[0] === t[0]) {
        if (month === f[0] && day >= f[1] && day <= t[1]) return s;
      } else if (f[0] < t[0]) {
        if ((month === f[0] && day >= f[1]) || (month === t[0] && day <= t[1])) return s;
      } else {
        // capricorn wraps the year end
        if ((month === f[0] && day >= f[1]) || (month === t[0] && day <= t[1])) return s;
      }
    }
    return SIGNS[9];
  }

  /* ---------- numerology: life path ---------- */

  function digitSum(n) {
    var s = 0;
    String(n).split("").forEach(function (c) {
      if (c >= "0" && c <= "9") s += Number(c);
    });
    return s;
  }

  // 11, 22 and 33 are master numbers and are not reduced further
  function reduceNumber(n) {
    while (n > 9 && n !== 11 && n !== 22 && n !== 33) n = digitSum(n);
    return n;
  }

  var LIFE_PATH_TEXT = {
    1: "מספר דרך 1. את מתקדמת הכי טוב כשאת מובילה ולא כשמובילים אותך. עצמאות היא לא גחמה אצלך, היא תנאי.",
    2: "מספר דרך 2. את עובדת הכי טוב בזוגיות ובשיתוף. הכוח שלך הוא לחבר בין אנשים שלא היו נפגשים בלעדייך.",
    3: "מספר דרך 3. ביטוי הוא הדרך שלך לעבד. כשאת לא כותבת, מדברת או יוצרת, הדברים נתקעים בפנים.",
    4: "מספר דרך 4. את בונה תשתיות. זה לא זוהר וזה מה שמחזיק כשכל השאר מתפרק.",
    5: "מספר דרך 5. שינוי הוא החמצן שלך. שגרה קבועה מדי לא מרגיעה אותך, היא מכבה אותך.",
    6: "מספר דרך 6. את לוקחת אחריות על אנשים. השאלה הטובה בשבילך היא מי לוקח אחריות עלייך.",
    7: "מספר דרך 7. את צריכה זמן לבד כדי להבין מה את חושבת. זו לא הסתגרות, זו שיטת עבודה.",
    8: "מספר דרך 8. יש לך יחס ישיר לכוח ולשפע. הכי חשוב אצלך זה מה את עושה איתם.",
    9: "מספר דרך 9. את רואה את התמונה הרחבה ומתקשה עם קטנוניות. הסיום הוא נושא חוזר אצלך.",
    11: "מספר מאסטר 11. רגישות גבוהה מאוד ואינטואיציה חזקה. הקושי הוא לתרגם את מה שאת קולטת למילים.",
    22: "מספר מאסטר 22. יכולת לקחת חזון גדול ולהפוך אותו למשהו ממשי. זה גם עומס.",
    33: "מספר מאסטר 33. תחושת שליחות חזקה סביב טיפול והוראה."
  };

  function lifePath(y, m, d) {
    var n = reduceNumber(digitSum(y) + digitSum(m) + digitSum(d));
    return { number: n, text: LIFE_PATH_TEXT[n] || "" };
  }

  /* ---------- Chinese zodiac ---------- */

  var ANIMALS = [
    ["עכבר", "פיקחות ותושייה, קוראת מצבים מהר", "rat"],
    ["שור", "סבלנות ועקשנות, מסיימת מה שהתחילה", "ox"],
    ["נמר", "אומץ ותנופה, לא אוהבת גבולות", "tiger"],
    ["ארנב", "עדינות וזהירות, נמנעת מעימות", "rabbit"],
    ["דרקון", "נוכחות גדולה, מושכת תשומת לב", "dragon"],
    ["נחש", "חוכמה שקטה, שומרת קלפים קרוב", "snake"],
    ["סוס", "חופש ותנועה, קשה לה לשבת במקום", "horse"],
    ["עז", "רכות ויצירתיות, צריכה סביבה בטוחה", "goat"],
    ["קוף", "שנינות והמצאה, פותרת בדרכים לא צפויות", "monkey"],
    ["תרנגול", "דיוק וכנות, אומרת את זה כמו שזה", "rooster"],
    ["כלב", "נאמנות וצדק, לוקחת דברים ללב", "dog"],
    ["חזיר", "נדיבות ותום, נותנת בלי לספור", "pig"]
  ];

  function chineseZodiac(year) {
    var idx = ((year - 2020) % 12 + 12) % 12;
    return { animal: ANIMALS[idx][0], text: ANIMALS[idx][1], key: ANIMALS[idx][2], year: year };
  }

  /* ---------- tarot birth card ---------- */

  var MAJORS = [
    "השוטה", "הקוסם", "הכוהנת", "הקיסרית", "הקיסר", "הכהן הגדול",
    "הנאהבים", "המרכבה", "הכוח", "הנזיר", "גלגל המזל", "הצדק",
    "התלוי", "המוות", "המזג", "השטן", "המגדל", "הכוכב",
    "הירח", "השמש", "הדין", "העולם"
  ];

  var MAJOR_TEXT = {
    0: "התחלה בלי מפה. את סומכת על הצעד הבא יותר מאשר על התוכנית.",
    1: "יש לך את הכלים, השאלה היא מתי את מתחילה להשתמש בהם.",
    2: "את יודעת דברים לפני שאת יכולה להסביר אותם.",
    3: "יצירה ושפע. את מצמיחה מה שאת נוגעת בו.",
    4: "מבנה וגבולות. סדר הוא לא הגבלה אצלך, הוא בסיס.",
    5: "מסורת ולמידה. את מחפשת משמעות במה שכבר נבדק.",
    6: "בחירה בין שני דברים יקרים. זה נושא חוזר אצלך.",
    7: "כיוון ותנופה. את מגיעה למקומות כשאת מחליטה לאן.",
    8: "כוח רך. את משפיעה בלי להרים את הקול.",
    9: "חיפוש פנימי. את צריכה שקט כדי לראות ברור.",
    10: "מחזורים. דברים חוזרים אלייך עד שאת עושה איתם משהו אחר.",
    11: "איזון ואחריות. את שוקלת לפני שאת פוסקת.",
    12: "נקודת מבט הפוכה. לפעמים ההמתנה היא הפעולה.",
    13: "סיומים שמפנים מקום. לא אובדן, החלפה.",
    14: "מיזוג. לקחת שני דברים שלא הולכים יחד ולמצוא את המינון. זה גם השם של האפליקציה הזו.",
    15: "מה שכובל אותך. בדרך כלל את מחזיקה את השרשרת בעצמך.",
    16: "שבירה פתאומית של מבנה שכבר לא החזיק.",
    17: "תקווה שקטה אחרי תקופה קשה. אמון שחוזר לאט.",
    18: "לא הכל ברור, וזה בסדר. יש דברים שמתבהרים רק בדיעבד.",
    19: "בהירות ושמחה גלויה. מה שאת עושה נראה.",
    20: "חשבון נפש והתעוררות. קריאה לשנות כיוון.",
    21: "השלמה של מעגל. משהו נסגר בשלמות."
  };

  function birthCard(y, m, d) {
    var n = m + d + y;
    while (n > 22) n = digitSum(n);
    if (n === 22) n = 0;             // 22 folds back to The Fool
    return { number: n, name: MAJORS[n], text: MAJOR_TEXT[n] };
  }

  /* ---------- the whole reading ---------- */

  function read(isoDate) {
    var parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
    if (!parts) return null;
    var y = Number(parts[1]), m = Number(parts[2]), d = Number(parts[3]);
    if (m < 1 || m > 12 || d < 1 || d > 31) return null;

    var sign = sunSign(m, d);
    return {
      date: isoDate,
      pretty: d + "." + (m < 10 ? "0" + m : m) + "." + y,
      sign: { he: sign.he, key: sign.key, element: sign.element, text: SIGN_TEXT[sign.key] },
      lifePath: lifePath(y, m, d),
      chinese: chineseZodiac(y),
      card: birthCard(y, m, d)
    };
  }


  /* ---------- the day card: where the day sits on the arc, and in what tone ----------

     ארבע מתוך שש השיטות הן אותה קשת בשפות שונות, ולכן התמונה מאונדקסת על שני
     צירים בלבד: מיקום בקשת (מופע הירח, שמונה) וטון (יסוד מזל הירח, ארבעה).
     שלושים ושתיים כרטיסיות מכסות כל יום, והצירוף המלא של שש השיטות נישא בטקסט.
     הכל נגזר מהתאריך לבדו, ולכן מסך הצפייה מקישור עובד בלי תאריך לידה. */

  var PHASES = [
    ["new",              "מולד",           "יום להתחיל בו משהו"],
    ["waxing-crescent",  "סהר מתמלא",      "משהו קטן כבר זז"],
    ["first-quarter",    "רבע ראשון",      "יש כאן החלטה שדוחה את עצמה"],
    ["waxing-gibbous",   "גיבוז מתמלא",    "כמעט, וזה בדיוק החלק שדורש סבלנות"],
    ["full",             "מלא",            "משהו מגיע לשיא"],
    ["waning-gibbous",   "גיבוז מתרוקן",   "מה שנאסף מבקש שיחלקו אותו"],
    ["last-quarter",     "רבע אחרון",      "יום לשחרר בו משהו"],
    ["balsamic",         "סהר מתרוקן",     "לא צריך למלא את היום הזה"]
  ];

  var TONES = [
    ["fire",  "אש",    "ומשהו בך כבר רץ קדימה"],
    ["earth", "אדמה",  "ובקצב שאפשר לעמוד בו"],
    ["air",   "אוויר", "וזה יסתדר קודם במילים"],
    ["water", "מים",   "וזה יורגש לפני שיובן"]
  ];


  /* מספר היום האוניברסלי, שמתחלף כל יום ולכן שובר כל חזרה */
  var DAY_ACCENT = {
    1:  "המספר של היום הוא אחת, וזה תמיד מתחיל בצעד שאת עושה ראשונה.",
    2:  "המספר של היום הוא שתיים, ורוב מה שיקרה יקרה מול מישהו אחר.",
    3:  "המספר של היום הוא שלוש, ומה שלא ייאמר היום יישאר תקוע.",
    4:  "המספר של היום הוא ארבע, ודברים משתלמים כשעושים אותם בסדר.",
    5:  "המספר של היום הוא חמש, ומשהו בתוכנית כנראה יזוז.",
    6:  "המספר של היום הוא שש, ומישהו קרוב צריך יותר תשומת לב מהרגיל.",
    7:  "המספר של היום הוא שבע, ושווה לשמור חלק מהיום רק לעצמך.",
    8:  "המספר של היום הוא שמונה, ויש כאן הזדמנות להחליט במקום להתלבט.",
    9:  "המספר של היום הוא תשע, וזה יום טוב לסגור מעגל שנשאר פתוח.",
    11: "המספר של היום הוא אחת עשרה, מספר מאסטר, והתחושות היום חדות מהרגיל.",
    22: "המספר של היום הוא עשרים ושתיים, מספר מאסטר, ומה שנבנה היום מחזיק לאורך זמן.",
    33: "המספר של היום הוא שלושים ושלוש, מספר מאסטר, ומה שנותנים היום חוזר מוגדל."
  };

  var RAD = Math.PI / 180;

  function julianDay(date) {
    return date.getTime() / 86400000 + 2440587.5;
  }

  /* Meeus, truncated. About a fifth of a degree, which is far inside the 30
     degrees a sign spans and the 45 degrees a phase spans. */
  function moonLongitude(T) {
    var Lp = 218.3164477 + 481267.88123421 * T;
    var D  = 297.8501921 + 445267.1114034  * T;
    var M  = 357.5291092 + 35999.0502909   * T;
    var Mp = 134.9633964 + 477198.8675055  * T;
    var lon = Lp
      + 6.289 * Math.sin(Mp * RAD)
      - 1.274 * Math.sin((2 * D - Mp) * RAD)
      + 0.658 * Math.sin(2 * D * RAD)
      - 0.186 * Math.sin(M * RAD)
      - 0.059 * Math.sin((2 * Mp - 2 * D) * RAD)
      - 0.057 * Math.sin((Mp - 2 * D + M) * RAD)
      + 0.053 * Math.sin((Mp + 2 * D) * RAD)
      + 0.046 * Math.sin((2 * D - M) * RAD)
      - 0.041 * Math.sin((Mp - M) * RAD)
      - 0.035 * Math.sin(D * RAD)
      - 0.031 * Math.sin((Mp + M) * RAD);
    return ((lon % 360) + 360) % 360;
  }

  function sunLongitude(d) {
    var g = (357.528 + 0.9856003 * d) * RAD;
    var lon = 280.460 + 0.9856474 * d + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g);
    return ((lon % 360) + 360) % 360;
  }

  /* מפתח המזל, כדי שהתחזית תהיה של מישהי ולא של היום.
     עד עכשיו שני הצירים היו גלובליים: פאזת הירח והיסוד שהירח עומד בו.
     נמדד: שנים עשר מזלות קיבלו טקסט אחד ויחיד באותו יום, כלומר המזל
     של המשתמשת לא נכנס לתחזית בכלל. */
  var SIGN_ORDER = ["aries","taurus","gemini","cancer","leo","virgo",
                    "libra","scorpio","sagittarius","capricorn","aquarius","pisces"];

  function signSlot(chart) {
    if (!chart || !chart.sign) return null;
    var i = SIGN_ORDER.indexOf(chart.sign.key);
    return i < 0 ? null : i;
  }

  function dayCard(date, chart) {
    var when = date || new Date();
    var jd = julianDay(when);
    var d = jd - 2451545.0;
    var T = d / 36525;

    var moon = moonLongitude(T);
    var sun = sunLongitude(d);

    /* the phase is the angle the moon has opened up on the sun, binned into
       eight. the bins are centred, so a full moon reads as full and not as the
       edge of two buckets. */
    var angle = ((moon - sun) % 360 + 360) % 360;
    var phaseIdx = Math.floor(((angle + 22.5) % 360) / 45);

    /* the tone is the element of the sign the moon is standing in. aries is
       fire and the elements repeat every four signs, so the sign index is the
       tone index. */
    var signIdx = Math.floor(moon / 30);
    var toneIdx = signIdx % 4;

    var p = PHASES[phaseIdx], t = TONES[toneIdx];
    var key = p[0] + "-" + t[0];

    /* the two axes that pick the picture both move slowly: the moon holds a
       phase bin for about four days and a sign for about two and a half, so on
       roughly two days in five the picture is yesterday's. that is honest, the
       arc really has not moved. what must not repeat is the reading, so the day
       number, which does change every single day, carries the third clause. */
    var dayNum = reduceNumber(digitSum(
      when.getFullYear() * 10000 + (when.getMonth() + 1) * 100 + when.getDate()));
    var accent = DAY_ACCENT[dayNum] || DAY_ACCENT[9];

    /* הטקסט הסיפורי מיוצר מראש ונטען כטבלה. עד שהיא קיימת, נופלים
       חזרה על הרכבת שברי המשפט. ההרכבה הזו היא זמנית: שני חלקים
       עצמאיים שמחוברים בפסיק אינם משפט תקין בעברית */
    var sunSlot = signSlot(chart);
    var tk = sunSlot === null ? null : key + "-" + SIGN_ORDER[sunSlot] + "-" + dayNum;
    var STORY = (typeof window !== "undefined" && window.MazagStories) ||
                (typeof MazagStories !== "undefined" ? MazagStories : null);
    var composed = (tk && STORY && STORY[tk]) || (p[2] + ", " + t[2] + ". " + accent);

    return {
      dayNumber: dayNum,
      accent: accent,
      key: key,
      phase: p[0], phaseHe: p[1],
      element: t[0], elementHe: t[1],
      signIndex: signIdx,
      angle: angle,
      /* המפתחות של המרחב המלא. הטקסט יורד עמוק עד מספר היום,
         התמונה נעצרת במזל. שניהם מיוצרים מראש ונשלחים עם האפליקציה,
         ולכן אין כאן קריאת רשת ואין עלות למשתמשת */
      sunSlot: sunSlot,
      textKey: sunSlot === null ? null : key + "-" + SIGN_ORDER[sunSlot] + "-" + dayNum,
      imageKey: sunSlot === null ? key : key + "-" + SIGN_ORDER[sunSlot],
      text: composed,
      headline: p[2] + ", " + t[2],
      image: "assets/images/card-" + key + ".webp",
      thumb: "assets/images/thumb-" + key + ".webp",
      alt: "כרטיסיית " + p[1] + " ביסוד " + t[1]
    };
  }

  /* ---------- stored profile ---------- */

  var KEY = "mazag.profile";

  function loadProfile() {
    try {
      var raw = window.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;   // private window, blocked storage, or corrupt value
    }
  }

  function saveProfile(profile) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(profile));
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ---------- subscription flag ----------
     אין כאן חיוב אמיתי. זהו דגל מקומי שמדמה מנוי פעיל, כדי שאפשר יהיה
     לבדוק את שני מצבי המסך בלי שרת ובלי ספק תשלומים. */

  var PRO_KEY = "mazag.pro";

  function isPro() {
    try { return window.localStorage.getItem(PRO_KEY) === "1"; }
    catch (e) { return false; }
  }

  function setPro(on) {
    try {
      if (on) window.localStorage.setItem(PRO_KEY, "1");
      else window.localStorage.removeItem(PRO_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }

  return {
    read: read,
    dayCard: dayCard,
    loadProfile: loadProfile,
    saveProfile: saveProfile,
    isPro: isPro,
    setPro: setPro,
    reduceNumber: reduceNumber
  };
})();

if (typeof module !== "undefined" && module.exports) module.exports = Mazag;
