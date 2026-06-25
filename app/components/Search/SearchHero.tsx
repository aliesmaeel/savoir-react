import React from "react";
import { useLocation } from "react-router";
import SearchFilter from "~/layouts/Filter/SearchFilter";

export default function SearchHero() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const interested = params.get("interested") || "Buy";
  const status = params.get("status") || "All";

  const title =
    status === "Off-plan"
      ? "Discover the Best Off Plan Properties"
      : `Discover the Best Properties for ${interested === "Rent" ? "Rent" : "Sale"}`;

  return (
    <div className="relative flex h-[420px] w-full flex-col overflow-hidden lg:h-[560px]">
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
          background: "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.86) 18%, rgba(255, 255, 255, 0.00) 100%)",
        }}
      />

      <div className="relative z-20 w-full pt-[64px] lg:pt-[82px]">
        <SearchFilter />
      </div>

      <h1 className="CormorantGaramond pointer-events-none absolute left-1/2 top-[205px] z-10 w-full -translate-x-1/2 px-[16px] text-center text-[42px] font-medium leading-[1.02] text-white lg:top-[270px] lg:text-[86px]">
        {title}
      </h1>
    </div>
  );
}
