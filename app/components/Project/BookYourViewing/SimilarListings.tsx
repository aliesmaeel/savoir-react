import React from "react";
import { useLoaderData } from "react-router";
import { SwiperSlide } from "swiper/react";
import ProjectCard from "~/components/Cards/ProjectCard";
import ThreeSwiper from "~/UI/ThreeSwiper";

export default function SimilarListings() {
  const { property, similar } = useLoaderData() as { property: any; similar: any };

  return (
    <div className="flex flex-col items-start gap-[33px] w-full mt-[90px]">
      <p className="savoir-section-heading">Similar Listings </p>
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
