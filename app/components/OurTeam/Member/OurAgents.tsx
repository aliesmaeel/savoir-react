import React from "react";
import TeamCard from "../TeamCard";
import ThreeSwiper from "~/UI/ThreeSwiper";
import { SwiperSlide } from "swiper/react";
import { useLoaderData } from "react-router";

export default function OurAgents() {
  const { teams } = useLoaderData() as { teams: any };

  return (
    <div className="mt-[112px] flex w-full flex-col items-center gap-[37px]">
      <p
        className="CormorantGaramond text-[42px] leading-[1.1]"
        style={{
          color: "#111111",
          fontWeight: 500,
          opacity: 1,
          textShadow: "0 0 0.28px #111111",
        }}
      >
        Our Team
      </p>

      <ThreeSwiper spaceBetween={21}>
        {teams.map((member: any, index: number) => (
          <SwiperSlide key={index}>
            <TeamCard member={member} />
          </SwiperSlide>
        ))}
      </ThreeSwiper>
    </div>
  );
}