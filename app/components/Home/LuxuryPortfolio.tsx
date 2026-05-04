import React, { useEffect, useRef, useState } from "react";
import useIcons from "~/hooks/imageHooks/useIcons";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";
import { Link } from "react-router";

const CATEGORIES = ["Real Estate", "Design", "Travel", "Lifestyle", "Investment"];

export default function LuxuryPortfolio() {
  const icon = useIcons();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCat, setActiveCat] = useState("Real Estate");

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

  return (
    <section
      ref={containerRef}
      className={`w-full transition-all duration-700 ease-out ${
        isVisible || isMobile
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-[200px]"
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[600px]">
        {/* Left — magazine cover */}
        <div className="relative overflow-hidden bg-[#1A1A18] aspect-[4/5] lg:aspect-auto group">
          <img
            loading="lazy"
            src={icon.Magazine}
            alt="Luxury Portfolio Magazine"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(10,10,10,0.75)] to-[rgba(10,10,10,0.2)]" />
          <div className="relative z-[1] h-full flex flex-col justify-between p-[28px] lg:p-[48px]">
            <div className="w-[28px] h-[28px] border-[0.5px] border-white/30 flex items-center justify-center">
              <div className="w-[12px] h-[12px] bg-[#C6A45A]" />
            </div>
            <div>
              <div className="Jakarta text-[9px] font-medium tracking-[0.2em] uppercase text-[#E0C98A] mb-[10px]">
                Biannual Publication
              </div>
              <p className="CormorantGaramond text-[26px] lg:text-[34px] font-light text-white leading-[1.2] max-w-[420px]">
                The World’s Finest Luxury Properties &amp; Lifestyle
              </p>
            </div>
          </div>
        </div>

        {/* Right — copy + categories */}
        <div className="bg-[#0A0A0A] px-[28px] lg:px-[52px] py-[40px] lg:py-[64px] flex flex-col justify-center">
          <div className="Jakarta text-[10px] font-medium tracking-[0.22em] uppercase text-[#E0C98A] mb-[14px]">
            Publication
          </div>
          <p className="CormorantGaramond text-[28px] lg:text-[44px] font-light text-white leading-[1.05] tracking-[-0.01em] mb-[20px] lg:mb-[22px]">
            Luxury Portfolio <span className="italic">Magazine</span>
          </p>
          <p className="Jakarta text-[12px] lg:text-[13px] leading-[1.85] text-white/40 mb-[28px] lg:mb-[36px] max-w-[380px]">
            Published biannually, Luxury Portfolio magazine features the latest luxury
            perspectives on Real Estate, Design, Travel and Lifestyle — crafted for the
            world’s most discerning readers.
          </p>
          <div className="flex flex-wrap gap-[8px] mb-[32px] lg:mb-[44px]">
            {CATEGORIES.map((c) => {
              const on = c === activeCat;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveCat(c)}
                  className={`Jakarta text-[9px] font-medium tracking-[0.16em] uppercase border-[0.5px] px-[14px] lg:px-[16px] py-[7px] cursor-pointer transition-colors ${
                    on
                      ? "border-[#C6A45A] text-[#C6A45A] bg-[rgba(198,164,90,0.07)]"
                      : "border-white/[0.14] text-white/40 hover:border-[#C6A45A] hover:text-[#C6A45A] hover:bg-[rgba(198,164,90,0.07)]"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
          <Link
            to="https://www.luxuryportfolio.com/magazine"
            target="_blank"
            rel="noreferrer"
            className="Jakarta text-[9px] font-medium tracking-[0.22em] uppercase text-[#E0C98A] inline-flex items-center gap-[14px] hover:gap-[22px] transition-all duration-300 group w-fit"
          >
            View All Issues
            <span className="block w-[28px] group-hover:w-[44px] h-[0.5px] bg-[#E0C98A] transition-all duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
