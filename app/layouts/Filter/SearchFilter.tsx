import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useLoaderData } from "react-router";
import SearchButton from "./SearchButton";
import FilterType, { type TypeOption } from "./FilterType";
import FilterRent, { type RentFilters } from "./FilterRent";
import FilterBedroom, { type BedBathValue } from "./FilterBedroom";
import FilterPriceRange, { type PriceRangeValue } from "./FilterPriceRange";
import SelectSearch from "./SelectSearch";

// Allowed options
const TYPE_OPTIONS: TypeOption[] = [
  { code: "AP", label: "Apartment" },
  { code: "BU", label: "Bulk Units" },
  { code: "BW", label: "Bungalow" },
  { code: "CD", label: "Compound" },
  { code: "DX", label: "Duplex" },
  { code: "FA", label: "Factory" },
  { code: "FM", label: "Farm" },
  { code: "FF", label: "Full Floor" },
  { code: "HA", label: "Hotel Apartment" },
  { code: "HF", label: "Half Floor" },
  { code: "LC", label: "Labor Camp" },
  { code: "LP", label: "Land/Plot" },
  { code: "OF", label: "Office Space" },
  { code: "BC", label: "Business Centre" },
  { code: "PH", label: "Penthouse" },
  { code: "RE", label: "Retail" },
  { code: "RT", label: "Restaurant" },
  { code: "SA", label: "Staff Accommodation" },
  { code: "SH", label: "Shop" },
  { code: "SR", label: "Showroom" },
  { code: "CW", label: "Co-working Space" },
  { code: "ST", label: "Storage" },
  { code: "TH", label: "Townhouse" },
  { code: "VH", label: "Villa/House" },
  { code: "WB", label: "Whole Building" },
  { code: "WH", label: "Warehouse" },
  { code: "VI", label: "Villa" },
];

const INTERESTED_VALUES = ["Buy", "Rent"] as const;
const STATUS_VALUES = ["All", "Ready", "Off-plan"] as const;
const COUNT_LABELS = ["Any", "Studio", "1", "2", "3", "4", "5+"] as const;

export default function SearchFilter() {
  const { search } = useLoaderData() as { search: any };
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [rentFilters, setRentFilters] = useState<RentFilters>({
    interested: "Buy",
    status: "All",
  });
  const [bedBath, setBedBath] = useState<BedBathValue>({
    bedrooms: "Any",
    bathrooms: "Any",
  });
  const [price, setPrice] = useState<PriceRangeValue>({
    min: null,
    max: null,
  });

  // Load filters from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setQuery(params.get("query") ? params.get("query")!.split(",") : []);
    setTypes(params.get("types") ? params.get("types")!.split(",") : []);

    const interestedParam = params.get("interested");
    const statusParam = params.get("status");

    setRentFilters({
      interested: INTERESTED_VALUES.includes(interestedParam as any)
        ? (interestedParam as (typeof INTERESTED_VALUES)[number])
        : "Buy",
      status: STATUS_VALUES.includes(statusParam as any)
        ? (statusParam as (typeof STATUS_VALUES)[number])
        : "All",
    });

    const bedroomsParam = params.get("bedrooms");
    const bathroomsParam = params.get("bathrooms");

    setBedBath({
      bedrooms: COUNT_LABELS.includes(bedroomsParam as any)
        ? (bedroomsParam as (typeof COUNT_LABELS)[number])
        : "Any",
      bathrooms: COUNT_LABELS.includes(bathroomsParam as any)
        ? (bathroomsParam as (typeof COUNT_LABELS)[number])
        : "Any",
    });

    setPrice({
      min: params.get("min") ? Number(params.get("min")) : null,
      max: params.get("max") ? Number(params.get("max")) : null,
    });
  }, [location.search]);

  // Handle Search button click
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (query.length) params.set("query", query.join(","));
    if (types.length) params.set("types", types.join(","));

    params.set("interested", rentFilters.interested);
    params.set("status", rentFilters.status);

    params.set("bedrooms", bedBath.bedrooms);
    params.set("bathrooms", bedBath.bathrooms);

    // Always include current price state
    if (price.min !== null) params.set("min", price.min.toString());
    if (price.max !== null) params.set("max", price.max.toString());

    if (location.pathname === "/") {
      // Redirect from home page to /search
      navigate(`/search?${params.toString()}`, { preventScrollReset: true });
    } else {
      // Already on /search, just update URL
      navigate({ search: params.toString() }, { replace: true, preventScrollReset: true });
    }
  };

  const isHome = location.pathname === "/";

  return (
    <div
      className={`relative z-20 flex rounded-[17.6px] bg-[#FFFFFF40] py-[12px] backdrop-blur-[13.8px] drop-shadow-[0_41.656px_83.312px_-20.828px_rgba(143,144,188,0.15)] lg:py-[16.72px] ${
        isHome
          ? "mx-auto w-full max-w-full flex-col gap-[12px] px-3 sm:px-4  lg:w-[70vw] lg:px-[34.32px]"
          : "w-full max-w-[1226px] flex-col items-center justify-end gap-[8px] px-[24px] lg:flex-row lg:gap-[20px] lg:px-[34.32px]"
      }`}
      data-aos="fade-up"
    >
      {isHome ? (
        <>
          {/* Phones & tablets: full width, stacked — avoids cramped 60/40 row */}
          <div className="flex w-full flex-col gap-[12px] lg:hidden">
            <SelectSearch variant="home" search={search} onChange={setQuery} value={query} />
            <FilterRent
              value={rentFilters}
              onChange={setRentFilters}
              maxWidthClass="max-w-full"
            />
            <SearchButton onClick={handleSearch} />
          </div>
          {/* Large screens: 50vw bar, 70% location / 30% filters + search */}
          <div className="hidden w-full flex-nowrap items-center gap-[17.6px] lg:flex lg:gap-[20px]">
            <div className="lg:w-[60%] w-[70%] min-w-0 shrink-0">
              <SelectSearch variant="home" search={search} onChange={setQuery} value={query} />
            </div>
            <div className="flex w-[50%] min-w-0 shrink-0 items-center justify-end gap-[8px] overflow-visible lg:w-[40%]">
              <div className="min-w-0 flex-1 w-[50%] lg:w-[50%]">
                <FilterRent value={rentFilters} onChange={setRentFilters} />
              </div>
              <div className="shrink-0 lg:w-[50%] w-[50%]">
                <SearchButton onClick={handleSearch} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid w-full grid-cols-2 justify-between gap-[17.6px] lg:flex">
            <FilterRent value={rentFilters} onChange={setRentFilters} />
            <FilterType
              options={TYPE_OPTIONS}
              selected={types}
              onChange={setTypes}
              label="Type"
              placeholder="Select Your Type"
              maxWidthClass="max-w-[185.68px]"
            />
            <FilterBedroom value={bedBath} onChange={setBedBath} />
            <FilterPriceRange
              value={price}
              onChange={setPrice}
              onDraftChange={(draft) => setPrice(draft)}
            />
          </div>
          <SelectSearch variant="compact" search={search} onChange={setQuery} value={query} />
          <SearchButton onClick={handleSearch} />
        </>
      )}
    </div>
  );
}
