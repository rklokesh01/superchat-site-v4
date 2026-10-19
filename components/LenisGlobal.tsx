'use client';
// The prototype loads Lenis from a CDN and each page (Home, or Nav on every other page)
// creates it via window.Lenis. Expose the npm build the same way so that code stays verbatim.
import Lenis from 'lenis';
if (typeof window !== 'undefined') (window as any).Lenis = Lenis;
export default function LenisGlobal() { return null; }
