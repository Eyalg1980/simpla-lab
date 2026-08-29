# -*- coding: utf-8 -*-
# THE RESCUER SYNDROME / v7  -- Hebrew narration, tightened, new bullet time + room reveal
import os, urllib.request
from PIL import Image, ImageDraw, ImageFont

B = "https://d8j0ntlcm91z4.cloudfront.net/user_348jNuehm4zmcU1si73jLXDcXDZ/hf_"

# ---- stills (dolly / flash) --------------------------------------------------
A = {
 "cave04":"20260828_184139_00ba8f25-ec93-42b9-a27a-3469073679fc",
 "cave05":"20260828_184140_12dc5a89-ea13-4d47-a944-197d67dbe636",
 "cave07":"20260828_183616_50afe60a-f965-4387-acaf-5e495683c968",
 "cave08":"20260828_184139_52ae0376-0fbf-43fb-9846-9429a90d5268",
 "smile":"20260828_202509_2d9c8e6c-07cb-41d6-909f-710e537595ac",
 "empty":"20260828_202509_8683f183-95a5-42db-b5f6-c429d458fcba",
 "eyes":"20260828_202544_e790d35a-49a2-4161-90ad-490724d97084",
 "knuck":"20260828_202544_eb017d03-2695-4076-831d-66c6483d3035",
 "mag1":"20260828_222831_229f8d60-c01f-49bd-b3ed-b2cf817643ba",
 "mag2":"20260828_222831_a3d5137a-0aa3-4218-a55b-4758bbaf9c03",
 "mag3":"20260828_222831_f4eea5ca-6b12-468c-9163-9dcd63bd5307",
}

# ---- clips, keyed by their v6 shot number so the table stays readable --------
C = {
 1:"20260828_230804_0876d505-1ae7-40f8-a5a7-8af0fd005ad2",
 2:"20260828_230803_5d133708-3bad-4a26-9101-9549b35fe4ad",
 3:"20260828_230803_446b5f0d-0484-4a91-97e1-db4c38b797ba",
 4:"20260828_230803_9019a833-b991-47cb-910f-a326c8db1582",
 8:"20260828_223225_f9d05bc9-78c1-42fe-9a8b-81de58b7b676",
 9:"20260828_230804_273c71f9-f836-4871-ab9e-25813b822f8f",
 10:"20260828_230849_989249d4-74a3-4951-b1f6-110338c7c668",
 11:"20260828_230804_151bd1ef-6566-49e8-a52b-789239805cb9",
 13:"20260828_230848_3ca5edb3-929c-4fef-ae4d-5bc699062bca",
 15:"20260828_230803_d555ca97-8623-4a81-a964-3964e3689184",
 19:"20260828_230803_8cdb2ab2-84e9-4c3d-a699-ff6d301c5943",
 21:"20260828_230803_9c31c352-daf4-4914-b35d-6b155f51f8e1",  # back turned, hoodie
 22:"20260828_230848_ab8e2688-a584-4abe-aafb-aed0ea2763dc",  # face, hoodie
 23:"20260828_230848_e12a26af-e05f-40a5-9f45-9f45d51bf314",  # hands in lap
 29:"20260828_230930_6ef88c81-aea1-47f7-91ca-23716a4525fb",  # pulling hood up
 33:"20260828_230242_528f9b71-6103-4723-bb1a-57ede188779b",
 34:"20260828_230306_653526d2-7088-46f0-8c7e-92f5097a7a37",
 35:"20260828_230315_0ea47578-88d7-4106-9cad-753fdb1e1326",
 38:"20260828_233753_6ca6b04f-139c-46b8-a5cf-ec7348f6a03b",
 40:"20260828_230930_12fef9e3-ef73-4260-a3ef-cfbf1b7f706a",  # glass spinning
 42:"20260828_230848_a97ed3a3-84b5-4e4c-ae20-368af34a8260",
 44:"20260828_230930_f753e251-1e55-4c7f-a015-5d53fc55d42d",
 45:"20260828_230848_ef63a6fa-2dd2-4fa4-aee1-05b59d079cf3",
 46:"20260828_230848_3fce5295-a8ff-4a14-b6fb-36d4127dc8b9",
 47:"20260828_230849_9b8e69a4-4b7c-437f-ab64-fabf674510e6",
 52:"20260828_230930_65a55011-899e-49a3-a43b-98732283824f",
 57:"20260828_230930_36310d72-7aea-4b11-8f42-bd2aa6c3ad19",  # the real smile
 59:"20260828_230930_b674f1bf-3d0d-4012-a893-e262c57286e5",
 60:"20260828_230930_c5904aae-d534-403c-9453-b2084d3ea840",
 61:"20260828_230930_a1dc46a3-0adc-4e0a-a504-d827eecce1f1",  # hand within a hand
 62:"20260828_230944_f756c20f-8fa2-47d8-a820-7380d93ec245",
}

