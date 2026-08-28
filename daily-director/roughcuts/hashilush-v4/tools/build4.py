# -*- coding: utf-8 -*-
import os, urllib.request
from PIL import Image, ImageDraw, ImageFont

B = "https://d8j0ntlcm91z4.cloudfront.net/user_348jNuehm4zmcU1si73jLXDcXDZ/hf_"
A = {
 "cave01":"20260828_184139_0d7bf89f-aaa5-4845-8c5a-fa33bf231954",
 "cave02":"20260828_184139_b50fd6bf-8c52-4898-887b-ffd771981355",
 "cave03":"20260828_184139_5b2f9616-c5d5-4167-8e9c-1cfddef15960",
 "cave04":"20260828_184139_00ba8f25-ec93-42b9-a27a-3469073679fc",
 "cave05":"20260828_184140_12dc5a89-ea13-4d47-a944-197d67dbe636",
 "cave06":"20260828_184139_602fe8bc-3c9f-48b9-9d0a-e902c26d6fb4",
 "cave07":"20260828_183616_50afe60a-f965-4387-acaf-5e495683c968",
 "cave08":"20260828_184139_52ae0376-0fbf-43fb-9846-9429a90d5268",
 "cave11":"20260828_184140_79797444-a653-4a0b-8c42-e0458e669f9c",
 "cave17":"20260828_184209_aa8bafc4-6185-4927-8160-5e1499a5a115",
 "cave19":"20260828_184209_02e51880-2f04-4d51-b99c-9bcf06bb41f4",
 "ther":"20260828_195231_7a8423af-af08-4782-aa83-9b92bb819dcd",
 "coffee":"20260828_202509_c5049745-7c5d-45e6-9f8a-7c89d3414c0d",
 "smile":"20260828_202509_2d9c8e6c-07cb-41d6-909f-710e537595ac",
 "keys":"20260828_202509_d2bfffbe-8e16-4d20-bd2e-3055c58b418b",
 "grip":"20260828_202509_07de0659-0724-43ec-b76d-eb933672cdef",
 "bed":"20260828_202509_5b6ce482-640d-4367-ba88-945cb62b2d16",
 "back":"20260828_202509_7cd08410-83fe-4f0d-a963-26523208005b",
 "empty":"20260828_202509_8683f183-95a5-42db-b5f6-c429d458fcba",
 "shake":"20260828_202510_5e8672e6-0e32-4abe-8680-9e55e713a564",
 "hood":"20260828_202509_3566c7e2-4dd1-4077-ad65-6b98e5bb4c3b",
 "block":"20260828_202544_0095804c-0a7c-41bb-aad7-e3b5f57f5c0a",
 "eyes":"20260828_202544_e790d35a-49a2-4161-90ad-490724d97084",
 "knuck":"20260828_202544_eb017d03-2695-4076-831d-66c6483d3035",
 "fear":"20260828_202544_2af518da-ea36-4f86-8a95-a7192a02cdea",
 "alone":"20260828_202544_b067883e-40f4-43c9-adba-fe63b258f399",
 "arm":"20260828_202544_44586579-23bc-4140-bb8a-e02f0ff026f8",
 "turn3":"20260828_202544_4682ba1c-d957-430a-b239-48b8405ca277",
 "reveal":"20260828_202544_af172541-201a-4224-b24a-267aa86931f1",
 # new in v4
 "meetR":"20260828_222831_388e9fc2-33f8-4d8c-bf7e-11ccb6c4098e",
 "walkR":"20260828_222831_3af66577-b71c-4e02-ba3c-c37452599c76",
 "smileR":"20260828_222831_1db94248-2ff3-462a-b744-d6862993380a",
 "hug":"20260828_222831_140a866e-b161-473e-8a14-323ad590f121",
 "shatter":"20260828_222831_4e5fb03b-9e2b-483a-9f69-0af4ee602b82",
 "mag1":"20260828_222831_229f8d60-c01f-49bd-b3ed-b2cf817643ba",
 "mag2":"20260828_222831_a3d5137a-0aa3-4218-a55b-4758bbaf9c03",
 "mag3":"20260828_222831_f4eea5ca-6b12-468c-9163-9dcd63bd5307",
 "phone":"20260828_222831_70a98ad6-cf94-45ff-8b4e-5c7024041d85",
 "shelf":"20260828_222831_accbdcd8-1ca9-40ab-b56c-33305a0b80b9",
 "slam":"20260828_222831_2f2cb8a9-2b96-4efe-8cb9-35cd4acebeb6",
 "meetI":"20260828_223126_86d6f0dc-4973-41d7-b549-c8f1da382b1e",
 "walkI":"20260828_223126_b031e992-cbe2-4094-80f6-2fc137b77a2b",
 "backaway":"20260828_223126_be5e1fbd-9960-4775-9db4-b2b973df45c9",
 "stepin":"20260828_223126_6034e549-5a1c-4906-b2a2-4bdabd45c83c",
 "heturn":"20260828_223126_8d07e4fe-18a7-4c57-acc8-6cea07fe89f3",
 "sheturn":"20260828_223126_bbcfe474-a01a-4f5d-a5e3-e439cb37ffd3",
 "lift":"20260828_223126_6c0cc6eb-82f8-465f-977c-09b055764147",
 "screen":"20260828_223126_ebe4cd2f-71e0-4264-ba0e-37f1605e539f",
 "doorin":"20260828_223126_a7e18f4f-9f18-43ed-9a2e-c7c9d8210c22",
}
VID = {
 "EZ": B + "20260828_223225_f9d05bc9-78c1-42fe-9a8b-81de58b7b676.mp4",
 "BT": B + "20260828_223233_ad2313f7-61fc-4fa1-8306-0e769496b30b.mp4",
}

