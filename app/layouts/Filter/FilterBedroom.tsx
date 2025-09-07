import React, { useEffect, useMemo, useRef, useState } from "react";
import useArrow from "~/hooks/imageHooks/useArrow";

type CountLabel = "Any" | "Studio" | "1" | "2" | "3" | "4" | "5+";

export type BedBathValue = {
  bedrooms: CountLabel;
  bathrooms: CountLabel;
};

type Props = {
  value?: BedBathValue; // controlled (optional)
  onChange?: (next: BedBathValue) => void; // fires on selection
  label?: string;
  placeholder?: string;
  maxWidthClass?: string; // fits your layout width
  showBathrooms?: boolean; // set false to show only bedrooms
};

const DEFAULT_VALUE: BedBathValue = { bedrooms: "Any", bathrooms: "Any" };

const BED_OPTIONS: CountLabel[] = ["Any", "Studio", "1", "2", "3", "4", "5+"];
const BATH_OPTIONS: CountLabel[] = ["Any", "Studio", "1", "2", "3", "4", "5+"];

export default function FilterBedroom({
  value,
  onChange,
  label = "Bedroom",
  placeholder = "Choose bedroom Type",
  maxWidthClass = "max-w-[237.6px]",
  showBathrooms = true,
}: Props) {
  const arrow = useArrow();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Local state (draft) so selection is instant; caller can listen via onChange
  const [draft, setDraft] = useState<BedBathValue>(value ?? DEFAULT_VALUE);

  // Sync when parent changes (if controlled)
  useEffect(() => {
    if (value) setDraft(value);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const setBedrooms = (v: CountLabel) => {
    const next = { ...draft, bedrooms: v };
    setDraft(next);
    onChange?.(next);
  };
  const setBathrooms = (v: CountLabel) => {
    const next = { ...draft, bathrooms: v };
    setDraft(next);
    onChange?.(next);
  };

  const triggerSummary = useMemo(() => {
    const bedText =
      draft.bedrooms === "Any"
        ? "Any"
        : draft.bedrooms === "Studio"
          ? "Studio"
          : `${draft.bedrooms} Beds`;

    if (!showBathrooms) return bedText;

    const bathText =
      draft.bathrooms === "Any"
        ? "Any"
        : draft.bathrooms === "Studio"
          ? "Studio"
          : `${draft.bathrooms} Bath${draft.bathrooms === "1" ? "" : "s"}`;

    return `${bedText} • ${bathText}`;
  }, [draft, showBathrooms]);

  // styles (gold filled vs outline)
  const pillFilled =
    "bg-[#B59B62] text-[16px] text-white font-medium  py-[6px] w-full border border-white rounded-[9px] h-[43px]";
  const pillOutline =
    "bg-transparent text-[16px] text-white font-medium  py-[6px] w-full border border-white rounded-[9px] h-[43px]";

  // item renderer
  const Item = ({
    option,
    active,
    onClick,
  }: {
    option: CountLabel;
    active: boolean;
    onClick: () => void;
  }) => (
    <button type="button" onClick={onClick} className={active ? pillFilled : pillOutline}>
      {option === "Studio"
        ? "Studio"
        : option === "Any"
          ? "Any"
          : `${option} ${option === "1" ? "Bed" : option === "5+" ? "Beds" : "Beds"}`}
    </button>
  );

  const ItemBath = ({
    option,
    active,
    onClick,
  }: {
    option: CountLabel;
    active: boolean;
    onClick: () => void;
  }) => (
    <button type="button" onClick={onClick} className={active ? pillFilled : pillOutline}>
      {option === "Studio"
        ? "Studio"
        : option === "Any"
          ? "Any"
          : `${option} ${option === "1" ? "Bath" : "Baths"}`}
    </button>
  );

  return (
    <div className={`relative w-full ${maxWidthClass}`} ref={wrapperRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex flex-col items-start">
          <p className="text-white text-[15.84px] font-semibold">{label}</p>
          <div className="flex items-center gap-[13.2px]">
            <p className="text-white text-[14.08px] truncate">{triggerSummary || placeholder}</p>
            <img
              src={arrow.smallBoldWhite}
              alt=""
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute flex flex-col items-start gap-[28px]  px-[18px] py-[23px] rounded-[20px] bg-[#4A4A4A] backdrop-blur-[20px] drop-shadow-[0_41.656px_83.312px_-20.828px_rgba(143,144,188,0.15)] w-[382px] top-[160%]">
          {/* Bedrooms */}
          <div className="flex flex-col items-start gap-[12px] w-full">
            <p className="text-white text-[18px] font-semibold">Bedrooms</p>
            <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-1 w-full small-scroll">
              {BED_OPTIONS.map((opt) => (
                <Item
                  key={`bed-${opt}`}
                  option={opt}
                  active={draft.bedrooms === opt}
                  onClick={() => setBedrooms(opt)}
                />
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          {showBathrooms && (
            <>
              <div className="flex flex-col items-start gap-[12px] w-full">
                <p className="text-white text-[18px] font-semibold">Bathrooms</p>
                <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-1 w-full small-scroll">
                  {BATH_OPTIONS.map((opt) => (
                    <ItemBath
                      key={`bath-${opt}`}
                      option={opt}
                      active={draft.bathrooms === opt}
                      onClick={() => setBathrooms(opt)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
