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
 # THE FOURTH LANGUAGE, added 29.8: "the frequency of love".
 # A flat hand-painted cut-out man standing inside the SAME photographed rooms
 # as the filmed man, painted in the SAME ochre as the cave. He is not a new
 # character: he is this man without his roles, and the film never remarks on him.
}

# ---- clips, keyed by their v6 shot number, copied verbatim from build6.py.
# The key IS the v6 shot number; the comment is what that shot shows. Never
# re-key one of these by description -- that put a deleted shot back into the
# cut once already.
# Every CAVE clip here was regenerated 29.8 from a relit frame: open flame
# instead of a flashlight beam. The keys stay the v6 shot numbers.
C = {
 1:"20260829_082536_e527c07a-b676-4b25-9bdc-58766d8e9125",   # torch on the painting
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
 38:"20260828_233753_6ca6b04f-139c-46b8-a5cf-ec7348f6a03b",  # face lit low
 52:"20260829_082556_f8f5a60f-93a7-40eb-aced-fbd556010d4d",  # cave wide, three figures
 57:"20260828_230930_36310d72-7aea-4b11-8f42-bd2aa6c3ad19",  # the real smile
 59:"20260829_082535_df9d9562-00a2-4825-be9e-999123f27a53",  # drawing in the cave
 62:"20260829_082536_c4fc580b-78f6-4b2b-a469-7e200add6f7b",  # the torch
}
# v6 shots deliberately absent, and why. Anything listed here must never appear
# in C or A again.
DROPPED = {
 14:"the fist gripping the shoulder", 18:"sitting on the bed",
 20:"the hand holding the blank phone", 28:"the door from inside",
 32:"the door latch", 55:"the illustrated meeting", 56:"the hug",
 60:"one of the two cave-figure shots in the coda, they said the same thing",
 39:"the old glass release, replaced by 'throw'",
 41:"the old bullet time, replaced by 'orbit'",
 54:"the old meeting wide, replaced by 'room'",
 # cut 12, 29.8. Four trims he approved plus seven shots he sent as pictures.
 42:"the man hunched on the chair in the dark, one of his seven",
 35:"the corridor with the figure walking away, an approved trim",
 45:"the orange back in the alley, an approved trim",
 46:"the alley with the lamps, an approved trim",
 40:"the old glass-alone shot, replaced by 'tumble' with the matching glass",
 61:"the hand within a hand, one of his seven",
 # cut 13: the two street shots in the wheel. He was right that they are not
 # part of this film -- an unrelated woman and an unrelated couple.
 44:"the two hands gripping in the alley, nobody in the film",
 47:"the woman's raised palm in the alley, nobody in the film",
 # cut 17: the forest opening replaced two cave-detail shots, and clip 3 said
 # the same thing as clip 59 in the coda.
 2:"the pigment bowl, cut to make room for the forest opening",
 3:"the hand drawing on the wall, the coda already has that shot",
}
# cut 12: the same guard for the new-material keys, which live in N and were
# never covered by the assert below. Six of the seven he removed are here.
DROPPED_N = {
 "throw":"the first throw, replaced so the coat and the glass match the other two",
 "orbit":"the first bullet time, replaced so the persecutor is in frame too",
 "morph":"the first morph, it started on two painted men instead of on his fixed shot",
 "lv_hand":"the hand on the shoulder", "lv_sofa":"the two of them on the sofa",
 "lv_coffee":"pouring the two coffees", "lv_balcony":"the two of them on the balcony",
 "lv_wall":"his painted palm beside the ochre handprint",
 "throw2":"the second throw, it read as a flinch rather than a throw",
 "tumble":"replaced together with the throw so the glass still matches",
 "orbit2":"replaced, its shards were confetti",
 "room":"the reveal where the therapist mouthed words with no sound",
 "throw3":"the third throw, folded into the single continuous bullet-time take",
 "tumble2":"folded into the single continuous take",
 "orbit3":"folded into the single continuous take",
 "morph2":"the morph from the 3D therapist, replaced when he was repainted",
 "morph3":"the morph from the dark-haired painted therapist, wrong man",
}
assert not (set(C) & set(DROPPED)), "a dropped shot is back in C: %s" % (set(C) & set(DROPPED),)

