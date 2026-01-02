import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useLoaderData } from "react-router";
import "swiper/css";

const FALLBACK_IMAGE = "/images/placeholders/hero.webp";

export default function HeroSwiper() {
  const { home } = useLoaderData() as { home: any };
  
  const sliders = home?.homepage_sliders || [];
  const images = sliders.length > 0 
    ? sliders.map((slider: any) => slider.image)
    : [FALLBACK_IMAGE];

  return (
    <Swiper
      className="absolute inset-0 -z-10 w-full h-full"
      modules={[Autoplay]}
      autoplay={{ delay: 1000, disableOnInteraction: false, pauseOnMouseEnter: true }}
      loop={images.length > 1}
      speed={600}
    >
      {images.map((src: string, i: number) => (
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
