import React from "react";
import GoldTitle from "~/UI/GoldTitle";

type AboutGlobalProps = {
  country: string;
  description: string;
};

const AboutGlobal: React.FC<AboutGlobalProps> = ({ country, description }) => {
  return (
    <div className="flex flex-col items-start gap-[33px] w-full">
      <GoldTitle className="!text-[34px] capitalize">About {country}</GoldTitle>
      <p className="text-[15px] lg:text-[27px] ">{description}</p>
    </div>
  );
};

export default AboutGlobal;
