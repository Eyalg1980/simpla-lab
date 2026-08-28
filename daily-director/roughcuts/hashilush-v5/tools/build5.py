# -*- coding: utf-8 -*-
import os, urllib.request
from PIL import Image, ImageDraw, ImageFont

B = "https://d8j0ntlcm91z4.cloudfront.net/user_348jNuehm4zmcU1si73jLXDcXDZ/hf_"
A = {
 "cave04":"20260828_184139_00ba8f25-ec93-42b9-a27a-3469073679fc",
 "cave05":"20260828_184140_12dc5a89-ea13-4d47-a944-197d67dbe636",
 "cave06":"20260828_184139_602fe8bc-3c9f-48b9-9d0a-e902c26d6fb4",
 "cave07":"20260828_183616_50afe60a-f965-4387-acaf-5e495683c968",
 "cave08":"20260828_184139_52ae0376-0fbf-43fb-9846-9429a90d5268",
 "ther":"20260828_195231_7a8423af-af08-4782-aa83-9b92bb819dcd",
 "coffee":"20260828_202509_c5049745-7c5d-45e6-9f8a-7c89d3414c0d",
 "smile":"20260828_202509_2d9c8e6c-07cb-41d6-909f-710e537595ac",
 "bed":"20260828_202509_5b6ce482-640d-4367-ba88-945cb62b2d16",
 "back":"20260828_202509_7cd08410-83fe-4f0d-a963-26523208005b",
 "empty":"20260828_202509_8683f183-95a5-42db-b5f6-c429d458fcba",
 "shake":"20260828_202510_5e8672e6-0e32-4abe-8680-9e55e713a564",
 "block":"20260828_202544_0095804c-0a7c-41bb-aad7-e3b5f57f5c0a",
 "eyes":"20260828_202544_e790d35a-49a2-4161-90ad-490724d97084",
 "knuck":"20260828_202544_eb017d03-2695-4076-831d-66c6483d3035",
 "fear":"20260828_202544_2af518da-ea36-4f86-8a95-a7192a02cdea",
 "mag1":"20260828_222831_229f8d60-c01f-49bd-b3ed-b2cf817643ba",
 "mag2":"20260828_222831_a3d5137a-0aa3-4218-a55b-4758bbaf9c03",
 "mag3":"20260828_222831_f4eea5ca-6b12-468c-9163-9dcd63bd5307",
 "screen":"20260828_223126_ebe4cd2f-71e0-4264-ba0e-37f1605e539f",
 "doorin":"20260828_223126_a7e18f4f-9f18-43ed-9a2e-c7c9d8210c22",
 "shatter":"20260828_230149_02872399-76b5-46e0-952f-a78258ede294",
 "slamst":"20260828_222831_2f2cb8a9-2b96-4efe-8cb9-35cd4acebeb6",
}
C = {  # shot -> clip stem
 1:"20260828_230804_0876d505-1ae7-40f8-a5a7-8af0fd005ad2",
 2:"20260828_230803_5d133708-3bad-4a26-9101-9549b35fe4ad",
 3:"20260828_230803_446b5f0d-0484-4a91-97e1-db4c38b797ba",
 4:"20260828_230803_9019a833-b991-47cb-910f-a326c8db1582",
 7:"20260828_231025_e9ddff60-e107-4394-b16b-e38121d1b60e",
 9:"20260828_223225_f9d05bc9-78c1-42fe-9a8b-81de58b7b676",
 10:"20260828_230804_273c71f9-f836-4871-ab9e-25813b822f8f",
 11:"20260828_230849_989249d4-74a3-4951-b1f6-110338c7c668",
 12:"20260828_230804_151bd1ef-6566-49e8-a52b-789239805cb9",
 14:"20260828_230848_3ca5edb3-929c-4fef-ae4d-5bc699062bca",
 15:"20260828_230803_5c1eec64-48a4-4179-9cdc-e243ae9e3aba",
 16:"20260828_230803_d555ca97-8623-4a81-a964-3964e3689184",
 19:"20260828_231509_746e0d8c-0d5e-491b-ba79-a2379b222b5f",
 23:"20260828_230803_8cdb2ab2-84e9-4c3d-a699-ff6d301c5943",
 27:"20260828_230803_9c31c352-daf4-4914-b35d-6b155f51f8e1",
 33:"20260828_230848_ab8e2688-a584-4abe-aafb-aed0ea2763dc",
 37:"20260828_231509_5e3ec4c4-feba-476b-91a1-66a1d5511125",
 39:"20260828_230848_e12a26af-e05f-40a5-9f45-9f45d51bf314",
 42:"20260828_230930_6ef88c81-aea1-47f7-91ca-23716a4525fb",
 46:"20260828_230242_528f9b71-6103-4723-bb1a-57ede188779b",
 47:"20260828_230306_653526d2-7088-46f0-8c7e-92f5097a7a37",
 48:"20260828_230315_0ea47578-88d7-4106-9cad-753fdb1e1326",
 49:"20260828_230848_a97ed3a3-84b5-4e4c-ae20-368af34a8260",
 55:"20260828_230930_12fef9e3-ef73-4260-a3ef-cfbf1b7f706a",
 56:"20260828_230930_f753e251-1e55-4c7f-a015-5d53fc55d42d",
 57:"20260828_230848_ef63a6fa-2dd2-4fa4-aee1-05b59d079cf3",
 58:"20260828_230848_3fce5295-a8ff-4a14-b6fb-36d4127dc8b9",
 63:"20260828_230849_9b8e69a4-4b7c-437f-ab64-fabf674510e6",
 64:"20260828_231025_513bb532-1565-4194-952b-789005fbdd51",
 65:"20260828_230930_65a55011-899e-49a3-a43b-98732283824f",
 66:"20260828_230930_e37a48cf-7215-4b63-95f3-e35fdea19846",
 67:"20260828_230930_91f5f6b7-c271-4070-bec0-f632ccd5384f",
 68:"20260828_230930_36310d72-7aea-4b11-8f42-bd2aa6c3ad19",
 69:"20260828_230943_995c4115-1469-4fef-9632-4a14181d0a49",
 70:"20260828_230930_7abe8b2a-9296-4e9f-810c-378f47e1f404",
 72:"20260828_230930_b674f1bf-3d0d-4012-a893-e262c57286e5",
 73:"20260828_230930_c5904aae-d534-403c-9453-b2084d3ea840",
 74:"20260828_230930_a1dc46a3-0adc-4e0a-a504-d827eecce1f1",
 75:"20260828_230944_f756c20f-8fa2-47d8-a820-7380d93ec245",
}

