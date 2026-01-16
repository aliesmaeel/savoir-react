import React, { useState } from "react";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import useIcons from "~/hooks/imageHooks/useIcons";
import Button from "~/UI/Button";
import Card from "~/UI/Card";

export default function ListGlobalPartners() {
  const icon = useIcons();
  const [swiperInstances, setSwiperInstances] = useState<{ [key: number]: any }>({});

  const items = [
    {
      icon: icon.leading,
      text: "As a cornerstone of the  global real estate landscape, LeadingRE shapes industry standards,  fosters innovation, and facilitates cross-border collaboration. Bringing together top real estate professionals worldwide, LeadingRE serves as a vital conduit for sharing information and promoting excellence beyond  geographical confines.",
      images: [
        "/images/listwithus/4.jpg",
        "/images/listwithus/5.jpg",
        "/images/listwithus/6.jpg",
        "/images/listwithus/7.jpg",
        // Add more images here as needed
      ],
      link: "https://www.leadingre.com/",
    },
    {
      icon: icon.luxuryPortfolio,
      text: "Luxury Portfolio, the  premium arm of Leading Real Estate Companies of the World®️, empowers  agents to provide exclusive access, insights, and refined guidance to  discerning global clientele. Through our direct association, our  top-performing agents gain access to invaluable information, giving  clients a competitive edge in the market and facilitating connections  with fellow successful Realtors.",
      images: [
        "/images/listwithus/award.jpg",
        // Add more images here as needed
      ],
      link: "https://www.luxuryportfolio.com/",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-[46px] w-full mt-[108px]">
      <p className="text-black text-[20px] lg:text-[42px] font-medium">Why List With Us ?</p>
      <div className="flex flex-col items-start gap-[52px] w-full">
        {items.map((item: any, index: number) => (
          <Card key={index} className="!rounded-[15px] lg:!rounded-[67.5px] w-full group">
            <div className="flex flex-col lg:flex-row items-center gap-[35px] w-full px-[37px] py-[48px] group-even:lg:flex-row-reverse">
              <div className="flex flex-col items-start gap-[24px] w-full">
                <div className="flex flex-col items-start gap-[13px] w-full">
                  <img loading="lazy" src={item.icon} alt="" />
                  <p className="text-black text-[15px] lg:text-[22px] leading-[200%]">
                    {item.text}
                  </p>
                </div>
                <Link to={item.link}>
                  <Button className="!rounded-[4px] !py-[15px] lg:!px-[81px] text-[18px] h-[44px]">
                    visit the site
                  </Button>
                </Link>
              </div>
              <div className="w-full max-w-[539px]">
                <Swiper
                  slidesPerView={1}
                  loop={item.images.length > 1}
                  spaceBetween={0}
                  modules={[Navigation]}
                  onSwiper={(swiper) => setSwiperInstances((prev) => ({ ...prev, [index]: swiper }))}
                  className="w-full"
                >
                  {item.images.map((image: string, imageIndex: number) => (
                    <SwiperSlide key={imageIndex}>
                      <img loading="lazy" src={image} alt="" className="w-full" />
                    </SwiperSlide>
                  ))}
                </Swiper>
                {item.images.length > 1 && (
                  <div className="flex items-center justify-center gap-[44px] w-full mt-6">
                    <button
                      type="button"
                      className="cursor-pointer focus:outline-none"
                      onClick={() => swiperInstances[index]?.slidePrev()}
                      aria-label="Previous slide"
                    >
                      <img loading="lazy" src={icon.propertiesPrev} alt="Previous" />
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer focus:outline-none"
                      onClick={() => swiperInstances[index]?.slideNext()}
                      aria-label="Next slide"
                    >
                      <img loading="lazy" src={icon.propertiesNext} alt="Next" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
