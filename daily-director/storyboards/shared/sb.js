/* Daily Director · storyboard template runtime.
   Every inner page defines window.SB and includes this file.
   The SECTION ORDER IS FIXED HERE, never in the page, so all pages match. */
(function () {
  var S = window.SB || {};
  var CHEV = '<svg viewBox="0 0 20 20"><path d="m5 12.5 5-5 5 5"/></svg>';
  var BOX = '<svg viewBox="0 0 24 24"><path d="M3.4 8.2 20.4 5.6M3.4 8.2 4.9 17.9C5 18.9 5.9 19.6 6.9 19.4L19.5 17.5C20.5 17.4 21.2 16.4 21 15.4L19.6 6.1M3.4 8.2 3 5.6 20 3.1 20.4 5.6M8.2 7.5 6.2 4.3M13.2 6.7 11.3 3.6M18 6 16.2 2.9"/></svg>';

  // Fixed order for every storyboard page. Collapsed by default where open:false.
  var ORDER = [
    { key: 'synopsis', title: 'סינופסיס',        open: false },
    { key: 'shots',    title: 'שוט-ליסט',        open: true  },
    { key: 'vo',       title: 'קריינות ודיאלוג', open: true  },
    { key: 'mood',     title: 'אווירה והלך רוח', open: false },
    { key: 'story',    title: 'סיפור רקע',       open: false },
    { key: 'notes',    title: 'הערות הפקה',      open: false }
  ];

  var RATIO = (S.shots && S.shots.ratios && S.shots.ratios.def) || null;
  var MEDIA = 'img';   // shot list shows stills by default, video only on demand
  var STORE = 'sb-' + (location.pathname.split('/').filter(Boolean).pop() || 'sb');

  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function openSet() {
    try {
      var raw = localStorage.getItem(STORE);
      if (raw === null) return null;              // never opened before, use the defaults
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? new Set(arr) : null;
    } catch (e) { return null; }
  }
  function saveOpen(set) { try { localStorage.setItem(STORE, JSON.stringify([].concat(Array.from(set)))); } catch (e) {} }

  var stored = openSet();
  var openState = {};
  ORDER.forEach(function (s) { openState[s.key] = stored ? stored.has(s.key) : s.open; });
  if (!stored) { var init = new Set(); ORDER.forEach(function (s) { if (s.open) init.add(s.key); }); saveOpen(init); }

  /* ---------------- builders ---------------- */

  function appbar() {
    return '<div class="appbar">' +
      '<a class="back" href="../../" aria-label="חזרה להבמאי היומי">' +
        '<svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>' +
      '<div class="logo">' + BOX + '<span class="wm"><b>daily</b> <i>director</i></span></div>' +
      '<div class="spacer"></div>' +
    '</div>';
  }

  function hero() {
    return '<div class="kicker">' + esc(S.kicker || 'STORYBOARD') + '</div>' +
      '<h1>' + esc(S.titleTop || '') + '<br><span class="mark">' + esc(S.titleMark || '') + '</span></h1>' +
      '<p class="logline">' + esc(S.logline || '') + '</p>' +
      (S.loglineEn ? '<p class="logline-en">' + esc(S.loglineEn) + '</p>' : '') +
      '<div class="specs">' + (S.specs || []).map(function (x) {
        return '<span class="spec">' + esc(x) + '</span>';
      }).join('') + '</div>';
  }

  // The finished film, when there is one, sits above the whole storyboard.
  function film() {
    if (!S.film) return '';
    var cls = 'film' + (S.film.ratio === '1' ? ' r1' : S.film.ratio === '9' ? ' r9' : '');
    var inner = S.film.youtube
      ? '<iframe src="https://www.youtube.com/embed/' + esc(S.film.youtube) + '" allowfullscreen loading="lazy"></iframe>'
      : '<video src="' + esc(S.film.src) + '" controls playsinline preload="metadata"></video>';
    return '<div class="' + cls + '">' + inner + '</div>';
  }

  function dirBlock(d, key) {
    if (!d) return '';
    var h = '<div class="dir"><h3>' + esc(d.h3 || '') + '</h3>';
    (d.paras || []).forEach(function (p, i) {
      h += '<p' + (i === 0 ? ' id="' + key + '-text"' : '') + '>' + esc(p) + '</p>';
    });
    (d.rows || []).forEach(function (r) {
      h += '<div class="row"><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span></div>';
    });
    if (d.rules && d.rules.length) {
      h += '<div class="rule">' + d.rules.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>';
    }
    if (d.en) {
      h += '<details><summary>' + esc(d.enLabel || 'English') + '</summary>' +
           '<pre id="' + key + '-en">' + esc(d.en) + '</pre>' +
           '<button class="copy ghost" onclick="sbCopyEl(\'' + key + '-en\')">' + esc(d.enCopyLabel || 'Copy English') + '</button></details>';
    }
    h += '<button class="copy" onclick="sbCopyBlock(\'' + key + '\')">' + esc(d.copyLabel || 'העתק') + '</button></div>';
    return h;
  }

  // A recorded voice-over line gets a player. `audio` is a filename under S.cdn,
  // or a full URL. `sec` is the real recorded length, which is what the edit needs.
  function voBlock() {
    return (S.vo || []).map(function (v) {
      var a = v.audio || v.mp3;
      var src = a && (/^https?:/.test(a) ? a : (S.cdn || '') + a);
      return '<div class="vo"><span class="t">' + esc(v.t) + '</span><p>' + esc(v.text) + '</p>' +
             (v.en ? '<p class="en">' + esc(v.en) + '</p>' : '') +
             // The player appears only for a line that has a recording, so older boards
             // are untouched. `audio` and `mp3` are the same thing, two sessions named it
             // differently; both are honoured so neither set of pages breaks.
             (src ? '<audio src="' + esc(src) + '" controls preload="none"></audio>' : '') +
             (v.sec ? '<span class="sec">' + esc(v.sec) + '</span>' : '') +
             (v.note ? '<p class="vo-note">' + esc(v.note) + '</p>' : '') + '</div>';
    }).join('');
  }

  function hasClips() {
    return ((S.shots && S.shots.list) || []).some(function (s) { return !!s.vid; });
  }

  function mediaSwitch() {
    if (!hasClips()) return '';
    return '<div class="ratio media">' +
      '<button class="' + (MEDIA === 'img' ? 'on' : '') + '" onclick="sbSetMedia(\'img\')">תמונות</button>' +
      '<button class="' + (MEDIA === 'vid' ? 'on' : '') + '" onclick="sbSetMedia(\'vid\')">וידאו</button>' +
    '</div>';
  }

  function ratioSwitch() {
    var r = S.shots && S.shots.ratios;
    if (!r) return '';
    return '<div class="ratio">' + r.options.map(function (o) {
      return '<button class="' + (o === RATIO ? 'on' : '') + '" onclick="sbSetRatio(\'' + o + '\')">' + esc(o) + '</button>';
    }).join('') + '</div>' + (r.hint ? '<p class="ratio-hint">' + esc(r.hint) + '</p>' : '');
  }

  function shotPrompts(s) {
    if (S.shots && typeof S.shots.prompts === 'function') return S.shots.prompts(s, RATIO) || [];
    return [{ label: 'פרומפט', text: [S.shots && S.shots.style, s.prompt].filter(Boolean).join(', ') }];
  }

  function shotsBlock() {
    var list = (S.shots && S.shots.list) || [];
    return mediaSwitch() + ratioSwitch() + list.map(function (s) {
      var img = typeof s.img === 'string' ? s.img : (s.img && (s.img[RATIO] || s.img[Object.keys(s.img)[0]]));
      var pr = shotPrompts(s);
      // A clip only shows for the ratio it was actually rendered in. No fallback:
      // a square clip under the 16:9 switch would be a lie, so that ratio keeps the still.
      var vid = typeof s.vid === 'string' ? s.vid : (s.vid && s.vid[RATIO]);
      var media = (vid && MEDIA === 'vid')
        ? '<video src="' + esc((S.cdn || '') + vid) + '" poster="' + esc((S.cdn || '') + img) +
          '" controls playsinline preload="none"></video>'
        : '<img src="' + esc((S.cdn || '') + img) + '" alt="שוט ' + s.n + '" loading="lazy">';
      return '<div class="shot">' +
        '<div class="frame">' + media +
          '<div class="num">' + s.n + '</div><div class="dur">' + esc(s.dur) + '</div></div>' +
        '<div class="meta"><b>' + esc(s.title) + '</b>' +
          '<div class="cam">' + esc(s.cam) + '</div>' +
          '<span class="model">' + esc(s.model) + '</span>' +
          (s.type ? '<div class="title-on">כיתוב על המסך: <b>' + esc(s.type) + '</b></div>' : '') +
          '<details><summary>פרומפטים מלאים' + (RATIO ? ' · ' + RATIO : '') + '</summary>' +
            pr.map(function (p, i) {
              return '<div class="plabel">' + esc(p.label) + '</div>' +
                     '<pre id="sbp-' + s.n + '-' + i + '">' + esc(p.text) + '</pre>';
            }).join('') +
            '<div class="btnrow">' + pr.map(function (p, i) {
              return '<button class="copy' + (i ? ' ghost' : '') + '" onclick="sbCopyEl(\'sbp-' + s.n + '-' + i + '\')">' +
                     esc(p.btn || ('העתק ' + p.label.replace(/\s*\(.*\)\s*/, ''))) + '</button>';
            }).join('') + '</div>' +
          '</details>' +
        '</div></div>';
    }).join('');
  }

  function notesBlock() {
    if (!S.notes) return '';
    return '<div class="note"><b>' + esc(S.notes.title || '') + '</b><ul>' +
      (S.notes.items || []).map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') +
      '</ul></div>';
  }

  /* ---------------- master prompt ---------------- */

  function txt(d) {
    if (!d) return '';
    if (d.en) return d.en;
    var out = (d.paras || []).join('\n\n');
    (d.rows || []).forEach(function (r) { out += '\n- ' + r[0] + ': ' + r[1]; });
    if (d.rules && d.rules.length) out += '\nRules: ' + d.rules.join(' | ');
    return out;
  }

  function masterPrompt() {
    var L = [];
    var title = S.titleEn || [S.titleTop, S.titleMark].filter(Boolean).join(' ');
    L.push('FILM BRIEF: ' + title);
    L.push('');
    L.push('You are an AI film director. Produce the short film described below, exactly as specified. Everything after this line is the brief.');
    L.push('');
    L.push('## 1. LOGLINE');
    L.push(S.loglineEn || S.logline || '');
    L.push('');
    L.push('## 2. FORMAT');
    (S.specsEn || S.specs || []).forEach(function (x) { L.push('- ' + x); });
    L.push('');
    if (S.synopsis) { L.push('## 3. SYNOPSIS'); L.push(txt(S.synopsis)); L.push(''); }
    if (S.mood) { L.push('## 4. VISUAL STYLE, CAMERA AND MOOD'); L.push(txt(S.mood)); L.push(''); }
    if (S.shots && S.shots.style) { L.push('## 5. BASE STYLE STRING (repeat verbatim in every shot prompt)'); L.push(S.shots.style); L.push(''); }
    var list = (S.shots && S.shots.list) || [];
    if (list.length) {
      L.push('## 6. SHOT LIST (' + list.length + ' shots, in order)');
      list.forEach(function (s) {
        L.push('');
        L.push('### Shot ' + s.n + ' — ' + (s.titleEn || s.title) + ' — ' + (s.durEn || s.dur));
        if (s.camEn || s.cam) L.push('Camera: ' + (s.camEn || s.cam));
        if (s.model) L.push('Suggested model: ' + s.model);
        if (s.type) L.push('On screen text: ' + s.type);
        var pr = shotPrompts(s);
        pr.forEach(function (p) { L.push(p.label + ': ' + p.text); });
      });
      L.push('');
    }
    if ((S.vo || []).length) {
      L.push('## 7. DIALOGUE AND VOICE OVER (spoken language: see FORMAT)');
      (S.vo || []).forEach(function (v) {
        L.push('[' + v.t + '] ' + (v.en || v.text));
        if (v.en && v.text) L.push('   original: ' + v.text);
      });
      L.push('');
    }
    if (S.story) { L.push('## 8. BACKSTORY AND INTENT'); L.push(txt(S.story)); L.push(''); }
    if (S.notes) {
      L.push('## 9. PRODUCTION NOTES');
      var items = S.notes.itemsEn || S.notes.items || [];
      items.forEach(function (i) { L.push('- ' + i); });
      L.push('');
    }
    L.push('## 10. PRODUCTION GUIDANCE');
    L.push('- Lock the characters first: generate one master still per character, save it as a reusable reference element, and inject that reference into every single frame prompt. Never rely on a text description alone for continuity.');
    L.push('- Generate the opening still for each shot before any motion. Approve the stills as a set, then animate.');
    L.push('- Animate each shot image to video with the motion prompt above, keeping the approved still as the start frame.');
    L.push('- For a continuous camera move, extract the last frame of each clip and feed it as the start frame of the next clip. Do not fix continuity in the edit.');
    L.push('- Record spoken dialogue separately and lay it over the picture. Do not let the video model generate speech.');
    L.push('- Add all on screen text, subtitles and end cards in the edit, never inside the generated frames.');
    L.push('- Deliver at the format and duration listed above; trim inside shots rather than dropping a shot.');
    return L.join('\n');
  }

  function promptBlock() {
    return '<div class="promptbar">' +
      '<b>פרומפט נושא</b>' +
      '<p>כל התוכן של הדף באנגלית, בהיררכיה מלאה, כולל הנחיות הפקה. מוכן להדבקה למודל.</p>' +
      '<pre id="sb-master" hidden></pre>' +
      '<button class="copy" onclick="sbCopyMaster()">העתק פרומפט נושא</button>' +
    '</div>';
  }

  window.sbCopyMaster = function () { sbCopyText(masterPrompt()); };

  function body(key) {
    /* Synopsis is mandatory on every board. A page that ships without one says so
       on the page instead of quietly dropping the section. */
    if (key === 'synopsis') {
      if (!S.synopsis) return '<div class="dir"><p><b>חסר סינופסיס.</b> כל סטוריבורד חייב בלוק synopsis קצר: מה קורה בסרט ביט אחרי ביט, בקול של אייל, ומשפט תזה בסוף.</p></div>';
      return dirBlock(S.synopsis, 'synopsis');
    }
    if (key === 'mood') return dirBlock(S.mood, 'mood');
    if (key === 'story') return dirBlock(S.story, 'story');
    if (key === 'vo') return voBlock();
    if (key === 'shots') return shotsBlock();
    if (key === 'notes') return notesBlock();
    return '';
  }

  function has(key) {
    if (key === 'synopsis') return true;
    if (key === 'vo') return (S.vo || []).length > 0;
    if (key === 'shots') return ((S.shots && S.shots.list) || []).length > 0;
    return !!S[key];
  }

  function count(key) {
    if (key === 'shots') return ((S.shots && S.shots.list) || []).length + ' שוטים';
    if (key === 'vo') return (S.vo || []).length + ' מקטעים';
    return '';
  }

  function render() {
    var html = appbar() + hero() + film();
    ORDER.forEach(function (sec) {
      if (!has(sec.key)) return;
      var c = count(sec.key);
      html += '<div class="sec' + (openState[sec.key] ? '' : ' min') + '" id="sec-' + sec.key + '">' +
        '<div class="sec-h" onclick="sbToggle(\'' + sec.key + '\')">' +
          '<span class="t">' + esc(S.titles && S.titles[sec.key] || sec.title) + '</span>' +
          (c ? '<span class="cnt">' + esc(c) + '</span>' : '') +
          '<span class="chev">' + CHEV + '</span>' +
        '</div>' +
        '<div class="sec-b">' + body(sec.key) + '</div>' +
      '</div>';
    });
    html += promptBlock();
    html += '<footer>Simpla Lab · Daily Director</footer><div class="toast" id="sb-toast">הועתק</div>';
    document.getElementById('sb').innerHTML = html;
  }

  /* ---------------- interaction ---------------- */

  window.sbToggle = function (key) {
    openState[key] = !openState[key];
    var set = new Set();
    Object.keys(openState).forEach(function (k) { if (openState[k]) set.add(k); });
    saveOpen(set);
    document.getElementById('sec-' + key).classList.toggle('min', !openState[key]);
  };

  window.sbSetRatio = function (r) {
    RATIO = r;
    var el = document.querySelector('#sec-shots .sec-b');
    if (el) el.innerHTML = shotsBlock();
  };

  window.sbSetMedia = function (m) {
    MEDIA = m;
    var el = document.querySelector('#sec-shots .sec-b');
    if (el) el.innerHTML = shotsBlock();
  };

  window.sbCopyEl = function (id) {
    var el = document.getElementById(id);
    if (el) sbCopyText(el.textContent);
  };

  window.sbCopyBlock = function (kind) {
    var d = S[kind];
    if (!d) return;
    var parts = (d.paras || []).slice();
    (d.rows || []).forEach(function (r) { parts.push(r[0] + ': ' + r[1]); });
    if (d.rules && d.rules.length) parts.push('כללים: ' + d.rules.join(' · '));
    sbCopyText((d.copyHead ? d.copyHead + '\n\n' : '') + parts.join('\n\n'));
  };

  window.sbCopyText = function (t) {
    var done = function () {
      var el = document.getElementById('sb-toast');
      el.classList.add('on');
      setTimeout(function () { el.classList.remove('on'); }, 1600);
    };
    var fb = function () {
      var ta = document.createElement('textarea');
      ta.value = t; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      ta.remove(); done();
    };
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, fb); else fb();
  };

  render();
})();
