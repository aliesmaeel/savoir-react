import React, { useState } from "react";
import Button from "~/UI/Button";
import Popup from "~/UI/Popup";
import CVPopup from "./CVPopup";

export default function CareerHero() {
  const [openPopup, setOpenPopup] = useState(false);

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
              Ready to become part of a team that fuels your growth? At Savior Properties , we're proud to
              have a cohesive group of 11 diverse departments collaborating to achieve remarkable
              outcomes. We're seeking hardworking, ambitious, honest, and dedicated individuals to
              join our ranks. If that resonates with you, we would love to hear from you.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-[13px]">
            <Button type="white">View vacancies</Button>
            <Button onClick={() => setOpenPopup(true)} type="transparent">
              Send us your CV
            </Button>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 w-full h-[176px] z-10"
          style={{
            background: "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)",
          }}
        />
      </div>

      {openPopup && (
        <Popup onClose={() => setOpenPopup(false)}>
          <CVPopup />
        </Popup>
      )}
    </div>
  );
}
