/* Builds data.js and data-staff.js for jb53500-2027 from the live course site jb53500/index.html.
   The classic site stays the single source of truth: edit the morning there, then run
     node jb53500-2027/tools/build.js
   from the simpla-lab root. Needs Node and Playwright (npm i -g playwright).
   The evening edition is read after the classic page has generated it, so both editions stay in sync. */
const path = require('path');
const fs = require('fs');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/npm-tools/node_modules/playwright')); }

const ROOT = path.resolve(__dirname, '..', '..');
const SRC = path.join(ROOT, 'jb53500', 'index.html');
const OUT = path.join(ROOT, 'jb53500-2027');

/* Morning dates, from jb53500-plan. Meetings 11 to 20 are marked there as estimated. */
const DATES = { 1: '2026-09-07', 2: '2026-09-09', 3: '2026-09-14', 4: '2026-09-16', 5: '2026-09-23', 6: '2026-10-05',
  7: '2026-10-07', 8: '2026-10-14', 9: '2026-10-19', 10: '2026-10-21', 11: '2026-10-26', 12: '2026-10-28',
  13: '2026-11-02', 14: '2026-11-04', 15: '2026-11-09', 16: '2026-11-11', 17: '2026-11-16', 18: '2026-11-18',
  19: '2026-11-23', 20: '2026-11-25' };
const ESTIMATED_FROM = 11;

