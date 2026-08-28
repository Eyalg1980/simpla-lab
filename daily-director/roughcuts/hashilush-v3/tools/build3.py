# -*- coding: utf-8 -*-
import os, urllib.request
from PIL import Image, ImageDraw, ImageFont

B = "https://d8j0ntlcm91z4.cloudfront.net/user_348jNuehm4zmcU1si73jLXDcXDZ/hf_"
A = {  # asset key -> cdn stem
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
 "bags":"20260828_202509_a92f392b-99ce-48ae-8bad-04d82075b1b4",
 "plate":"20260828_202509_910c33db-409e-4db5-9598-cf862887b031",
 "smile":"20260828_202509_2d9c8e6c-07cb-41d6-909f-710e537595ac",
 "keys":"20260828_202509_d2bfffbe-8e16-4d20-bd2e-3055c58b418b",
 "grip":"20260828_202509_07de0659-0724-43ec-b76d-eb933672cdef",
 "window":"20260828_202509_0d465642-4f5a-4b0c-8504-d6b7ed2dcc24",
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
}

# n, dur, kind, asset, name_he, motion_he, vo_block_or_None
S = [
(1,4,"cave","cave01",u"כניסת הלפיד",u"האלומה זוחלת על הקיר",None),
(2,3,"cave","cave02",u"טבילה באוקר",u"האצבע נכנסת לפיגמנט",None),
(3,4,"cave","cave03",u"הקו הראשון",u"היד נמשכת לאורך הקיר",None),
(4,7,"cave","cave07",u"הקיר, שלוש דמויות",u"רק הלהבה זזה",None),
(5,4,"title",None,u"כרטיס כותרת",u"קאט קשה משחור",None),
(6,4,"int","ther",u"המטפל מתיישב",u"מיישר את המיקרופון",1),
(7,6,"int","ther",u"המטפל מדבר",u"ליפסינק",None),
(8,2.5,"q1",None,u"כרטיס פרק ראשון",u"שתיים וחצי שניות, קאט קשה",None),
(9,3,"now","coffee",u"קפה למישהו אחר",u"הספל שלו ריק",None),
(10,3,"now","bags",u"יותר מדי שקיות",u"האצבעות נלחצות",None),
(11,3,"ph",None,u"טלפון בלילה",u"עונה לפני הצלצול השני",None),
(12,4,"ph",None,u"מתקן מדף",u"אף אחד לא ביקש",None),
(13,3,"now","plate",u"הצלחת מצטננת",u"אין תנועה, הוא בגב",None),
(14,4,"now","smile",u"החיוך והעיניים",u"העיניים לא מצטרפות",None),
(15,4,"now","keys",u"שלוש לפנות בוקר",u"המפתחות מסתובבים",None),
(16,4,"now","grip",u"יד על כתף",u"אוחזת רגע יותר מדי",None),
(17,3,"cave","cave06",u"השלישית נכנסת",u"קאט למערה",None),
(18,3,"now","window",u"השתקפות בחלון",u"הוא לבד מולה",None),
(19,1.2,"burst","smile",u"ברסט א, חיתוך 1",u"1.2 שניות",None),
(20,1.2,"burst","grip",u"ברסט א, חיתוך 2",u"1.2 שניות",None),
(21,1.2,"burst","cave06",u"ברסט א, חיתוך 3",u"1.2 שניות",None),
(22,4,"int","ther",u"קאטאווי, הספל",u"נחיתה על שוט דומם",2),
(23,16,"int","ther",u"המטפל, המושיע",u"הבלוק הארוך",None),
(24,2.5,"q2",None,u"כרטיס פרק שני",u"קאט קשה",None),
(25,4,"now","bed",u"על קצה המיטה",u"הוא לא זז",None),
(26,3,"ph",None,u"מרים ומניח",u"התיק עולה ויורד",None),
(27,3,"ph",None,u"מסך ריק",u"אין התראות",None),
(28,4,"now","back",u"כתפיים מאחור",u"נשימה בלבד",None),
(29,4,"now","empty",u"פנים ריקות",u"מבט ישר, בלי הבעה",None),
(30,3,"now","shake",u"ידיים רועדות",u"רעד עדין",None),
(31,3,"cave","cave04",u"השוכבת",u"קאט למערה",None),
(32,3,"ph",None,u"הדלת מבפנים",u"אין תנועה",None),
(33,3,"now","hood",u"הקפוצון עולה",u"הפנים נכנסות לצל",None),
(34,1.2,"burst","empty",u"ברסט ב, חיתוך 1",u"1.2 שניות",None),
(35,1.2,"burst","shake",u"ברסט ב, חיתוך 2",u"1.2 שניות",None),
(36,1.2,"burst","cave04",u"ברסט ב, חיתוך 3",u"1.2 שניות",None),
(37,1.2,"burst","bed",u"ברסט ב, חיתוך 4",u"1.2 שניות",None),
(38,3,"int","ther",u"קאטאווי, המשקפיים",u"נחיתה על שוט דומם",3),
(39,10,"int","ther",u"המטפל, הקורבן",u"הבלוק",None),
(40,2.5,"q3",None,u"כרטיס פרק שלישי",u"קאט קשה",None),
(41,3,"ph",None,u"דלת נטרקת",u"רעידה במשקוף",None),
(42,3,"now","block",u"חוסם את הפתח",u"דומם לגמרי",None),
(43,4,"now","eyes",u"העיניים",u"בלי מצמוץ",None),
(44,3,"ph",None,u"גב מתרחק",u"מחוץ לפוקוס",None),
(45,4,"now","knuck",u"פרקי אצבעות",u"הלחיצה מתהדקת",None),
(46,3,"cave","cave05",u"העומדת",u"קאט למערה",None),
(47,4,"now","fear",u"הסימן שהוא מפחד",u"הלחות בעין",None),
(48,4,"now","alone",u"מתיישב לבד",u"הכעס נגמר",None),
(49,1.2,"burst","eyes",u"ברסט ג, חיתוך 1",u"1.2 שניות",None),
(50,1.2,"burst","knuck",u"ברסט ג, חיתוך 2",u"1.2 שניות",None),
(51,1.2,"burst","cave05",u"ברסט ג, חיתוך 3",u"1.2 שניות",None),
(52,1.2,"burst","block",u"ברסט ג, חיתוך 4",u"1.2 שניות",None),
(53,1.2,"burst","fear",u"ברסט ג, חיתוך 5",u"1.2 שניות",None),
(54,10,"int","ther",u"המטפל, התוקפן",u"נחיתה על שוט דומם",4),
(55,3,"now","arm",u"יד על זרוע",u"לילה, אחיזה",5),
(56,3,"ph",None,u"המושיע נכנס",u"מהגב",None),
(57,3,"ph",None,u"הוא פונה אליו",u"סיבוב גוף",None),
(58,3,"ph",None,u"גם היא פונה אליו",u"סיבוב גוף",None),
(59,1.5,"burst","smile",u"ברסט הסיבוב, המושיע",u"1.5 שניות",None),
(60,1.5,"burst","empty",u"ברסט הסיבוב, הקורבן",u"1.5 שניות",None),
(61,1.5,"burst","eyes",u"ברסט הסיבוב, התוקפן",u"1.5 שניות",None),
(62,1.5,"burst","cave07",u"ברסט הסיבוב, הקיר",u"1.5 שניות",None),
(63,9,"cave","cave11",u"ההחלפה",u"האטה מלאה, השוט הארוך",None),
(64,13,"int","ther",u"המטפל, היציאה",u"המשפט של הסרט",6),
(65,4,"ph",None,u"המפגש, מצולם",u"שני כיסאות זה מול זה",None),
(66,4,"ph",None,u"המפגש, מאויר",u"אותו פריים, שניהם מצוירים",None),
(67,4,"ph",None,u"המפגש, כיסאות זה לצד זה",u"אותו חדר, כיוון אחד",None),
(68,4,"ph",None,u"החיוך האמיתי",u"הראשון בסרט",None),
(69,4,"ph",None,u"החיבוק, מסגור צמוד",u"כתף ויד על גב",None),
(70,3,"cave","cave08",u"טביעת יד של ילד",u"אין תנועה",None),
(71,4,"cave","cave17",u"הדמות הרביעית",u"היד מתחילה קו",None),
(72,5,"cave","turn3",u"שלושתן פונות אליה",u"פנייה איטית",None),
(73,6,"cave","cave19",u"היד בתוך היד",u"סופר קלוז אפ, האטה מלאה",None),
(74,5,"cave","reveal",u"הגילוי, זה הוא",u"הלהבה על הפנים",None),
(75,3,"card",None,u"כרטיס סיום",u"תווית ושם הסרט",None),
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

for k, stem in A.items():
    p = "a_%s.png" % k
    if not os.path.exists(p):
        urllib.request.urlretrieve(B + stem + ".png", p)

tot = sum(x[1] for x in S)
cum = 0.0
marks = []
for n, dur, kind, asset, name, mot, vo in S:
    if vo: marks.append((vo, cum))
    if kind == "title":
        base = Image.new("RGB", (W, H), (6, 6, 6)); dr = ImageDraw.Draw(base)
        dr.text((960, 430), "THE RESCUER", font=f(FB, 96), fill=(240, 240, 240), anchor="ma")
        dr.text((960, 545), "SYNDROME", font=f(FB, 96), fill=(240, 240, 240), anchor="ma")
        he(dr, (960, 690), u"תסמונת המושיע", f(FR, 42), G, anchor="ma")
    elif kind in QUOTES:
        head, l1, l2 = QUOTES[kind]
        base = Image.new("RGB", (W, H), (6, 6, 6)); dr = ImageDraw.Draw(base)
        dr.text((960, 380), head, font=f(FB, 30), fill=G, anchor="ma")
        dr.text((960, 480), l1, font=f(FR, 56), fill=(238, 238, 238), anchor="ma")
        dr.text((960, 560), l2, font=f(FR, 56), fill=(238, 238, 238), anchor="ma")
    elif kind == "card":
        base = Image.new("RGB", (W, H), (6, 6, 6)); dr = ImageDraw.Draw(base)
        rows = [("Cave, lowest layer", (232,232,232)),
                ("Three figures, ochre and charcoal", (232,232,232)),
                ("Dated approximately thirty thousand years ago", (232,232,232)),
                ("Meaning: unknown", G)]
        for i, (t, c) in enumerate(rows):
            dr.text((960, 330 + i * 74), t, font=f(FR, 44), fill=c, anchor="ma")
        dr.line([(760, 680), (1160, 680)], fill=(70, 70, 70), width=2)
        dr.text((960, 720), "THE RESCUER SYNDROME", font=f(FB, 34), fill=(180, 180, 180), anchor="ma")
    elif kind == "ph" or asset is None or not os.path.exists("a_%s.png" % asset):
        base = Image.new("RGB", (W, H), (16, 10, 10)); dr = ImageDraw.Draw(base)
        dr.rectangle([120, 150, W - 120, H - 260], outline=(200, 70, 70), width=3)
        dr.text((960, 300), "SHOT NOT GENERATED", font=f(FB, 54), fill=(255, 90, 90), anchor="ma")
        he(dr, (1500, 430), name, f(FB, 64), (240, 240, 240))
        he(dr, (1500, 540), mot, f(FR, 40), (180, 180, 180))
        dr.text((960, 700), "placeholder, waiting on credits", font=f(FR, 32), fill=(150, 110, 110), anchor="ma")
    else:
        im2 = Image.open("a_%s.png" % asset).convert("RGB")
        r = max(W / im2.width, H / im2.height)
        im2 = im2.resize((int(im2.width * r + .5), int(im2.height * r + .5)), Image.LANCZOS)
        l = (im2.width - W) // 2; t = (im2.height - H) // 2
        base = im2.crop((l, t, l + W, t + H))
        if kind == "burst":
            base = base.crop((160, 90, W - 160, H - 90)).resize((W, H), Image.LANCZOS)
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
    KIND = {"cave": (u"מערה", (120,200,255)), "now": (u"הווה", (255,180,90)),
            "int": (u"ראיון", (200,140,255)), "ph": (u"חסר", (255,90,90)),
            "burst": (u"ברסט", (255,235,90)), "title": (u"כותרת", (160,160,160)),
            "q1": (u"כרטיס פרק", (160,160,160)), "q2": (u"כרטיס פרק", (160,160,160)),
            "q3": (u"כרטיס פרק", (160,160,160)), "card": (u"עריכה", (160,160,160))}
    kl, kc = KIND[kind]
    he(dr, (1850, 32), kl, f(FB, 34), kc + (255,))
    dr.text((70, 40), "ROUGH CUT V3  /  STILLS", font=f(FB, 26), fill=G + (255,))
    dr.rectangle([0, H - 8, W, H], fill=(255, 255, 255, 40))
    dr.rectangle([0, H - 8, int(W * (cum + dur) / tot), H], fill=G + (255,))
    Image.alpha_composite(base.convert("RGBA"), ov).convert("RGB").save("o%02d.png" % n)
    cum += dur

open("durs.txt", "w").write("".join("%d %.1f\n" % (n, d) for n, d, _, _, _, _, _ in S))
open("marks.txt", "w").write("".join("%d %d\n" % (v, round(t * 1000)) for v, t in marks))
print("built %d shots, total %.1f s = %d:%02d" % (len(S), tot, tot // 60, tot % 60))
print("vo marks:", marks)
