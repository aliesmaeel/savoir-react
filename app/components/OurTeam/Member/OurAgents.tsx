import React from "react";
import TeamCard from "../TeamCard";
import ThreeSwiper from "~/UI/ThreeSwiper";
import { SwiperSlide } from "swiper/react";
import { useLoaderData } from "react-router";

export default function OurAgents() {
  const { teams } = useLoaderData() as { teams: any };

  return (
    <div className="flex flex-col items-center gap-[37px] w-full mt-[112px]">
      <p className="text-black text-[42px] font-medium">Our agents</p>
      <ThreeSwiper spaceBetween={21}>
        {teams.map((member: any, index: number) => (
          <SwiperSlide>
            <TeamCard key={index} member={member} />
          </SwiperSlide>
        ))}
      </ThreeSwiper>
    </div>
  );
}
