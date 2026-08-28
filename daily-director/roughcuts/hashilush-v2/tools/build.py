# -*- coding: utf-8 -*-
import os, urllib.request
from PIL import Image, ImageDraw, ImageFont

B = "https://d8j0ntlcm91z4.cloudfront.net/user_348jNuehm4zmcU1si73jLXDcXDZ/hf_"
THER = "20260828_195231_7a8423af-af08-4782-aa83-9b92bb819dcd"
F = {
 1:"20260828_184139_0d7bf89f-aaa5-4845-8c5a-fa33bf231954",
 2:"20260828_184139_b50fd6bf-8c52-4898-887b-ffd771981355",
 3:"20260828_184139_5b2f9616-c5d5-4167-8e9c-1cfddef15960",
 4:"20260828_183616_50afe60a-f965-4387-acaf-5e495683c968",
 5:THER, 6:THER,
 7:"20260828_202509_c5049745-7c5d-45e6-9f8a-7c89d3414c0d",
 8:"20260828_202509_a92f392b-99ce-48ae-8bad-04d82075b1b4",
 11:"20260828_202509_910c33db-409e-4db5-9598-cf862887b031",
 12:"20260828_202509_2d9c8e6c-07cb-41d6-909f-710e537595ac",
 14:"20260828_202509_d2bfffbe-8e16-4d20-bd2e-3055c58b418b",
 15:"20260828_202509_07de0659-0724-43ec-b76d-eb933672cdef",
 16:"20260828_184139_602fe8bc-3c9f-48b9-9d0a-e902c26d6fb4",
 17:"20260828_202509_0d465642-4f5a-4b0c-8504-d6b7ed2dcc24",
 18:THER, 19:THER,
 20:"20260828_202509_5b6ce482-640d-4367-ba88-945cb62b2d16",
 24:"20260828_202509_7cd08410-83fe-4f0d-a963-26523208005b",
 25:"20260828_202509_8683f183-95a5-42db-b5f6-c429d458fcba",
 26:"20260828_202510_5e8672e6-0e32-4abe-8680-9e55e713a564",
 27:"20260828_184139_00ba8f25-ec93-42b9-a27a-3469073679fc",
 29:"20260828_202509_3566c7e2-4dd1-4077-ad65-6b98e5bb4c3b",
 30:THER, 31:THER,
 33:"20260828_202544_0095804c-0a7c-41bb-aad7-e3b5f57f5c0a",
 34:"20260828_202544_e790d35a-49a2-4161-90ad-490724d97084",
 37:"20260828_202544_eb017d03-2695-4076-831d-66c6483d3035",
 38:"20260828_184140_12dc5a89-ea13-4d47-a944-197d67dbe636",
 39:"20260828_202544_2af518da-ea36-4f86-8a95-a7192a02cdea",
 40:"20260828_202544_b067883e-40f4-43c9-adba-fe63b258f399",
 41:THER,
 42:"20260828_202544_44586579-23bc-4140-bb8a-e02f0ff026f8",
 46:"20260828_202509_2d9c8e6c-07cb-41d6-909f-710e537595ac",
 47:"20260828_202509_8683f183-95a5-42db-b5f6-c429d458fcba",
 48:"20260828_202544_e790d35a-49a2-4161-90ad-490724d97084",
 49:"20260828_183616_50afe60a-f965-4387-acaf-5e495683c968",
 50:"20260828_184140_79797444-a653-4a0b-8c42-e0458e669f9c",
 51:THER,
 52:"20260828_184139_52ae0376-0fbf-43fb-9846-9429a90d5268",
 53:"20260828_184209_aa8bafc4-6185-4927-8160-5e1499a5a115",
 54:"20260828_202544_4682ba1c-d957-430a-b239-48b8405ca277",
 55:"20260828_184209_02e51880-2f04-4d51-b99c-9bcf06bb41f4",
 56:"20260828_202544_af172541-201a-4224-b24a-267aa86931f1",
}

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

