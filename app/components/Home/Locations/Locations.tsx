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
          ? "translate-x-0 opacity-100"
          : "-translate-x-[200px] opacity-0"
      }`}
    >
      {/* Header */}
      <div className="mx-auto flex w-full max-w-[1280px] flex-col justify-between gap-[20px] border-b-[0.5px] border-[#35363540] px-[24px] pb-[24px] pt-[36px] lg:flex-row lg:items-end lg:px-[52px] lg:pb-[40px] lg:pt-[64px]">
        <div>
          <div className="Jakarta mb-[10px] text-[10px] font-medium uppercase tracking-[0.22em] text-[#C6A45A]">
            Location Intelligence
          </div>

          <p className="CormorantGaramond text-[28px] leading-[1.05] text-[#0A0A0A] lg:text-[44px]">
            Explore <span className="italic">Popular</span> Areas
          </p>
        </div>

        <Link
          to="/popular-areas"
          className="Jakarta group inline-flex items-center gap-[8px] text-[10px] font-medium uppercase tracking-[0.2em] text-[#4B4840] transition-colors hover:text-[#C6A45A]"
        >
          View Map
          <span className="block h-[0.5px] w-[24px] bg-current transition-all duration-300 group-hover:w-[40px]" />
        </Link>
      </div>

      {/* Cinematic slider */}
      <div className="relative h-[420px] overflow-hidden bg-[#0A0A0A] lg:h-[580px]">
        {areas.map((a, idx) => {
          const { first, rest } = splitName(a.name || a.title);
          const isActive = idx === activeIdx;

          return (
            <div
              key={a.id ?? a.slug ?? idx}
              className={`absolute inset-0 transition-opacity duration-[800ms] ease-out ${
                isActive
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] ease-out"
                style={{
                  backgroundImage: `url('${a.image}')`,
                  transform: isActive ? "scale(1)" : "scale(1.04)",
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.84)] via-[rgba(10,10,10,0.34)] to-[rgba(10,10,10,0.08)]" />

              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-[16px] px-[24px] py-[32px] lg:px-[64px] lg:py-[52px]">
                <Link
                  to={`/popular-areas/${a.slug}`}
                  className="transition-opacity hover:opacity-80"
                >
                  <p
                    className="CormorantGaramond text-[44px] font-light leading-[0.95] sm:text-[64px] lg:text-[88px]"
                    style={{ color: "#FFFFFF", opacity: 1 }}
                  >
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
                  <div className="shrink-0 text-right">
                    <p
                      className="CormorantGaramond text-[32px] font-light leading-[1] lg:text-[52px]"
                      style={{ color: "#FFFFFF", opacity: 1 }}
                    >
                      {a.count ?? a.properties_count}
                      <span className="text-[20px] text-[#E0C98A] lg:text-[32px]">
                        +
                      </span>
                    </p>

                    <p className="Jakarta mt-[4px] text-[10px] font-medium uppercase tracking-[0.2em] text-white/72">
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
              className="absolute left-[16px] top-1/2 z-10 flex h-[42px] w-[42px] -translate-y-1/2 cursor-pointer items-center justify-center border-[0.5px] border-white/30 bg-[rgba(10,10,10,0.25)] text-[18px] text-white backdrop-blur-[4px] transition-colors hover:border-[#C6A45A] hover:bg-[#C6A45A] lg:left-[28px] lg:h-[52px] lg:w-[52px]"
            >
              ←
            </button>

            <button
              type="button"
              onClick={() => navTo(1)}
              aria-label="Next area"
              className="absolute right-[16px] top-1/2 z-10 flex h-[42px] w-[42px] -translate-y-1/2 cursor-pointer items-center justify-center border-[0.5px] border-white/30 bg-[rgba(10,10,10,0.25)] text-[18px] text-white backdrop-blur-[4px] transition-colors hover:border-[#C6A45A] hover:bg-[#C6A45A] lg:right-[28px] lg:h-[52px] lg:w-[52px]"
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Thumbnail tabs */}
      <div className="flex overflow-x-auto border-b-[0.5px] border-[#35363540] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {areas.map((a, idx) => {
          const isActive = idx === activeIdx;

          return (
            <button
              key={a.id ?? a.slug ?? `tab-${idx}`}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className="relative flex min-w-[140px] flex-1 cursor-pointer flex-col items-center gap-[10px] border-r-[0.5px] border-[#35363540] bg-white p-[16px] transition-colors duration-200 last:border-r-0 hover:bg-white lg:px-[16px] lg:py-[22px]"
            >
              <img
                loading="lazy"
                src={a.image}
                alt={a.name || a.title}
                className="aspect-[3/2] w-full bg-white object-cover transition-transform duration-400 hover:scale-[1.03]"
              />

              <div
                className="CormorantGaramond text-center text-[14px] capitalize leading-[1.2] transition-colors lg:text-[16px]"
                style={{
                  color: isActive ? "#000000" : "#111111",
                  fontWeight: 600,
                  opacity: 1,
                }}
              >
                {a.name || a.title}
              </div>

              {(a.count ?? a.properties_count) != null && (
                <div
                  className="Jakarta text-[9px] tracking-[0.08em]"
                  style={{
                    color: "#111111",
                    fontWeight: 500,
                    opacity: 1,
                  }}
                >
                  {a.count ?? a.properties_count}+ listings
                </div>
              )}

              <span
                className={`absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-[#C6A45A] transition-transform duration-300 ${
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
