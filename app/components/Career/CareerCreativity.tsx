import React from "react";
import Button from "~/UI/Button";
import Card from "~/UI/Card";
import GoldTitle from "~/UI/GoldTitle";

export default function CareerCreativity() {
  return (
    <Card className="!rounded-[67px] py-[59px] px-[45px]">
      <div className="flex items-center gap-[35px] w-full">
        <img
          src="/images/placeholders/CareerCreativity.png"
          alt=""
          className="w-[396px] aspect-[396/336] rounded-[15px] object-cover"
        />
        <div className="flex flex-col items-start gap-[31px] w-full">
          <GoldTitle> Innovation and Creativity</GoldTitle>
          <p className="text-black text-[22px] leading-[200%]">
            At Savoir Prive, we embrace innovation and forward-thinking. Our commitment to
            introducing new ideas, unconventional strategies, and advanced technologies sets us
            apart. Joining us means being part of an environment that fosters creativity and
            encourages thinking out of the box.
          </p>
          <Button className="!rounded-[4px] !py-[15px] !px-[81px] text-[18px] h-[44px]">
            About our affiliates
          </Button>
        </div>
      </div>
    </Card>
  );
}
