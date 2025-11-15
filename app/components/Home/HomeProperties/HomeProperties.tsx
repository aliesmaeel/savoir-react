import React, { useEffect, useRef, useState } from "react";
import Card from "~/UI/Card";
import PropertiesSearch from "./PropertiesSearch";
import PropertiesTabs from "./PropertiesTabs";
import PropertiesSwiper from "./PropertiesSwiper";
import { useLoaderData } from "react-router";

export default function HomeProperties() {
  const { home } = useLoaderData() as { home: any };
  const [tab, setTab] = useState("For Rent");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Efficient Intersection Observer - only runs once
  useEffect(() => {
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
        threshold: 0.25,
        rootMargin: "0px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className={`w-full transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-[200px]"
      }`}
    >
      <Card>
        <div className="flex flex-col items-start gap-[30px] lg:gap-[60px] px-[24px] lg:px-[45px] py-[46px] lg:py-[87px] pb-[22px] lg:pb-[41px] w-full">
          {/* <PropertiesSearch /> */}
          <div className="flex flex-col items-center gap-[49px] w-full">
            <PropertiesTabs tab={tab} setTab={setTab} />
            {tab === "Off Plan" && (
              <PropertiesSwiper properties={home.featured_properties.off_plan} />
            )}
            {tab === "For Sale" && <PropertiesSwiper properties={home.featured_properties.RS} />}
            {tab === "For Rent" && (
                <PropertiesSwiper properties={home.featured_properties.RR} />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
