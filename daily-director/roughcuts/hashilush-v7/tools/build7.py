# -*- coding: utf-8 -*-
# THE RESCUER SYNDROME / v7  -- Hebrew narration, tightened, new bullet time + room reveal
import os, urllib.request
from PIL import Image, ImageDraw, ImageFont

B = "https://d8j0ntlcm91z4.cloudfront.net/user_348jNuehm4zmcU1si73jLXDcXDZ/hf_"

# ---- stills (dolly / flash) --------------------------------------------------
A = {
 # every cave still RELIT 29.8: the flashlight beam replaced by open flame,
 # regenerated from the old frame itself so only the light changed
 "smile":"20260828_202509_2d9c8e6c-07cb-41d6-909f-710e537595ac",
 "back":"20260828_202509_7cd08410-83fe-4f0d-a963-26523208005b",   # back turned, hoodie
 "empty":"20260828_202509_8683f183-95a5-42db-b5f6-c429d458fcba",  # face, hoodie
 "block":"20260828_202544_0095804c-0a7c-41bb-aad7-e3b5f57f5c0a",  # in the doorway
 "eyes":"20260828_202544_e790d35a-49a2-4161-90ad-490724d97084",
 "knuck":"20260828_202544_eb017d03-2695-4076-831d-66c6483d3035",
 # THE FOURTH LANGUAGE, added 29.8: "the frequency of love".
 # A flat hand-painted cut-out man standing inside the SAME photographed rooms
 # as the filmed man, painted in the SAME ochre as the cave. He is not a new
 # character: he is this man without his roles, and the film never remarks on him.
 "lv_hand":"20260829_101109_3c883e2d-ceca-45bb-97b2-44392d832d39",   # an open hand laid on a shoulder
 "lv_stand":"20260829_101109_69600d22-b602-416d-be84-3609adf1949f",  # standing upright, hands loose
 "lv_hug":"20260829_101413_89917eaa-e394-43a6-b552-057d18e96385",    # two men holding each other in a doorway
 "lv_sofa":"20260829_101109_9077af12-cfa9-4d0f-a521-9cac568a4fc4",   # side by side, facing the same way
 "lv_both":"20260829_101109_e09f894c-e2fa-47aa-bda4-ad9408b3a7b7",   # the filmed man and the painted man, one frame
 "lv_laugh":"20260829_101413_2009b160-2bad-490f-9873-226bee504fe9",  # laughing at the table
 "lv_wall":"20260829_101413_866cb34d-66ed-4861-8b95-e7f47f376b2a",   # his palm beside the ochre handprint
}

