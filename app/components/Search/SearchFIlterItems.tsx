import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";

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

  const interested = params.get("interested") || "Rent";
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
      p.set("interested", "Rent");
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
      p.set("interested", "Rent");
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

  if (interested !== "Rent") {
    items.push({
      key: "interested",
      icon: icon.searchType,
      label: interested, // Buy
      onClear: clearInterested,
    });
  }

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
    <div className="flex flex-col items-start gap-[9px] lg:gap-[20px] w-full">
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-[7px] lg:gap-[17px] w-full">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between w-full p-[8px] lg:p-[16px] rounded-[4px] lg:rounded-[10px] bg-[#EEE]"
          >
            <div className="flex items-center gap-[4px] lg:gap-[8px]">
              <img loading="lazy" src={item.icon} alt="" className="w-[9px] lg:w-[19px]" />
              <hr className="border-0 w-[1px] h-[11px] lg:h-[22px] bg-[#262626]" />
              <p className="text-[7px] lg:text-[14px] font-medium">{item.label}</p>
            </div>
            <button onClick={item.onClear} aria-label={`clear ${item.key}`}>
              <img
                loading="lazy"
                src={icon.searchCloseButton}
                alt=""
                className="w-[12px] lg:w-[26px]"
              />
            </button>
          </div>
        ))}
      </div>

      <button onClick={resetAll} aria-label="reset all filters">
        <p className="text-[12px] lg:text-[24px] font-medium underline">Reset all filters</p>
      </button>
    </div>
  );
}
