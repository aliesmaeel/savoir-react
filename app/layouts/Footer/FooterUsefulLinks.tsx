import React from "react";
import { Link } from "react-router";

export default function FooterUsefulLinks() {
  const items = [
    {
      title: "Global Project",
      link: "/global-project",
    },
    {
      title: "List With Us",
      link: "/list-with-us",
    },
    {
      title: "Real Estate Advisory",
      link: "/real-estate-advisory",
    },
  ];

  return (
    <div className="flex flex-col items-start gap-[8px] lg:gap-[20px] w-full max-w-[251px]">
      <p className="text-[#C6A45A] text-[14px] lg:text-[24px] font-semibold">USEFUL LINKS</p>
      <ul className="flex flex-col items-start gap-[6px] w-full">
        {items.map((item: any, index: number) => (
          <li className="list-disc text-[21px] ml-[22px]">
            <Link to={item.link} key={index} className="">
              <p className="text-[12px] lg:text-[18px]">{item.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
