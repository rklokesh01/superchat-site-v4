// Converts the design handoff's reference templates (inline-styled HTML with
// {{ holes }}, <sc-for>, <sc-if>, <dc-import>, <image-slot>) into TSX views.
// The templates are the source of truth for every pixel value, so the views
// are generated rather than hand-copied. Run: npm run convert
import { parseDocument } from 'htmlparser2';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

import { PAGES, readPage, rewriteLinks } from './pages.mjs';
const OUT = path.resolve('components/views');
const CSS_OUT = path.resolve('app/hover.generated.css');

// Per-page patches: small, asserted string edits applied to a handoff template before
// conversion (a11y attributes, hooks, and design tweaks the user asked for). A value
// starting with "file:" is read from that file (for long blocks).
const PATCHES = {
  'Nav.dc.html': [
    ['<button onClick="{{ openMobile }}" aria-label="Open menu"', '<button onClick="{{ openMobile }}" aria-label="Open menu" aria-expanded="{{ mobOpen }}"'],
    ['<div style="position:fixed;inset:0;z-index:1000;background:#022B1A;', '<div role="dialog" aria-modal="true" aria-label="Menu" data-mob-overlay="1" style="overscroll-behavior:contain;position:fixed;inset:0;z-index:1000;background:#022B1A;'],
    ['<button onClick="{{ c.toggle }}"', '<button onClick="{{ c.toggle }}" aria-expanded="{{ c.open }}"'],
    ['<img src="assets/avatars.png" alt=""', '<img src="assets/avatars.png" alt="Superchat users"'],
  ],
  'Footer.dc.html': [],
  'Superchat Home.dc.html': [
    ['<button onClick="{{ dayPrev }}"', '<button onClick="{{ dayPrev }}" aria-label="Earlier errand"'],
    ['<button onClick="{{ dayNext }}"', '<button onClick="{{ dayNext }}" aria-label="Later errand"'],
    // ── Tweaks the user asked for on V3 (2026-09-30), carried into V4 ──
    // Zoomed "Human vs agent" clock must stay crisp: will-change froze it as a 1x bitmap stretched to 3.6x.
    // The second-hand trail gets a soft SVG blur (subtle motion blur) and fades out as the zoom settles.
    ['aspect-ratio:1;will-change:transform;transform-origin:50% 50%"', 'aspect-ratio:1;transform-origin:50% 50%"'],
    ['<line data-ctrail="1"', '<defs><filter id="cmb" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="1.6"></feGaussianBlur></filter></defs><g filter="url(#cmb)"><line data-ctrail="1"'],
    ['<line data-ctrail="8" x1="200" y1="232" x2="200" y2="44" stroke="#00E385" stroke-width="7.3" stroke-linecap="round" opacity="0"></line>', '<line data-ctrail="8" x1="200" y1="232" x2="200" y2="44" stroke="#00E385" stroke-width="7.3" stroke-linecap="round" opacity="0"></line></g>'],
    // More air between the four "X of 4 done" progress segments (Agentic AI).
    ['repeat(4,1fr);gap:6px;max-width:320px;margin-top:14px', 'repeat(4,1fr);gap:14px;max-width:344px;margin-top:14px'],
    // Features travel card uses the "Phone · Your trip" screen (assets-src/phone-your-trip.svg, rasterised).
    ['<img src="assets/travel-phone.png" loading="lazy" decoding="async" alt="Superchat trip booking screen"', '<img src="assets/travel-phone-your-trip.png" loading="lazy" decoding="async" alt="Superchat trip itinerary with routes on a map of Sydney"'],
    // Sticky chat dock matches the real app UI (hero phone / Chatbots-vs-Superchat phone), in Geist.
    ['<div data-dock="1" style="position:fixed;', '<div data-dock="1" style="font-family:\'Geist\',system-ui,sans-serif;position:fixed;'],
    ['file:templates/dock-panel.orig.html', 'file:templates/dock-panel.app.html'],
  ],
  'Money.dc.html': [
    // Four images were accidentally dropped below the footer in the prototype canvas.
    [/<img src="\.\/shopping-muzx72gh[\s\S]*?download-muzx77vr-xsqc\.webp"[^>]*>/, ''],
  ],
};
const IF_CLASS = { 'Nav.dc.html': { desktop: 'only-desk', mobile: 'only-mob' } };
const SHARED = [{ file: 'Nav.dc.html', name: 'Nav' }, { file: 'Footer.dc.html', name: 'Footer' }];