# ---- new material generated for v7 ------------------------------------------
N = {
 # animated 29.8: the collage now moves as stop-motion, and the relit cave
 # stills now flicker, because a fire that does not move is a defect
 "mag1v":"20260829_092501_85dfde3a-bc89-43a4-a7b6-886ec8251bfc",
 "mag2v":"20260829_092501_41fd76d7-3699-4d3c-a6b3-45694a7ebb13",
 "mag3v":"20260829_092501_78a50459-6932-472a-901d-1c37714620ba",
 "cave04v":"20260829_092501_3816c537-3b5c-484c-b0f3-9ce464f12e3d",
 "cave05v":"20260829_092501_3909c7bc-7e56-41a8-9acb-3d5195e115a8",
 "cave07v":"20260829_092501_7756c659-aefb-49f9-bee1-fb4061d6594a",
 "cave08v":"20260829_092501_47215867-9383-411a-a4e6-d10848200a60",
 # THE BULLET TIME, rebuilt 29.8 as three shots from ONE parent frame so the
 # coat and the glass are the same object in all three. The lock strings were
 # written once and pasted verbatim into all three prompts: "a heavy dark
 # charcoal wool overcoat over a black shirt" and "a short heavy clear glass
 # tumbler, thick round base, completely empty, no liquid, plain and unmarked".
 # cut 13: regenerated a second time. The first throw read as a FLINCH -- body
 # hunched, face down, glass still beside his head. This one is a committed
 # overhand throw: weight forward, face lifted to the wall, glass already most
 # of the way across the room. The shards are now hand-sized blades, not confetti.
 # cut 14: the whole bullet time is now ONE UNBROKEN TEN-SECOND TAKE on
 # Seedance 2.5 (omni_reference, 720p), not three cuts. Bullet time IS one
 # continuous move -- splitting it into three shots is what kept killing it.
 # Two image references locked the objects: the clean tumbler on black for the
 # glass, and the face-in-the-dark-coat frame for the man. The prompt is written
 # as a TIMED SHOT LIST inside one take (0-2 the throw, 2-4.5 the glass alone,
 # 4.5-6 the impact, 6-10 the camera arcing round the frozen shards until the
 # hooded victim is revealed behind them).
 "bullet":"20260829_204646_1e4543ca-30ef-48ee-b46f-588cc34cdcdb",
 # THE OPENING, 30.8. The painted man -- the healthy one, before any role --
 # walks through a real forest to a real cave and goes in. It puts the painted
 # language in the first second instead of at 2:35, it makes the man who enters
 # the cave the WELL one (so the whole film is what he finds there), and the
 # confession now runs over someone walking toward the thing he is about to
 # understand rather than over a static wall.
 "fw1":"20260830_124846_419e2eb9-f12d-4b69-8ac9-02258623ae1f",  # forest, wide, walking away
 "fw2":"20260830_124846_59371aea-b58c-49ba-ba15-2f5e7a443e36",  # passing between the trunks
 "fw3":"20260830_124905_1a205403-1a35-41f1-819c-220013c26851",  # stopped at the cave mouth
 "fw4":"20260830_124846_d7e2e4de-e78e-475c-84c0-d37e28f86e11",  # stepping into the dark
 # THREE CLOSE-UPS TRADED FOR AIR, one per chapter. The tight faces stay in the
 # wheel at the end, where the crowding IS the point; inside the chapters they
 # were saying less than a wide frame could.
 "w_res":"20260830_124846_79f6c588-0618-4a86-bb31-53a5dbaed944", # small in someone else's room
 "w_vic":"20260830_124846_88353299-c263-43d2-be61-5a26b473afc8", # tiny in a huge empty room
 "w_per":"20260830_124846_01485bd7-a0e5-4826-bc41-067ed157197f", # filling a doorway, low angle
 # THE CLOSER: the therapist, painted, walking away down a real street. The last
 # narration is "whoever gets out, gets out alone"; this is that line as a shot,
 # and it puts him on screen immediately before the dedication that names him.
 "ther_walk":"20260830_124846_94017a87-3477-4ee0-8652-046484113a93",
 # THE MEETING OF THE THREE ROLES. The wheel used to run over an unrelated
 # woman and an unrelated couple in an alley -- filler from an old cut that had
 # nothing to do with the film. The narration there says "all three of them are
 # the same person", so now that is what is on screen: the same man, three
 # times, in one room, in his three costumes. Generated from one parent face
 # with all three wardrobe references passed together.
 "trio1":"20260829_184940_a7fd7250-4cc1-4da3-92ef-e5f94e377b41",  # long shot, all three in the room
 "trio2":"20260829_184940_e6153ab0-2b44-46ce-a43d-1bd7682c88c2",  # victim and persecutor face to face
 "trio3":"20260829_184940_4da49882-2ab8-4673-8e16-05377615e6f2",  # over the victim's shoulder
 # the reveal, regenerated: in the old one the therapist mouthed words with no
 # sound, which reads as a bug and not as a choice. Neither man speaks now.
 "room2":"20260829_184941_05925272-5863-46fb-bd0e-16504b0d3e61",
 # the victim's chapter now opens with one continuous move from outside the house
 "walk":"20260829_174423_cbb11e04-1558-43e9-a5a8-0b16bb340d0b",
 # the morph, rebuilt to his spec: his FIXED illustrated shot resolves into the
 # same frame photoreal, and that frame is exactly where the reveal begins.
 # regenerated once more: it has to start from the PAINTED therapist now, since
 # that is who has been speaking for the whole film.
 "morph4":"20260830_040713_ef67e357-7625-428a-9445-ab0e148ba060",
 # THE FOURTH LANGUAGE, "the frequency of love": a flat hand-painted cut-out man
 # inside the SAME photographed rooms, painted in the SAME ochre as the cave.
 # 29.8 he asked to take it OUT of the three chapters and give it the ending
 # instead, and to animate it. All of these are now moving footage.
 # 29.8, cut 12: he sent five of the six love-coda shots back as pictures to
 # remove. Only the laugh survives, and it now sits directly after the real
 # smile so it has a partner instead of standing alone.
 "lv_laugh":"20260829_112938_de319988-53e0-4952-8bc6-fd18733fc38d", # laughing at the table
}
assert not (set(N) & set(DROPPED_N)), "a dropped clip is back in N: %s" % (set(N) & set(DROPPED_N),)
# Hebrew narration, elevenlabs / Arthur
HE = {
 1:"20260829_062549_3f974055-5a8d-43a0-a9e9-1c536ae0ab6f",
 2:"20260829_062548_42ad5d39-0f0c-4308-8966-579c82df765c",
 3:"20260829_062548_764a69e5-82f7-4387-a9e5-3dd9f096d88f",
 4:"20260829_062548_c2fa46e6-d4fc-47bd-8069-26c9713b98e8",
 5:"20260829_062548_c3d7022f-4c9d-470f-a59c-4653249e10ba",
 6:"20260829_062548_f8befee9-fee0-4fd9-bdfd-4624d54e405d",
 # THE CONFESSION, added 29.8. Until now the only voice in the film was the
 # therapist's, which made the film a lecture: it explains a mechanism and never
 # gives the viewer one person to lose. This is the patient, in FIRST PERSON,
 # once, at the very start, in a different voice (elevenlabs / Cillian). It also
 # plants "my therapist" in the sixth second, so the dedication at the end
 # closes a circle instead of arriving from nowhere.
 # Gated the same way the Hebrew was: whisper transcribed it back word for word.
 7:"20260829_194605_a09fa10d-4e9f-4e93-9c49-976b110f4318",
}
# Hebrew lip sync, wan2.7
# THE THERAPIST IS REPAINTED, 29.8. He was a stylised 3D caricature, which was
# the one element in the film that read as generic AI. He is now the SAME FLAT
# HAND-PAINTED CUT-OUT LANGUAGE as the healthy man -- brush strokes, painted
# outline, inside the same photographed room. That makes the style an argument
# rather than a look: to be painted in this film is to stand OUTSIDE the wheel.
# Every one of these was driven by the real Hebrew audio, trimmed first to the
# exact on-screen length of its shot.
# THE BUG THAT COST TWO ROUNDS: wan2_7's `duration` parameter defaults to 5
# SECONDS. Without it the model ignores how long the audio is and returns a 5s
# clip, and the give-away is the length, not the picture. Always pass duration.
L = {
 # AND REGENERATED ONCE MORE: the first painted pass gave him DARK hair, while
 # the photoreal man the film morphs into is white-haired and twenty years
 # older. That turned the morph from a change of rendering into a change of
 # PERSON. The parent frame now takes its composition from the illustrated shot
 # and its IDENTITY from the photoreal frame, so both are the same man.
 6:"20260830_040713_09ddd3a0-62d2-4655-b0ae-8ec1d827ffe8",   # 6s
 16:"20260830_040714_8c5a8fdf-8caa-4d9a-aee5-87d13f233e23",  # 12s
 30:"20260830_040713_2a98a450-def6-4113-8b8e-d035439d4e00",  # 9s
 43:"20260830_040713_bf3f969c-5030-4b02-aa0a-ab246682e052",  # 8s
 53:"20260830_040713_b952cfa8-af8c-4e9c-9794-4b0787b1081a",  # 10s
}

