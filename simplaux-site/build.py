"""Build the production copy of the Simpla site for www.simplaux.com.

The source of truth is ../simpla-hybrid/index.html (the lab version on GitHub Pages).
This script copies it here with self-contained paths, plus the assets it needs,
so the folder can be served on its own from a domain root (Vercel project "simplaux",
root directory "simplaux-site").

Run from the repo root:  python3 simplaux-site/build.py
Edit the hybrid page, never the generated simplaux-site/index.html.
"""
import os, re, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "simplaux-site")
SITE = "https://www.simplaux.com/"

src = open(os.path.join(ROOT, "simpla-hybrid", "index.html"), encoding="utf-8").read()
reps = [
    ('../assets/clients.js', 'assets/clients.js'),
    ('../assets/eyal-gershon-profile.jpg', 'assets/eyal-gershon-profile.jpg'),
    ('../jb-weave/img/', 'img/weave/'),
    ('href="../jb-weave/"', 'href="https://eyalg1980.github.io/simpla-lab/jb-weave/" target="_blank" rel="noopener"'),
]
for a, b in reps:
    if a not in src:
        raise SystemExit("missing in source: " + a)
    src = src.replace(a, b)
head_extra = ('<link rel="canonical" href="%s">\n<meta property="og:url" content="%s">\n' % (SITE, SITE))
src = src.replace('<meta property="og:type"', head_extra + '<meta property="og:type"', 1)
if "../" in re.sub(r"https?://[^\"' ]+", "", src):
    raise SystemExit("a relative ../ path is still in the page")
open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(src)

os.makedirs(os.path.join(OUT, "assets"), exist_ok=True)
os.makedirs(os.path.join(OUT, "img", "weave"), exist_ok=True)
shutil.copy(os.path.join(ROOT, "assets", "clients.js"), os.path.join(OUT, "assets", "clients.js"))
shutil.copy(os.path.join(ROOT, "assets", "eyal-gershon-profile.jpg"), os.path.join(OUT, "assets", "eyal-gershon-profile.jpg"))
for f in ["wf-canvas.webp", "wf-lora.webp", "wf-screens.webp", "wf-app.webp"]:
    shutil.copy(os.path.join(ROOT, "jb-weave", "img", f), os.path.join(OUT, "img", "weave", f))
print("built", os.path.join(OUT, "index.html"), len(src), "chars")
