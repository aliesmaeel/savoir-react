import React from "react";
import SearchFilter from "~/layouts/Filter/SearchFilter";

export default function SearchHero() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[90vh] relative">
      <img src="/images/placeholders/hero.webp" alt="" className="w-full h-[90vh] object-cover" />
      <div className="flex flex-col items-center justify-center w-full h-[90vh] absolute top-0 left-0 px-[16px] lg:px-[45px]">
        <div className="flex flex-col items-center gap-[61px] w-full">
          <SearchFilter />
        </div>
        <div
          className="absolute bottom-0 left-0 w-full h-[200px]"
          style={{
            background: "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)",
          }}
        />
      </div>
    </div>
  );
}