# ---- new material generated for v7 ------------------------------------------
N = {
 "room":"20260829_055935_dc30d3a7-3723-49a0-83b8-eb9b1b1cf106",   # pull back + rotate reveal
 "throw":"20260829_055935_4ee06eae-5d44-4bd5-bce3-25f830945083",  # arm above the head
 "orbit":"20260829_061423_c5b64d2b-d0ca-4060-89f8-faa2bbb9733f",  # bullet time, victim revealed
}
# Hebrew narration, elevenlabs / Arthur
HE = {
 1:"20260829_062549_3f974055-5a8d-43a0-a9e9-1c536ae0ab6f",
 2:"20260829_062548_42ad5d39-0f0c-4308-8966-579c82df765c",
 3:"20260829_062548_764a69e5-82f7-4387-a9e5-3dd9f096d88f",
 4:"20260829_062548_c2fa46e6-d4fc-47bd-8069-26c9713b98e8",
 5:"20260829_062548_c3d7022f-4c9d-470f-a59c-4653249e10ba",
 6:"20260829_062548_f8befee9-fee0-4fd9-bdfd-4624d54e405d",
}
# Hebrew lip sync, wan2.7
L = {
 6:"20260829_063001_a9c9ee2a-2209-40ac-b82e-37a882908d78",
 16:"20260829_063001_e89c412a-05cc-4af3-b281-5a864e09fef7",
 30:"20260829_063001_cf181ef6-254a-4475-b50b-7fe62f1d77e1",
 43:"20260829_063001_1f08183c-b767-4216-852e-c87c85dc0aa9",
 53:"20260829_063001_2aa4b1fe-c097-4b25-9fbe-c35fd1d88a85",
}

# ---- the cut -----------------------------------------------------------------
# (dur, kind, ref, vo, in_point)
S = [
 # prologue, the cave
 (3.0,"clip",1,None,0),(2.5,"clip",2,None,0),(3.0,"clip",3,None,0),(3.5,"clip",4,None,0),
 (4.0,"title",None,None,0),
 # vo1
 (6.0,"lip",6,1,0),
 (2.5,"q1",None,None,0),
 (8.0,"clip",8,None,0),                                   # EARTH ZOOM
 # I. the rescuer, fast
 (2.2,"clip",9,None,0),(1.8,"clip",10,None,0),(1.8,"clip",11,None,0),
 (2.6,"dolly","smile",None,0),
 (1.8,"clip",13,None,0),(2.2,"clip",15,None,0),
 # vo2
 (12.0,"lip",16,2,0),
 (2.5,"q2",None,None,0),
 # II. the victim, fast cuts with the collage woven in and then bursting
 (2.0,"clip",19,None,0),
 (0.4,"flash","mag1",None,0),
 (1.8,"clip",21,None,0),
 (0.4,"flash","mag2",None,0),
 (2.0,"clip",22,None,0),
 (0.4,"flash","mag3",None,0),
 (2.4,"clip",23,None,0),
 (0.4,"flash","mag1",None,0),
 (1.8,"dolly","cave04",None,0),
 (0.4,"flash","mag2",None,0),
 (0.9,"flash","mag1",None,0),(0.9,"flash","mag2",None,0),(0.9,"flash","mag3",None,0),
 (2.0,"clip",29,None,0),
 # vo3
 (9.0,"lip",30,3,0),
 (2.5,"q3",None,None,0),
 # III. the persecutor, fast then the bullet time slows everything down
 (1.8,"clip",33,None,0),(2.0,"clip",34,None,0),(1.8,"clip",35,None,0),
 (1.8,"dolly","knuck",None,0),(1.6,"dolly","cave05",None,0),
 (2.2,"clip",38,None,0),
 (5.0,"clip","throw",None,0),                             # arm above the head, slow motion
 (3.0,"clip",40,None,0),                                  # the glass alone in the air
 (5.5,"clip","orbit",None,4.4),                           # orbit, the victim comes around
 (2.6,"clip",42,None,0),
 # vo4
 (8.0,"lip",43,4,0),
 # vo5, the wheel, over cutaways. the one repeat that stayed
 (2.2,"clip",44,5,0),(2.0,"clip",45,None,0),(2.0,"clip",46,None,0),(2.0,"clip",47,None,0),
 (1.2,"flash","smile",None,0),(1.2,"flash","empty",None,0),
 (1.2,"flash","eyes",None,0),(1.2,"flash","cave07",None,0),
 (7.6,"slow",52,None,0),   # 4s of cave stretched: the deceleration after the burst
 # vo6
 (10.0,"lip",53,6,0),
 # the meeting, and the healing
 (8.0,"clip","room",None,0),                              # pull back, rotate, the patient appears
 (3.0,"clip",57,None,0),
 (3.0,"dolly","cave08",None,0),
 (3.5,"clip",59,None,0),(3.0,"clip",60,None,0),
 (5.0,"clip",61,None,0),                                  # the hand within a hand
 (4.5,"clip",62,None,0),
 (3.5,"card",None,None,0),
 (4.5,"dedic",None,None,0),
]
VO_DELAY = {5: 1.0}   # vo5 starts a beat after its shot so it cannot collide with vo4

