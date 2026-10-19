# Handoff: Superchat marketing website (full site)

## Overview
The complete Superchat (superchat.ai) marketing site: home page, the WhatsApp agent page, 5 category hubs (Money, Travel, Bookings, Shopping, Everyday), 16 feature pages, blog index + 5 category blogs + article template, Security, Contact, Privacy Policy and Terms of Use, plus the shared mega-menu nav and footer. Target: **Next.js (App Router) + Tailwind, deployed on Vercel.**

## About the design files
Everything in `reference/` is a **design reference built in HTML** (`*.dc.html` = a self-contained HTML page with a small logic class; open any of them directly in a browser over a local server, e.g. `npx serve reference`). They show the intended look, motion and behaviour. They are **not production code to copy verbatim**: rebuild them as React components in the target codebase using its patterns. Styles in the references are inline; extract them into Tailwind classes / tokens.

## Fidelity
**High-fidelity.** Final colours, type, spacing, copy, motion and interactions. Recreate pixel-accurately. All copy in the references is final.

## Folder contents
- `reference/` — every page (`*.dc.html`) + their runtime helpers (`support.js`, `image-slot.js`, `sc-shapes.js`) + content modules + assets, so every page renders exactly as designed. `reference/.image-slots.state.json` holds the photos the user dropped into photo slots (base64), so the reference pages render with real photos.
- `public/` — **production-ready static assets**, already laid out for Next.js `public/`:
  - `public/assets/` — phone mockups (PNG + SVG versions), Superchat card front (PNG/SVG) and back (SVG), avatar stack, Superchat avatar (WhatsApp profile pic).
  - `public/assets/fonts/` — PP Frama (display) and PP Frama Text. **Check the licence before publishing.**
  - `public/images/` — Shopping hero/product images and the app-download image.
  - `public/photos/` — every photo placed in a photo slot, extracted to files. `slots.json` maps slot id → file and its crop/position (`crop` object: focal offsets/scale), so you can place each photo at its designed crop.
- `content/` — blog posts per category (`blog-*.js`) and legal text (`legal-content.js`, Privacy + Terms exactly as on superchat.ai). Move into `/content` or a CMS; render from data.
- `source-uploads/` — the original files supplied during design (screenshots, card artwork, logos). Reference only.
- `SITEMAP.md` — routes and link map (nav, mega menu, footer, CTAs).

## Pages → routes
| Reference file | Route |
|---|---|
| Superchat Home | `/` |
| WhatsApp v2 | `/whatsapp` |
| Money / Travel / Bookings / Shopping / Everyday | `/money`, `/travel`, `/bookings`, `/shopping`, `/everyday` |
| Money Send Money, Money Wallet v2, Money Expenses | `/money/send-money`, `/money/wallet`, `/money/expenses` |
| Travel Flight Booking, Hotel Booking, Trip Planner | `/travel/flights`, `/travel/hotels`, `/travel/trip-planner` |
| Bookings Restaurants, Home Services, Parking Rentals | `/bookings/restaurants`, `/bookings/home-services`, `/bookings/parking-rentals` |
| Shopping AI Shopping, Product Search, AI Ordering | `/shopping/ai-shopping`, `/shopping/product-search`, `/shopping/ai-ordering` |
| Everyday Smart Chat, Reminders, Email Calendar | `/everyday/smart-chat`, `/everyday/reminders`, `/everyday/email-calendar` |
| Blog / `<Category> Blog` / `<Category> Article` | `/blog`, `/blog/[category]`, `/blog/[category]/[slug]` |
| Security, Contact | `/security`, `/contact` |
| Legal (`?doc=privacy` / `?doc=terms`) | `/privacy-policy`, `/terms-of-use` |
| Nav, Footer | shared layout components |

`Money Wallet.dc.html` is the earlier wallet version; **build from `Money Wallet v2`**. Follow `SITEMAP.md` for every href. External links: App Store, Google Play (`https://play.google.com/store/apps/details?id=com.superxpense`), WhatsApp deep link, socials. All are already set in the Footer/Nav references.

