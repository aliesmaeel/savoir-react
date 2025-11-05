import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useArrow from "~/hooks/imageHooks/useArrow";

export type PriceRangeValue = {
  min: number | null;
  max: number | null;
};

type Props = {
  value?: PriceRangeValue;
  onChange?: (next: PriceRangeValue) => void; // fires on Done
  onDraftChange?: (draft: PriceRangeValue) => void; // fires on input change
  label?: string;
  placeholder?: string;
  currency?: string;
  maxWidthClass?: string;
};

const DEFAULT_VALUE: PriceRangeValue = { min: null, max: null };

export default function FilterPriceRange({
  value,
  onChange,
  onDraftChange,
  label = "Price Range",
  placeholder = "Choose Price Range",
  currency = "AED",
  maxWidthClass = "max-w-[216.48px]",
}: Props) {
  const arrow = useArrow();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [draft, setDraft] = useState<PriceRangeValue>(value ?? { min: null, max: null });

  useEffect(() => {
    if (value) setDraft(value);
  }, [value]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleInputChange = (field: "min" | "max", val: string) => {
    const num = val.replace(/[^\d]/g, "") === "" ? null : Number(val.replace(/[^\d]/g, ""));
    const next = { ...draft, [field]: num };
    setDraft(next);
    onDraftChange?.(next); // fire draft change
  };

  const onDone = () => {
    let { min, max } = draft;
    if (min != null && max != null && min > max) [min, max] = [max, min];
    const next = { min, max };
    setDraft(next);
    onChange?.(next);
    setOpen(false);
  };

  const onReset = () => {
    const next = { min: null, max: null };
    setDraft(next);
    onChange?.(next);
    onDraftChange?.(next);
  };

  // summary string
  const summary = useMemo(() => {
    const { min, max } = draft;
    if (min == null && max == null) return placeholder;
    if (min != null && max != null)
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min != null) return `≥ ${currency} ${min.toLocaleString()}`;
    return `≤ ${currency} ${max!.toLocaleString()}`;
  }, [draft, currency, placeholder]);

  return (
    <div className={`relative w-full ${maxWidthClass}`} ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <div className="flex flex-col items-start">
          <p className="text-white text-[15.84px] font-semibold">{label}</p>
          <div className="flex items-center gap-[13.2px]">
            <p className="text-white text-[14.08px] truncate">{summary}</p>
            <img
              loading="lazy"
              src={arrow.smallBoldWhite}
              alt=""
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
            className="absolute flex flex-col items-start gap-[28px] px-[18px] py-[23px] rounded-[20px] bg-[#4A4A4A] backdrop-blur-[20px] drop-shadow-[0_41.656px_83.312px_-20.828px_rgba(143,144,188,0.15)] w-[307px] lg:w-[382px] top-[160%] left-[-161px] lg:left-auto z-10"
          >
            <div className="flex flex-col items-start gap-[12px]">
              <p className="text-white text-[18px] font-semibold">Price ({currency})</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-white">Min</label>
                  <input
                    inputMode="numeric"
                    pattern="\d*"
                    placeholder="min-price"
                    className="w-full rounded-[10px] border border-[#D7D2C8] bg-white text-[#2B2B2B] px-3 py-2 placeholder-[#B2AC9F] focus:outline-none focus:ring-2 focus:ring-[#B59B62]/50"
                    value={draft.min ?? ""}
                    onChange={(e) => handleInputChange("min", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-white">Max</label>
                  <input
                    inputMode="numeric"
                    pattern="\d*"
                    placeholder="max-price"
                    className="w-full rounded-[10px] border border-[#D7D2C8] bg-white text-[#2B2B2B] px-3 py-2 placeholder-[#B2AC9F] focus:outline-none focus:ring-2 focus:ring-[#B59B62]/50"
                    value={draft.max ?? ""}
                    onChange={(e) => handleInputChange("max", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={onReset}
                className="text-white underline text-[16px] font-medium"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={onDone}
                className="bg-[#B59B62] text-[16px] text-white font-medium border border-white rounded-[9px] w-[110px] h-[34px]"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
