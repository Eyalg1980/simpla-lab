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
    { key: 'mood',     title: 'אווירה והלך רוח', open: false },
    { key: 'story',    title: 'סיפור רקע',       open: false },
    { key: 'vo',       title: 'קריינות',         open: true  },
    { key: 'shots',    title: 'שוט-ליסט',        open: true  },
    { key: 'notes',    title: 'הערות הפקה',      open: true  }
  ];

  var RATIO = (S.shots && S.shots.ratios && S.shots.ratios.def) || null;
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
        '<svg viewBox="0 0 24 24"><path d="M15 5 8 12l7 7"/></svg></a>' +
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

  function voBlock() {
    return (S.vo || []).map(function (v) {
      return '<div class="vo"><span class="t">' + esc(v.t) + '</span><p>' + esc(v.text) + '</p>' +
             (v.en ? '<p class="en">' + esc(v.en) + '</p>' : '') + '</div>';
    }).join('');
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
    return ratioSwitch() + list.map(function (s) {
      var img = typeof s.img === 'string' ? s.img : (s.img && (s.img[RATIO] || s.img[Object.keys(s.img)[0]]));
      var pr = shotPrompts(s);
      return '<div class="shot">' +
        '<div class="frame"><img src="' + esc((S.cdn || '') + img) + '" alt="שוט ' + s.n + '" loading="lazy">' +
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

  function body(key) {
    if (key === 'synopsis') return dirBlock(S.synopsis, 'synopsis');
    if (key === 'mood') return dirBlock(S.mood, 'mood');
    if (key === 'story') return dirBlock(S.story, 'story');
    if (key === 'vo') return voBlock();
    if (key === 'shots') return shotsBlock();
    if (key === 'notes') return notesBlock();
    return '';
  }

  function has(key) {
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
