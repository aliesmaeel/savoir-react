import React from "react";
import TeamCard from "../TeamCard";
import ThreeSwiper from "~/UI/ThreeSwiper";
import { SwiperSlide } from "swiper/react";

export default function OurAgents() {
  const team = [
    {
      name: "Wade Warren",
      title: "Property Consultant",
      experience: "Experience: 15 years",
      img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Jenny Wilson",
      title: "Senior Broker",
      experience: "Experience: 12 years",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Courtney Henry",
      title: "Investment Advisor",
      experience: "Experience: 14 years",
      img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Wade Warren",
      title: "Property Consultant",
      experience: "Experience: 15 years",
      img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Jenny Wilson",
      title: "Senior Broker",
      experience: "Experience: 12 years",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Courtney Henry",
      title: "Investment Advisor",
      experience: "Experience: 14 years",
      img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-[37px] w-full mt-[112px]">
      <p className="text-black text-[42px] font-medium">Our agents</p>
      <ThreeSwiper spaceBetween={21}>
        {team.map((member: any, index: number) => (
          <SwiperSlide>
            <TeamCard key={index} member={member} />
          </SwiperSlide>
        ))}
      </ThreeSwiper>
    </div>
  );
}
