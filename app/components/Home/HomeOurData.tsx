import React from "react";
import styles from "./HomeOurData.module.css";
import AnimatedInfo from "~/UI/AnimatedInfo";

export default function HomeOurData() {
  const data = [
    { title: "Countries", logo: "/images/placeholders/image 49.svg", info: "+70" },
    { title: "Offices", logo: "/images/placeholders/image 48.svg", info: "+4700K" },
    { title: "Companies", logo: "/images/placeholders/image 47.svg", info: "+550K" },
  ];

  return (
    <div className="grid grid-cols-3 gap-[36px] w-full pt-[52px]" data-aos="fade-up" id="our-data">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center justify-between gap-[36px]">
          <img src={item.logo} alt={item.title} />
          <div className="flex flex-col items-center gap-[22px]">
            <AnimatedInfo
              display={item.info}
              duration={500}
              className={`text-[66px] ${styles.info}`}
              // resetOnExit={false}
            />
            <p className="text-[#353635] text-[33px]">{item.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
