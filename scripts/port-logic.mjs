// Ports each page's logic class (the <script data-dc-script> in handoff/reference/*.dc.html)
// into lib/logic/<Name>.logic.ts, near-verbatim, so every progress mapping, easing and lerp
// stays the prototype's. Only the asserted patches below differ. Run: npm run convert
import fs from 'node:fs';
import path from 'node:path';
import { PAGES, readPage, rewriteLinks } from './pages.mjs';

const OUT = path.resolve('lib/logic');

// Applied to every page whose logic contains the target (not asserted).
const GENERIC = [
  ['React.createRef()', 'createRef()'],
  // Content modules: bundled + synchronous (lib/content.ts); the load moves to init() below.
  [/import\(new URL\(([^,]+?), location\.href\)\.href\)/g, '__mod($1)'],
  [/Promise\.all\((this\.V\.map\(v => __mod)/g, '__all($1'],
  [/this\.props\.motion \?\? true/g, '!reducedMotion()'],
  // Scroll lock without hiding the scrollbar (no layout shift) — user preference.
  ["openMobile: () => { document.body.style.overflow = 'hidden'; this.setState({ mob: true }); },", "openMobile: () => { this.unlock = this.unlock || lockScroll((t) => !!(t && t.closest && t.closest('[data-mob-overlay]'))); this.setState({ mob: true }); },"],
  ["closeMobile: () => { document.body.style.overflow = ''; this.setState({ mob: false }); },", "closeMobile: () => { this.unlock && this.unlock(); this.unlock = null; this.setState({ mob: false }); document.querySelector('[aria-label=\"Open menu\"]')?.focus(); },"],
  [/window\.Matter/g, 'Matter'],
];

// Asserted per-page patches.
const PATCHES = {
  'Nav.dc.html': [
    ['link = (x) => x && x.file ? encodeURI(x.file) : \'#\';', "link = (x) => (x && x.route ? x.route : '#');"],
    ["w: typeof window !== 'undefined' ? window.innerWidth : 1200 };", 'w: 1200 };'],
    ["onKey = (e) => { if (e.key === 'Escape') this.setState({ open: false, mob: false }); };", "onKey = (e) => { if (e.key === 'Escape') { if (this.state.mob) { this.unlock && this.unlock(); this.unlock = null; document.querySelector('[aria-label=\"Open menu\"]')?.focus(); } this.setState({ open: false, mob: false }); } };"],
    ["clearTimeout(this.ct); document.body.style.overflow = ''; }", 'clearTimeout(this.ct); this.unlock && this.unlock(); }'],
  ],
  'Superchat Home.dc.html': [
    // SSR-consistent initial state (measure() on mount flips it); otherwise hydration keeps server values.
    ["mob: typeof window !== 'undefined' && window.innerWidth < 720 };", 'mob: false };'],
    ['this.props.showPreview ?? true', 'true'],
    // Expose the homepage Lenis like Nav does on other pages, so scroll locks can pause it.
    ['this.lenis = new window.Lenis(', 'this.lenis = window.__scLenis = new window.Lenis('],
    // User fix (2026-09-30): keep the scrollbar during the intro, but pin the page at the top even if dragged.
    ["addEventListener('keydown', keys, true); this.lenis && this.lenis.stop && this.lenis.stop();", "addEventListener('keydown', keys, true); addEventListener('scroll', this.introPin = () => { if (scrollY !== 0) scrollTo(0, 0); }, { passive: true }); this.lenis && this.lenis.stop && this.lenis.stop();"],
    ["removeEventListener('keydown', keys, true); this.lenis && this.lenis.start && this.lenis.start(); };", "removeEventListener('keydown', keys, true); this.introPin && removeEventListener('scroll', this.introPin); this.lenis && this.lenis.start && this.lenis.start(); };"],
    ["if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 10, behavior: 'smooth' });", "if (el) { if (this.lenis) this.lenis.scrollTo(el, { offset: -10 }); else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 10, behavior: 'smooth' }); }"],
    ["dayPrev: () => { window.scrollBy({ top: -320, behavior: 'smooth' }); },", "dayPrev: () => { if (this.lenis) this.lenis.scrollTo(scrollY - 320); else window.scrollBy({ top: -320, behavior: 'smooth' }); },"],
    ["dayNext: () => { window.scrollBy({ top: 320, behavior: 'smooth' }); },", "dayNext: () => { if (this.lenis) this.lenis.scrollTo(scrollY + 320); else window.scrollBy({ top: 320, behavior: 'smooth' }); },"],
    // User request (2026-09-30): "One month with Superchat" cards are already moving as the section scrolls in.
    // Lead-in: while entering, cards advance LEAD px of depth; the pinned progress p then carries on (continuous).
    ['const p = Math.max(0, Math.min(1, -r.top / (r.height - vh)));\n          let done = 0;', 'const p = Math.max(0, Math.min(1, -r.top / (r.height - vh))), LEAD = 600, ein = Math.max(0, Math.min(1, (vh - r.top) / vh)), eIn = 1 - Math.pow(1 - ein, 2);\n          let done = 0;'],
    ['const z = -300 - i * GAP + p * (N * GAP + 900);', 'const z = -300 - i * GAP + eIn * LEAD + p * (N * GAP + 900 - LEAD);'],
  ],
  'Blog.dc.html': [
    ["narrow: typeof window !== 'undefined' && window.innerWidth < 600 };", 'narrow: false };'],
    ["window.addEventListener('resize', this.onR);", "window.addEventListener('resize', this.onR); this.onR();"],
  ],
  'Legal.dc.html': [
    ["wide: typeof window === 'undefined' ? true : window.innerWidth >= 960 };", 'wide: true };'],
    ["window.addEventListener('resize', this.onResize);", "window.addEventListener('resize', this.onResize); this.onResize();"],
    ["new URLSearchParams(location.search).get('doc') === 'terms'", "this.props.doc === 'terms'"],
  ],
  'WhatsApp v2.dc.html': [
    // SSR-consistent initial state; onResize() on mount sets the real values.
    ["wide: typeof window === 'undefined' ? true : window.innerWidth >= 960", 'wide: true'],
    ["narrow: typeof window === 'undefined' ? false : window.innerWidth < 720", 'narrow: false'],
  ],
};
for (const p of PAGES) if (p.kind === 'article') PATCHES[p.file] = [["new URLSearchParams(location.search).get('p')", 'this.props.slug']];

const IMPORTS = {
  'Nav.dc.html': "import { lockScroll } from '@/lib/dc';",
  'Footer.dc.html': "import Matter from 'matter-js';",
};

const apply = (src, a, b, must, file) => {
  const hit = typeof a === 'string' ? src.includes(a) : (a.lastIndex = 0, a.test(src));
  if (!hit) { if (must) throw new Error(`${file}: patch target missing: ${String(a).slice(0, 90)}`); return src; }
  if (a instanceof RegExp) a.lastIndex = 0;
  return typeof a === 'string' ? src.split(a).join(b) : src.replace(a, b);
};

fs.mkdirSync(OUT, { recursive: true });
const all = [{ file: 'Nav.dc.html', name: 'Nav' }, { file: 'Footer.dc.html', name: 'Footer' }, ...PAGES];
for (const pg of all) {
  let { logic: src, props } = readPage(pg.file);
  if (!src.trim()) src = 'class Component extends DCLogic {\n}\n';
  for (const [a, b] of GENERIC) src = apply(src, a, b, false, pg.file);
  for (const [a, b] of PATCHES[pg.file] || []) src = apply(src, a, b, true, pg.file);
  // Move synchronous content loads out of componentDidMount into init() (runs before first render, SSR too).
  const loads = [];
  src = src.replace(/(__all\(|__mod\()[\s\S]*?\)\);/g, (m) => { loads.push(m); return ''; });
  src = rewriteLinks(src);
  if (!src.includes('class Component extends DCLogic {')) throw new Error(`${pg.file}: class header not found`);
  src = src.replace('class Component extends DCLogic {', `export default class ${pg.name}Logic extends DCLogic {\n  [key: string]: any;${loads.length ? `\n  init() {\n    ${loads.join('\n    ')}\n  }` : ''}`);
  const defaults = Object.fromEntries(Object.entries(props).filter(([k, v]) => !k.startsWith('$') && v && 'default' in v).map(([k, v]) => [k, v.default]));
  fs.writeFileSync(path.join(OUT, pg.name + '.logic.ts'), `// @ts-nocheck
// GENERATED by scripts/port-logic.mjs from handoff/reference/${pg.file}. Do not edit by hand:
// edit the patch list in the script instead, so the prototype's math stays verbatim.
/* eslint-disable */
import { createRef } from 'react';
import { DCLogic, reducedMotion } from '@/lib/dc';
import { __mod, __all } from '@/lib/content';
${IMPORTS[pg.file] || ''}

export const DEFAULT_PROPS = ${JSON.stringify(defaults)};

${src}`);
}
console.log('ported', all.length, 'logic classes');
