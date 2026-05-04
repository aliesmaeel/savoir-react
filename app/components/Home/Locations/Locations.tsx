import React, { useEffect, useRef, useState } from "react";
import { Link, useLoaderData } from "react-router";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";

export default function Locations() {
  const { home } = useLoaderData() as { home: any };
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

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

  const areas: any[] = (home?.areas || []).slice(0, 6);

  useEffect(() => {
    if (areas.length <= 1) return;
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % areas.length);
    }, 5000);
    return () => clearInterval(id);
  }, [areas.length]);

  if (areas.length === 0) {
    return null;
  }

  const splitName = (name: string) => {
    const parts = (name || "").trim().split(" ");
    if (parts.length <= 1) return { first: name, rest: "" };
    return { first: parts[0], rest: parts.slice(1).join(" ") };
  };

  const navTo = (dir: number) =>
    setActiveIdx((i) => (i + dir + areas.length) % areas.length);

  return (
    <section
      ref={containerRef}
      className={`w-full bg-white transition-all duration-700 ease-out ${
        isVisible || isMobile
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-[200px]"
      }`}
    >
      {/* Header */}
      <div className="max-w-[1280px] mx-auto w-full flex flex-col lg:flex-row lg:items-end justify-between gap-[20px] px-[24px] lg:px-[52px] pt-[36px] lg:pt-[64px] pb-[24px] lg:pb-[40px] border-b-[0.5px] border-[#3536351F]">
        <div>
          <div className="Jakarta text-[10px] font-medium tracking-[0.22em] uppercase text-[#C6A45A] mb-[10px]">
            Location Intelligence
          </div>
          <p className="CormorantGaramond text-[28px] lg:text-[44px] leading-[1.05] tracking-[-0.01em] text-[#0A0A0A]">
            Explore <span className="italic">Popular</span> Areas
          </p>
        </div>
        <Link
          to="/popular-areas"
          className="Jakarta text-[10px] font-medium tracking-[0.2em] uppercase text-[#888580] hover:text-[#C6A45A] inline-flex items-center gap-[8px] group transition-colors"
        >
          View Map
          <span className="block w-[24px] group-hover:w-[40px] h-[0.5px] bg-current transition-all duration-300" />
        </Link>
      </div>

      {/* Cinematic slider */}
      <div className="relative h-[420px] lg:h-[580px] overflow-hidden bg-[#0A0A0A]">
        {areas.map((a, idx) => {
          const { first, rest } = splitName(a.name || a.title);
          const isActive = idx === activeIdx;
          return (
            <div
              key={a.id ?? a.slug ?? idx}
              className={`absolute inset-0 transition-opacity duration-[800ms] ease-out ${
                isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] ease-out"
                style={{
                  backgroundImage: `url('${a.image}')`,
                  transform: isActive ? "scale(1)" : "scale(1.04)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.80)] via-[rgba(10,10,10,0.3)] to-[rgba(10,10,10,0.05)]" />
              <div className="absolute bottom-0 left-0 right-0 px-[24px] lg:px-[64px] py-[32px] lg:py-[52px] flex items-end justify-between gap-[16px]">
                <Link
                  to={`/popular-areas/${a.slug}`}
                  className="hover:opacity-80 transition-opacity"
                >
                  <p className="CormorantGaramond text-[44px] sm:text-[64px] lg:text-[88px] font-light text-white leading-[0.95] tracking-[-0.02em]">
                  {first}
                  {rest && (
                    <>
                    <br />
                    <span className="italic text-[#E0C98A]">{rest}</span>
                    </>
                  )}
                  </p>
                </Link>
                {(a.count ?? a.properties_count) != null && (
                  <div className="text-right shrink-0">
                    <p className="CormorantGaramond text-[32px] lg:text-[52px] font-light text-white leading-[1]">
                      {a.count ?? a.properties_count}
                      <span className="text-[20px] lg:text-[32px] text-[#E0C98A]">+</span>
                    </p>
                    <p className="Jakarta text-[10px] font-medium tracking-[0.2em] uppercase text-white/45 mt-[4px]">
                      Properties Available
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Nav arrows */}
        {areas.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => navTo(-1)}
              aria-label="Previous area"
              className="absolute top-1/2 left-[16px] lg:left-[28px] -translate-y-1/2 w-[42px] h-[42px] lg:w-[52px] lg:h-[52px] border-[0.5px] border-white/30 bg-[rgba(10,10,10,0.25)] backdrop-blur-[4px] flex items-center justify-center text-white text-[18px] hover:bg-[#C6A45A] hover:border-[#C6A45A] transition-colors z-10 cursor-pointer"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => navTo(1)}
              aria-label="Next area"
              className="absolute top-1/2 right-[16px] lg:right-[28px] -translate-y-1/2 w-[42px] h-[42px] lg:w-[52px] lg:h-[52px] border-[0.5px] border-white/30 bg-[rgba(10,10,10,0.25)] backdrop-blur-[4px] flex items-center justify-center text-white text-[18px] hover:bg-[#C6A45A] hover:border-[#C6A45A] transition-colors z-10 cursor-pointer"
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Thumbnail tabs */}
      <div className="flex border-b-[0.5px] border-[#3536351F] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {areas.map((a, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={a.id ?? a.slug ?? `tab-${idx}`}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`relative flex-1 flex flex-col items-center gap-[10px] p-[16px] lg:py-[22px] lg:px-[16px] cursor-pointer border-r-[0.5px] last:border-r-0 border-[#3536351F] transition-colors duration-200 hover:bg-[#F8F6F2] min-w-[140px]`}
            >
              <img
                loading="lazy"
                src={a.image}
                alt={a.name || a.title}
                className="w-full aspect-[3/2] object-cover bg-[#F8F6F2] transition-transform duration-400 hover:scale-[1.03]"
              />
              <div className="CormorantGaramond text-[13px] lg:text-[14px] font-normal text-center leading-[1.2] transition-colors capitalize" style={{ color: isActive ? "#8C6E32" : "#353635" }}>
                {a.name || a.title}
              </div>
              {(a.count ?? a.properties_count) != null && (
                <div className="Jakarta text-[9px] tracking-[0.08em] text-[#888580]">
                  {a.count ?? a.properties_count}+ listings
                </div>
              )}
              <span
                className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#C6A45A] origin-left transition-transform duration-300 ${
                  isActive ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