(async () => {
  const b = await chromium.launch(fs.existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {});
  const p = await b.newPage();
  await p.goto('file://' + SRC);
  const data = await p.evaluate(() => {
    enterAs('owner');
    const fix = h => (h || '')
      .replace(/(src|href)="files\//g, '$1="../jb53500/files/')
      .replace(/\sstyle="[^"]*"/g, '')
      .replace(/<div class="thint">[\s\S]*?<\/div>/g, '')
      .replace(/\s(role|tabindex|aria-expanded|data-b|onclick)="[^"]*"/g, '');
    const txt = el => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
    const secTitle = s => txt(s.querySelector(':scope > h2 .stt') || s.querySelector(':scope > h2'));
    const body = s => s.querySelector(':scope > .sec-body') || s;

    /* a lecturer board: one meeting (morning) or one evening */
    function board(s, mod) {
      const h = secTitle(s), m = h.match(/^(מפגש|ערב)\s+(\d+):\s*(.*)$/);
      const kind = m[1] === 'ערב' ? 'eve' : 'morn', n = +m[2], title = m[3];
      const bd = body(s).cloneNode(true);
      const out = { kind, n, mod, title, status: [], lead: '', rows: [], cards: [], prompts: [], rest: '' };
      bd.querySelectorAll(':scope > .callout').forEach(c => {
        const t = txt(c.querySelector('b'));
        if (/^בוצע|^מה נסגר/.test(t)) { out.status.push(fix(c.innerHTML)); c.remove(); }
      });
      const lead = bd.querySelector(':scope > p.lead'); if (lead) { out.lead = fix(lead.innerHTML); lead.remove(); }
      const goal = bd.querySelector(':scope > .eve-goal'); if (goal) { out.goal = fix(goal.innerHTML); goal.remove(); }
      const tb = [...bd.querySelectorAll('table')].find(t => /שעה/.test(txt(t.rows[0])) && /דקות/.test(txt(t.rows[0])));
      if (tb) {
        out.cols = [...tb.rows[0].cells].map(c => txt(c));
        [...tb.rows].slice(1).forEach(tr => {
          const c = tr.cells; if (c.length < 3) return;
          const src = tr.querySelector('.eve-src'); const srcT = txt(src); if (src) src.remove();
          out.rows.push({ t: txt(c[0]), d: parseInt(txt(c[1]), 10) || 0, what: fix(c[2].innerHTML), how: c[3] ? fix(c[3].innerHTML) : '',
            kind: tr.classList.contains('eve-brk') || /^הפסק/.test(txt(c[2])) ? 'brk' : (tr.classList.contains('eve-ws') ? 'ws' : ''), src: srcT });
        });
        (tb.closest('.twx') || tb).remove();
      }
      const endP = bd.querySelector(':scope > .eve-end'); if (endP) { out.end = txt(endP); endP.remove(); }
      bd.querySelectorAll('.scard').forEach(c => {
        const sn = txt(c.querySelector('.sn')), tm = sn.match(/(\d{1,2}:\d{2})/), dm = sn.match(/(\d+)\s*דקות/);
        out.cards.push({ deck: c.dataset.deck || '', t: tm ? tm[1] : '', d: dm ? +dm[1] : 0, h: txt(c.querySelector('b')),
          s: txt([...c.querySelectorAll('span')].reverse().find(x => !x.querySelector('*') && !x.classList.contains('sn'))) });
      });
      bd.querySelectorAll('.scards').forEach(x => x.remove());
      bd.querySelectorAll('.ptpl').forEach(x => {
        out.prompts.push({ id: (x.querySelector('pre') || {}).id || '', label: txt(x.querySelector('.ptpl-bar > span')), text: (x.querySelector('pre') || {}).textContent || '' });
        x.remove();
      });
      out.rest = fix(bd.innerHTML).trim();
      return out;
    }

    const boards = [], lectGeneral = [];
    document.querySelectorAll('[id^="tp-m"]').forEach(pane => {
      const mod = +pane.id.replace('tp-m', '');
      pane.querySelectorAll(':scope > section.sect').forEach(s => {
        const h = secTitle(s);
        if (/^(מפגש|ערב)\s+\d+:/.test(h)) boards.push(board(s, mod));
        else lectGeneral.push({ mod, edo: s.dataset.edo || '', title: h, html: fix(body(s).innerHTML) });
      });
      const intro = pane.querySelector(':scope > [data-edo="morn"]:not(section)');
      if (intro) lectGeneral.unshift({ mod, edo: 'morn', title: 'פתיח המודול', intro: true, html: fix(intro.innerHTML) });
    });
    const gen = document.getElementById('tp-gen');
    const tpGen = [...gen.querySelectorAll(':scope > section.sect')].map(s => ({ title: secTitle(s), html: fix(body(s).innerHTML) }));

    const panes = id => {
      const el = document.getElementById(id); if (!el) return [];
      const out = [];
      const lead = el.querySelector(':scope > .plead'); if (lead) out.push({ title: '', lead: true, html: fix(lead.innerHTML) });
      el.querySelectorAll(':scope > section.sect').forEach(s => out.push({ title: secTitle(s), edo: s.dataset.edo || '', html: fix(body(s).innerHTML) }));
      return out;
    };

    /* every practice prompt on the site, once */
    const seen = new Set(), prompts = [];
    document.querySelectorAll('.ptpl').forEach(x => {
      const pre = x.querySelector('pre'); if (!pre) return;
      const t = pre.textContent.trim(); if (!t || seen.has(t)) return; seen.add(t);
      const label = txt(x.querySelector('.ptpl-bar > span'));
      const sec = x.closest('section.sect'); const st = sec ? secTitle(sec) : '';
      let n = (label.match(/מפגש\s+(\d+)/) || st.match(/^מפגש\s+(\d+)/) || [])[1];
      const area = (x.closest('.page') || {}).id || '';
      prompts.push({ id: pre.id, label, text: t, n: n ? +n : null, sec: st, area });
    });

    const mk = document.getElementById('p-marketing');
    return {
      T, TX, TIMG: [...TIMG], DECKS, DKMETA, SUBS, PREP, PROJECTMAP, TOOLS, TOOLCATS, EX, CATS, MODS, HERO,
      ED: { morn: ED.morn, eve: ED.eve }, EVE: { map: EVE.map, split: EVE.split, min: EVE.min, start: EVE.start },
      syllabusLinks: panes('sy-l'), syllabusMap: panes('sy-m'), prepPane: panes('sy-r'),
      project: ['pj-w', 'pj-t', 'pj-j', 'pj-s', 'pj-b'].map(id => ({ id, tab: txt(document.querySelector('[aria-controls="' + id + '"] b, #tb-' + id + ' b')) || txt(document.getElementById('tb-' + id)), sections: panes(id) })),
      toolTables: panes('tl-t'), examples: panes('tl-x'), promptGuide: panes('tl-p').slice(0, 2),
      prompts, boards, lectGeneral, tpGen,
      marketing: mk ? fix(mk.innerHTML) : '',
      version: (document.body.innerHTML.match(/(\d{1,2}\.\d{1,2}[a-z]?)<br>/) || [])[1] || ''
    };
  });
  await b.close();

  const staff = { boards: data.boards, lectGeneral: data.lectGeneral, tpGen: data.tpGen, marketing: data.marketing };
  delete data.boards; delete data.lectGeneral; delete data.tpGen; delete data.marketing;
  data.DATES = DATES; data.ESTIMATED_FROM = ESTIMATED_FROM; data.built = new Date().toISOString().slice(0, 10);
  const banner = '/* generated by tools/build.js from jb53500/index.html, do not edit by hand */\n';
  fs.writeFileSync(path.join(OUT, 'data.js'), banner + 'window.D=' + JSON.stringify(data) + ';\n');
  fs.writeFileSync(path.join(OUT, 'data-staff.js'), banner + 'window.DS=' + JSON.stringify(staff) + ';\n');
  const kb = f => Math.round(fs.statSync(path.join(OUT, f)).size / 1024) + 'KB';
  console.log('data.js', kb('data.js'), 'data-staff.js', kb('data-staff.js'),
    'boards', staff.boards.length, 'prompts', data.prompts.length, 'decks', Object.keys(data.DECKS).length, 'concepts', data.T.length);
})();
