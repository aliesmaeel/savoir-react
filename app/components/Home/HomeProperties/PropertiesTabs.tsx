import React, { useState } from "react";

export default function PropertiesTabs({ tab, setTab }: any) {
  const tabs = ["For Rent", "For Sale", "Off Plan"];

  return (
    <div className="flex justify-between w-full">
      {tabs.map((item: any, index: number) => (
        <button onClick={() => setTab(item)} key={index} className="relative">
          <p className="text-[#353635] text-[18px] lg:text-[34px] Century">{item}</p>
          {item === tab && (
            <div
              className="w-[139%] h-[3.75px] absolute left-[50%] translate-x-[-50%] bottom-[-10px]"
              style={{
                background:
                  "linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, rgba(198, 164, 90, 1) 50%, rgba(255, 255, 255, 0) 100%)",
              }}
            ></div>
          )}
        </button>
      ))}
    </div>
  );
}