# n, dur, kind, asset, name_he, motion_he, vo
S = [
(1,4,"cave","cave01",u"כניסת הלפיד",u"האלומה זוחלת על הקיר",None),
(2,3,"cave","cave02",u"טבילה באוקר",u"האצבע נכנסת לפיגמנט",None),
(3,4,"cave","cave03",u"הקו הראשון",u"היד נמשכת לאורך הקיר",None),
(4,6,"cave","cave07",u"הקיר, שלוש דמויות",u"רק הלהבה זזה",None),
(5,4,"title",None,u"כרטיס כותרת",u"קאט קשה משחור",None),
(6,4,"int","ther",u"המטפל מתיישב",u"מיישר את המיקרופון",1),
(7,6,"int","ther",u"המטפל מדבר",u"ליפסינק",None),
(8,2.5,"q1",None,u"כרטיס פרק ראשון",u"קאט קשה",None),
(9,10.1,"vidEZ","EZ",u"EARTH ZOOM",u"צלילה מהמסלול עד לרחוב, בלי חיתוך",None),
(10,3,"now","coffee",u"קפה למישהו אחר",u"הספל שלו ריק",None),
(11,3,"now","phone",u"טלפון בלילה",u"עונה לפני הצלצול השני",None),
(12,4,"now","shelf",u"מתקן מדף",u"אף אחד לא ביקש",None),
(13,4,"now","smile",u"החיוך והעיניים",u"העיניים לא מצטרפות",None),
(14,4,"now","keys",u"שלוש לפנות בוקר",u"המפתחות מסתובבים",None),
(15,4,"now","grip",u"יד על כתף",u"אוחזת רגע יותר מדי",None),
(16,3,"cave","cave06",u"השלישית נכנסת",u"קאט למערה",None),
(17,1.2,"burst","smile",u"ברסט א, חיתוך 1",u"1.2 שניות",None),
(18,1.2,"burst","grip",u"ברסט א, חיתוך 2",u"1.2 שניות",None),
(19,1.2,"burst","cave06",u"ברסט א, חיתוך 3",u"1.2 שניות",None),
(20,4,"int","ther",u"קאטאווי, הספל",u"נחיתה על שוט דומם",2),
(21,16,"int","ther",u"המטפל, המושיע",u"הבלוק הארוך",None),
(22,2.5,"q2",None,u"כרטיס פרק שני",u"קאט קשה",None),
(23,4,"now","bed",u"על קצה המיטה",u"הוא לא זז",None),
(24,3,"now","lift",u"מרים ומניח",u"התיק עולה ויורד",None),
(25,3,"now","screen",u"מסך ריק",u"אין התראות",None),
(26,4,"now","back",u"כתפיים מאחור",u"נשימה בלבד",None),
(27,4,"now","empty",u"פנים ריקות",u"מבט ישר, בלי הבעה",None),
(28,3,"now","shake",u"ידיים רועדות",u"רעד עדין",None),
(29,3,"cave","cave04",u"השוכבת",u"קאט למערה",None),
(30,3,"mag","mag1",u"מגזין, הפנים",u"הזיכרון נקרע לחתיכות",None),
(31,3,"mag","mag2",u"מגזין, הידיים",u"אותה יד חוזרת שלוש פעמים",None),
(32,3,"mag","mag3",u"מגזין, ארבע פעמים",u"הדמות נדפסת שוב ושוב",None),
(33,3,"now","doorin",u"הדלת מבפנים",u"אין תנועה",None),
(34,3,"now","hood",u"הקפוצון עולה",u"הפנים נכנסות לצל",None),
(35,1.2,"burst","empty",u"ברסט ב, חיתוך 1",u"1.2 שניות",None),
(36,1.2,"burst","shake",u"ברסט ב, חיתוך 2",u"1.2 שניות",None),
(37,1.2,"burst","mag1",u"ברסט ב, חיתוך 3",u"1.2 שניות",None),
(38,1.2,"burst","bed",u"ברסט ב, חיתוך 4",u"1.2 שניות",None),
(39,3,"int","ther",u"קאטאווי, המשקפיים",u"נחיתה על שוט דומם",3),
(40,10,"int","ther",u"המטפל, הקורבן",u"הבלוק",None),
(41,2.5,"q3",None,u"כרטיס פרק שלישי",u"קאט קשה",None),
(42,3,"now","slam",u"דלת נטרקת",u"רעידה במשקוף",None),
(43,3,"now","block",u"חוסם את הפתח",u"דומם לגמרי",None),
(44,4,"now","eyes",u"העיניים",u"בלי מצמוץ",None),
(45,3,"now","backaway",u"גב מתרחק",u"מחוץ לפוקוס",None),
(46,4,"now","knuck",u"פרקי אצבעות",u"הלחיצה מתהדקת",None),
(47,3,"cave","cave05",u"העומדת",u"קאט למערה",None),
(48,5,"now","fear",u"הסימן שהוא מפחד",u"הלחות בעין",None),
(49,10.06,"vidBT","BT",u"BULLET TIME",u"הכוס מתנפצת, הזמן נעצר, מצלמה מקיפה",None),
(50,4,"now","alone",u"מתיישב לבד",u"הכעס נגמר",None),
(51,1.2,"burst","eyes",u"ברסט ג, חיתוך 1",u"1.2 שניות",None),
(52,1.2,"burst","knuck",u"ברסט ג, חיתוך 2",u"1.2 שניות",None),
(53,1.2,"burst","shatter",u"ברסט ג, חיתוך 3",u"1.2 שניות",None),
(54,1.2,"burst","block",u"ברסט ג, חיתוך 4",u"1.2 שניות",None),
(55,1.2,"burst","fear",u"ברסט ג, חיתוך 5",u"1.2 שניות",None),
(56,10,"int","ther",u"המטפל, התוקפן",u"נחיתה על שוט דומם",4),
(57,3,"now","arm",u"יד על זרוע",u"לילה, אחיזה",5),
(58,3,"now","stepin",u"המושיע נכנס",u"מהגב",None),
(59,3,"now","heturn",u"הוא פונה אליו",u"אגרוף נסגר",None),
(60,3,"now","sheturn",u"גם היא פונה אליו",u"כף יד עוצרת",None),
(61,1.5,"burst","smile",u"ברסט הסיבוב, המושיע",u"1.5 שניות",None),
(62,1.5,"burst","empty",u"ברסט הסיבוב, הקורבן",u"1.5 שניות",None),
(63,1.5,"burst","eyes",u"ברסט הסיבוב, התוקפן",u"1.5 שניות",None),
(64,1.5,"burst","cave07",u"ברסט הסיבוב, הקיר",u"1.5 שניות",None),
(65,9,"cave","cave11",u"ההחלפה",u"האטה מלאה, השוט הארוך",None),
(66,13,"int","ther",u"המטפל, היציאה",u"המשפט של הסרט",6),
(67,4,"now","meetR",u"המפגש, מצולם",u"שני כיסאות זה מול זה",None),
(68,4,"ill","meetI",u"המפגש, מאויר",u"אותו פריים, שניהם מצוירים",None),
(69,4,"now","hug",u"החיבוק",u"יד על גב, מסגור צמוד",None),
(70,3,"now","smileR",u"החיוך האמיתי",u"הראשון בסרט",None),
(71,4,"now","walkR",u"הולכים יחד, מצולם",u"מהגב, עדשה ארוכה",None),
(72,4,"ill","walkI",u"הולכים יחד, מאויר",u"אותו פריים, שפה אחרת",None),
(73,3,"cave","cave08",u"טביעת יד של ילד",u"אין תנועה",None),
(74,4,"cave","cave17",u"הדמות הרביעית",u"היד מתחילה קו",None),
(75,5,"cave","turn3",u"שלושתן פונות אליה",u"פנייה איטית",None),
(76,6,"cave","cave19",u"היד בתוך היד",u"סופר קלוז אפ, האטה מלאה",None),
(77,5,"cave","reveal",u"הגילוי, זה הוא",u"הלהבה על הפנים",None),
(78,3,"card",None,u"כרטיס סיום",u"תווית ושם הסרט",None),
]

