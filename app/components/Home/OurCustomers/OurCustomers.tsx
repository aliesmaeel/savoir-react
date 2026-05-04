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
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-[20px] pb-[24px] lg:pb-[40px] border-b-[0.5px] border-[#3536351F]">
          <div>
            <div className="Jakarta text-[10px] font-medium tracking-[0.22em] uppercase text-[#C6A45A] mb-[10px]">
              Client Stories
            </div>
            <p className="CormorantGaramond text-[28px] lg:text-[44px] leading-[1.05] tracking-[-0.01em] text-[#0A0A0A]">
              Our Customers <span className="italic">Love</span>
            </p>
          </div>
          <Link
            to="/contact-us"
            className="Jakarta text-[10px] font-medium tracking-[0.2em] uppercase text-[#888580] hover:text-[#C6A45A] inline-flex items-center gap-[8px] group transition-colors"
          >
            All Reviews
            <span className="block w-[24px] group-hover:w-[40px] h-[0.5px] bg-current transition-all duration-300" />
          </Link>
        </div>

        {/* Testimonials stage */}
        <div className="relative pt-[36px] lg:pt-[72px] pb-[20px] lg:pb-[56px]">
          {/* Ghost quote */}
          <span
            aria-hidden
            className="CormorantGaramond absolute top-[-20px] left-[12px] lg:left-[44px] text-[120px] lg:text-[240px] font-light leading-[1] text-[#F8F6F2] select-none pointer-events-none z-0"
          >
            “
          </span>

          <div className="relative z-[1] border-t-[0.5px] border-[#3536351F]">
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
              spaceBetween={0}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              allowTouchMove
              className="!ease-linear [&_.swiper-wrapper]:!ease-linear"
            >
              {testimonials.map((t, idx) => {
                const rating = Number(t.rating ?? 5);
                return (
                  <SwiperSlide
                    key={t.id ?? idx}
                    className="!h-auto"
                  >
                    <div className="h-full p-[28px] lg:p-[44px] border-r-[0.5px] border-[#3536351F] transition-colors duration-200 hover:bg-[rgba(198,164,90,0.03)]">
                      <span className="block CormorantGaramond text-[40px] lg:text-[52px] leading-[0.6] text-[#C6A45A]/35 font-light mb-[16px] lg:mb-[18px]">
                        “
                      </span>
                      <p className="CormorantGaramond text-[15px] lg:text-[16px] italic font-normal leading-[1.65] text-[#353635] mb-[20px] lg:mb-[24px] line-clamp-6">
                        {t.message}
                      </p>
                      <div className="h-[0.5px] bg-[#3536351F] mb-[16px] lg:mb-[18px]" />
                      <div className="flex items-center gap-[12px]">
                        {t.image && (
                          <img
                            loading="lazy"
                            src={t.image}
                            alt={t.name}
                            className="w-[42px] h-[42px] rounded-full object-cover border-[0.5px] border-[#3536351F] shrink-0"
                          />
                        )}
                        <div>
                          <p className="Jakarta text-[12px] font-medium text-[#0A0A0A]">
                            {t.name}
                          </p>
                          {t.position && (
                            <p className="Jakarta text-[10px] text-[#888580] mt-[2px]">
                              {t.position}
                            </p>
                          )}
                          <div className="flex gap-[3px] mt-[6px]">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                viewBox="0 0 24 24"
                                className={`w-[10px] h-[10px] ${i < rating ? "fill-[#C6A45A]" : "fill-[#3536351F]"}`}
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
