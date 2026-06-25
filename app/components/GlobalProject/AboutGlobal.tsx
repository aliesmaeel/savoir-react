import React from "react";

type AboutGlobalProps = {
  country: string;
  description: string;
};

const AboutGlobal: React.FC<AboutGlobalProps> = ({ country, description }) => {
  return (
    <div className="flex flex-col items-start gap-[33px] w-full">
      <p className="CormorantGaramond text-[28px] font-semibold leading-[1.05] text-[#111111] lg:text-[44px]">
        About {country}
      </p>
      <p className="text-[14px] font-semibold leading-[160%] text-[#111111] lg:text-[18px]">{description}</p>
    </div>
  );
};

export default AboutGlobal;
