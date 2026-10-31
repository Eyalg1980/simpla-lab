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

function loginPage(nextPath, msg, status) {
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
function welcome(role, nextPath, cookie) {
  const keys = {
    owner: { 'jb53500.role': 'owner', 'jb27.role': 'owner', 'sl.gate': 'NOW' },
    staff: { 'jb53500.role': 'STAFF', 'jb27.role': 'STAFF', 'sl.gate': 'NOW' },
    student: { 'jb53500.role': 'student', 'jb27.role': 'student' },
  }[role] || {};
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
    const nextPath = safeNext(String(form.get('next') || '/'));
    const role = await roleForPassword(String(form.get('password') || ''));
    if (!role) {
      await pause(900); // slows down guessing
      return loginPage(nextPath, 'הסיסמה לא נכונה. נסו שוב.', 401);
    }
    const need = needFor(new URL(nextPath, url.origin).pathname);
    if (!allowed(role, need)) {
      return loginPage(nextPath, 'הסיסמה נכונה, אבל היא לא פותחת את העמוד הזה.', 403);
    }
    const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
    const sig = await hmac(passFor(role), 'sl1|' + role + '|' + exp);
    const cookie = COOKIE + '=' + role + '.' + exp + '.' + sig + '; Path=/; Max-Age=' + MAX_AGE + '; HttpOnly; Secure; SameSite=Lax';
    return welcome(role, nextPath, cookie);
  }

  const need = needFor(url.pathname);
  if (!need) return next(); // public

  const have = await sessionRole(request);
  if (allowed(have, need)) return next();

  const back = url.pathname + url.search;
  if (have) return loginPage(back, 'העמוד הזה דורש סיסמה אחרת.', 403);
  return loginPage(back, '', 401);
}
