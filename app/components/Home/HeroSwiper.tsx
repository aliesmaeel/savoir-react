import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const IMAGES = [
  "/images/placeholders/hero.webp",
  "/images/placeholders/hero.webp",
  "/images/placeholders/hero.webp",
];

export default function HeroSwiper() {
  return (
    <Swiper
      className="absolute inset-0 -z-10 w-full h-full"
      modules={[Autoplay]}
      autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
      loop
      speed={600}
    >
      {IMAGES.map((src, i) => (
        <SwiperSlide key={i}>
          <img
            loading="lazy"
            src={src}
            alt=""
            className="w-full h-full object-cover pointer-events-none"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
