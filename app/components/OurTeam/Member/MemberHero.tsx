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
      value: team.language ?? "—",
    },
  ];
  const vLetter = '/images/icons/vLetter.png';

  return (
    <div className="flex flex-col items-center justify-center w-full h-[45vh] lg:h-[85vh] relative">

      <div className="flex flex-col items-center justify-center w-full h-[45vh] lg:h-[85vh] absolute top-0 left-0 px-[45px]"
      >
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-[30px] lg:gap-[30px] absolute left-0 bottom-0 z-20 w-full mix-blend-multiply h-full">
          <div
            className="hidden lg:block w-full max-w-[414px] aspect-[3/4] bg-cover bg-center bg-no-repeat ml-[-60px] h-[700px]"
            style={{ backgroundImage: `url(${team.image_border})` }}
          />
          <div className="flex flex-col items-center lg:items-start gap-[22px] lg:gap-[75px] mx-auto lg:mr-auto lg:ml-[15px]">
            <div className="flex flex-col items-center lg:items-start gap-[5px] lg:gap-[13px]">
              <p className="text-[21px] lg:text-[53px] font-medium">{team.name}</p>
              <Title className="text-[19px] lg:text-[48px]">{team.Job_Description}</Title>
            </div>
            <div className="flex flex-col items-center lg:items-start gap-[9px] lg:gap-[22px]">
              {infoItems.map((item: any, index: number) => (
                <div
                  className="flex gap-[9px] lg:gap-[23px] text-[#505050] text-[12px] lg:text-[31px]"
                  key={index}
                >
                  {item.title} <span className="text-[#353635] font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex flex-col items-center justify-center gap-[22px] w-full h-full"
            style={{ backgroundImage: `url(${vLetter})`, backgroundSize: 'contain', backgroundPosition: 'center top', backgroundRepeat: 'no-repeat', transform: 'scale(-1,1)' }}
          >

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
