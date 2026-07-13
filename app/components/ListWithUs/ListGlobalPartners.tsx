import React, { useState } from "react";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import useIcons from "~/hooks/imageHooks/useIcons";
import Button from "~/UI/Button";
import Card from "~/UI/Card";

type PartnerItem = {
  icon: string;
  iconAlt: string;
  text: string;
  images: string[];
  link: string;
  reverse?: boolean;
};

export default function ListGlobalPartners() {
  const icon = useIcons();
  const [swiperInstances, setSwiperInstances] = useState<{ [key: number]: any }>({});

  const items: PartnerItem[] = [
    {
      icon: icon.leading,
      iconAlt: "LeadingRE",
      text:
        "As a cornerstone of the global real estate landscape, LeadingRE shapes industry standards, fosters innovation, and facilitates cross-border collaboration. Bringing together top real estate professionals worldwide, LeadingRE serves as a vital conduit for sharing information and promoting excellence beyond geographical confines.",
      images: [
        "/images/listwithus/4.jpg",
        "/images/listwithus/5.jpg",
        "/images/listwithus/6.jpg",
      ],
      link: "https://www.leadingre.com/",
      reverse: false,
    },
    {
      icon: icon.luxuryPortfolio,
      iconAlt: "Luxury Portfolio",
      text:
        "Luxury Portfolio, the premium arm of Leading Real Estate Companies of the World, empowers agents to provide exclusive access, insights, and refined guidance to discerning global clientele. Through our direct association, our top-performing agents gain access to invaluable information, giving clients a competitive edge in the market and facilitating connections with fellow successful Realtors.",
      images: ["/images/listwithus/award.webp"],
      link: "https://www.luxuryportfolio.com/",
      reverse: true,
    },
  ];

  return (
    <div className="mt-[82px] flex w-full flex-col items-center gap-[34px] lg:mt-[96px]">
      <div className="flex w-full flex-col items-start gap-[34px] lg:gap-[40px]">
        {items.map((item, index) => (
          <Card
            key={index}
            className="mx-auto w-full !max-w-[1080px] !rounded-[22px] border border-[#e9dfcf] px-[16px] py-[20px] shadow-[0_16px_42px_rgba(17,17,17,0.07)] lg:px-[30px] lg:py-[28px]"
          >
            <div
              className={`grid w-full grid-cols-1 items-center gap-[24px] lg:gap-[34px] ${
                item.reverse
                  ? "lg:grid-cols-[360px_minmax(0,1fr)] lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1"
                  : "lg:grid-cols-[minmax(0,1fr)_360px]"
              }`}
            >
              <div className="flex h-full w-full flex-col items-start justify-center gap-[22px] lg:gap-[24px]">
                <div
                  className="flex w-full items-center border-l-[3px] border-[#111111] px-[14px] py-[12px] lg:px-[18px] lg:py-[15px]"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(17,17,17,0.08) 52%, rgba(255,255,255,0) 100%)",
                  }}
                >
                  <img
                    loading="lazy"
                    src={item.icon}
                    alt={item.iconAlt}
                    className="max-h-[60px] w-auto object-contain"
                  />
                </div>

                <p
                  className="max-w-[780px] text-[15px] leading-[1.82] lg:text-[17px]"
                  style={{
                    color: "#111111",
                    fontWeight: 600,
                    opacity: 1,
                  }}
                >
                  {item.text}
                </p>

                <Link to={item.link}>
                  <Button className="h-[42px] !rounded-[8px] !border-none !bg-[#2B2B2B] !px-[24px] !py-[11px] text-[15px] font-semibold !text-white shadow-[0_12px_26px_rgba(43,43,43,0.16)] hover:!bg-[#242424] lg:!px-[38px] lg:text-[17px]">
                    Visit The Site
                  </Button>
                </Link>
              </div>

              <div
                className={`flex h-full w-full flex-col items-center justify-center ${
                  item.reverse
                    ? "lg:w-[360px] lg:justify-self-start"
                    : "lg:w-[360px] lg:justify-self-end"
                }`}
              >
                {item.images.length > 1 ? (
                  <>
                    <Swiper
                      slidesPerView={1}
                      loop
                      spaceBetween={0}
                      modules={[Navigation]}
                      onSwiper={(swiper) =>
                        setSwiperInstances((prev) => ({
                          ...prev,
                          [index]: swiper,
                        }))
                      }
                      className="w-full overflow-hidden rounded-[18px] shadow-[0_16px_36px_rgba(17,17,17,0.07)]"
                    >
                      {item.images.map((image, imageIndex) => (
                        <SwiperSlide key={imageIndex}>
                          <img
                            loading="eager"
                            src={image}
                            alt=""
                            className="aspect-[576/360] w-full rounded-[18px] object-cover"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    <div className="mt-[16px] flex w-full items-center justify-center gap-[50px]">
                      <button
                        type="button"
                        className="flex h-[72px] w-[72px] cursor-pointer items-center justify-center rounded-full transition-transform duration-200 hover:scale-[1.06] focus:outline-none lg:h-[78px] lg:w-[78px]"
                        onClick={() => swiperInstances[index]?.slidePrev()}
                        aria-label="Previous slide"
                      >
                        <img
                          loading="lazy"
                          src={icon.propertiesPrev}
                          alt="Previous"
                          className="w-[68px] lg:w-[74px]"
                        />
                      </button>

                      <button
                        type="button"
                        className="flex h-[72px] w-[72px] cursor-pointer items-center justify-center rounded-full transition-transform duration-200 hover:scale-[1.06] focus:outline-none lg:h-[78px] lg:w-[78px]"
                        onClick={() => swiperInstances[index]?.slideNext()}
                        aria-label="Next slide"
                      >
                        <img
                          loading="lazy"
                          src={icon.propertiesNext}
                          alt="Next"
                          className="w-[68px] lg:w-[74px]"
                        />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full overflow-hidden rounded-[18px] shadow-[0_16px_36px_rgba(17,17,17,0.07)]">
                    <img
                      loading="eager"
                      src={item.images[0]}
                      alt=""
                      className="aspect-[576/360] w-full rounded-[18px] object-cover"
                    />
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