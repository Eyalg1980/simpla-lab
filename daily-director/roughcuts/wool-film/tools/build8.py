# -*- coding: utf-8 -*-
# THE RESCUER SYNDROME / WOOL. A parallel version of the same film in one visual
# language: 1970s Kodachrome portraits of one man wearing his three roles as
# hand-knitted wool. Same script, same voice, same silence at the end.
#
# The one structural difference from the main cut, and it is the whole idea:
# THERE IS NO INTERVIEW HERE. The narration is disembodied, a voice over
# photographs, so there is no therapist on screen and no lip sync anywhere. That
# removes the film's most fragile element and lets the pictures be portraits.
import os, sys, urllib.request
from PIL import Image, ImageDraw, ImageFont

B = "https://d8j0ntlcm91z4.cloudfront.net/user_348jNuehm4zmcU1si73jLXDcXDZ/hf_"
W, H = 1920, 1080

# ---- narration. Identical files to the main cut, so the two versions are the
# same script in two languages of picture.
HE = {
 1:"20260829_062549_3f974055-5a8d-43a0-a9e9-1c536ae0ab6f",
 2:"20260910_000959_0a0910a8-6492-4c22-bf47-279f0311525b",
 3:"20260910_001001_5300c0af-79e8-4491-985c-f8829e9c6d01",
 4:"20260910_000959_886a02e6-457d-47c4-9d7b-a1190d03ff4b",
 5:"20260910_001025_3788c9f1-d22d-46ab-bd96-1d9ec55b1586",
 6:"20260910_001000_5f69ce62-cef7-4cc6-9424-13fe647d85dd",
 7:"20260829_194605_a09fa10d-4e9f-4e93-9c49-976b110f4318",
}
open("he.txt","w").write("".join("%d hf_%s\n" % (k,v) for k,v in sorted(HE.items())))
if "--he" in sys.argv:
    raise SystemExit(0)

# ---- the wool material -------------------------------------------------------
V = {
 # the frame, opening and closing: the man before any role, and the role being
 # put on him and taken off him by hands that are not his
 "bare": "20260910_005253_159e0459-0950-41ed-8d73-64a4f9a3096a",
 "don": "20260910_005253_8a08817f-6863-4826-96b8-3e1db5bb020a",
 "doff": "20260910_005253_609a46ef-c809-449e-8166-9f9ffb5640d3",
 # the three portraits, from the first wool test
 "p_res": "20260909_204820_8e5c465d-9052-4eaf-8bb8-025c61a092c7",
 "p_vic": "20260909_204820_622a9d66-fcd3-4436-87ad-47a9d1509217",
 "p_per": "20260909_204820_5e5afc83-7417-4a15-8181-8521f8de2aa9",
 "trio":  "20260909_204820_57e5b93e-527e-4533-b237-42874ef7aeb8",
 # what each role does
 "res_tea": "20260910_005253_6033e35c-aa38-411a-aa97-ed8864b74e96",
 "res_hand": "20260910_005253_a15fdf9d-4aed-48ac-8eec-51ecf481ad83",
 "vic_room": "20260910_005253_eb9bb633-514c-472d-8aa5-5fd9c25a0fec",
 # the throw, from the second wool test. The eight second one is a single
 # unbroken Seedance take: throw, flight, impact, and the camera arcing round
 # the frozen shards to find the victim behind them.
 "door":  "20260909_211805_c908475c-bf6e-4d23-a6ca-405a149770ae",
 "wall":  "20260909_211805_7b3a1254-7cd4-4ffe-9471-da1f456f401b",
 "glass": "20260909_211805_7fa2abe6-9b03-4362-a675-8a98dd66f19b",
 "throw": "20260909_211819_4b586107-f770-4f0e-ab7c-9018fce8d86d",
 "after": "20260909_211805_948681fb-30fb-4454-bca7-c5a63ececc6b",
 # the wheel seen from above, turning
 "over": "20260910_005253_98a71d44-c348-4ed0-9cfb-516506fba8f1",
}

