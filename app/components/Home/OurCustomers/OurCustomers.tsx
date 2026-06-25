import React, { useEffect, useRef, useState } from "react";
import { Link, useLoaderData } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";

export default function OurCustomers() {
  const { home } = useLoaderData() as { home: any };
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5, rootMargin: "0px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible, isMobile]);

  const testimonials: any[] = home?.testimonials || [];

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      className={`w-full bg-white transition-all duration-700 ease-out ${
        isVisible || isMobile
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-[200px]"
      }`}
    >
      <div className="max-w-[1280px] mx-auto w-full px-[24px] lg:px-[52px] py-[60px] lg:py-[96px]">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-[20px] pb-[24px] lg:pb-[36px]">
          <div>
            <div className="Jakarta text-[10px] font-medium tracking-[0.22em] uppercase text-[#C6A45A] mb-[10px]">
              Client Stories
            </div>
            <p className="CormorantGaramond text-[28px] lg:text-[44px] leading-[1.05] text-[#0A0A0A]">
              Our Customers <span className="italic">Love</span>
            </p>
          </div>
          <Link
            to="/contact-us"
            className="Jakarta text-[10px] font-medium tracking-[0.2em] uppercase text-[#0A0A0A] hover:text-[#C6A45A] inline-flex items-center gap-[8px] group transition-colors"
          >
            All Reviews
            <span className="block w-[24px] group-hover:w-[40px] h-[0.5px] bg-current transition-all duration-300" />
          </Link>
        </div>

        {/* Testimonials stage */}
        <div className="relative pt-[10px] lg:pt-[18px] pb-[20px] lg:pb-[56px]">
          <div className="relative z-[1]">
            <Swiper
              modules={[Autoplay]}
              loop={testimonials.length > 1}
              autoplay={{
                delay: 1,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              speed={6000}
              slidesPerView={1}
              spaceBetween={28}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 28 },
                1024: { slidesPerView: 3, spaceBetween: 32 },
              }}
              allowTouchMove
              className="!overflow-visible !ease-linear [&_.swiper-wrapper]:!ease-linear"
            >
              {testimonials.map((t, idx) => {
                const rating = Number(t.rating ?? 5);
                return (
                  <SwiperSlide
                    key={t.id ?? idx}
                    className="!h-auto"
                  >
                    <div className="flex h-full min-h-[300px] flex-col rounded-[6px] border-[0.5px] border-[#E8DDC8] bg-white p-[26px] shadow-[0_18px_54px_rgba(53,54,53,0.07)] transition-all duration-300 hover:-translate-y-[3px] hover:bg-white hover:shadow-[0_26px_78px_rgba(53,54,53,0.11)] lg:min-h-[344px] lg:p-[34px]">
                      <span className="block CormorantGaramond text-[38px] lg:text-[48px] leading-[0.6] text-[#B59657] font-light mb-[16px] lg:mb-[18px]">
                        &ldquo;
                      </span>
                      <p className="CormorantGaramond text-[15px] lg:text-[16px] italic font-normal leading-[1.65] text-[#0A0A0A] mb-[22px] lg:mb-[26px] line-clamp-6">
                        {t.message}
                      </p>
                      <div className="mt-auto flex items-center gap-[12px]">
                        {t.image && (
                          <img
                            loading="lazy"
                            src={t.image}
                            alt={t.name}
                            className="w-[42px] h-[42px] rounded-full object-cover border-[0.5px] border-[#C6A45A]/50 shrink-0"
                          />
                        )}
                        <div>
                          <p className="Jakarta text-[12px] font-medium text-[#0A0A0A]">
                            {t.name}
                          </p>
                          {t.position && (
                            <p className="Jakarta text-[10px] text-[#0A0A0A] mt-[2px]">
                              {t.position}
                            </p>
                          )}
                          <div className="flex gap-[3px] mt-[6px]">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                viewBox="0 0 24 24"
                                className={`w-[10px] h-[10px] ${i < rating ? "fill-[#C6A45A]" : "fill-[#6E6A61]"}`}
                              >
                                <polygon points="12,2 14.6,8.4 21.6,9 16.3,13.6 17.9,20.5 12,16.8 6.1,20.5 7.7,13.6 2.4,9 9.4,8.4" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
