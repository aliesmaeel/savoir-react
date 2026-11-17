import React, { useEffect, useState } from "react";
import useIcons from "~/hooks/imageHooks/useIcons";
import { Link, useLocation } from "react-router";

const CATEGORIES = ["Real Estate", "Design", "Travel", "Lifestyle", "Investment"];
const SECTION_ID = "luxury-portfolio-magazine";
const SECTION_HASH = `#${SECTION_ID}`;

const hasSectionHash = () =>
  typeof window !== "undefined" && window.location.hash === SECTION_HASH;

export default function LuxuryPortfolio() {
  const icon = useIcons();
  const location = useLocation();
  const [activeCat, setActiveCat] = useState("Real Estate");
  const loadCoverEager = hasSectionHash() || location.hash === SECTION_HASH;

  useEffect(() => {
    if (location.hash !== SECTION_HASH && !hasSectionHash()) return;

    const HEADER_OFFSET = 80;
    let cancelled = false;

    const scrollToSection = () => {
      if (cancelled) return false;

      const section = document.getElementById(SECTION_ID);
      if (!section) return false;

      const top =
        section.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
      return true;
    };

    // Retry while images/layout above this section finish shifting the offset.
    const retryMs = [0, 50, 150, 300, 600, 1000, 1600];
    const timers = retryMs.map((ms) => window.setTimeout(scrollToSection, ms));
    const frameId = window.requestAnimationFrame(scrollToSection);
    window.addEventListener("load", scrollToSection);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("load", scrollToSection);
    };
  }, [location.hash, location.pathname]);

  return (
    <section id={SECTION_ID} className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[600px]">
        {/* Left — magazine cover */}
        <div className="relative overflow-hidden bg-[#1A1A18] aspect-[4/5] lg:aspect-auto group">
          <img
            loading={loadCoverEager ? "eager" : "lazy"}
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

              <p
                className="CormorantGaramond text-[26px] lg:text-[34px] font-light leading-[1.2] max-w-[420px]"
                style={{ color: "#FFFFFF" }}
              >
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

          <p
            className="CormorantGaramond text-[28px] lg:text-[44px] font-light leading-[1.05] mb-[20px] lg:mb-[22px]"
            style={{ color: "#FFFFFF" }}
          >
            Luxury Portfolio <span className="italic">Magazine</span>
          </p>

          <p
            className="text-[12px] lg:text-[13px] leading-[1.85] mb-[28px] lg:mb-[36px] max-w-[380px]"
            style={{
              color: "rgba(255,255,255,0.78)",
              fontFamily: "Didot, serif",
            }}
          >
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
                      : "border-white/[0.14] text-white/72 hover:border-[#C6A45A] hover:text-[#C6A45A] hover:bg-[rgba(198,164,90,0.07)]"
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
