import React, { useEffect, useMemo, useRef, useState } from "react";

/** Parse values like "+4700K", "+550K", "+70" */
export function parseTarget(display: string) {
  const match = display.trim().match(/^(\+)?\s*([0-9]+(?:\.[0-9]+)?)\s*([A-Za-z%]*)$/);
  if (!match) return { sign: "", value: 0, suffix: "", raw: display };
  const [, plus, num, suffix] = match;
  return { sign: plus ?? "", value: Number(num), suffix: suffix ?? "", raw: display };
}

/** In-view hook that toggles true/false whenever visibility changes */
export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setInView(e.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.2,
        ...(options || {}),
      }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return { ref, inView } as const;
}

export type AnimatedInfoProps = {
  display: string; // String to display/animate, e.g. "+4700K"
  duration?: number; // Duration of the animation in ms (default 100)
  className?: string; // Optional className for the <p> element
  resetOnExit?: boolean; // If true, resets to 0 when scrolled out (default true)
  enabled?: boolean; // External gate to allow animation
  startDelayMs?: number; // Optional start delay
};

/** Animated number that (re)starts whenever it enters the viewport */
export function AnimatedInfo({
  display,
  duration = 100,
  className,
  resetOnExit = true,
  enabled = true,
  startDelayMs = 0,
}: AnimatedInfoProps) {
  const { sign, value, suffix, raw } = useMemo(() => parseTarget(display), [display]);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const { ref, inView } = useInView<HTMLParagraphElement>();
  const [shown, setShown] = useState(0);
  const rafRef = useRef<number | null>(null);
  const delayTimerRef = useRef<number | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (delayTimerRef.current != null) window.clearTimeout(delayTimerRef.current);
    };
  }, []);

  // Handle reduced motion
  useEffect(() => {
    if (!prefersReducedMotion) return;
    if (inView && enabled) setShown(value);
    else if (resetOnExit) setShown(0);
  }, [inView, enabled, value, prefersReducedMotion, resetOnExit]);

  // Animate when entering view AND gate is open
  useEffect(() => {
    if (prefersReducedMotion) return;

    const startAnim = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      setShown(0);
      const start = performance.now();

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 0.5 - Math.cos(Math.PI * t) / 2; // ease-in-out
        setShown(value * eased);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setShown(value);
          rafRef.current = null;
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    if (inView && enabled) {
      if (delayTimerRef.current != null) window.clearTimeout(delayTimerRef.current);
      delayTimerRef.current = window.setTimeout(startAnim, startDelayMs) as unknown as number;
    } else if (!inView || !enabled) {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (delayTimerRef.current != null) {
        window.clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
      if (resetOnExit) setShown(0);
    }
  }, [inView, enabled, startDelayMs, value, duration, prefersReducedMotion, resetOnExit]);

  const formatted = Number.isFinite(shown) ? `${sign}${Math.ceil(shown)}${suffix}` : raw;

  return (
    <p ref={ref} className={className} aria-label={raw}>
      {formatted}
    </p>
  );
}

export default AnimatedInfo;
