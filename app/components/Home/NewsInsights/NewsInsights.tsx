import React, { useRef } from "react";
import { Link } from "react-router";
import useArrow from "~/hooks/imageHooks/useArrow";
import Card from "~/UI/Card";
import Title from "~/UI/Title";
import NewsInsightsSwiper from "./NewsInsightsSwiper";
import { motion, useAnimation, type Variants, useScroll, useMotionValueEvent } from "framer-motion";

export default function NewsInsights() {
  const arrow = useArrow();

  const controls = useAnimation();
  const variants: Variants = {
    // Keep a transition on BOTH states so entering and leaving are equally smooth
    hidden: { opacity: 0, x: 200, transition: { duration: 0.7, ease: "easeOut" } }, // back to right
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }, // from right
  };

  // Track scroll direction
  const { scrollY } = useScroll();
  const prev = useRef(0);
  const dir = useRef<"down" | "up">("down");
  useMotionValueEvent(scrollY, "change", (latest) => {
    dir.current = latest > prev.current ? "down" : "up";
    prev.current = latest;
  });

  return (
    <motion.div
      className="w-full"
      variants={variants}
      initial="hidden"
      animate={controls}
      style={{ willChange: "transform, opacity" }}
      viewport={{ amount: 0.5 }}
      onViewportEnter={() => {
        if (dir.current === "down") controls.start("visible");
      }}
      onViewportLeave={() => {
        if (dir.current === "up") controls.start("hidden"); // ⬅️ use start() for smooth exit
      }}
    >
      <Card className="w-full max-w-[591px]">
        <div className="flex flex-col items-start gap-[39px] w-full pt-[33px] pb-[55px]">
          <div className="flex items-center justify-between w-full px-[33px]">
            <Title className="text-[34px]">News & Insights</Title>
            <Link to="#" className="flex items-center gap-[9px]">
              <p className="text-[18px] underline">See all</p>
              <img src={arrow.smallGold} alt="" />
            </Link>
          </div>
          <NewsInsightsSwiper />
        </div>
      </Card>
    </motion.div>
  );
}
