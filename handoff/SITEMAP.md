# Superchat site map

Single source of truth: the `CATS` array in `Nav.dc.html`. Every page, route and menu entry is defined there — rename, add or remove a page in `CATS` and the desktop mega menu, mobile menu and "current page" state all follow. `file: null` = route defined, page not built yet (links render as `#` with the route in the tooltip).

Pages pass `active="<Vertical>"` and `current="<route>"` to `<dc-import name="Nav">`.

Top bar: the Features mega menu is the same on every page. Next to it, vertical pages show their own links (vertical home + its pages + its blog), all read from `CATS`. Pages without `active` (Home, WhatsApp) show the default links: Send money, Security, Blog.

| Route | Prototype file | Status |
|---|---|---|
| / | Superchat Home.dc.html | Built |
| /money | Money.dc.html | Built |
| /money/send-money | Money Send Money.dc.html | Built |
| /money/wallet | Money Wallet.dc.html | Built |
| /money/expenses | Money Expenses.dc.html | Built |
| /money/blog | Money Blog.dc.html | Built |
| /money/blog/[slug] | Money Article.dc.html?p=[slug] | Built (content in blog-money.js) |
| /travel | Travel.dc.html | Built |
| /travel/flight-booking | Travel Flight Booking.dc.html | Built |
| /travel/hotel-booking | Travel Hotel Booking.dc.html | Built |
| /travel/trip-planner | Travel Trip Planner.dc.html | Built |
| /travel/blog | Travel Blog.dc.html | Built |
| /travel/blog/[slug] | Travel Article.dc.html?p=[slug] | Built (content in blog-travel.js) |
| /bookings | Bookings.dc.html | Built |
| /bookings/restaurants | Bookings Restaurants.dc.html | Built |
| /bookings/parking-rentals | Bookings Parking Rentals.dc.html | Built |
| /bookings/home-services | Bookings Home Services.dc.html | Built |
| /bookings/blog | Bookings Blog.dc.html | Built |
| /bookings/blog/[slug] | Bookings Article.dc.html?p=[slug] | Built (content in blog-bookings.js) |
| /shopping | Shopping.dc.html | Built |
| /shopping/product-search | Shopping Product Search.dc.html | Built |
| /shopping/ai-shopping | Shopping AI Shopping.dc.html | Built |
| /shopping/ai-ordering | Shopping AI Ordering.dc.html | Built |
| /shopping/blog | Shopping Blog.dc.html | Built |
| /shopping/blog/[slug] | Shopping Article.dc.html?p=[slug] | Built (content in blog-shopping.js) |
| /everyday | Everyday.dc.html | Built |
| /everyday/smart-chat | Everyday Smart Chat.dc.html | Built |
| /everyday/reminders | Everyday Reminders.dc.html | Built |
| /everyday/email-calendar | Everyday Email Calendar.dc.html | Built |
| /everyday/blog | Everyday Blog.dc.html | Built |
| /everyday/blog/[slug] | Everyday Article.dc.html?p=[slug] | Built (content in blog-everyday.js) |

Not in the vertical tree (standalone pages):
| /whatsapp | WhatsApp v2.dc.html | Built |
| /blog | Blog.dc.html | Built (hub: merges all five blog-*.js files) |
| /security | Security.dc.html | Built |
| /contact | Contact.dc.html | Built |
| /privacy-policy | Legal.dc.html?doc=privacy | Built (content in legal-content.js) |
| /terms-of-use | Legal.dc.html?doc=terms | Built (content in legal-content.js) |

Footer columns: EXPLORE (Money, Travel, Bookings, Shopping, Everyday) · POPULAR (Send money, Wallet, Flight booking, Superchat on WhatsApp) · COMPANY (Security, Blog → Blog hub, Contact) · LEGAL (Privacy Policy, Terms of Use).

## Page templates
- Landing: hero → outcomes → interactive → products (link to feature pages) → how it works → voices → blog teaser → FAQ → footer
- Feature: breadcrumb hero → interactive demo → capabilities (“say it” cards) → dark trust band → FAQ → "More in <vertical>" (siblings + blog) → footer
- Blog listing: header + category filters → featured → grid → CTA band
- Article: breadcrumb, meta, cover, body blocks (p / h2 / ul / callout) → related (same category first)

## Nav behaviour (all pages)
Same as the homepage: past 140px the bar becomes fixed and hidden; it slides in on scroll up and hides on scroll down; back near the top it returns to its normal place. Smooth scrolling (Lenis) and the back-to-top button match the homepage. The homepage runs its own copy; Nav.dc.html runs it everywhere else.
