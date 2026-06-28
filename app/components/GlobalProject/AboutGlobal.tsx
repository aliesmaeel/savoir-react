import React from "react";

type AboutGlobalProps = {
  country: string;
  description: string;
};

const AboutGlobal: React.FC<AboutGlobalProps> = ({ country, description }) => {
  return (
    <div className="flex flex-col items-start gap-[33px] w-full">
      <p className="CormorantGaramond text-[28px] !font-bold leading-[1.05] text-[#050505] [text-shadow:0_0_0.35px_currentColor] lg:text-[44px]">
        About {country}
      </p>
      <p className="Jakarta text-[14px] !font-bold leading-[160%] text-[#050505] lg:text-[18px]">{description}</p>
    </div>
  );
};

export default AboutGlobal;