W, H = 1920, 1080
G = (113, 247, 60)
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
def f(p, s): return ImageFont.truetype(p, s)
def he(d, xy, t, fo, fill, anchor="ma"):
    d.text(xy, t, font=fo, fill=fill, direction="rtl", language="he", anchor=anchor)

# --- Hebrew shaping gate. Pillow here is built with libraqm and applies bidi
#     itself, so the logical string goes in untouched. Prove the order before
#     we encode anything: in "או" the wide alef must sit on the RIGHT.
def assert_rtl():
    im = Image.new("L", (300, 120), 0)
    ImageDraw.Draw(im).text((20, 20), u"או", font=f(FR, 72), fill=255,
                            direction="rtl", language="he")
    cols = [sum(im.getpixel((x, y)) for y in range(120)) for x in range(300)]
    runs, cur = [], None
    for x, v in enumerate(cols):
        if v > 0 and cur is None: cur = x
        elif v == 0 and cur is not None: runs.append((cur, x)); cur = None
    if cur is not None: runs.append((cur, 300))
    assert len(runs) == 2, "expected two glyph clusters, got %r" % (runs,)
    left, right = runs
    wl, wr = left[1]-left[0], right[1]-right[0]
    assert wr > wl * 1.4, "alef is not on the right: left=%d right=%d" % (wl, wr)
    return wl, wr
print("rtl gate ok, vav=%d alef=%d" % assert_rtl())

QUOTES = {
 "q1": ("I.  THE RESCUER", u"“If they stop needing me,", u"I stop existing.”"),
 "q2": ("II.  THE VICTIM", u"“I decided, a long time ago,", u"that I can’t.”"),
 "q3": ("III.  THE PERSECUTOR", u"“I am not attacking.", u"I am defending myself.”"),
}

for k, stem in A.items():
    p = "a_%s.png" % k
    if not os.path.exists(p):
        urllib.request.urlretrieve(B + stem + ".png", p)

def url_for(ref):
    if isinstance(ref, str): return B + N[ref] + ".mp4"
    return B + C[ref] + ".mp4"

cum = 0.0
marks, plan = [], []
for i, (dur, kind, ref, vo, ss) in enumerate(S, 1):
    if vo: marks.append((vo, cum + VO_DELAY.get(vo, 0.0)))
    if kind in ("title", "q1", "q2", "q3", "card", "dedic"):
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
            for j, (t, c) in enumerate(rows):
                d2.text((960, 330 + j * 74), t, font=f(FR, 44), fill=c, anchor="ma")
            d2.line([(760, 680), (1160, 680)], fill=(70,70,70), width=2)
            d2.text((960, 720), "THE RESCUER SYNDROME", font=f(FB, 34), fill=(180,180,180), anchor="ma")
        elif kind == "dedic":
            he(d2, (960, 360), u"מוקדש", f(FR, 34), G)
            he(d2, (960, 440), u"לרפיק ידידה", f(FB, 84), (240,240,240))
            he(d2, (960, 580), u"המטפל שלי", f(FR, 46), (200,200,200))
            d2.line([(790, 700), (1130, 700)], fill=(70,70,70), width=2)
            d2.text((960, 740), "FOR RAFIK YEDIDIA, MY THERAPIST", font=f(FR, 28), fill=(150,150,150), anchor="ma")
        else:
            head, l1, l2 = QUOTES[kind]
            d2.text((960, 380), head, font=f(FB, 30), fill=G, anchor="ma")
            d2.text((960, 480), l1, font=f(FR, 56), fill=(238,238,238), anchor="ma")
            d2.text((960, 560), l2, font=f(FR, 56), fill=(238,238,238), anchor="ma")
        base.save("o%02d.png" % i); plan.append((i, dur, "card", "-", 0))
    elif kind in ("clip", "slow"):
        plan.append((i, dur, kind, url_for(ref), ss))
    elif kind == "lip":
        plan.append((i, dur, "clip", B + L[ref] + ".mp4", ss))
    else:                                    # dolly / flash, both from a still
        im2 = Image.open("a_%s.png" % ref).convert("RGB")
        r = max(W / im2.width, H / im2.height)
        im2 = im2.resize((int(im2.width*r+.5), int(im2.height*r+.5)), Image.LANCZOS)
        l = (im2.width - W)//2; t = (im2.height - H)//2
        base = im2.crop((l, t, l+W, t+H))
        if kind == "flash":                  # punched in a little so a 0.4s flash reads
            base = base.crop((150, 84, W-150, H-84)).resize((W, H), Image.LANCZOS)
        base.save("o%02d.png" % i)
        plan.append((i, dur, kind, "-", 0))
    cum += dur

