// api/random.js
// Returns one random joke from a Google Sheet that was published to the web as CSV.
// Row 1 holds the headers: topic, text. The sheet address lives in SHEET_CSV_URL, not in the code.

const CACHE_MS = 60 * 1000; // keep the sheet for one minute, so we don't call Google on every click
let cache = { at: 0, rows: [] };

export default {
  async fetch(request) {
    if (request.method !== 'GET') {
      return Response.json({ error: 'אפשר לבקש מכאן רק GET' }, { status: 405 });
    }

    const url = process.env.SHEET_CSV_URL;
    if (!url) {
      console.error('SHEET_CSV_URL is missing. Add it in Vercel and redeploy.');
      return Response.json({ error: 'חסרה כתובת הגיליון בשרת' }, { status: 500 });
    }

    let rows = cache.rows;
    if (!rows.length || Date.now() - cache.at > CACHE_MS) {
      try {
        rows = await loadSheet(url);
        cache = { at: Date.now(), rows };
      } catch (err) {
        console.error('Sheet load failed:', err.message);
        // Google is slow or down? Serve the last copy we have, if any
        if (!cache.rows.length) {
          return Response.json({ error: err.userMessage || 'לא הצלחנו לקרוא את הגיליון' }, { status: 502 });
        }
        rows = cache.rows;
      }
    }

    if (!rows.length) {
      return Response.json({ error: 'הגיליון ריק. הוסיפו בדיחות בעמודה text.' }, { status: 404 });
    }

    const pick = rows[Math.floor(Math.random() * rows.length)];
    return Response.json({ joke: pick.text, topic: pick.topic, source: 'sheet' });
  }
};

async function loadSheet(url) {
  const res = await fetch(url, { redirect: 'follow' });
  const type = res.headers.get('content-type') || '';
  const body = await res.text();

  // Not published, or published as a web page: Google sends HTML instead of CSV
  if (!res.ok || type.includes('text/html') || body.trimStart().startsWith('<')) {
    const err = new Error(`Not CSV. status=${res.status} type=${type}`);
    err.userMessage = 'הגיליון לא מפורסם כ-CSV';
    throw err;
  }

  const table = parseCSV(body.replace(/^﻿/, ''));
  if (!table.length) return [];

  const head = table[0].map((h) => h.trim().toLowerCase());
  let textCol = head.indexOf('text');
  const topicCol = head.indexOf('topic');
  let start = 1;
  if (textCol === -1) { textCol = 0; start = head.includes('topic') ? 1 : 0; } // no headers: first column is the joke

  return table
    .slice(start)
    .map((r) => ({ text: (r[textCol] || '').trim(), topic: topicCol >= 0 ? (r[topicCol] || '').trim() : '' }))
    .filter((r) => r.text);
}

// A real CSV parser: a joke may contain commas, "quotes" and line breaks
function parseCSV(s) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quoted) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++; } else { quoted = false; }
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && s[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((f) => f !== '')) rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  row.push(field);
  if (row.some((f) => f !== '')) rows.push(row);
  return rows;
}
