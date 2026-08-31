scrub.mp4        הסרט הנגרר. מקודד עם keyframe בכל פריים:
                 ffmpeg -i src.mp4 -an -vf "fps=24,scale=1024:-2" -c:v libx264
                 -pix_fmt yuv420p -g 1 -keyint_min 1 -sc_threshold 0 -crf 27
                 -preset slow -movflags +faststart scrub.mp4
                 בלי -g 1 כל seek מפענח קדימה מהמפתח הקודם והגרירה מגמגמת.
scrub-poster.jpg הפריים הראשון. זה מה שנראה בראש המסלול לפני שה-seek
                 הראשון צייר משהו, ולכן הוא הראשון ולא האחרון.
scrub-still.jpg  הפריים האחרון. הנפילה הסטטית בנייד, בתנועה מופחתת,
                 ובלי JS. הוא צריך לשאת את המסר לבדו.

הגרירה דורשת שרת שעונה על Range requests. GitHub Pages עונה.
כדי לכבות את הסרט ולחזור למנוע ה-SVG: var FILM = null;
