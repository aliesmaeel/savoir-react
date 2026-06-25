import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useLoaderData } from "react-router";
import SearchButton from "./SearchButton";
import FilterType, { type TypeOption } from "./FilterType";
import FilterRent, { type RentFilters } from "./FilterRent";
import FilterBedroom, { type BedBathValue } from "./FilterBedroom";
import FilterPriceRange, { type PriceRangeValue } from "./FilterPriceRange";
import SelectSearch from "./SelectSearch";

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

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (query.length) params.set("query", query.join(","));
    if (types.length) params.set("types", types.join(","));

    params.set("interested", rentFilters.interested);
    params.set("status", rentFilters.status);
    params.set("bedrooms", bedBath.bedrooms);
    params.set("bathrooms", bedBath.bathrooms);

    if (price.min !== null) params.set("min", price.min.toString());
    if (price.max !== null) params.set("max", price.max.toString());

    if (location.pathname === "/") {
      navigate(`/search?${params.toString()}`, { preventScrollReset: true });
    } else {
      navigate(
        { search: params.toString() },
        { replace: true, preventScrollReset: true }
      );
    }
  };

  const isHome = location.pathname === "/";

  return (
    <div
      className={
        isHome
          ? "Jakarta search-filter-white-text relative z-20 flex rounded-[17.6px] bg-[#FFFFFF40] py-[12px] backdrop-blur-[13.8px] drop-shadow-[0_41.656px_83.312px_-20.828px_rgba(143,144,188,0.15)] lg:py-[14px] mx-auto w-full max-w-full flex-col gap-[10px] px-3 sm:px-4 lg:w-fit lg:px-[18px]"
          : "Jakarta relative z-20 flex w-full flex-col bg-white shadow-[0_12px_34px_rgba(0,0,0,0.1)] lg:h-[58px] lg:flex-row lg:items-stretch"
      }
      data-aos="fade-up"
    >
      {isHome ? (
        <>
          <div className="flex w-full flex-col gap-[10px] lg:hidden">
            <SelectSearch
              variant="home"
              search={search}
              onChange={setQuery}
              value={query}
            />

            <FilterRent
              value={rentFilters}
              onChange={setRentFilters}
              maxWidthClass="max-w-full"
            />

            <SearchButton onClick={handleSearch} />
          </div>

          <div className="hidden w-fit flex-nowrap items-center gap-[6px] lg:flex">
            <div className="w-[560px] min-w-0 shrink-0">
              <SelectSearch
                variant="home"
                search={search}
                onChange={setQuery}
                value={query}
              />
            </div>

            <div className="flex h-[49.28px] w-[86px] shrink-0 items-center justify-center">
              <FilterRent
                value={rentFilters}
                onChange={setRentFilters}
                maxWidthClass="max-w-[86px]"
              />
            </div>

            <div className="w-fit shrink-0">
              <SearchButton onClick={handleSearch} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid w-full grid-cols-2 border-b border-[#E6E6E6] lg:flex lg:w-auto lg:border-b-0">
            <div className="flex min-h-[54px] items-center border-r border-[#D5D5D5] px-[16px] lg:h-[58px] lg:w-[150px]">
              <FilterRent
                value={rentFilters}
                onChange={setRentFilters}
                placeholder="Select Your Type"
                maxWidthClass="max-w-full"
                variant="listing"
              />
            </div>

            <div className="flex min-h-[54px] items-center border-r border-[#D5D5D5] px-[16px] lg:h-[58px] lg:w-[190px]">
              <FilterType
                options={TYPE_OPTIONS}
                selected={types}
                onChange={setTypes}
                label="Type"
                placeholder="Select Your Type"
                maxWidthClass="max-w-full"
                variant="listing"
              />
            </div>

            <div className="flex min-h-[54px] items-center border-r border-[#D5D5D5] px-[16px] lg:h-[58px] lg:w-[190px]">
              <FilterBedroom
                value={bedBath}
                onChange={setBedBath}
                maxWidthClass="max-w-full"
                variant="listing"
              />
            </div>

            <div className="flex min-h-[54px] items-center px-[16px] lg:h-[58px] lg:w-[220px] lg:border-r lg:border-[#D5D5D5]">
              <FilterPriceRange
                value={price}
                onChange={setPrice}
                onDraftChange={(draft) => setPrice(draft)}
                maxWidthClass="max-w-full"
                variant="listing"
              />
            </div>
          </div>

          <div className="flex min-h-[54px] min-w-0 flex-1 items-center px-[10px] lg:h-[58px] lg:min-w-[320px]">
            <SelectSearch
              variant="listing"
              search={search}
              onChange={setQuery}
              value={query}
              placeholder="Search by location, project or keyword..."
              hideIndicators
            />
          </div>

          <div className="w-full shrink-0 lg:w-[112px]">
            <SearchButton onClick={handleSearch} variant="listing" showIcon={false} />
          </div>
        </>
      )}
    </div>
  );
}
