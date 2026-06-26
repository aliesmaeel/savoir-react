import React from "react";

const ListHero = () => {
  return (
    <section className="relative flex w-full items-start justify-center overflow-hidden pb-[34px] pt-[82px] lg:min-h-[720px] lg:pb-[44px] lg:pt-[118px]">
      <div
        className="absolute inset-0 bg-white/60 lg:bg-white/70"
        aria-hidden="true"
        style={{
          backgroundImage: "url('/images/icons/vLetter.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative z-10 flex w-full justify-center px-[16px] lg:px-[45px]">
        <div className="flex w-full max-w-[980px] flex-col items-center gap-[24px] text-center lg:gap-[38px]">
          <div className="flex flex-col items-center gap-[8px]">
            <h1 className="CormorantGaramond text-[32px] sm:text-[40px] lg:text-[64px] leading-[1.08] font-normal text-[#111111]">
              List With Us
            </h1>

            <p className="CormorantGaramond text-[18px] sm:text-[21px] lg:text-[30px] leading-[1.2] font-normal text-[#111111]">
              Your property. Seen by the world.
            </p>
          </div>

          <div className="w-full flex justify-center">
            <img
              loading="lazy"
              src="/images/listwithus/list-with-us-2.png"
              alt="Luxury homes in Dubai listing preview"
              className="w-full max-w-[760px] rounded-xl object-contain lg:max-w-[820px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListHero;
