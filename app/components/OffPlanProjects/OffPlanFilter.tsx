import React, { useMemo, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import OffPlanOption from "./OffPlanOption";
import FilterType from "~/layouts/Filter/FilterType";
import SearchButton from "~/layouts/Filter/SearchButton";
import SelectSearch from "~/layouts/Filter/SelectSearch";

export default function OffPlanFilter() {
  const { searchRes, filters } = useLoaderData() as {
    searchRes: any;
    filters: {
      developers: string[];
      completion_date: string | null;
      locations: string[];
      hasActive: boolean;
    };
  };

  // local UI state mirrors URL
  const [developer, setDeveloper] = useState<string[]>(filters.developers ?? []);
  const [date, setDate] = useState<string[]>(
    filters.completion_date ? [filters.completion_date] : []
  );
  const [locations, setLocations] = useState<string[]>(filters.locations ?? []);

  const navigate = useNavigate();
  const location = useLocation();

  const developerOptions = useMemo(
    () => (searchRes.developers || []).map((d: string) => ({ label: d, code: d })),
    [searchRes]
  );
  const dateOptions = useMemo(
    () => (searchRes.completion_dates || []).map((d: string) => ({ label: d, code: d })),
    [searchRes]
  );

  const hasActive =
    (developer?.length ?? 0) > 0 || (date?.length ?? 0) > 0 || (locations?.length ?? 0) > 0;

  const handleSearch = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", "1"); // reset to first page on new search

    // developers
    if (developer.length) url.searchParams.set("developers", developer.join(","));
    else url.searchParams.delete("developers");

    // completion date: single string or remove
    const dateStr = date[0];
    if (dateStr) url.searchParams.set("date", dateStr);
    else url.searchParams.delete("date");

    // locations
    if (locations.length) url.searchParams.set("locations", locations.join(","));
    else url.searchParams.delete("locations");

    navigate(`${location.pathname}?${url.searchParams.toString()}`, { preventScrollReset: true });
  };

  const handleReset = () => {
    setDeveloper([]);
    setDate([]);
    setLocations([]);
    const url = new URL(window.location.href);
    url.searchParams.delete("developers");
    url.searchParams.delete("date");
    url.searchParams.delete("locations");
    url.searchParams.set("page", "1");
    navigate(`${location.pathname}?${url.searchParams.toString()}`, { preventScrollReset: true });
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-[8px] lg:gap-[20px] rounded-[17.6px] bg-[#FFFFFF40] backdrop-blur-[13.8px] drop-shadow-[0_41.656px_83.312px_-20.828px_rgba(143,144,188,0.15)] py-[12px] lg:py-[16.72px] px-[24px] lg:px-[34.32px] w-full relative z-20 max-w-[1226px]">
      {/* Single-select components that keep array API for compatibility */}
      <OffPlanOption
        options={developerOptions}
        selected={developer}
        onChange={setDeveloper}
        label="Developer"
        placeholder="Select Developer"
        maxWidthClass="max-w-[185.68px]"
      />
      <OffPlanOption
        options={dateOptions}
        selected={date}
        onChange={setDate}
        label="Completion Date"
        placeholder="Completion Date"
        maxWidthClass="max-w-[185.68px]"
      />
      <SelectSearch search={searchRes.locations} onChange={setLocations} value={locations} />

      <div className="flex items-center gap-2">
        <SearchButton onClick={handleSearch} />
        {hasActive && (
          <button
            type="button"
            onClick={handleReset}
            className="text-sm underline text-white/90 hover:text-white"
          >
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
}
