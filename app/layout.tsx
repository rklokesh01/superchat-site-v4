import type { Metadata, Viewport } from 'next';
import './globals.css';
import './pages.generated.css';
import './hover.generated.css';
import LenisGlobal from '@/components/LenisGlobal';

export const metadata: Metadata = {
  metadataBase: new URL('https://superchat-site-v4.vercel.app'),
  title: { default: 'Superchat: get two hours of your day back', template: '%s · Superchat' },
  description: 'Superchat is the UAE AI assistant that completes tasks through chat: send money abroad, book flights and restaurants, pay bills and manage your calendar.',
  openGraph: { images: ['/assets/hero-phone-even.png'], siteName: 'Superchat' },
};
export const viewport: Viewport = { themeColor: '#F7FDFB', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/PPFrama-Regular.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/PPFramaText-Regular.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Outfit (fallback), Geist (phone mockups) and Caveat (handwritten notes, WhatsApp). Loaded by stylesheet so the literal family names in the templates resolve. */}
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Geist:wght@400;500;600;700&family=Outfit:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LenisGlobal />
        <a className="skip-link" href="#main">Skip to content</a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