# n, dur, kind, asset, name, motion, vo
S = [
(1,4,"cave","cave07",u"כניסת הלפיד",u"האלומה זוחלת על הקיר",None),
(2,3,"cave","cave07",u"טבילה באוקר",u"האצבע נכנסת לפיגמנט",None),
(3,4,"cave","cave07",u"הקו הראשון",u"היד נמשכת לאורך הקיר",None),
(4,5,"cave","cave07",u"הקיר, שלוש דמויות",u"רק הלהבה זזה",None),
(5,4,"title",None,u"כרטיס כותרת",u"קאט קשה משחור",None),
(6,4,"int","ther",u"המטפל מתיישב",u"מיישר את המיקרופון",None),
(7,6,"int","ther",u"המטפל מדבר",u"ליפסינק אמיתי",1),
(8,2.5,"q1",None,u"כרטיס פרק ראשון",u"הקריינות ממשיכה מעליו",None),
(9,10.1,"fx","cave07",u"EARTH ZOOM",u"צלילה מהמסלול עד הרחוב",None),
(10,3,"now","coffee",u"קפה למישהו אחר",u"הספל שלו ריק",None),
(11,3,"now","coffee",u"טלפון בלילה",u"האור נסחף על פניו",None),
(12,4,"now","coffee",u"מתקן מדף",u"הבורג נכנס, אבק נושר",None),
(13,4,"now","smile",u"החיוך והעיניים",u"העיניים לא מצטרפות",None),
(14,4,"now","coffee",u"שלוש לפנות בוקר",u"המפתחות מסתובבים",None),
(15,4,"now","coffee",u"יד על כתף",u"האחיזה מתהדקת",None),
(16,3,"cave","cave06",u"השלישית נכנסת",u"האצבע נסוגה",None),
(17,1.2,"burst","coffee",u"ברסט א, חיתוך 1",u"1.2 שניות",None),
(18,1.2,"burst","cave06",u"ברסט א, חיתוך 2",u"1.2 שניות",None),
(19,15,"int","ther",u"המטפל, המושיע",u"ליפסינק אמיתי",2),
(20,4,"int","ther",u"המטפל, סיום הבלוק",u"נשימה, בלי דיבור",None),
(21,2.5,"q2",None,u"כרטיס פרק שני",u"קאט קשה",None),
(22,4,"now","bed",u"על קצה המיטה",u"דולי דיגיטלי איטי",None),
(23,3,"now","bed",u"מרים ומניח",u"התיק עולה ויורד",None),
(24,3,"now","screen",u"מסך ריק",u"דולי דיגיטלי איטי",None),
(25,4,"now","back",u"כתפיים מאחור",u"דולי דיגיטלי איטי",None),
(26,4,"now","empty",u"פנים ריקות",u"דולי דיגיטלי איטי",None),
(27,3,"now","shake",u"ידיים רועדות",u"רעד אמיתי",None),
(28,3,"cave","cave04",u"השוכבת",u"דולי דיגיטלי איטי",None),
(29,3,"mag","mag1",u"מגזין, הפנים",u"הזיכרון נקרע",None),
(30,3,"mag","mag2",u"מגזין, הידיים",u"אותה יד שלוש פעמים",None),
(31,3,"mag","mag3",u"מגזין, ארבע פעמים",u"הדמות נדפסת שוב",None),
(32,3,"now","doorin",u"הדלת מבפנים",u"דולי דיגיטלי איטי",None),
(33,3,"now","doorin",u"הקפוצון עולה",u"הפנים נכנסות לצל",None),
(34,1.2,"burst","mag1",u"ברסט ב, חיתוך 1",u"1.2 שניות",None),
(35,1.2,"burst","shake",u"ברסט ב, חיתוך 2",u"1.2 שניות",None),
(36,1.2,"burst","cave04",u"ברסט ב, חיתוך 3",u"1.2 שניות",None),
(37,13,"int","ther",u"המטפל, הקורבן",u"ליפסינק אמיתי",3),
(38,2.5,"q3",None,u"כרטיס פרק שלישי",u"קאט קשה",None),
(39,3,"now","slamst",u"דלת נטרקת",u"הדלת רועדת, אבק קופץ",None),
(40,3,"now","block",u"חוסם את הפתח",u"דולי דיגיטלי איטי",None),
(41,4,"now","eyes",u"העיניים",u"דולי דיגיטלי איטי",None),
(42,3,"now","block",u"גב מתרחק",u"הדמות מתרחקת",None),
(43,4,"now","knuck",u"פרקי אצבעות",u"דולי דיגיטלי איטי",None),
(44,3,"cave","cave05",u"העומדת",u"דולי דיגיטלי איטי",None),
(45,5,"now","fear",u"הסימן שהוא מפחד",u"דולי דיגיטלי איטי",None),
(46,4,"fx","shatter",u"הזריקה",u"האטה מלאה, היד משחררת",None),
(47,4,"fx","shatter",u"הכוס באוויר",u"האטה מלאה, מסתובבת",None),
(48,8,"fx","shatter",u"BULLET TIME",u"הרסיסים מתפזרים, מצלמה מקיפה",None),
(49,4,"now","block",u"מתיישב לבד",u"הכעס נגמר",None),
(50,1.2,"burst","slamst",u"ברסט ג, חיתוך 1",u"1.2 שניות",None),
(51,1.2,"burst","knuck",u"ברסט ג, חיתוך 2",u"1.2 שניות",None),
(52,1.2,"burst","shatter",u"ברסט ג, חיתוך 3",u"1.2 שניות",None),
(53,1.2,"burst","cave05",u"ברסט ג, חיתוך 4",u"1.2 שניות",None),
(54,10,"int","ther",u"המטפל, התוקפן",u"דולי דיגיטלי איטי",4),
(55,3,"now","block",u"יד על זרוע",u"האחיזה מתהדקת",5),
(56,3,"now","block",u"המושיע נכנס",u"הכתף נכנסת לפריים",None),
(57,3,"now","block",u"הוא פונה אליו",u"האגרוף נסגר",None),
(58,3,"now","block",u"גם היא פונה אליו",u"כף יד עוצרת",None),
(59,1.5,"burst","smile",u"ברסט הסיבוב, המושיע",u"החזרה כאן מכוונת",None),
(60,1.5,"burst","empty",u"ברסט הסיבוב, הקורבן",u"אותו אדם",None),
(61,1.5,"burst","eyes",u"ברסט הסיבוב, התוקפן",u"אותו אדם",None),
(62,1.5,"burst","cave07",u"ברסט הסיבוב, הקיר",u"אותו אדם",None),
(63,9,"cave","cave07",u"ההחלפה",u"האטה מלאה, השוט הארוך",None),
(64,13,"int","ther",u"המטפל, היציאה",u"ליפסינק אמיתי",6),
(65,4,"now","bed",u"המפגש, מצולם",u"שניהם נושמים",None),
(66,4,"ill","bed",u"המפגש, מאויר",u"אותו פריים, שפה אחרת",None),
(67,4,"now","bed",u"החיבוק",u"כף היד נלחצת",None),
(68,3,"now","smile",u"החיוך האמיתי",u"מגיע לעיניים",None),
(69,4,"now","bed",u"הולכים יחד, מצולם",u"מתרחקים במסדרון העצים",None),
(70,4,"ill","bed",u"הולכים יחד, מאויר",u"אותה תנועה, שפה אחרת",None),
(71,3,"cave","cave08",u"טביעת יד של ילד",u"דולי דיגיטלי איטי",None),
(72,4,"cave","cave08",u"הדמות הרביעית",u"היד ממשיכה את הקו",None),
(73,5,"cave","cave08",u"שלושתן פונות אליה",u"האטה מלאה",None),
(74,6,"cave","cave08",u"היד בתוך היד",u"כף היד נלחצת, האטה מלאה",None),
(75,5,"cave","cave08",u"הגילוי, זה הוא",u"הלהבה על הפנים",None),
(76,3,"card",None,u"כרטיס סיום",u"תווית ושם הסרט",None),
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
plan = []
for n, dur, kind, asset, name, mot, vo in S:
    if vo: marks.append((vo, cum))
    if kind in ("title", "q1", "q2", "q3", "card"):
        base = Image.new("RGB", (W, H), (6, 6, 6)); d2 = ImageDraw.Draw(base)
        if kind == "title":
            d2.text((960, 430), "THE RESCUER", font=f(FB, 96), fill=(240,240,240), anchor="ma")
            d2.text((960, 545), "SYNDROME", font=f(FB, 96), fill=(240,240,240), anchor="ma")
            he(d2, (960, 690), u"תסמונת המושיע", f(FR, 42), G, anchor="ma")
        elif kind == "card":
            rows = [("Cave, lowest layer", (232,232,232)),
                    ("Three figures, ochre and charcoal", (232,232,232)),
                    ("Dated approximately thirty thousand years ago", (232,232,232)),
                    ("Meaning: unknown", G)]
            for i, (t, c) in enumerate(rows):
                d2.text((960, 330 + i * 74), t, font=f(FR, 44), fill=c, anchor="ma")
            d2.line([(760, 680), (1160, 680)], fill=(70,70,70), width=2)
            d2.text((960, 720), "THE RESCUER SYNDROME", font=f(FB, 34), fill=(180,180,180), anchor="ma")
        else:
            head, l1, l2 = QUOTES[kind]
            d2.text((960, 380), head, font=f(FB, 30), fill=G, anchor="ma")
            d2.text((960, 480), l1, font=f(FR, 56), fill=(238,238,238), anchor="ma")
            d2.text((960, 560), l2, font=f(FR, 56), fill=(238,238,238), anchor="ma")
        base.save("o%02d.png" % n)
        plan.append((n, dur, "card", ""))
    elif n in C:
        plan.append((n, dur, "clip", B + C[n] + ".mp4"))
    else:
        im2 = Image.open("a_%s.png" % asset).convert("RGB")
        r = max(W / im2.width, H / im2.height)
        im2 = im2.resize((int(im2.width * r + .5), int(im2.height * r + .5)), Image.LANCZOS)
        l = (im2.width - W) // 2; t = (im2.height - H) // 2
        base = im2.crop((l, t, l + W, t + H))
        if kind == "burst":
            base = base.crop((160, 90, W - 160, H - 90)).resize((W, H), Image.LANCZOS)
        base.save("o%02d.png" % n)
        plan.append((n, dur, "burst" if kind == "burst" else "dolly", ""))
    cum += dur

open("plan.txt", "w").write("".join("%d %.2f %s %s\n" % p for p in plan))
open("marks.txt", "w").write("".join("%d %d\n" % (v, round(t * 1000)) for v, t in marks))
print("shots %d total %.2f = %d:%02d" % (len(S), tot, tot // 60, tot % 60))
print("clips %d, dolly %d, cards %d" % (sum(1 for p in plan if p[2]=="clip"),
      sum(1 for p in plan if p[2] in ("dolly","burst")), sum(1 for p in plan if p[2]=="card")))
print("marks", [(v, round(t,1)) for v, t in marks])
