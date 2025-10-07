import React, { useState } from "react";
import SearchButton from "./SearchButton";
import useArrow from "~/hooks/imageHooks/useArrow";
import FilterType from "./FilterType";
import FilterRent, { type RentFilters } from "./FilterRent";
import FilterBedroom, { type BedBathValue } from "./FilterBedroom";
import FilterPriceRange, { type PriceRangeValue } from "./FilterPriceRange";

const TYPE_OPTIONS = ["Apartment", "Villa", "Studio", "Duplex", "Penthouse", "Townhouse", "Loft"];

export default function SearchFilter() {
  const arrow = useArrow();

  const [types, setTypes] = useState<string[]>([]);
  const [rentFilters, setRentFilters] = useState<RentFilters>({
    interested: "Rent",
    status: "All",
  });
  const [bedBath, setBedBath] = useState<BedBathValue>({ bedrooms: "Any", bathrooms: "Any" });
  const [price, setPrice] = useState<PriceRangeValue>({ min: null, max: null });

  return (
    <div
      className="flex flex-col lg:flex-row items-center justify-end gap-[8px] lg:gap-0 rounded-[17.6px] bg-[#FFFFFF40] backdrop-blur-[13.8px] drop-shadow-[0_41.656px_83.312px_-20.828px_rgba(143,144,188,0.15)] py-[12px] lg:py-[16.72px] px-[24px] lg:px-[34.32px] w-full relative z-20 max-w-[1226px]"
      data-aos="fade-up"
    >
      <div className="grid grid-cols-2 lg:flex gap-[17.6px] justify-between w-full">
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

        <FilterPriceRange value={price} onChange={setPrice} />
      </div>

      <SearchButton />
    </div>
  );
}
