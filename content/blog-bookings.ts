// @ts-nocheck
// Copied from handoff/content/blog-bookings.js (final copy).
// Bookings blog content. Route: /bookings/blog/[slug]  ·  Prototype: Bookings Article.dc.html?p=[slug]
export const CATS = ['Restaurants', 'Parking & rentals', 'Home services'];
export const POSTS = [
  { slug: 'getting-a-table-on-a-busy-night', cat: 'Restaurants', date: '27 Sep 2026', read: '4 min', featured: true,
    title: 'How to get a table on a busy Friday night',
    dek: 'Fully booked rarely means full. Here’s when tables free up, and how to be first in line.',
    body: [
      { t: 'p', x: 'Most restaurants hold back a few tables, and cancellations land in the last few hours. The trick is asking at the right moment, and asking more than one place.' },
      { t: 'h2', x: 'When tables open up' },
      { t: 'ul', x: ['The morning of: reminder calls shake out cancellations', 'Two hours before: no-shows get released', 'Just after 9pm: the second sitting'] },
      { t: 'callout', x: 'Superchat calls several places at once and books the first table that fits.' },
      { t: 'h2', x: 'Be flexible on one thing' },
      { t: 'p', x: 'Pick the one thing you care about most, the area, the time or the terrace, and let the rest bend. Your odds go up fast.' }
    ] },
  { slug: 'booking-for-a-big-group', cat: 'Restaurants', date: '20 Sep 2026', read: '3 min',
    title: 'Booking for eight or more without the back-and-forth',
    dek: 'Set menus, deposits and who’s actually coming. A short checklist for group dinners.',
    body: [
      { t: 'p', x: 'Big tables are where bookings go wrong. A few questions up front save an awkward evening.' },
      { t: 'ul', x: ['Confirm numbers the day before', 'Ask if a set menu or deposit applies', 'Check the cancellation window for groups'] },
      { t: 'callout', x: 'Superchat asks the restaurant the right questions and shares the details with your group.' }
    ] },
  { slug: 'parking-in-dubai-made-simple', cat: 'Parking & rentals', date: '13 Sep 2026', read: '3 min',
    title: 'Parking in Dubai, without the meter hunt',
    dek: 'Zones, hours and how to extend a session without running back to the car.',
    body: [
      { t: 'p', x: 'Paid parking is easy once you know the zone and the hours. The hard part is remembering to top up.' },
      { t: 'h2', x: 'Three habits that save fines' },
      { t: 'ul', x: ['Check the zone code on the sign', 'Pay for a little longer than you need', 'Set a reminder ten minutes before it runs out'] },
      { t: 'callout', x: 'Tell Superchat where you’ve parked and it pays, then nudges you before time’s up.' }
    ] },
  { slug: 'renting-a-car-for-the-weekend', cat: 'Parking & rentals', date: '6 Sep 2026', read: '4 min',
    title: 'Renting a car for the weekend: what to check',
    dek: 'Deposits, Salik, mileage and insurance, in plain words.',
    body: [
      { t: 'p', x: 'A weekend rental is simple until the deposit comes back short. Most surprises are in four places.' },
      { t: 'ul', x: ['How much deposit is held, and for how long', 'How Salik tolls are charged', 'Daily mileage limits', 'What the insurance excess is'] },
      { t: 'callout', x: 'Superchat compares rentals on the all-in price, not just the daily rate.' }
    ] },
  { slug: 'booking-a-home-cleaner', cat: 'Home services', date: '30 Aug 2026', read: '3 min',
    title: 'Booking a home cleaner you’ll want back',
    dek: 'What to ask before the first visit, so the second one is easy.',
    body: [
      { t: 'p', x: 'The first visit sets the tone. A short brief gets you a better clean and a cleaner who knows your home.' },
      { t: 'ul', x: ['Say what matters most: kitchen, floors, bathrooms', 'Mention pets and anything fragile', 'Ask if supplies are included'] },
      { t: 'callout', x: 'Superchat books a cleaner at a time that suits you and remembers your brief for next time.' }
    ] },
  { slug: 'when-something-breaks', cat: 'Home services', date: '23 Aug 2026', read: '4 min',
    title: 'When the AC breaks in August: who to call first',
    dek: 'Landlord, building or handyman? A quick guide to getting it fixed fast.',
    body: [
      { t: 'p', x: 'In summer, a broken AC can’t wait. Knowing who’s responsible saves a day of phone calls.' },
      { t: 'h2', x: 'Check your contract' },
      { t: 'p', x: 'Many rentals include maintenance through the building or landlord. If yours doesn’t, a handyman is usually fastest.' },
      { t: 'callout', x: 'Superchat finds an available technician and books the earliest slot.' }
    ] }
];
