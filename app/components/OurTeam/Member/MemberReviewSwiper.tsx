import React, { useState } from "react";
import { Swiper, SwiperSlide, useSwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import useArrow from "~/hooks/imageHooks/useArrow";

import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";

const items = [
  {
    rating: 4.8,
    text: "I have been dealing with Savoir Prive Properties for more than a year now on my multiple properties, and I have no hesitation whatsoever in saying that professionalism, integrity and transparency ar core principles of Savior and they value the clients and their expectations. I found Eva, who is the managing partnts expectats. I found Eva, who is the managing p and their expectats. found Eva, who is the managing partner,",
    author: "Millon Zahino",
    role: "Behavioral Science",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    rating: 5.0,
    text: "I have been dealing with Savoir Prive Properties for more than a year now on my multiple properties, and I have no hesitation whatsoever in saying that professionalism, integrity and transparency ar core principles of Savior and they value the clients and their expectations. I found Eva, who is the managing partnts expectats. I found Eva, who is the managing p and their expectats. found Eva, who is the managing partner,",
    author: "Sarah Johnson",
    role: "Marketing Director",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    rating: 4.7,
    text: "I have been dealing with Savoir Prive Properties for more than a year now on my multiple properties, and I have no hesitation whatsoever in saying that professionalism, integrity and transparency ar core principles of Savior and they value the clients and their expectations. I found Eva, who is the managing partnts expectats. I found Eva, who is the managing p and their expectats. found Eva, who is the managing partner,",
    author: "James Lee",
    role: "Financial Analyst",
    avatar: "https://randomuser.me/api/portraits/men/28.jpg",
  },
  {
    rating: 4.8,
    text: "I have been dealing with Savoir Prive Properties for more than a year now on my multiple properties, and I have no hesitation whatsoever in saying that professionalism, integrity and transparency ar core principles of Savior and they value the clients and their expectations. I found Eva, who is the managing partnts expectats. I found Eva, who is the managing p and their expectats. found Eva, who is the managing partner,",
    author: "Millon Zahino",
    role: "Behavioral Science",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    rating: 5.0,
    text: "I have been dealing with Savoir Prive Properties for more than a year now on my multiple properties, and I have no hesitation whatsoever in saying that professionalism, integrity and transparency ar core principles of Savior and they value the clients and their expectations. I found Eva, who is the managing partnts expectats. I found Eva, who is the managing p and their expectats. found Eva, who is the managing partner,",
    author: "Sarah Johnson",
    role: "Marketing Director",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    rating: 4.7,
    text: "I have been dealing with Savoir Prive Properties for more than a year now on my multiple properties, and I have no hesitation whatsoever in saying that professionalism, integrity and transparency ar core principles of Savior and they value the clients and their expectations. I found Eva, who is the managing partnts expectats. I found Eva, who is the managing p and their expectats. found Eva, who is the managing partner,",
    author: "James Lee",
    role: "Financial Analyst",
    avatar: "https://randomuser.me/api/portraits/men/28.jpg",
  },
];

export default function MemberReviewSwiper() {
  const [isGrabbing, setIsGrabbing] = useState(false);
  const arrow = useArrow();

  return (
    <div className="flex flex-col items-center gap-[37px] w-full mt-[112px]">
      <p className="text-black text-[42px] font-medium">The Reviews</p>
      <div
        className={`w-full transition-colors duration-200  max-w-[1150px] mx-auto ${
          isGrabbing ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <Swiper
          slidesPerView="auto"
          centeredSlides
          loop
          spaceBetween={-60} // overlap
          slidesOffsetBefore={8}
          slidesOffsetAfter={8}
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          className="
    w-full
    [&_.swiper-wrapper]:overflow-visible
    [&_.swiper-slide]:transition-[transform,opacity] [&_.swiper-slide]:duration-300
    [&_.swiper-slide-active]:z-30            /* 💡 center on top */
    [&_.swiper-slide-next]:z-10              /* both sides below */
    [&_.swiper-slide-prev]:z-10
  "
          onTouchStart={() => setIsGrabbing(true)}
          onTouchEnd={() => setIsGrabbing(false)}
          onSliderFirstMove={() => setIsGrabbing(true)}
          onTransitionEnd={() => setIsGrabbing(false)}
        >
          {items.map((item, index) => (
            <SwiperSlide key={index} className="!w-[45%]">
              <SlideCard data={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

function SlideCard({ data }: { data: any }) {
  const { isActive } = useSwiperSlide();
  const icon = useIcons();

  return (
    <div
      className={`relative flex flex-col gap-[12px] transition-all duration-300 aspect-[517/453] backdrop-blur-[60px] rounded-[44px] px-[39px] py-[29px]
      ${isActive ? "scale-100 opacity-100" : "scale-[0.85] opacity-80"}`}
      style={{
        background:
          "linear-gradient(141deg, rgba(53, 54, 53, 0.05) 0.94%, rgba(255, 255, 255, 0.07) 102.98%)",
        boxShadow:
          "49.15px -49.15px 49.15px 0 rgba(53, 54, 53, 0.10) inset, -49.15px 49.15px 49.15px 0 rgba(255, 255, 255, 0.07) inset",
      }}
    >
      <div
        className={`flex flex-col items-start justify-between w-full h-full ${isActive ? "opacity-100" : "opacity-30"}`}
      >
        <div className="flex flex-col items-start gap-[18px]">
          <div className="flex items-center gap-2 ml-[12px]">
            <span className="bg-[#c6a45a] text-white text-[10px] font-medium px-3 py-1 rounded-full flex items-center gap-1 leading-[12px]">
              {data.rating}
              <img src={icon.startWhite} alt="" />
            </span>
          </div>

          <div className="flex flex-col items-start gap-[6px]">
            <img src={icon.quotes} alt="" />
            <p className="text-[#232222] text-[15px] leading-[166.667%] px-[7px]">{data.text}</p>
          </div>
          <hr className="w-[85%] border-2 border-[#3536354D] mx-auto" />
        </div>
        <div className="flex items-center gap-3 mt-6">
          <img
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
