import React, { useRef } from "react";
import Card from "~/UI/Card";
import Title from "~/UI/Title";
import OurCustomersSwiper from "./OurCustomersSwiper";
import { motion, useAnimation, type Variants, useScroll, useMotionValueEvent } from "framer-motion";

export default function OurCustomers() {
  // Controls + variants for parent div (left → right)
  const controls = useAnimation();
  const variants: Variants = {
    hidden: { opacity: 0, x: 200, transition: { duration: 0.7, ease: "easeOut" } },
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
      <Card className="flex flex-col items-start gap-[38px] pt-[33px] pb-[40px] w-full max-w-[591]">
        <div className="px-[33px]">
          <Title className="text-[30px]">Our customers love</Title>
        </div>
        <OurCustomersSwiper />
      </Card>
    </motion.div>
  );
}
