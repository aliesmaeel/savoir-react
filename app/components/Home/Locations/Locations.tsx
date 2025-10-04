import React, { useRef } from "react";
import Card from "~/UI/Card";
import LocationsSwiper from "./LocationsSwiper";
import { motion, useAnimation, type Variants, useScroll, useMotionValueEvent } from "framer-motion";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";

export default function Locations() {
  const isMobile = useIsMobile();

  const controls = useAnimation();
  const variants: Variants = {
    hidden: { opacity: 0, x: -200, transition: { duration: 0.7, ease: "easeOut" } },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  // Scroll tracking (desktop only)
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
      <Card className="h-full">
        <div className="pt-[20px] lg:pt-[38px] pb-[19px] lg:pb-[36px]">
          <LocationsSwiper />
        </div>
      </Card>
    </motion.div>
  );
}
