import React from "react";
import Button from "~/UI/Button";

export default function CareerHero() {
  const handleViewVacancies = () => {
    const vacanciesSection = document.getElementById("current-vacancies");

    if (vacanciesSection) {
      vacanciesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex h-[560px] w-full flex-col items-center justify-center overflow-hidden lg:h-screen">
      <img
        loading="lazy"
        src="/images/placeholders/hero.webp"
        alt=""
        className="h-full w-full object-cover brightness-[0.48]"
      />

      <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center px-[16px] lg:px-[45px]">
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 flex w-full flex-col items-center gap-[34px]">
          <div
            className="flex flex-col items-center gap-[15px]"
            data-aos="fade-down"
          >
            <h1 className="CormorantGaramond text-center text-[31px] leading-[1.12] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)] lg:text-[64px]">
              Savoir Careers
            </h1>

            <p
              className="max-w-[1080px] text-center text-[14px] leading-[170%] drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)] lg:text-[24px]"
              style={{
                color: "#FFFFFF",
                fontWeight: 600,
                opacity: 1,
              }}
            >
              Join a boutique Dubai real estate team built on 100+ years of
              collective expertise, a family-centric culture, and the ambition
              to be the finest agency in the UAE.
            </p>
          </div>

          <div className="flex flex-col items-center gap-[13px] lg:flex-row">
            <Button
              type="white"
              onClick={handleViewVacancies}
              className="
                min-w-[170px]
                !rounded-[12px]
                border border-white/20
                bg-black/35
                backdrop-blur-xl
                !px-[24px]
                !py-[9px]
                text-[14px]
                font-semibold
                !text-white
                shadow-[0_14px_40px_rgba(0,0,0,0.30)]
                transition-all
                duration-300
                hover:bg-black/45
                hover:scale-[1.02]
                lg:min-w-[190px]
                lg:!px-[26px]
                lg:!py-[10px]
                lg:text-[18px]
              "
            >
              View Vacancies
            </Button>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 z-10 h-[176px] w-full"
          style={{
            background:
              "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)",
          }}
        />
      </div>
    </div>
  );
}