S = [
(1,4,"cave",u"כניסת הלפיד",u"האלומה זוחלת על הקיר",""),
(2,3,"cave",u"טבילה באוקר",u"האצבע נכנסת לפיגמנט",""),
(3,4,"cave",u"הקו הראשון",u"היד נמשכת לאורך הקיר",""),
(4,7,"cave",u"הקיר, שלוש דמויות",u"רק הלהבה זזה",""),
(5,4,"int",u"המטפל מתיישב",u"מיישר את המיקרופון",""),
(6,6,"int",u"המטפל מדבר",u"ליפסינק","There are three roles. The rescuer. The victim. The persecutor."),
(7,3,"now",u"קפה למישהו אחר",u"הוא מוזג, הספל שלו ריק",""),
(8,3,"now",u"יותר מדי שקיות",u"האצבעות נלחצות",""),
(9,3,"ph",u"טלפון בלילה",u"עונה לפני הצלצול השני",""),
(10,4,"ph",u"מתקן מדף",u"אף אחד לא ביקש",""),
(11,3,"now",u"הצלחת מצטננת",u"אין תנועה, הוא בגב",""),
(12,4,"now",u"החיוך והעיניים",u"העיניים לא מצטרפות",""),
(13,3,"ph",u"נותן את המעיל",u"מוריד ונותן",""),
(14,4,"now",u"שלוש לפנות בוקר",u"המפתחות מסתובבים",""),
(15,4,"now",u"יד על כתף",u"אוחזת רגע יותר מדי",""),
(16,3,"cave",u"השלישית נכנסת",u"קאט למערה",""),
(17,3,"now",u"השתקפות בחלון",u"הוא לבד מולה",""),
(18,4,"int",u"קאטאווי, הספל",u"ידי המטפל",""),
(19,16,"int",u"המטפל, המושיע",u"הבלוק הארוך","The rescuer looks like the best person in the room. He isn't."),
(20,4,"now",u"על קצה המיטה",u"הוא לא זז",""),
(21,3,"ph",u"מעטפות סגורות",u"אין תנועה",""),
(22,3,"ph",u"מרים ומניח",u"התיק עולה ויורד",""),
(23,3,"ph",u"מסך ריק",u"אין התראות",""),
(24,4,"now",u"כתפיים מאחור",u"נשימה בלבד",""),
(25,4,"now",u"פנים ריקות",u"מבט ישר, בלי הבעה",""),
(26,3,"now",u"ידיים רועדות",u"רעד עדין",""),
(27,3,"cave",u"השוכבת",u"קאט למערה",""),
(28,3,"ph",u"הדלת מבפנים",u"אין תנועה",""),
(29,3,"now",u"הקפוצ'ון עולה",u"הפנים נכנסות לצל",""),
(30,3,"int",u"קאטאווי, המשקפיים",u"אין תנועה",""),
(31,10,"int",u"המטפל, הקורבן",u"הבלוק","The victim decided, a long time ago, that he cannot."),
(32,3,"ph",u"דלת נטרקת",u"רעידה במשקוף",""),
(33,3,"now",u"חוסם את הפתח",u"דומם לגמרי",""),
(34,4,"now",u"העיניים",u"בלי מצמוץ",""),
(35,3,"ph",u"אצבע מצביעה",u"פעם אחת",""),
(36,3,"ph",u"גב מתרחק",u"מחוץ לפוקוס",""),
(37,4,"now",u"פרקי אצבעות",u"הלחיצה מתהדקת",""),
(38,3,"cave",u"העומדת",u"קאט למערה",""),
(39,4,"now",u"הסימן שהוא מפחד",u"הלחות בעין",""),
(40,4,"now",u"מתיישב לבד",u"הכעס נגמר",""),
(41,10,"int",u"המטפל, התוקפן",u"הבלוק","And the persecutor is certain that he is the victim."),
(42,3,"now",u"יד על זרוע",u"לילה, אחיזה","All three of them are the same person."),
(43,3,"ph",u"המושיע נכנס",u"מהגב",""),
(44,3,"ph",u"הוא פונה אליו",u"סיבוב גוף",""),
(45,3,"ph",u"גם היא פונה אליו",u"סיבוב גוף",""),
(46,1.5,"now",u"ברסט, המושיע",u"חיתוך מהיר",""),
(47,1.5,"now",u"ברסט, הקורבן",u"חיתוך מהיר",""),
(48,1.5,"now",u"ברסט, התוקפן",u"חיתוך מהיר",""),
(49,1.5,"cave",u"ברסט, הקיר",u"חיתוך מהיר",""),
(50,9,"cave",u"ההחלפה",u"האטה מלאה, השוט הארוך",""),
(51,13,"int",u"המטפל, היציאה",u"המשפט של הסרט","The moment you stop rescuing, you look like the persecutor."),
(52,3,"cave",u"טביעת יד של ילד",u"אין תנועה",""),
(53,4,"cave",u"הדמות הרביעית",u"היד מתחילה קו",""),
(54,5,"cave",u"שלושתן פונות אליה",u"פנייה איטית",""),
(55,4,"cave",u"הטביעה",u"כף היד נלחצת",""),
(56,5,"cave",u"הגילוי, זה הוא",u"הלהבה על הפנים",""),
(57,3,"card",u"תווית",u"כרטיס בעריכה",""),
]

