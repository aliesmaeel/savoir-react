import React, { useRef } from "react";
import useArrow from "~/hooks/imageHooks/useArrow";
import useIcons from "~/hooks/imageHooks/useIcons";
import Button from "~/UI/Button";
import Card from "~/UI/Card";
import Title from "~/UI/Title";
import { motion, useAnimation, type Variants, useScroll, useMotionValueEvent } from "framer-motion";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";

export default function LuxuryPortfolio() {
  const arrow = useArrow();
  const icon = useIcons();
  const isMobile = useIsMobile();

  // Parent animation
  const controls = useAnimation();
  const variants: Variants = {
    hidden: { opacity: 0, x: 200, transition: { duration: 0.7, ease: "easeOut" } },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  // Image animation
  const imgControls = useAnimation();
  const imgVariants: Variants = {
    hidden: { opacity: 0, x: 100, y: 100, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.7 },
    },
  };

  // Track scroll (desktop only)
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
              if (dir.current === "down") {
                controls.start("visible");
                imgControls.start("visible");
              }
            }
      }
      onViewportLeave={
        isMobile
          ? undefined
          : () => {
              if (dir.current === "up") {
                controls.start("hidden");
                imgControls.start("hidden");
              }
            }
      }
    >
      <Card className="flex flex-col items-start gap-[20px] lg:gap-[30px] w-full pt-[21px] lg:pt-[33px] pb-[147px] lg:pb-[36px] px-[17px] lg:px-[33px] h-full relative overflow-hidden">
        <Title className="text-[22px] lg:text-[30px]">EXPLORE RECENT OFF PLAN PROJECTS</Title>
        <div className="flex flex-col items-start gap-[22px] w-full">
          <div className="flex flex-col items-start w-full">
            <p className="text-[#353635] text-[16px] lg:text-[25px] font-medium">
              LUXURY PORTFOLIO MAGAZINE
            </p>
            <p className="text-[#353635] text-[14px] lg:text-[22px] leading-[233.333%]">
              Published biannually, Luxury Portfolio magazine features the latest luxury
              perspectives on Real Estate, Design, Travel and Lifestyle.
            </p>
          </div>
          <Button className="w-[299px]">
            View all{" "}
            <img loading="lazy" src={arrow.longWhite} alt="" className="w-[17px] rotate-[-45deg]" />
          </Button>
        </div>

        {/* Magazine image */}
        <motion.img
          src={icon.Magazine}
          alt=""
          className="absolute bottom-[-44px] right-[-30px] w-[158px] lg:w-[341px]"
          variants={imgVariants}
          initial="hidden"
          animate={isMobile ? "visible" : imgControls} // ✅ skip anim on mobile
        />
      </Card>
    </motion.div>
  );
}
