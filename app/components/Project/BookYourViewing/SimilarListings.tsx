import React from "react";
import ProjectCard from "~/components/Cards/ProjectCard";

export default function SimilarListings() {
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
      <p className="text-[36px] font-semibold">Similar Listings :</p>
      <div className="grid grid-cols-3 w-full gap-x-[48px] gap-y-[45px]">
        {projects.map((project: any, index: number) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
}
