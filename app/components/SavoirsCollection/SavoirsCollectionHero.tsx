import React from "react";

export default function SavoirsCollectionHero() {
  return (
    <div className="relative flex h-[420px] w-full flex-col overflow-hidden lg:h-[360px]">
      <img
        loading="lazy"
        src="/images/placeholders/hero.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/55" />

      <div
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-[230px] w-full lg:h-[270px]"
        style={{
          background:
            "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.86) 18%, rgba(255, 255, 255, 0.00) 100%)",
        }}
      />

      <h1 className="CormorantGaramond pointer-events-none absolute left-1/2 top-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2 px-[16px] text-center text-[42px] font-medium leading-[1.02] text-white lg:text-[86px]">
        Savoir&apos;s Collection
      </h1>
    </div>
  );
}
