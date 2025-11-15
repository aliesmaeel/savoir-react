import React, { useEffect, useRef, useState } from "react";
import Card from "~/UI/Card";
import Title from "~/UI/Title";
import OurCustomersSwiper from "./OurCustomersSwiper";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";

export default function OurCustomers() {
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
      <Card className="flex flex-col items-start gap-0 lg:gap-[38px] pt-[20px] lg:pt-[33px] pb-0 lg:pb-[40px] w-full max-w-[591px]">
        <div className="px-[20px] lg:px-[33px]">
          <Title className="text-[21px] lg:text-[30px]">Our customers love</Title>
        </div>
        <OurCustomersSwiper />
      </Card>
    </div>
  );
}
