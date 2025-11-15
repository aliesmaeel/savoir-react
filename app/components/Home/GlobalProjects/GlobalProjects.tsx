import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import useArrow from "~/hooks/imageHooks/useArrow";
import Card from "~/UI/Card";
import Title from "~/UI/Title";
import GlobalProjectsSwiper from "./GlobalProjectsSwiper";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";

export default function GlobalProjects() {
  const arrow = useArrow();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Efficient Intersection Observer - only runs once
  useEffect(() => {
    // Skip animation on mobile for better performance
    if (isMobile) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Disconnect after first trigger for better performance
          observer.disconnect();
        }
      },
      {
        threshold: 0.5,
        rootMargin: "0px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible, isMobile]);

  return (
    <div
      ref={containerRef}
      className={`w-full transition-all duration-700 ease-out ${
        isVisible || isMobile
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-[200px]"
      }`}
    >
      <Card className="w-full max-w-[591px]">
        <div className="flex flex-col items-start gap-[25px] lg:gap-[39px] w-full pt-[21px] lg:pt-[33px] pb-[36px] lg:pb-[55px]">
          <div className="flex items-center justify-between w-full px-[21px] lg:px-[33px]">
            <Title className="text-[22px] lg:text-[34px]">Global Projects</Title>
            <Link to="/global-project" className="flex items-center gap-[6px] lg:gap-[9px]">
              <p className="text-[11px] lg:text-[18px] underline">See all</p>
              <img loading="lazy" src={arrow.smallGold} alt="" className="w-[7px] lg:w-[8px]" />
            </Link>
          </div>
          <GlobalProjectsSwiper />
        </div>
      </Card>
    </div>
  );
}