QUOTES = {
 "q1": ("I",   "THE RESCUER",    u"“If they stop needing me,", u"I stop existing.”"),
 "q2": ("II",  "THE VICTIM",     u"“I decided, a long time ago,", u"that I can’t.”"),
 "q3": ("III", "THE PERSECUTOR", u"“I am not attacking.", u"I am defending myself.”"),
}

# ---- the cut -----------------------------------------------------------------
# (duration, kind, ref, narration block, in point)
S = [
 (3.5,"clip","bare",7,0),          # a man before any role. The confession runs here
 (3.2,"clip","don",None,0),        # hands lower the first halo onto him
 (3.3,"clip","p_res",None,0),
 (4.5,"title",None,None,0),

 (3.6,"clip","p_res",1,0.4),       # the three roles named over the three faces
 (3.6,"clip","p_vic",None,0),
 (3.6,"clip","p_per",None,0),
 (3.2,"q1",None,None,0),

 (4.5,"clip","res_tea",2,0),
 (3.5,"clip","res_hand",None,0),
 (4.5,"clip","p_res",None,0.2),
 (3.2,"q2",None,None,0),

 (4.0,"clip","vic_room",3,0),
 (3.0,"clip","p_vic",None,0.6),
 (3.2,"q3",None,None,0),

 (3.0,"clip","door",4,0),
 (2.2,"clip","wall",None,0.3),
 # the throw. No narration over it at all: the film stops explaining exactly
 # where it finally has something to show.
 (1.4,"clip","glass",None,0.2),
 (8.0,"clip","throw",None,0.05),
 (2.4,"clip","after",None,0.2),

 (4.0,"clip","trio",5,0.1),        # the standoff, accelerating
 (1.6,"clip","p_res",None,1.2),
 (1.3,"clip","p_vic",None,1.4),
 (1.0,"clip","p_per",None,1.6),
 (4.5,"clip","over",None,0.2),     # "it is not a triangle. it is a wheel"
 (6.0,"clip","trio",None,0.5),

 (6.0,"clip","doff",6,0),          # the halo comes off while the price is named
 (5.7,"clip","bare",None,0.5),
 (4.0,"clip","bare",None,1.5),     # and then nothing, in silence
 (3.5,"card",None,None,0),
 (4.5,"dedic",None,None,0),
]
# the silence starts on the last bare shot and never lifts
MEET_AT = ("clip","bare",3)
VO_DELAY = {7: 1.2}

SFX = [
 ("riser", ("clip","wall",1),  "the rise into the throw"),
 ("shat",  ("clip","throw",1,4.0), "the glass on the wall, 4s into the single take"),
 ("pulse", ("clip","door",1),  "a slow low pulse under the persecutor"),
]

# ---- what the generator actually gave us -------------------------------------
# Measured with ffprobe on the finished takes. A slot longer than its source
# used to fail in the shell, three shots deep, after everything had downloaded.
# Now python knows the lengths and retimes the shot instead, and refuses to
# stretch a take so far that the wool stops moving like cloth.
SRC_LEN = {
 "bare":4.04, "don":4.04, "doff":6.04,
 "p_res":3.04, "p_vic":3.04, "p_per":3.04, "trio":5.04,
 "res_tea":5.04, "res_hand":4.04, "vic_room":5.04,
 "door":3.04, "wall":3.04, "glass":3.04, "throw":8.04, "after":3.04,
 "over":5.04,
}
TAIL = 0.04      # never ask for the last partial frame
MAX_STRETCH = 1.8
def stretch_for(ref, dur, ss):
    avail = SRC_LEN[ref] - ss - TAIL
    if avail <= 0:
        raise SystemExit("IN POINT PAST THE END: %s at %.2f of %.2f" % (ref, ss, SRC_LEN[ref]))
    if dur <= avail:
        return None
    r = dur / avail
    if r > MAX_STRETCH:
        raise SystemExit("STRETCH TOO FAR: %s wants %.2f from %.2fs of source = %.2fx"
                         % (ref, dur, avail, r))
    return r

# ---- fonts and cards ---------------------------------------------------------
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
def f(path, size):
    try: return ImageFont.truetype(path, size)
    except Exception: return ImageFont.load_default()
G = (196, 120, 62)   # the film's rust, so the cards belong to the same photograph

