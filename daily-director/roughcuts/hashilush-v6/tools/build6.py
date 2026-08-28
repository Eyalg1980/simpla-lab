# -*- coding: utf-8 -*-
import os, urllib.request
from PIL import Image, ImageDraw, ImageFont

B = "https://d8j0ntlcm91z4.cloudfront.net/user_348jNuehm4zmcU1si73jLXDcXDZ/hf_"
A = {
 "cave04":"20260828_184139_00ba8f25-ec93-42b9-a27a-3469073679fc",
 "cave05":"20260828_184140_12dc5a89-ea13-4d47-a944-197d67dbe636",
 "cave07":"20260828_183616_50afe60a-f965-4387-acaf-5e495683c968",
 "cave08":"20260828_184139_52ae0376-0fbf-43fb-9846-9429a90d5268",
 "smile":"20260828_202509_2d9c8e6c-07cb-41d6-909f-710e537595ac",
 "bed":"20260828_202509_5b6ce482-640d-4367-ba88-945cb62b2d16",
 "back":"20260828_202509_7cd08410-83fe-4f0d-a963-26523208005b",
 "empty":"20260828_202509_8683f183-95a5-42db-b5f6-c429d458fcba",
 "block":"20260828_202544_0095804c-0a7c-41bb-aad7-e3b5f57f5c0a",
 "eyes":"20260828_202544_e790d35a-49a2-4161-90ad-490724d97084",
 "knuck":"20260828_202544_eb017d03-2695-4076-831d-66c6483d3035",
 "mag1":"20260828_222831_229f8d60-c01f-49bd-b3ed-b2cf817643ba",
 "mag2":"20260828_222831_a3d5137a-0aa3-4218-a55b-4758bbaf9c03",
 "mag3":"20260828_222831_f4eea5ca-6b12-468c-9163-9dcd63bd5307",
 "screen":"20260828_223126_ebe4cd2f-71e0-4264-ba0e-37f1605e539f",
 "doorin":"20260828_223126_a7e18f4f-9f18-43ed-9a2e-c7c9d8210c22",
}
C = {
 1:"20260828_230804_0876d505-1ae7-40f8-a5a7-8af0fd005ad2",
 2:"20260828_230803_5d133708-3bad-4a26-9101-9549b35fe4ad",
 3:"20260828_230803_446b5f0d-0484-4a91-97e1-db4c38b797ba",
 4:"20260828_230803_9019a833-b991-47cb-910f-a326c8db1582",
 6:"20260828_231025_e9ddff60-e107-4394-b16b-e38121d1b60e",
 8:"20260828_223225_f9d05bc9-78c1-42fe-9a8b-81de58b7b676",
 9:"20260828_230804_273c71f9-f836-4871-ab9e-25813b822f8f",
 10:"20260828_230849_989249d4-74a3-4951-b1f6-110338c7c668",
 11:"20260828_230804_151bd1ef-6566-49e8-a52b-789239805cb9",
 13:"20260828_230848_3ca5edb3-929c-4fef-ae4d-5bc699062bca",
 14:"20260828_230803_5c1eec64-48a4-4179-9cdc-e243ae9e3aba",
 15:"20260828_230803_d555ca97-8623-4a81-a964-3964e3689184",
 16:"20260828_231509_746e0d8c-0d5e-491b-ba79-a2379b222b5f",
 19:"20260828_230803_8cdb2ab2-84e9-4c3d-a699-ff6d301c5943",
 23:"20260828_230803_9c31c352-daf4-4914-b35d-6b155f51f8e1",
 29:"20260828_230848_ab8e2688-a584-4abe-aafb-aed0ea2763dc",
 30:"20260828_231509_5e3ec4c4-feba-476b-91a1-66a1d5511125",
 32:"20260828_230848_e12a26af-e05f-40a5-9f45-9f45d51bf314",
 35:"20260828_230930_6ef88c81-aea1-47f7-91ca-23716a4525fb",
 38:"20260828_233753_6ca6b04f-139c-46b8-a5cf-ec7348f6a03b",
 39:"20260828_230242_528f9b71-6103-4723-bb1a-57ede188779b",
 40:"20260828_230306_653526d2-7088-46f0-8c7e-92f5097a7a37",
 41:"20260828_230315_0ea47578-88d7-4106-9cad-753fdb1e1326",
 42:"20260828_230848_a97ed3a3-84b5-4e4c-ae20-368af34a8260",
 43:"20260828_233753_38532820-7b1b-482c-848e-46a6d42fd7f6",
 44:"20260828_230930_12fef9e3-ef73-4260-a3ef-cfbf1b7f706a",
 45:"20260828_230930_f753e251-1e55-4c7f-a015-5d53fc55d42d",
 46:"20260828_230848_ef63a6fa-2dd2-4fa4-aee1-05b59d079cf3",
 47:"20260828_230848_3fce5295-a8ff-4a14-b6fb-36d4127dc8b9",
 52:"20260828_230849_9b8e69a4-4b7c-437f-ab64-fabf674510e6",
 53:"20260828_231025_513bb532-1565-4194-952b-789005fbdd51",
 54:"20260828_230930_65a55011-899e-49a3-a43b-98732283824f",
 55:"20260828_230930_e37a48cf-7215-4b63-95f3-e35fdea19846",
 56:"20260828_230930_91f5f6b7-c271-4070-bec0-f632ccd5384f",
 57:"20260828_230930_36310d72-7aea-4b11-8f42-bd2aa6c3ad19",
 59:"20260828_230930_b674f1bf-3d0d-4012-a893-e262c57286e5",
 60:"20260828_230930_c5904aae-d534-403c-9453-b2084d3ea840",
 61:"20260828_230930_a1dc46a3-0adc-4e0a-a504-d827eecce1f1",
 62:"20260828_230944_f756c20f-8fa2-47d8-a820-7380d93ec245",
}
# n, dur, kind, asset, vo
S = [
(1,4,"clip",None,None),(2,3,"clip",None,None),(3,4,"clip",None,None),(4,5,"clip",None,None),
(5,4,"title",None,None),
(6,6,"clip",None,1),
(7,2.5,"q1",None,None),
(8,10.1,"clip",None,None),
(9,3,"clip",None,None),(10,3,"clip",None,None),(11,4,"clip",None,None),
(12,4,"dolly","smile",None),
(13,4,"clip",None,None),(14,4,"clip",None,None),(15,3,"clip",None,None),
(16,15,"clip",None,2),
(17,2.5,"q2",None,None),
(18,4,"dolly","bed",None),
(19,3,"clip",None,None),
(20,3,"dolly","screen",None),(21,4,"dolly","back",None),(22,4,"dolly","empty",None),
(23,3,"clip",None,None),
(24,3,"dolly","cave04",None),
(25,3,"dolly","mag1",None),(26,3,"dolly","mag2",None),(27,3,"dolly","mag3",None),
(28,3,"dolly","doorin",None),
(29,3,"clip",None,None),
(30,13,"clip",None,3),
(31,2.5,"q3",None,None),
(32,3,"clip",None,None),
(33,3,"dolly","block",None),(34,4,"dolly","eyes",None),
(35,3,"clip",None,None),
(36,4,"dolly","knuck",None),(37,3,"dolly","cave05",None),
(38,5,"clip",None,None),
(39,4,"clip",None,None),(40,4,"clip",None,None),(41,8,"clip",None,None),(42,4,"clip",None,None),
(43,10,"clip",None,4),
(44,3,"clip",None,5),(45,3,"clip",None,None),(46,3,"clip",None,None),(47,3,"clip",None,None),
(48,1.5,"burst","smile",None),(49,1.5,"burst","empty",None),
(50,1.5,"burst","eyes",None),(51,1.5,"burst","cave07",None),
(52,9,"clip",None,None),
(53,13,"clip",None,6),
(54,4,"clip",None,None),(55,4,"clip",None,None),(56,4,"clip",None,None),(57,3,"clip",None,None),
(58,3,"dolly","cave08",None),
(59,4,"clip",None,None),(60,5,"clip",None,None),(61,6,"clip",None,None),(62,5,"clip",None,None),
(63,3,"card",None,None),
]

