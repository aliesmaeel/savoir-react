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
    <div className="flex flex-col items-center justify-center w-full h-screen relative">
      <img
        loading="lazy"
        src="/images/placeholders/newsPage.png"
        alt=""
        className="w-full h-screen object-cover"
      />
      <div className="flex flex-col items-center justify-center w-full h-screen absolute top-0 left-0 px-[16px] lg:px-[45px]">
        <div className="flex flex-col items-center gap-[53.68px] w-full">
          <div className="flex flex-col items-center gap-[7.92px]" data-aos="fade-down">
            <h1 className="text-white text-[20px] lg:text-[51.04px]"> Savoir Careers</h1>
            <p className="text-white text-[12px] lg:text-[18.48px] text-center">
            Join a boutique real estate team built on expertise, integrity, and ambition. Explore current opportunities and grow with Savoir Privé Properties.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-[13px]">
            <Button type="white" onClick={handleViewVacancies}>View vacancies</Button>
          </div>
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
