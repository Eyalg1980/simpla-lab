
  var WBY = {};
  WORKS.forEach(function (w) { WBY[w.id] = w; });
  function worksOf(node) { return WORKS.filter(function (w) { return w.nodes.indexOf(node) >= 0; }).map(function (w) { return w.id; }); }

  /* ================= helpers ================= */
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var ICONS = {
    play: '<path d="M8 5.5v13l10-6.5z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m5 12 4.5 4.5L19 7"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    text: '<path d="M5 6h14M5 12h10M5 18h7"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
    flow: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 6h7M6 8.5v3a4 4 0 0 0 4 4h5.5"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3.5 19c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5"/><circle cx="17" cy="9" r="2.3"/><path d="M16 14.6c2.2.1 3.8 1.5 4.5 4.4"/>',
    city: '<path d="M3 21h18M5 21V9l5-3v15M10 21V4l6 3v14M16 21v-9l3 1.5V21"/>',
    out: '<path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>',
    tv: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="m8 2 4 4 4-4"/>',
    zap: '<path d="M3 7h3.5c2 0 3.2 1 4.3 2.6l2.4 4.8C14.3 16 15.5 17 17.5 17H21"/><path d="M3 17h3.5c1.3 0 2.3-.5 3.1-1.3M14.4 8.3c.8-.8 1.8-1.3 3.1-1.3H21"/><path d="m18.5 4.5 2.5 2.5-2.5 2.5M18.5 14.5l2.5 2.5-2.5 2.5"/>',
    send: '<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/>'
  };
  function icon(name, sw) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.9) +
      '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>";
  }
  function setCnt(node, n, bump) {
    var was = node.textContent;
    node.textContent = String(n);
    node.className = "cnt" + (n ? "" : " z");
    if (bump && was !== String(n) && n) { void node.offsetWidth; node.classList.add("bump"); }
  }
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mobileQ = window.matchMedia("(max-width: 760px)");
  var deskQ = window.matchMedia("(min-width: 1024px)");
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  var RTL = document.documentElement.dir === "rtl";
  var KEY_FWD = RTL ? "ArrowLeft" : "ArrowRight", KEY_BACK = RTL ? "ArrowRight" : "ArrowLeft";

  // the language switch keeps the visitor in the same section of the other page
  Array.prototype.forEach.call(document.querySelectorAll("a[data-lang-switch]"), function (a) {
    a.addEventListener("click", function () {
      var h = location.hash;
      if (h && /^#[a-z]+$/.test(h) && document.getElementById(h.slice(1))) a.href = a.getAttribute("href").split("#")[0] + h;
    });
  });

  /* ================= theme + nav ================= */
  $("theme").addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", cur);
    store("simpla-hybrid-theme", cur);
  });
  var nav = $("nav"), stage = $("film");
  function navState() { nav.classList.toggle("solid", stage.getBoundingClientRect().bottom < 70); }

  /* ================= the route: one state, shared by film, canvas, gallery and TV ================= */
  var route = [];
  try { route = JSON.parse(store("simpla-hybrid-route") || "[]").filter(function (x) { return SOL[x]; }); } catch (e) { route = []; }
  var aud = store("simpla-hybrid-aud") || "";
  var listeners = [];
  function inRoute(id) { return route.indexOf(id) >= 0; }
  function setRoute(r, bump) {
    route = ALL.filter(function (x) { return r.indexOf(x) >= 0; });
    store("simpla-hybrid-route", JSON.stringify(route));
    listeners.forEach(function (f) { f(bump); });
  }
  function toggle(id) { var r = route.slice(), i = r.indexOf(id); if (i >= 0) r.splice(i, 1); else r.push(id); setRoute(r, true); }
  function mailRoute(subject) {
    var body = T.mailHello +
      route.map(function (id) { return "- " + SOL[id].title + " (" + SOL[id].name + ")"; }).join("\n") + T.mailAbout;
    return "mailto:studio@simplaux.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  var navCnt = $("navCnt");
  listeners.push(function (bump) {
    setCnt(navCnt, route.length, bump);
    $("routePill").setAttribute("aria-label", T.routeAria(route.length));
  });

  /* ================= 1. the film ================= */
  var media = $("media");
  var chapters = Array.prototype.slice.call(document.querySelectorAll(".chapter"));
  var cntEl = $("cnt"), rail = $("rail");
  var CUTS = mobileQ.matches ? FILM.cutsTall : FILM.cutsWide;
  var NCH = CUTS.length;
  var starts = [0].concat(CUTS.slice(0, NCH - 1));
  var total = FILM.weights.reduce(function (a, b) { return a + b; }, 0);
  var bounds = [], acc = 0;
  FILM.weights.forEach(function (w) { bounds.push([acc / total, (acc + w) / total]); acc += w; });

  var fills = [], railBtns = [];
  FILM.rail.forEach(function (name, i) {
    var b = el("button"); b.type = "button";
    b.setAttribute("aria-label", T.chapter + (i + 1) + ", " + name);
    var bar = el("span", "bar"), f = el("span", "fill"); bar.appendChild(f); b.appendChild(bar);
    var lab = el("span"); lab.appendChild(el("span", "num", "0" + (i + 1))); lab.appendChild(document.createTextNode(name));
    lab.appendChild(el("span", "dot")); b.appendChild(lab);
    b.addEventListener("click", function () { goChapter(i); });
    rail.appendChild(b); fills.push(f); railBtns.push(b);
  });
  function goChapter(i) {
    if (staticMode) { chapters[i].scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); return; }
    var span = stage.offsetHeight - window.innerHeight;
    var p = i === 0 ? 0 : (bounds[i][0] + bounds[i][1]) / 2;
    window.scrollTo({ top: stage.offsetTop + p * span, behavior: reduce ? "auto" : "smooth" });
  }

  var video = null, poster = null, staticMode = reduce;
  var current = -1, target = 0, shown = 0, inView = true, running = false;
  function show(k) {
    if (k === current) return;
    current = k;
    chapters.forEach(function (c, i) { c.classList.toggle("on", i === k); });
    railBtns.forEach(function (b, i) { b.classList.toggle("on", i === k); });
    cntEl.textContent = "0" + (k + 1);
  }
  function progress() {
    var rect = stage.getBoundingClientRect(), span = stage.offsetHeight - window.innerHeight;
    return span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
  }
  function computeTarget() {
    var p = progress(), k = NCH - 1;
    for (var b = 0; b < NCH; b++) { if (p < bounds[b][1]) { k = b; break; } }
    show(k);
    var local = Math.min(1, Math.max(0, (p - bounds[k][0]) / (bounds[k][1] - bounds[k][0])));
    for (var r = 0; r < NCH; r++) fills[r].style.width = ((r < k ? 1 : r > k ? 0 : local) * 100) + "%";
    target = starts[k] + local * (CUTS[k] - starts[k]);
  }
  function tick() {
    running = false;
    if (!video) return;
    var d = video.duration;
    if (!d || !isFinite(d)) { loop(); return; }
    var t = Math.min(target, d - 0.04);
    shown += (t - shown) * 0.22;
    if (Math.abs(t - shown) < 0.004) shown = t;
    if (!video.seeking && Math.abs(video.currentTime - shown) > 0.02) { try { video.currentTime = shown; } catch (e) {} }
    if (Math.abs(t - shown) > 0.004 || video.seeking) loop();
  }
  function loop() { if (!running && inView) { running = true; requestAnimationFrame(tick); } }
  function buildFilm() {
    var tall = mobileQ.matches;
    poster = el("img"); poster.alt = "";
    poster.src = tall ? FILM.posterTall : FR[0];
    poster.setAttribute("fetchpriority", "high");
    media.appendChild(poster);
    video = document.createElement("video");
    video.muted = true; video.defaultMuted = true;
    video.playsInline = true; video.setAttribute("playsinline", ""); video.setAttribute("webkit-playsinline", "");
    video.preload = "auto";
    video.src = tall ? FILM.tall : FILM.wide;
    media.insertBefore(video, poster);
    var primed = false;
    function prime() {
      if (primed) return; primed = true;
      var pr = video.play();
      if (pr && pr.then) pr.then(function () { video.pause(); onScroll(); }).catch(function () {}); else video.pause();
    }
    video.addEventListener("loadeddata", function () {
      prime();
      computeTarget(); shown = target;
      try { video.currentTime = shown; } catch (e) {}
      video.addEventListener("seeked", function once() { video.removeEventListener("seeked", once); poster.classList.add("gone"); });
      setTimeout(function () { poster.classList.add("gone"); }, 1200);
    });
    video.addEventListener("error", function () { goStatic(); });
    window.addEventListener("touchstart", prime, { passive: true, once: true });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { inView = es[0].isIntersecting; if (inView) loop(); }).observe(stage);
    }
  }
  function goStatic() {
    staticMode = true;
    stage.classList.add("static"); stage.style.height = "";
    chapters.forEach(function (c, i) {
      if (FR[i] && !c.querySelector(":scope > img")) { var im = el("img"); im.src = FR[i]; im.alt = ""; im.loading = "lazy"; c.appendChild(im); }
    });
  }
  function sizeStage() { if (!staticMode) stage.style.height = (total * (mobileQ.matches ? 88 : 100)) + "vh"; }
  if (staticMode) goStatic(); else { sizeStage(); buildFilm(); }
  mobileQ.addEventListener && mobileQ.addEventListener("change", function () { location.reload(); });

  // every service chapter can drop its node into the route
  var chAdds = Array.prototype.slice.call(document.querySelectorAll(".ch-add"));
  chAdds.forEach(function (b) { b.addEventListener("click", function () { toggle(b.dataset.sol); }); });
  listeners.push(function () {
    chAdds.forEach(function (b) {
      var on = inRoute(b.dataset.sol);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = icon(on ? "check" : "plus", 2.2) + "<span>" + (on ? T.inYourRoute : T.addToRoute) + "</span>";
      if (on) { var c = el("span", "cnt", String(route.length)); b.appendChild(c); }
    });
    railBtns.forEach(function (b, i) { var n = NODES[i]; b.classList.toggle("r", n.kind === "sol" && inRoute(n.id)); });
  });

  /* ================= 2. clients ================= */
  if (window.SimplaClients) {
    window.SimplaClients.render($("clientsBox"), { lang: T.lang });
    window.SimplaClients.render($("wvLogos"), { groups: ["adopt"], heads: false, lang: T.lang });
  }

  /* ================= 3. the canvas ================= */
  var board = $("board"), nodesBox = $("nodes"), wiresSvg = $("wires"), summary = $("summary");
  var inspInfo = $("inspInfo"), monBox = $("mon"), monStill = $("monStill"), monTag = $("monTag");
  var promptEl = null, selected = 1, desk = deskQ.matches;
  var PLAY = icon("play", 2);

  function thumbs(ids, max) {
    var box = el("div", "wthumbs"); max = max || 4;
    ids.slice(0, max).forEach(function (id, k) {
      var w = WBY[id], b = el("button", "wthumb"); b.type = "button";
      b.setAttribute("aria-label", T.watch + (w.client ? w.client + ", " : "") + w.title);
      var im = el("img"); im.src = w.poster; im.alt = ""; im.loading = "lazy"; b.appendChild(im);
      b.insertAdjacentHTML("beforeend", PLAY);
      if (k === max - 1 && ids.length > max) b.appendChild(el("span", "more", "+" + (ids.length - max)));
      b.addEventListener("click", function (e) { e.stopPropagation(); openWork(id, ids); });
      box.appendChild(b);
    });
    return box;
  }

  // presets: where you come from loads a route
  var presets = $("presets"), presetBtns = [];
  AUDIENCES.forEach(function (a) {
    var b = el("button", "chip", a.chip); b.type = "button"; b.dataset.id = a.id;
    b.addEventListener("click", function () {
      aud = a.id; store("simpla-hybrid-aud", a.id);
      setRoute(a.mods, true); paintPresets(); typePrompt();
      if (desk) select(0); else goNode(0);
    });
    presets.appendChild(b); presetBtns.push(b);
  });
  function paintPresets() { presetBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.id === aud ? "true" : "false"); }); }
  paintPresets();
  function audience() { return AUDIENCES.filter(function (x) { return x.id === aud; })[0] || null; }

  var nodeEls = [];
  NODES.forEach(function (n, i) {
    var card = el("article", "node"); card.dataset.i = i; card.dataset.id = n.id;
    var s = SOL[n.id];
    var hd = el("div", "n-hd");
    if (n.kind === "input") hd.innerHTML = icon("text") + "<span>INPUT · TEXT</span>";
    else if (n.kind === "output") hd.innerHTML = icon("out") + "<span>OUTPUT · OBJECT</span>";
    else hd.innerHTML = icon(s.icon) + "<span>" + s.tag + " · 0" + i + "</span>";
    hd.appendChild(el("span", "rt", T.inRoute));
    card.appendChild(hd);

    var main = el("button", "n-main"); main.type = "button";
    var md = el("span", "n-media");
    if (n.kind === "input") { promptEl = el("span", "n-prompt"); md.appendChild(promptEl); }
    else { var im = el("img"); im.src = FR[i]; im.alt = ""; im.loading = "lazy"; im.decoding = "async"; md.appendChild(im); }
    main.appendChild(md);
    var bd = el("span", "n-bd");
    if (n.kind === "input") { bd.appendChild(el("b", "n-t", T.inputTitle)); bd.appendChild(el("span", "n-one", T.inputOne)); }
    else if (n.kind === "output") { bd.appendChild(el("b", "n-t", T.outputTitle)); bd.appendChild(el("span", "n-one", T.outputOne)); }
    else { bd.appendChild(el("b", "n-t", s.title)); bd.appendChild(el("span", "n-nm en", s.name)); bd.appendChild(el("span", "n-one", s.one)); }
    main.appendChild(bd);
    main.setAttribute("aria-label", n.kind === "sol" ? s.title + T.detailsSuffix : n.kind === "input" ? T.inputTitle : T.outputTitle);
    main.addEventListener("click", function () {
      if (desk) { select(i); return; }
      if (i !== cur) goNode(i); else if (det) det.click();
    });
    card.appendChild(main);

    var ft = el("div", "n-ft"), det = null;
    if (n.kind === "sol") {
      var add = el("button", "n-add"); add.type = "button"; add.dataset.id = n.id;
      add.addEventListener("click", function () { toggle(n.id); });
      ft.appendChild(add);
      var wl = worksOf(n.id);
      var wk = el("span", "n-works"); wk.appendChild(document.createTextNode(T.works)); wk.appendChild(el("span", wl.length ? "cnt" : "cnt z", String(wl.length)));
      ft.appendChild(wk);
    } else if (n.kind === "output") {
      var go = el("a", "n-go", T.toAir); go.href = "#onair"; ft.appendChild(go);
    } else {
      var ch = el("a", "n-go", T.changeInput); ch.href = "#presets"; ft.appendChild(ch);
    }
    if (n.kind === "sol") {
      det = el("button", "n-det"); det.type = "button"; det.setAttribute("aria-expanded", "false");
      det.innerHTML = '<span class="pm">+</span><span>' + T.details + '</span>';
      det.addEventListener("click", function () {
        var o = !card.classList.contains("open"); card.classList.toggle("open", o);
        det.setAttribute("aria-expanded", o ? "true" : "false"); det.firstChild.textContent = o ? "-" : "+";
      });
      ft.appendChild(det);
    }
    card.appendChild(ft);
    if (n.kind === "sol") {
      var more = el("div", "n-more");
      more.appendChild(el("p", null, s.text));
      var ul = el("ul", "pills"); s.gets.forEach(function (g) { ul.appendChild(el("li", null, g)); }); more.appendChild(ul);
      more.appendChild(el("p", "who", s.who));
      var wl2 = worksOf(n.id); if (wl2.length) more.appendChild(thumbs(wl2, 4));
      card.appendChild(more);
    }
    nodesBox.appendChild(card); nodeEls.push(card);
  });

  // typing prompt in the input node
  var typeTimer = 0;
  function typePrompt() {
    clearTimeout(typeTimer);
    var a = audience(), txt = a ? a.problem : DEFAULT_PROMPT;
    if (reduce) { promptEl.textContent = txt; return; }
    var k = 0;
    (function step() {
      promptEl.textContent = txt.slice(0, k);
      promptEl.appendChild(el("span", "caret"));
      if (k < txt.length) { k += 2; typeTimer = setTimeout(step, 26); }
    })();
  }
  typePrompt();

  // summary: the route, as the output node feeding the TV
  function paintSummary(bump) {
    summary.innerHTML = "";
    var hd = el("div", "n-hd"); hd.innerHTML = icon("tv") + "<span>OUTPUT · ON AIR</span>"; summary.appendChild(hd);
    var h = el("h3"); h.appendChild(document.createTextNode(T.yourRoute));
    var c = el("span", "cnt"); setCnt(c, route.length, bump); h.appendChild(c); summary.appendChild(h);
    if (!route.length) {
      summary.appendChild(el("p", "s-empty", T.emptyRoute));
    } else {
      var ol = el("ol", "chain");
      route.forEach(function (id) {
        var li = el("li"); li.appendChild(el("span", null, SOL[id].title));
        var x = el("button", "x"); x.type = "button"; x.innerHTML = icon("x", 2.2); x.setAttribute("aria-label", T.remove + SOL[id].title);
        x.addEventListener("click", function () { toggle(id); });
        li.appendChild(x); ol.appendChild(li);
      });
      summary.appendChild(ol);
    }
    var ex = el("div", "extras"); ex.appendChild(el("p", null, T.extras));
    ["guide", "academy"].forEach(function (id) {
      var b = el("button", "xpill"); b.type = "button"; var on = inRoute(id);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = icon(on ? "check" : "plus", 2.2); b.appendChild(document.createTextNode(SOL[id].short));
      b.title = SOL[id].one;
      b.addEventListener("click", function () { toggle(id); });
      ex.appendChild(b);
    });
    summary.appendChild(ex);
    var ac = el("div", "s-actions");
    var tv = el("a", "btn btn-coral"); tv.href = "#onair"; tv.innerHTML = icon("tv"); tv.appendChild(document.createTextNode(T.toAir));
    ac.appendChild(tv);
    if (route.length) {
      var snd = el("a", "btn btn-dash"); snd.href = mailRoute(T.mailSubjectRoute); snd.innerHTML = icon("send"); snd.appendChild(document.createTextNode(T.sendUs));
      ac.appendChild(snd);
      var clr = el("button", "linkbtn", T.clear); clr.type = "button"; clr.addEventListener("click", function () { aud = ""; store("simpla-hybrid-aud", ""); paintPresets(); typePrompt(); setRoute([]); });
      ac.appendChild(clr);
    }
    summary.appendChild(ac);
  }

  function paintBoard() {
    board.classList.toggle("has-route", route.length > 0);
    nodeEls.forEach(function (card, i) {
      var n = NODES[i]; if (n.kind !== "sol") return;
      var on = inRoute(n.id);
      card.classList.toggle("in-route", on); card.classList.toggle("off", !on);
      var add = card.querySelector(".n-add");
      add.setAttribute("aria-pressed", on ? "true" : "false");
      add.innerHTML = icon(on ? "check" : "plus", 2.2) + "<span>" + (on ? T.inRoute : T.addToRoute) + "</span>";
    });
    dotBtns.forEach(function (b, i) { var n = NODES[i]; b.classList.toggle("r", n.kind === "sol" && inRoute(n.id)); });
  }

  /* inspector (desktop) and the monitor that plays this node's piece of the clay take */
  var mon = null, monA = 0, monB = 4, monWatch = false, canvasIn = false;
  function monLoad() {
    if (mon || reduce) return;
    mon = document.createElement("video");
    mon.muted = true; mon.defaultMuted = true; mon.playsInline = true; mon.setAttribute("playsinline", ""); mon.loop = false;
    mon.setAttribute("aria-hidden", "true"); mon.preload = "auto";
    mon.src = mobileQ.matches ? FILM.tall : FILM.wide;
    mon.addEventListener("loadeddata", function () { monSeek(); monPlay(); });
    mon.addEventListener("playing", function () { mon.classList.add("ready"); });
    mon.addEventListener("error", function () { if (mon && mon.parentNode) mon.parentNode.removeChild(mon); mon = null; });
    mountMon();
  }
  function mountMon() {
    if (!mon) return;
    // on the swipe row the monitor rides in the centred card, but never covers the typed prompt of the input node
    var host = desk ? monBox : (cur > 0 ? nodeEls[cur].querySelector(".n-media") : null);
    if (!host) { mon.pause(); if (mon.parentNode) mon.parentNode.removeChild(mon); return; }
    if (mon.parentNode !== host) { mon.classList.remove("ready"); host.insertBefore(mon, host.firstChild.nextSibling); monSeek(); }
  }
  function monSeg(i) {
    var cuts = mobileQ.matches ? FILM.cutsTall : FILM.cutsWide, st = [0].concat(cuts.slice(0, cuts.length - 1));
    monA = st[i] + 0.06; monB = cuts[i] - 0.06;
    monSeek();
  }
  function monSeek() { if (mon && mon.readyState >= 1) { try { mon.currentTime = monA; } catch (e) {} } }
  function monPlay() {
    if (!mon || !mon.parentNode || !canvasIn || document.hidden) return;
    var p = mon.play(); if (p && p.catch) p.catch(function () {});
    if (!monWatch) { monWatch = true; requestAnimationFrame(monTick); }
  }
  function monTick() {
    if (!mon || mon.paused) { monWatch = false; return; }
    if (mon.currentTime >= monB || mon.currentTime < monA - 0.3) { try { mon.currentTime = monA; } catch (e) {} }
    requestAnimationFrame(monTick);
  }

  function select(i) {
    selected = i;
    nodeEls.forEach(function (c, k) { c.classList.toggle("active", k === i); });
    monStill.src = FR[i];
    monTag.lastChild.textContent = "PREVIEW · 0" + i;
    monSeg(i);
    renderInsp();
  }
  function renderInsp() {
    if (!desk) return;
    var n = NODES[selected], s = SOL[n.id];
    inspInfo.innerHTML = "";
    var w = el("div", "fade");
    var k = el("div", "k"); k.appendChild(el("span", null, "PROPERTIES")); k.appendChild(el("span", null, "NODE " + (selected + 1) + "/" + NODES.length)); w.appendChild(k);
    if (n.kind === "input") {
      var a = audience();
      w.appendChild(el("h3", null, a ? a.name : T.inputTitle));
      w.appendChild(el("p", null, a ? a.problem : T.inspInput));
      if (a) {
        w.appendChild(el("h4", null, "WHAT YOU GET")); w.appendChild(el("p", "who", a.outcome));
        w.appendChild(el("h4", null, "FIRST STEP")); w.appendChild(el("p", "who", a.first));
      } else {
        w.appendChild(el("h4", null, "PRESETS"));
        var ul0 = el("ul", "pills"); AUDIENCES.forEach(function (x) { ul0.appendChild(el("li", null, x.chip)); }); w.appendChild(ul0);
      }
    } else if (n.kind === "output") {
      w.appendChild(el("h3", null, T.outputTitle));
      w.appendChild(el("p", null, T.inspOutput));
      w.appendChild(el("h4", null, "YOUR FLOW · " + route.length));
      var ul1 = el("ul", "pills");
      if (route.length) route.forEach(function (id) { ul1.appendChild(el("li", null, SOL[id].title)); });
      else ul1.appendChild(el("li", null, T.noNodes));
      w.appendChild(ul1);
      var acts0 = el("div", "acts"); var g = el("a", "btn btn-coral btn-sm"); g.href = "#onair"; g.innerHTML = icon("tv"); g.appendChild(document.createTextNode(T.toAir)); acts0.appendChild(g); w.appendChild(acts0);
    } else {
      w.appendChild(el("h3", null, s.title)); w.appendChild(el("span", "nm", s.name));
      w.appendChild(el("p", null, s.text));
      w.appendChild(el("h4", null, "DELIVERABLES"));
      var ul = el("ul", "pills"); s.gets.forEach(function (x) { ul.appendChild(el("li", null, x)); }); w.appendChild(ul);
      w.appendChild(el("h4", null, "FOR WHOM")); w.appendChild(el("p", "who", s.who));
      var wl = worksOf(n.id);
      if (wl.length) { w.appendChild(el("h4", null, "OUTPUTS · " + wl.length)); w.appendChild(thumbs(wl, 6)); }
      var acts = el("div", "acts"), on = inRoute(n.id);
      var b = el("button", "btn btn-dash btn-sm"); b.type = "button"; b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = icon(on ? "check" : "plus", 2.2); b.appendChild(document.createTextNode(on ? T.inRouteRemove : T.addToRoute));
      b.addEventListener("click", function () { toggle(n.id); });
      acts.appendChild(b);
      if (n.id === "flows") { var wv = el("a", "btn btn-coral btn-sm", T.toWeave); wv.href = "#weave"; acts.appendChild(wv); }
      w.appendChild(acts);
    }
    inspInfo.appendChild(w);
  }

  /* wires between the nodes (desktop board) */
  var WIRES = [], ports = [];
  function ns(tag, attrs) { var e = document.createElementNS("http://www.w3.org/2000/svg", tag); for (var a in attrs) e.setAttribute(a, attrs[a]); return e; }
  function layoutWires() {
    if (!desk) return;
    var br = board.getBoundingClientRect();
    wiresSvg.innerHTML = ""; WIRES = [];
    wiresSvg.setAttribute("viewBox", "0 0 " + br.width + " " + br.height);
    function box(e) { var r = e.getBoundingClientRect(); return { l: r.left - br.left, r: r.right - br.left, t: r.top - br.top, b: r.bottom - br.top, cx: r.left - br.left + r.width / 2 }; }
    function my(card) { var m = card.querySelector(".n-media").getBoundingClientRect(); return m.top - br.top + m.height / 2; }
    var seq = nodeEls.concat([summary]);
    for (var i = 0; i < seq.length - 1; i++) {
      var A = box(seq[i]), B = box(seq[i + 1]), d, sx, sy, ex, ey;
      if (i === 3) { sx = A.cx; sy = A.b; ex = B.cx; ey = B.t; var dy = (ey - sy) / 2; d = "M" + sx + "," + sy + " C" + sx + "," + (sy + dy) + " " + ex + "," + (ey - dy) + " " + ex + "," + ey; }
      else {
        // the next node sits to the left or to the right depending on the row and the page direction
        var leftward = B.cx < A.cx;
        sx = leftward ? A.l : A.r; ex = leftward ? B.r : B.l;
        sy = my(seq[i]); ey = i === 6 ? sy : my(seq[i + 1]);
        var dx = (ex - sx) / 2; d = "M" + sx + "," + sy + " C" + (sx + dx) + "," + sy + " " + (ex - dx) + "," + ey + " " + ex + "," + ey;
      }
      var base = ns("path", { d: d, "class": "base" }), live = ns("path", { d: d, "class": "live" });
      wiresSvg.appendChild(base); wiresSvg.appendChild(live);
      var len = live.getTotalLength();
      live.style.strokeDasharray = len; live.style.strokeDashoffset = route.length ? 0 : len;
      live.style.transitionDelay = (i * 0.09) + "s";
      wiresSvg.appendChild(ns("circle", { cx: sx, cy: sy, r: 6, "class": "port" }));
      wiresSvg.appendChild(ns("circle", { cx: ex, cy: ey, r: 6, "class": "port" }));
      WIRES.push({ live: live, len: len });
    }
    pkH = ns("circle", { r: 13, "class": "pkh" }); pkD = ns("circle", { r: 6, "class": "pk" });
    pkH.style.opacity = pkD.style.opacity = 0;
    wiresSvg.appendChild(pkH); wiresSvg.appendChild(pkD);
  }
  function paintWires() { WIRES.forEach(function (w) { w.live.style.strokeDashoffset = route.length ? 0 : w.len; }); kickPackets(); }

  // one packet travels the whole route, and pulses each node it reaches
  var pkH = null, pkD = null, pkRun = false, lastSeg = -1, t0 = 0;
  function kickPackets() { if (!pkRun && desk && canvasIn && route.length && !reduce && WIRES.length) { pkRun = true; t0 = performance.now(); requestAnimationFrame(pkTick); } }
  function pkTick(now) {
    if (!desk || !canvasIn || !route.length || !WIRES.length) { pkRun = false; if (pkD) { pkD.style.opacity = 0; pkH.style.opacity = 0; } return; }
    var u = (Math.max(0, now - t0) / 950) % (WIRES.length + 1.2);
    if (u >= WIRES.length) { pkD.style.opacity = 0; pkH.style.opacity = 0; lastSeg = -1; requestAnimationFrame(pkTick); return; }
    var k = Math.floor(u), f = u - k, w = WIRES[k];
    var e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
    var p = w.live.getPointAtLength(w.len * e);
    pkD.setAttribute("cx", p.x); pkD.setAttribute("cy", p.y); pkH.setAttribute("cx", p.x); pkH.setAttribute("cy", p.y);
    pkD.style.opacity = 1; pkH.style.opacity = 0.22;
    if (k !== lastSeg) {
      lastSeg = k;
      var target = k + 1 < nodeEls.length ? nodeEls[k + 1] : summary;
      var nd = NODES[k + 1];
      if (!nd || nd.kind !== "sol" || inRoute(nd.id)) {
        setTimeout(function () { target.classList.remove("pulse"); void target.offsetWidth; target.classList.add("pulse"); }, 900);
      }
    }
    requestAnimationFrame(pkTick);
  }

  /* phones and tablets: the nodes are a row you swipe through */
  var dotsBox = $("dots"), cCount = $("cCount"), cPrev = $("cPrev"), cNext = $("cNext"), dotBtns = [], cur = -1;
  NODES.forEach(function (n, i) {
    var b = el("button"); b.type = "button";
    b.setAttribute("aria-label", T.node + (i + 1) + ", " + (n.kind === "sol" ? SOL[n.id].title : n.kind === "input" ? T.inputTitle : T.outputTitle));
    b.addEventListener("click", function () { goNode(i); });
    dotsBox.appendChild(b); dotBtns.push(b);
  });
  function goNode(i, instant) {
    i = Math.max(0, Math.min(NODES.length - 1, i));
    var r = nodeEls[i].getBoundingClientRect(), wr = nodesBox.getBoundingClientRect();
    nodesBox.scrollBy({ left: (r.left + r.width / 2) - (wr.left + wr.width / 2), behavior: instant || reduce ? "auto" : "smooth" });
  }
  cPrev.addEventListener("click", function () { goNode(cur - 1); });
  cNext.addEventListener("click", function () { goNode(cur + 1); });
  function frameRow() {
    if (desk) return;
    var wr = nodesBox.getBoundingClientRect(), best = 0, bd = 1e9;
    nodeEls.forEach(function (c, i) { var r = c.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - (wr.left + wr.width / 2)); if (d < bd) { bd = d; best = i; } });
    if (best === cur) return;
    cur = best;
    nodeEls.forEach(function (c, i) { c.classList.toggle("active", i === best); });
    dotBtns.forEach(function (b, i) { b.classList.toggle("on", i === best); b.setAttribute("aria-current", i === best ? "step" : "false"); });
    cCount.textContent = (best + 1) + " / " + NODES.length;
    cPrev.disabled = best === 0; cNext.disabled = best === NODES.length - 1;
    monSeg(best); mountMon(); monPlay();
  }
  var rowRaf = 0;
  nodesBox.addEventListener("scroll", function () { if (!rowRaf) rowRaf = requestAnimationFrame(function () { rowRaf = 0; frameRow(); }); }, { passive: true });

  function setMode() {
    desk = deskQ.matches;
    if (desk) {
      nodeEls.forEach(function (c) { c.classList.remove("open"); });
      select(selected); layoutWires(); paintWires(); mountMon(); monPlay();
    } else {
      wiresSvg.innerHTML = ""; WIRES = [];
      nodeEls.forEach(function (c) { c.classList.remove("active"); });
      cur = -1; frameRow();
    }
  }
  deskQ.addEventListener && deskQ.addEventListener("change", setMode);

  listeners.push(function (bump) {
    paintSummary(bump); paintBoard();
    if (desk) { layoutWires(); paintWires(); renderInsp(); }
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      canvasIn = es[0].isIntersecting;
      if (canvasIn) { monLoad(); monPlay(); kickPackets(); }
      else if (mon && !mon.paused) mon.pause();
    }, { rootMargin: "200px 0px" }).observe($("canvas"));
  }


  /* ================= 4. Figma Weave ================= */
  var tourTabs = $("tourTabs"), twImg = $("twImg"), twTitle = $("twTitle"), twText = $("twText"), twFile = $("twFile"), twStep = $("twStep");
  var tabs = [], tpos = 0;
  TOUR.forEach(function (t, i) {
    if (i) { var wire = el("span", "twire"); wire.setAttribute("aria-hidden", "true"); tourTabs.appendChild(wire); }
    var b = el("button", "ttab"); b.type = "button"; b.setAttribute("role", "tab"); b.id = "tt-" + i;
    b.appendChild(el("span", "n", pad(i + 1))); b.appendChild(el("b", null, t.tab));
    b.addEventListener("click", function () { tourGo(i); });
    b.addEventListener("keydown", function (e) {
      if (e.key === KEY_FWD) { e.preventDefault(); tourGo(i + 1, true); }
      if (e.key === KEY_BACK) { e.preventDefault(); tourGo(i - 1, true); }
    });
    tourTabs.appendChild(b); tabs.push(b);
    var pre = new Image(); pre.decoding = "async"; if (i) setTimeout(function () { pre.src = t.img; }, 2500);
  });
  function tourGo(i, focus) {
    i = (i + TOUR.length) % TOUR.length; tpos = i;
    var t = TOUR[i];
    tabs.forEach(function (b, k) { b.setAttribute("aria-selected", k === i ? "true" : "false"); b.tabIndex = k === i ? 0 : -1; });
    if (focus) tabs[i].focus();
    twImg.classList.add("out");
    setTimeout(function () { twImg.src = t.img; twImg.alt = t.title; twImg.classList.remove("out"); }, twImg.src ? 180 : 0);
    twTitle.textContent = t.title; twText.textContent = t.text;
    twFile.textContent = "simpla / " + t.file; twStep.textContent = (i + 1) + " / " + TOUR.length;
  }
  $("twPrev").addEventListener("click", function () { tourGo(tpos - 1); });
  $("twNext").addEventListener("click", function () { tourGo(tpos + 1); });
  tourGo(0);

  var pipe6 = $("pipe6");
  PIPE.forEach(function (p, i) {
    var d = el("div", "ps"); d.setAttribute("role", "listitem");
    d.appendChild(el("span", "d", pad(i + 1))); d.appendChild(el("h4", null, p[0])); d.appendChild(el("p", null, p[1]));
    pipe6.appendChild(d);
  });
  var wvGets = $("wvGets");
  WV_GETS.forEach(function (g) { var li = el("li"); li.innerHTML = icon("check", 2.2); li.appendChild(el("span", null, g)); wvGets.appendChild(li); });

  var wvAdd = $("wvAdd");
  wvAdd.addEventListener("click", function () {
    var both = inRoute("flows") && inRoute("adopt"), r = route.slice();
    if (both) r = r.filter(function (x) { return x !== "flows" && x !== "adopt"; });
    else { if (!inRoute("flows")) r.push("flows"); if (!inRoute("adopt")) r.push("adopt"); }
    setRoute(r, true);
  });
  listeners.push(function () {
    var both = inRoute("flows") && inRoute("adopt");
    wvAdd.setAttribute("aria-pressed", both ? "true" : "false");
    wvAdd.innerHTML = icon(both ? "check" : "plus", 2.2) + "<span>" + (both ? T.inYourRoute : T.addToRoute) + "</span>";
  });

  /* ================= 5. work gallery ================= */
  var wf = $("wf"), wgrid = $("wgrid"), cards = [], filter = store("simpla-hybrid-wf") || "all";
  function routeWorks(w) { return w.nodes.some(function (x) { return inRoute(x); }); }
  function inF(w, f) { return f === "all" || (f === "route" ? routeWorks(w) : w.nodes.indexOf(f) >= 0); }
  WORKS.forEach(function (w) {
    var b = el("button", "wcard"); b.type = "button"; b.dataset.id = w.id;
    b.setAttribute("aria-label", T.watch + (w.client ? w.client + ", " : "") + w.title);
    var th = el("span", "th");
    if (w.shape) { var bg = el("img", "blur"); bg.src = w.poster; bg.alt = ""; bg.loading = "lazy"; th.appendChild(bg); }
    var im = el("img", w.shape ? "fit" : null); im.src = w.poster; im.alt = ""; im.loading = "lazy"; im.decoding = "async"; th.appendChild(im);
    if (w.preview) {
      var pv = document.createElement("video");
      pv.muted = true; pv.loop = true; pv.playsInline = true; pv.setAttribute("playsinline", ""); pv.preload = "none";
      pv.setAttribute("aria-hidden", "true"); if (w.shape) pv.className = "fit";
      pv.dataset.src = w.preview; th.appendChild(pv);
    }
    th.appendChild(el("span", "kind", w.kind));
    th.appendChild(el("span", "rtag", T.inRoute));
    if (w.len) th.appendChild(el("span", "len", w.len));
    var pl = el("span", "play"); pl.innerHTML = PLAY; th.appendChild(pl);
    b.appendChild(th);
    b.appendChild(el("span", "tt", w.title));
    var ss = el("span", "ss");
    if (w.client) ss.appendChild(el("span", "cl", w.client));
    ss.appendChild(document.createTextNode(w.sub || w.text));
    b.appendChild(ss);
    b.addEventListener("click", function () {
      openWork(w.id, WORKS.filter(function (x) { return inF(x, filter); }).map(function (x) { return x.id; }));
    });
    wgrid.appendChild(b); cards.push(b);
  });
  function paintWorks() {
    var cats = [["all", T.all]];
    if (route.some(function (x) { return CORE.indexOf(x) >= 0; })) cats.push(["route", T.inYourRoute]);
    CORE.forEach(function (id) { cats.push([id, SOL[id].label]); });
    if (!cats.some(function (c) { return c[0] === filter; })) filter = "all";
    wf.innerHTML = "";
    cats.forEach(function (c) {
      var n = WORKS.filter(function (w) { return inF(w, c[0]); }).length;
      var b = el("button", "chip"); b.type = "button"; b.dataset.id = c[0];
      b.setAttribute("aria-pressed", c[0] === filter ? "true" : "false");
      b.appendChild(document.createTextNode(c[1])); b.appendChild(el("span", n ? "cnt" : "cnt z", String(n)));
      b.addEventListener("click", function () { filter = c[0]; store("simpla-hybrid-wf", filter); paintWorks(); });
      wf.appendChild(b);
    });
    var first = true;
    cards.forEach(function (b, i) {
      var w = WORKS[i], sh = inF(w, filter);
      b.hidden = !sh; b.classList.toggle("feat", sh && first); if (sh) first = false;
      b.classList.toggle("in-route", routeWorks(w));
    });
  }
  listeners.push(paintWorks);

  /* ================= 8. on air: the route as a channel lineup ================= */
  $("tvimg").src = REEL.tv;
  var screenEl = $("screen"), still = $("still"), noise = $("noise"), nctx = noise.getContext("2d");
  var osd = $("osd"), tvbox = $("tvbox"), tap = $("tap"), remote = $("remote"), lineup = $("lineup");
  var oaCh = $("oaCh"), oaName = $("oaName"), oaLead = $("oaLead"), oaSend = $("oaSend");
  var tvVideo = null, tvStatic = reduce, segA = 0, segB = 3, tvIn = false, watching = false;
  var ids = [], chPos = 0, autoZap = true, zapTimer = 0, remoteBtns = [], slots = [];
  var ALLCH = ["studio", "spec", "flows", "lab", "adopt", "guide"];
  function slotTime(k) { var m = 22 * 60 + k * 30; return pad(Math.floor(m / 60) % 24) + ":" + pad(m % 60); }

  function drawNoise() {
    var w = noise.width, h = noise.height, img = nctx.createImageData(w, h), d = img.data, band = Math.random() * h;
    for (var y = 0; y < h; y++) {
      var roll = Math.abs(y - band) < 9 ? 0.5 : 1;
      for (var x = 0; x < w; x++) { var v = (Math.random() * 255 * roll) | 0, o = (y * w + x) * 4; d[o] = v * 0.92; d[o + 1] = v * 0.97; d[o + 2] = v; d[o + 3] = 255; }
    }
    nctx.putImageData(img, 0, 0);
  }
  var staticUntil = 0, staticRaf = 0;
  function staticLoop() {
    if (performance.now() < staticUntil) { drawNoise(); staticRaf = requestAnimationFrame(staticLoop); }
    else { noise.classList.remove("on"); staticRaf = 0; }
  }
  function burst(ms) { if (reduce) return; staticUntil = performance.now() + ms; noise.classList.add("on"); if (!staticRaf) staticLoop(); }
  var osdTimer = 0;
  function showOsd(txt) { osd.textContent = txt; osd.classList.add("on"); clearTimeout(osdTimer); osdTimer = setTimeout(function () { osd.classList.remove("on"); }, 1800); }

  function playTV() {
    if (!tvVideo || tvStatic || !tvIn || document.hidden) return;
    var p = tvVideo.play(); if (p && p.catch) p.catch(function () {});
    if (!watching) { watching = true; requestAnimationFrame(watchTV); }
  }
  function watchTV() {
    if (!tvVideo || tvVideo.paused) { watching = false; return; }
    var t = tvVideo.currentTime;
    if (t >= segB || t < segA - 0.25) { try { tvVideo.currentTime = segA; } catch (e) {} }
    requestAnimationFrame(watchTV);
  }
  function buildTV() {
    if (tvVideo || tvStatic) return;
    tvVideo = document.createElement("video");
    tvVideo.muted = true; tvVideo.defaultMuted = true; tvVideo.playsInline = true;
    tvVideo.setAttribute("playsinline", ""); tvVideo.setAttribute("aria-hidden", "true");
    tvVideo.preload = "auto"; tvVideo.src = REEL.src;
    screenEl.insertBefore(tvVideo, still);
    tvVideo.addEventListener("loadeddata", function () { tvVideo.playbackRate = 0.85; try { tvVideo.currentTime = segA; } catch (e) {} playTV(); });
    tvVideo.addEventListener("playing", function () { still.classList.add("gone"); });
    tvVideo.addEventListener("error", function () { tvStatic = true; still.classList.remove("gone"); });
  }
  function tune(k, user) {
    if (!ids.length) return;
    chPos = (k + ids.length) % ids.length;
    var id = ids[chPos], s = SOL[id], r = s.reel;
    segA = REEL.starts[r] + 0.05; segB = REEL.cuts[r] - 0.08;
    still.src = REEL.stills[r];
    if (tvVideo && !tvStatic) { try { tvVideo.currentTime = segA; } catch (e) {} playTV(); }
    document.documentElement.style.setProperty("--glow", REEL.glow[r]);
    burst(user ? 380 : 260);
    showOsd("CH " + pad(chPos + 1));
    oaCh.textContent = "CH " + pad(chPos + 1);
    oaName.innerHTML = ""; oaName.appendChild(el("bdi", null, s.title)); oaName.appendChild(document.createTextNode(" · "));
    oaName.appendChild(el("span", "en", slotTime(chPos)));
    remoteBtns.forEach(function (b, i) { b.classList.toggle("on", i === chPos); b.setAttribute("aria-pressed", i === chPos ? "true" : "false"); });
    slots.forEach(function (b, i) { b.classList.toggle("on", i === chPos); if (i === chPos) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
    var wl = worksOf(id);
    tap.hidden = !wl.length;
    tvbox.style.cursor = wl.length ? "" : "default";
    tvbox.setAttribute("aria-label", wl.length ? T.tvWatch(s.title) : T.channel + pad(chPos + 1) + ", " + s.title);
  }
  function userTune(k) { autoZap = false; tune(k, true); }
  function paintTV() {
    var was = ids[chPos];
    ids = route.length ? route.slice() : ALLCH.slice();
    remote.innerHTML = ""; remoteBtns = [];
    ids.forEach(function (id, i) {
      var b = el("button", null, pad(i + 1)); b.type = "button"; b.setAttribute("aria-label", T.channel + pad(i + 1) + ", " + SOL[id].title);
      b.addEventListener("click", function () { userTune(i); });
      remote.appendChild(b); remoteBtns.push(b);
    });
    var z = el("button", "zap"); z.type = "button"; z.setAttribute("aria-label", T.zapAria);
    z.innerHTML = icon("zap") + "<span>" + T.zap + "</span>";
    z.addEventListener("click", function () { userTune(chPos + 1); });
    remote.appendChild(z);
    lineup.innerHTML = ""; slots = [];
    ids.forEach(function (id, i) {
      var li = el("li"), b = el("button", "slot"); b.type = "button";
      b.appendChild(el("span", "tm", slotTime(i))); b.appendChild(el("span", "ch", "CH " + pad(i + 1)));
      var ti = el("span", "ti"); ti.appendChild(el("bdi", null, SOL[id].title)); ti.appendChild(el("span", "nw", "NOW")); b.appendChild(ti);
      var n = worksOf(id).length; b.appendChild(el("span", n ? "cnt" : "cnt z", String(n)));
      b.addEventListener("click", function () { userTune(i); });
      li.appendChild(b); lineup.appendChild(li); slots.push(b);
    });
    var le = el("li"), be = el("button", "slot end"); be.type = "button";
    be.appendChild(el("span", "tm", slotTime(ids.length))); be.appendChild(el("span", "ch", "END"));
    be.appendChild(el("span", "ti", T.endSlot)); be.appendChild(el("span", "cnt", "1"));
    be.addEventListener("click", function () { openWork("night", ["night"]); });
    le.appendChild(be); lineup.appendChild(le);
    oaLead.innerHTML = "";
    if (route.length) {
      oaLead.appendChild(document.createTextNode(T.leadBuilt(route.length)));
    } else {
      oaLead.appendChild(document.createTextNode(T.leadEmpty[0]));
      var a = el("a", null, T.leadEmpty[1]); a.href = "#canvas"; oaLead.appendChild(a);
      oaLead.appendChild(document.createTextNode(T.leadEmpty[2]));
    }
    oaSend.href = route.length ? mailRoute(T.mailSubjectBroadcast) : "#contact";
    var k = ids.indexOf(was); tune(k >= 0 ? k : 0);
  }
  listeners.push(paintTV);
  function watchNow() { var wl = worksOf(ids[chPos]); if (wl.length) openWork(wl[0], wl); }
  tvbox.addEventListener("click", watchNow);
  tvbox.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); watchNow(); } });
  $("oaEnd").addEventListener("click", function () { openWork("night", ["night"]); });
  function zapLoop() {
    clearInterval(zapTimer);
    zapTimer = setInterval(function () { if (autoZap && tvIn && !viewer.open && !document.hidden) tune(chPos + 1); }, 8000);
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      tvIn = es[0].isIntersecting;
      if (tvIn) { buildTV(); playTV(); zapLoop(); } else { clearInterval(zapTimer); if (tvVideo && !tvVideo.paused) tvVideo.pause(); }
    }, { rootMargin: "300px 0px" }).observe(tvbox);
  }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { if (tvVideo) tvVideo.pause(); if (mon) mon.pause(); }
    else { playTV(); monPlay(); }
  });

  /* ================= mobile menu ================= */
  var sheet = $("sheet"), sheetList = $("sheetList"), sheetCnt = null;
  T.menu.forEach(function (r) {
    var a = el("a"); a.href = r[0];
    var t = el("span"); t.appendChild(document.createTextNode(r[1]));
    if (r[0] === "#canvas") { sheetCnt = el("span", "cnt z", "0"); t.appendChild(document.createTextNode(" ")); t.appendChild(sheetCnt); }
    a.appendChild(t); a.appendChild(el("span", "k", r[2]));
    a.addEventListener("click", function () { closeSheet(); });
    sheetList.appendChild(a);
  });
  listeners.push(function () { setCnt(sheetCnt, route.length); });
  function closeSheet() { if (sheet.open) sheet.close(); document.documentElement.classList.remove("lock"); }
  $("menuBtn").addEventListener("click", function () { if (sheet.showModal) sheet.showModal(); else sheet.setAttribute("open", ""); document.documentElement.classList.add("lock"); });
  $("sheetClose").addEventListener("click", closeSheet);
  sheet.addEventListener("close", function () { document.documentElement.classList.remove("lock"); });
  sheet.addEventListener("click", function (e) { if (e.target === sheet) closeSheet(); });

  /* ================= viewer ================= */
  var viewer = $("viewer"), vV = $("vVideo");
  var vKind = $("vKind"), vTitle = $("vTitle"), vSub = $("vSub"), vText = $("vText"), vGets = $("vGets"), vCount = $("vCount");
  var vPrev = $("vPrev"), vNext = $("vNext");
  var seq = [], pos = 0, pushed = false;
  function fill(i) {
    pos = i;
    var w = WBY[seq[i]];
    vV.pause();
    vV.poster = w.poster; vV.loop = !!w.loop; vV.muted = !!w.loop; vV.src = w.src;
    vKind.textContent = w.client ? w.kind + " · " + w.client : w.kind + (w.len ? " · " + w.len : "");
    vTitle.textContent = w.title;
    vSub.textContent = w.sub || ""; vSub.hidden = !w.sub;
    vText.textContent = w.text;
    vGets.innerHTML = ""; (w.gets || []).forEach(function (g) { vGets.appendChild(el("li", null, g)); });
    vCount.textContent = (i + 1) + " / " + seq.length;
    vPrev.disabled = vNext.disabled = seq.length < 2;
    var p = vV.play(); if (p && p.catch) p.catch(function () {});
  }
  function openWork(id, list, fromLoad) {
    seq = (list && list.indexOf(id) >= 0) ? list.slice() : WORKS.map(function (w) { return w.id; });
    var i = seq.indexOf(id); if (i < 0 || !WBY[id]) return;
    if (tvVideo && !tvVideo.paused) tvVideo.pause();
    if (mon && !mon.paused) mon.pause();
    fill(i);
    if (!viewer.open) {
      if (viewer.showModal) viewer.showModal(); else viewer.setAttribute("open", "");
      document.documentElement.classList.add("lock");
    }
    if (fromLoad) history.replaceState({ w: id }, "", "#w-" + id);
    else if (!pushed) { history.pushState({ w: id }, "", "#w-" + id); pushed = true; }
    else history.replaceState({ w: id }, "", "#w-" + id);
  }
  function step(d) { var i = (pos + d + seq.length) % seq.length; fill(i); history.replaceState({ w: seq[i] }, "", "#w-" + seq[i]); }
  function shut() {
    vV.pause(); vV.removeAttribute("src"); try { vV.load(); } catch (e) {}
    if (viewer.open) { if (viewer.close) viewer.close(); else viewer.removeAttribute("open"); }
    document.documentElement.classList.remove("lock");
    playTV(); monPlay();
  }
  function closeViewer() {
    if (pushed) { pushed = false; history.back(); shut(); }
    else { shut(); history.replaceState(null, "", location.pathname + location.search); }
  }
  window.addEventListener("popstate", function () { if (viewer.open) { pushed = false; shut(); } });
  $("vClose").addEventListener("click", closeViewer);
  vPrev.addEventListener("click", function () { step(-1); });
  vNext.addEventListener("click", function () { step(1); });
  viewer.addEventListener("cancel", function (e) { e.preventDefault(); closeViewer(); });
  viewer.addEventListener("keydown", function (e) {
    if (e.target === vV) return;
    // the arrow that points the way the page reads moves forward
    if (e.key === KEY_FWD) { e.preventDefault(); step(1); }
    if (e.key === KEY_BACK) { e.preventDefault(); step(-1); }
  });

  /* ================= lazy previews + reveals ================= */
  if ("IntersectionObserver" in window) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (!v.src && v.dataset.src) v.src = v.dataset.src;
          if (reduce) return;
          var p = v.play(); if (p && p.then) p.then(function () { v.classList.add("live"); }).catch(function () {});
        } else if (!v.paused) v.pause();
      });
    }, { rootMargin: "200px 0px" });
    document.querySelectorAll(".wcard video").forEach(function (v) { vio.observe(v); });
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(function (n) { rio.observe(n); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (n) { n.classList.add("in"); });
  }

  /* ================= go ================= */
  function onScroll() { navState(); if (!staticMode) { computeTarget(); loop(); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  var rz = 0;
  window.addEventListener("resize", function () {
    sizeStage(); onScroll();
    clearTimeout(rz); rz = setTimeout(function () { if (desk) layoutWires(), paintWires(); else frameRow(); }, 120);
  });
  listeners.forEach(function (f) { f(false); });
  setMode();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (desk) { layoutWires(); paintWires(); } });
  window.addEventListener("load", function () { if (desk) { layoutWires(); paintWires(); } });
  var deep = /^#w-([a-z]+)$/.exec(location.hash);
  if (deep) openWork(deep[1], null, true);
  navState();
  if (!staticMode) onScroll();
