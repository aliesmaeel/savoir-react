import React, { useEffect, useRef, useState } from "react";
import { Link, useLoaderData } from "react-router";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";

export default function GlobalProjects() {
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

  const countries: any[] = (home?.countries || []).slice(0, 6);

  if (countries.length === 0) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      className={`w-full bg-[#0A0A0A] transition-all duration-700 ease-out ${
        isVisible || isMobile
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-[200px]"
      }`}
    >
      {/* Header */}
      <div className="max-w-[1280px] mx-auto w-full flex flex-col lg:flex-row lg:items-end justify-between gap-[20px] px-[24px] lg:px-[52px] pt-[36px] lg:pt-[60px] pb-[24px] lg:pb-[48px] border-b-[0.5px] border-white/[0.14]">
        <div>
          <div className="Jakarta text-[10px] font-medium tracking-[0.22em] uppercase text-[#E0C98A] mb-[10px]">
            Worldwide Presence
          </div>
          <p className="CormorantGaramond text-[28px] lg:text-[44px] leading-[1.05] tracking-[-0.01em] text-white">
            <span className="italic">Global</span> Projects
          </p>
        </div>
        <Link
          to="/global-projects"
          className="Jakarta text-[10px] font-medium tracking-[0.2em] uppercase text-white/30 hover:text-[#C6A45A] inline-flex items-center gap-[8px] group transition-colors"
        >
          See All Markets
          <span className="block w-[24px] group-hover:w-[40px] h-[0.5px] bg-current transition-all duration-300" />
        </Link>
      </div>

      {/* Country grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:h-[520px]"
      >
        {countries.map((c, idx) => (
          <Link
            key={c.id ?? c.name ?? idx}
            to={`/global-projects?country=${encodeURIComponent(c.name)}`}
            className="relative overflow-hidden cursor-pointer group block aspect-[3/4] lg:aspect-auto border-r-[0.5px] last:border-r-0 border-white/10"
            style={{ animationDelay: `${idx * 0.06}s` }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
              style={{ backgroundImage: `url('${c.image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.88)] to-[rgba(10,10,10,0.1)] group-hover:from-[rgba(10,10,10,0.92)] group-hover:to-[rgba(10,10,10,0.25)] transition-all duration-400" />
            <div className="absolute bottom-0 left-0 right-0 px-[18px] py-[24px]">
              <p className="CormorantGaramond text-[22px] font-light text-white leading-[1] mb-[8px] capitalize">
                {c.name}
              </p>
              <span className="inline-flex items-center gap-[8px] Jakarta text-[9px] font-medium tracking-[0.2em] uppercase text-[#E0C98A] opacity-0 translate-y-[6px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                Explore
                <span className="block w-[14px] h-[0.5px] bg-[#E0C98A]" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
