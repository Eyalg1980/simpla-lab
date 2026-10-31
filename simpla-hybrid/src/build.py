"""Build the Simpla Hybrid pages, Hebrew and English, from one source.

  src/head.html       page head template, the stylesheet is inlined into it
  src/style.css       all styles, both directions
  src/body.he.html    Hebrew markup          src/body.en.html    English markup
  src/content.he.js   Hebrew content and UI   src/content.en.js   English content and UI
  src/app.js          the shared engine: film, canvas, Weave tour, gallery, TV, viewer

Outputs (each one a single self-contained page, as before):
  simpla-hybrid/index.html, simpla-hybrid/en/index.html        the lab copies on GitHub Pages
  simplaux-site/index.html, simplaux-site/en/index.html        www.simplaux.com on Vercel, plus the assets it needs

Run from the repo root:  python3 simpla-hybrid/src/build.py
Edit the files in src/, never the generated pages.
"""
import os, re, shutil, subprocess, tempfile

SRC = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(SRC))
SITE = "https://www.simplaux.com"

def read(name):
    return open(os.path.join(SRC, name), encoding="utf-8").read()

META = {
    "he": dict(LANG="he", DIR="rtl", OG_LOCALE="he_IL",
               TITLE="Simpla · סטודיו ל-UX ו-AI",
               DESC="Simpla, סטודיו בוטיק ל-UX ו-AI בתל אביב. סרטים ב-AI, אפיון מוצר, הטמעת Figma Weave בארגונים, סדנאות לצוותים והטמעת AI.",
               OG_TITLE="Simpla · מאבסטרקט לאובייקט",
               OG_DESC="סטודיו בוטיק ל-UX ו-AI בתל אביב. סרטים, אפיון, Figma Weave, סדנאות והטמעה."),
    "en": dict(LANG="en", DIR="ltr", OG_LOCALE="en_US",
               TITLE="Simpla · UX and AI studio",
               DESC="Simpla is a boutique UX and AI studio in Tel Aviv. AI films, product spec, Figma Weave adoption in organizations, team workshops and AI adoption.",
               OG_TITLE="Simpla · From Abstract to Object",
               OG_DESC="A boutique UX and AI studio in Tel Aviv. Films, product spec, Figma Weave, workshops and AI adoption."),
}
TARGETS = [
    # (lang, output path, assets prefix, weave images prefix, link to the other language, production head tags)
    ("he", "simpla-hybrid/index.html",    "../assets/",    "../jb-weave/img/",    "en/",  False),
    ("en", "simpla-hybrid/en/index.html", "../../assets/", "../../jb-weave/img/", "../",  False),
    ("he", "simplaux-site/index.html",    "/assets/",      "/img/weave/",         "/en",  True),
    ("en", "simplaux-site/en/index.html", "/assets/",      "/img/weave/",         "/",    True),
]

def prod_head(lang):
    url = SITE + ("/" if lang == "he" else "/en")
    return ('<link rel="canonical" href="%s">\n<meta property="og:url" content="%s">\n'
            '<link rel="alternate" hreflang="he" href="%s/">\n<link rel="alternate" hreflang="en" href="%s/en">\n'
            '<link rel="alternate" hreflang="x-default" href="%s/">\n') % (url, url, SITE, SITE, SITE)

def page(lang, assets, weave, alt, prod):
    vals = dict(META[lang])
    vals["HEAD_EXTRA"] = prod_head(lang) if prod else ""
    vals["CSS"] = read("style.css")
    head = read("head.html")
    for k, v in vals.items():
        head = head.replace("{{%s}}" % k, v)
    script = ('<script>\n(function () {\n  "use strict";\n\n' + read("content.%s.js" % lang) + "\n" + read("app.js") +
              "})();\n</script>\n</body>\n</html>\n")
    html = head + read("body.%s.html" % lang) + script
    html = html.replace("{{ASSETS}}", assets).replace("{{WEAVE_IMG}}", weave).replace("{{ALT_URL}}", alt)
    left = re.findall(r"\{\{[A-Z_]+\}\}", html)
    if left:
        raise SystemExit("unfilled placeholders: %s" % sorted(set(left)))
    return html

def check(html, name):
    # every inline script must parse, and the house style bans em dashes and arrows
    for i, block in enumerate(re.findall(r"<script>(.*?)</script>", html, re.S)):
        with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
            f.write(block)
        r = subprocess.run(["node", "--check", f.name], capture_output=True, text=True)
        os.unlink(f.name)
        if r.returncode:
            raise SystemExit("%s script %d: %s" % (name, i, r.stderr))
    bad = re.findall("[—–→←⇒⟶]", html)
    if bad:
        raise SystemExit("%s: %d em dashes or arrows" % (name, len(bad)))

for lang, out, assets, weave, alt, prod in TARGETS:
    html = page(lang, assets, weave, alt, prod)
    check(html, out)
    path = os.path.join(ROOT, out)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w", encoding="utf-8").write(html)
    print("built", out, len(html), "chars")

# the production folder carries its own copies of the shared assets
site = os.path.join(ROOT, "simplaux-site")
os.makedirs(os.path.join(site, "assets"), exist_ok=True)
os.makedirs(os.path.join(site, "img", "weave"), exist_ok=True)
for f in ["clients.js", "eyal-gershon-profile.jpg"]:
    shutil.copy(os.path.join(ROOT, "assets", f), os.path.join(site, "assets", f))
for f in ["wf-canvas.webp", "wf-lora.webp", "wf-screens.webp", "wf-app.webp"]:
    shutil.copy(os.path.join(ROOT, "jb-weave", "img", f), os.path.join(site, "img", "weave", f))
print("assets copied")
