import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useArrow from "~/hooks/imageHooks/useArrow";

type Interested = "Buy" | "Rent";
type Status = "All" | "Ready" | "Off-plan";

export type RentFilters = {
  interested: Interested;
  status: Status;
};

type Props = {
  value?: RentFilters; // Controlled (optional)
  onChange?: (next: RentFilters) => void; // Fires on Filter button
  label?: string;
  placeholder?: string;
  maxWidthClass?: string;
};

const DEFAULT_VALUE: RentFilters = { interested: "Rent", status: "All" };

export default function FilterRent({
  value,
  onChange,
  label = "Rent",
  placeholder = "Select Your Type",
  maxWidthClass = "max-w-[185.68px]",
}: Props) {
  const arrow = useArrow();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Local draft state (for dropdown selection before Apply)
  const [draft, setDraft] = useState<RentFilters>(value ?? DEFAULT_VALUE);

  // Sync local draft when parent changes
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

  const triggerSummary = useMemo(() => {
    return `${draft.interested} • ${draft.status}`;
  }, [draft]);

  const setInterested = (v: Interested) => setDraft((d) => ({ ...d, interested: v }));
  const setStatus = (v: Status) => setDraft((d) => ({ ...d, status: v }));

  const resetAll = () => setDraft(DEFAULT_VALUE);
  const apply = () => {
    onChange?.(draft);
    setOpen(false);
  };

  // Button style helpers (gold fill vs outline)
  const filled =
    "bg-[#B59B62] text-[16px] text-white font-medium py-[6px] w-full border border-white rounded-[9px] h-[43px]";
  const outline =
    "bg-transparent text-[16px] text-white font-medium py-[6px] w-full border border-white rounded-[9px] h-[43px]";

  return (
    <div className={`relative w-full ${maxWidthClass}`} ref={wrapperRef}>
      {/* Trigger */}
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
            <p className="text-white text-[14.08px] truncate">{triggerSummary || placeholder}</p>
            <img
              src={arrow.smallBoldWhite}
              alt=""
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </button>

      {/* Dropdown panel with height animation */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
            className="absolute w-[307px] lg:w-[382px] top-[160%] rounded-[20px] bg-[#4A4A4A] backdrop-blur-[20px] drop-shadow-[0_41.656px_83.312px_-20.828px_rgba(143,144,188,0.15)] z-10"
          >
            {/* inner content can also have a subtle slide */}
            <div className="flex flex-col items-start gap-[28px] px-[18px] py-[23px]">
              {/* Interested to */}
              <div className="flex flex-col items-start gap-[12px] w-full">
                <p className="text-white text-[18px] font-semibold">Interested to :</p>
                <div className="flex items-center gap-[11px] w-full">
                  <button
                    type="button"
                    onClick={() => setInterested("Buy")}
                    className={draft.interested === "Buy" ? filled : outline}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterested("Rent")}
                    className={draft.interested === "Rent" ? filled : outline}
                  >
                    Rent
                  </button>
                </div>
              </div>

              {/* Property status */}
              <div className="flex flex-col items-start gap-[12px] w-full">
                <p className="text-white text-[18px] font-semibold">Property status :</p>
                <div className="flex items-center gap-[7px] w-full">
                  <button
                    type="button"
                    onClick={() => setStatus("All")}
                    className={draft.status === "All" ? filled : outline}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("Ready")}
                    className={draft.status === "Ready" ? filled : outline}
                  >
                    Ready
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("Off-plan")}
                    className={draft.status === "Off-plan" ? filled : outline}
                  >
                    Off -plan
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between w-full">
                <button
                  type="button"
                  onClick={resetAll}
                  className="text-white underline text-[16px] font-medium"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={apply}
                  className="bg-[#B59B62] text-[16px] text-white font-medium border border-white rounded-[9px] w-[110px] h-[34px]"
                >
                  Filter
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
