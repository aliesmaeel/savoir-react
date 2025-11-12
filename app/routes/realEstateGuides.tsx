import React from "react";
import AdvisoryHero from "~/components/RealEstateAdvisory/AdvisoryHero";
import PageLayout from "~/layouts/PageLayout";
import Button from "~/UI/Button";

export default function realEstateGuides() {
  const items = [
    {
      title: "Buyers Guide",
      image: "/images/realEstateGuides/image1.jpg",
    },
    {
      title: "Sellers Guide",
      image: "/images/realEstateGuides/image2.png",
    },
    {
      title: "Tenants Guide",
      image: "/images/realEstateGuides/image3.jpg",
    },
    {
      title: "Landlords Guide",
      image: "/images/realEstateGuides/image4.jpg",
    },
  ];

  return (
    <div>
      <AdvisoryHero />
      <PageLayout>
        <div className="flex flex-col items-start gap-[89px] w-full">
          <div className="flex flex-col items-start gap-[24px] w-full">
            <p className="text-black text-[24px] lg:text-[60px] font-semibold">
              Real estate guides from industry experts
            </p>
            <p className="text-[14px] lg:text-[27px]">
              From buying or selling a property to discovering Dubai's key areas and investments,
              the Savior Properties guides are packed with essential information and key market insights.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[40px] w-full">
            {items.map((item: any, index: number) => (
              <div key={index} className="flex flex-col items-start gap-[18px] w-full">
                <img
                  src={item.image}
                  alt=""
                  className="w-full aspect-[414.75/292.5] rounded-[10.93px] object-cover"
                />
                <div className="flex items-center justify-between w-full">
                  <p className="text-[27px]">{item.title}</p>
                  <Button className="!rounded-[4px] !py-[6px] !px-[12px] text-[16px] h-[37px] w-fit">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageLayout>
    </div>
  );
}
