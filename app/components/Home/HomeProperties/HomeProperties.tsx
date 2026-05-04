import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLoaderData } from "react-router";
import { formatPrice } from "~/utils/formatPrice";

type TabKey = "For Rent" | "For Sale" | "Off Plan";

const TABS: TabKey[] = ["For Rent", "For Sale", "Off Plan"];

const offeringLabel = (t: string | undefined, tab: TabKey) => {
  if (tab === "Off Plan") return "Off Plan";
  if (t === "RS") return "For Sale";
  if (t === "RR") return "For Rent";
  return tab;
};

const offeringShort = (t: string | undefined, tab: TabKey) => {
  if (tab === "Off Plan") return "Off Plan";
  if (t === "RS") return "Sale";
  if (t === "RR") return "Rent";
  return tab;
};

const formatLocation = (p: any) =>
  [p?.subcommunity, p?.community, p?.city].filter(Boolean).join(", ");

export default function HomeProperties() {
  const { home } = useLoaderData() as { home: any };
  const [tab, setTab] = useState<TabKey>("For Rent");
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const featured = home?.featured_properties ?? {};

  const properties: any[] = useMemo(() => {
    if (tab === "For Rent") return featured.RR ?? [];
    if (tab === "For Sale") return featured.RS ?? [];
    return featured.off_plan ?? [];
  }, [tab, featured]);

  useEffect(() => {
    setActiveIdx(0);
  }, [tab]);

  const hero = properties[activeIdx];
  const totalCount = properties.length;
  const dotCount = Math.min(totalCount, 4);

  return (
    <section
      ref={containerRef}
      className={`w-full bg-white transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-[200px]"
      }`}
    >
      <div className="flex flex-col w-full">
          {/* Header */}
          <div className="max-w-[1280px] mx-auto w-full flex flex-col lg:flex-row lg:items-end justify-between gap-[20px] px-[24px] lg:px-[52px] pt-[36px] lg:pt-[64px] pb-[24px] lg:pb-[32px]">
            <div>
              <div className="Jakarta text-[10px] font-medium tracking-[0.22em] uppercase text-[#C6A45A] mb-[10px]">
                In the Spotlight
              </div>
              <p className="CormorantGaramond text-[28px] lg:text-[44px] leading-[1.05] tracking-[-0.01em] text-[#0A0A0A]">
                Savoir’s <span className="italic">Collection</span>
              </p>
            </div>
            <div className="flex items-center gap-[16px] lg:gap-[24px] flex-wrap">
              <div className="flex gap-[8px]">
                {TABS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`Jakarta text-[11px] font-normal tracking-[0.06em] border-[0.5px] px-[16px] lg:px-[20px] py-[7px] rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      tab === t
                        ? "bg-[#0A0A0A] border-[#0A0A0A] text-white"
                        : "bg-transparent border-[#3536351F] text-[#888580] hover:border-[#C6A45A] hover:text-[#C6A45A]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <Link
                to="/search"
                className="Jakarta text-[10px] font-medium tracking-[0.2em] uppercase text-[#888580] hover:text-[#C6A45A] inline-flex items-center gap-[8px] group transition-colors"
              >
                View All
                <span className="block w-[24px] group-hover:w-[40px] h-[0.5px] bg-current transition-all duration-300" />
              </Link>
            </div>
          </div>

          {/* Spotlight body */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] lg:h-[620px] border-y-[0.5px] border-[#3536351F]">
            {/* Hero */}
            {hero ? (
              <Link
                to={`/project/${hero.slug}`}
                className="relative overflow-hidden cursor-pointer group block aspect-[4/3] lg:aspect-auto"
              >
                <img
                  loading="lazy"
                  src={hero.photo}
                  alt={hero.title_en}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.88)] via-[rgba(10,10,10,0.35)] to-[rgba(10,10,10,0.05)]" />
                <div className="absolute bottom-0 left-0 right-0 px-[24px] lg:px-[40px] py-[28px] lg:py-[36px] z-[1]">
                  <div className="flex flex-wrap gap-[8px] mb-[16px]">
                    {hero.property_type && (
                      <span className="Jakarta text-[9px] font-medium tracking-[0.18em] uppercase border-[0.5px] border-[#C6A45A] text-[#E0C98A] px-[12px] py-[4px]">
                        {hero.property_type}
                      </span>
                    )}
                    <span className="Jakarta text-[9px] font-medium tracking-[0.18em] uppercase border-[0.5px] border-white/40 text-white/90 px-[12px] py-[4px]">
                      {offeringLabel(hero.offering_type, tab)}
                    </span>
                    {(hero.community || hero.city) && (
                      <span className="Jakarta text-[9px] font-medium tracking-[0.18em] uppercase border-[0.5px] border-white/40 text-white/90 px-[12px] py-[4px]">
                        {hero.community || hero.city}
                      </span>
                    )}
                  </div>
                  <p className="CormorantGaramond text-[24px] lg:text-[34px] font-light text-white leading-[1.2] mb-[10px] line-clamp-2">
                    {hero.title_en}
                  </p>
                  <p className="Jakarta text-[12px] text-white/55 tracking-[0.06em] mb-[24px] line-clamp-1">
                    {formatLocation(hero)}
                  </p>
                  <span className="inline-flex items-center gap-[12px] group-hover:gap-[18px] transition-all duration-300 Jakarta text-[10px] font-medium tracking-[0.2em] uppercase text-[#E0C98A]">
                    View property
                    <span className="block w-[28px] group-hover:w-[44px] h-[0.5px] bg-[#E0C98A] transition-all duration-300" />
                  </span>
                </div>
              </Link>
            ) : (
              <div className="flex items-center justify-center bg-[#F8F6F2] aspect-[4/3] lg:aspect-auto">
                <p className="Jakarta text-[12px] text-[#888580]">
                  No properties available
                </p>
              </div>
            )}

            {/* Cards panel */}
            <div className="flex flex-col lg:overflow-y-auto border-t-[0.5px] lg:border-t-0 lg:border-l-[0.5px] border-[#3536351F] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {properties.map((p, idx) => (
                <button
                  key={p.slug ?? idx}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`grid grid-cols-[110px_1fr] lg:grid-cols-[130px_1fr] border-b-[0.5px] border-[#3536351F] last:border-b-0 cursor-pointer transition-colors duration-200 group text-left flex-shrink-0 ${
                    idx === activeIdx
                      ? "bg-[rgba(198,164,90,0.04)]"
                      : "hover:bg-[#F8F6F2]"
                  }`}
                >
                  <div className="relative overflow-hidden bg-[#F8F6F2] w-[110px] lg:w-[130px] min-h-[140px] lg:min-h-[155px]">
                    <img
                      loading="lazy"
                      src={p.photo}
                      alt={p.title_en}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                    />
                  </div>
                  <div className="px-[16px] py-[14px] lg:px-[22px] lg:py-[20px] flex flex-col justify-between gap-[10px] border-l-[0.5px] border-[#3536351F]">
                    <div>
                      <div className="flex flex-wrap gap-[6px] mb-[10px]">
                        {p.property_type && (
                          <span className="Jakarta text-[8px] font-medium tracking-[0.16em] uppercase text-[#8C6E32] border-[0.5px] border-[#C6A45A] px-[8px] py-[3px]">
                            {p.property_type}
                          </span>
                        )}
                        <span className="Jakarta text-[8px] font-medium tracking-[0.16em] uppercase text-[#888580] border-[0.5px] border-[#3536351F] px-[8px] py-[3px]">
                          {offeringShort(p.offering_type, tab)}
                        </span>
                      </div>
                      <p className="CormorantGaramond text-[15px] lg:text-[16px] font-normal text-[#0A0A0A] leading-[1.3] mb-[4px] group-hover:text-[#8C6E32] transition-colors line-clamp-2">
                        {p.title_en}
                      </p>
                      <p className="Jakarta text-[10px] text-[#888580] tracking-[0.03em] mb-[12px] line-clamp-1">
                        {formatLocation(p)}
                      </p>
                      <div className="flex flex-wrap gap-x-[14px] gap-y-[6px]">
                        <div className="flex flex-col gap-[1px]">
                          <span className="Jakarta text-[12px] text-[#0A0A0A]">
                            {p.bedroom ?? "-"}
                          </span>
                          <span className="Jakarta text-[8px] tracking-[0.12em] uppercase text-[#888580]">
                            Beds
                          </span>
                        </div>
                        <div className="flex flex-col gap-[1px]">
                          <span className="Jakarta text-[12px] text-[#0A0A0A]">
                            {p.bathroom ?? "-"}
                          </span>
                          <span className="Jakarta text-[8px] tracking-[0.12em] uppercase text-[#888580]">
                            Baths
                          </span>
                        </div>
                        {p.size && (
                          <div className="flex flex-col gap-[1px]">
                            <span className="Jakarta text-[12px] text-[#0A0A0A]">
                              {p.size}
                            </span>
                            <span className="Jakarta text-[8px] tracking-[0.12em] uppercase text-[#888580]">
                              sq ft
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="CormorantGaramond text-[18px] lg:text-[19px] font-normal text-[#0A0A0A]">
                        {formatPrice(p.price)} {p.currency || "AED"}
                      </span>
                      {p.offering_type === "RR" && (
                        <span className="Jakarta text-[8px] tracking-[0.1em] uppercase text-[#888580] ml-[4px]">
                          / yr
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              {properties.length === 0 && (
                <div className="flex items-center justify-center py-[60px]">
                  <p className="Jakarta text-[12px] text-[#888580]">
                    No properties available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between px-[24px] lg:px-[52px] py-[16px]">
            <p className="Jakarta text-[10px] text-[#888580] tracking-[0.06em]">
              Showing{" "}
              <strong className="text-[#0A0A0A] font-medium">
                {Math.min(totalCount, activeIdx + 1)}
              </strong>{" "}
              of{" "}
              <strong className="text-[#0A0A0A] font-medium">
                {totalCount}
              </strong>{" "}
              curated properties
            </p>
            {dotCount > 0 && (
              <div className="flex gap-[4px]">
                {Array.from({ length: dotCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    aria-label={`Show property ${i + 1}`}
                    className={`w-[6px] h-[6px] rounded-full transition-colors duration-200 cursor-pointer ${
                      i === Math.min(activeIdx, dotCount - 1)
                        ? "bg-[#C6A45A]"
                        : "bg-[#3536351F]"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
      </div>
    </section>
  );
}