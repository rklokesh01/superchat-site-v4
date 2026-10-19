'use client';
// Replaces the prototype's <image-slot>: a block filling its parent (3:2 fallback) with the
// photo cover-cropped using public/photos/slots.json ({ file, crop: { s, x, y } }), using the
// same geometry as image-slot.js (centre at (50+x)%, (50+y)% of the frame). Slots the designer
// left empty render nothing, so the card's own background shows (as in the published prototype).
import { useEffect, useRef, type CSSProperties } from 'react';
import SLOTS from '@/public/photos/slots.json';
import SIZES from '@/lib/image-sizes.json';

type Slot = { file: string; crop?: { s?: number; x?: number; y?: number } };

export default function PhotoSlot({ id, alt, style }: { id: string; alt: string; style?: CSSProperties }) {
  const c = (SLOTS as Record<string, Slot>)[id];
  const s = c?.crop?.s ?? 1, ox = c?.crop?.x ?? 0, oy = c?.crop?.y ?? 0;
  const [iw, ih] = (c && (SIZES as Record<string, number[]>)[c.file]) || [1, 1];
  const frame = useRef<HTMLDivElement>(null), img = useRef<HTMLImageElement>(null);
  const plain = s === 1 && !ox && !oy;
  useEffect(() => {
    const f = frame.current, im = img.current;
    if (!c || plain || !f || !im) return;
    const apply = () => {
      const fw = f.clientWidth, fh = f.clientHeight; if (!fw || !fh) return;
      const k = Math.max(fw / iw, fh / ih) * s;
      const mx = Math.max(0, (iw * k / fw - 1) * 50), my = Math.max(0, (ih * k / fh - 1) * 50);
      const x = Math.max(-mx, Math.min(mx, ox)), y = Math.max(-my, Math.min(my, oy));
      Object.assign(im.style, { objectFit: '', width: (iw * k / fw) * 100 + '%', height: (ih * k / fh) * 100 + '%', left: 50 + x + '%', top: 50 + y + '%', transform: 'translate(-50%,-50%)', maxWidth: 'none' });
    };
    apply();
    const ro = new ResizeObserver(apply); ro.observe(f);
    return () => ro.disconnect();
  }, [c, plain, iw, ih, s, ox, oy]);
  return (
    <div style={{ display: 'block', position: 'relative', width: '100%', height: '100%', aspectRatio: '3/2', ...style }}>
      {c ? (
        <div ref={frame} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={img} key={c.file} src={c.file} alt={alt.replace(/^(Photo:\s*|Cover photo( for)?\s*)/, '')} loading="lazy" decoding="async"
            style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : null}
    </div>
  );
}