const VOID = new Set(['img', 'input', 'br', 'hr', 'meta', 'link', 'source']);
const hoverRules = new Map();

const SRCS = [[/^assets\//, '/assets/'], [/^\.\//, '/images/']];
const pageCss = [];

const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const cssKey = (p) => {
  if (p.startsWith('--')) return JSON.stringify(p);
  if (p.startsWith('-webkit-')) return 'Webkit' + camel(p.slice(8)).replace(/^./, (c) => c.toUpperCase());
  if (p.startsWith('-moz-')) return 'Moz' + camel(p.slice(5)).replace(/^./, (c) => c.toUpperCase());
  return camel(p);
};

function splitTop(str, sep) {
  const out = []; let depth = 0, q = null, cur = '';
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (str.startsWith('{{', i)) { const j = str.indexOf('}}', i); cur += str.slice(i, j + 2); i = j + 1; continue; }
    if (q) { if (ch === q) q = null; cur += ch; continue; }
    if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
    if (ch === '(') depth++; if (ch === ')') depth--;
    if (ch === sep && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
}

function parseDecls(style) {
  const map = new Map();
  for (const d of splitTop(style, ';')) {
    const i = d.indexOf(':'); if (i < 0) continue;
    const prop = d.slice(0, i).trim().toLowerCase(), val = d.slice(i + 1).trim();
    if (!prop) continue;
    map.delete(prop); map.set(prop, val); // last declaration wins, like CSS
  }
  return map;
}

function holeExpr(expr, scope) {
  expr = expr.trim();
  if (/^(true|false|null|-?\d+(\.\d+)?)$/.test(expr)) return expr;
  const root = expr.split(/[.[]/)[0];
  const hit = [...scope].reverse().find((s) => s.name === root);
  return hit ? hit.alias + expr.slice(root.length) : `v.${expr}`;
}

// attribute/style value → JS expression source
function valueExpr(val, scope, mapStatic = (s) => s) {
  const parts = []; let last = 0; const re = /\{\{([^}]*)\}\}/g; let m;
  while ((m = re.exec(val))) { parts.push({ s: val.slice(last, m.index) }, { e: holeExpr(m[1], scope) }); last = re.lastIndex; }
  parts.push({ s: val.slice(last) });
  const nonEmpty = parts.filter((p) => p.e || p.s);
  if (nonEmpty.length === 1 && nonEmpty[0].e) return nonEmpty[0].e;
  if (!nonEmpty.some((p) => p.e)) return JSON.stringify(mapStatic(val));
  return '`' + nonEmpty.map((p) => (p.e ? '${' + p.e + '}' : p.s.replace(/[`\\$]/g, '\\$&'))).join('') + '`';
}

function hoverClass(hover, scope, styleEntries, pseudo = ':hover,:focus-visible') {
  const decls = parseDecls(hover); const vars = []; let k = 0; const body = [];
  for (const [p, val] of decls) {
    if (/\{\{/.test(val)) { const name = `--hv${k++}`; vars.push([name, valueExpr(val, scope)]); body.push(`${p}:var(${name})!important`); }
    else body.push(`${p}:${val}!important`);
  }
  const css = body.join(';');
  const cls = (pseudo.startsWith(':active') ? 'a-' : pseudo.startsWith(':focus') ? 'f-' : 'h-') + crypto.createHash('md5').update(css).digest('hex').slice(0, 7);
  hoverRules.set(cls, pseudo.split(',').map((ps) => `.${cls}${ps}`).join(',') + `{${css}}`);
  for (const [n, e] of vars) styleEntries.push([JSON.stringify(n), e]);
  return cls;
}

function attrName(tag, n) {
  if (n.startsWith('data-') || n.startsWith('aria-')) return n;
  if (n === 'class') return 'className';
  if (n === 'for') return 'htmlFor';
  if (n === 'tabindex') return 'tabIndex';
  if (n === 'inputmode') return 'inputMode';
  if (n === 'readonly') return 'readOnly';
  if (n === 'autofocus') return 'autoFocus';
  if (n === 'novalidate') return 'noValidate';
  if (n === 'maxlength') return 'maxLength';
  if (n === 'minlength') return 'minLength';
  if (n === 'autocomplete') return 'autoComplete';
  if (n === 'enterkeyhint') return 'enterKeyHint';
  if (n === 'spellcheck') return 'spellCheck';
  if (n === 'xlink:href') return 'xlinkHref';
  if (n === 'onInput' && tag === 'input') return 'onChange';
  return camel(n);
}

let loopDepth = 0;
function convertChildren(nodes, scope, opts, ind) {
  return nodes.map((n) => convertNode(n, scope, opts, ind)).filter((s) => s !== '').join('\n');
}

// Holes render as <span class="sc-interp"> like the prototype runtime (support.js) does — this
// matters inside flex/grid containers, where each span is its own item. Not inside SVG.
function textJSX(raw, scope, ind, inSvg) {
  const txt = raw.replace(/\s+/g, ' ');
  if (!txt) return '';
  const parts = []; let last = 0; const re = /\{\{([^}]*)\}\}/g; let m;
  const out = [];
  while ((m = re.exec(txt))) {
    if (m.index > last) out.push(ind + '{' + JSON.stringify(txt.slice(last, m.index)) + '}');
    const e = holeExpr(m[1], scope);
    out.push(inSvg ? ind + '{' + e + '}' : ind + '<span className="sc-interp">{' + e + '}</span>');
    last = re.lastIndex;
  }
  if (last < txt.length) out.push(ind + '{' + JSON.stringify(txt.slice(last)) + '}');
  return out.join('\n');
}

function convertNode(n, scope, opts, ind) {
  if (n.type === 'text') return textJSX(n.data, scope, ind, opts.inSvg);
  if (n.type === 'comment' || n.type === 'directive') return '';
  if (n.type !== 'tag' && n.type !== 'script' && n.type !== 'style') return '';
  const tag = n.name, a = n.attribs || {};
  if (tag === 'helmet') { for (const c of n.children) if (c.name === 'style') collectCss(c.children.map((x) => x.data).join(''), opts); return ''; }
  if (tag === 'script' || tag === 'style' || tag === 'link') return '';
  if (tag === 'svg' && !opts.inSvg) opts = { ...opts, inSvg: true };
  const inner = (s = scope) => convertChildren(n.children, s, opts, ind + '  ');

  if (tag === 'sc-for') {
    const list = valueExpr(a.list, scope), key = `i${loopDepth++}`, as = a.as === 'v' ? 'vv' : a.as;
    const body = convertChildren(n.children, [...scope, { name: a.as, alias: as }], opts, ind + '    ');
    return `${ind}{(${list} as any[]).map((${as}: any, ${key}: number) => (\n${ind}  <Fragment key={${key}}>\n${body}\n${ind}  </Fragment>\n${ind}))}`;
  }
  if (tag === 'sc-if') {
    const raw = (a.value.match(/\{\{([^}]*)\}\}/) || [])[1]?.trim();
    const cls = opts.ifClass?.[raw];
    if (cls) return `${ind}<div className="${cls}">\n${inner()}\n${ind}</div>`;
    return `${ind}{${valueExpr(a.value, scope)} ? (\n${ind}  <>\n${inner()}\n${ind}  </>\n${ind}) : null}`;
  }

  const styleEntries = []; const classes = [];
  if (a.style) {
    const decls = parseDecls(a.style);
    for (const [p, val] of decls) styleEntries.push([cssKey(p), valueExpr(val, scope)]);
    if (/font-family:\s*'PP Frama',/.test(a.style)) classes.push('pf');
  }
  if (a['style-hover']) classes.push(hoverClass(a['style-hover'], scope, styleEntries));
  if (a['style-active']) classes.push(hoverClass(a['style-active'], scope, styleEntries, ':active'));
  if (a['style-focus']) classes.push(hoverClass(a['style-focus'], scope, styleEntries, ':focus,:focus-visible'));
  const hasVars = styleEntries.some(([k]) => k.startsWith('"--'));
  const styleSrc = styleEntries.length ? `style={{ ${styleEntries.map(([k, e]) => `${k}: ${e}`).join(', ')} }${hasVars ? ' as CSSProperties' : ''}}` : '';

  if (tag === 'dc-import') {
    const props = Object.entries(a).filter(([k]) => !['name', 'style'].includes(k) && !k.startsWith('hint-'))
      .map(([k, val]) => `${k}={${valueExpr(val, scope)}}`).join(' ');
    return `${ind}<div ${styleSrc}><${a.name} ${props} /></div>`;
  }
  if (tag === 'dc-slot') return `${ind}{v.slots?.${a.name} ?? null}`;
  if (tag === 'x-import') {
    const props = Object.entries(a).filter(([k]) => !['component-from-global-scope', 'from', 'style'].includes(k) && !k.startsWith('hint-'))
      .map(([k, val]) => `${k}={${valueExpr(val, scope)}}`).join(' ');
    return `${ind}<ScShape ${props} ${styleSrc} />`;
  }
  if (tag === 'image-slot') {
    return `${ind}<PhotoSlot id={${valueExpr(a.id, scope)}} alt={${valueExpr(a.placeholder || '', scope)}} ${styleSrc} />`;
  }

  const attrs = [];
  if (classes.length || a.class) attrs.push(`className=${JSON.stringify([a.class, ...classes].filter(Boolean).join(' '))}`);
  if (styleSrc) attrs.push(styleSrc);
  for (const [k, val] of Object.entries(a)) {
    if (k === 'style' || k === 'style-hover' || k === 'style-active' || k === 'style-focus' || k === 'class' || k.startsWith('hint-')) continue;
    let mapStatic = (s) => s;
    if (k === 'src') mapStatic = (s) => SRCS.reduce((acc, [re, to]) => acc.replace(re, to), s);
    const name = attrName(tag, k);
    if (/^(tabIndex|aria-value(min|max|now))$/.test(name) && /^-?\d+$/.test(val)) { attrs.push(`${name}={${val}}`); continue; }
    if (/^(required|disabled|checked|readOnly|autoFocus|multiple|hidden|noValidate|selected|open)$/.test(name) && !/\{\{/.test(val)) { attrs.push(`${name}={true}`); continue; }
    if (/^(rows|cols|maxLength|minLength|size|span)$/.test(name) && /^\d+$/.test(val)) { attrs.push(`${name}={${val}}`); continue; }
    attrs.push(`${name}={${valueExpr(val, scope, mapStatic)}}`);
  }
  const jsxTag = tag === 'img' ? 'Img' : tag;
  const open = `${ind}<${jsxTag}${attrs.length ? ' ' + attrs.join(' ') : ''}`;
  if (VOID.has(tag)) return `${open} />`;
  const kids = inner();
  if (!kids.trim()) return `${open} />`;
  return `${open}>\n${kids}\n${ind}</${jsxTag}>`;
}

// Page <style> blocks: keep keyframes and page-specific rules; the shared base
// (fonts, body, h1-3, links) lives in app/globals.css. Page rules are scoped to .pg-<page>.
const BASE = /^(@font-face|h1,h2,h3|button,input|body|html|img,svg|a\{color:#022B1A)/;
function collectCss(css, opts) {
  const rules = []; let depth = 0, cur = '';
  for (const ch of css) { cur += ch; if (ch === '{') depth++; if (ch === '}' && --depth === 0) { rules.push(cur.trim()); cur = ''; } }
  for (const r of rules) {
    if (BASE.test(r)) continue;
    if (r.startsWith('@keyframes')) { if (!pageCss.includes(r)) pageCss.push(r); continue; }
    const scoped = opts.page ? r.replace(/^([^{]+)/, (sel) => sel.split(',').map((x) => `.pg-${opts.page} ${x.trim()}`).join(',')) : r;
    if (!pageCss.includes(scoped)) pageCss.push(scoped);
  }
}

const header = (file, body) => `// GENERATED by scripts/convert.mjs from handoff/reference/${file}. Do not edit by hand.
/* eslint-disable */
import { Fragment, type CSSProperties } from 'react';
${body.includes('<Img ') ? "import Img from '@/components/Img';\n" : ''}${body.includes('<PhotoSlot ') ? "import PhotoSlot from '@/components/PhotoSlot';\n" : ''}${body.includes('<ScShape ') ? "import ScShape from '@/components/ScShape';\n" : ''}${body.includes('<Nav ') ? "import Nav from '@/components/Nav';\n" : ''}${body.includes('<Footer ') ? "import Footer from '@/components/Footer';\n" : ''}`;
const compName = (n) => {
  const a = n.attribs || {};
  if ('data-intro' in a) return 'IntroLoader';
  if ('data-dock' in a) return 'ChatDock';
  if ('data-totop' in a) return 'BackToTop';
  if (n.name === 'dc-import') return 'Footer' + 'Slot';
  const lab = a['data-screen-label'] || 'Section';
  return 'S' + lab.split(/[^A-Za-z0-9]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join('');
};

fs.mkdirSync(OUT, { recursive: true });
const pageKey = (route) => route.split('/').filter(Boolean)[0] || 'home';
for (const pg of [...SHARED, ...PAGES]) {
  loopDepth = 0;
  const opts = { page: SHARED.includes(pg) ? null : pg.name.toLowerCase(), ifClass: IF_CLASS[pg.file] };
  let src = readPage(pg.file).template;
  const rd = (x) => (typeof x === 'string' && x.startsWith('file:') ? fs.readFileSync(path.resolve(x.slice(5)), 'utf8') : x);
  for (const [a0, b0] of PATCHES[pg.file] || []) {
    const a = rd(a0), b = rd(b0);
    if (a instanceof RegExp ? !a.test(src) : !src.includes(a)) throw new Error(`${pg.file}: patch target missing: ${a0}`);
    src = a instanceof RegExp ? src.replace(a, b) : src.split(a).join(b);
  }
  src = rewriteLinks(src);
  const doc = parseDocument(src, { lowerCaseTags: false, lowerCaseAttributeNames: false, recognizeSelfClosing: true, decodeEntities: true });
  const name = pg.name + 'View';
  if (pg.split) {
    const dir = path.join(OUT, pg.name.toLowerCase());
    fs.mkdirSync(dir, { recursive: true });
    const parts = [];
    for (const n of doc.children) {
      if (n.type !== 'tag') continue;
      if (n.name === 'helmet') { convertNode(n, [], opts, ''); continue; }
      if (n.name === 'script') continue;
      const cname = compName(n), body = convertNode(n, [], opts, '    ');
      fs.writeFileSync(path.join(dir, cname + '.tsx'), `${header(pg.file, body)}
export default function ${cname}({ v }: { v: any }) {
  return (
${body}
  );
}
`);
      parts.push(cname);
    }
    fs.writeFileSync(path.join(OUT, name + '.tsx'), `// GENERATED by scripts/convert.mjs: ${pg.file}, one component per top-level section.
${parts.map((p) => `import ${p} from './${path.basename(dir)}/${p}';`).join('\n')}

export default function ${name}({ v }: { v: any }) {
  return (
    <div className="pg-${opts.page}">
${parts.map((p) => `      <${p} v={v} />`).join('\n')}
    </div>
  );
}
`);
    console.log('wrote', name, parts.length, 'parts');
    continue;
  }
  const body = convertChildren(doc.children, [], opts, '        ');
  const wrap = opts.page ? `      <div className="pg-${opts.page}">\n${body}\n      </div>` : `      <>\n${body}\n      </>`;
  fs.writeFileSync(path.join(OUT, name + '.tsx'), `${header(pg.file, body)}
export default function ${name}({ v }: { v: any }) {
  return (
${wrap}
  );
}
`);
}
fs.writeFileSync(CSS_OUT, '/* GENERATED by scripts/convert.mjs: style-hover/active/focus rules */\n' + [...hoverRules.values()].join('\n') + '\n');
fs.writeFileSync(path.resolve('app/pages.generated.css'), '/* GENERATED by scripts/convert.mjs: keyframes and page-scoped rules from each template <helmet> */\n' + pageCss.join('\n') + '\n');
console.log('views', SHARED.length + PAGES.length, 'hover rules', hoverRules.size, 'page css', pageCss.length);
