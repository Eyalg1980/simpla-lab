/*
 * Simpla Lab access gate (Vercel Routing Middleware).
 *
 * Runs on the server before every request, so a protected file never leaves
 * Vercel without a valid login. This replaces the old in-browser gates.
 *
 * NO PASSWORD LIVES IN THIS FILE OR IN THE REPO. Passwords are Vercel
 * Environment Variables (type: Sensitive), one per role:
 *   LAB_PASS_OWNER    Eyal only, opens everything
 *   LAB_PASS_STAFF    lecturers, admin, marketing
 *   LAB_PASS_STUDENT  the current cohort
 *   LAB_PASS_JUGANU   optional, a client page (one variable per client role)
 * A role whose variable is missing cannot log in at all (fails closed).
 * Changing a password in Vercel logs out everyone who used the old one.
 *
 * To change who sees what, edit RULES below. First match wins.
 * Everything that matches no rule is public.
 */
import { next } from '@vercel/functions';

const RULES = [
  { role: 'owner', test: (p, s) => p === '/' || p === '/index.html' },
  { role: 'owner', test: (p) => /^\/[^/]+\.(md|json|js)$/.test(p) && p !== '/gate.js' },
  { role: 'owner', test: (p, s) => s === '_qc' || s === 'cardio' },
  { role: 'juganu', test: (p, s) => s === 'juganu' },
  { role: 'staff', test: (p) => p === '/jb53500-2027/data-staff.js' },
  { role: 'staff', test: (p, s) => s === 'jb53500-plan' || s === 'jb53500-align' || s === 'jb45900' },
  { role: 'student', test: (p, s) => s.startsWith('jb53500') || s === 'jb45900-guide' },
];

const COOKIE = 'sl_auth';
const HINT = 'sl_role';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const RANK = { student: 1, staff: 2, owner: 3 };

/* ---------- helpers ---------- */

function normalize(pathname) {
  let p = pathname;
  try { p = decodeURIComponent(p); } catch (e) { /* keep raw */ }
  p = p.replace(/\/{2,}/g, '/').toLowerCase();
  return p || '/';
}

function needFor(pathname) {
  const p = normalize(pathname);
  const s = p.split('/')[1] || '';
  for (const r of RULES) if (r.test(p, s)) return r.role;
  return null; // public
}

function allowed(have, need) {
  if (!need) return true;
  if (!have) return false;
  if (have === 'owner') return true;
  if (RANK[need] && RANK[have]) return RANK[have] >= RANK[need];
  return have === need; // client roles only open their own pages
}

function passFor(role) {
  if (!/^[a-z0-9]+$/.test(role || '')) return '';
  return process.env['LAB_PASS_' + role.toUpperCase()] || '';
}

function knownRoles() {
  const set = new Set(['owner', 'staff', 'student']);
  for (const r of RULES) set.add(r.role);
  return [...set];
}

const enc = new TextEncoder();

function b64url(buf) {
  let s = '';
  const a = new Uint8Array(buf);
  for (let i = 0; i < a.length; i++) s += String.fromCharCode(a[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmac(key, msg) {
  const k = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', k, enc.encode(msg)));
}

async function sha(str) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(str)));
}

function same(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i];
  return d === 0;
}

function readCookie(req, name) {
  const raw = req.headers.get('cookie') || '';
  const m = raw.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  return m ? m[1] : '';
}

/* The cookie is signed with the role's own password, so it cannot be forged
   without the password, and rotating the password invalidates it. */
async function sessionRole(req) {
  const v = readCookie(req, COOKIE);
  const [role, exp, sig] = v.split('.');
  if (!role || !exp || !sig) return null;
  if (!(Number(exp) > Date.now() / 1000)) return null;
  const pass = passFor(role);
  if (!pass) return null;
  const want = await hmac(pass, 'sl1|' + role + '|' + exp);
  return same(enc.encode(want), enc.encode(sig)) ? role : null;
}

async function roleForPassword(input) {
  if (!input) return null;
  const got = await sha(input);
  let best = null;
  for (const role of knownRoles()) { // check every role, no early exit
    const pass = passFor(role);
    if (!pass) continue;
    if (same(await sha(pass), got)) {
      if (!best || (RANK[role] || 0) > (RANK[best] || 0)) best = role;
    }
  }
  return best;
}

