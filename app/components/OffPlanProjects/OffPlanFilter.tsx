import React, { useMemo, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import OffPlanOption from "./OffPlanOption";
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
    () => (searchRes.completion_date || []).map((d: string) => ({ label: d, code: d })),
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
    <div className="relative z-20 flex w-full flex-col bg-white shadow-[0_12px_34px_rgba(0,0,0,0.1)] lg:h-[58px] lg:flex-row lg:items-stretch">
      {/* Single-select components that keep array API for compatibility */}
      <div className="grid w-full grid-cols-1 border-b border-[#E6E6E6] sm:grid-cols-2 lg:flex lg:w-auto lg:border-b-0">
        <div className="flex min-h-[54px] items-center border-r border-[#D5D5D5] px-[16px] lg:h-[58px] lg:w-[220px]">
          <OffPlanOption
            options={developerOptions}
            selected={developer}
            onChange={setDeveloper}
            label="Developer"
            placeholder="Select Developer"
            maxWidthClass="max-w-full"
          />
        </div>

        <div className="flex min-h-[54px] items-center border-r border-[#D5D5D5] px-[16px] lg:h-[58px] lg:w-[220px]">
          <OffPlanOption
            options={dateOptions}
            selected={date}
            onChange={setDate}
            label="Completion Date"
            placeholder="Completion Date"
            maxWidthClass="max-w-full"
          />
        </div>
      </div>

      <div className="flex min-h-[54px] min-w-0 flex-1 items-center px-[10px] lg:h-[58px] lg:min-w-[320px]">
        <SelectSearch
          variant="listing"
          search={searchRes.locations}
          onChange={setLocations}
          value={locations}
          placeholder="Search by location or project..."
          hideIndicators
        />
      </div>

      <div className="flex w-full shrink-0 items-stretch lg:w-auto">
        <div className="w-full shrink-0 lg:w-[112px]">
          <SearchButton onClick={handleSearch} variant="listing" showIcon={false} />
        </div>
        {hasActive && (
          <button
            type="button"
            onClick={handleReset}
            className="Jakarta w-full border-t border-[#D5D5D5] px-[14px] text-[12px] font-semibold uppercase tracking-[0.08em] text-[#111111] underline hover:text-[#C6A45A] lg:w-auto lg:border-l lg:border-t-0"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