open("plan.txt","w").write("".join("%d %.2f %s %s %.2f\n" % p for p in plan))
open("marks.txt","w").write("".join("%d %d\n" % (v, round(t*1000)) for v, t in marks))
tot = cum
print("shots %d  total %.2f = %d:%02d" % (len(S), tot, tot//60, tot%60))
print("clips %d  slow %d  dolly %d  flash %d  cards %d" % (
    sum(1 for p in plan if p[2]=="clip"), sum(1 for p in plan if p[2]=="slow"),
    sum(1 for p in plan if p[2]=="dolly"),
    sum(1 for p in plan if p[2]=="flash"), sum(1 for p in plan if p[2]=="card")))
print("marks", [(v, round(t,2)) for v, t in marks])

# ---------- English subtitles ------------------------------------------------
# The TIMING comes from whisper run on the Hebrew narration itself, so no cue is
# hand-timed. The TEXT is the film's own English, because whisper's speech
# translation renders המושיע as "Moses" and הקורבן as "sacrifice" and is unusable.
ENG = {
 1: ["There are three roles.",
     "The rescuer. The victim. The persecutor.",
     "And each one is certain he is only one of them."],
 2: ["The rescuer looks like the best person in the room.",
     "He isn't.",
     "He just doesn't know who he is when nobody needs him.",
     "So without meaning to, he makes sure they always need him.",
     "He grew up in a house that praised him for what he did,",
     "never for what he was."],
 3: ["The victim is not a weak person.",
     "The victim decided, a long time ago, that he cannot.",
     "And that is a decision, not a fact.",
     "He is looking for a rescuer. He always finds one."],
 4: ["And the persecutor is certain that he is the victim. Always.",
     "He is only defending himself.",
     "In his world, only the hard ones survive."],
 5: ["And here is the part that is hard to accept.",
     "All three of them are the same person.",
     "The rescuer gets tired and turns into the persecutor.",
     "The persecutor gets caught and turns into the victim.",
     "And the victim has had enough, and starts to attack.",
     "It is not a triangle.",
     "It is a wheel."],
 6: ["You cannot leave this quietly.",
     "The moment you stop rescuing,",
     "you look to them exactly like the persecutor.",
     "And that is the price.",
     "Whoever gets out, gets out alone."],
}
from faster_whisper import WhisperModel
M = WhisperModel("small", device="cpu", compute_type="int8")
def ts(x):
    h = int(x//3600); m = int((x%3600)//60); s = x%60
    return "%02d:%02d:%02d,%03d" % (h, m, int(s), round((s-int(s))*1000))
cues = []
for v, t0 in marks:
    segs, _ = M.transcribe("hv%d.wav" % v, language="he", vad_filter=False)
    spans = [(s.start, s.end) for s in segs if s.text.strip()]
    txts = ENG[v]
    if len(spans) == len(txts):
        pairs = list(zip(spans, txts))                 # one cue per spoken segment
        how = "1:1"
    else:                                              # spread evenly over the block
        a, b = spans[0][0], spans[-1][1]
        step = (b - a) / len(txts)
        pairs = [((a + j*step, a + (j+1)*step), t) for j, t in enumerate(txts)]
        how = "spread %d segs -> %d cues" % (len(spans), len(txts))
    print("  vo%d %s" % (v, how))
    for (s0, s1), t in pairs:
        cues.append((t0 + s0, t0 + s1, t))
cues.sort()
# no cue may sit on top of the next one
for j in range(len(cues) - 1):
    if cues[j][1] > cues[j+1][0]:
        cues[j] = (cues[j][0], cues[j+1][0] - 0.02, cues[j][2])
with open("subs.srt", "w", encoding="utf-8") as fh:
    for i, (a_, b_, t) in enumerate(cues, 1):
        fh.write("%d\n%s --> %s\n%s\n\n" % (i, ts(a_), ts(b_), t))
print("subtitle cues:", len(cues))
for c in cues: print("  %6.2f  %s" % (c[0], c[2]))
