import React from "react";
import useArrow from "~/hooks/imageHooks/useArrow";
import Button from "~/UI/Button";
import Header from "~/UI/Header";

export default function HomeAbout() {
  const arrow = useArrow();
  return (
    <div className="flex flex-col items-start gap-[18px] w-full">
      <Header className="text-[34px]">WE’RE LOCAL, WE’RE GLOBAL</Header>
      <p className="text-[#353635] text-[22px] leading-[233.333%]">
        With four decades of experience, our luxury boutique real estate agency is dedicated to
        setting a new benchmark for service and expertise in the realm of upscale properties in
        Dubai. Understanding the distinct needs and preferences of our clients, we provide
        personalized solutions that consistently surpass expectations. Leveraging our profound
        knowledge of the local market and an extensive network, we present a carefully curated
        selection of exclusive properties epitomizing luxury living.
      </p>
      <Button className="w-[299px]">
        Read more <img src={arrow.longWhite} alt="" />
      </Button>
    </div>
  );
}
