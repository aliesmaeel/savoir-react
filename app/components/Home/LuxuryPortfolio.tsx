import React, { useRef } from "react";
import useArrow from "~/hooks/imageHooks/useArrow";
import useIcons from "~/hooks/imageHooks/useIcons";
import Button from "~/UI/Button";
import Card from "~/UI/Card";
import Title from "~/UI/Title";
import { motion, useAnimation, type Variants, useScroll, useMotionValueEvent } from "framer-motion";

export default function LuxuryPortfolio() {
  const arrow = useArrow();
  const icon = useIcons();

  // Parent controls
  const controls = useAnimation();
  const variants: Variants = {
    hidden: { opacity: 0, x: 200, transition: { duration: 0.7, ease: "easeOut" } },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  // Image animation controls
  const imgControls = useAnimation();
  const imgVariants: Variants = {
    hidden: { opacity: 0, x: 100, y: 100, scale: 0.9 }, // start off-corner
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.7 }, // delay for after parent
    },
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
        if (dir.current === "down") {
          controls.start("visible");
          imgControls.start("visible"); // trigger image after parent
        }
      }}
      onViewportLeave={() => {
        if (dir.current === "up") {
          controls.start("hidden");
          imgControls.start("hidden"); // reset image
        }
      }}
    >
      <Card className="flex flex-col items-start gap-[30px] w-full pt-[33px] pb-[36px] px-[33px] h-full relative overflow-hidden">
        <Title className="text-[30px]">EXPLORE RECENT OFF PLAN PROJECTS</Title>
        <div className="flex flex-col items-start gap-[22px] w-full">
          <div className="flex flex-col items-start w-full">
            <p className="text-[#353635] text-[25px] font-medium">LUXURY PORTFOLIO MAGAZINE</p>
            <p className="text-[#353635] text-[22px] leading-[233.333%]">
              Published biannually, Luxury Portfolio magazine features the latest luxury
              perspectives on Real Estate, Design, Travel and Lifestyle.
            </p>
          </div>
          <Button className="w-[299px]">
            View all <img src={arrow.longWhite} alt="" className="w-[17px] rotate-[-45deg]" />
          </Button>
        </div>

        {/* Magazine image with fade + corner motion */}
        <motion.img
          src={icon.Magazine}
          alt=""
          className="absolute bottom-0 right-0 w-[260px]"
          variants={imgVariants}
          initial="hidden"
          animate={imgControls}
        />
      </Card>
    </motion.div>
  );
}
