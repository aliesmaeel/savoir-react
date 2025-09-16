import React from "react";
import Header from "~/UI/Header";
import Title from "~/UI/Title";

export default function MemberHero() {
  const items = [
    {
      title: "Experience :",
      value: "15 years",
    },
    {
      title: "Specialization :",
      value: "Primary Market",
    },
    {
      title: "Language :",
      value: "English, Russian, Romanian",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full h-[100vh] relative">
      <img
        src="/images/placeholders/memberBg.svg"
        alt=""
        className="w-full h-[100vh]  object-cover"
      />
      <div className="flex flex-col items-center justify-center w-full h-[100vh]  absolute top-0 left-0 px-[45px]">
        <div className="flex items-center gap-[60px]  absolute left-0 bottom-0 z-20">
          <img src="/images/placeholders/team-member.png" alt="" className="" />
          <div className="flex flex-col items-start gap-[75px]">
            <div className="flex flex-col items-start gap-[13px]">
              <p className="text-[53px] font-medium">Wade Warren</p>
              <Title className="text-[48px]">Property Consultant</Title>
            </div>
            <div className="flex flex-col items-start gap-[22px]">
              {items.map((item: any, index: number) => (
                <div className="flex gap-[23px] text-[#505050] text-[31px]" key={index}>
                  {item.title} <span className="text-[#353635] font-medium">{item.value}</span>
                </div>
              ))}
            </div>
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