# ---- clips, keyed by their v6 shot number, copied verbatim from build6.py.
# The key IS the v6 shot number; the comment is what that shot shows. Never
# re-key one of these by description -- that put a deleted shot back into the
# cut once already.
# Every CAVE clip here was regenerated 29.8 from a relit frame: open flame
# instead of a flashlight beam. The keys stay the v6 shot numbers.
C = {
 1:"20260829_082536_e527c07a-b676-4b25-9bdc-58766d8e9125",   # torch on the painting
 2:"20260829_082556_523810e5-1301-4557-85ab-6c15e24ffb68",   # pigment bowl
 3:"20260829_082535_4524c368-b2f1-4490-bb17-4ea98961fb6a",   # hand drawing on the wall
 4:"20260829_082555_0c3eee58-86a0-4f52-8781-faeae176f677",   # three figures, wide
 8:"20260828_223225_f9d05bc9-78c1-42fe-9a8b-81de58b7b676",   # EARTH ZOOM
 9:"20260828_230804_273c71f9-f836-4871-ab9e-25813b822f8f",   # pouring two coffees
 10:"20260828_230849_989249d4-74a3-4951-b1f6-110338c7c668",  # phone at night
 11:"20260828_230804_151bd1ef-6566-49e8-a52b-789239805cb9",  # fixing the wall
 13:"20260828_230848_3ca5edb3-929c-4fef-ae4d-5bc699062bca",  # doorway at night
 15:"20260829_082555_0ce0df82-74b1-49bb-9fbf-f78bd52a1ab3",  # cave, red figures
 19:"20260828_230803_8cdb2ab2-84e9-4c3d-a699-ff6d301c5943",  # leaning on the tool
 23:"20260828_230803_9c31c352-daf4-4914-b35d-6b155f51f8e1",  # hands in the lap
 29:"20260828_230848_ab8e2688-a584-4abe-aafb-aed0ea2763dc",  # pulling the hood up
 35:"20260828_230930_6ef88c81-aea1-47f7-91ca-23716a4525fb",  # corridor, walking away
 38:"20260828_233753_6ca6b04f-139c-46b8-a5cf-ec7348f6a03b",  # face lit low
 40:"20260828_230306_653526d2-7088-46f0-8c7e-92f5097a7a37",  # the glass alone in the air
 42:"20260828_230848_a97ed3a3-84b5-4e4c-ae20-368af34a8260",  # hunched on the chair
 44:"20260828_230930_12fef9e3-ef73-4260-a3ef-cfbf1b7f706a",  # the grip between two hands
 45:"20260828_230930_f753e251-1e55-4c7f-a015-5d53fc55d42d",  # back, orange, the alley
 46:"20260828_230848_ef63a6fa-2dd2-4fa4-aee1-05b59d079cf3",  # the alley, lamps
 47:"20260828_230848_3fce5295-a8ff-4a14-b6fb-36d4127dc8b9",  # hand on the glass
 52:"20260829_082556_f8f5a60f-93a7-40eb-aced-fbd556010d4d",  # cave wide, three figures
 57:"20260828_230930_36310d72-7aea-4b11-8f42-bd2aa6c3ad19",  # the real smile
 59:"20260829_082535_df9d9562-00a2-4825-be9e-999123f27a53",  # drawing in the cave
 60:"20260829_082556_f33ec4c4-3b85-49f7-9b18-cdd3b13fff0f",  # cave figures
 61:"20260829_082556_df5a1293-bc5a-485d-bcb3-44e799277d8d",  # the hand within a hand
 62:"20260829_082536_c4fc580b-78f6-4b2b-a469-7e200add6f7b",  # the torch
}
# v6 shots deliberately absent, and why. Anything listed here must never appear
# in C or A again.
DROPPED = {
 14:"the fist gripping the shoulder", 18:"sitting on the bed",
 20:"the hand holding the blank phone", 28:"the door from inside",
 32:"the door latch", 55:"the illustrated meeting", 56:"the hug",
 39:"the old glass release, replaced by 'throw'",
 41:"the old bullet time, replaced by 'orbit'",
 54:"the old meeting wide, replaced by 'room'",
}
assert not (set(C) & set(DROPPED)), "a dropped shot is back in C: %s" % (set(C) & set(DROPPED),)

