import React from "react";
import { Link, useLoaderData } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";
import Button from "~/UI/Button";

type Props = {
  user: any;
};

export default function ProjectListedByContact({ user }: Props) {
  const icon = useIcons();

  return (
    <div className="flex flex-col gap-[38px] px-[18px] py-[48px] border border-[#C6A45A] rounded-[15px] w-full max-w-[499px] shrink-0 bg-[#FBFBFB] relative overflow-hidden z-10">
      <img loading="lazy" src={icon.Ellipse9} alt="" className="absolute top-0 left-0 z-[-1]" />
      <img loading="lazy" src={icon.Ellipse8} alt="" className="absolute bottom-0 right-0 z-[-1]" />

      <div className="flex items-center gap-[16px]">
        <img
          loading="lazy"
          src={user.image}
          alt=""
          className="w-[85px] aspect-square object-cover"
        />
        <div className="flex flex-col items-start gap-[4px]">
          <p className="text-[#353635B2] text-[24px]">Listed By</p>
          <p className="text-[27px]">{user.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-[19px] w-full">
        <Link to={`tel:${user.phone}`} className="w-full">
          <Button className="w-full gap-[6px] !py-[8px] !text-[18px]">
            <img loading="lazy" src={icon.phoneWhite} alt="" className="w-[27px]" />
            Call
          </Button>
        </Link>
        <Link to={`https://wa.me/${user.phone}`} className="w-full">
          <Button className="w-full gap-[6px] !py-[8px] !text-[18px]">
            <img loading="lazy" src={icon.whatsappWhite} alt="" className="w-[27px]" />
            Whatsapp
          </Button>
        </Link>
      </div>
      <div className="flex flex-col items-center gap-[21px] w-full">
        <Button type="border" className="w-full gap-[9px] !py-[9px] !text-[18px]">
          <img loading="lazy" src={icon.dateBlack} alt="" className="w-[27px]" />
          Booking a viewing
        </Button>
        <button className="flex items-center gap-[9px]">
          <img loading="lazy" src={icon.shareBlack} alt="" className="w-[27px]" />
          <p className="text-[18px] underline">Share this Listing</p>
        </button>
      </div>
    </div>
  );
}
