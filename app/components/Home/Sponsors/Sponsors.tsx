import React, { useEffect, useRef, useState } from "react";
import Title from "~/UI/Title";
import SponsorsSwiper from "./SponsorsSwiper";
import { motion, useAnimation, type Variants, useScroll, useMotionValueEvent } from "framer-motion";

export default function Sponsors() {
  // Controls for each step
  const title1Ctrl = useAnimation();
  const body1Ctrl = useAnimation();
  const title2Ctrl = useAnimation();
  const body2Ctrl = useAnimation();

  // Variants (fade + slide up)
  const variants: Variants = {
    hidden: { opacity: 0, y: 60, transition: { duration: 0.35, ease: "easeOut" } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Scroll direction
  const { scrollY } = useScroll();
  const prev = useRef(0);
  const dir = useRef<"down" | "up">("down");
  useMotionValueEvent(scrollY, "change", (latest) => {
    dir.current = latest > prev.current ? "down" : "up";
    prev.current = latest;
  });

  // Gate Section 2; track if Title 2 is in view and if its seq is running
  const [section2Allowed, setSection2Allowed] = useState(false);
  const title2InView = useRef(false);
  const seq1Running = useRef(false);
  const seq2Running = useRef(false);

  // Try to start Section 2 whenever possible (no direction check)
  const tryStartSection2 = async () => {
    if (seq2Running.current) return;
    if (!section2Allowed) return;
    if (!title2InView.current) return;

    seq2Running.current = true;
    await title2Ctrl.start("visible");
    await body2Ctrl.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.15 },
    });
    seq2Running.current = false;
  };

  // Also react when the gate opens while Title 2 is already in view
  useEffect(() => {
    if (section2Allowed) {
      // fire-and-forget; we don't need to await in an effect
      tryStartSection2();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section2Allowed]);

  // SECTION 1: Title -> Body, unlock section 2 right after Title 1
  const onEnterTitle1 = async () => {
    if (dir.current !== "down" || seq1Running.current) return;
    seq1Running.current = true;

    await title1Ctrl.start("visible");

    // Unlock Section 2 as soon as Title 1 is revealed
    setSection2Allowed(true);
    // If Title 2 is already in view, start it immediately
    tryStartSection2();

    // Then animate Body 1 (with a small pause)
    await body1Ctrl.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.15 },
    });

    seq1Running.current = false;
  };

  // Reset everything if we scroll up past Title 1
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

  // SECTION 2: keep an explicit in-view flag; reset ONLY when scrolling up
  const onEnterTitle2 = async () => {
    title2InView.current = true;
    await tryStartSection2();
  };

  const onLeaveTitle2 = async () => {
    title2InView.current = false;
    // Only reset when user is scrolling UP — keeps it visible when leaving while scrolling DOWN
    if (dir.current === "up") {
      await Promise.all([body2Ctrl.start("hidden"), title2Ctrl.start("hidden")]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-[100px] w-full mb-[118px]">
      {/* ---------- Section 1 ---------- */}
      <div className="flex flex-col items-center gap-[67px] w-full">
        <motion.div
          variants={variants}
          initial="hidden"
          animate={title1Ctrl}
          viewport={{ amount: 0.35, once: false }}
          onViewportEnter={onEnterTitle1}
          onViewportLeave={onLeaveTitle1}
          style={{ willChange: "transform, opacity" }}
        >
          <Title className="text-[45px]">MARKETING CHANNELS</Title>
        </motion.div>

        <motion.div
          variants={variants}
          initial="hidden"
          animate={body1Ctrl}
          style={{ willChange: "transform, opacity" }}
        >
          <SponsorsSwiper />
        </motion.div>
      </div>

      {/* ---------- Section 2 (unlocked after Title 1) ---------- */}
      <div className="flex flex-col items-center gap-[67px] w-full">
        <motion.div
          variants={variants}
          initial="hidden"
          animate={title2Ctrl}
          viewport={{ amount: 0.35, once: false }}
          onViewportEnter={onEnterTitle2}
          onViewportLeave={onLeaveTitle2}
          style={{ willChange: "transform, opacity" }}
        >
          <Title className="text-[45px]">LISTING SYNDICATION AND AFFILIATED WEBSITES</Title>
        </motion.div>

        <motion.div
          variants={variants}
          initial="hidden"
          animate={body2Ctrl}
          style={{ willChange: "transform, opacity" }}
        >
          <SponsorsSwiper />
        </motion.div>
      </div>
    </div>
  );
}