cum, marks, plan = 0.0, [], []
for i, (dur, kind, ref, vo, ss) in enumerate(S, 1):
    if vo: marks.append((vo, cum + VO_DELAY.get(vo, 0.0)))
    if kind in ("title","q1","q2","q3","card","dedic"):
        base = Image.new("RGB", (W, H), (14, 13, 12)); d = ImageDraw.Draw(base)
        if kind == "title":
            d.text((960, 420), "THE RESCUER", font=f(FB, 96), fill=(238,234,226), anchor="ma")
            d.text((960, 535), "SYNDROME", font=f(FB, 96), fill=(238,234,226), anchor="ma")
            d.line([(810, 690), (1110, 690)], fill=(84,74,64), width=2)
            d.text((960, 726), "THE KARPMAN TRIANGLE, THIRTY THOUSAND YEARS OLD",
                   font=f(FR, 26), fill=G, anchor="ma")
        elif kind == "card":
            rows = [("Three roles", (232,228,220)),
                    ("One person", (232,228,220)),
                    ("Meaning: unknown", G)]
            for j, (t, c) in enumerate(rows):
                d.text((960, 360 + j * 74), t, font=f(FR, 44), fill=c, anchor="ma")
            d.line([(760, 680), (1160, 680)], fill=(84,74,64), width=2)
            d.text((960, 720), "THE RESCUER SYNDROME", font=f(FB, 34), fill=(170,160,148), anchor="ma")
        elif kind == "dedic":
            d.text((960, 372), "FOR", font=f(FR, 32), fill=G, anchor="ma")
            d.text((960, 440), "RAFIK YEDIDIA", font=f(FB, 84), fill=(238,234,226), anchor="ma")
            d.text((960, 580), "MY THERAPIST", font=f(FR, 44), fill=(198,190,180), anchor="ma")
        else:
            num, en, l1, l2 = QUOTES[kind]
            d.text((960, 268), num, font=f(FB, 30), fill=G, anchor="ma")
            d.text((960, 330), en, font=f(FB, 82), fill=(240,236,228), anchor="ma")
            d.line([(810, 500), (1110, 500)], fill=(84,74,64), width=2)
            d.text((960, 566), l1, font=f(FR, 50), fill=(210,204,194), anchor="ma")
            d.text((960, 636), l2, font=f(FR, 50), fill=(210,204,194), anchor="ma")
        base.save("o%03d.png" % i); plan.append((i, dur, "card", "-", 0, "-"))
    else:
        sfac = stretch_for(ref, dur, ss)
        plan.append((i, dur, "clip", B + V[ref] + ".mp4", ss,
                     "-" if sfac is None else "%.4f" % sfac))
    cum += dur

starts, t = [], 0.0
for dur, *_ in S:
    starts.append(t); t += dur
def find(anchor):
    kind, ref, nth = anchor[:3]; seen = 0
    for i, (d, k, r, vo, ss) in enumerate(S):
        if k == kind and r == ref:
            seen += 1
            if seen == nth: return i
    raise SystemExit("sound anchor not found: %r" % (anchor,))
meet_t = starts[find(MEET_AT)]
sfx = []
for name, anchor, _why in SFX:
    at = starts[find(anchor)] + (anchor[3] if len(anchor) > 3 else 0.0)
    assert at < meet_t - 0.01, "%s lands in the silent ending" % name
    sfx.append((name, at))
