import React, { useEffect, useRef, useState } from "react";
import Typed from "typed.js";
import Title from "~/UI/Title";
import GlobeViewer from "~/components/Home/GlobeViewer";
import useIcons from "~/hooks/imageHooks/useIcons";
import styles from "./GlobalAccess.module.css";
import AnimatedInfo from "~/UI/AnimatedInfo";

export default function GlobalAccess() {
  const icon = useIcons();

  // Typed
  const typedElRef = useRef<HTMLParagraphElement | null>(null);
  const typedInstanceRef = useRef<Typed | null>(null);
  const startedRef = useRef(false);

  // In-view for the absolute pins
  const globeWrapRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!typedElRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;

          typedInstanceRef.current = new Typed(typedElRef.current!, {
            strings: [
              "We unlock a world of real estate opportunities with leading agents and real estate professionals through our membership in the largest real estate network in the world. We facilitate access to customers and provide luxury offers from more than 70 countries.",
            ],
            typeSpeed: 10,
            showCursor: false,
            loop: false,
          });

          if (typedElRef.current) observer.unobserve(typedElRef.current);
        }
      },
      { root: null, threshold: 0.2 }
    );

    observer.observe(typedElRef.current);

    return () => {
      observer.disconnect();
      typedInstanceRef.current?.destroy();
    };
  }, []);

  // Observe the globe wrapper to trigger pin animations
  useEffect(() => {
    if (!globeWrapRef.current) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setInView(entry.isIntersecting);
      },
      { root: null, threshold: 0.25 }
    );

    obs.observe(globeWrapRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="flex flex-col items-center gap-[52px] w-full relative">
      <div className="flex flex-col items-start gap-[21px] w-full" data-aos="fade-up">
        <Title className="text-[#C6A45A] text-[31px]">
          UNLOCK ENDLESS REAL ESTATE OPPORTUNITIES WITH GLOBAL ACCESS
        </Title>
        <p ref={typedElRef} className="text-[#353635] text-[23px] leading-[225.806%]"></p>
      </div>

      {/* Globe + Stats */}
      <div className="relative" ref={globeWrapRef}>
        <img src={icon.globalAccessleft} alt="" className="absolute top-[-100%] left-0 z-10" />
        <img src={icon.globalAccessRight} alt="" className="absolute bottom-[0] right-0 z-10" />

        <StatPin inView={inView} top="top-[20%]" left="left-[21%]">
          <div className="flex flex-col items-center">
            <AnimatedInfo display="1500" duration={500} className={`text-[60px] ${styles.info}`} />
            <p className="text-[30px]">agents</p>
          </div>
          <img src={icon.globalAccessVictor} alt="" className="w-[166px]" />
        </StatPin>

        {/* Top-right */}
        <StatPin inView={inView} top="top-[20%]" left="left-[79%]">
          <img src={icon.globalAccessVictor} alt="" className="w-[166px] rotate-y-180" />
          <div className="flex flex-col items-center">
            <AnimatedInfo display="1500" duration={500} className={`text-[60px] ${styles.info}`} />
            <p className="text-[30px]">agents</p>
          </div>
        </StatPin>

        {/* Bottom-left */}
        <StatPin inView={inView} top="top-[76%]" left="left-[23%]">
          <div className="flex flex-col items-center">
            <AnimatedInfo display="1500" duration={500} className={`text-[60px] ${styles.info}`} />
            <p className="text-[30px]">agents</p>
          </div>
          <img src={icon.globalAccessVictor} alt="" className="w-[166px] rotate-x-180" />
        </StatPin>

        {/* Bottom-right */}
        <StatPin inView={inView} top="top-[76%]" left="left-[78%]">
          <img src={icon.globalAccessVictor} alt="" className="w-[166px] rotate-180" />
          <div className="flex flex-col items-center">
            <AnimatedInfo display="1500" duration={500} className={`text-[60px] ${styles.info}`} />
            <p className="text-[30px]">agents</p>
          </div>
        </StatPin>

        <GlobeViewer />
      </div>
    </div>
  );
}

/**
 * StatPin
 * - Centers at (50%, 50%) with opacity-0 when not in view.
 * - Animates to provided top/left with opacity-100 when in view.
 */
function StatPin({
  inView,
  top,
  left,
  children,
}: {
  inView: boolean;
  top: string; // e.g. "top-[23%]"
  left: string; // e.g. "left-[21%]"
  children: React.ReactNode;
}) {
  const base =
    "flex items-end gap-[30px] absolute z-10 transition-all duration-700 ease-out will-change-transform will-change-opacity";
  const hidden = "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0";
  const shown = `${top} ${left} -translate-x-1/2 -translate-y-1/2 opacity-100`;

  return <div className={`${base} ${inView ? shown : hidden}`}>{children}</div>;
}
