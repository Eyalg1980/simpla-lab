הסקשן הנגרר ממומש ב-SVG בתוך index.html ולא דורש קובץ וידאו.
אם וכאשר יהיה סרט: שמים אותו כאן בשם scrub.mp4, מקודדים אותו
עם keyframe בכל פריים (ffmpeg -g 1 -keyint_min 1 -sc_threshold 0),
ובתוך index.html משנים שורה אחת בסקריפט:
    var FILM = null;   ->   var FILM = "assets/video/scrub.mp4";
שאר הקוד לא משתנה. אם הקובץ ייכשל בטעינה, הדף נופל בחזרה לתמונה הסטטית.