W, H = 1920, 1080
G = (113, 247, 60)
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

def f(p, s): return ImageFont.truetype(p, s)
def he(d, xy, t, fo, fill, anchor="ra"):
    d.text(xy, t, font=fo, fill=fill, direction="rtl", language="he", anchor=anchor)

def segs(txt, size=90):
    fo = ImageFont.truetype(FB, size)
    im = Image.new("L", (1400, 200), 0)
    ImageDraw.Draw(im).text((20, 20), txt, font=fo, fill=255, direction="rtl", language="he")
    cols = [max(im.crop((x, 0, x + 1, im.height)).getdata()) for x in range(im.width)]
    out = []; cur = None
    for x, c in enumerate(cols):
        if c > 40 and cur is None: cur = x
        if c <= 40 and cur is not None: out.append((cur, x - 1)); cur = None
    if cur is not None: out.append((cur, im.width - 1))
    return out

a = segs(u"שי")
assert len(a) == 2 and (a[1][1] - a[1][0]) > (a[0][1] - a[0][0]) * 2, "RTL ORDER %r" % a
b = segs(u"תיארוך:")
cm = ImageFont.truetype(FB, 90).getmask(":").getbbox()
assert abs((b[0][1] - b[0][0] + 1) - (cm[2] - cm[0])) <= 3, "COLON %r" % b[0]
print("assertions ok")

