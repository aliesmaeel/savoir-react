import React from "react";
import { Link } from "react-router";

export default function FooterUsefulLinks() {
  const items = [
    {
      title: "Real Estate Advisory",
    },
    {
      title: "Real Estate Advisory",
    },
    {
      title: "Real Estate Advisory",
    },
    {
      title: "Real Estate Advisory",
    },
    {
      title: "Real Estate Advisory",
    },
    {
      title: "Real Estate Advisory",
    },
    {
      title: "Real Estate Advisory",
    },
    {
      title: "Real Estate Advisory",
    },
  ];

  return (
    <div className="flex flex-col items-start gap-[20px] w-full max-w-[251px]">
      <p className="text-[#C6A45A] text-[24px] font-semibold">USEFUL LINKS</p>
      <ul className="flex flex-col items-start gap-[6px] w-full">
        {items.map((item: any, index: number) => (
          <li className="list-disc text-[21px] ml-[22px]">
            <Link to={`/projects/1`} key={index} className="">
              <p className="text-[18px]">{item.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
