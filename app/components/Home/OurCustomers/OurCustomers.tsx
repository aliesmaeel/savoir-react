import React, { useRef } from "react";
import Card from "~/UI/Card";
import Title from "~/UI/Title";
import OurCustomersSwiper from "./OurCustomersSwiper";
import { motion, useAnimation, type Variants, useScroll, useMotionValueEvent } from "framer-motion";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";

export default function OurCustomers() {
  const isMobile = useIsMobile();

  const controls = useAnimation();
  const variants: Variants = {
    hidden: { opacity: 0, x: 200, transition: { duration: 0.7, ease: "easeOut" } },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  // Track scroll direction (desktop only)
  const { scrollY } = useScroll();
  const prev = useRef(0);
  const dir = useRef<"down" | "up">("down");

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (isMobile) return; // 🚫 skip on mobile

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
      <Card className="flex flex-col items-start gap-0 lg:gap-[38px] pt-[20px] lg:pt-[33px] pb-0 lg:pb-[40px] w-full max-w-[591px]">
        <div className="px-[20px] lg:px-[33px]">
          <Title className="text-[21px] lg:text-[30px]">Our customers love</Title>
        </div>
        <OurCustomersSwiper />
      </Card>
    </motion.div>
  );
}
