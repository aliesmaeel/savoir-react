import React, { useRef } from "react";
import useArrow from "~/hooks/imageHooks/useArrow";
import Button from "~/UI/Button";
import Header from "~/UI/Header";
import { motion, useAnimation, type Variants, useScroll, useMotionValueEvent } from "framer-motion";

export default function HomeAbout() {
  const arrow = useArrow();

  // Three independent controllers
  const titleCtrl = useAnimation();
  const textCtrl = useAnimation();
  const btnCtrl = useAnimation();

  // Shared variants (fade + slide up)
  const variants: Variants = {
    hidden: { opacity: 0, y: 100, transition: { duration: 0.3, ease: "easeOut" } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  // Track scroll direction
  const { scrollY } = useScroll();
  const prev = useRef(0);
  const dir = useRef<"down" | "up">("down");
  useMotionValueEvent(scrollY, "change", (latest) => {
    dir.current = latest > prev.current ? "down" : "up";
    prev.current = latest;
  });

  // Prevent double triggers while running
  const sequencing = useRef(false);

  // Kick off the chain when title enters while scrolling down
  async function handleEnter() {
    if (dir.current !== "down" || sequencing.current) return;
    sequencing.current = true;

    // Title → Text → Button (with individual durations)
    await titleCtrl.start({ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } });
    await textCtrl.start({ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } });
    await btnCtrl.start({ opacity: 1, y: 0, transition: { duration: 1.0, ease: "easeOut" } });

    sequencing.current = false;
  }

  // Reset (smooth) when leaving upward so it can replay
  async function handleLeave() {
    if (dir.current !== "up") return;
    // reset all to hidden (you can stagger these if you want)
    await Promise.all([
      titleCtrl.start({ opacity: 0, y: 100, transition: { duration: 0.35, ease: "easeInOut" } }),
      textCtrl.start({ opacity: 0, y: 100, transition: { duration: 0.35, ease: "easeInOut" } }),
      btnCtrl.start({ opacity: 0, y: 100, transition: { duration: 0.35, ease: "easeInOut" } }),
    ]);
  }

  return (
    <div className="flex flex-col items-start gap-[18px] w-full">
      {/* Title (acts as the trigger for the whole sequence) */}
      <motion.div
        variants={variants}
        initial="hidden"
        animate={titleCtrl}
        style={{ willChange: "transform, opacity" }}
        viewport={{ amount: 0.5 }}
        onViewportEnter={handleEnter}
        onViewportLeave={handleLeave}
      >
        <Header className="text-[34px]">WE’RE LOCAL, WE’RE GLOBAL</Header>
      </motion.div>

      {/* Text */}
      <motion.div
        variants={variants}
        initial="hidden"
        animate={textCtrl}
        style={{ willChange: "transform, opacity" }}
        viewport={{ amount: 0.5 }}
        className="text-[#353635] text-[22px] leading-[233.333%]"
      >
        With four decades of experience, our luxury boutique real estate agency is dedicated to
        setting a new benchmark for service and expertise in the realm of upscale properties in
        Dubai. Understanding the distinct needs and preferences of our clients, we provide
        personalized solutions that consistently surpass expectations. Leveraging our profound
        knowledge of the local market and an extensive network, we present a carefully curated
        selection of exclusive properties epitomizing luxury living.
      </motion.div>

      {/* Button */}
      <motion.div
        variants={variants}
        initial="hidden"
        animate={btnCtrl}
        style={{ willChange: "transform, opacity" }}
        viewport={{ amount: 0.5 }}
      >
        <Button className="w-[299px]">
          Read more <img src={arrow.longWhite} alt="" className="w-[17px] rotate-[-45deg]" />
        </Button>
      </motion.div>
    </div>
  );
}
