import React, { useState, useRef, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";

const SORT_FIELD_MAP: { [key: string]: string } = {
  Name: "title_en",
  Title: "title",
  Date: "updated_at",
  Price: "price",
};

const SORT_FIELD_REVERSE_MAP: { [key: string]: string } = {
  title_en: "Name",
  title: "Title",
  updated_at: "Date",
  price: "Price",
};

type Props = {
  items?: string[];
};

export default function SearchSortBy({ items = ["Name", "Date", "Price"] }: Props) {
  const icon = useIcons();
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const sortField = params.get("sort_field") || "title_en";
  const sortOrder = params.get("sort_order") || "desc";

  const selectedFieldName = SORT_FIELD_REVERSE_MAP[sortField];
  const selected = items.includes(selectedFieldName) ? selectedFieldName : items[0];

  useEffect(() => {
    const currentFieldName = SORT_FIELD_REVERSE_MAP[sortField];

    if (currentFieldName && !items.includes(currentFieldName)) {
      const defaultField = SORT_FIELD_MAP[items[0]];
      const currentParams = new URLSearchParams(location.search);
      currentParams.set("sort_field", defaultField);
      navigate(
        { search: currentParams.toString() },
        { replace: true, preventScrollReset: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortField, items.join(",")]);

  const handleSelect = (item: string) => {
    const fieldName = SORT_FIELD_MAP[item];
    const currentParams = new URLSearchParams(location.search);

    if (fieldName === sortField) {
      const newOrder = sortOrder === "asc" ? "desc" : "asc";
      currentParams.set("sort_order", newOrder);
    } else {
      currentParams.set("sort_field", fieldName);
      currentParams.set("sort_order", "desc");
    }

    navigate(
      { search: currentParams.toString() },
      { replace: true, preventScrollReset: true }
    );
    setOpen(false);
  };

  const handleToggleOrder = () => {
    const currentParams = new URLSearchParams(location.search);
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    currentParams.set("sort_order", newOrder);
    navigate(
      { search: currentParams.toString() },
      { replace: true, preventScrollReset: true }
    );
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative shrink-0" ref={wrapperRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between gap-[18px] rounded-[8px] border border-white/85 bg-white p-[9px] shadow-[0_10px_24px_rgba(0,0,0,0.08)] lg:h-[44px] lg:min-w-[204px] lg:gap-[18px] lg:px-[11px] lg:py-[9px]"
      >
        <div className="flex min-w-0 items-center gap-[2px] lg:gap-[7px]">
          <span
            onClick={(e) => {
              e.stopPropagation();
              handleToggleOrder();
            }}
            className="flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center rounded-[4px] bg-[#2B2B2B] transition-colors duration-300 hover:bg-[#242424] lg:h-[22px] lg:w-[22px]"
            aria-label={`Sort order: ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
          >
            <img
              loading="lazy"
              src={icon.sortOrder}
              alt=""
              className="w-[11px] brightness-0 invert lg:w-[13px]"
            />
          </span>

          <hr className="h-[9px] w-[1px] shrink-0 border-0 bg-[#2B2B2B] lg:h-[16px]" />

          <p className="truncate text-[12px] font-bold text-[#111111] lg:text-[14px]">
            Sort by : {selected}
          </p>
        </div>

        <div
          className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#2B2B2B] text-[13px] font-bold leading-none text-white shadow-[0_4px_10px_rgba(43,43,43,0.18)] duration-100 lg:h-[24px] lg:w-[24px] lg:text-[12px] ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          v
        </div>
      </button>

      {open && (
        <div className="absolute top-[42px] z-50 flex w-full flex-col items-start gap-[5px] rounded-[8px] border border-white/85 bg-white p-[6px] shadow-[0_18px_36px_rgba(0,0,0,0.12)] lg:top-[50px] lg:gap-[7px] lg:p-[10px]">
          {items.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(item)}
              className="flex w-full rounded-[5px] p-[5px] text-left hover:bg-[#f2f2f2]"
            >
              <p className="text-[12px] font-bold text-[#111111] lg:text-[14px]">
                {item}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}