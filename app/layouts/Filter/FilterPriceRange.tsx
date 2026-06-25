import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import useArrow from "~/hooks/imageHooks/useArrow";

export type PriceRangeValue = {
  min: number | null;
  max: number | null;
};

type Props = {
  value?: PriceRangeValue;
  onChange?: (next: PriceRangeValue) => void;
  onDraftChange?: (draft: PriceRangeValue) => void;
  label?: string;
  placeholder?: string;
  currency?: string;
  maxWidthClass?: string;
  variant?: "glass" | "listing";
};

const DEFAULT_VALUE: PriceRangeValue = { min: null, max: null };

export default function FilterPriceRange({
  value,
  onChange,
  onDraftChange,
  label = "Price Range",
  placeholder = "Price Range",
  currency = "AED",
  maxWidthClass = "max-w-[216.48px]",
  variant = "glass",
}: Props) {
  const arrow = useArrow();
  const isListing = variant === "listing";
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [draft, setDraft] = useState<PriceRangeValue>(value ?? DEFAULT_VALUE);

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
    const numeric = val.replace(/[^\d]/g, "");
    const num = numeric === "" ? null : Number(numeric);
    const next = { ...draft, [field]: num };

    setDraft(next);
    onDraftChange?.(next);
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

  const summary = useMemo(() => {
    const { min, max } = draft;

    if (min == null && max == null) return placeholder;
    if (min != null && max != null) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    }
    if (min != null) return `>= ${currency} ${min.toLocaleString()}`;

    return `<= ${currency} ${max!.toLocaleString()}`;
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
        <div
          className={
            isListing
              ? "flex w-full items-center justify-between gap-[10px]"
              : "flex flex-col items-start"
          }
        >
          <p
            className={
              isListing
                ? "Jakarta truncate text-[16px] font-semibold leading-none text-black"
                : "text-white text-[15.84px] font-semibold"
            }
          >
            {isListing && summary !== placeholder ? summary : label}
          </p>

          <div
            className={
              isListing
                ? "flex shrink-0 items-center"
                : "flex items-center gap-[13.2px]"
            }
          >
            {!isListing && (
              <p className="text-white text-[14.08px] truncate">{summary}</p>
            )}
            <img
              loading="lazy"
              src={arrow.smallBoldWhite}
              alt=""
              className={`w-[10px] transition-transform ${
                open ? "rotate-180" : ""
              } ${isListing ? "brightness-0" : ""}`}
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
            className={`absolute top-[160%] z-10 flex w-[307px] flex-col items-start gap-[28px] rounded-[20px] bg-[#4A4A4A] px-[18px] py-[23px] backdrop-blur-[20px] drop-shadow-[0_41.656px_83.312px_-20.828px_rgba(143,144,188,0.15)] lg:w-[382px] ${
              isListing ? "right-0" : "left-[-161px] lg:left-auto"
            }`}
          >
            <div className="flex flex-col items-start gap-[12px]">
              <p className="text-white text-[18px] font-semibold">
                Price ({currency})
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-white">Min</label>
                  <input
                    inputMode="numeric"
                    pattern="\d*"
                    placeholder="min-price"
                    className="w-full rounded-[10px] border border-[#D7D2C8] bg-white px-3 py-2 text-[#2B2B2B] placeholder-[#B2AC9F] focus:outline-none focus:ring-2 focus:ring-[#B59B62]/50"
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
                    className="w-full rounded-[10px] border border-[#D7D2C8] bg-white px-3 py-2 text-[#2B2B2B] placeholder-[#B2AC9F] focus:outline-none focus:ring-2 focus:ring-[#B59B62]/50"
                    value={draft.max ?? ""}
                    onChange={(e) => handleInputChange("max", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex w-full items-center justify-between">
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
                className="h-[34px] w-[110px] rounded-[9px] border border-white bg-[#B59B62] text-[16px] font-medium text-white"
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