QUOTES = {
 "q1": ("I.  THE RESCUER", "“If they stop needing me,", "I stop existing.”"),
 "q2": ("II.  THE VICTIM", "“I decided, a long time ago,", "that I can’t.”"),
 "q3": ("III.  THE PERSECUTOR", "“I am not attacking.", "I am defending myself.”"),
}
KIND = {"cave": (u"מערה", (120,200,255)), "now": (u"הווה", (255,180,90)),
        "int": (u"ראיון", (200,140,255)), "ill": (u"מאויר", (200,140,255)),
        "mag": (u"מגזין", (255,120,190)), "burst": (u"ברסט", (255,235,90)),
        "vidEZ": (u"אפקט", (120,255,220)), "vidBT": (u"אפקט", (120,255,220)),
        "title": (u"כותרת", (160,160,160)), "q1": (u"כרטיס פרק", (160,160,160)),
        "q2": (u"כרטיס פרק", (160,160,160)), "q3": (u"כרטיס פרק", (160,160,160)),
        "card": (u"עריכה", (160,160,160))}

for k, stem in A.items():
    p = "a_%s.png" % k
    if not os.path.exists(p):
        urllib.request.urlretrieve(B + stem + ".png", p)

def band(n, dur, kind, name, mot):
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); dr = ImageDraw.Draw(ov)
    dr.rectangle([0, H - 200, W, H], fill=(0, 0, 0, 205))
    dr.rectangle([0, 0, W, 104], fill=(0, 0, 0, 150))
    for x in range(0, W, 26):
        dr.rectangle([x, H - 200, x + 14, H - 197], fill=G + (255,))
    dr.text((70, H - 172), "%02d" % n, font=f(FB, 86), fill=G + (255,))
    lab = ("%.1f sec" % dur) if dur % 1 else ("%d sec" % dur)
    dr.text((72, H - 68), lab, font=f(FR, 30), fill=(155, 155, 155, 255))
    he(dr, (1850, H - 176), name, f(FB, 54), (245, 245, 245, 255))
    he(dr, (1850, H - 96), mot, f(FR, 34), (178, 178, 178, 255))
    kl, kc = KIND[kind]
    he(dr, (1850, 32), kl, f(FB, 34), kc + (255,))
    dr.text((70, 40), "ROUGH CUT V4  /  STILLS + FX", font=f(FB, 26), fill=G + (255,))
    return ov, dr

