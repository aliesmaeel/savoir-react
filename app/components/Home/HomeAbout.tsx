import React, { useEffect, useRef } from "react";
import useArrow from "~/hooks/imageHooks/useArrow";
import Button from "~/UI/Button";
import Header from "~/UI/Header";
import Typed from "typed.js";

export default function HomeAbout() {
  const arrow = useArrow();
  const typedElRef = useRef<HTMLDivElement | null>(null);
  const typedInstanceRef = useRef<Typed | null>(null);
  const startedRef = useRef(false); // ensure it runs only once

  useEffect(() => {
    if (!typedElRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;

          // Init Typed on the actual element (safer than "#id" selectors)
          typedInstanceRef.current = new Typed(typedElRef.current!, {
            strings: [
              "With four decades of experience, our luxury boutique real estate agency is dedicated to setting a new benchmark for service and expertise in the realm of upscale properties in Dubai. Understanding the distinct needs and preferences of our clients, we provide personalized solutions that consistently surpass expectations. Leveraging our profound knowledge of the local market and an extensive network, we present a carefully curated selection of exclusive properties epitomizing luxury living.",
            ],
            typeSpeed: 10, // smaller = faster typing
            showCursor: false, // set true + cursorChar if you want the cursor
            loop: false,
          });

          // no need to observe further once started
          observer.unobserve(typedElRef.current!);
        }
      },
      {
        root: null, // viewport
        threshold: 0.2, // start when 20% of the block is visible
        rootMargin: "0px 0px -10% 0px", // optional tweak to start a bit earlier
      }
    );

    observer.observe(typedElRef.current);

    return () => {
      observer.disconnect();
      typedInstanceRef.current?.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col items-start gap-[18px] w-full">
      <Header className="text-[34px]">WE’RE LOCAL, WE’RE GLOBAL</Header>

      {/* Typed.js output (starts when scrolled into view) */}
      <div ref={typedElRef} className="text-[#353635] text-[22px] leading-[233.333%]" />

      <Button className="w-[299px]">
        Read more <img src={arrow.longWhite} alt="" className="w-[17px] rotate-[-45deg]" />
      </Button>
    </div>
  );
}