## Design tokens
- **Colours:** ink `#022B1A` · primary green `#00A266` · bright mint `#5BEFB0` · mint text on dark `#B0F5D8` · light surface `#F7FDFB` · muted text `#7E918A` / `#9FB3AA` · coral accent `#FF9C85` · WhatsApp chat bg/bubbles as used in WhatsApp v2 (see reference). Dark sections use `#022B1A` and deeper greens. Pull any other exact value from the reference inline styles.
- **Type:** Display `PP Frama` (fallback Outfit), weight 500, tight tracking (−0.03 to −0.04em), line-height ~1.0. Body `PP Frama Text` / Outfit, 15–20px. Eyebrows: 12–13px, 600, letter-spacing 0.2–0.32em, uppercase.
- **Radii:** cards 20–28px, pills 999px, phone frames ~44px.
- **Shadows:** soft, low-opacity green-black (e.g. `0 30px 60px -20px rgba(2,43,26,.25)`).
- **Motion easing:** `cubic-bezier(.2,.8,.2,1)` for almost everything; 300–500ms UI, longer for scroll scenes.

## Key interactions (implement exactly; see the logic class at the bottom of each reference file)
- **Intro loader (Home):** typed message + green send button; on click the button expands into a circular reveal of the page. The green circle is always ~6px larger than the cut-out to avoid a seam.
- **Mega menu (Nav):** hover/click opens per category; highlights **only the active page** within a category (not the whole category row); right-side promo card links to the WhatsApp agent page. Mobile: full-screen accordion.
- **Home scroll scenes:** sticky, scroll-driven. Use `position: sticky` + scroll progress (IntersectionObserver / scroll listener with rAF, or Framer Motion `useScroll`):
  - *Agentic AI*: task bars with counter.
  - *Life, before and after*: rotating card wheel; heading reads "Same week. A lot less ___" with the last word swapping per card (queuing / late fees / paperwork / tab-hopping / circling / waste). All words are stacked in one grid cell (no layout shift) and crossfade with blur + 0.45em vertical slide, debounced 120ms.
  - *One month with Superchat*: 3D card tunnel; cards come straight at the viewer (no tilt). Fail → success state is a strong, obvious switch. Ends with the title revealed word by word (blur + scale + rise, no clipping) and the subline "All of it, in one chat."
- **Superchat card (Money Wallet v2):** 3D card; tilts with the cursor on hover, drags to rotate and flips to show the back. Front: Superchat logo, hologram, Mastercard mark bottom-right.
- **WhatsApp-style chat cards:** typing animation (dots, then text typed in), fixed card heights so typing never shifts layout, realistic double-tick (grey → blue).
- **FAQ (all pages):** single-open accordion; smooth height via `grid-template-rows: 0fr → 1fr` (.45s), answer fades and rises, "+" rotates.
- **Hover:** cards lift with `translateY(-4..-6px)`, only the hovered card moves, and borders don't thicken.
- Respect `prefers-reduced-motion`: disable scroll scenes' transforms and show final states.

## Responsiveness
Fluid from 360px to 1920px. Grids collapse to one column below ~760px; sticky scroll scenes simplify on mobile (shorter scroll length, smaller cards); phone mockups scale with `clamp()`. Match the reference behaviour at 375, 768, 1024, 1440.

## Assets
All production assets are in `public/`. Phone screens are provided as both PNG (exact) and SVG. Photo-slot images come from user uploads and are listed in `public/photos/slots.json`. Replace them with licensed or final photography if needed. The fonts are commercial (Pangram Pangram), so confirm the licence.

## Implementation notes for Claude Code
1. `npx create-next-app@latest superchat --ts --tailwind --app`, copy `public/` in, register fonts with `next/font/local`.
2. Build `Nav` and `Footer` first (shared layout), then the Home page, then category hubs → feature pages (they share section patterns: hero with phone, chat demo, feature grid, FAQ, CTA band).
3. Render blog and legal pages from `content/`; `generateStaticParams` for categories/slugs.
4. Add metadata/OG per route, `sitemap.ts`, `robots.ts`.
5. Deploy: push to GitHub, then import into Vercel (zero config).
