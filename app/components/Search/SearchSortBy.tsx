import React, { useState, useRef, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import useArrow from "~/hooks/imageHooks/useArrow";
import useIcons from "~/hooks/imageHooks/useIcons";

const SORT_FIELD_MAP: { [key: string]: string } = {
  Name: "title_en",
  Date: "updated_at",
  Price: "price",
};

const SORT_FIELD_REVERSE_MAP: { [key: string]: string } = {
  title_en: "Name",
  updated_at: "Date",
  price: "Price",
};

export default function SearchSortBy() {
  const icon = useIcons();
  const arrow = useArrow();
  const location = useLocation();
  const navigate = useNavigate();

  const items = ["Name", "Date", "Price"];

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Read current sort params from URL
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const sortField = params.get("sort_field") || "title_en";
  const sortOrder = params.get("sort_order") || "desc";
  
  const selected = SORT_FIELD_REVERSE_MAP[sortField] || "Name";

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
    
    navigate({ search: currentParams.toString() }, { replace: true });
    setOpen(false);
  };

  const handleToggleOrder = () => {
    const currentParams = new URLSearchParams(location.search);
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    currentParams.set("sort_order", newOrder);
    navigate({ search: currentParams.toString() }, { replace: true });
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
        className="flex items-center justify-between gap-[22px] lg:gap-[51px] p-[6px] lg:p-[16px] rounded-[4px] lg:rounded-[10px] bg-[#EEE]"
      >
        <div className="flex items-center gap-[2px] lg:gap-[8px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleOrder();
            }}
            className="cursor-pointer focus:outline-none"
            aria-label={`Sort order: ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
          >
            <img loading="lazy" src={icon.sortOrder} alt="" className="w-[12px] lg:w-[30px]" />
          </button>
          <hr className="border-0 w-[1px] h-[9px] lg:h-[22px] bg-[#262626]" />
          <p className="text-[6px] lg:text-[14px] font-medium">Sort by : {selected}</p>
        </div>
        <div>
          <img
            loading="lazy"
            src={arrow.circleShortGold}
            alt=""
            className={`w-[11px] lg:w-[26px] duration-100 ${open && "rotate-180"}`}
          />
        </div>
      </button>

      {open && (
        <div className="flex flex-col items-start gap-[5px] lg:gap-[10px] p-[6px] lg:p-[16px] rounded-[4px] lg:rounded-[10px] bg-[#EEE] absolute w-full top-[26px] lg:top-[65px] z-10">
          {items.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(item)}
              className="flex p-[5px] rounded-[5px] w-full hover:bg-[#c3c3c3] text-left"
            >
              <p className="text-[6px] lg:text-[14px] font-medium">{item}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
