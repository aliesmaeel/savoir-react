import React from "react";
import { useLoaderData } from "react-router";
import Header from "~/UI/Header";
import Title from "~/UI/Title";

export default function MemberHero() {
  const { team } = useLoaderData() as { team: any };

  const infoItems = [
    {
      title: "Phone :",
      value: team.phone ?? "—",
    },
    {
      title: "Email :",
      value: team.email ?? "—",
    },
    {
      title: "Languages :",
      value: (team.language ?? "—").replace(/,/g, ", "),
    },
  ];
  const vLetter = '/images/icons/vLetter.png';

  return (
    <div className="flex flex-col items-center justify-center w-full h-[45vh] lg:h-[85vh] relative">

      <div className="flex flex-col items-center justify-center w-full h-[45vh] lg:h-[85vh] relative top-0 left-0 px-[45px] max-w-[1336px]"
      >
        <div className="absolute bottom-0 left-0 z-20 flex h-full w-full flex-col items-center justify-center gap-[30px] px-[16px] lg:flex-row lg:items-end lg:justify-between lg:gap-[30px] lg:px-[60px] mix-blend-multiply">
          <div className="flex w-full flex-col items-center gap-[22px] lg:w-[44%] lg:items-start lg:gap-[55px]">
            <div className="flex flex-col items-center lg:items-start gap-[5px] lg:gap-[13px]">
              <p className="text-[21px] lg:text-[43px] font-medium">{team.name}</p>
              <Title className="text-[19px] lg:text-[38px]">{team.Job_Description}</Title>
            </div>
            <div className="flex flex-col items-center items-start lg:items-start gap-[9px] lg:gap-[22px]">
              {infoItems.map((item: any, index: number) => (
                <div
                  className="flex gap-[9px] lg:gap-[23px] text-[#505050] text-[12px] lg:text-[21px]"
                  key={index}
                >
                  <span className="w-[130px]">{item.title}</span>
                  <span className="text-[#353635] font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="hidden h-[700px] w-full max-w-[414px] bg-cover bg-center bg-no-repeat lg:block"
            style={{ backgroundImage: `url(${team.image_border})` }}
          />
       

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
