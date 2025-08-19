import React, { useState } from "react";
import { Swiper, SwiperSlide, useSwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const items = [
  {
    id: 1,
    img: "/images/placeholders/imagePlaceholder.jpg",
    title: "Bulgaria",
  },
  {
    id: 2,
    img: "/images/placeholders/imagePlaceholder.jpg",
    title: "Bulgaria",
  },
  {
    id: 3,
    img: "/images/placeholders/imagePlaceholder.jpg",
    title: "Bulgaria",
  },
  {
    id: 4,
    img: "/images/placeholders/imagePlaceholder.jpg",
    title: "Bulgaria",
  },
  {
    id: 5,
    img: "/images/placeholders/imagePlaceholder.jpg",
    title: "Bulgaria",
  },
];

export default function GlobalProjectsSwiper() {
  const [isGrabbing, setIsGrabbing] = useState(false);

  return (
    <div
      className={`w-full transition-colors duration-200 ${
        isGrabbing ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <Swiper
        slidesPerView="auto"
        centeredSlides
        loop
        spaceBetween={1}
        slidesOffsetBefore={8}
        slidesOffsetAfter={8}
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 5000, // 5 sec
          disableOnInteraction: false, // keeps autoplay after drag
          pauseOnMouseEnter: true, // 👈 pause autoplay on hover
        }}
        className="w-full"
        onTouchStart={() => setIsGrabbing(true)}
        onTouchEnd={() => setIsGrabbing(false)}
        onSliderFirstMove={() => setIsGrabbing(true)}
        onTransitionEnd={() => setIsGrabbing(false)}
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className="!w-[88%] md:!w-[82%] lg:!w-[72%] xl:!w-[66%]">
            <SlideCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function SlideCard({ item }: { item: any }) {
  const { isActive } = useSwiperSlide();

  return (
    <div
      className={[
        "transition-all duration-300 ease-out flex flex-col items-start gap-[12px]",
        isActive ? "scale-100 opacity-100" : "scale-[0.85]",
      ].join(" ")}
    >
      <div className="relative overflow-hidden">
        <img
          src={item.img}
          alt={item.title}
          className="w-full aspect-[438/365] rounded-[16px] object-cover"
        />
        <div
          className="py-[10px] px-[44px] rounded-[9px] absolute bottom-[64px] right-[-18px]"
          style={{ background: "linear-gradient(91deg, #C6A45A 1.09%, #FFF 188.49%)" }}
        >
          <p className="text-[24px] font-medium">{item.title}</p>
        </div>
      </div>
    </div>
  );
}
