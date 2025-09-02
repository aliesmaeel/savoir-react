import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./HomeOurData.module.css";

/** Parse values like "+4700K", "+550K", "+70" */
function parseTarget(display: string) {
  const match = display.trim().match(/^(\+)?\s*([0-9]+(?:\.[0-9]+)?)\s*([A-Za-z%]*)$/);
  if (!match) {
    return { sign: "", value: 0, suffix: "", raw: display };
  }
  const [, plus, num, suffix] = match;
  return { sign: plus ?? "", value: Number(num), suffix: suffix ?? "", raw: display };
}

/** In-view hook that toggles true/false whenever visibility changes */
function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          setInView(e.isIntersecting);
        }
      },
      {
        root: null,
        // Start a bit before the element hits the center; adjust as you like
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

/** Animated number that (re)starts whenever it enters the viewport */
function AnimatedInfo({
  display,
  duration = 100,
  className,
  resetOnExit = true,
}: {
  display: string;
  duration?: number;
  className?: string;
  resetOnExit?: boolean;
}) {
  const { sign, value, suffix, raw } = useMemo(() => parseTarget(display), [display]);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const { ref, inView } = useInView<HTMLParagraphElement>();
  const [shown, setShown] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Clean up any running animation frame
  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Handle reduced motion
  useEffect(() => {
    if (!prefersReducedMotion) return;
    if (inView) setShown(value);
    else if (resetOnExit) setShown(0);
  }, [inView, value, prefersReducedMotion, resetOnExit]);

  // Animate when entering view; reset when leaving (if desired)
  useEffect(() => {
    if (prefersReducedMotion) return;

    if (inView) {
      // Restart animation from 0 each time it enters view
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      setShown(0);
      const start = performance.now();

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // Ease (swing-like): 0.5 - cos(πt)/2
        const eased = 0.5 - Math.cos(Math.PI * t) / 2;
        setShown(value * eased);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setShown(value);
          rafRef.current = null;
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    } else if (resetOnExit) {
      // Element left the viewport — prepare for next time
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      setShown(0);
    }
  }, [inView, value, duration, prefersReducedMotion, resetOnExit]);

  const formatted = Number.isFinite(shown) ? `${sign}${Math.ceil(shown)}${suffix}` : raw;

  return (
    <p ref={ref} className={className} aria-label={raw}>
      {formatted}
    </p>
  );
}

export default function HomeOurData() {
  const data = [
    { title: "Countries", logo: "/images/placeholders/image 49.svg", info: "+70" },
    { title: "Offices", logo: "/images/placeholders/image 48.svg", info: "+4700K" },
    { title: "Companies", logo: "/images/placeholders/image 47.svg", info: "+550K" },
  ];

  return (
    <div className="grid grid-cols-3 gap-[36px] w-full pt-[52px]" data-aos="fade-up" id="our-data">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center justify-between gap-[36px]">
          <img src={item.logo} alt={item.title} />
          <div className="flex flex-col items-center gap-[22px]">
            <AnimatedInfo
              display={item.info}
              duration={3000}
              className={`text-[66px] ${styles.info}`}
              // If you want the number to stay when you scroll away, set this to false:
              // resetOnExit={false}
            />
            <p className="text-[#353635] text-[33px]">{item.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
