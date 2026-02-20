import React from "react";
import { useLoaderData } from "react-router";
import { SwiperSlide } from "swiper/react";
import ProjectCard from "~/components/Cards/ProjectCard";
import ThreeSwiper from "~/UI/ThreeSwiper";

export default function SimilarListings() {
  const { property, similar } = useLoaderData() as { property: any; similar: any };

  return (
    <div className="flex flex-col items-start gap-[33px] w-full mt-[90px]">
      <p className="text-[21px] font-semibold">Similar Listings :</p>
      <ThreeSwiper>
        {similar.map((project: any, index: number) => (
          <SwiperSlide key={index}>
            <ProjectCard project={project} />
          </SwiperSlide>
        ))}
      </ThreeSwiper>
    </div>
  );
}
