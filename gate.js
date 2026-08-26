/* Simpla Lab · gate.js
   A light entry gate. Load it as the FIRST script in <head>:
   <script src="/simpla-lab/gate.js"></script>
   Same line works on sub-pages, keep the absolute path.
   Note: this is a lock on the door, not a safe. The repo is public,
   so treat it as "keep casual visitors out", not as security. */
(function () {
  'use strict';

  var SALT   = 'simpla-lab::';
  var DIGEST = 'd5491804064e0c78e92b6551a365f789ad75f7dbe68cf604e215a499c9481685';
  var KEY    = 'sl.gate';
  var DAYS   = 45;
  var LEN    = 4;

  /* already unlocked, and not expired */
  try {
    var saved = parseInt(localStorage.getItem(KEY) || '0', 10);
    if (saved && Date.now() - saved < DAYS * 864e5) return;
  } catch (e) {}

  /* hide the page immediately, before anything paints */
  document.documentElement.classList.add('sl-locked');
  var hide = document.createElement('style');
  hide.textContent =
    'html.sl-locked{overflow:hidden}' +
    'html.sl-locked body>*:not(#sl-gate){display:none!important}';
  (document.head || document.documentElement).appendChild(hide);

  var CSS = '\
#sl-gate{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;\
padding:24px;background:#F7F5F0;color:#141F3D;direction:rtl;\
font-family:"Rubik","Heebo",-apple-system,sans-serif}\
#sl-gate .box{width:100%;max-width:340px;text-align:center;background:#fff;border:1.5px dashed #C9C3B4;\
border-radius:20px;padding:34px 24px 28px}\
#sl-gate .mark{width:38px;height:38px;margin:0 auto 16px;border-radius:11px;background:#141F3D;color:#fff;\
display:flex;align-items:center;justify-content:center}\
#sl-gate .mark svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.9;\
stroke-linecap:round;stroke-linejoin:round;display:block}\
#sl-gate .wm{font-family:"Poppins",sans-serif;font-size:15px;font-weight:300;letter-spacing:1.9px;\
text-transform:uppercase;direction:ltr}\
#sl-gate .wm b{font-weight:700}\
#sl-gate .sub{margin-top:7px;font-size:13.5px;color:#5F6C8A}\
#sl-gate .pins{display:flex;flex-direction:row-reverse;justify-content:center;gap:10px;margin:22px 0 4px}\
#sl-gate input{width:52px;height:60px;text-align:center;font-size:24px;font-weight:600;color:#141F3D;\
background:#F7F5F0;border:1.5px solid #E4E0D6;border-radius:14px;outline:none;\
font-family:inherit;-moz-appearance:textfield;transition:border-color .15s,background .15s}\
#sl-gate input::-webkit-outer-spin-button,#sl-gate input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}\
#sl-gate input:focus{border-color:#141F3D;background:#fff}\
#sl-gate input.filled{border-color:#141F3D;background:#fff}\
#sl-gate .err{min-height:20px;margin-top:12px;font-size:13px;color:#C2410C;opacity:0;transition:opacity .15s}\
#sl-gate.bad .err{opacity:1}\
#sl-gate.bad .box{animation:slShake .34s}\
@keyframes slShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}\
45%{transform:translateX(7px)}70%{transform:translateX(-4px)}}\
@media (max-width:360px){#sl-gate input{width:46px;height:54px;font-size:21px}}';

  var HTML = '\
<div class="box">\
<div class="mark"><svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2.2"></rect>\
<path d="M8.5 11V8.2a3.5 3.5 0 0 1 7 0V11"></path></svg></div>\
<div class="wm">Simpla <b>Lab</b></div>\
<div class="sub">הכניסו קוד כניסה</div>\
<div class="pins"></div>\
<div class="err">קוד שגוי, נסו שוב</div>\
</div>';

  function hex(buf) {
    return Array.prototype.map
      .call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); })
      .join('');
  }

  function build() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var gate = document.createElement('div');
    gate.id = 'sl-gate';
    gate.innerHTML = HTML;
    document.body.appendChild(gate);

    var pins = gate.querySelector('.pins');
    var boxes = [];
    for (var i = 0; i < LEN; i++) {
      var el = document.createElement('input');
      el.type = 'tel';
      el.inputMode = 'numeric';
      el.maxLength = 1;
      el.autocomplete = 'off';
      pins.appendChild(el);
      boxes.push(el);
    }

    function value() {
      return boxes.map(function (b) { return b.value; }).join('');
    }

    function clear() {
      boxes.forEach(function (b) { b.value = ''; b.classList.remove('filled'); });
      boxes[0].focus();
    }

    function unlock() {
      try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
      gate.remove();
      document.documentElement.classList.remove('sl-locked');
      hide.remove();
    }

    function check() {
      var code = value();
      if (code.length < LEN) return;
      var enc = new TextEncoder().encode(SALT + code);
      crypto.subtle.digest('SHA-256', enc).then(function (buf) {
        if (hex(buf) === DIGEST) {
          unlock();
        } else {
          gate.classList.add('bad');
          setTimeout(function () { gate.classList.remove('bad'); }, 900);
          clear();
        }
      });
    }

    boxes.forEach(function (box, i) {
      box.addEventListener('input', function () {
        box.value = box.value.replace(/\D/g, '').slice(0, 1);
        box.classList.toggle('filled', !!box.value);
        if (box.value && i < LEN - 1) boxes[i + 1].focus();
        check();
      });
      box.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !box.value && i > 0) {
          boxes[i - 1].focus();
          boxes[i - 1].value = '';
          boxes[i - 1].classList.remove('filled');
          e.preventDefault();
        }
        if (e.key === 'Enter') check();
      });
      box.addEventListener('paste', function (e) {
        var text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
        if (!text) return;
        e.preventDefault();
        for (var j = 0; j < LEN; j++) {
          boxes[j].value = text[j] || '';
          boxes[j].classList.toggle('filled', !!boxes[j].value);
        }
        boxes[Math.min(text.length, LEN - 1)].focus();
        check();
      });
    });

    setTimeout(function () { boxes[0].focus(); }, 60);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