tot = sum(x[1] for x in S)
cum = 0.0
marks = []
vids = []
for n, dur, kind, asset, name, mot, vo in S:
    if vo: marks.append((vo, cum))
    ov, dr = band(n, dur, kind, name, mot)
    dr.rectangle([0, H - 8, W, H], fill=(255, 255, 255, 40))
    dr.rectangle([0, H - 8, int(W * (cum + dur) / tot), H], fill=G + (255,))
    if kind.startswith("vid"):
        ov.save("v%02d.png" % n)
        vids.append((n, VID[asset]))
        cum += dur
        continue
    if kind == "title":
        base = Image.new("RGB", (W, H), (6, 6, 6)); d2 = ImageDraw.Draw(base)
        d2.text((960, 430), "THE RESCUER", font=f(FB, 96), fill=(240, 240, 240), anchor="ma")
        d2.text((960, 545), "SYNDROME", font=f(FB, 96), fill=(240, 240, 240), anchor="ma")
        he(d2, (960, 690), u"תסמונת המושיע", f(FR, 42), G, anchor="ma")
    elif kind in QUOTES:
        head, l1, l2 = QUOTES[kind]
        base = Image.new("RGB", (W, H), (6, 6, 6)); d2 = ImageDraw.Draw(base)
        d2.text((960, 380), head, font=f(FB, 30), fill=G, anchor="ma")
        d2.text((960, 480), l1, font=f(FR, 56), fill=(238, 238, 238), anchor="ma")
        d2.text((960, 560), l2, font=f(FR, 56), fill=(238, 238, 238), anchor="ma")
    elif kind == "card":
        base = Image.new("RGB", (W, H), (6, 6, 6)); d2 = ImageDraw.Draw(base)
        rows = [("Cave, lowest layer", (232,232,232)),
                ("Three figures, ochre and charcoal", (232,232,232)),
                ("Dated approximately thirty thousand years ago", (232,232,232)),
                ("Meaning: unknown", G)]
        for i, (t, c) in enumerate(rows):
            d2.text((960, 330 + i * 74), t, font=f(FR, 44), fill=c, anchor="ma")
        d2.line([(760, 680), (1160, 680)], fill=(70, 70, 70), width=2)
        d2.text((960, 720), "THE RESCUER SYNDROME", font=f(FB, 34), fill=(180, 180, 180), anchor="ma")
    else:
        im2 = Image.open("a_%s.png" % asset).convert("RGB")
        r = max(W / im2.width, H / im2.height)
        im2 = im2.resize((int(im2.width * r + .5), int(im2.height * r + .5)), Image.LANCZOS)
        l = (im2.width - W) // 2; t = (im2.height - H) // 2
        base = im2.crop((l, t, l + W, t + H))
        if kind == "burst":
            base = base.crop((160, 90, W - 160, H - 90)).resize((W, H), Image.LANCZOS)
    Image.alpha_composite(base.convert("RGBA"), ov).convert("RGB").save("o%02d.png" % n)
    cum += dur

open("durs.txt", "w").write("".join("%d %.2f %s\n" % (n, d, ("vid" if k.startswith("vid") else "img")) for n, d, k, _, _, _, _ in S))
open("marks.txt", "w").write("".join("%d %d\n" % (v, round(t * 1000)) for v, t in marks))
open("vids.txt", "w").write("".join("%d %s\n" % (n, u) for n, u in vids))
print("built %d shots, total %.2f s = %d:%02d" % (len(S), tot, tot // 60, tot % 60))
print("vo marks:", [(v, round(t, 1)) for v, t in marks])
