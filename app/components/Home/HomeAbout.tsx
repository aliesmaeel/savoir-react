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
        <Header className="text-[16px] lg:text-[34px]">
          NEW ERA OF REAL ESTATE EXCELLENCE</Header>
      </motion.div>

      {/* Text + Image */}
      <motion.div
        variants={child}
        transition={{ duration: 0.9, ease: "easeOut", delay: 1 }}
        className="flex flex-col lg:flex-row lg:items-stretch gap-6 lg:gap-12 w-full"
        style={{ willChange: "transform, opacity" }}
      >
        <p className="text-[#353635] text-[12px] lg:text-[20px] leading-[233.333%] flex-1 lg:min-w-0">
          With four decades of experience, our luxury boutique real estate agency is dedicated to
          setting a new benchmark for service and expertise in the realm of upscale properties in
          Dubai. Understanding the distinct needs and preferences of our clients, we provide
          personalized solutions that consistently surpass expectations. Leveraging our profound
          knowledge of the local market and an extensive network, we present a carefully curated
          selection of exclusive properties epitomizing luxury living.
        </p>
        <div className="flex-shrink-0 w-full lg:w-[45%] lg:max-w-[500px] aspect-[4/3] overflow-hidden rounded-sm">
          <img
            src="/images/placeholders/about.jpeg"
            alt="Luxury real estate expertise in Dubai"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
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
