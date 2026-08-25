/* מזג, service worker.

   שתי אסטרטגיות ולא אחת:
   מסמכים נטענים מהרשת קודם, כי תחזית ישנה גרועה מהמתנה קצרה.
   נכסים (תמונות, גופנים, קוד) נטענים מהמטמון קודם, כי הם לא משתנים
   בין ימים והם רוב המשקל.

   הגרסה בשם המטמון היא מה שמפעיל ניקוי. כל שינוי ברשימה מחייב להעלות אותה,
   אחרת דפדפן שכבר ביקר יישאר עם הישן. */

var VERSION = "mazag-v7";
var DOC_CACHE = VERSION + "-doc";
var ASSET_CACHE = VERSION + "-asset";

/* מה שנשמר בהתקנה: המסלול המינימלי שמאפשר לפתוח את האפליקציה אופליין */
var PRECACHE = [
  "./",
  "./index.html",
  "./daily-forecast.html",
  "./archive.html",
  "./offline.html",
  "./style.css",
  "./script.js",
  "./astro.js",
  "./manifest.webmanifest",
  "./assets/images/logo-new.webp",
  "./assets/icons/app-icon-192.png",
  "./assets/images/card-back.webp",
  "./assets/fonts/fonts.css",
  "./assets/fonts/assistant-hebrew-400-normal.woff2",
  "./assets/fonts/assistant-hebrew-600-normal.woff2",
  "./assets/fonts/frank-ruhl-libre-hebrew-500-normal.woff2",
  "./assets/fonts/frank-ruhl-libre-hebrew-600-normal.woff2"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(ASSET_CACHE).then(function (cache) {
      /* addAll נכשל כולו אם קובץ אחד נכשל, ולכן כל קובץ נשמר בנפרד */
      return Promise.all(PRECACHE.map(function (url) {
        return cache.add(url).catch(function () { /* קובץ חסר לא יפיל התקנה */ });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k.indexOf(VERSION) !== 0) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

function isAsset(url) {
  return /\.(webp|png|jpg|jpeg|svg|css|js|woff2?)$/.test(url.pathname);
}

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);
  /* מקור חיצוני נשאר באחריות הדפדפן. מאז שהגופנים מוגשים מכאן,
     אין בכלל מקור חיצוני */
  if (url.origin !== self.location.origin) return;

  /* וידאו יוצא מהחישוב לגמרי. הדפדפן מבקש אותו בטווחים, ותשובת 206
     ששמורה במטמון ומוגשת שוב כאילו היא תשובה מלאה שוברת את הנגן */
  if (/\.(mp4|webm|m4v)$/.test(url.pathname) || req.headers.has("range")) return;

  if (isAsset(url)) {
    event.respondWith(
      caches.match(req).then(function (hit) {
        if (hit) return hit;
        return fetch(req).then(function (res) {
          var copy = res.clone();
          caches.open(ASSET_CACHE).then(function (c) { c.put(req, copy); });
          return res;
        });
      })
    );
    return;
  }

  /* מסמך: רשת קודם, מטמון כגיבוי, ומסך אופליין כמוצא אחרון */
  event.respondWith(
    fetch(req).then(function (res) {
      var copy = res.clone();
      caches.open(DOC_CACHE).then(function (c) { c.put(req, copy); });
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) {
        return hit || caches.match("./offline.html");
      });
    })
  );
});

/* תזכורת יומית בלי שרת.
   הדפדפן לא מתזמן התראות עתידיות בעצמו, ולכן העמוד מבקש מכאן להציג
   התראה כשהוא פתוח והשעה הגיעה. זו תזכורת מקומית ולא push אמיתי,
   וההבדל מוסבר למשתמשת במסך ההגדרות. */
self.addEventListener("message", function (event) {
  var data = event.data || {};
  if (data.type !== "mazag-notify") return;
  self.registration.showNotification("מזג", {
    body: data.body || "התחזית של היום מחכה לך",
    icon: "./assets/icons/app-icon-192.png",
    badge: "./assets/icons/app-icon-192.png",
    tag: "mazag-daily",
    dir: "rtl",
    lang: "he",
    data: { url: "./daily-forecast.html" }
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  var target = (event.notification.data && event.notification.data.url) || "./daily-forecast.html";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if ("focus" in list[i]) return list[i].focus();
      }
      return self.clients.openWindow(target);
    })
  );
});
