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
    <div className="flex flex-col items-center gap-[52px] w-full" id="current-vacancies">
      <div className="flex flex-col items-center gap-[15px] w-full">
        <p className="font-bold Theseasons _title_13r73_1 text-[20px] lg:text-[34px]">Current Vacancies</p>
        <p className="text-black text-[15px] lg:text-[22px] text-center">
          We offer uncapped salary potential, incentives and rewards, and ongoing support from our
          managers and trainers. Whether you're just starting your career or looking to make a
          change, we want to hear from you.
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
    </div>
  );
}
