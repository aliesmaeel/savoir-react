import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";
import SearchSortBy from "./SearchSortBy";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";
// Local map for type codes -> labels (same options used in FilterType)
const TYPE_LABEL: Record<string, string> = {
  AP: "Apartment",
  BU: "Bulk Units",
  BW: "Bungalow",
  CD: "Compound",
  DX: "Duplex",
  FA: "Factory",
  FM: "Farm",
  FF: "Full Floor",
  HA: "Hotel Apartment",
  HF: "Half Floor",
  LC: "Labor Camp",
  LP: "Land/Plot",
  OF: "Office Space",
  BC: "Business Centre",
  PH: "Penthouse",
  RE: "Retail",
  RT: "Restaurant",
  SA: "Staff Accommodation",
  SH: "Shop",
  SR: "Showroom",
  CW: "Co-working Space",
  ST: "Storage",
  TH: "Townhouse",
  VH: "Villa/House",
  WB: "Whole Building",
  WH: "Warehouse",
  VI: "Villa",
};

function formatCountLabel(v: string | null) {
  if (!v || v === "Any") return null;
  if (v === "Studio") return "Studio";
  return /^\d+$/.test(v) ? v : null;
}

export default function SearchFIlterItems() {
  const icon = useIcons();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // Read current values
  const types = (params.get("types") || "").split(",").filter(Boolean);
  const typeCode = types[0] || null;
  const typeLabel = typeCode ? (TYPE_LABEL[typeCode] ?? typeCode) : null;

  const min = params.get("min");
  const max = params.get("max");
  const hasPrice = !!(min || max);

  const bedrooms = params.get("bedrooms") || "Any";
  const bathrooms = params.get("bathrooms") || "Any";
  const bedCount = formatCountLabel(bedrooms);
  const bathCount = formatCountLabel(bathrooms);

  const interested = params.get("interested") || "Buy";
  const status = params.get("status") || "All";

  // Helpers
  const updateParams = (updater: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams(location.search);
    updater(p);
    navigate({ search: p.toString() }, { replace: true });
  };

  const clearType = () => updateParams((p) => p.delete("types"));
  const clearPrice = () =>
    updateParams((p) => {
      p.delete("min");
      p.delete("max");
    });
  const clearBedrooms = () =>
    updateParams((p) => {
      p.set("bedrooms", "Any");
    });
  const clearBathrooms = () =>
    updateParams((p) => {
      p.set("bathrooms", "Any");
    });
  const clearInterested = () =>
    updateParams((p) => {
      p.set("interested", "Buy");
    });
  const clearStatus = () =>
    updateParams((p) => {
      p.set("status", "All");
    });
  const clearQuery = () => updateParams((p) => p.delete("query"));

  const resetAll = () =>
    updateParams((p) => {
      p.delete("types");
      p.delete("query");
      p.delete("min");
      p.delete("max");
      p.set("interested", "Buy");
      p.set("status", "All");
      p.set("bedrooms", "Any");
      p.set("bathrooms", "Any");
    });

  // Build active chips only for filters that deviate from defaults
  const items: Array<{
    key: string;
    icon: string;
    label: string;
    onClear: () => void;
  }> = [];

  if (typeLabel) {
    items.push({
      key: "type",
      icon: icon.searchType,
      label: typeLabel,
      onClear: clearType,
    });
  }

  if (hasPrice) {
    const priceLabel = min && max ? `${min}-${max}` : min ? `${min}+` : `0-${max}`;
    items.push({
      key: "price",
      icon: icon.searchPriceRange,
      label: priceLabel,
      onClear: clearPrice,
    });
  }

  if (bedCount) {
    items.push({
      key: "bedrooms",
      icon: icon.searchBedroom,
      label: bedCount === "Studio" ? "Studio" : `${bedCount} bedroom`,
      onClear: clearBedrooms,
    });
  }

  if (bathCount) {
    items.push({
      key: "bathrooms",
      icon: icon.searchBathRoom,
      label: `${bathCount} bathroom`,
      onClear: clearBathrooms,
    });
  }

  // Always show interested filter (Rent or Buy)
  items.push({
    key: "interested",
    icon: icon.searchType,
    label: interested,
    onClear: clearInterested,
  });

  if (status !== "All") {
    items.push({
      key: "status",
      icon: icon.searchType,
      label: status, // Ready or Off-plan
      onClear: clearStatus,
    });
  }

  const queryTerms = (params.get("query") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const [i, q] of queryTerms.entries()) {
    items.push({
      key: `query-${i}`,
      icon: icon.searchType, // use a location/search icon if you have one
      label: q,
      onClear: () =>
        updateParams((p) => {
          const arr = (p.get("query") || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          arr.splice(i, 1);
          if (arr.length) p.set("query", arr.join(","));
          else p.delete("query");
        }),
    });
  }

  if (items.length === 0) return null;

  return (
    <div className="flex w-full flex-col items-start gap-[8px] lg:gap-[16px]">
      <div className="flex w-full flex-wrap items-center justify-between gap-[10px] lg:gap-[17px]">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-[7px] lg:gap-[17px]">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex w-full items-center justify-between rounded-[8px] border border-[#111111] bg-white p-[9px] shadow-[0_10px_24px_rgba(0,0,0,0.08)] lg:h-[52px] lg:w-[168px] lg:p-[13px]"
            >
              <div className="flex items-center gap-[4px] lg:gap-[8px]">
                <img loading="lazy" src={item.icon} alt="" className="w-[9px] brightness-0 lg:w-[17px]" />
                <hr className="border-0 w-[1px] h-[11px] lg:h-[20px] bg-[#111111]" />
                <p className="text-[12px] font-bold text-[#111111] lg:text-[15px]">{item.label}</p>
              </div>
              <button
                onClick={item.onClear}
                aria-label={`clear ${item.key}`}
                className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#111111] text-[12px] font-bold leading-none text-white lg:h-[26px] lg:w-[26px]"
              >
                x
              </button>
            </div>
          ))}
        </div>
        {!isMobile && <div className="ml-auto shrink-0"><SearchSortBy /></div>}
      </div>
     
      <button onClick={resetAll} aria-label="reset all filters">
        <p className="text-[12px] font-semibold underline lg:text-[14px]">Reset all filters</p>
      </button>
    </div>
  );
}
