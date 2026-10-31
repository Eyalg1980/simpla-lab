/*
  Simpla client logos, shared by simpla-object, simpla-night and simpla-canvas.

  Every logo lives in ONE sprite on the Higgsfield CDN (CORS is open there), drawn as a CSS mask,
  so each logo takes the page's own text colour and works in light and dark mode.
  Sprite: 1206 x 1792, one logo per 128px row, each logo 120px tall, left aligned at x=0.
  Logos were pulled from each company's own site (or the Wayback Machine for Moonshot and ADVFN),
  flattened to one colour, and Backstage, Juganu, Tetrisponse and ADVFN were traced from raster.
  Cyberpeople is a typographic placeholder until we have the real file.

  Usage: SimplaClients.render(container, { groups: ["adopt", "lab", "clients"], notes: true, lang: "he" | "en" })
  Markup: .cl-groups > .cl-group > (.cl-h > .cl-t + .cl-en) + ul.cl-row > li.cl-item > (.lg + .cl-note)
  Each site styles the layout; this file only injects the mask rules for .lg.
*/
(function () {
  "use strict";
  var SPRITE = "https://d2ol7oe51mr4n9.cloudfront.net/user_348jNuehm4zmcU1si73jLXDcXDZ/fb4d0027-19fc-4d1c-a29f-77a752149bc4.png";
  var SW = 1206, ROW = 128, LH = 120;

  // i = sprite row, w = logo width at 120px, s = optical scale so wide and compact marks read the same size
  var LOGOS = {
    cyabra:      { name: "Cyabra",      i: 0,  w: 349,  s: 1.0 },
    empathy:     { name: "Empathy",     i: 1,  w: 472,  s: 0.92 },
    connecteam:  { name: "Connecteam",  i: 2,  w: 1062, s: 0.6 },
    moonshot:    { name: "Moonshot",    i: 3,  w: 649,  s: 0.74 },
    finout:      { name: "Finout",      i: 4,  w: 477,  s: 0.88 },
    monday:      { name: "monday.com",  i: 5,  w: 1206, s: 0.6 },
    lightricks:  { name: "Lightricks",  i: 6,  w: 550,  s: 0.84 },
    meitav:      { name: "מיטב דש",     i: 7,  w: 249,  s: 1.28 },
    juganu:      { name: "Juganu",      i: 8,  w: 484,  s: 0.9 },
    tipranks:    { name: "TipRanks",    i: 9,  w: 426,  s: 1.0 },
    backstage:   { name: "Backstage",   i: 10, w: 163,  s: 1.55 },
    tetrisponse: { name: "Tetrisponse", i: 11, w: 322,  s: 1.12 },
    cyberpeople: { name: "Cyberpeople", i: 12, w: 744,  s: 0.68 },
    advfn:       { name: "ADVFN",       i: 13, w: 485,  s: 0.8 }
  };

  // items: [logo id, Hebrew note, English note]. titleEn is used by render(box, { lang: "en" })
  var GROUPS = {
    adopt:   { title: "הטמעת AI בארגונים", titleEn: "AI adoption in organizations", en: "AI ADOPTION",
               items: [["cyabra"], ["empathy"], ["connecteam"], ["moonshot"], ["finout"]] },
    lab:     { title: "סדנאות", titleEn: "Workshops", en: "WORKSHOPS",
               items: [["monday"], ["lightricks"], ["meitav"]] },
    clients: { title: "לקוחות ופרויקטים", titleEn: "Clients and projects", en: "CLIENTS",
               items: [["juganu", "לקוח", "Client"], ["tipranks", "לקוח וסדנה", "Client and workshop"], ["advfn", "לקוח", "Client"],
                       ["backstage", "פרויקט", "Project"], ["tetrisponse", "סייבר", "Cyber"], ["cyberpeople", "סייבר", "Cyber"]] }
  };

  var css =
    ".lg{--lh:calc(var(--lgh,30px) * var(--s,1));display:block;flex:0 0 auto;height:var(--lh);" +
    "width:calc(var(--lh) * var(--w) / " + LH + ");background-color:currentColor;" +
    "-webkit-mask-image:url(" + SPRITE + ");mask-image:url(" + SPRITE + ");" +
    "-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;" +
    "-webkit-mask-size:calc(var(--lh) * " + SW + " / " + LH + ") auto;mask-size:calc(var(--lh) * " + SW + " / " + LH + ") auto;" +
    "-webkit-mask-position:0 calc(var(--lh) * var(--i) * -" + ROW + " / " + LH + ");" +
    "mask-position:0 calc(var(--lh) * var(--i) * -" + ROW + " / " + LH + ")}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  function logo(id) {
    var L = LOGOS[id], s = el("span", "lg");
    s.setAttribute("role", "img"); s.setAttribute("aria-label", L.name); s.title = L.name;
    s.style.setProperty("--i", L.i); s.style.setProperty("--w", L.w); s.style.setProperty("--s", L.s);
    return s;
  }

  function render(box, opts) {
    opts = opts || {};
    var ids = opts.groups || ["adopt", "lab", "clients"], isEn = opts.lang === "en";
    var wrap = el("div", "cl-groups");
    ids.forEach(function (gid) {
      var g = GROUPS[gid]; if (!g) return;
      var grp = el("div", "cl-group"); grp.dataset.group = gid;
      if (opts.heads !== false) {
        var h = el("p", "cl-h");
        h.appendChild(el("span", "cl-t", isEn ? g.titleEn : g.title));
        if (!isEn) h.appendChild(el("span", "cl-en", g.en));
        grp.appendChild(h);
      }
      var ul = el("ul", "cl-row");
      ul.setAttribute("aria-label", isEn ? g.titleEn : g.title);
      g.items.forEach(function (it) {
        var li = el("li", "cl-item");
        li.appendChild(logo(it[0]));
        var note = isEn ? it[2] : it[1];
        if (opts.notes !== false && note) li.appendChild(el("span", "cl-note", note));
        ul.appendChild(li);
      });
      grp.appendChild(ul);
      wrap.appendChild(grp);
    });
    box.appendChild(wrap);
    return wrap;
  }

  window.SimplaClients = { render: render, logo: logo, LOGOS: LOGOS, GROUPS: GROUPS };
})();
