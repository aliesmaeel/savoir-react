import React, { useEffect, useRef, useState } from "react";
import { Link, useLoaderData } from "react-router";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";

export default function NewsInsights() {
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
      {
        threshold: 0.5,
        rootMargin: "0px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible, isMobile]);

  const insights: any[] = (home?.insights || []).slice(0, 3);

  if (insights.length === 0) {
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

          {/* UNCHANGED */}
          <div>
            <div className="Jakarta text-[10px] font-medium tracking-[0.22em] uppercase text-[#C6A45A] mb-[10px]">
              Editorial
            </div>

            <p className="CormorantGaramond text-[28px] lg:text-[44px] leading-[1.05] text-[#0A0A0A]">
              News &amp; <span className="italic">Insights</span>
            </p>
          </div>

          <Link
            to="/news"
            className="Jakarta text-[10px] font-medium tracking-[0.2em] uppercase text-[#0A0A0A] hover:text-[#C6A45A] inline-flex items-center gap-[8px] group transition-colors"
          >
            All Stories

            <span className="block w-[24px] group-hover:w-[40px] h-[0.5px] bg-current transition-all duration-300" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-[22px] md:grid-cols-3 lg:gap-[32px]">

          {insights.map((item, idx) => (
            <Link
              key={item.id ?? item.slug ?? idx}
              to={`/news/${item.slug}`}
              className="group flex h-full flex-col bg-white p-[14px] shadow-[0_22px_64px_rgba(53,54,53,0.08)] transition-transform duration-300 hover:-translate-y-[3px] hover:shadow-[0_28px_82px_rgba(53,54,53,0.12)] lg:p-[18px]"
            >

              {/* IMAGE */}
              <div className="relative mb-[20px] aspect-[16/9] overflow-hidden bg-white">
                <img
                  loading="lazy"
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.05]"
                />
              </div>

              {/* CATEGORY */}
              {item.category && (
                <div
                  className="mb-[9px] text-[9px] font-medium uppercase tracking-[0.18em] text-[#C6A45A]"
                  style={{
                    willChange: "transform, opacity",
                    fontFamily: "Didot, serif",
                  }}
                >
                  {item.category}
                </div>
              )}

              {/* REDUCED TITLE SIZE */}
              <p
                className="mb-[12px] min-h-[68px] text-[16px] leading-[1.30] text-[#0A0A0A] transition-colors line-clamp-3 group-hover:text-[#8C6E32] lg:text-[18px]"
                style={{
                  willChange: "transform, opacity",
                  fontFamily: "Didot, serif",
                }}
              >
                {item.title}
              </p>

              {/* DATE */}
              {item.created_at && (
                <p
                  className="mt-auto text-[10px] tracking-[0.04em] text-[#0A0A0A]"
                  style={{
                    willChange: "transform, opacity",
                    fontFamily: "Didot, serif",
                  }}
                >
                  {item.created_at}
                </p>
              )}
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}
