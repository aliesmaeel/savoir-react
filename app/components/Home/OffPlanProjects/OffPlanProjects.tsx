import React, { useEffect, useRef, useState } from "react";
import { Link, useLoaderData } from "react-router";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";
import { formatPrice } from "~/utils/formatPrice";

export default function OffPlanProjects() {
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

  const projects: any[] = (home?.offplan_projects || []).slice(0, 5);

  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      className={`w-full bg-[#ffffff00] transition-all duration-700 ease-out ${
        isVisible || isMobile
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-[200px]"
      }`}
    >
      {/* Header */}
      <div className="max-w-[1280px] mx-auto w-full flex flex-col lg:flex-row lg:items-end justify-between gap-[20px] px-[24px] lg:px-[52px] pt-[36px] lg:pt-[64px] pb-[24px] lg:pb-[40px] border-b-[0.5px] border-[#3536351F]">
        <div>
          <div className="Jakarta text-[10px] font-medium tracking-[0.22em] uppercase text-[#C6A45A] mb-[10px]">
            Investment Pipeline
          </div>
          <p className="CormorantGaramond text-[28px] lg:text-[44px] leading-[1.05] tracking-[-0.01em] text-[#0A0A0A]">
            Recent <span className="italic">Off Plan</span> Projects
          </p>
        </div>
        <Link
          to="/off-plan"
          className="Jakarta text-[10px] font-medium tracking-[0.2em] uppercase text-[#888580] hover:text-[#C6A45A] inline-flex items-center gap-[8px] group transition-colors"
        >
          All Projects
          <span className="block w-[24px] group-hover:w-[40px] h-[0.5px] bg-current transition-all duration-300" />
        </Link>
      </div>

      {/* Grid */}
      <div className="max-w-[1280px] mx-auto w-full px-[24px] lg:px-[52px] py-[40px] lg:py-[60px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 border-t-[0.5px] border-l-[0.5px] border-[#3536351F]">
          {projects.map((p, idx) => {
            const slug = p.slug ?? p.link ?? p.id;
            return (
              <Link
                key={p.id ?? idx}
                to={`/off-plan/${slug}`}
                className="relative border-r-[0.5px] border-b-[0.5px] border-[#3536351F] cursor-pointer overflow-hidden bg-white transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.11)] hover:z-[2] group block"
              >
                <div className="relative overflow-hidden aspect-[3/2] bg-[#F8F6F2]">
                  <img
                    loading="lazy"
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.07]"
                  />
                  <span className="absolute top-0 left-0 Jakarta text-[8px] font-medium tracking-[0.14em] uppercase bg-[#C6A45A] text-white px-[12px] py-[5px]">
                    Off Plan
                  </span>
                </div>
                <div className="px-[18px] pt-[18px] pb-[20px]">
                  <p className="CormorantGaramond text-[17px] font-normal text-[#0A0A0A] leading-[1.2] mb-[3px] group-hover:text-[#8C6E32] transition-colors line-clamp-2">
                    {p.title}
                  </p>
                  {(p.developer || p.location) && (
                    <p className="Jakarta text-[10px] text-[#888580] mb-[14px] line-clamp-1">
                      {[p.developer, p.location].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {p.completion_date && (
                    <>
                      <div className="flex justify-between items-center mb-[5px]">
                        <span className="Jakarta text-[9px] tracking-[0.1em] uppercase text-[#888580]">
                          Completion
                        </span>
                        <span className="Jakarta text-[9px] tracking-[0.1em] uppercase text-[#8C6E32] font-medium">
                          {p.completion_date}
                        </span>
                      </div>
                      <div className="h-[1px] bg-[#3536351F] mb-[14px] relative overflow-hidden">
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-[#C6A45A] transition-[width] duration-[1200ms] ease-out"
                          style={{
                            width: isVisible || isMobile ? `${30 + ((idx * 17) % 60)}%` : "0%",
                          }}
                        />
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-end border-t-[0.5px] border-[#3536351F] pt-[12px]">
                    {p.starting_price ? (
                      <span className="CormorantGaramond text-[16px] font-normal text-[#0A0A0A]">
                        From {formatPrice(p.starting_price)}
                      </span>
                    ) : (
                      <span className="CormorantGaramond text-[16px] font-normal text-[#0A0A0A]">
                        Inquire
                      </span>
                    )}
                    {p.bedroom_range && (
                      <span className="Jakarta text-[9px] tracking-[0.1em] uppercase text-[#888580]">
                        {p.bedroom_range}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