open("sfx.txt","w").write("".join("%s %.3f\n" % x for x in sfx))
open("meet.txt","w").write("%.3f\n" % meet_t)
open("plan.txt","w").write("".join("%d %.2f %s %s %.2f %s\n" % p for p in plan))
nsl = sum(1 for p in plan if p[5] != "-")
print("retimed shots %d, slowest %s" % (nsl, max([p[5] for p in plan if p[5] != "-"] or ["-"])))
open("marks.txt","w").write("".join("%d %d\n" % (v, round(t*1000)) for v, t in marks))
tot = cum
print("shots %d  total %.2f = %d:%02d" % (len(S), tot, tot//60, tot%60))

# ---- the same three gates that the main cut earned the hard way ---------------
import wave, contextlib
ends = {}
for v, t0 in marks:
    with contextlib.closing(wave.open("hv%d.wav" % v)) as w:
        ends[v] = t0 + w.getnframes() / float(w.getframerate())
order = sorted(marks, key=lambda m: m[1])
for (v, t0), (v2, t2) in zip(order, order[1:]):
    if ends[v] > t2 - 0.3:
        raise SystemExit("NARRATION OVERLAP: vo%d ends %.2f, vo%d starts %.2f" % (v, ends[v], v2, t2))
print("narration blocks clear, tightest gap %.2fs"
      % min(t2 - ends[v] for (v, _), (v2, t2) in zip(order, order[1:])))
for v, t0 in marks:
    if ends[v] > meet_t + 0.01:
        raise SystemExit("VOICE RUNS INTO THE SILENT ENDING: vo%d ends %.2f, silence at %.2f" % (v, ends[v], meet_t))
print("no voice runs into the silence, latest ends %.2fs before it" % (meet_t - max(ends.values())))
card_t, t = [], 0.0
for dur, kind, ref, vo, ss in S:
    if kind in ("title","q1","q2","q3","card","dedic"): card_t.append((kind, t, t+dur))
    t += dur
for kind, a, b in card_t:
    for v, t0 in marks:
        if t0 < b and ends[v] > a:
            raise SystemExit("CARD OVER SPEECH: %s %.2f-%.2f vs vo%d %.2f-%.2f" % (kind,a,b,v,t0,ends[v]))
print("no card shares the screen with a voice, %d cards checked" % len(card_t))

# ---- subtitles: timing from whisper on the Hebrew, text from the English ------
ENG = {
 7: ["I had a therapist.", "One day he drew a triangle for me, on a page.",
     "After that I could never look at anyone the same way.", "Least of all myself."],
 1: ["There are three roles.", "The rescuer. The victim. The persecutor.",
     "And each one is certain he is only one of them."],
 2: ["The rescuer looks like the best person in the room.", "He isn't.",
     "He just doesn't know who he is when nobody needs him.",
     "So without meaning to, he makes sure they always need him."],
 3: ["The victim decided, a long time ago, that he cannot.",
     "And that is a decision, not a fact."],
 4: ["And the persecutor is certain that he is the victim. Always.",
     "He is only defending himself."],
 5: ["All three of them are the same person.",
     "The rescuer gets tired and turns into the persecutor.",
     "The persecutor gets caught and turns into the victim.",
     "And the victim has had enough, and starts to attack.",
     "It is not a triangle.", "It is a wheel."],
 6: ["You cannot leave this game quietly.",
     "The moment you stop rescuing, you look to them exactly like the persecutor.",
     "Whoever gets out, gets out alone."],
}
from faster_whisper import WhisperModel
mdl = WhisperModel("small", device="cpu", compute_type="int8")
cues = []
for v, t0 in marks:
    segs = list(mdl.transcribe("hv%d.wav" % v, language="he")[0])
    lines = ENG[v]
    if len(segs) == len(lines):
        for sg, ln in zip(segs, lines):
            cues.append((t0 + sg.start, t0 + sg.end, ln))
        print("  vo%d 1:1" % v)
    else:
        with contextlib.closing(wave.open("hv%d.wav" % v)) as w:
            dur = w.getnframes() / float(w.getframerate())
        step = dur / len(lines)
        for j, ln in enumerate(lines):
            cues.append((t0 + j*step, t0 + (j+1)*step - 0.08, ln))
        print("  vo%d spread %d segs -> %d cues" % (v, len(segs), len(lines)))
def ts(x):
    h = int(x//3600); m = int((x%3600)//60); s = x%60
    return "%02d:%02d:%06.3f" % (h, m, s).replace(".", ",") if False else "%02d:%02d:%06.3f" % (h, m, s)
def srt_ts(x):
    return ts(x).replace(".", ",")
cues.sort()
open("subs.srt","w").write("".join(
    "%d\n%s --> %s\n%s\n\n" % (i, srt_ts(a), srt_ts(b), tx)
    for i, (a, b, tx) in enumerate(cues, 1)))
print("subtitles %d cues" % len(cues))
