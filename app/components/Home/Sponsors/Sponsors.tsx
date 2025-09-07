import React, { useRef } from "react";
import Title from "~/UI/Title";
import SponsorsSwiper from "./SponsorsSwiper";
import { motion, useAnimation, type Variants, useScroll, useMotionValueEvent } from "framer-motion";

function RevealSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  const titleCtrl = useAnimation();
  const bodyCtrl = useAnimation();

  const variants: Variants = {
    hidden: { opacity: 0, y: 60, transition: { duration: 0.35, ease: "easeOut" } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const { scrollY } = useScroll();
  const prev = useRef(0);
  const dir = useRef<"down" | "up">("down");
  useMotionValueEvent(scrollY, "change", (latest) => {
    dir.current = latest > prev.current ? "down" : "up";
    prev.current = latest;
  });

  const onEnter = async () => {
    if (dir.current !== "down") return;
    await titleCtrl.start("visible");
    await bodyCtrl.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.5 }, // ⬅️ half-second pause
    });
  };

  const onLeave = async () => {
    if (dir.current !== "up") return;
    await Promise.all([bodyCtrl.start("hidden"), titleCtrl.start("hidden")]);
  };

  return (
    <div className="flex flex-col items-center gap-[67px] w-full">
      <motion.div
        variants={variants}
        initial="hidden"
        animate={titleCtrl}
        viewport={{ amount: 0.5 }}
        onViewportEnter={onEnter}
        onViewportLeave={onLeave}
        style={{ willChange: "transform, opacity" }}
      >
        <Title className="text-[45px]">{heading}</Title>
      </motion.div>

      <motion.div
        variants={variants}
        initial="hidden"
        animate={bodyCtrl}
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function Sponsors() {
  return (
    <div className="flex flex-col items-center gap-[100px] w-full mb-[118px]">
      <RevealSection heading="MARKETING CHANNELS">
        <SponsorsSwiper />
      </RevealSection>

      <RevealSection heading="LISTING SYNDICATION AND AFFILIATED WEBSITES">
        <SponsorsSwiper />
      </RevealSection>
    </div>
  );
}