# ---- new material generated for v7 ------------------------------------------
N = {
 "room":"20260829_082536_bf01248a-17e6-4dab-a355-6668039df14d",   # pull back + rotate, patient is the lead
 # animated 29.8: the collage now moves as stop-motion, and the relit cave
 # stills now flicker, because a fire that does not move is a defect
 "mag1v":"20260829_092501_85dfde3a-bc89-43a4-a7b6-886ec8251bfc",
 "mag2v":"20260829_092501_41fd76d7-3699-4d3c-a6b3-45694a7ebb13",
 "mag3v":"20260829_092501_78a50459-6932-472a-901d-1c37714620ba",
 "cave04v":"20260829_092501_3816c537-3b5c-484c-b0f3-9ce464f12e3d",
 "cave05v":"20260829_092501_3909c7bc-7e56-41a8-9acb-3d5195e115a8",
 "cave07v":"20260829_092501_7756c659-aefb-49f9-bee1-fb4061d6594a",
 "cave08v":"20260829_092501_47215867-9383-411a-a4e6-d10848200a60",
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
 (3.2,"q1",None,None,0),
 (8.0,"clip",8,None,0),                                   # EARTH ZOOM
 # I. the rescuer, fast
 (2.2,"clip",9,None,0),(1.8,"clip",10,None,0),(1.8,"clip",11,None,0),
 (2.6,"dolly","smile",None,0),
 (1.0,"dolly","lv_hand",None,0),      # LOVE 1: the rescuer performs warmth, this is the real thing
 (1.8,"clip",13,None,0),(2.2,"clip",15,None,0),
 # vo2
 (12.0,"lip",16,2,0),
 (3.2,"q2",None,None,0),
 # II. the victim, fast cuts with the collage woven in and then bursting
 (2.0,"dolly","back",None,0),
 (0.4,"punch","mag1v",None,0.2),
 (1.8,"clip",23,None,0),
 (1.2,"dolly","lv_stand",None,0),     # LOVE 2: the victim says he cannot, and this man is standing
 (0.4,"punch","mag2v",None,0.2),
 (2.0,"dolly","empty",None,0),
 (0.4,"punch","mag3v",None,0.2),
 (2.4,"clip",19,None,0),
 (0.4,"punch","mag1v",None,1.6),
 (1.8,"clip","cave04v",None,0),
 (0.4,"punch","mag2v",None,1.6),
 (0.9,"punch","mag1v",None,2.8),(0.9,"punch","mag2v",None,2.8),(0.9,"punch","mag3v",None,2.6),
 (2.0,"clip",29,None,0),
 # vo3
 (9.0,"lip",30,3,0),
 (3.2,"q3",None,None,0),
 # III. the persecutor, fast then the bullet time slows everything down
 (1.8,"dolly","block",None,0),(2.0,"dolly","eyes",None,0),(1.8,"clip",35,None,0),
 (1.8,"dolly","knuck",None,0),(1.6,"clip","cave05v",None,0),
 (2.2,"clip",38,None,0),
 (1.0,"dolly","lv_hug",None,0),       # LOVE 3: one second before the glass, at maximum pressure
 (5.0,"clip","throw",None,0),                             # arm above the head, slow motion
 (3.0,"clip",40,None,0),                                  # the glass alone in the air
 (5.5,"clip","orbit",None,4.4),                           # orbit, the victim comes around
 (2.6,"clip",42,None,0),
 # vo4
 (8.0,"lip",43,4,0),
 # vo5, the wheel, over cutaways. the one repeat that stayed
 (2.2,"clip",44,5,0),(2.0,"clip",45,None,0),(2.0,"clip",46,None,0),(2.0,"clip",47,None,0),
 (1.2,"flash","smile",None,0),(1.2,"flash","empty",None,0),
 (1.2,"flash","eyes",None,0),(1.2,"punch","cave07v",None,0.4),
 (7.6,"clip",52,None,0),   # cave wide, held long: the deceleration after the burst
 (3.0,"dolly","lv_sofa",None,0),      # LOVE 4: the wheel has just closed. the first alternative the film offers
 # vo6
 (10.0,"lip",53,6,0),
 # the meeting, and the healing
 (8.0,"clip","room",None,0),                              # pull back, rotate, the patient appears
 (3.0,"clip",57,None,0),
 (4.0,"dolly","lv_both",None,0),      # LOVE 5: the payoff, both versions of him in one frame
 (2.5,"dolly","lv_laugh",None,0),
 (2.9,"clip","cave08v",None,0),
 (3.5,"clip",59,None,0),(3.0,"clip",60,None,0),
 (5.0,"clip",61,None,0),                                  # the hand within a hand
 (4.5,"clip",62,None,0),
 (4.5,"dolly","lv_wall",None,0),      # LOVE 6: the man and the painting are the same pigment
 (3.5,"card",None,None,0),
 (4.5,"dedic",None,None,0),
]
VO_DELAY = {5: 1.0}   # vo5 starts a beat after its shot so it cannot collide with vo4

