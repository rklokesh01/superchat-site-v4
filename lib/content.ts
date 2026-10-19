// Content modules the prototype loaded with import(new URL('<file>', location.href)).
// Bundled statically so blog lists, articles and legal pages render on the server.
import * as blogMoney from '@/content/blog-money';
import * as blogTravel from '@/content/blog-travel';
import * as blogBookings from '@/content/blog-bookings';
import * as blogShopping from '@/content/blog-shopping';
import * as blogEveryday from '@/content/blog-everyday';
import * as legal from '@/content/legal-content';

export const CONTENT: Record<string, any> = {
  'blog-money.js': blogMoney,
  'blog-travel.js': blogTravel,
  'blog-bookings.js': blogBookings,
  'blog-shopping.js': blogShopping,
  'blog-everyday.js': blogEveryday,
  'legal-content.js': legal,
};

/** A thenable that resolves synchronously, so ported `import(...).then(...)` chains run during init(). */
class SyncThen<T> {
  constructor(public v: T) {}
  then<R>(f: (v: T) => R) { const r = f(this.v); return r instanceof SyncThen ? r : new SyncThen(r); }
  catch() { return this; }
}
export const __mod = (file: string) => {
  if (!(file in CONTENT)) throw new Error('unknown content module ' + file);
  return new SyncThen(CONTENT[file]);
};
export const __all = (xs: SyncThen<any>[]) => new SyncThen(xs.map((x) => x.v));
