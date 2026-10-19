// Money blog content. Route: /money/blog/[slug]  ·  Prototype: Money Article.dc.html?p=[slug]
export const CATS = ['Sending money', 'Bills', 'Saving'];
export const POSTS = [
  { slug: 'why-the-google-rate-matters', cat: 'Sending money', date: '24 Sep 2026', read: '4 min', color: '#00E385', ink: '#022B1A', kicker: '+$111', featured: true,
    title: 'Why the Google rate is the only rate that matters',
    dek: 'Most transfer fees hide inside the exchange rate. Here’s how to spot the gap, and what it costs you every month.',
    body: [
      { t: 'p', x: 'When you google “AED to INR”, the number you see is the mid-market rate: the midpoint between what banks pay and charge each other. It’s the fairest rate there is, and it’s the one most people never get.' },
      { t: 'p', x: 'Exchange houses and banks usually quote a rate a little lower, then keep the difference. It rarely looks like much on the screen. On a regular transfer home, it adds up fast.' },
      { t: 'h2', x: 'How big is the gap?' },
      { t: 'p', x: 'A margin of around 4% is common. On AED 10,000, that’s roughly $111 that never reaches your family, before any fixed fee is added on top.' },
      { t: 'ul', x: ['Check the Google rate right before you send', 'Compare it to the rate you’re quoted, not just the fee', 'Multiply the difference by what you send each month'] },
      { t: 'callout', x: 'Superchat sends at the Google rate with zero fee, so what you see is what lands.' },
      { t: 'h2', x: 'The one-minute check' },
      { t: 'p', x: 'Next time you send, open Google and your transfer app side by side. If the numbers match, you’re paying what the service charges and nothing more. If they don’t, now you know what the fee really is.' }
    ] },
  { slug: 'bank-wallet-or-cash-pickup', cat: 'Sending money', date: '17 Sep 2026', read: '3 min', color: '#F5C400', ink: '#022B1A', kicker: '2 min',
    title: 'Bank, wallet or cash pickup: which payout is fastest?',
    dek: 'Three ways your money can land, and when each one makes sense for the person receiving it.',
    body: [
      { t: 'p', x: 'Where your money lands matters as much as how fast it leaves. The right payout method depends on who’s receiving it and how they use money day to day.' },
      { t: 'h2', x: 'Mobile wallet' },
      { t: 'p', x: 'Usually the fastest. Great for family who already pay for things on their phone. Money is ready to spend the moment it lands.' },
      { t: 'h2', x: 'Bank account' },
      { t: 'p', x: 'Best for larger amounts and savings. Most transfers land in minutes, though some banks take longer outside working hours.' },
      { t: 'h2', x: 'Cash pickup' },
      { t: 'p', x: 'For anyone without a bank account or wallet. They collect with ID at a nearby agent, often the same day.' },
      { t: 'callout', x: 'Superchat shows the expected delivery time for each method before you pay.' }
    ] },
  { slug: 'the-fee-you-dont-see', cat: 'Sending money', date: '9 Sep 2026', read: '5 min', color: '#A9C4F7', ink: '#022B1A', kicker: '4%',
    title: 'The fee you don’t see: how rate margins work',
    dek: '“Zero fee” doesn’t always mean free. A plain-English guide to the rate margin.',
    body: [
      { t: 'p', x: 'A transfer has two prices: the fee you’re shown, and the margin built into the exchange rate. Only one of them is printed in bold.' },
      { t: 'h2', x: 'Reading a quote' },
      { t: 'ul', x: ['Find the rate you’re offered', 'Find the mid-market rate on Google', 'The gap between them is the margin'] },
      { t: 'p', x: 'Once you look at the margin as a fee, comparing services gets simple: the one that delivers the most to your recipient wins.' },
      { t: 'callout', x: 'Superchat matches the Google rate, so there’s no margin to find.' }
    ] },
  { slug: 'never-pay-a-late-fee-again', cat: 'Bills', date: '2 Sep 2026', read: '3 min', color: '#FFF3C9', ink: '#022B1A', kicker: '0',
    title: 'How to never pay a late fee again',
    dek: 'DEWA, du, Salik: set up nudges once and let the reminders do the remembering.',
    body: [
      { t: 'p', x: 'Late fees rarely come from not having the money. They come from forgetting the date. The fix is a reminder that arrives early enough to act on.' },
      { t: 'h2', x: 'Set it once' },
      { t: 'p', x: 'Tell Superchat which bills you pay. It learns the due dates and nudges you three days before each one, with a pay button right in the message.' },
      { t: 'ul', x: ['Utilities like DEWA and SEWA', 'Phone and internet', 'Salik and Nol top-ups'] },
      { t: 'callout', x: 'Reply “pay” to any reminder and it’s done, receipt saved.' }
    ] },
  { slug: 'find-forgotten-subscriptions', cat: 'Saving', date: '26 Aug 2026', read: '4 min', color: '#B0F5D8', ink: '#022B1A', kicker: 'AED 96',
    title: 'Find the subscriptions you forgot about',
    dek: 'Free trials that became monthly charges. Here’s how to find them in one message.',
    body: [
      { t: 'p', x: 'Most people pay for at least one subscription they no longer use. It’s rarely a big number, which is exactly why it goes unnoticed.' },
      { t: 'h2', x: 'Ask, don’t audit' },
      { t: 'p', x: 'Instead of scrolling through statements, ask Superchat to list your recurring payments. You’ll see each one, what it costs and when it last renewed.' },
      { t: 'callout', x: 'Try: “What am I subscribed to?”' }
    ] },
  { slug: 'salary-day-routine', cat: 'Saving', date: '19 Aug 2026', read: '3 min', color: '#022B1A', ink: '#F7FDFB', kicker: '5 min',
    title: 'A five-minute salary day routine',
    dek: 'Send home, pay the bills, check last month. Three messages and you’re done.',
    body: [
      { t: 'p', x: 'Salary day is when good money habits are easiest. A short routine, done in the same order every month, keeps everything on track.' },
      { t: 'ul', x: ['Send home first, at the Google rate', 'Pay every bill due before the next salary', 'Ask how last month compared to the one before'] },
      { t: 'callout', x: 'Save it as a routine and Superchat will run through it with you each month.' }
    ] }
];
