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
      { threshold: 0.5, rootMargin: "0px" }
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

  const [featured, ...rest] = insights;

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
              Editorial
            </div>
            <p className="CormorantGaramond text-[28px] lg:text-[44px] leading-[1.05] tracking-[-0.01em] text-[#0A0A0A]">
              News &amp; <span className="italic">Insights</span>
            </p>
          </div>
          <Link
            to="/news"
            className="Jakarta text-[10px] font-medium tracking-[0.2em] uppercase text-[#888580] hover:text-[#C6A45A] inline-flex items-center gap-[8px] group transition-colors"
          >
            All Stories
            <span className="block w-[24px] group-hover:w-[40px] h-[0.5px] bg-current transition-all duration-300" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.5px_1fr_0.5px_1fr]">
          {/* Featured */}
          <Link
            to={`/news/${featured.slug}`}
            className="group block py-[40px] lg:pr-[36px]"
          >
            <div className="relative overflow-hidden mb-[22px] aspect-[16/9] lg:aspect-[4/5] bg-[#F8F6F2]">
              <img
                loading="lazy"
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
              />
            </div>
            {featured.category && (
              <div className="Jakarta text-[9px] font-medium tracking-[0.18em] uppercase text-[#C6A45A] mb-[9px]">
                {featured.category}
              </div>
            )}
            <p className="CormorantGaramond text-[22px] lg:text-[24px] font-normal text-[#0A0A0A] leading-[1.35] mb-[10px] group-hover:text-[#8C6E32] transition-colors line-clamp-3">
              {featured.title}
            </p>
            {featured.created_at && (
              <p className="Jakarta text-[10px] text-[#888580] tracking-[0.04em]">
                {featured.created_at}
              </p>
            )}
          </Link>

          {rest.map((item, idx) => (
            <React.Fragment key={item.id ?? item.slug ?? idx}>
              <div className="hidden lg:block bg-[#3536351F]" />
              <Link
                to={`/news/${item.slug}`}
                className="group block py-[40px] lg:px-[36px] border-t-[0.5px] lg:border-t-0 border-[#3536351F] first:[&:not(:first-child)]:border-t-0"
              >
                <div className="relative overflow-hidden mb-[22px] aspect-[16/9] bg-[#F8F6F2]">
                  <img
                    loading="lazy"
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
                  />
                </div>
                {item.category && (
                  <div className="Jakarta text-[9px] font-medium tracking-[0.18em] uppercase text-[#C6A45A] mb-[9px]">
                    {item.category}
                  </div>
                )}
                <p className="CormorantGaramond text-[18px] lg:text-[19px] font-normal text-[#0A0A0A] leading-[1.35] mb-[10px] group-hover:text-[#8C6E32] transition-colors line-clamp-3">
                  {item.title}
                </p>
                {item.created_at && (
                  <p className="Jakarta text-[10px] text-[#888580] tracking-[0.04em]">
                    {item.created_at}
                  </p>
                )}
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
