import React, { useRef, useState } from "react";
import styles from "./HomeOurData.module.css";
import AnimatedInfo from "~/UI/AnimatedInfo";
import { motion, useAnimation, type Variants, useScroll, useMotionValueEvent } from "framer-motion";

export default function HomeOurData() {
  const data = [
    { title: "Countries", logo: "/images/placeholders/image 48.svg", info: "70" },
    { title: "Offices",logo: "/images/placeholders/image 49.svg" , info: "4700K" },
    { title: "Companies", logo: "/images/placeholders/image 47.svg", info: "550K" },
  ];

  const controls = useAnimation();
  const [canCount, setCanCount] = useState(false); // ⬅️ gate for AnimatedInfo

  const variants: Variants = {
    hidden: { opacity: 0, y: 100, transition: { duration: 0.7, ease: "easeOut" } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
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
      className="grid grid-cols-3 gap-[33px] lg:gap-[36px] w-full pt-[37px] lg:pt-[52px]"
      variants={variants}
      initial="hidden"
      animate={controls}
      style={{ willChange: "transform, opacity" }}
      viewport={{ amount: 0.5 }}
      onViewportEnter={async () => {
        if (dir.current === "down") {
          // reveal grid first, then start numbers slightly after
          await controls.start("visible");
          setTimeout(() => setCanCount(true), 300); // delay before numbers start
        } else {
          // scrolling up: let numbers start immediately
          setCanCount(true);
        }
      }}
      onViewportLeave={async () => {
        if (dir.current === "up") {
          await controls.start("hidden");
          setCanCount(false); // reset
        }
      }}
    >
      {data.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-between gap-[11px] lg:gap-[36px]"
        >
          <img loading="lazy" src={item.logo} alt={item.title} />
          <div className="flex flex-col items-center gap-[7px] lg:gap-[22px]">
            <AnimatedInfo
              display={item.info}
              duration={500}
              className={`text-[23px] lg:text-[66px] ${styles.info}`}
              enabled={canCount} // ⬅️ use gate
              startDelayMs={index * 50} // ⬅️ optional stagger per item
            />
            <p className="text-[#353635] text-[11px] lg:text-[33px]">{item.title}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
