// FindYourPartner.tsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import TeamCard from "./TeamCard";

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
    name: "Jacob Jones",
    title: "Leasing Expert",
    experience: "Experience: 10 years",
    img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function FindYourPartner() {
  return (
    <section className="flex items-center gap-[33px] w-full">
      <div className="flex flex-col items-start gap-[15px] w-[447px] shrink-0">
        <p className="text-black text-[52px] font-medium">FIND YOUR PARTNER</p>
        <p className="text-[37px] leading-[170%]">
          Our team is highly experienced and knowledgeable across all aspects of the real estate
          industry
        </p>
      </div>

      <div
        className="
          relative w-full
          [&_.swiper]:!overflow-hidden
          [&_.swiper-slide]:transition-all [&_.swiper-slide]:duration-500 [&_.swiper-slide]:will-change-transform
          [&_.swiper-slide]:z-0 [&_.swiper-slide]:opacity-60 [&_.swiper-slide]:scale-95
          /* LEFT — focused (active) */
          [&_.swiper-slide-active]:z-30 [&_.swiper-slide-active]:opacity-100 [&_.swiper-slide-active]:scale-100 [&_.swiper-slide-active]:translate-x-0
          /* MIDDLE — directly after active (behind + slightly smaller + shifted left) */
          [&_.swiper-slide-active+_.swiper-slide]:z-20 [&_.swiper-slide-active+_.swiper-slide]:opacity-80
          [&_.swiper-slide-active+_.swiper-slide]:scale-95 [&_.swiper-slide-active+_.swiper-slide]:-translate-x-8
          /* THIRD — two after active (further behind + smaller + more left) */
          [&_.swiper-slide-active+_.swiper-slide+_.swiper-slide]:z-10 [&_.swiper-slide-active+_.swiper-slide+_.swiper-slide]:opacity-70
          [&_.swiper-slide-active+_.swiper-slide+_.swiper-slide]:scale-90 [&_.swiper-slide-active+_.swiper-slide+_.swiper-slide]:-translate-x-16
        "
      >
        <Swiper
          modules={[Autoplay]}
          slidesPerView={3} // always 3
          centeredSlides={false} // active is LEFT
          loop={true}
          autoplay={{
            delay: 5000, // ⏱ autoplay every 5 seconds
            disableOnInteraction: false, // keeps autoplay running even after user interacts
          }}
          slidesOffsetBefore={0} // ensure far-left alignment
          slidesOffsetAfter={0}
          slideToClickedSlide
          className="!px-0 !py-0" // remove padding that was pushing slides in
        >
          {team.map((member: any, index: number) => (
            <SwiperSlide key={index} className="cursor-grab select-none">
              <TeamCard member={member} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
