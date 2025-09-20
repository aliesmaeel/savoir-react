import React from "react";
import Header from "~/UI/Header";

export default function AboutWhoWeAre() {
  return (
    <div className="flex flex-col items-start gap-[18px] w-full">
      <Header className="text-[34px]">Who We Are</Header>
      <p className="text-black text-[27px] leading-[194.444%%]">
        With four decades of experience, our luxury boutique real estate agency is dedicated to
        setting a new benchmark for service and expertise in the realm of upscale properties in
        Dubai. Understanding the distinct needs and preferences of our clients, we provide
        personalized solutions that consistently surpass expectations. Leveraging our profound
        knowledge of the local market and an extensive network, we present a carefully curated
        selection of exclusive properties epitomizing luxury living.
      </p>
    </div>
  );
}
