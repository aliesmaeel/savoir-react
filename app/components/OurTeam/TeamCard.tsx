import React from "react";
import { Link } from "react-router";

type Props = {
  member: any;
};

export default function TeamCard({ member }: Props) {
  return (
    <Link
      to={`/our-team/${member.slug}`}
      className="flex flex-col items-start gap-[20px] w-full aspect-[430/542] rounded-[35px] backdrop-blur-[46px] py-[24px] px-[47px]"
      style={{
        background:
          "linear-gradient(162deg, rgba(53, 54, 53, 0.05) -2.97%, rgba(255, 255, 255, 0.07) 120.88%)",
        boxShadow:
          "38.019px -38.019px 38.019px 0 rgba(37, 37, 37, 0.07) inset, -38.019px 38.019px 38.019px 0 rgba(255, 255, 255, 0.07) inset",
      }}
    >
      <img
        loading="lazy"
        src={member.image}
        alt={member.name}
        className="aspect-square w-full rounded-[8px] object-cover"
      />
      <div className="flex flex-col items-start gap-[7px] w-full">
        <p className="text-[28px] font-medium">{member.name}</p>
        <p className="text-[#505050] text-[25px]">{member.Job_Description}</p>
        <p className="text-[#505050] text-[25px]">{member.experience}</p>
      </div>
    </Link>
  );
}
