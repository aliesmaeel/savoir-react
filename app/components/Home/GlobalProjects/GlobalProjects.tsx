import React, { useRef } from "react";
import { Link } from "react-router";
import useArrow from "~/hooks/imageHooks/useArrow";
import Card from "~/UI/Card";
import Title from "~/UI/Title";
import GlobalProjectsSwiper from "./GlobalProjectsSwiper";
import { motion, useAnimation, type Variants, useScroll, useMotionValueEvent } from "framer-motion";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";

export default function GlobalProjects() {
  const arrow = useArrow();
  const isMobile = useIsMobile();

  const controls = useAnimation();
  const variants: Variants = {
    hidden: { opacity: 0, x: 200, transition: { duration: 0.7, ease: "easeOut" } }, // off-screen right
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }, // slide to center
  };

  // Track scroll direction (desktop only)
  const { scrollY } = useScroll();
  const prev = useRef(0);
  const dir = useRef<"down" | "up">("down");

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (isMobile) return; // 🚫 disable scroll animations on mobile

    const isDown = latest > prev.current;
    dir.current = isDown ? "down" : "up";

    if (isDown && latest > 100) {
      controls.start("visible");
    } else if (!isDown) {
      controls.start("hidden");
    }

    prev.current = latest;
  });

  return (
    <motion.div
      className="w-full"
      variants={variants}
      initial="hidden"
      animate={isMobile ? "visible" : controls} // ✅ always visible on mobile
      style={{ willChange: "transform, opacity" }}
      viewport={isMobile ? undefined : { amount: 0.5 }}
      onViewportEnter={
        isMobile
          ? undefined
          : () => {
              if (dir.current === "down") controls.start("visible");
            }
      }
      onViewportLeave={
        isMobile
          ? undefined
          : () => {
              if (dir.current === "up") controls.start("hidden");
            }
      }
    >
      <Card className="w-full max-w-[591px]">
        <div className="flex flex-col items-start gap-[25px] lg:gap-[39px] w-full pt-[21px] lg:pt-[33px] pb-[36px] lg:pb-[55px]">
          <div className="flex items-center justify-between w-full px-[21px] lg:px-[33px]">
            <Title className="text-[22px] lg:text-[34px]">Global Projects</Title>
            <Link to="/global-project" className="flex items-center gap-[6px] lg:gap-[9px]">
              <p className="text-[11px] lg:text-[18px] underline">See all</p>
              <img loading="lazy" src={arrow.smallGold} alt="" className="w-[7px] lg:w-[8px]" />
            </Link>
          </div>
          <GlobalProjectsSwiper />
        </div>
      </Card>
    </motion.div>
  );
}
