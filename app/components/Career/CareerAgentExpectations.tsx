import React from "react";

export default function CareerAgentExpectations() {
  const items = [
    "Embrace failures as opportunities for growth.",
    "Operate with integrity in all interactions.",
    "Demonstrate self-motivation and self-sufficiency.",
    "Reflect on their performance and seek continuous improvement.",
    "Prioritize honesty and kindness in their dealings.",
    "Maintain consistency in their work ethic.",
  ];

  return (
    <div
      className="relative mb-[20px] w-full bg-cover bg-center px-[16px] py-[34px] lg:px-[51px] lg:py-[46px]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.62)), url("/images/Career/careerblack.jpeg")',
        backgroundPosition: "center 75%",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1226px] flex-col items-start justify-center gap-[18px]">
        <p className="CormorantGaramond text-[26px] leading-[1.05] text-white lg:text-[38px]">
          The Way We Operate
        </p>

        <ul className="flex w-full list-disc flex-col items-start gap-[8px] pl-[25px]">
          {items.map((item: string, index: number) => (
            <li
              key={index}
              className="text-[14px] leading-[155%] text-white lg:text-[18px]"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-[6px] flex w-full items-center justify-center rounded-[16px] bg-[#FFFFFF33] px-[16px] py-[14px] backdrop-blur-[10px] lg:px-[30px] lg:py-[20px]">
          <p className="text-center text-[14px] font-semibold leading-[160%] text-white lg:text-[19px]">
            If you embody these qualities and hold a valid real estate license,
            we invite you to apply and join our team today!
          </p>
        </div>
      </div>
    </div>
  );
}