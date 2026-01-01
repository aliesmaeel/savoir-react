import React, { useRef } from "react";
import { Link } from "react-router";
import useArrow from "~/hooks/imageHooks/useArrow";
import Button from "~/UI/Button";
import Header from "~/UI/Header";
import { motion, type Variants, useInView } from "framer-motion";

export default function HomeAbout() {
  const arrow = useArrow();

  // One sentinel for the whole block
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, {
    // give buffer to avoid flicker; replays every time it leaves/enters
    amount: 0.35,
    margin: "0px 0px -10% 0px",
    once: false,
  });

  // Parent coordinates the sequence
  const parent: Variants = {
    hidden: { opacity: 1 }, // keep container laid out
    visible: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.12 },
    },
  };

  // Shared child animation (fade + slide up)
  const child: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-start gap-[12px] lg:gap-[18px] w-full"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={parent}
      style={{ willChange: "transform, opacity" }}
    >
      {/* Title */}
      <motion.div variants={child} transition={{ duration: 0.6, ease: "easeOut" }}>
        <Header className="text-[16px] lg:text-[34px]">WE’RE LOCAL, WE’RE GLOBAL</Header>
      </motion.div>

      {/* Text */}
      <motion.div
        variants={child}
        transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
        className="text-[#353635] text-[12px] lg:text-[22px] leading-[233.333%]"
        style={{ willChange: "transform, opacity" }}
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
        variants={child}
        transition={{ duration: 1.0, ease: "easeOut", delay: 1.5 }}
        style={{ willChange: "transform, opacity" }}
      >
        <Link to="/about-us" className="inline-block">
          <Button className="w-[166px] lg:w-[299px]">
            Read more{" "}
            <img loading="lazy" src={arrow.longWhite} alt="" className="w-[17px] rotate-[-45deg]" />
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
