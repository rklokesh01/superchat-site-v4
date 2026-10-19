'use client';
// Minimal runtime for the handoff's "logic classes" (reference/logic/*.logic.js):
// a class with state/setState/forceUpdate, componentDidMount/DidUpdate/WillUnmount
// and renderVals(), driven by a React hook. The classes are ported near-verbatim so
// every progress mapping, easing and lerp factor stays identical to the prototype.
import { useEffect, useLayoutEffect, useReducer, useRef } from 'react';

export class DCLogic<P = any, S = any> {
  declare props: P;
  declare state: S;
  _update?: () => void;
  _mounted = false;
  _pending?: (() => void)[];
  setState(u: Partial<S> | ((s: S, p: P) => Partial<S> | null), cb?: () => void) {
    const next = typeof u === 'function' ? (u as any)(this.state, this.props) : u;
    if (next != null) { this.state = { ...this.state, ...next }; this._update?.(); }
    // React-style callback: after the update when mounted; queued until mount otherwise (init on server/client)
    if (cb) { if (this._mounted) queueMicrotask(cb); else (this._pending ||= []).push(cb); }
  }
  /** Runs once before the first render, on the server and the client (synchronous data loads). */
  init() {}
  forceUpdate() { this._update?.(); }
  componentDidMount() {}
  componentDidUpdate(_prevProps: P, _prevState: S) {}
  componentWillUnmount() {}
  renderVals(): any { return {}; }
}

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function useLogic<T extends DCLogic>(Ctor: new () => T, props: T['props']) {
  const ref = useRef<T | null>(null);
  if (!ref.current) ref.current = new Ctor();
  const inst = ref.current;
  const prev = useRef<{ props: any; state: any } | null>(null);
  inst.props = props;
  if (!(inst as any)._inited) { (inst as any)._inited = true; inst.init(); }
  const [, force] = useReducer((x: number) => x + 1, 0);
  inst._update = force;
  useEffect(() => {
    inst._mounted = true;
    inst.componentDidMount();
    const q = inst._pending; inst._pending = undefined; q?.forEach((f) => f());
    return () => { inst._mounted = false; inst.componentWillUnmount(); };
  }, [inst]);
  // componentDidUpdate after every commit where state changed
  useIso(() => {
    const p = prev.current;
    if (p && p.state !== inst.state) inst.componentDidUpdate(p.props, p.state);
    prev.current = { props: inst.props, state: inst.state };
  });
  return inst.renderVals();
}

export function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Block page scrolling without hiding the scrollbar (no layout shift). Returns an unlock fn. */
export function lockScroll(allow?: (t: EventTarget | null) => boolean) {
  const blk = (e: Event) => { if (!allow?.(e.target)) e.preventDefault(); };
  const keys = (e: KeyboardEvent) => {
    if (allow?.(e.target)) return;
    if ([' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) e.preventDefault();
  };
  addEventListener('wheel', blk, { passive: false, capture: true });
  addEventListener('touchmove', blk, { passive: false, capture: true });
  addEventListener('keydown', keys, true);
  (window as any).__scLenis?.stop?.();
  return () => {
    removeEventListener('wheel', blk, { capture: true } as any);
    removeEventListener('touchmove', blk, { capture: true } as any);
    removeEventListener('keydown', keys, true);
    (window as any).__scLenis?.start?.();
  };
}
