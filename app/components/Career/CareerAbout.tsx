import React from "react";
import Header from "~/UI/Header";

export default function CareerAbout() {
  return (
    <div className="flex flex-col items-start gap-[18px] w-full">
      <Header className="text-[20px] lg:text-[34px]">WE’RE LOCAL, WE’RE GLOBAL</Header>
      <p className="text-black text-[15px] lg:text-[27px] leading-[194.444%%]">
        <span className="font-semibold">
          At Savoir Prive, we are more than just a real estate agency
        </span>
        <br />
        We are a dynamic community of professionals dedicated to redefining industry standards. As
        proud members of Leading Real Estate Companies of the World®, we stand at the forefront of
        innovation, integrity, and global reach in the real estate domain.
      </p>
    </div>
  );
}
