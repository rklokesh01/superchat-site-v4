// @ts-nocheck
// Copied from handoff/content/blog-travel.js (final copy).
// Travel blog content. Route: /travel/blog/[slug]  ·  Prototype: Travel Article.dc.html?p=[slug]
export const CATS = ['Flights', 'Stays', 'Trip planning'];
export const POSTS = [
  { slug: 'when-to-book-flights-from-dubai', cat: 'Flights', date: '26 Sep 2026', read: '4 min', color: '#3071E8', ink: '#FFFFFF', kicker: '6 wks', featured: true,
    title: 'When to book flights from Dubai, and when to wait',
    dek: 'Fares move for a reason. Here’s how to tell a good price from a temporary one, and when an alert beats booking now.',
    body: [
      { t: 'p', x: 'There’s no magic day to book a flight. But there are patterns, and knowing them saves real money on the routes you fly most.' },
      { t: 'h2', x: 'Short haul vs long haul' },
      { t: 'p', x: 'For short trips around the region, prices tend to settle a few weeks out. For long haul, especially around school holidays, earlier is usually better.' },
      { t: 'ul', x: ['Holiday dates: book as soon as you know them', 'Flexible dates: set an alert and wait for a dip', 'Last minute: check the day before and the day after'] },
      { t: 'callout', x: 'Ask Superchat to watch a route and it’ll message you when the fare drops.' },
      { t: 'h2', x: 'Read the whole price' },
      { t: 'p', x: 'A cheap fare without a bag can end up costing more than a fuller fare with one. Compare the all-in price for how you actually travel.' }
    ] },
  { slug: 'direct-or-one-stop', cat: 'Flights', date: '19 Sep 2026', read: '3 min', color: '#FFF3C9', ink: '#022B1A', kicker: '+4h',
    title: 'Direct or one stop: is the saving worth it?',
    dek: 'A simple way to put a price on your time before you book the cheaper connection.',
    body: [
      { t: 'p', x: 'A connection can save a few hundred dirhams. It can also add four hours, a missed connection risk and a night of bad sleep.' },
      { t: 'h2', x: 'Price your hours' },
      { t: 'p', x: 'Divide the saving by the extra hours. If it works out at less than you’d pay to skip the wait, fly direct.' },
      { t: 'ul', x: ['Check the layover is long enough for your terminal', 'Check whether bags go all the way through', 'Avoid the last connection of the day'] },
      { t: 'callout', x: 'Superchat shows the direct option next to the cheapest, with the price difference.' }
    ] },
  { slug: 'free-cancellation-explained', cat: 'Stays', date: '12 Sep 2026', read: '3 min', color: '#F5C400', ink: '#022B1A', kicker: 'Free',
    title: 'Free cancellation, explained in plain words',
    dek: 'What “free” really covers, where the deadline hides, and why it’s often worth a little extra.',
    body: [
      { t: 'p', x: 'Free cancellation means you can cancel for a full refund until a certain date and time, in the hotel’s local time zone.' },
      { t: 'h2', x: 'Where people get caught' },
      { t: 'ul', x: ['The deadline is local time, not yours', 'Some rates refund to a voucher, not your card', 'Changes can count as a cancellation'] },
      { t: 'p', x: 'Non-refundable rates are cheaper for a reason. If your plans aren’t fixed, the flexible rate is insurance you can see.' },
      { t: 'callout', x: 'Superchat reminds you the day before free cancellation ends.' }
    ] },
  { slug: 'reading-hotel-reviews', cat: 'Stays', date: '5 Sep 2026', read: '4 min', color: '#A9C4F7', ink: '#022B1A', kicker: '4.6★',
    title: 'How to read hotel reviews in two minutes',
    dek: 'Skip the star rating. The useful part of a review is usually one sentence in the middle.',
    body: [
      { t: 'p', x: 'Two hotels with the same score can be very different places. The detail you care about is in what guests mention again and again.' },
      { t: 'h2', x: 'What to look for' },
      { t: 'ul', x: ['Recent reviews over old ones', 'Repeated words: noise, cleanliness, staff', 'Reviews from people travelling like you'] },
      { t: 'callout', x: 'Ask Superchat “is it quiet?” and it answers from what guests actually said.' }
    ] },
  { slug: 'long-weekend-from-the-uae', cat: 'Trip planning', date: '29 Aug 2026', read: '5 min', color: '#FFE7DE', ink: '#022B1A', kicker: '3 days',
    title: 'Five long weekends within four hours of the UAE',
    dek: 'Short flights, easy entry and enough to fill three days without rushing.',
    body: [
      { t: 'p', x: 'A long weekend works best when the flight is short and the first day isn’t lost to travel. These are a few that fit.' },
      { t: 'ul', x: ['Tbilisi, for food, wine and mountains', 'Muscat, for beaches and a slower pace', 'Baku, for old streets and new architecture', 'Colombo, for coast and tea country', 'Istanbul, for everything at once'] },
      { t: 'h2', x: 'Make day one count' },
      { t: 'p', x: 'Pick a morning flight out and an evening flight back. You’ll get three full days, not two and a half.' },
      { t: 'callout', x: 'Tell Superchat the vibe and it plans every day, bookings included.' }
    ] },
  { slug: 'planning-a-group-trip', cat: 'Trip planning', date: '22 Aug 2026', read: '4 min', color: '#00E385', ink: '#022B1A', kicker: '4 of us',
    title: 'Planning a group trip without a 200-message thread',
    dek: 'Agree on dates, budget and rooms first. The rest gets easy.',
    body: [
      { t: 'p', x: 'Most group trips stall on three questions: when, how much, and who’s sharing. Answer those early and the booking takes minutes.' },
      { t: 'h2', x: 'Three questions first' },
      { t: 'ul', x: ['Which dates can everyone do?', 'What’s the most each person will spend?', 'Who shares a room with whom?'] },
      { t: 'p', x: 'Once those are settled, book flights and rooms together so seats and rooms stay side by side.' },
      { t: 'callout', x: 'Add your friends to a Superchat thread and it books for the whole group.' }
    ] }
];
