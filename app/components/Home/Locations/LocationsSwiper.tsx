import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide, useSwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import useArrow from "~/hooks/imageHooks/useArrow";
import { Link } from "react-router";

import "swiper/css";
import "swiper/css/navigation";

const items = [
  { id: 1, img: "/images/placeholders/imagePlaceholder.jpg", title: "Dubai Creek Harbour" },
  { id: 2, img: "/images/placeholders/imagePlaceholder.jpg", title: "Dubai Marina" },
  { id: 3, img: "/images/placeholders/imagePlaceholder.jpg", title: "JBR" },
  { id: 4, img: "/images/placeholders/imagePlaceholder.jpg", title: "Business Bay" },
  { id: 5, img: "/images/placeholders/imagePlaceholder.jpg", title: "Downtown Dubai" },
];

export default function LocationsSwiper() {
  const [isGrabbing, setIsGrabbing] = useState(false);
  const arrow = useArrow();

  const mainRef = useRef<SwiperType | null>(null);
  const titlesRef = useRef<SwiperType | null>(null);
  const syncingRef = useRef(false);

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const slideBothTo = (realIdx: number) => {
    if (!mainRef.current || !titlesRef.current) return;
    syncingRef.current = true;
    mainRef.current.slideToLoop(realIdx, 300, false);
    titlesRef.current.slideToLoop(realIdx, 300, false);
    setTimeout(() => (syncingRef.current = false), 0);
  };

  const onMainChange = (sw: SwiperType) => {
    if (syncingRef.current || !titlesRef.current) return;
    if (titlesRef.current.realIndex !== sw.realIndex) slideBothTo(sw.realIndex);
  };

  const onTitlesChange = (sw: SwiperType) => {
    if (syncingRef.current || !mainRef.current) return;
    if (mainRef.current.realIndex !== sw.realIndex) slideBothTo(sw.realIndex);
  };

  return (
    <div className="flex flex-col items-start gap-[31px] w-full relative">
      {/* Custom Navigation Buttons */}

      <div className="flex items-center gap-[12px] px-[13px] w-full">
        <button ref={prevRef} className="flex items-center justify-center w-[65px] aspect-square">
          <img src={arrow.smallGold} alt="prev" className="w-6 h-6 rotate-180" />
        </button>
        {/* -------- TITLES SWIPER -------- */}
        <Swiper
          onSwiper={(sw) => (titlesRef.current = sw)}
          slidesPerView={2}
          slidesPerGroup={1}
          centeredSlides={false}
          loop
          spaceBetween={24}
          watchSlidesProgress
          slideToClickedSlide
          className="w-full"
          onSlideChange={onTitlesChange}
          onClick={onTitlesChange}
        >
          {items.map((item) => (
            <SwiperSlide key={`title-${item.id}`}>
              <TitleCell title={item.title} />
            </SwiperSlide>
          ))}
        </Swiper>
        <button ref={nextRef} className="flex items-center justify-center w-[65px] aspect-square">
          <img src={arrow.smallGold} alt="next" className="w-6 h-6" />
        </button>
      </div>
      {/* -------- MAIN IMAGE SWIPER -------- */}
      <div
        className={`w-full transition-colors duration-200 ${
          isGrabbing ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <Swiper
          onSwiper={(sw) => (mainRef.current = sw)}
          slidesPerView="auto"
          centeredSlides
          loop
          spaceBetween={-60}
          slidesOffsetBefore={8}
          slidesOffsetAfter={8}
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            // fix refs not ready on init
            // @ts-ignore
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-ignore
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          className="
            w-full
            [&_.swiper-wrapper]:overflow-visible
            [&_.swiper-slide]:transition-[transform,opacity] [&_.swiper-slide]:duration-300
            [&_.swiper-slide-active]:z-30
            [&_.swiper-slide-next]:z-10
            [&_.swiper-slide-prev]:z-10
          "
          onTouchStart={() => setIsGrabbing(true)}
          onTouchEnd={() => setIsGrabbing(false)}
          onSliderFirstMove={() => setIsGrabbing(true)}
          onTransitionEnd={() => setIsGrabbing(false)}
          onSlideChange={onMainChange}
        >
          {items.map((item) => (
            <SwiperSlide key={item.id} className="!w-[76.5%] ">
              <SlideCard item={item} arrow={arrow} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

/* ---------- Presentational pieces ---------- */

function SlideCard({ item, arrow }: { item: any; arrow: ReturnType<typeof useArrow> }) {
  const { isActive } = useSwiperSlide();

  return (
    <div
      className={`relative flex flex-col gap-[12px] transition-all duration-300
      ${isActive ? "scale-100 opacity-100" : "scale-[0.85] opacity-80"}`}
    >
      <div className="relative overflow-hidden rounded-[15px] shadow-lg">
        <img src={item.img} alt={item.title} className="w-full aspect-[549/413] object-cover" />
        <Link
          to="#"
          className="absolute bottom-0 left-0 w-full py-[15px] bg-[#6c645a] flex items-center justify-center gap-[15px]"
        >
          <p className="text-[#C6A45A] text-[20px]">Show more details</p>
          <img src={arrow.veryLongGold} alt="" className="w-[50px] mt-[-5px]" />
        </Link>
      </div>
    </div>
  );
}

function TitleCell({ title }: { title: string }) {
  const { isActive } = useSwiperSlide();
  return (
    <div className="px-1">
      <div className={`select-none text-[21px] text-[#353635] w-full`}>
        <div className="flex flex-col items-start w-fit">
          {title}
          {isActive && (
            <div
              className="w-full h-[2px] mt-[5px]"
              style={{
                background:
                  "linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, #C6A45A 50%, rgba(255, 255, 255, 0) 100%)",
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
}
