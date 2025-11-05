import React, { useEffect, useRef, useState } from "react";
import SearchFilter from "~/layouts/Filter/SearchFilter";
import HeroSwiper from "./HeroSwiper";

const WORDS = ["Dubai", "Egypt", "South Africa", "Bulgaria", "Greece"];

export default function HeroSection() {
  const [idx, setIdx] = useState(0);
  const [len, setLen] = useState(0);
  const [del, setDel] = useState(false);
  const tRef = useRef<number | null>(null);

  useEffect(() => {
    const word = WORDS[idx];
    const typingSpeed = 60;
    const deletingSpeed = 40;
    const holdAfterType = 700;
    const holdAfterDelete = 300;

    if (tRef.current) window.clearTimeout(tRef.current);

    if (!del) {
      if (len < word.length) {
        tRef.current = window.setTimeout(() => setLen(len + 1), typingSpeed);
      } else {
        tRef.current = window.setTimeout(() => setDel(true), holdAfterType);
      }
    } else {
      if (len > 0) {
        tRef.current = window.setTimeout(() => setLen(len - 1), deletingSpeed);
      } else {
        tRef.current = window.setTimeout(() => {
          setDel(false);
          setIdx((i) => (i + 1) % WORDS.length);
        }, holdAfterDelete);
      }
    }

    return () => {
      if (tRef.current) window.clearTimeout(tRef.current);
    };
  }, [idx, len, del]);

  return (
    <div className="relative w-full h-screen">
      <HeroSwiper />

      <div className="flex flex-col items-center justify-center w-full h-full absolute inset-0 z-10 px-[16px] lg:px-[45px]">
        <div className="flex flex-col items-center gap-[12px] lg:gap-[43.68px] w-full">
          <div className="flex flex-col items-center gap-[7.92px]" data-aos="fade-down">
            <h1 className="text-white text-[16px] lg:text-[51.04px]">
              Search Luxury Homes In{" "}
              <span aria-live="polite" className="inline-block">
                {WORDS[idx].slice(0, len)}
              </span>
            </h1>
          </div>
          <SearchFilter />
        </div>

        <div
          className="absolute bottom-0 left-0 w-full h-[176px]"
          style={{ background: "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)" }}
        />
      </div>
    </div>
  );
}
