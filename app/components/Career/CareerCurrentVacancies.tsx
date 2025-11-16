import React from "react";
import CareerCard from "./CareerCard";
import ThreeSwiper from "~/UI/ThreeSwiper";
import { SwiperSlide } from "swiper/react";

export default function CareerCurrentVacancies() {
  const vacancies = Array.from({ length: 6 }, (_, index) => ({
    id: index + 1,
    title: `Property Manger`,
    image: "/images/placeholders/career.jpg",
    location: "Marina, Dubai",
  }));

  return (
    <div className="flex flex-col items-center gap-[52px] w-full" id="current-vacancies">
      <div className="flex flex-col items-center gap-[15px] w-full">
        <p className="text-black text-[20px] lg:text-[42px] font-medium">Current Vacancies</p>
        <p className="text-black text-[15px] lg:text-[22px] text-center">
          We offer uncapped salary potential, incentives and rewards, and ongoing support from our
          managers and trainers. Whether you're just starting your career or looking to make a
          change, we want to hear from you.
        </p>
      </div>
      <ThreeSwiper>
        {vacancies.map((job: any, index: number) => (
          <SwiperSlide>
            <CareerCard key={index} job={job} />
          </SwiperSlide>
        ))}
      </ThreeSwiper>
    </div>
  );
}
