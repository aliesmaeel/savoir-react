import React from "react";

export default function SavoirsCollectionHero() {
  return (
    <div className="relative flex h-[420px] w-full flex-col overflow-hidden bg-[#111111] lg:h-[360px]">
      <img
        loading="lazy"
        src="/images/placeholders/hero.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-[#050505]/58" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.42) 38%, rgba(0,0,0,0.20) 68%, rgba(0,0,0,0.08) 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-[115px] w-full lg:h-[130px]"
        style={{
          background:
            "linear-gradient(0deg, #FFFFFF 0%, rgba(255,255,255,0.78) 32%, rgba(255,255,255,0.22) 68%, rgba(255,255,255,0.00) 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute left-0 top-0 z-[5] h-full w-full"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 26%, rgba(0,0,0,0.20) 72%, rgba(0,0,0,0.48) 100%)",
        }}
      />

      <h1 className="CormorantGaramond pointer-events-none absolute left-1/2 top-1/2 z-20 w-full -translate-x-1/2 -translate-y-1/2 px-[16px] text-center text-[42px] font-medium leading-[1.02] text-white lg:text-[86px]">
        Savoir&apos;s Collection
      </h1>
    </div>
  );
}