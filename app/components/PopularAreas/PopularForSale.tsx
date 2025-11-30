import React from "react";
import { useLoaderData } from "react-router";
import { SwiperSlide } from "swiper/react";
import ProjectCard from "~/components/Cards/ProjectCard";
import project from "~/routes/project";
import ThreeSwiper from "~/UI/ThreeSwiper";

export default function PopularForSale() {
  const { area, properties } = useLoaderData() as { area: any; properties: any };

  return (
    <div className="flex flex-col items-start gap-[33px] w-full mt-[90px]">
      <p className="text-[20px] lg:text-[36px] font-semibold">Properties For Sale {area.name}</p>
      <ThreeSwiper>
        {properties.map((project: any, index: number) => (
          <SwiperSlide key={index}>
            <ProjectCard project={project} />
          </SwiperSlide>
        ))}
      </ThreeSwiper>
    </div>
  );
}
