// Page registry: every handoff page → route + component name, plus helpers to
// read a .dc.html (template / logic / props) and rewrite prototype links to routes.
// Routes follow SITEMAP.md (the Nav CATS array is the source of truth).
import fs from 'node:fs';
import path from 'node:path';

export const HANDOFF = [process.env.HANDOFF, path.resolve('handoff')].find((d) => d && fs.existsSync(path.join(d, 'reference')));
if (!HANDOFF) { console.error('handoff/ (design_handoff_superchat_site) not found; set HANDOFF=/path/to/it'); process.exit(1); }
export const REF = path.join(HANDOFF, 'reference');

const VERTS = ['Money', 'Travel', 'Bookings', 'Shopping', 'Everyday'];
const FEATURES = {
  Money: [['Send Money', 'send-money'], ['Wallet v2', 'wallet'], ['Expenses', 'expenses']],
  Travel: [['Flight Booking', 'flight-booking'], ['Hotel Booking', 'hotel-booking'], ['Trip Planner', 'trip-planner']],
  Bookings: [['Restaurants', 'restaurants'], ['Parking Rentals', 'parking-rentals'], ['Home Services', 'home-services']],
  Shopping: [['Product Search', 'product-search'], ['AI Shopping', 'ai-shopping'], ['AI Ordering', 'ai-ordering']],
  Everyday: [['Smart Chat', 'smart-chat'], ['Reminders', 'reminders'], ['Email Calendar', 'email-calendar']],
};
const comp = (s) => s.replace(/[^A-Za-z0-9]+/g, ' ').trim().split(' ').map((w) => w[0].toUpperCase() + w.slice(1)).join('');

// kind: page | article (dynamic [slug]) | legal (two static routes)
export const PAGES = [
  { file: 'Superchat Home.dc.html', name: 'Home', route: '/', split: true },
  { file: 'WhatsApp v2.dc.html', name: 'WhatsApp', route: '/whatsapp' },
  { file: 'Blog.dc.html', name: 'BlogHub', route: '/blog' },
  { file: 'Security.dc.html', name: 'Security', route: '/security' },
  { file: 'Contact.dc.html', name: 'Contact', route: '/contact' },
  { file: 'Legal.dc.html', name: 'Legal', route: '/privacy-policy', kind: 'legal' },
  ...VERTS.flatMap((v) => {
    const k = v.toLowerCase();
    return [
      { file: `${v}.dc.html`, name: v, route: `/${k}` },
      ...FEATURES[v].map(([f, slug]) => ({ file: `${v} ${f}.dc.html`, name: comp(`${v} ${f.replace(/ v2$/, '')}`), route: `/${k}/${slug}` })),
      { file: `${v} Blog.dc.html`, name: `${v}Blog`, route: `/${k}/blog` },
      { file: `${v} Article.dc.html`, name: `${v}Article`, route: `/${k}/blog/[slug]`, kind: 'article', content: `blog-${k}.js` },
    ];
  }),
];

// Prototype file → route, for every link in templates and logic.
const FILE_ROUTES = { 'Superchat Home.dc.html': '/', 'Money Wallet.dc.html': '/money/wallet', 'WhatsApp.dc.html': '/whatsapp' };
for (const p of PAGES) if (p.kind !== 'article' && p.kind !== 'legal') FILE_ROUTES[p.file] = p.route;

export function rewriteLinks(src) {
  return src
    .replace(/((?:[A-Za-z0-9]+(?:%20| ))*[A-Za-z0-9]+) Article\.dc\.html\?p=|((?:[A-Za-z0-9]+%20)*[A-Za-z0-9]+)%20Article\.dc\.html\?p=/g,
      (_m, a, b) => `/${(a || b).toLowerCase()}/blog/`)
    .replace(/Legal\.dc\.html\?doc=(privacy|terms)/g, (_m, d) => (d === 'terms' ? '/terms-of-use' : '/privacy-policy'))
    .replace(/'Legal\.dc\.html\?doc=' \+ k/g, "(k === 'terms' ? '/terms-of-use' : '/privacy-policy')")
    .replace(/((?:[A-Za-z0-9]+(?:%20| ))*[A-Za-z0-9]+)\.dc\.html/g, (m) => {
      const f = decodeURIComponent(m);
      if (!(f in FILE_ROUTES)) throw new Error('unmapped prototype link: ' + m);
      return FILE_ROUTES[f];
    });
}

export function readPage(file) {
  const s = fs.readFileSync(path.join(REF, file), 'utf8');
  const a = s.indexOf('<x-dc>'), b = s.indexOf('</x-dc>');
  if (a < 0 || b < 0) throw new Error(file + ': no <x-dc> block');
  const m = s.match(/<script type="text\/x-dc" data-dc-script([^>]*)>([\s\S]*?)<\/script>/);
  const pm = m && m[1].match(/data-props="([^"]*)"/);
  const props = pm ? JSON.parse(pm[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&')) : {};
  return { template: s.slice(a + 6, b), logic: m ? m[2] : '', props };
}
