import React, { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  questions: any;
};

export default function FAQs({ questions }: Props) {
  // First one open by default; null means all closed
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = useCallback(
    (idx: number) => {
      setOpenIndex((cur) => (cur === idx ? null : idx));
    },
    [setOpenIndex]
  );

  return (
    <div className="flex flex-col items-start gap-[14px] lg:gap-[28px] w-full">
      {questions.map((item: any, idx: number) => {
        const isOpen = openIndex === idx;

        return (
          <div
            key={idx}
            className="flex flex-col items-start w-full border border-[#353635] rounded-[4px] lg:rounded-[10px] overflow-hidden"
          >
            {/* Header (fixed 99px height) */}
            <div
              className="flex items-center 
              justify-between px-[8px] 
              lg:px-[27px] py-[7px] 
              lg:py-[7px] h-[36px] lg:h-auto 
              rounded-[4px] lg:rounded-[10px]  w-full"
              style={{
                background: isOpen ? "white" : "",
              }}
            >
              <div
                className="faq pr-4 text-[10px] font-bold text-[#111111] lg:text-[18px]"
                dangerouslySetInnerHTML={{ __html: item.question }}
                
              ></div>

              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${idx}`}
                className="flex h-[22px] w-[28px] items-center justify-center rounded-[4px] border border-[#353635] bg-[#353635] text-[20px] font-semibold leading-none text-white transition hover:bg-[#2B2B2B] lg:h-[32px] lg:w-[40px] lg:rounded-[8px] lg:text-[28px]"
              >
                {isOpen ? "-" : "+"}
              </button>
            </div>

            {/* Animated answer section */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${idx}`}
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="px-[8px] lg:px-[27px] py-[7px] lg:py-[22px] pt-4">
                    <div
                      className="Jakarta text-[10px] font-semibold leading-[1.9] text-[#111111] lg:text-[17px]"
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    ></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
