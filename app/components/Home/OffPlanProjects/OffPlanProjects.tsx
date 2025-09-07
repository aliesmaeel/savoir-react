import React, { useRef } from "react";
import Card from "~/UI/Card";
import OffPlanProjectsSwiper from "./OffPlanProjectsSwiper";
import Title from "~/UI/Title";
import { motion, useAnimation, type Variants, useScroll, useMotionValueEvent } from "framer-motion";

export default function OffPlanProjects() {
  // Controls + variants for parent div (left → right)
  const controls = useAnimation();
  const variants: Variants = {
    hidden: { opacity: 0, x: -200, transition: { duration: 0.7, ease: "easeOut" } },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
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
      viewport={{ amount: 0.5 }} // trigger when 25% is in view
      onViewportEnter={() => {
        if (dir.current === "down") controls.start("visible");
      }}
      onViewportLeave={() => {
        if (dir.current === "up") controls.start("hidden"); // smooth exit
      }}
    >
      <Card>
        <div className="flex flex-col items-center gap-[30px] w-full pt-[33px] pb-[36px] ">
          <Title className="text-[30px]">EXPLORE RECENT OFF PLAN PROJECTS</Title>
          <OffPlanProjectsSwiper />
        </div>
      </Card>
    </motion.div>
  );
}
