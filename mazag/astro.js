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
    loadProfile: loadProfile,
    saveProfile: saveProfile,
    isPro: isPro,
    setPro: setPro,
    reduceNumber: reduceNumber
  };
})();

if (typeof module !== "undefined" && module.exports) module.exports = Mazag;