KIND = {"cave": (u"מערה", (120,200,255)), "now": (u"הווה", (255,180,90)),
        "int": (u"ראיון", (200,140,255)), "ph": (u"חסר", (255,90,90)),
        "card": (u"עריכה", (160,160,160))}

cache = {}
for n, stem in F.items():
    p = "s%02d.png" % n
    if os.path.exists(p): continue
    if stem in cache:
        os.link(cache[stem], p)
    else:
        urllib.request.urlretrieve(B + stem + ".png", p); cache[stem] = p

tot = sum(x[1] for x in S); cum = 0.0
for n, dur, kind, name, mot, en in S:
    p = "s%02d.png" % n
    if kind == "card":
        base = Image.new("RGB", (W, H), (8, 8, 8)); dr = ImageDraw.Draw(base)
        rows = [("Cave, lowest layer", (235,235,235)),
                ("Three figures, ochre and charcoal", (235,235,235)),
                ("Dated approximately thirty thousand years ago", (235,235,235)),
                ("Meaning: unknown", G)]
        for i, (t, c) in enumerate(rows):
            dr.text((960, 380 + i * 78), t, font=f(FR, 46), fill=c, anchor="ma")
    elif kind == "ph" or not os.path.exists(p):
        base = Image.new("RGB", (W, H), (16, 10, 10)); dr = ImageDraw.Draw(base)
        dr.rectangle([120, 150, W - 120, H - 260], outline=(200, 70, 70), width=3)
        dr.text((960, 300), "SHOT NOT GENERATED", font=f(FB, 54), fill=(255, 90, 90), anchor="ma")
        he(dr, (1500, 430), name, f(FB, 64), (240, 240, 240))
        he(dr, (1500, 540), mot, f(FR, 40), (180, 180, 180))
        dr.text((960, 700), "placeholder, waiting on credits", font=f(FR, 32), fill=(150, 110, 110), anchor="ma")
    else:
        im2 = Image.open(p).convert("RGB")
        r = max(W / im2.width, H / im2.height)
        im2 = im2.resize((int(im2.width * r + .5), int(im2.height * r + .5)), Image.LANCZOS)
        l = (im2.width - W) // 2; t = (im2.height - H) // 2
        base = im2.crop((l, t, l + W, t + H))
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
    dr.text((70, 40), "ROUGH CUT V2  /  STILLS", font=f(FB, 26), fill=G + (255,))
    if en:
        dr.text((520, 46), en, font=f(FR, 28), fill=(215, 215, 215, 255))
    dr.rectangle([0, H - 8, W, H], fill=(255, 255, 255, 40))
    dr.rectangle([0, H - 8, int(W * (cum + dur) / tot), H], fill=G + (255,))
    Image.alpha_composite(base.convert("RGBA"), ov).convert("RGB").save("o%02d.png" % n)
    cum += dur

open("durs.txt", "w").write("".join("%d %.1f\n" % (n, d) for n, d, _, _, _, _ in S))
print("built %d shots, total %.1f s" % (len(S), tot))
