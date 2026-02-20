import React from "react";
import Button from "~/UI/Button";
import Card from "~/UI/Card";
import GoldTitle from "~/UI/GoldTitle";

export default function CareerCreativity() {
  return (
    <Card className="!rounded-[15px] lg:!rounded-[67px] py-[30px] lg:py-[59px] px-[16px] lg:px-[45px]">
      <div className="flex flex-col lg:flex-row items-center gap-[35px] w-full">
        <img
          loading="lazy"
          src="/images/Career/Innovationandcreativity.jpg"
          alt=""
          className="w-[396px] aspect-[396/336] rounded-[15px] object-cover"
        />
        <div className="flex flex-col items-start gap-[31px] w-full">
          <GoldTitle> Innovation and Creativity</GoldTitle>
          <p className="text-black text-[15px] lg:text-[22px] leading-[200%]">
            At Savoir Prive, we embrace innovation and forward-thinking. Our commitment to
            introducing new ideas, unconventional strategies, and advanced technologies sets us
            apart. Joining us means being part of an environment that fosters creativity and
            encourages thinking out of the box.
          </p>
          <a
            href="https://www.leadingre.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-[3.5px] px-[24.88px] lg:px-[81px] py-[15px] rounded-[4px] text-white text-[18px] font-semibold h-[44px]"
            style={{
              background: "linear-gradient(94deg, #C6A45A 3.17%, rgba(255, 255, 255, 0.60) 224.54%)",
            }}
          >
            About our affiliates
          </a>
        </div>
      </div>
    </Card>
  );
}
