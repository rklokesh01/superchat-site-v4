'use client';
// React port of reference/sc-shapes.js (<sc-shape kind color face stroke float phase amp>).
import { useEffect, useRef, type CSSProperties } from 'react';
import { reducedMotion } from '@/lib/dc';

const INK = '#022B1A';
const faces: Record<string, (cx: number, cy: number, s: number) => string> = {
  smile: (cx, cy, s) => `<path d="M${cx-18*s} ${cy-4*s} q${6*s} ${-8*s} ${12*s} 0 M${cx+6*s} ${cy-4*s} q${6*s} ${-8*s} ${12*s} 0" stroke="${INK}" stroke-width="${5*s}" stroke-linecap="round" fill="none"/><path d="M${cx-10*s} ${cy+10*s} q${10*s} ${12*s} ${20*s} 0" stroke="${INK}" stroke-width="${5*s}" stroke-linecap="round" fill="none"/>`,
  wink: (cx, cy, s) => `<path d="M${cx-18*s} ${cy-2*s} q${6*s} ${-8*s} ${12*s} 0" stroke="${INK}" stroke-width="${5*s}" stroke-linecap="round" fill="none"/><circle cx="${cx+12*s}" cy="${cy-4*s}" r="${6*s}" fill="${INK}"/><path d="M${cx-10*s} ${cy+12*s} q${10*s} ${12*s} ${20*s} 0" stroke="${INK}" stroke-width="${5*s}" stroke-linecap="round" fill="none"/>`,
  grin: (cx, cy, s) => `<path d="M${cx-18*s} ${cy-4*s} q${6*s} ${-8*s} ${12*s} 0 M${cx+6*s} ${cy-4*s} q${6*s} ${-8*s} ${12*s} 0" stroke="${INK}" stroke-width="${5*s}" stroke-linecap="round" fill="none"/><path d="M${cx-16*s} ${cy+8*s} q${16*s} ${22*s} ${32*s} 0 z" fill="${INK}"/>`,
  wow: (cx, cy, s) => `<circle cx="${cx-12*s}" cy="${cy-4*s}" r="${5*s}" fill="${INK}"/><circle cx="${cx+12*s}" cy="${cy-4*s}" r="${5*s}" fill="${INK}"/><ellipse cx="${cx}" cy="${cy+14*s}" rx="${7*s}" ry="${9*s}" fill="${INK}"/>`,
};
type K = { vb: string; d?: string; face?: [number, number, number]; sw?: number; circle?: number[]; inner?: string; extra?: string; ring?: boolean; line?: string; head?: string };
const KINDS: Record<string, K> = {
  bubble: { vb: '0 0 200 180', d: 'M100 20 C150 20 180 50 180 85 C180 120 150 148 100 148 C88 148 77 146 67 142 L35 162 L44 130 C28 118 20 102 20 85 C20 50 50 20 100 20 Z', face: [100, 86, 1] },
  star: { vb: '0 0 200 200', d: 'M100 8 C110 58 136 88 192 100 C136 112 110 142 100 192 C90 142 64 112 8 100 C64 88 90 58 100 8 Z', face: [100, 100, 0.9] },
  bolt: { vb: '0 0 60 90', d: 'M34 3 L6 50 H28 L20 87 L54 34 H32 Z' },
  sparkle: { vb: '0 0 40 40', d: 'M20 2 Q22 18 38 20 Q22 22 20 38 Q18 22 2 20 Q18 18 20 2Z', sw: 2.5 },
  coin: { vb: '0 0 100 100', circle: [50, 50, 44], inner: '<circle cx="50" cy="50" r="30" fill="none" stroke="#022B1A" stroke-width="4" stroke-dasharray="4 7"/>', face: [50, 52, 0.8] },
  heart: { vb: '0 0 100 92', d: 'M50 86 C20 64 6 48 6 30 A22 22 0 0 1 50 20 A22 22 0 0 1 94 30 C94 48 80 64 50 86 Z', face: [50, 44, 0.75] },
  cloud: { vb: '0 0 120 50', d: 'M18 44 H104 A14 14 0 0 0 100 17 A20 20 0 0 0 62 10 A16 16 0 0 0 34 22 A12 12 0 0 0 18 44 Z', sw: 3 },
  blob: { vb: '0 0 200 200', d: 'M150 40 C190 70 190 140 150 170 C110 200 50 190 25 150 C0 110 20 50 60 30 C90 15 125 22 150 40 Z', face: [100, 100, 1] },
  plane: { vb: '0 0 140 90', d: 'M6 44 L132 6 L96 84 L70 58 L52 74 L52 52 Z', extra: '<path d="M52 52 L132 6" stroke="#022B1A" stroke-width="5"/>', sw: 6 },
  pin: { vb: '0 0 24 30', d: 'M12 29 C12 29 2 17 2 11 A10 10 0 0 1 22 11 C22 17 12 29 12 29Z', extra: '<circle cx="12" cy="11" r="4" fill="#FFFFFF" stroke="#022B1A" stroke-width="2"/>', sw: 2 },
  check: { vb: '0 0 100 100', circle: [50, 50, 44], inner: '<path d="M30 52 L44 66 L72 36" fill="none" stroke="#022B1A" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>' },
  ring: { vb: '0 0 100 100', ring: true },
  squiggle: { vb: '0 0 300 100', line: 'M6 70 C40 10 80 10 104 50 S164 96 196 40 S262 6 294 30' },
  arrow: { vb: '0 0 220 100', line: 'M6 80 Q60 10 150 40 T206 30', head: 'M186 14 L208 30 L184 44' },
};

type P = { kind?: string; color?: string; face?: string; stroke?: string; float?: string; phase?: string; amp?: string; style?: CSSProperties };

export default function ScShape({ kind = 'sparkle', color = '#F5C400', face, stroke = INK, float, phase, amp, style }: P) {
  const k = KINDS[kind] || KINDS.sparkle, sw = k.sw || 5;
  let body = '';
  if (k.line) body = `<path d="${k.line}" stroke="${color}" stroke-width="7" stroke-linecap="round" fill="none"/>` + (k.head ? `<path d="${k.head}" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` : '');
  else if (k.ring) body = `<circle cx="50" cy="50" r="40" fill="none" stroke="${stroke}" stroke-width="5"/><circle cx="50" cy="50" r="40" fill="none" stroke="${color}" stroke-width="12" stroke-dasharray="40 22" stroke-linecap="round"/>`;
  else if (k.circle) body = `<circle cx="${k.circle[0]}" cy="${k.circle[1]}" r="${k.circle[2]}" fill="${color}" stroke="${stroke}" stroke-width="${sw}"/>${k.inner || ''}`;
  else body = `<path d="${k.d}" fill="${color}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>${k.extra || ''}`;
  if (face && face !== 'none' && k.face && faces[face]) body += faces[face](...k.face);
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (float !== '1' || reducedMotion()) return;
    const ph = +(phase || 0) || Math.random() * 6, a = +(amp || 0) || 10;
    let raf = requestAnimationFrame(function loop(t) {
      raf = requestAnimationFrame(loop);
      if (svg.current) svg.current.style.transform = `translateY(${Math.sin(t / 900 + ph) * a}px) rotate(${Math.sin(t / 1300 + ph) * 5}deg)`;
    });
    return () => cancelAnimationFrame(raf);
  }, [float, phase, amp]);
  return (
    <div aria-hidden="true" style={{ display: 'block', ...style }}>
      <svg ref={svg} viewBox={k.vb} style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }} fill="none" dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
}