# ---- sound design ------------------------------------------------------------
# Every cue is anchored to a SHOT INDEX, never to a hand-typed timecode, so the
# sound cannot drift when a duration changes. All of it is synthesised with sox.
# HARD RULE: nothing may be placed at or after the meeting (MEET_SHOT). The
# absolute silence of the last half minute is the film's strongest sound idea
# and adding anything to it would be a downgrade, so the build asserts it.
# Cues are anchored to WHAT A SHOT IS, never to its position, because inserting
# one shot used to move every cue after it silently. Each anchor is
# (kind, ref, which occurrence).
MEET_AT = ("clip", "room", 1)
SFX = [
 ("fire",  ("clip", 1, 1),          "the fire finds the wall in the opening"),
 ("fire",  ("clip", 15, 1),         "the cave beat that closes the rescuer"),
 ("fire",  ("clip", "cave04v", 1),  "the cave beat inside the collage weave"),
 ("fire",  ("clip", "cave05v", 1),  "the cave beat before the bullet time"),
 ("fire",  ("punch", "cave07v", 1), "the cave that ends the wheel"),
 ("sting", ("q1", None, 1),         "sub drop under THE RESCUER"),
 ("sting", ("q2", None, 1),         "sub drop under THE VICTIM"),
 ("sting", ("q3", None, 1),         "sub drop under THE PERSECUTOR"),
 ("rip",   ("punch", "mag1v", 1), ""), ("rip", ("punch", "mag2v", 1), ""),
 ("rip",   ("punch", "mag3v", 1), ""), ("rip", ("punch", "mag1v", 2), ""),
 ("rip",   ("punch", "mag2v", 2), ""), ("rip", ("punch", "mag1v", 3), ""),
 ("rip",   ("punch", "mag2v", 3), ""), ("rip", ("punch", "mag3v", 2), ""),
 ("pulse", ("dolly", "block", 1),   "a slow low pulse under the persecutor, felt not heard"),
 ("riser", ("clip", 38, 1),         "the rise into the throw"),
 ("wind",  ("clip", 8, 1),          "under the earth zoom"),
 ("shat",  ("clip", "orbit", 1),    "the glass on the wall"),
]

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
 "q1": ("I", u"המושיע", "THE RESCUER", u"“If they stop needing me,", u"I stop existing.”"),
 "q2": ("II", u"הקורבן", "THE VICTIM", u"“I decided, a long time ago,", u"that I can’t.”"),
 "q3": ("III", u"התוקפן", "THE PERSECUTOR", u"“I am not attacking.", u"I am defending myself.”"),
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
            num, he_title, en_title, l1, l2 = QUOTES[kind]
            d2.text((960, 232), num, font=f(FB, 30), fill=G, anchor="ma")
            he(d2, (960, 288), he_title, f(FB, 104), (245,245,245))       # the chapter title
            d2.text((960, 452), en_title, font=f(FB, 32), fill=G, anchor="ma")
            d2.line([(810, 536), (1110, 536)], fill=(70,70,70), width=2)
            d2.text((960, 594), l1, font=f(FR, 50), fill=(214,214,214), anchor="ma")
            d2.text((960, 664), l2, font=f(FR, 50), fill=(214,214,214), anchor="ma")
        base.save("o%02d.png" % i); plan.append((i, dur, "card", "-", 0))
    elif kind in ("clip", "slow", "punch"):
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

# shot start times, so every sound cue is derived and never typed
starts = []
t = 0.0
for dur, *_ in S:
    starts.append(t); t += dur
def find(anchor):
    kind, ref, nth = anchor
    seen = 0
    for i, (d, k, r, vo, ss) in enumerate(S):
        if k == kind and r == ref:
            seen += 1
            if seen == nth: return i
    raise SystemExit("sound anchor not found: %r" % (anchor,))
meet_t = starts[find(MEET_AT)]
sfx = []
for name, anchor, _why in SFX:
    at = starts[find(anchor)]
    assert at < meet_t - 0.01, "%s at %r lands in the silent ending" % (name, anchor)
    sfx.append((name, at))
open("sfx.txt","w").write("".join("%s %.3f\n" % x for x in sfx))
print("sfx cues %d, last at %.1fs, silence begins %.1fs" % (len(sfx), max(a for _, a in sfx), meet_t))

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
