import React from "react";
import { useLoaderData } from "react-router";
import { SwiperSlide } from "swiper/react";
import ProjectCard from "~/components/Cards/ProjectCard";
import ThreeSwiper from "~/UI/ThreeSwiper";

export default function SimilarListings() {
  const { property, similar } = useLoaderData() as {
    property: any;
    similar: any;
  };

  return (
    <div className="flex w-full flex-col items-start gap-[33px] mt-[90px]">
      <p className="CormorantGaramond text-[28px] font-[900] leading-[1.08] text-[#050505] [text-shadow:0_0_0.45px_#050505] lg:text-[34px]">
        Similar Listings
      </p>

      <ThreeSwiper desktopSlidesPerView={4} spaceBetween={24}>
        {similar.map((project: any, index: number) => (
          <SwiperSlide key={index}>
            <ProjectCard project={project} compact />
          </SwiperSlide>
        ))}
      </ThreeSwiper>
    </div>
  );
}
