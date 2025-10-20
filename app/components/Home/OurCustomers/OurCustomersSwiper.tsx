import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide, useSwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

import { EffectCards, Autoplay } from "swiper/modules"; // ⬅️ add Autoplay
import useIcons from "~/hooks/imageHooks/useIcons";
import useArrow from "~/hooks/imageHooks/useArrow";

const testimonials = [
  {
    rating: 4.8,
    text: "I have been dealing with Savoir Prive Properties for more than a year now on my multiple properties, and I have no hesitation whatsoever in saying that professionalism, integrity and transparency are core principles of Savior.",
    author: "Millon Zahino",
    role: "Behavioral Science",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    rating: 5.0,
    text: "The service was outstanding, and the team made sure that every detail was perfect. I highly recommend them for anyone seeking reliable property management.",
    author: "Sarah Johnson",
    role: "Marketing Director",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    rating: 4.7,
    text: "Excellent experience throughout. The process was transparent, and the staff is extremely professional. Definitely a trustworthy company.",
    author: "James Lee",
    role: "Financial Analyst",
    avatar: "https://randomuser.me/api/portraits/men/28.jpg",
  },
];

export default function OurCustomersSwiper() {
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const arrow = useArrow();

  return (
    <div className="w-full relative">
      <div className="flex items-center justify-center gap-[44px] w-full mt-6">
        <button
          type="button"
          className="cursor-pointer focus:outline-none absolute top-[50%] translate-y-[-50%] z-10 left-[10px]"
          onClick={() => swiperInstance?.slidePrev()}
        >
          <img loading="lazy" src={arrow.smallGold} alt="Previous" className="w-7 h-7 rotate-180" />
        </button>

        <button
          type="button"
          className="cursor-pointer focus:outline-none absolute top-[50%] translate-y-[-50%] z-10 right-[10px]"
          onClick={() => swiperInstance?.slideNext()}
        >
          <img loading="lazy" src={arrow.smallGold} alt="Next" className="w-7 h-7 " />
        </button>
      </div>
      <Swiper
        effect="cards"
        loop={true}
        grabCursor={true}
        autoplay={{
          delay: 3000, // ⬅️ auto scroll every 3s
          disableOnInteraction: false, // keep autoplaying after manual nav
        }}
        modules={[EffectCards, Autoplay]} // ⬅️ include Autoplay
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        className="mySwiper w-[307.059px] h-[413.25px] scale-75 lg:scale-100"
      >
        {testimonials.map((item, index) => (
          <SwiperSlide key={index} className="rounded-[18px]">
            <TestimonialCard data={item} />
          </SwiperSlide>
        ))}
        {testimonials.map((item, index) => (
          <SwiperSlide key={index} className="rounded-[18px]">
            <TestimonialCard data={item} />
          </SwiperSlide>
        ))}
        {testimonials.map((item, index) => (
          <SwiperSlide key={index} className="rounded-[18px]">
            <TestimonialCard data={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function TestimonialCard({ data }: { data: any }) {
  const { isActive } = useSwiperSlide();
  const icon = useIcons();

  return (
    <div
      className={`w-full h-full rounded-[18px] px-[7px] py-[21px] transition-all duration-300 
        ${isActive ? "bg-[#EBEBEB] opacity-100" : "bg-[#C6A45A33]"}
      `}
    >
      <div
        className={`flex flex-col items-start justify-between w-full h-full ${isActive ? "opacity-100" : "opacity-30"}`}
      >
        <div className="flex flex-col items-start gap-[10px]">
          <div className="flex items-center gap-2 ml-[12px]">
            <span className="bg-[#c6a45a] text-white text-[10px] font-medium px-3 py-1 rounded-full flex items-center gap-1 leading-[12px]">
              {data.rating}
              <img loading="lazy" src={icon.startWhite} alt="" />
            </span>
          </div>

          <div className="flex flex-col items-start">
            <img loading="lazy" src={icon.quotes} alt="" />
            <p className="text-[#232222] text-[15px] leading-[166.667%] px-[7px]">{data.text}</p>
          </div>
          <hr className="w-[85%] border-2 border-[#3536354D] mx-auto" />
        </div>
        <div className="flex items-center gap-3 mt-6">
          <img
            loading="lazy"
            src={data.avatar}
            alt={data.author}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-900">{data.author}</p>
            <p className="text-sm text-gray-500">{data.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
