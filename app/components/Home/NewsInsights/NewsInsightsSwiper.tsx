import React, { useState } from "react";
import { Swiper, SwiperSlide, useSwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const items = [
  {
    id: 1,
    title: "Savoir Properties Attends The Unique Estates’ Casino Royale Annual Gala In Bulgaria",
    img: "/images/placeholders/imagePlaceholder.jpg",
  },
  {
    id: 2,
    title: "Savoir Properties Attends The Unique Estates’ Casino Royale Annual Gala In Bulgaria",
    img: "/images/placeholders/imagePlaceholder.jpg",
  },
  {
    id: 3,
    title: "Savoir Properties Attends The Unique Estates’ Casino Royale Annual Gala In Bulgaria",
    img: "/images/placeholders/imagePlaceholder.jpg",
  },
  {
    id: 4,
    title: "Savoir Properties Attends The Unique Estates’ Casino Royale Annual Gala In Bulgaria",
    img: "/images/placeholders/imagePlaceholder.jpg",
  },
  {
    id: 5,
    title: "Savoir Properties Attends The Unique Estates’ Casino Royale Annual Gala In Bulgaria",
    img: "/images/placeholders/imagePlaceholder.jpg",
  },
];

export default function NewsInsightsSwiper() {
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
      <div className="relative w-full">
        <img
          src={item.img}
          alt={item.title}
          className="w-full aspect-[396/330] rounded-[16px] object-cover"
        />
      </div>

      <p className="text-[#353635] text-[15px] max-w-[353px] leading-[170%] ml-[10px]">
        {item.title}
      </p>
    </div>
  );
}
