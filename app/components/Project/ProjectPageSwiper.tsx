import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide, useSwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import useArrow from "~/hooks/imageHooks/useArrow";
import { Link } from "react-router";

import "swiper/css";
import "swiper/css/navigation";

const items = [
  { id: 1, img: "/images/placeholders/project1.webp", title: "Dubai Creek Harbour" },
  { id: 2, img: "/images/placeholders/project2.webp", title: "Dubai Creek Harbour1" },
  { id: 3, img: "/images/placeholders/project3.webp", title: "Dubai Creek Harbour2" },
  { id: 4, img: "/images/placeholders/project4.webp", title: "Dubai Creek Harbour3" },
  { id: 5, img: "/images/placeholders/project5.webp", title: "Dubai Creek Harbour4" },
  { id: 6, img: "/images/placeholders/project6.webp", title: "Dubai Creek Harbour5" },
  { id: 7, img: "/images/placeholders/project7.webp", title: "Dubai Creek Harbour6" },
  { id: 8, img: "/images/placeholders/project8.webp", title: "Dubai Creek Harbour7" },
  { id: 9, img: "/images/placeholders/project9.webp", title: "Dubai Creek Harbour8" },
  { id: 10, img: "/images/placeholders/project1.webp", title: "Dubai Creek Harbour" },
];

export default function ProjectPageSwiper() {
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const arrow = useArrow();

  const mainRef = useRef<SwiperType | null>(null);
  const titlesRef = useRef<SwiperType | null>(null);
  const syncingRef = useRef(false);

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

    // In loop mode, isBeginning/isEnd are always false; keep these if you later disable loop.
    setAtStart(sw.isBeginning);
    setAtEnd(sw.isEnd);
    setCurrentIndex(sw.realIndex);
  };

  const onTitlesChange = (sw: SwiperType) => {
    if (syncingRef.current || !mainRef.current) return;
    if (mainRef.current.realIndex !== sw.realIndex) slideBothTo(sw.realIndex);
  };

  return (
    <div className="flex flex-col items-start gap-[31px] w-full relative mt-[22px]">
      {/* -------- TITLES SWIPER -------- */}
      <div className="w-full p-[17px] border border-[#353635] rounded-[10px] bg-white">
        <Swiper
          modules={[Navigation]}
          onSwiper={(sw) => (titlesRef.current = sw)}
          slidesPerView={9}
          spaceBetween={17}
          watchSlidesProgress
          slideToClickedSlide
          loop
          className="w-full"
          onSlideChange={onTitlesChange}
          onClick={onTitlesChange}
          // optional arrows for titles (using selectors avoids ref timing issues)
          navigation={{ prevEl: ".titles-prev", nextEl: ".titles-next" }}
        >
          {items.map((item, idx) => (
            <SwiperSlide key={`title-${idx}`}>
              <TitleCell image={item.img} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* -------- MAIN IMAGE SWIPER -------- */}
      <div className="grid grid-cols-2 w-full gap-[26px] h-[519px]">
        <div
          className={`w-full transition-colors duration-200 rounded-[8px] overflow-hidden h-full ${
            isGrabbing ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <Swiper
            modules={[Navigation, Autoplay]}
            onSwiper={(sw) => (mainRef.current = sw)}
            slidesPerView="auto"
            centeredSlides
            spaceBetween={26}
            loop
            autoplay={false}
            navigation={{
              prevEl: ".main-prev",
              nextEl: ".main-next",
            }}
            onSlideChange={onMainChange}
            onReachBeginning={() => setAtStart(true)}
            onReachEnd={() => setAtEnd(true)}
            onFromEdge={() => {
              setAtStart(false);
              setAtEnd(false);
            }}
            className="w-full h-full"
            onTouchStart={() => setIsGrabbing(true)}
            onTouchEnd={() => setIsGrabbing(false)}
            onSliderFirstMove={() => setIsGrabbing(true)}
            onTransitionEnd={() => setIsGrabbing(false)}
          >
            {items.map((item, idx) => (
              <SwiperSlide key={idx} className="!w-full">
                <SlideCard item={item} arrow={arrow} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <img
          src="/images/placeholders/project9.webp"
          alt=""
          className="rounded-[8px] w-full h-full object-cover"
        />
      </div>

      <div className="flex items-center justify-between w-full pt-[15px] border-t border-[#26262680]">
        <p className="text-[21px] font-medium">
          <span className="text-[#C6A45A] font-semibold">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>{" "}
          of {String(items.length).padStart(2, "0")}
        </p>

        {/* Custom Navigation Buttons (selectors so they bind on first paint) */}
        <div className="flex items-center gap-[7px]">
          <button
            className={`main-prev flex items-center justify-center w-[43px] rounded-full aspect-square transition-opacity border border-[#353635] ${
              atStart ? "" : "bg-[#353635]"
            }`}
            aria-label="Previous"
          >
            <img
              src={atStart ? arrow.longBlack : arrow.longWhite}
              alt="prev"
              className="w-[22px] h-[22px] rotate-180"
            />
          </button>

          <button
            className={`main-next flex items-center justify-center w-[43px] rounded-full aspect-square transition-opacity border border-[#353635] ${
              atEnd ? "" : "bg-[#353635]"
            }`}
            aria-label="Next"
          >
            <img
              src={atEnd ? arrow.longBlack : arrow.longWhite}
              alt="next"
              className="w-[22px] h-[22px]"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Presentational pieces ---------- */

function SlideCard({ item, arrow }: { item: any; arrow: ReturnType<typeof useArrow> }) {
  const { isActive } = useSwiperSlide();
  return (
    <div className="h-full">
      <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
    </div>
  );
}

function TitleCell({ image }: { image: string }) {
  const { isActive } = useSwiperSlide();
  return (
    <div className="cursor-pointer">
      <img
        src={image}
        alt=""
        className={`aspect-[128/83] object-cover rounded-[7px] transition-all duration-300 ${
          isActive ? "brightness-100" : "brightness-50"
        }`}
      />
    </div>
  );
}
