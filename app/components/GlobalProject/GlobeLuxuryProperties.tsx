import React from "react";
import { SwiperSlide } from "swiper/react";
import ProjectCard from "~/components/Cards/ProjectCard";
import ThreeSwiper from "~/UI/ThreeSwiper";

export default function GlobeLuxuryProperties() {
  const projects = [
    {
      id: 3,
      title: "Luxury 4-Bedroom | Sea and Park Views in Blue Waters",
      price: "$ 450,000",
      location: "Marina, Dubai",
      date: "2years ago",
      image: "/images/placeholders/properties.webp",
      beds: "3",
      bathrooms: "3",
      square: "136456 sqft",
      listedBy: "Wade Warren",
      listedByImage: "/images/placeholders/listedBy.svg",
      isLuxury: false,
    },
    {
      id: 4,
      title: "Luxury 4-Bedroom | Sea and Park Views in Blue Waters",
      price: "$ 450,000",
      location: "Marina, Dubai",
      date: "2years ago",
      image: "/images/placeholders/properties.webp",
      beds: "3",
      bathrooms: "3",
      square: "136456 sqft",
      listedBy: "Wade Warren",
      listedByImage: "/images/placeholders/listedBy.svg",
      isLuxury: true,
    },
    {
      id: 5,
      title: "Luxury 4-Bedroom | Sea and Park Views in Blue Waters",
      price: "$ 450,000",
      location: "Marina, Dubai",
      date: "2years ago",
      image: "/images/placeholders/properties.webp",
      beds: "3",
      bathrooms: "3",
      square: "136456 sqft",
      listedBy: "Wade Warren",
      listedByImage: "/images/placeholders/listedBy.svg",
      isLuxury: false,
    },
  ];
  return (
    <div className="flex flex-col items-start gap-[33px] w-full mt-[90px]">
      <p className="text-[36px] font-semibold">LUXURY Properties</p>
      <ThreeSwiper>
        {projects.map((project: any, index: number) => (
          <SwiperSlide key={index}>
            <ProjectCard project={project} />
          </SwiperSlide>
        ))}
      </ThreeSwiper>
    </div>
  );
}
