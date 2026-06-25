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
      <div className="mx-auto flex w-full max-w-[1280px] flex-col justify-between gap-[20px] border-b-[0.5px] border-white/[0.14] px-[24px] pb-[24px] pt-[36px] lg:flex-row lg:items-end lg:px-[52px] lg:pb-[48px] lg:pt-[60px]">
        <div>
          <div className="Jakarta mb-[10px] text-[10px] font-medium uppercase tracking-[0.22em] text-[#E0C98A]">
            Worldwide Presence
          </div>

          <p
            className="CormorantGaramond text-[28px] leading-[1.05] lg:text-[44px]"
            style={{ color: "#FFFFFF", opacity: 1 }}
          >
            <span className="italic">Global</span> Projects
          </p>
        </div>

        <Link
          to="/global-projects"
          className="Jakarta inline-flex items-center gap-[8px] text-[10px] font-medium uppercase tracking-[0.2em] transition-colors group"
          style={{ color: "#FFFFFF", opacity: 1 }}
        >
          See All Markets
          <span className="block h-[0.5px] w-[24px] bg-white transition-all duration-300 group-hover:w-[40px] group-hover:bg-[#C6A45A]" />
        </Link>
      </div>

      {/* Country grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:h-[520px] lg:grid-cols-6">
        {countries.map((c, idx) => (
          <Link
            key={c.id ?? c.name ?? idx}
            to={`/global-projects?country=${encodeURIComponent(c.name)}`}
            className="group relative block aspect-[3/4] cursor-pointer overflow-hidden border-r-[0.5px] border-white/10 last:border-r-0 lg:aspect-auto"
            style={{ animationDelay: `${idx * 0.06}s` }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
              style={{ backgroundImage: `url('${c.image}')` }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.88)] to-[rgba(10,10,10,0.1)] transition-all duration-400 group-hover:from-[rgba(10,10,10,0.92)] group-hover:to-[rgba(10,10,10,0.25)]" />

            <div className="absolute bottom-0 left-0 right-0 px-[18px] py-[24px]">
              <p
                className="CormorantGaramond mb-[8px] text-[22px] font-light capitalize leading-[1]"
                style={{ color: "#FFFFFF", opacity: 1 }}
              >
                {c.name}
              </p>

              <span className="Jakarta inline-flex translate-y-[6px] items-center gap-[8px] text-[9px] font-medium uppercase tracking-[0.2em] text-[#E0C98A] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                Explore
                <span className="block h-[0.5px] w-[14px] bg-[#E0C98A]" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}