import React from "react";
import { Link } from "react-router";

type Props = {
  member: any;
};

export default function TeamCard({ member }: Props) {
  return (
    <Link
      to={`/our-team/${member.slug}`}
      className="group block h-full w-full max-w-[275px]"
    >
      <div className="relative h-full min-h-[380px] overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#D7BE78_0%,#F7EAC7_38%,#FFFFFF_72%)] p-[1px] shadow-[0_14px_38px_rgba(17,17,17,0.08)] transition-all duration-500 hover:-translate-y-[4px] hover:shadow-[0_22px_58px_rgba(17,17,17,0.14)]">
        <div className="flex h-full flex-col overflow-hidden rounded-[21px] bg-white">
          {/* Image */}
          <div className="relative h-[285px] w-full overflow-hidden bg-white">
            <img
              loading="lazy"
              src={member.image}
              alt={member.name}
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/16 via-transparent to-transparent opacity-70" />
            <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-[#D7BE78] to-transparent" />
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col px-[18px] pb-[18px] pt-[15px]">
            <div className="mb-[10px] h-[2px] w-[38px] rounded-full bg-[#C6A45A]" />

            <p className="text-[17px] font-semibold leading-[1.25] text-[#111111] transition-colors duration-300 group-hover:text-[#000000]">
              {member.name}
            </p>

            <p className="mt-[7px] text-[14px] leading-[1.42] text-[#333333]">
              {member.Job_Description}
            </p>

            {member.experience && (
              <p className="mt-[5px] text-[13px] leading-[1.4] text-[#666666]">
                {member.experience}
              </p>
            )}

            <div className="mt-auto pt-[14px]">
              <div className="flex items-center justify-between border-t border-[#EFE7D8] pt-[12px]">
                <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A6A2F]">
                  View Profile
                </span>

                <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full border border-[#2B2B2B] bg-[#2B2B2B] text-white shadow-[0_8px_18px_rgba(43,43,43,0.14)] transition-all duration-300 group-hover:scale-[1.08] group-hover:border-[#242424] group-hover:bg-[#242424]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[14px] w-[14px]"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M9 7h8v8" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}