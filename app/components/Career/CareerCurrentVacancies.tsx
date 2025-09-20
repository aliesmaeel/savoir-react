import React from "react";
import CareerCard from "./CareerCard";

export default function CareerCurrentVacancies() {
  const vacancies = Array.from({ length: 3 }, (_, index) => ({
    id: index + 1,
    title: `Property Manger`,
    image: "/images/placeholders/career.jpg",
    location: "Marina, Dubai",
  }));

  return (
    <div className="flex flex-col items-center gap-[52px] w-full">
      <div className="flex flex-col items-center gap-[15px] w-full">
        <p className="text-black text-[42px] font-medium">Current Vacancies</p>
        <p className="text-black text-[22px] text-center">
          We offer uncapped salary potential, incentives and rewards, and ongoing support from our
          managers and trainers. Whether you're just starting your career or looking to make a
          change, we want to hear from you.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-[30px] w-full">
        {vacancies.map((job: any, index: number) => (
          <CareerCard key={index} job={job} />
        ))}
      </div>
    </div>
  );
}
