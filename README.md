# Superchat website (V4)

Live: https://superchat-site-v4.vercel.app

The full Superchat.ai marketing site: Home, WhatsApp, 5 category hubs (Money, Travel, Bookings, Shopping, Everyday), 15 feature pages, blog hub plus 5 category blogs with 30 articles, Security, Contact, Privacy Policy and Terms of Use. That's 36 page templates and 62 URLs.

Stack: **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind 3**. It also uses `lenis` for smooth scroll and `matter-js` for the footer bubble pile. Every page is prerendered as static HTML.

## Run it

Requires Node 20+.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## How it's built

The design handoff in [`handoff/`](handoff/) is the source of truth. `handoff/README.md` and `handoff/SITEMAP.md` are the spec, and `handoff/reference/*.dc.html` are the HTML prototypes.

The site is **generated from those prototypes** rather than hand-copied, so every colour, size, easing and lerp value matches the design exactly:

```bash
npm run convert
```

This runs three scripts:

| Step | Script | Output |
|---|---|---|
| 1 | `scripts/convert.mjs` | Converts each prototype template into a React view in `components/views/`. Home gets one component per section. |
| 2 | `scripts/port-logic.mjs` | Ports each page's logic class (state, animations, interactions) into `lib/logic/*.logic.ts`. Changes to that logic are listed as patches inside the script. |
| 3 | `scripts/gen-routes.mjs` | Generates the page components, `app/**/page.tsx` routes, `sitemap.ts` and `robots.ts`. |

Supporting pieces:
- `scripts/pages.mjs` holds the page registry (prototype file → route → component) and the link rewriting. Routes follow `handoff/SITEMAP.md`.
- `lib/dc.ts` is a small runtime that runs the logic classes as React hooks.
- `content/` holds the blog and legal copy, bundled so it renders on the server.

**Edit the handoff or the patch lists, then re-run `npm run convert`.** Don't hand-edit the generated files in `components/views/` or `lib/logic/`.

Other folders:
- `templates/` holds larger template patches. For example, the chat dock is restyled to match the app UI.
- `assets-src/` holds source artwork. `phone-your-trip.svg` is the source for `public/assets/travel-phone-your-trip.png`.
- `scripts/export-html.mjs` exports any live page as one self-contained HTML file:

  ```bash
  node scripts/export-html.mjs /whatsapp out.html
  ```

## Deploy

The site is deployed on Vercel with zero configuration. Import this repo in Vercel, or run `npx vercel deploy --prod`. There are no environment variables.

## Open items

- **Fonts:** PP Frama and PP Frama Text are commercial fonts from Pangram Pangram. Confirm the licence before publishing.
- **WhatsApp number:** the WhatsApp deep link uses a placeholder number, `wa.me/971500000000`.
- **Missing photos:** the handoff has no images for the Money, Travel and Bookings blog covers, or for the room photo on Hotel booking. Those slots show the card background.