# ---- the cut -----------------------------------------------------------------
# (dur, kind, ref, vo, in_point)
S = [
 # prologue, the cave
 (2.4,"clip","fw1",7,0),                                  # vo7, the confession
 (1.8,"clip","fw2",None,0),
 (2.0,"clip","fw3",None,0),
 (2.6,"clip","fw4",None,0),
 (2.5,"clip",1,None,0),(3.0,"clip",4,None,0),
 (4.5,"title",None,None,0),

 # vo1. THE CHAPTER CARD NOW COMES AFTER THE NARRATION, NOT BEFORE IT: the quote
 # and the burned subtitle were fighting for the same screen. So the therapist
 # speaks, the EARTH ZOOM finds the man, and only then the card names him.
 (6.0,"lip",6,1,0),
 (8.0,"clip",8,None,0),                                   # EARTH ZOOM
 (3.2,"q1",None,None,0),
 # I. the rescuer
 (2.2,"clip",9,None,0),(1.8,"clip",10,None,0),(1.8,"clip",11,None,0),
 (3.6,"clip","w_res",None,0),
 (1.8,"clip",13,None,0),(2.2,"clip",15,None,0),

 # vo2, then the victim opens, then the card
 (12.0,"lip",16,2,0),
 # the victim's chapter no longer OPENS on him: the camera comes in from
 # outside the house, through the window and two rooms, and finds him.
 (9.2,"clip","walk",None,0),   # 9.2 not 8.0: the arrival behind him lands at 6.5s of the
                                # source, so a shorter slot cut away before the payoff
 (0.4,"punch","mag1v",None,0.2),
 (1.8,"clip",23,None,0),
 (0.4,"punch","mag2v",None,0.2),
 (3.4,"clip","w_vic",None,0),
 (0.4,"punch","mag3v",None,0.2),
 (2.4,"clip",19,None,0),
 (3.2,"q2",None,None,0),
 # II. the victim, the collage bursting
 (1.8,"clip","cave04v",None,0),
 (0.4,"punch","mag1v",None,1.6),
 (0.4,"punch","mag2v",None,1.6),
 (0.9,"punch","mag3v",None,2.6),
 (2.0,"clip",29,None,0),

 # vo3, then the persecutor opens, then the card
 (9.0,"lip",30,3,0),
 (3.6,"clip","w_per",None,0),
 (1.6,"clip","cave05v",None,0),
 (3.2,"q3",None,None,0),
 # III. the persecutor, and the bullet time. All three shots regenerated from
 # one parent frame: same coat, same glass, and the third holds both men.
 (2.2,"clip",38,None,0),
 # one take: throw, flight, impact, and the camera coming round the frozen
 # glass to find the victim sitting behind it. No cut anywhere inside it.
 (10.0,"clip","bullet",None,0),
                                # in point 0.4: past 4.6s the orbit brings a SECOND standing
                                # figure round and the hooded victim is gone, which breaks it

 # vo4
 (8.0,"lip",43,4,0),
 # vo5, the wheel. Two of the cutaways here were among the trims he approved,
 # which left the block shorter than the narration that runs over it -- the new
 # overlap gate caught exactly that. The fix is not padding: the three faces now
 # go round TWICE, the second turn faster than the first. The line is "it is not
 # a triangle, it is a wheel", so a wheel that comes round again and picks up
 # speed is the picture saying what the voice says.
 # THE MEETING. The line under this is "all three of them are the same person",
 # so the picture is now literally that, and the first of the three is a LONG
 # SHOT of a whole room -- the widest frame in the film, dropped in exactly
 # where a run of close-ups used to be.
 (4.0,"clip","trio1",5,0),                                # all three in one room
 (3.6,"clip","trio2",None,0),                             # victim and persecutor, face to face
 (3.6,"clip","trio3",None,0),                             # over the victim's shoulder
 # and only then the wheel spins: the three faces, fast, once
 (1.2,"flash","smile",None,0),(1.2,"flash","empty",None,0),(1.2,"flash","eyes",None,0),
 (1.6,"punch","cave07v",None,0.4),
 (6.0,"slow",52,None,0),
 # vo6
 (10.0,"lip",53,6,0),

 # THE MEETING. His fixed illustrated shot resolves into the same frame
 # photoreal, and that frame is exactly where the pull-back begins, so the
 # style change and the reveal are one continuous move with no seam.
 (5.0,"clip","morph4",None,0),
 (8.0,"clip","room2",None,0),
 (3.0,"clip",57,None,0),
 (3.0,"clip","lv_laugh",None,0),

 # the cave closes it
 (2.9,"clip","cave08v",None,0),
 (3.5,"clip",59,None,0),
 (4.5,"clip",62,None,0),
 (5.0,"clip","ther_walk",None,0),
 (3.5,"card",None,None,0),
 (4.5,"dedic",None,None,0),
]
VO_DELAY = {5: 1.4, 7: 1.5}  # vo7 lets the first cave image sit for a beat
                             # before anyone speaks, and still clears the title card   # vo5 starts a beat after its shot so it cannot collide with vo4

