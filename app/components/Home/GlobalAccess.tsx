import React, { useEffect, useRef, useState } from "react";
import Title from "~/UI/Title";
import GlobeViewer from "~/components/Home/GlobeViewer";
import useIcons from "~/hooks/imageHooks/useIcons";
import styles from "./GlobalAccess.module.css";
import AnimatedInfo from "~/UI/AnimatedInfo";
import { motion, useAnimation, type Variants, useScroll, useMotionValueEvent } from "framer-motion";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";

export default function GlobalAccess() {
  const icon = useIcons();
  const isMobile = useIsMobile();

  // --- In-view for the absolute pins (your original logic) ---
  const globeWrapRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!globeWrapRef.current) return;
    const obs = new IntersectionObserver((entries) => setInView(entries[0].isIntersecting), {
      root: null,
      threshold: 0.25,
    });
    obs.observe(globeWrapRef.current);
    return () => obs.disconnect();
  }, []);

  // --- Title/Text sequential reveal ---
  const titleCtrl = useAnimation();
  const textCtrl = useAnimation();

  const variants: Variants = {
    hidden: { opacity: 0, y: 60, transition: { duration: 0.35, ease: "easeOut" } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // (Optional) direction-aware reset like your other sections
  const { scrollY } = useScroll();
  const prev = useRef(0);
  const dir = useRef<"down" | "up">("down");
  useMotionValueEvent(scrollY, "change", (latest) => {
    dir.current = latest > prev.current ? "down" : "up";
    prev.current = latest;
  });

  const onEnter = async () => {
    if (dir.current !== "down") return;
    await titleCtrl.start("visible"); // wait for title to finish
    await textCtrl.start({
      // then reveal paragraph
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    });
  };

  const onLeave = async () => {
    if (dir.current !== "up") return;
    await Promise.all([textCtrl.start("hidden"), titleCtrl.start("hidden")]);
  };

  return (
    <div className="flex flex-col items-center gap-[24px] lg:gap-[52px] w-full relative">
      <div className="flex flex-col items-start gap-[14px] lg:gap-[21px] w-full pl-[10%] pr-[10%]">
        {/* Title */}
        <motion.div
          variants={variants}
          initial="hidden"
          animate={titleCtrl}
          viewport={{ amount: 0.5 }}
          onViewportEnter={onEnter}
          
          style={{ willChange: "transform, opacity" }}
        >
          <Title className="text-[#C6A45A] text-[16px] lg:text-[31px]">
            UNLOCK ENDLESS REAL ESTATE OPPORTUNITIES WITH GLOBAL ACCESS
          </Title>
        </motion.div>

        {/* Paragraph (appears after title completes) */}
        <motion.p
          variants={variants}
          initial="hidden"
          animate={textCtrl}
          className="text-[#353635] text-[12px] lg:text-[23px] leading-[166%] lg:leading-[225.806%]"
          style={{ willChange: "transform, opacity" }}
        >
          We unlock a world of real estate opportunities with leading agents and real estate
          professionals through our membership in the largest real estate network in the world. We
          facilitate access to customers and provide luxury offers from more than 70 countries.
        </motion.p>
      </div>

      {/* Globe + Stats (unchanged) */}
      <div className="relative w-full lg:w-full" ref={globeWrapRef}>
        <img
            loading="lazy"
            src={icon.globalAccessleft}
            alt=""
            className="absolute top-[-100%] left-0 z-10 hidden lg:block"
        />
        <img
            loading="lazy"
            src={icon.globalAccessRight}
            alt=""
            className="absolute bottom-[0] right-0 z-10 hidden lg:block"
        />

        <img
            src='/images/luxury.svg'
            alt=""
            className="absolute top-[42%] right-[10%] z-10 hidden lg:block" data-aos="fade-right"
            data-aos-duration="2000"
        />

        <img
            src='/images/leading.svg'
            alt=""
            className="absolute top-[42%] left-[10%] z-10 hidden lg:block" data-aos="fade-left"
            data-aos-duration="2000"
        />
        <StatPin inView={inView} top="top-[12%] lg:top-[20%]" left="left-[17%] lg:left-[21%]">
          <div className="flex flex-col items-center">
            <AnimatedInfo
                display="4600"
                duration={500}
                className={`text-[18px] lg:text-[60px] ${styles.info}`}
            />
            <p className="lg:text-[30px] text-[9px] text-center">Offices</p>
          </div>
          <img
              loading="lazy"
              src={icon.globalAccessVictor}
              alt=""
              className="w-[52px] lg:w-[166px]"
          />
        </StatPin>

        {/* Top-right */}
        <StatPin inView={inView} top="top-[12%] lg:top-[20%]" left="left-[79%]">
          <img
              loading="lazy"
              src={icon.globalAccessVictor}
              alt=""
              className="w-[52px] lg:w-[166px] rotate-y-180"
          />
          <div className="flex flex-col items-center">
            <AnimatedInfo
                display="550"
                duration={500}
                className={`text-[18px] lg:text-[60px] ${styles.info}`}
            />
            <p className="lg:text-[30px] text-[9px] text-center">Firms</p>
          </div>
        </StatPin>

        {/* Bottom-left */}
        <StatPin inView={inView} top="top-[76%]" left="left-[16%] lg:left-[23%]">
          <div className="flex flex-col items-center">
            <AnimatedInfo
                display="70"
                duration={500}
                className={`text-[18px] lg:text-[60px] ${styles.info}`}
            />
            <p className="lg:text-[30px] text-[9px] text-center">Countries</p>
          </div>
          <img
              loading="lazy"
              src={icon.globalAccessVictor}
              alt=""
              className="w-[52px] lg:w-[166px] rotate-x-180"
          />
        </StatPin>

        {/* Bottom-right */}
        <StatPin inView={inView} top="top-[76%]" left="left-[78%]">
          <img
              loading="lazy"
              src={icon.globalAccessVictor}
              alt=""
              className="w-[52px] lg:w-[166px] rotate-180"
          />
          <div className="flex flex-col items-center">
            <AnimatedInfo
                display="150K"
                duration={500}
                className={`text-[18px] lg:text-[60px] ${styles.info}`}
            />
            <p className="lg:text-[30px] text-[9px] text-center text-center">Sales Associates</p>
          </div>
        </StatPin>

        <GlobeViewer height={isMobile ? 180 : 600}/>


      </div>
    </div>
  );
}

/**
 * StatPin (unchanged)
 */
function StatPin({
                   inView,
                   top,
                   left,
                   children,
                 }: {
  inView: boolean;
  top: string;
  left: string;
  children: React.ReactNode;
}) {
  const base =
      "flex items-end gap-[9px] lg:gap-[30px] absolute z-10 transition-all duration-700 ease-out will-change-transform will-change-opacity";
  const hidden = "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0";
  const shown = `${top} ${left} -translate-x-1/2 -translate-y-1/2 opacity-100`;

  return <div className={`${base} ${inView ? shown : hidden}`}>{children}</div>;
}