W, H = 1920, 1080
G = (113, 247, 60)
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
def f(p, s): return ImageFont.truetype(p, s)
def he(d, xy, t, fo, fill, anchor="ma"):
    d.text(xy, t, font=fo, fill=fill, direction="rtl", language="he", anchor=anchor)

QUOTES = {
 "q1": ("I.  THE RESCUER", "“If they stop needing me,", "I stop existing.”"),
 "q2": ("II.  THE VICTIM", "“I decided, a long time ago,", "that I can’t.”"),
 "q3": ("III.  THE PERSECUTOR", "“I am not attacking.", "I am defending myself.”"),
}
for k, stem in A.items():
    p = "a_%s.png" % k
    if not os.path.exists(p):
        urllib.request.urlretrieve(B + stem + ".png", p)

tot = sum(x[1] for x in S); cum = 0.0
marks = []; plan = []
for n, dur, kind, asset, vo in S:
    if vo: marks.append((vo, cum))
    if kind in ("title", "q1", "q2", "q3", "card"):
        base = Image.new("RGB", (W, H), (6, 6, 6)); d2 = ImageDraw.Draw(base)
        if kind == "title":
            d2.text((960, 430), "THE RESCUER", font=f(FB, 96), fill=(240,240,240), anchor="ma")
            d2.text((960, 545), "SYNDROME", font=f(FB, 96), fill=(240,240,240), anchor="ma")
            he(d2, (960, 690), u"תסמונת המושיע", f(FR, 42), G)
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
        base.save("o%02d.png" % n); plan.append((n, dur, "card", ""))
    elif kind == "clip":
        plan.append((n, dur, "clip", B + C[n] + ".mp4"))
    else:
        im2 = Image.open("a_%s.png" % asset).convert("RGB")
        r = max(W / im2.width, H / im2.height)
        im2 = im2.resize((int(im2.width*r+.5), int(im2.height*r+.5)), Image.LANCZOS)
        l = (im2.width - W)//2; t = (im2.height - H)//2
        base = im2.crop((l, t, l+W, t+H))
        if kind == "burst":
            base = base.crop((160, 90, W-160, H-90)).resize((W, H), Image.LANCZOS)
        base.save("o%02d.png" % n)
        plan.append((n, dur, "burst" if kind == "burst" else "dolly", ""))
    cum += dur

