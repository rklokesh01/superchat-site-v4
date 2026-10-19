'use client';
import { useEffect } from 'react';
import NavView from './views/NavView';
import { useLogic } from '@/lib/dc';
import NavLogic from '@/lib/logic/Nav.logic';

export default function Nav({ active = '', current = '' }: { active?: string; current?: string }) {
  const v = useLogic(NavLogic, { active, current });
  // Focus trap for the full-screen mobile overlay (Esc and ✕ close it; see Nav patches in port-logic)
  useEffect(() => {
    if (!v.mobOpen) return;
    const box = document.querySelector('[data-mob-overlay]') as HTMLElement | null;
    if (!box) return;
    (box.querySelector('[aria-label="Close menu"]') as HTMLElement | null)?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const f = [...box.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')];
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    box.addEventListener('keydown', trap);
    return () => box.removeEventListener('keydown', trap);
  }, [v.mobOpen]);
  return <NavView v={v} />;
}
