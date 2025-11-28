import React, { useEffect, useRef, useState } from "react";
import useArrow from "~/hooks/imageHooks/useArrow";
import useIcons from "~/hooks/imageHooks/useIcons";
import Button from "~/UI/Button";
import Card from "~/UI/Card";
import Title from "~/UI/Title";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";
import { Link } from "react-router";

export default function LuxuryPortfolio() {
  const arrow = useArrow();
  const icon = useIcons();
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
      <Card className="flex flex-col items-start gap-[20px] lg:gap-[30px] w-full pt-[21px] lg:pt-[33px] pb-[147px] lg:pb-[36px] px-[17px] lg:px-[33px] h-full relative overflow-hidden">
        <Title className="text-[22px] lg:text-[30px]">LUXURY PORTFOLIO MAGAZINE</Title>
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
          <Link to={"https://www.luxuryportfolio.com/magazine "} target="_blank">
            <Button className="w-[299px]">
              View all{" "}
              <img
                loading="lazy"
                src={arrow.longWhite}
                alt=""
                className="w-[17px] rotate-[-45deg]"
              />
            </Button>
          </Link>
        </div>

        {/* Magazine image */}
        <img
          src={icon.Magazine}
          alt=""
          className={`absolute bottom-[-44px] right-[-30px] w-[158px] lg:w-[341px] transition-all duration-[600ms] ease-out delay-[700ms] ${
            isVisible || isMobile
              ? "opacity-100 translate-x-0 translate-y-0 scale-100"
              : "opacity-0 translate-x-[100px] translate-y-[100px] scale-90"
          }`}
        />
      </Card>
    </div>
  );
}
