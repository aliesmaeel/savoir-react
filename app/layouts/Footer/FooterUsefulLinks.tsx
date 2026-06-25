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
    <div className="flex w-full max-w-[251px] flex-col items-start gap-[8px] lg:gap-[20px]">
      <p
        className="text-[14px] font-semibold lg:text-[24px]"
        style={{
          color: "#000000",
          fontWeight: 700,
          opacity: 1,
        }}
      >
        USEFUL LINKS
      </p>

      <ul className="flex w-full flex-col items-start gap-[6px]">
        {items.map((item: any, index: number) => (
          <li key={item.key ?? index} className="w-full list-none">
            <Link to={item.link} key={item.key}>
              <p
                className="text-[12px] leading-[1.35] transition-opacity duration-200 hover:opacity-70 lg:text-[18px]"
                style={{
                  color: "#000000",
                  fontWeight: 600,
                  opacity: 1,
                }}
              >
                {item.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}