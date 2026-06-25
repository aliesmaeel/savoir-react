import React from "react";
import { useLoaderData } from "react-router";
import { SwiperSlide } from "swiper/react";
import ProjectCard from "~/components/Cards/ProjectCard";
import ThreeSwiper from "~/UI/ThreeSwiper";

type GlobeLuxuryPropertiesProps = {
  similarProperties: any[];
  /** Lowercase country from parent (updates when user picks a country on the globe). */
  country?: string;
};

const GlobeLuxuryProperties: React.FC<GlobeLuxuryPropertiesProps> = ({
  similarProperties,
  country: countryProp,
}) => {
  const { country: countryFromLoader } = useLoaderData() as { global: any; country: string };
  const country = countryProp ?? countryFromLoader;

  const similar = similarProperties ?? [];

  if (!Array.isArray(similar) || similar.length === 0) {
    return null;
  }

  const titleCountry =
    country && country.length > 0
      ? country
          .split(" ")
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "";

  return (
    <div className="flex flex-col items-start gap-[33px] w-full mt-[90px]">
      <p className="text-[24px] font-semibold">
        Luxury Properties{titleCountry ? ` In ${titleCountry}` : ""}
      </p>
      <ThreeSwiper>
        {similar.map((project: any, index: number) => (
          <SwiperSlide key={index}>
            <ProjectCard project={project} />
          </SwiperSlide>
        ))}
      </ThreeSwiper>
    </div>
  );
};

export default GlobeLuxuryProperties;
