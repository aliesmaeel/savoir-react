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
      className=" w-full bg-center bg-cover p-[16px] lg:px-[51px] lg:pt-[60px] lg:pb-[18px] relative"
      style={{ backgroundImage: 'url("/images/placeholders/CareerAgentExpectations.png")' }}
    >
      <div className="w-full max-w-[1226px] mx-auto flex flex-col items-start justify-center gap-[30px]">
        <p className="text-white text-[25px] lg:text-[74px]">Agent Expectations:</p>
        <div className="flex flex-col items-start gap-[30px] w-full pl-[25px]">
          {items.map((item: string, index: number) => (
            <ul className="flex items-start gap-[18px] w-full list-disc">
              <li className="text-white text-[15px] lg:text-[27px]">{item}</li>
            </ul>
          ))}
        </div>
        <div className="p-[16px] lg:px-[35px] lg:py-[37px] rounded-[20px] w-full bg-[#FFFFFF40] backdrop-blur-[10px]">
          <p className="text-white text-[15px] lg:text-[31px] font-semibold">
            If you embody these qualities and hold a valid real estate license, we invite you to
            apply and join our team today!
          </p>
        </div>
      </div>
    </div>
  );
}
