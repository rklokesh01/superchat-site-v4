import Image from 'next/image';
import type { CSSProperties } from 'react';
import SIZES from '@/lib/image-sizes.json';

// Template <img> → next/image (raster) or a plain lazy <img> (SVG, not optimisable).
type P = { src: string; alt: string; style?: CSSProperties; loading?: 'lazy' | 'eager'; decoding?: string; fetchpriority?: string; draggable?: string | boolean; width?: string; height?: string };

export default function Img({ src, alt, style, loading, fetchpriority, draggable }: P) {
  const [w, h] = (SIZES as Record<string, number[]>)[src] ?? [800, 800];
  const priority = fetchpriority === 'high';
  const drag = draggable === 'false' || draggable === false ? false : undefined;
  if (src.endsWith('.svg')) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={w} height={h} style={style} loading={loading ?? 'lazy'} decoding="async" draggable={drag} />;
  }
  return (
    <Image src={src} alt={alt} width={w} height={h} style={style} priority={priority} loading={priority ? undefined : loading ?? 'lazy'} draggable={drag}
      sizes={w > 1000 ? '(max-width: 600px) 92vw, 440px' : w > 400 ? '(max-width: 600px) 70vw, 360px' : '160px'} />
  );
}
