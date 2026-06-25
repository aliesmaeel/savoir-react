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

  // Read current sort params from URL
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const sortField = params.get("sort_field") || "title_en";
  const sortOrder = params.get("sort_order") || "desc";
  
  // Get selected display name, fallback to first item if field not in available items
  const selectedFieldName = SORT_FIELD_REVERSE_MAP[sortField];
  const selected = items.includes(selectedFieldName) ? selectedFieldName : items[0];
  
  // If selected field is not in available items, update URL to use valid field
  useEffect(() => {
    const currentFieldName = SORT_FIELD_REVERSE_MAP[sortField];
    
    if (currentFieldName && !items.includes(currentFieldName)) {
      const defaultField = SORT_FIELD_MAP[items[0]];
      const currentParams = new URLSearchParams(location.search);
      currentParams.set("sort_field", defaultField);
      navigate({ search: currentParams.toString() }, { replace: true, preventScrollReset: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortField, items.join(",")]);

  const handleSelect = (item: string) => {
    const fieldName = SORT_FIELD_MAP[item];
    const currentParams = new URLSearchParams(location.search);
    
    // If selecting the same field, toggle order; otherwise set to desc
    if (fieldName === sortField) {
      const newOrder = sortOrder === "asc" ? "desc" : "asc";
      currentParams.set("sort_order", newOrder);
    } else {
      currentParams.set("sort_field", fieldName);
      currentParams.set("sort_order", "desc");
    }
    
    navigate({ search: currentParams.toString() }, { replace: true, preventScrollReset: true });
    setOpen(false);
  };

  const handleToggleOrder = () => {
    const currentParams = new URLSearchParams(location.search);
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    currentParams.set("sort_order", newOrder);
    navigate({ search: currentParams.toString() }, { replace: true, preventScrollReset: true });
  };

  // close when clicking outside
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
        className="flex items-center justify-between gap-[18px] rounded-[8px] border border-[#111111] bg-white p-[9px] shadow-[0_10px_24px_rgba(0,0,0,0.08)] lg:h-[52px] lg:min-w-[232px] lg:gap-[28px] lg:p-[13px]"
      >
        <div className="flex items-center gap-[2px] lg:gap-[8px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleOrder();
            }}
            className={`cursor-pointer focus:outline-none rounded-[2px] lg:rounded-[4px] p-[2px] lg:p-[3px] transition-colors ${
              sortOrder === "asc" ? "bg-[#111111]" : ""
            }`}
            aria-label={`Sort order: ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
          >
            <img loading="lazy" src={icon.sortOrder} alt="" className={`w-[12px] lg:w-[24px] ${sortOrder === "asc" ? "brightness-0 invert" : "brightness-0"}`} />
          </button>
          <hr className="border-0 w-[1px] h-[9px] lg:h-[20px] bg-[#111111]" />
          <p className="text-[12px] font-bold text-[#111111] lg:text-[15px]">Sort by : {selected}</p>
        </div>
        <div
          className={`flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#111111] text-[13px] font-bold leading-none text-white duration-100 lg:h-[26px] lg:w-[26px] ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          v
        </div>
      </button>

      {open && (
        <div className="absolute top-[42px] z-50 flex w-full flex-col items-start gap-[5px] rounded-[8px] border border-[#111111] bg-white p-[6px] shadow-[0_18px_36px_rgba(0,0,0,0.12)] lg:top-[58px] lg:gap-[8px] lg:p-[12px]">
          {items.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(item)}
              className="flex w-full rounded-[5px] p-[5px] text-left hover:bg-[#f2f2f2]"
            >
              <p className="text-[12px] font-bold text-[#111111] lg:text-[14px]">{item}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
