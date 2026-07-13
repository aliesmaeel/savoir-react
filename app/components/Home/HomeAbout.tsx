import React, { useRef } from "react";
import { Link } from "react-router";
import useArrow from "~/hooks/imageHooks/useArrow";
import Button from "~/UI/Button";
import { motion, type Variants, useInView } from "framer-motion";

export default function HomeAbout() {
  const arrow = useArrow();

  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, {
    amount: 0.35,
    margin: "0px 0px -10% 0px",
    once: false,
  });

  const parent: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.12 },
    },
  };

  const child: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className="mx-auto grid w-full max-w-[1160px] grid-cols-1 items-start gap-[28px] lg:grid-cols-[0.95fr_0.8fr] lg:items-center lg:gap-[56px]"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={parent}
      style={{ willChange: "transform, opacity" }}
    >
      <div className="flex w-full max-w-[650px] flex-col items-start gap-[28px]">
        <motion.div
          variants={child}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full"
        >
          <div className="relative w-full">
            <p className="CormorantGaramond text-[15px] leading-[1.1] text-[#111111] lg:text-[30px]">
              A NEW ERA OF REAL{" "}
              <span className="italic">ESTATE EXCELLENCE</span>
            </p>

            <div className="mt-[8px] h-[2px] w-full bg-[linear-gradient(90deg,rgba(198,164,90,0)_0%,rgba(198,164,90,0.95)_50%,rgba(198,164,90,0)_100%)]" />
          </div>
        </motion.div>

        <motion.p
          variants={child}
          transition={{ duration: 0.9, ease: "easeOut", delay: 1 }}
          className="description-body text-[#111111]"
          style={{
            fontWeight: 500,
            opacity: 1,
            willChange: "transform, opacity",
          }}
        >
          Savoir Privé Properties was founded four years ago in Dubai, UAE. But the
          expertise behind it has been accumulating for far longer. Our founders each bring
          over 20 years of Dubai real estate experience to the agency, a combined 40 years
          of on-the-ground knowledge of this market in its every dimension. Add to that the
          depth and diversity of the Savoir team, and the collective expertise within our
          walls exceeds 100 years, spanning the UAE and markets across the globe.
          <br />
          <br />
          That is not a statistic. It is the foundation of every recommendation we make,
          every property we present, and every client relationship we build. Understanding
          the distinct needs of each person we serve, we provide personalised solutions
          that consistently surpass expectations, and a carefully curated selection of
          exclusive properties that epitomise luxury living in the UAE and beyond.
        </motion.p>

        <motion.div
          variants={child}
          transition={{ duration: 1.0, ease: "easeOut", delay: 1.5 }}
          style={{ willChange: "transform, opacity" }}
        >
          <Link to="/about-us" className="inline-block">
            <Button className="h-[40px] w-[145px] !rounded-[8px] !bg-[#2B2B2B] !px-[18px] !py-[8px] text-[12px] font-semibold !text-white shadow-[0_12px_28px_rgba(43,43,43,0.18)] hover:!bg-[#242424] lg:h-[42px] lg:w-[170px] lg:text-[16px]">
              Read more{" "}
              <img
                loading="lazy"
                src={arrow.longWhite}
                alt=""
                className="w-[14px] rotate-[-45deg]"
              />
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        variants={child}
        transition={{ duration: 0.9, ease: "easeOut", delay: 1 }}
        className="w-full max-w-[460px] overflow-hidden rounded-[4px] shadow-[0_24px_70px_rgba(53,54,53,0.10)] lg:justify-self-end"
        style={{ willChange: "transform, opacity" }}
      >
        <img
          src="/images/placeholders/about.jpeg"
          alt="Luxury real estate expertise in Dubai"
          loading="lazy"
          className="aspect-[4/3] w-full object-cover"
        />
      </motion.div>
    </motion.div>
  );
}