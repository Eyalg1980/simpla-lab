#!/usr/bin/env python3
"""Builds the Design DNA Studio showcase into one self-contained index.html.

Inputs:
  site/shell.html    the page shell, with __FONTS__ and /*__DATA__*/ markers
  site/content.json  UI strings, theme copy, purposes, flow, demo metadata
  site/themes.json   written by design-dna-studio/tools/build_tokens.py
  site/assets.json   generated media URLs
  design-dna-studio/assets/snippets/*.html   the runnable demos

Demo css/body/js are re-read from the snippets on every build, so editing a
snippet in the skill package is enough to update the site.
"""
import json, os, re

SK = 'design-dna-studio'
OUT = os.environ.get('OUT_DIR', 'site/out')

C = json.load(open('site/content.json', encoding='utf-8'))
TH = json.load(open('site/themes.json', encoding='utf-8'))
AS = json.load(open('site/assets.json', encoding='utf-8'))

WEIGHTS = {
 'Varela Round':'', 'Assistant':':wght@400;600;700', 'Karantina':':wght@400;700',
 'Rubik':':wght@400;500;700;800;900', 'Noto Sans Hebrew':':wght@400;700;900',
 'Heebo':':wght@300;400;500;700', 'Frank Ruhl Libre':':wght@400;500;700;900',
 'Suez One':'', 'Alef':':wght@400;700', 'David Libre':':wght@400;500;700',
 'Secular One':'', 'Amatic SC':':wght@400;700', 'Noto Serif Hebrew':':wght@500;700;900',
 'Tinos':':ital,wght@0,400;0,700;1,400', 'Miriam Libre':':wght@400;700',
 'IBM Plex Sans Hebrew':':wght@400;500;700', 'Bellefair':'', 'Poppins':':wght@500;600;700;800',
 'Inter':':wght@300;400;500;600;700', 'Baloo 2':':wght@500;600;700;800',
 'Nunito Sans':':wght@400;600;700', 'Bangers':'', 'Oswald':':wght@500;600;700',
 'Roboto':':wght@300;400;500;700', 'Work Sans':':wght@400;500;600;700',
 'Bitter':':wght@500;600;700', 'Source Sans 3':':wght@300;400;500;700',
 'Archivo':':wght@400;500;600;700;800', 'Caveat':':wght@500;600;700',
 'IBM Plex Sans':':wght@300;400;500;600;700', 'Cinzel':':wght@500;600;700',
 'EB Garamond':':ital,wght@0,400;0,600;1,400', 'Space Grotesk':':wght@500;600;700',
 'Cormorant Garamond':':wght@500;600;700', 'Lora':':ital,wght@0,400;0,500;0,600;1,400',
 'Instrument Sans':':wght@500;600;700', 'Zilla Slab':':wght@600;700',
}


def snippet(key):
    s = open(f'{SK}/assets/snippets/{key}.html', encoding='utf-8').read()
    css = s.split('</style>')[0].split('transition-duration:.001ms!important}}')[1]
    body = s.split('</style></head><body>')[1].split('<script>')[0]
    js = s.split('<script>')[1].split('</script>')[0]
    return css.strip(), body.strip(), js.strip()


def main():
    themes = TH['themes']
    # carry the authored copy and prompts over onto the freshly built palettes
    for slug, t in themes.items():
        old = C['THEMES'][slug]
        t['prompt'] = old['prompt']
        t['text'] = old['text']

    fams = set(TH['families'])
    missing = [f for f in fams if f not in WEIGHTS]
    if missing:
        raise SystemExit('missing font weights: ' + ', '.join(missing))
    url = ('https://fonts.googleapis.com/css2?'
           + '&'.join('family=' + f.replace(' ', '+') + WEIGHTS[f] for f in sorted(fams))
           + '&display=swap')

    demos = []
    for d in C['DEMOS']:
        css, body, js = snippet(d['key'])
        demos.append(dict(d, css=css, body=body, js=js))

    data = '\n'.join([
        'var THEMES=%s;' % json.dumps(themes, ensure_ascii=False),
        'var STR=%s;' % json.dumps(C['STR'], ensure_ascii=False),
        'var PURPOSES=%s;' % json.dumps(C['PURPOSES'], ensure_ascii=False),
        'var FLOW=%s;' % json.dumps(C['FLOW'], ensure_ascii=False),
        'var DEMOS=%s;' % json.dumps(demos, ensure_ascii=False),
        'var MEDIA=%s;' % json.dumps(AS['cdn']),
        'var IMAGES=%s;' % json.dumps(AS['images'], ensure_ascii=False),
        'var VIDEOS=%s;' % json.dumps(AS['videos'], ensure_ascii=False),
    ]).replace('</script>', '<\\/script>')

    shell = open('site/shell.html', encoding='utf-8').read()
    out = shell.replace('__FONTS__', url).replace('/*__DATA__*/', data)
    os.makedirs(OUT, exist_ok=True)
    open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(out)
    print(f'themes {len(themes)}  demos {len(demos)}  fonts {len(fams)}  size {len(out)}')


if __name__ == '__main__':
    main()
