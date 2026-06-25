import React from "react";
import { Link } from "react-router";
import { formatPrice } from "~/utils/formatPrice";

type props = {
  project: any;
  compact?: boolean;
};

export default function ProjectCard({ project, compact = false }: props) {
  const location = [project.subcommunity, project.community, project.city]
    .filter(Boolean)
    .join(", ");

  const area = formatPrice(project.size);
  const currency = project.currency === "AED" ? "AED" : project.currency || "";

  const status = String(project.status || project.completion_status || "").toLowerCase();
  const isOffPlan = status.includes("off");

  const statusLabel = isOffPlan
    ? "Off-plan"
    : project.offering_type === "RR"
      ? "For RENT"
      : "For SALE";

  const cardClass = compact
    ? "h-full w-full overflow-hidden rounded-[9px] bg-white shadow-[0_5px_16px_rgba(0,0,0,0.14)]"
    : "w-full max-w-[390px] overflow-hidden rounded-[9px] bg-white shadow-[0_5px_16px_rgba(0,0,0,0.14)]";

  const contentClass = compact
    ? "px-[16px] pb-[18px] pt-[16px]"
    : "px-[20px] pb-[23px] pt-[22px]";

  const titleClass = compact
    ? "CormorantGaramond min-h-[56px] text-black text-[18px] font-bold leading-[1.3] line-clamp-2"
    : "CormorantGaramond min-h-[66px] text-black text-[24px] font-bold leading-[1.35] line-clamp-2";

  const locationClass = compact
    ? "Jakarta mt-[4px] truncate text-black text-[14px] font-semibold leading-[1.2]"
    : "Jakarta mt-[5px] truncate text-black text-[17px] font-bold leading-[1.25]";

  const priceClass = compact
    ? "CormorantGaramond mt-[8px] text-black text-[22px] font-semibold leading-none"
    : "CormorantGaramond mt-[10px] text-black text-[30px] font-semibold leading-none";

  const metaClass = compact
    ? "Jakarta mt-[12px] flex items-center gap-[10px] overflow-hidden text-black text-[14px] font-semibold leading-none"
    : "Jakarta mt-[15px] flex items-center gap-[14px] text-black text-[17px] font-bold leading-none";

  const diamondClass = compact
    ? "h-[7px] w-[7px] shrink-0 rotate-45 bg-[#dec7b1]"
    : "h-[8px] w-[8px] shrink-0 rotate-45 bg-[#dec7b1]";

  return (
    <div className={cardClass}>
      <Link to={`/project/${project.slug}`} className="flex h-full w-full flex-col">
        <div className="relative w-full">
          <img
            loading="lazy"
            src={project.photo}
            alt=""
            className="block aspect-[386/238] w-full object-cover"
          />

          <span
            className={`Jakarta absolute left-[14px] top-[14px] rounded-[7px] bg-black text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] ${
              compact ? "px-[11px] py-[6px] text-[12px]" : "px-[13px] py-[7px] text-[14px]"
            } font-semibold leading-none`}
          >
            {statusLabel}
          </span>

          <span
            aria-hidden="true"
            className={`absolute right-[16px] top-[16px] flex items-center justify-center rounded-full bg-white/85 text-black shadow-[0_2px_8px_rgba(0,0,0,0.12)] ${
              compact ? "h-[44px] w-[44px]" : "h-[52px] w-[52px]"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className={compact ? "h-[24px] w-[24px]" : "h-[30px] w-[30px]"}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 0 1 12 6a5 5 0 0 1 7.5 6.6Z" />
            </svg>
          </span>
        </div>

        <div className={contentClass}>
          <p className={titleClass}>{project.title_en}</p>

          <p className={locationClass}>{location}</p>

          <p className={priceClass}>
            {currency} {formatPrice(project.price)}
          </p>

          <div className={metaClass}>
            <span className="whitespace-nowrap">{project.bedroom} Bedroom</span>
            <span className={diamondClass} />
            <span className="whitespace-nowrap">{project.bathroom} Baths</span>
            <span className={diamondClass} />
            <span className="whitespace-nowrap">
              {area ? `${area} sq ft` : project.size}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
