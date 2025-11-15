import React, { useEffect, useRef, useState } from "react";
import Card from "~/UI/Card";
import OffPlanProjectsSwiper from "./OffPlanProjectsSwiper";
import Title from "~/UI/Title";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";

export default function OffPlanProjects() {
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
          : "opacity-0 -translate-x-[200px]"
      }`}
    >
      <Card>
        <div className="flex flex-col items-center gap-[17px] lg:gap-[30px] w-full pt-[17px] lg:pt-[33px] pb-[19px] lg:pb-[36px] ">
          <Title className="text-[18px] lg:text-[30px]">EXPLORE RECENT OFF PLAN PROJECTS</Title>
          <OffPlanProjectsSwiper />
        </div>
      </Card>
    </div>
  );
}
