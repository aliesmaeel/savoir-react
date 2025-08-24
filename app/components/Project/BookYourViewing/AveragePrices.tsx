import React from "react";

export default function AveragePrices() {
  const prices = [
    {
      beds: 1,
      from: "0.99",
      to: "2",
      avg: "1",
    },
    {
      beds: 1,
      from: "0.99",
      to: "2",
      avg: "1",
    },
    {
      beds: 1,
      from: "0.99",
      to: "2",
      avg: "1",
    },
    {
      beds: 1,
      from: "0.99",
      to: "2",
      avg: "1",
    },
    {
      beds: 1,
      from: "0.99",
      to: "2",
      avg: "1",
    },
    {
      beds: 1,
      from: "0.99",
      to: "2",
      avg: "1",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-[22px] w-full max-w-[1080px] mx-auto mt-[75px]">
      <p className="text-[36px] font-semibold">Average prices</p>
      <div className="flex flex-col items-start gap-[21px] w-full">
        <div className="flex items-center justify-between w-full">
          <p className="text-[17px] font-medium">Size</p>
          <p className="text-[17px] font-medium w-full max-w-[364px]">Price</p>
        </div>
        {prices.map((item: any, index: number) => (
          <>
            <div key={index} className="flex items-center justify-between w-full">
              <div className="flex items-center gap-[24px]">
                <p className="text-[23px] font-semibold">{item.beds} Bedroom</p>
                <button className="px-[21px] py-[7px] rounded-full border border-[#262626]">
                  <p className="text-[16px] font-medium">View options</p>
                </button>
              </div>
              <div className="flex items-center justify-between px-[21px] py-[7px] rounded-full border border-[#262626] w-full max-w-[364px]">
                <p className="text-[16px] font-medium">
                  from {item.from} to {item.to}
                </p>
                <p className="text-[16px] font-medium">avg. AED {item.avg}</p>
              </div>
            </div>
            <hr className="w-full border-[#31313166] last:hidden" />
          </>
        ))}
      </div>
    </div>
  );
}
