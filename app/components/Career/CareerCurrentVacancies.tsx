import React, { useState } from "react";
import Popup from "~/UI/Popup";
import CareerCard from "./CareerCard";
import CVPopup from "./CVPopup";
import ThreeSwiper from "~/UI/ThreeSwiper";
import { SwiperSlide } from "swiper/react";
import Header from "~/UI/Header";

type Props = {
  vacancies: any[];
};

export default function CareerCurrentVacancies({ vacancies }: Props) {
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedCareerId, setSelectedCareerId] = useState<string | number | null>(null);

  const handleApplyClick = (jobId: string | number) => {
    setSelectedCareerId(jobId);
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setSelectedCareerId(null);
  };

  return (
    <div
      className="flex w-full flex-col items-center gap-[52px]"
      id="current-vacancies"
    >
      <div className="flex w-full flex-col items-center gap-[18px]">
        <div className="career-vacancies-heading-black">
          <Header className="text-center text-[28px] leading-[1.05] lg:text-[44px]">
            Current Vacancies
          </Header>
        </div>

        <p
          className="max-w-[1180px] text-center text-[15px] leading-[175%] lg:text-[20px]"
          style={{
            color: "#111111",
            fontWeight: 600,
            opacity: 1,
          }}
        >
          We offer uncapped potential, incentives and rewards, and ongoing
          support from our managers and trainers. Whether you're just starting
          your career or looking to make a change, we want to hear from you.
        </p>
      </div>

      <ThreeSwiper>
        {vacancies.map((job: any, index: number) => (
          <SwiperSlide key={job?.id ?? job?._id ?? index}>
            <CareerCard job={job} onApplyClick={handleApplyClick} />
          </SwiperSlide>
        ))}
      </ThreeSwiper>

      {openPopup && selectedCareerId && (
        <Popup onClose={handleClosePopup}>
          <CVPopup careerId={selectedCareerId} onClose={handleClosePopup} />
        </Popup>
      )}

      <style>
        {`
          .career-vacancies-heading-black,
          .career-vacancies-heading-black *,
          .career-vacancies-heading-black p,
          .career-vacancies-heading-black span,
          .career-vacancies-heading-black h1,
          .career-vacancies-heading-black h2 {
            color: #111111 !important;
            -webkit-text-fill-color: #111111 !important;
            opacity: 1 !important;
          }

          .career-vacancies-heading-black *::before,
          .career-vacancies-heading-black *::after {
            background: #111111 !important;
            border-color: #111111 !important;
          }
        `}
      </style>
    </div>
  );
}