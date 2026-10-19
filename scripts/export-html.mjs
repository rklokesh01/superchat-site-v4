// Exports one live page as a single self-contained HTML file (inline CSS + JS, fonts and images
// embedded, internal links → live site). Usage: node scripts/export-html.mjs /whatsapp out.html
import fs from 'node:fs';

const BASE = 'https://superchat-site-v4.vercel.app';
const PAGE = process.argv[2] || '/whatsapp';
const OUT = process.argv[3] || 'superchat-whatsapp.html';
const CHROME = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36';

const cache = new Map();
async function get(url, binary) {
  const key = url + (binary ? '#b' : '');
  if (cache.has(key)) return cache.get(key);
  const r = await fetch(url, { headers: { 'User-Agent': CHROME } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  const v = binary ? { buf: Buffer.from(await r.arrayBuffer()), type: r.headers.get('content-type') } : await r.text();
  cache.set(key, v);
  return v;
}
const abs = (u) => (u.startsWith('http') ? u : BASE + u);
async function dataUri(u) {
  const { buf, type } = await get(abs(u), true);
  return `data:${(type || 'application/octet-stream').split(';')[0]};base64,${buf.toString('base64')}`;
}
async function inlineCssUrls(css, from) {
  const urls = [...new Set([...css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)].map((m) => m[1]).filter((u) => !u.startsWith('data:')))];
  for (const u of urls) {
    const full = new URL(u, from).href;
    css = css.split(u).join(await dataUri(full));
  }
  return css;
}
// /_next/image?url=%2Fassets%2Fx.png&w=..  →  original file
const original = (src) => {
  const m = src.replace(/&amp;/g, '&').match(/\/_next\/image\?url=([^&]+)/);
  return m ? decodeURIComponent(m[1]) : src;
};

let html = await get(BASE + PAGE);

// 1. Stylesheets (Next CSS + Google Fonts) → inline <style>, with fonts embedded
for (const m of [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*>/g)]) {
  const href = m[0].match(/href="([^"]+)"/)[1].replace(/&amp;/g, '&');
  const url = abs(href);
  const css = await inlineCssUrls(await get(url), url);
  // Keep the React-rendered <link> (hydration expects it; absolute URL so online it still resolves) and add
  // an inline copy right after it, so the file works offline.
  const keep = m[0].replace(/href="\//, `href="${BASE}/`);
  html = html.replace(m[0], () => `${keep}<style>${css.replace(/<\/style/gi, '<\\/style')}</style>`);
}
// 2. Drop preloads/preconnects (nothing left to fetch); font preloads too
html = html.replace(/(<link[^>]*rel="(?:preload|preconnect|modulepreload)"[^>]*href=")\/(?!\/)/g, (_m, a) => a + BASE + '/');
// 4. Images: drop srcset (single embedded source), embed src
html = html.replace(/\s(srcSet|srcset|imageSizes|sizes)="[^"]*"/g, '');
for (const m of [...new Set([...html.matchAll(/\ssrc="(\/[^"]+)"/g)].map((x) => x[1]))]) {
  if (m.startsWith('/_next/static/')) continue;
  html = html.split(`src="${m}"`).join(`src="${await dataUri(original(m))}"`);
}
// 5. Icons
for (const m of [...html.matchAll(/<link[^>]*rel="(icon|apple-touch-icon)"[^>]*>/g)]) {
  const href = m[0].match(/href="([^"]+)"/)[1];
  { const d = await dataUri(href.replace(/&amp;/g, '&')); html = html.replace(m[0], () => m[0].split(href).join(d)); }
}
// 6. Internal links → live site (the file works on its own; other pages open online)
html = html.replace(/href="\/(?!\/)([^"]*)"/g, (_m, p) => `href="${BASE}/${p}"`);

// 6b. Next's inline flight data (self.__next_f) re-declares the stylesheet and font preloads by relative path;
// point those at the live site too, so React's resource hoisting never requests a missing local file.
html = html.replace(/(\\?")\/(_next\/static\/css\/|fonts\/)/g, (_m, q, p) => `${q}${BASE}/${p}`);
// 3. Scripts → inline, in document order
for (const m of [...html.matchAll(/<script([^>]*) src="([^"]+)"([^>]*)><\/script>/g)]) {
  const js = await get(abs(m[2]));
  const attrs = (m[1] + m[3]).replace(/\s(async|defer)(="")?/g, '').replace(/\snoModule(="")?/g, ' nomodule');
  html = html.replace(m[0], () => `<script${attrs}>${js.replace(/<\/script/gi, '<\\/script')}</script>`);
}
fs.writeFileSync(OUT, html);
const left = [...html.matchAll(/(?:src|href)="(\/[^"\/][^"]*)"/g)].map((m) => m[1]);
console.log(OUT, (html.length / 1024).toFixed(0) + ' KB', 'remaining relative refs:', left.length, left.slice(0, 5));
