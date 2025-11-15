import React, { useRef } from "react";
import Card from "~/UI/Card";
import LocationsSwiper from "./LocationsSwiper";
import { motion, useAnimation, type Variants } from "framer-motion";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";

export default function Locations() {
  const isMobile = useIsMobile();

  // Track if component has been shown (only once)
  const hasShown = useRef(false);

  const controls = useAnimation();
  const variants: Variants = {
    hidden: { opacity: 0, x: -200, transition: { duration: 0.7, ease: "easeOut" } },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

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
              // Only show once when scrolling down
              if (!hasShown.current) {
                hasShown.current = true;
                controls.start("visible");
              }
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
