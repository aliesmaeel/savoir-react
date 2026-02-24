import React from "react";

const ListHero = () => {
  return (
    <section className="relative flex items-center justify-center w-full min-h-[70vh] lg:min-h-[90vh] overflow-hidden">
  

      <div
        className="absolute inset-0 bg-white/60 lg:bg-white/70"
        aria-hidden="true"
        style={{ backgroundImage: "url('/images/icons/vLetter.png')", backgroundSize: "contain", backgroundRepeat  : "no-repeat" }}
      />

      <div className="relative z-10 flex w-full justify-center px-[16px] lg:px-[45px] py-[72px] lg:py-[96px] pb-[0px]">
        <div className="flex w-full max-w-5xl flex-col items-center gap-[32px] text-center">
          <div className="flex flex-col items-center gap-[17px]">
            <h1 className="text-[22px] sm:text-[26px] lg:text-[45px] font-semibold">
              Search Luxury Homes In Dubai
            </h1>
            <p className="text-[#505050] text-[15px] sm:text-[16px] lg:text-[20px]">
              Explore Dubai's Diverse Communities: Where Tradition Meets Innovation in Every
              Neighborhood.
            </p>
          </div>

          <div className="w-full flex justify-center">
            <img
              loading="lazy"
              src="/images/placeholders/list-with-us.jpg"
              alt="Luxury homes in Dubai listing preview"
              className="w-full max-w-[90%] rounded-xl mix-blend-multiply"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListHero;
