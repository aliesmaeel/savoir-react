import React from "react";
import { Link } from "react-router";

export default function FooterUsefulLinks() {
  const items = [
    {
      key: 1,
      title: "Global Projects",
      link: "/global-projects",
    },
    {
      key: 2,
      title: "List With Us",
      link: "/list-with-us",
    },
    {
      key: 3,
      title: "Real Estate Advisory",
      link: "/real-estate-advisory",
    },
    {
      key: 4,
      title: "Property Management",
      link: "/property-management",
    },
    {
      key: 5,
      title: "Interior Design Services",
      link: "/interior-design-services",
    },
    {
      key: 6,
      title: "Property Evaluation Services",
      link: "/property-evaluation-services",
    },
    {
      key: 7,
      title: "Mortgage Services",
      link: "/mortgage-services",
    },
    {
      key: 8,
      title: "Real Estate Guides",
      link: "/real-estate-guides",
    },
  ];

  return (
    <div className="flex flex-col items-start gap-[8px] lg:gap-[20px] w-full max-w-[251px]">
      <p className="text-[#C6A45A] text-[14px] lg:text-[24px] font-semibold">USEFUL LINKS</p>
      <ul className="flex flex-col items-start gap-[6px] w-full">
        {items.map((item: any, index: number) => (
          <li key= {item.key ?? index} className="list-disc text-[21px] ml-[22px]">
            <Link to={item.link} key={item.key} className="">
              <p className="text-[12px] lg:text-[18px]">{item.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
