import React, { useState } from "react";
import Popup from "~/UI/Popup";
import CareerCard from "./CareerCard";
import CVPopup from "./CVPopup";
import ThreeSwiper from "~/UI/ThreeSwiper";
import { SwiperSlide } from "swiper/react";

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
      className="flex w-full flex-col items-center gap-[44px]"
      id="current-vacancies"
    >
      <div className="flex w-full flex-col items-center gap-[16px]">
        <p
          className="CormorantGaramond text-center text-[25px] leading-[1.05] lg:text-[38px]"
          style={{
            color: "#111111",
            fontWeight: 500,
            opacity: 1,
          }}
        >
          Current Vacancies
        </p>

        <p
          className="CormorantGaramond max-w-[1180px] text-center text-[15px] leading-[175%] lg:text-[20px]"
          style={{
            color: "#111111",
            fontWeight: 500,
            opacity: 1,
          }}
        >
          We offer uncapped potential, incentives and rewards, and ongoing
          support from our managers and trainers. Whether you're just starting
          your career or looking to make a change, we want to hear from you.
        </p>
      </div>

      <div className="career-vacancies-cards w-full">
        <ThreeSwiper>
          {vacancies.map((job: any, index: number) => (
            <SwiperSlide key={job?.id ?? job?._id ?? index}>
              <CareerCard job={job} onApplyClick={handleApplyClick} />
            </SwiperSlide>
          ))}
        </ThreeSwiper>
      </div>

      {openPopup && selectedCareerId && (
        <Popup onClose={handleClosePopup}>
          <CVPopup careerId={selectedCareerId} onClose={handleClosePopup} />
        </Popup>
      )}

      <style>
        {`
          .career-vacancies-cards .swiper-slide {
            display: flex !important;
            justify-content: center !important;
          }

          .career-vacancies-cards .swiper-slide > * {
            width: 100% !important;
            max-width: 340px !important;
            min-height: auto !important;
            height: auto !important;
            padding: 16px 16px 18px !important;
          }

          .career-vacancies-cards .swiper-slide img {
            max-height: 185px !important;
            object-fit: cover !important;
          }

          .career-vacancies-cards .swiper-slide h1,
          .career-vacancies-cards .swiper-slide h2,
          .career-vacancies-cards .swiper-slide h3,
          .career-vacancies-cards .swiper-slide p {
            margin-top: 0 !important;
          }

          .career-vacancies-cards .swiper-slide button,
          .career-vacancies-cards .swiper-slide a {
            width: auto !important;
            min-width: 185px !important;
            max-width: 205px !important;
            height: 42px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            padding: 0 28px !important;
            border-radius: 9px !important;
            background: #2B2B2B !important;
            color: #FFFFFF !important;
            border: none !important;
            font-size: 18px !important;
            font-weight: 600 !important;
            box-shadow: 0 10px 24px rgba(43, 43, 43, 0.16) !important;
            transition: all 0.3s ease !important;
          }

          .career-vacancies-cards .swiper-slide button:hover,
          .career-vacancies-cards .swiper-slide a:hover {
            background: #242424 !important;
            color: #FFFFFF !important;
          }
        `}
      </style>
    </div>
  );
}