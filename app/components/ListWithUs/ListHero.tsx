import React from "react";

export default function ListHero() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[80vh] lg:h-[150vh] relative">
      <img
        loading="lazy"
        src="/images/placeholders/memberBg.svg"
        alt=""
        className="w-full h-[80vh] lg:h-[150vh] object-cover"
      />
      <div className="flex flex-col items-center justify-center w-full h-[80vh] lg:h-[150vh] absolute top-0 left-0 px-[16px] lg:px-[45px]">
        <div className="flex flex-col items-center gap-[53.68px] w-full">
          <div className="flex flex-col items-center gap-[17px]">
            <h1 className=" text-[20px] lg:text-[45px] font-semibold">
              Search Luxury Homes In Dubai
            </h1>
            <p className="text-[#505050] text-[15px] lg:text-[24px]">
              Explore Dubai's Diverse Communities: Where Tradition Meets Innovation in Every
              Neighborhood.
            </p>
          </div>
          <img className="mix-blend-multiply" loading="lazy" src="/images/placeholders/list-with-us.png" alt="" />
        </div>
        <div
          className="absolute bottom-0 left-0 w-full h-[176px] z-10"
          style={{
            background: "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)",
          }}
        />
      </div>
    </div>
  );
}