function safeNext(n) {
  if (typeof n !== 'string' || !n.startsWith('/') || n.startsWith('//') || n.includes('\\')) return '/';
  return n;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const NOCACHE = {
  'content-type': 'text/html; charset=utf-8',
  'cache-control': 'no-store',
  'x-robots-tag': 'noindex, nofollow',
  'referrer-policy': 'same-origin',
};

const ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2.2"></rect><path d="M8.5 11V8.2a3.5 3.5 0 0 1 7 0V11"></path></svg>';

function page(title, body) {
  return '<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">' +
    '<title>' + title + '</title>' +
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600&family=Poppins:wght@300;700&display=swap" rel="stylesheet">' +
    '<style>' +
    ':root{--bg:#F7F5F0;--card:#fff;--ink:#141F3D;--soft:#5F6C8A;--line:#C9C3B4;--field:#F7F5F0;--edge:#E4E0D6;--err:#C2410C}' +
    '@media (prefers-color-scheme:dark){:root{--bg:#0E1424;--card:#151D33;--ink:#EEF1F8;--soft:#A3ADC6;--line:#3A4560;--field:#0E1424;--edge:#2C3652;--err:#FB923C}}' +
    '*{box-sizing:border-box}html,body{margin:0}' +
    'body{min-height:100vh;min-height:100svh;display:flex;align-items:center;justify-content:center;padding:24px 16px;background:var(--bg);color:var(--ink);font-family:"Rubik","Heebo",-apple-system,sans-serif}' +
    '.box{width:100%;max-width:360px;text-align:center;background:var(--card);border:1.5px dashed var(--line);border-radius:20px;padding:34px 24px 28px}' +
    '.mark{width:38px;height:38px;margin:0 auto 16px;border-radius:11px;background:var(--ink);color:var(--card);display:flex;align-items:center;justify-content:center}' +
    '.mark svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}' +
    '.wm{font-family:"Poppins",sans-serif;font-size:15px;font-weight:300;letter-spacing:1.9px;text-transform:uppercase;direction:ltr}.wm b{font-weight:700}' +
    '.sub{margin:7px 0 22px;font-size:14px;color:var(--soft);line-height:1.5}' +
    'label{display:block;text-align:right;font-size:13px;color:var(--soft);margin-bottom:6px}' +
    'input{width:100%;height:50px;padding:0 14px;font:inherit;font-size:17px;color:var(--ink);background:var(--field);border:1.5px solid var(--edge);border-radius:14px;outline:none;direction:ltr;text-align:left}' +
    'input:focus{border-color:var(--ink)}' +
    'button{margin-top:14px;width:100%;height:50px;border:0;border-radius:999px;background:var(--ink);color:var(--card);font:inherit;font-size:16px;font-weight:600;cursor:pointer}' +
    'button:focus-visible{outline:3px solid var(--line);outline-offset:2px}' +
    '.err{min-height:20px;margin-top:12px;font-size:13.5px;color:var(--err);line-height:1.5}' +
    '.foot{margin-top:18px;font-size:12.5px;color:var(--soft)}.foot a{color:inherit}' +
    '</style></head><body><main class="box">' + body + '</main></body></html>';
}

/* ---------- course roles (the John Bryce sites) ----------
   The course pages have their own role picker. A password opens a set of roles:
   owner: everything, always entered as 'owner' (admin of all roles)
   staff: lecturer, admin (operations), marketing, and student
   student: student only */
const PAGE_ROLES = ['lecturer', 'admin', 'student', 'marketing'];
const PAGE_LABEL = { lecturer: 'מרצה', admin: 'מנהלה', student: 'סטודנט', marketing: 'מרקטינג' };

function pageRoleFor(serverRole, as) {
  if (serverRole === 'owner') return 'owner';
  if (!as) return serverRole === 'student' ? 'student' : serverRole === 'staff' ? 'STAFF' : null;
  if (serverRole === 'staff') return PAGE_ROLES.includes(as) ? as : null;
  if (serverRole === 'student') return as === 'student' ? 'student' : null;
  return null;
}

function isCourse(p) {
  return normalize(p).startsWith('/jb53500');
}

function courseLoginPage(nextPath, msg, status, as) {
  const sel = PAGE_ROLES.includes(as) ? as : 'student';
  const opts = PAGE_ROLES.map((r) => '<option value="' + r + '"' + (r === sel ? ' selected' : '') + '>' + PAGE_LABEL[r] + '</option>').join('');
  const html = '<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">' +
    '<title>כניסה · מיישם AI ואוטומציה 53500</title>' +
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;700;800;900&family=Poppins:wght@700&display=swap" rel="stylesheet">' +
    '<style>' +
    ':root{--navy:#1B2D6B;--coral:#E4002B;--coral-soft:#FCE6EA;--red-dk:#B00020;--paper:#FFFFFF;--ink:#1E1E1E;--ink-2:#555555;--ink-3:#8A8A8A;--line:#E2E2E2;--dash:#C9C9C9}' +
    '*{box-sizing:border-box;margin:0;padding:0}' +
    'body{min-height:100vh;min-height:100svh;font-family:"Heebo",-apple-system,sans-serif;background:var(--navy);color:var(--ink);display:flex;align-items:center;justify-content:center;padding:24px 16px;position:relative}' +
    'body::before{content:"";position:fixed;inset:0;background:radial-gradient(1100px 620px at 78% -12%,rgba(228,0,43,.34),transparent 62%),radial-gradient(760px 520px at 6% 106%,rgba(42,64,144,.62),transparent 60%)}' +
    '.gcard{position:relative;width:100%;max-width:480px;background:var(--paper);border-radius:8px;padding:38px 38px 32px;box-shadow:0 30px 70px -28px rgba(0,0,0,.65)}' +
    '.gk{display:inline-block;background:var(--coral);color:#fff;font-family:"Poppins",sans-serif;font-weight:700;font-size:11px;letter-spacing:.14em;padding:5px 11px;border-radius:99px;margin-bottom:18px;direction:ltr}' +
    'h1{font-size:29px;font-weight:900;color:var(--navy);line-height:1.2;margin-bottom:10px}' +
    '.gp{font-size:15px;color:var(--ink-2);line-height:1.75;margin-bottom:24px}' +
    'label{display:block;font-size:13px;font-weight:800;color:var(--ink);margin:0 0 7px}' +
    'select,input{width:100%;padding:12px 14px;font:inherit;font-size:15px;border:1.5px solid var(--line);border-radius:5px;background:#fff;color:var(--ink);margin-bottom:17px}' +
    'select:focus,input:focus{outline:none;border-color:var(--coral)}' +
    'input{letter-spacing:.06em}' +
    'button{width:100%;padding:13px;border:0;border-radius:5px;background:var(--coral);color:#fff;font:inherit;font-size:16px;font-weight:800;cursor:pointer}' +
    'button:hover{background:var(--red-dk)}button:focus-visible{outline:3px solid var(--navy);outline-offset:2px}' +
    '.gerr{background:var(--coral-soft);border:1px solid #F6C4CD;color:var(--red-dk);border-radius:5px;padding:11px 14px;font-size:14px;font-weight:700;margin-bottom:16px}' +
    '.gfoot{margin-top:22px;padding-top:16px;border-top:2px dashed var(--dash);font-size:12.5px;color:var(--ink-3);line-height:1.7}' +
    '@media (max-width:700px){.gcard{padding:28px 22px 24px}h1{font-size:24px}}' +
    '</style></head><body><main class="gcard">' +
    '<span class="gk">JOHN BRYCE / MATRIX</span>' +
    '<h1>מיישם AI ואוטומציה<br>מק"ט 53500</h1>' +
    '<p class="gp">מרחב העבודה של הקורס: הסילבוס המלא, הפרויקט שמלווה כל תלמיד, ארגז כלים עם הפרומפטים והמושגים, השקפים של הכיתה ועזר למכירות. בחרו את התפקיד שלכם והזינו את הקוד שקיבלתם.</p>' +
    (msg ? '<div class="gerr" role="alert">' + esc(msg) + '</div>' : '') +
    '<form method="post" action="/_auth/login">' +
    '<input type="hidden" name="next" value="' + esc(nextPath) + '">' +
    '<label for="grole">אני</label><select id="grole" name="as">' + opts + '</select>' +
    '<label for="gcode">קוד כניסה</label>' +
    '<input id="gcode" name="password" type="password" autocomplete="current-password" placeholder="הזינו את הקוד" required autofocus spellcheck="false">' +
    '<button type="submit">כניסה</button></form>' +
    '<div class="gfoot">לא קיבלתם קוד? פנו לרכזת הקורס או למרצה.</div>' +
    '</main></body></html>';
  return new Response(html, { status: status || 401, headers: NOCACHE });
}

function loginPage(nextPath, msg, status, as) {
  if (isCourse(nextPath.split('?')[0])) return courseLoginPage(nextPath, msg, status, as);
  const body =
    '<div class="mark">' + ICON + '</div>' +
    '<div class="wm">Simpla <b>Lab</b></div>' +
    '<p class="sub">העמוד הזה סגור. הכניסו את הסיסמה שקיבלתם.</p>' +
    '<form method="post" action="/_auth/login" autocomplete="on">' +
    '<input type="hidden" name="next" value="' + esc(nextPath) + '">' +
    '<label for="pw">סיסמה</label>' +
    '<input id="pw" name="password" type="password" autocomplete="current-password" required autofocus spellcheck="false">' +
    '<button type="submit">כניסה</button>' +
    '<div class="err" role="alert">' + (msg ? esc(msg) : '') + '</div>' +
    '</form>';
  return new Response(page('כניסה · Simpla Lab', body), { status: status || 401, headers: NOCACHE });
}

/* After login: set the session cookie, then pre-fill the role keys that the
   course sites' own in-page gates read, so nobody is asked for a second code. */
function welcome(role, pageRole, as, nextPath, cookie) {
  const keys = {};
  if (pageRole) {
    keys['jb53500.role'] = pageRole;
    keys['jb27.role'] = pageRole;
  }
  if (as) keys['jb27.lastRole'] = as;
  if (role === 'owner' || role === 'staff') keys['sl.gate'] = 'NOW';
  const js =
    '(function(){var K=' + JSON.stringify(keys) + ',S=["lecturer","admin","marketing"];' +
    'try{for(var k in K){var v=K[k];if(v==="NOW")v=String(Date.now());' +
    'if(v==="STAFF"){var c=localStorage.getItem(k);v=S.indexOf(c)>-1?c:"lecturer";}' +
    'localStorage.setItem(k,v);}}catch(e){}' +
    'location.replace(' + JSON.stringify(nextPath) + ');})();';
  const body =
    '<div class="mark">' + ICON + '</div><div class="wm">Simpla <b>Lab</b></div>' +
    '<p class="sub">נכנסתם. מעבירים אתכם לעמוד...</p>' +
    '<p class="foot"><a href="' + esc(nextPath) + '">להמשיך</a></p>' +
    '<script>' + js + '</script>';
  const h = new Headers(NOCACHE);
  h.append('set-cookie', cookie);
  h.append('set-cookie', HINT + '=' + role + '; Path=/; Max-Age=' + MAX_AGE + '; Secure; SameSite=Lax');
  return new Response(page('נכנסתם · Simpla Lab', body), { status: 200, headers: h });
}

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- the gate ---------- */

export default async function middleware(request) {
  const url = new URL(request.url);
  const path = normalize(url.pathname).replace(/\/$/, '') || '/';

  if (path === '/_auth/logout') {
    const h = new Headers({ location: '/_auth/login', 'cache-control': 'no-store' });
    h.append('set-cookie', COOKIE + '=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax');
    h.append('set-cookie', HINT + '=; Path=/; Max-Age=0; Secure; SameSite=Lax');
    return new Response(null, { status: 303, headers: h });
  }

  if (path === '/_auth/login') {
    if (request.method !== 'POST') {
      return loginPage(safeNext(url.searchParams.get('next') || '/'), '', 200);
    }
    let form;
    try { form = await request.formData(); } catch (e) { form = new FormData(); }
    const json = request.headers.get('x-sl-json') === '1';
    const nextPath = safeNext(String(form.get('next') || '/'));
    const asRaw = String(form.get('as') || '');
    const as = PAGE_ROLES.includes(asRaw) ? asRaw : '';
    const fail = (code, msg, status) => json
      ? new Response(JSON.stringify({ ok: false, error: code }), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } })
      : loginPage(nextPath, msg, status, as);

    const role = await roleForPassword(String(form.get('password') || ''));
    if (!role) {
      await pause(900); // slows down guessing
      return fail('password', isCourse(nextPath) ? 'הקוד לא נכון. בדקו אותו ונסו שוב.' : 'הסיסמה לא נכונה. נסו שוב.', 401);
    }
    const need = needFor(new URL(nextPath, url.origin).pathname);
    if (!allowed(role, need)) {
      return fail('page', 'הסיסמה נכונה, אבל היא לא פותחת את העמוד הזה.', 403);
    }
    const pageRole = pageRoleFor(role, as);
    if (as && !pageRole) {
      return fail('role', 'הקוד לא מתאים לתפקיד שנבחר. בדקו את הקוד ואת הבחירה בתפריט.', 403);
    }
    const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
    const sig = await hmac(passFor(role), 'sl1|' + role + '|' + exp);
    const cookie = COOKIE + '=' + role + '.' + exp + '.' + sig + '; Path=/; Max-Age=' + MAX_AGE + '; HttpOnly; Secure; SameSite=Lax';
    if (json) {
      const h = new Headers({ 'content-type': 'application/json', 'cache-control': 'no-store' });
      h.append('set-cookie', cookie);
      h.append('set-cookie', HINT + '=' + role + '; Path=/; Max-Age=' + MAX_AGE + '; Secure; SameSite=Lax');
      return new Response(JSON.stringify({ ok: true, role, as: pageRole === 'STAFF' ? 'lecturer' : pageRole }), { status: 200, headers: h });
    }
    return welcome(role, pageRole, as, nextPath, cookie);
  }

  const need = needFor(url.pathname);
  if (!need) return next(); // public

  const have = await sessionRole(request);
  if (allowed(have, need)) return next();

  const back = url.pathname + url.search;
  if (have) return loginPage(back, 'העמוד הזה דורש סיסמה אחרת.', 403);
  return loginPage(back, '', 401);
}
