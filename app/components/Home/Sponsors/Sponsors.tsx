import React, { useEffect, useRef, useState } from "react";
import SponsorsSwiper from "./SponsorsSwiper";
import {
  motion,
  useAnimation,
  type Variants,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useLoaderData } from "react-router";

export default function Sponsors() {
  const { home } = useLoaderData() as { home: any };

  const title1Ctrl = useAnimation();
  const body1Ctrl = useAnimation();
  const title2Ctrl = useAnimation();
  const body2Ctrl = useAnimation();

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: 60,
      transition: { duration: 0.35, ease: "easeOut" },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const { scrollY } = useScroll();
  const prev = useRef(0);
  const dir = useRef<"down" | "up">("down");

  useMotionValueEvent(scrollY, "change", (latest) => {
    dir.current = latest > prev.current ? "down" : "up";
    prev.current = latest;
  });

  const [section2Allowed, setSection2Allowed] = useState(false);
  const title2InView = useRef(false);
  const seq1Running = useRef(false);
  const seq2Running = useRef(false);

  const tryStartSection2 = async () => {
    if (seq2Running.current) return;
    if (!section2Allowed) return;
    if (!title2InView.current) return;

    seq2Running.current = true;

    await title2Ctrl.start("visible");

    await body2Ctrl.start({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.15,
      },
    });

    seq2Running.current = false;
  };

  useEffect(() => {
    if (section2Allowed) {
      tryStartSection2();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section2Allowed]);

  const onEnterTitle1 = async () => {
    if (dir.current !== "down" || seq1Running.current) return;

    seq1Running.current = true;

    await title1Ctrl.start("visible");

    setSection2Allowed(true);

    tryStartSection2();

    await body1Ctrl.start({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.15,
      },
    });

    seq1Running.current = false;
  };

  const onLeaveTitle1 = async () => {
    if (dir.current !== "up") return;

    setSection2Allowed(false);

    await Promise.all([
      body2Ctrl.start("hidden"),
      title2Ctrl.start("hidden"),
      body1Ctrl.start("hidden"),
      title1Ctrl.start("hidden"),
    ]);
  };

  const onEnterTitle2 = async () => {
    title2InView.current = true;
    await tryStartSection2();
  };

  const onLeaveTitle2 = async () => {
    title2InView.current = false;

    if (dir.current === "up") {
      await Promise.all([
        body2Ctrl.start("hidden"),
        title2Ctrl.start("hidden"),
      ]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-[40px] lg:gap-[100px] w-full mb-[118px] mt-[40px] lg:mt-[120px]">
      {/* ---------- Section 1 ---------- */}
      <div className="flex flex-col items-center gap-[20px] lg:gap-[67px] w-full">
        <motion.div
          variants={variants}
          initial="hidden"
          animate={title1Ctrl}
          viewport={{ amount: 0.35, once: false }}
          onViewportEnter={onEnterTitle1}
          onViewportLeave={onLeaveTitle1}
          style={{ willChange: "transform, opacity" }}
          className="w-full max-w-[1280px] px-[24px] sm:px-[40px] lg:px-[80px]"
        >
          <div className="flex flex-col items-start max-w-[620px]">
            <span className="mb-[14px] tracking-[0.35em] text-[12px] font-semibold uppercase text-[#C5A15A]">
              Our Network
            </span>

            <p className="CormorantGaramond text-left text-[28px] sm:text-[20px] lg:text-[44px] leading-[100%] text-[#0A0A0A]">
              Marketing <em className="italic font-normal">Channels</em>
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={variants}
          initial="hidden"
          animate={body1Ctrl}
          style={{ willChange: "transform, opacity" }}
          className="w-full"
        >
          <SponsorsSwiper logos={home.marketChannels} />
        </motion.div>
      </div>

      {/* ---------- Section 2 ---------- */}
      <div className="flex flex-col items-center gap-[20px] lg:gap-[67px] w-full">
        <motion.div
          variants={variants}
          initial="hidden"
          animate={title2Ctrl}
          viewport={{ amount: 0.35, once: false }}
          onViewportEnter={onEnterTitle2}
          onViewportLeave={onLeaveTitle2}
          style={{ willChange: "transform, opacity" }}
          className="w-full max-w-[1280px] px-[24px] sm:px-[40px] lg:px-[80px]"
        >
          <div className="flex flex-col items-start max-w-[900px]">
            <span className="mb-[14px] tracking-[0.35em] text-[12px] font-semibold uppercase text-[#C5A15A]">
              Listing Reach
            </span>

            <p className="CormorantGaramond text-left text-[40px] sm:text-[45px] lg:text-[52px] leading-[100%] text-[#0A0A0A]">
              Listing Syndication{" "}
              <em className="italic font-normal">and Affiliated Websites</em>
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={variants}
          initial="hidden"
          animate={body2Ctrl}
          style={{ willChange: "transform, opacity" }}
          className="w-full"
        >
          <SponsorsSwiper logos={home.listingSyndications} />
        </motion.div>
      </div>
    </div>
  );
}
