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
      className={`w-full bg-white py-[34px] transition-all duration-700 ease-out lg:py-[72px] ${
        isVisible ? "translate-x-0 opacity-100" : "-translate-x-[200px] opacity-0"
      }`}
    >
      <div className="flex w-full flex-col">
        {/* Header */}
        <div className="mx-auto flex w-full max-w-[1280px] flex-col justify-between gap-[20px] px-[24px] pb-[24px] lg:flex-row lg:items-end lg:px-[52px] lg:pb-[32px]">
          <div>
            <div className="Jakarta mb-[10px] text-[10px] font-medium uppercase tracking-[0.22em] text-[#C6A45A]">
              In the Spotlight
            </div>

            <p className="CormorantGaramond text-[28px] leading-[1.05] text-[#0A0A0A] lg:text-[44px]">
              Savoir's <span className="italic">Collection</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-[16px] lg:gap-[24px]">
            <div className="flex gap-[8px]">
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`Jakarta cursor-pointer whitespace-nowrap rounded-full border-[0.5px] px-[16px] py-[7px] text-[11px] font-semibold tracking-[0.06em] transition-all duration-200 lg:px-[20px] ${
                    tab === t
                      ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                      : "border-[#35363540] bg-transparent text-[#0A0A0A] hover:border-[#C6A45A] hover:text-[#C6A45A]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <Link
              to="/search"
              className="Jakarta group inline-flex items-center gap-[8px] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A] transition-colors hover:text-[#C6A45A]"
            >
              View All
              <span className="block h-[0.5px] w-[24px] bg-current transition-all duration-300 group-hover:w-[40px]" />
            </Link>
          </div>
        </div>

        {/* Spotlight body */}
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 overflow-hidden border-y-[0.5px] border-[#35363540] bg-white shadow-[0_24px_70px_rgba(53,54,53,0.08)] lg:h-[580px] lg:grid-cols-[1.08fr_0.92fr] lg:rounded-[6px] lg:border-[0.5px]">
          {/* Hero */}
          {hero ? (
            <Link
              to={`/project/${hero.slug}`}
              className="group relative block aspect-[4/3] min-h-[420px] cursor-pointer overflow-hidden lg:aspect-auto lg:min-h-0"
            >
              <img
                loading="lazy"
                src={hero.photo}
                alt={hero.title_en}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.9)] via-[rgba(10,10,10,0.42)] to-[rgba(10,10,10,0.06)]" />

              <div className="absolute bottom-0 left-0 right-0 z-[1] px-[24px] py-[28px] lg:px-[40px] lg:py-[36px]">
                <div className="mb-[16px] flex flex-wrap gap-[8px]">
                  {hero.property_type && (
                    <span className="Jakarta border-[0.5px] border-[#C6A45A] px-[12px] py-[4px] text-[9px] font-semibold uppercase tracking-[0.18em] text-[#E0C98A]">
                      {hero.property_type}
                    </span>
                  )}

                  <span className="Jakarta border-[0.5px] border-white/40 px-[12px] py-[4px] text-[9px] font-semibold uppercase tracking-[0.18em] text-white/90">
                    {offeringLabel(hero.offering_type, tab)}
                  </span>

                  {(hero.community || hero.city) && (
                    <span className="Jakarta border-[0.5px] border-white/40 px-[12px] py-[4px] text-[9px] font-semibold uppercase tracking-[0.18em] text-white/90">
                      {hero.community || hero.city}
                    </span>
                  )}
                </div>

                <p
                  className="CormorantGaramond mb-[10px] line-clamp-2 text-[24px] leading-[1.2] lg:text-[34px]"
                  style={{
                    color: "#FFFFFF",
                    fontWeight: 500,
                    opacity: 1,
                  }}
                >
                  {hero.title_en}
                </p>

                <p
                  className="Jakarta mb-[24px] line-clamp-1 text-[12px] tracking-[0.06em]"
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: 500,
                    opacity: 1,
                  }}
                >
                  {formatLocation(hero)}
                </p>

                <span className="Jakarta inline-flex items-center gap-[12px] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E0C98A] transition-all duration-300 group-hover:gap-[18px]">
                  View property
                  <span className="block h-[0.5px] w-[28px] bg-[#E0C98A] transition-all duration-300 group-hover:w-[44px]" />
                </span>
              </div>
            </Link>
          ) : (
            <div className="flex aspect-[4/3] min-h-[420px] items-center justify-center bg-white lg:aspect-auto lg:min-h-0">
              <p className="Jakarta text-[12px] font-medium text-[#0A0A0A]">
                No properties available
              </p>
            </div>
          )}

          {/* Cards panel */}
          <div className="flex flex-col border-t-[0.5px] border-[#35363540] bg-white/95 [scrollbar-width:none] lg:overflow-y-auto lg:border-l-[0.5px] lg:border-t-0 [&::-webkit-scrollbar]:hidden">
            {properties.map((p, idx) => (
              <button
                key={p.slug ?? idx}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`grid flex-shrink-0 cursor-pointer grid-cols-[112px_1fr] border-b-[0.5px] border-[#35363540] text-left transition-colors duration-200 last:border-b-0 lg:grid-cols-[150px_1fr] ${
                  idx === activeIdx
                    ? "bg-white shadow-[inset_3px_0_0_#C6A45A]"
                    : "hover:bg-white"
                } group`}
              >
                <div className="relative min-h-[142px] w-[112px] overflow-hidden bg-white lg:min-h-[165px] lg:w-[150px]">
                  <img
                    loading="lazy"
                    src={p.photo}
                    alt={p.title_en}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                  />
                </div>

                <div className="flex flex-col justify-between gap-[10px] border-l-[0.5px] border-[#35363540] px-[16px] py-[14px] lg:px-[24px] lg:py-[20px]">
                  <div>
                    <div className="mb-[10px] flex flex-wrap gap-[6px]">
                      {p.property_type && (
                        <span className="Jakarta border-[0.5px] border-[#C6A45A] px-[8px] py-[3px] text-[8px] font-semibold uppercase tracking-[0.16em] text-[#8C6E32]">
                          {p.property_type}
                        </span>
                      )}

                      <span className="Jakarta border-[0.5px] border-[#35363540] px-[8px] py-[3px] text-[8px] font-semibold uppercase tracking-[0.16em] text-[#0A0A0A]">
                        {offeringShort(p.offering_type, tab)}
                      </span>
                    </div>

                    <p
                      className="CormorantGaramond mb-[5px] line-clamp-2 text-[16px] leading-[1.32] transition-colors group-hover:text-[#8C6E32] lg:text-[18px]"
                      style={{
                        color: "#000000",
                        fontWeight: 600,
                        opacity: 1,
                      }}
                    >
                      {p.title_en}
                    </p>

                    <p
                      className="Jakarta mb-[12px] line-clamp-1 text-[10px] tracking-[0.03em]"
                      style={{
                        color: "#111111",
                        fontWeight: 500,
                        opacity: 1,
                      }}
                    >
                      {formatLocation(p)}
                    </p>

                    <div className="flex flex-wrap gap-x-[16px] gap-y-[6px]">
                      <div className="flex flex-col gap-[1px]">
                        <span
                          className="Jakarta text-[12px]"
                          style={{
                            color: "#111111",
                            fontWeight: 600,
                            opacity: 1,
                          }}
                        >
                          {p.bedroom ?? "-"}
                        </span>
                        <span
                          className="Jakarta text-[8px] uppercase tracking-[0.12em]"
                          style={{
                            color: "#111111",
                            fontWeight: 600,
                            opacity: 1,
                          }}
                        >
                          Beds
                        </span>
                      </div>

                      <div className="flex flex-col gap-[1px]">
                        <span
                          className="Jakarta text-[12px]"
                          style={{
                            color: "#111111",
                            fontWeight: 600,
                            opacity: 1,
                          }}
                        >
                          {p.bathroom ?? "-"}
                        </span>
                        <span
                          className="Jakarta text-[8px] uppercase tracking-[0.12em]"
                          style={{
                            color: "#111111",
                            fontWeight: 600,
                            opacity: 1,
                          }}
                        >
                          Baths
                        </span>
                      </div>

                      {p.size && (
                        <div className="flex flex-col gap-[1px]">
                          <span
                            className="Jakarta text-[12px]"
                            style={{
                              color: "#111111",
                              fontWeight: 600,
                              opacity: 1,
                            }}
                          >
                            {p.size}
                          </span>
                          <span
                            className="Jakarta text-[8px] uppercase tracking-[0.12em]"
                            style={{
                              color: "#111111",
                              fontWeight: 600,
                              opacity: 1,
                            }}
                          >
                            sq ft
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <span
                      className="CormorantGaramond text-[19px] lg:text-[21px]"
                      style={{
                        color: "#000000",
                        fontWeight: 600,
                        opacity: 1,
                      }}
                    >
                      {formatPrice(p.price)} {p.currency || "AED"}
                    </span>

                    {p.offering_type === "RR" && (
                      <span
                        className="Jakarta ml-[4px] text-[8px] uppercase tracking-[0.1em]"
                        style={{
                          color: "#111111",
                          fontWeight: 600,
                          opacity: 1,
                        }}
                      >
                        / yr
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}

            {properties.length === 0 && (
              <div className="flex items-center justify-center py-[60px]">
                <p className="Jakarta text-[12px] font-medium text-[#0A0A0A]">
                  No properties available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-[24px] pt-[16px] lg:px-[52px]">
          <p className="Jakarta text-[10px] font-medium tracking-[0.06em] text-[#0A0A0A]">
            Showing{" "}
            <strong className="font-semibold text-[#0A0A0A]">
              {Math.min(totalCount, activeIdx + 1)}
            </strong>{" "}
            of{" "}
            <strong className="font-semibold text-[#0A0A0A]">
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
                  className={`h-[6px] w-[6px] cursor-pointer rounded-full transition-colors duration-200 ${
                    i === Math.min(activeIdx, dotCount - 1)
                      ? "bg-[#C6A45A]"
                      : "bg-[#35363540]"
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