open("plan.txt","w").write("".join("%d %.2f %s %s\n" % p for p in plan))
open("marks.txt","w").write("".join("%d %d\n" % (v, round(t*1000)) for v, t in marks))
print("shots %d total %.2f = %d:%02d" % (len(S), tot, tot//60, tot%60))
print("clips %d dolly %d cards %d" % (sum(1 for p in plan if p[2]=="clip"),
      sum(1 for p in plan if p[2] in ("dolly","burst")), sum(1 for p in plan if p[2]=="card")))
print("marks", [(v, round(t,1)) for v, t in marks])

# ---------- subtitles, timed with faster-whisper on the actual narration ----------
from faster_whisper import WhisperModel
M = WhisperModel("base.en", device="cpu", compute_type="int8")
def ts(x):
    h = int(x//3600); m = int((x%3600)//60); s = x%60
    return "%02d:%02d:%06.3f" % (h, m, s).replace(".", ",") if False else "%02d:%02d:%02d,%03d" % (h, m, int(s), round((s-int(s))*1000))
cues = []
for v, t0 in marks:
    segs, _ = M.transcribe("vo%d.wav" % v, word_timestamps=False, vad_filter=False)
    for sg in segs:
        txt = sg.text.strip()
        if txt:
            cues.append((t0 + sg.start, t0 + sg.end, txt))
cues.sort()
with open("subs.srt", "w", encoding="utf-8") as fh:
    for i, (a_, b_, t) in enumerate(cues, 1):
        fh.write("%d\n%s --> %s\n%s\n\n" % (i, ts(a_), ts(b_), t))
print("subtitle cues:", len(cues))
