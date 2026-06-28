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
      <p
        className="savoir-section-heading text-[38px] leading-[1.1] lg:text-[52px]"
        style={{
          color: "#111111",
          fontWeight: 700,
          opacity: 1,
        }}
      >
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