# ---- sound design ------------------------------------------------------------
# Every cue is anchored to a SHOT INDEX, never to a hand-typed timecode, so the
# sound cannot drift when a duration changes. All of it is synthesised with sox.
# HARD RULE: nothing may be placed at or after the meeting (MEET_SHOT). The
# absolute silence of the last half minute is the film's strongest sound idea
# and adding anything to it would be a downgrade, so the build asserts it.
# Cues are anchored to WHAT A SHOT IS, never to its position, because inserting
# one shot used to move every cue after it silently. Each anchor is
# (kind, ref, which occurrence).
MEET_AT = ("clip", "morph4", 1)
SFX = [
 ("fire",  ("clip", 1, 1),          "the fire finds the wall in the opening"),
 ("fire",  ("clip", 15, 1),         "the cave beat that closes the rescuer"),
 ("fire",  ("clip", "cave04v", 1),  "the cave beat inside the collage weave"),
 ("fire",  ("clip", "cave05v", 1),  "the cave beat before the bullet time"),
 ("fire",  ("punch", "cave07v", 1), "the cave that ends the wheel"),
 ("sting", ("q1", None, 1),         "sub drop under THE RESCUER"),
 ("sting", ("q2", None, 1),         "sub drop under THE VICTIM"),
 ("sting", ("q3", None, 1),         "sub drop under THE PERSECUTOR"),
 # two of the middle collage flashes are gone, so two rips went with them.
 # the anchors are by occurrence, so a stale one fails the build rather than
 # landing on the wrong frame.
 ("rip",   ("punch", "mag1v", 1), ""), ("rip", ("punch", "mag2v", 1), ""),
 ("rip",   ("punch", "mag3v", 1), ""), ("rip", ("punch", "mag1v", 2), ""),
 ("rip",   ("punch", "mag2v", 2), ""), ("rip", ("punch", "mag3v", 2), ""),
 ("pulse", ("clip", "w_per", 1),   "a slow low pulse under the persecutor, felt not heard"),
 ("riser", ("clip", 38, 1),         "the rise into the throw"),
 ("wind",  ("clip", 8, 1),          "under the earth zoom"),
 ("shat",  ("clip", "bullet", 1, 5.4), "the glass on the wall, 5.4s into the single take"),
 # cut 12: the move in through the window needs air moving with it, or an
 # eight second travelling shot plays as a silent slideshow.
 ("glide", ("clip", "walk", 1),     "air under the move in through the window"),
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
            # 29.8: all burned CARD text is English now. The spoken narration
            # stays Hebrew -- that is the authenticity signal -- and everything
            # a juror has to READ is in their language.
            d2.text((960, 420), "THE RESCUER", font=f(FB, 96), fill=(240,240,240), anchor="ma")
            d2.text((960, 535), "SYNDROME", font=f(FB, 96), fill=(240,240,240), anchor="ma")
            d2.line([(810, 690), (1110, 690)], fill=(70,70,70), width=2)
            d2.text((960, 726), "THE KARPMAN TRIANGLE, THIRTY THOUSAND YEARS OLD",
                    font=f(FR, 26), fill=G, anchor="ma")
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
            d2.text((960, 372), "FOR", font=f(FR, 32), fill=G, anchor="ma")
            d2.text((960, 440), "RAFIK YEDIDIA", font=f(FB, 84), fill=(240,240,240), anchor="ma")
            d2.text((960, 580), "MY THERAPIST", font=f(FR, 44), fill=(200,200,200), anchor="ma")
        else:
            num, he_title, en_title, l1, l2 = QUOTES[kind]
            # the Hebrew chapter title is gone: the English name carries it now,
            # at the size the Hebrew used to have.
            d2.text((960, 268), num, font=f(FB, 30), fill=G, anchor="ma")
            d2.text((960, 330), en_title, font=f(FB, 82), fill=(245,245,245), anchor="ma")
            d2.line([(810, 500), (1110, 500)], fill=(70,70,70), width=2)
            d2.text((960, 566), l1, font=f(FR, 50), fill=(214,214,214), anchor="ma")
            d2.text((960, 636), l2, font=f(FR, 50), fill=(214,214,214), anchor="ma")
        base.save("o%03d.png" % i); plan.append((i, dur, "card", "-", 0))
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
        base.save("o%03d.png" % i)
        plan.append((i, dur, kind, "-", 0))
    cum += dur

# shot start times, so every sound cue is derived and never typed
starts = []
t = 0.0
for dur, *_ in S:
    starts.append(t); t += dur
def find(anchor):
    kind, ref, nth = anchor[:3]
    seen = 0
    for i, (d, k, r, vo, ss) in enumerate(S):
        if k == kind and r == ref:
            seen += 1
            if seen == nth: return i
    raise SystemExit("sound anchor not found: %r" % (anchor,))
meet_t = starts[find(MEET_AT)]
sfx = []
for name, anchor, _why in SFX:
    # a 4th element is an offset INSIDE the shot. The bullet time is one ten
    # second take now, so the glass breaks in the middle of a shot rather than
    # at its head, and the hit has to land there.
    at = starts[find(anchor)] + (anchor[3] if len(anchor) > 3 else 0.0)
    assert at < meet_t - 0.01, "%s at %r lands in the silent ending" % (name, anchor)
    sfx.append((name, at))
open("sfx.txt","w").write("".join("%s %.3f\n" % x for x in sfx))
# one source of truth for where the silence starts. the shell used to recompute
# this from a hardcoded shot number, which went wrong the moment a shot was inserted.
open("meet.txt","w").write("%.3f\n" % meet_t)
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
 7: ["I had a therapist.",
     "One day he drew a triangle for me, on a page.",
     "After that I could never look at anyone the same way.",
     "Least of all myself."],
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
# cut 12: shortening a chapter can pull the next narration block UNDER the tail
# of the one before it, and nothing in the build noticed. The whisper pass has
# just measured every block, so use those measurements as a gate rather than
# trusting the shot table. Speech overlapping speech is unlistenable.
import wave, contextlib
ends = {}
for v, t0 in marks:
    with contextlib.closing(wave.open("hv%d.wav" % v)) as w:
        ends[v] = t0 + w.getnframes() / float(w.getframerate())
order = sorted(marks, key=lambda m: m[1])
for (v, t0), (v2, t2) in zip(order, order[1:]):
    if ends[v] > t2 - 0.3:
        raise SystemExit("NARRATION OVERLAP: vo%d ends at %.2fs, vo%d starts at %.2fs"
                         % (v, ends[v], v2, t2))
print("narration blocks clear, tightest gap %.2fs"
      % min(t2 - ends[v] for (v, _), (v2, t2) in zip(order, order[1:])))

# A CARD MUST NEVER SHARE THE SCREEN WITH A VOICE. That collision -- a quote to
# read and a subtitle to read at the same time -- is the thing he sent back
# twice. The chapter cards were fixed by hand; this makes it structural.
card_t, t = [], 0.0
for dur, kind, ref, vo, ss in S:
    if kind in ("title", "q1", "q2", "q3", "card", "dedic"):
        card_t.append((kind, t, t + dur))
    t += dur
for kind, a, b in card_t:
    for v, t0 in marks:
        if t0 < b and ends[v] > a:
            raise SystemExit("CARD OVER SPEECH: %s runs %.2f-%.2f, vo%d runs %.2f-%.2f"
                             % (kind, a, b, v, t0, ends[v]))
print("no card shares the screen with a voice, %d cards checked" % len(card_t))

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
