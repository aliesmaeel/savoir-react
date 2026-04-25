import React from "react";
import Card from "~/UI/Card";
import GoldTitle from "~/UI/GoldTitle";
import Header from "~/UI/Header";

export default function AboutCoreValues() {
  const addBreakAfterFullStop = (text: string) => text.replace(/\.\s*/g, ".\n");

  const items = [
    {
      title: "Knowledge",
      text: "We firmly believe that knowledge is the foundation of success in real estate.At Savoir Privé Properties, we are dedicated to empowering our clients with the insights and guidance they need to make confident, informed decisions. Our mission is simple yet impactful – to equip every client with the clarity and understanding needed to navigate the ever-changing market successfully.",
      image: "/images/about/Excellence.jpeg",
    },
    {
      title: "Passion",
      text: "We firmly believe that genuine passion is the driving force behind  transformative change. At Savoir Privé Properties, we wholeheartedly  commit ourselves to creating a positive influence in the lives of our  clients. Our motivation is humble yet powerful – to change our clients'  world for the better through unwavering passion.",
      image: "/images/about/passion.jpeg",
    },
    {
      title: "Trust",
      text: "At SAVOIR we do not have clients, we have partners. This is a healthy relationship based on trust and understanding. Trust is what leads us to success. We believe in building long-term connections where transparency, respect, and goals define every interaction. By working together, we create value, strengthen confidence, and achieve results that reflect our vision and commitment.",
      image: "/images/about/Trust.jpg",
    },
    {
      title: "Excellence",
      text: "The synergy of knowledge and  experience culminates in excellence, and that is precisely what we stand for at Savoir Privé Properties. Our commitment is to provide excellence in every facet of our work. As wisdom and hands-on expertise converge, a new echelon of quality defines our distinctive approach to the realm of real estate.",
      image: "/images/about/Knowledge.jpeg",
    },
  ];

  return (
    <div className="flex flex-col items-start gap-[52px] w-full mt-[82px]">
      <Header className="text-[20px] lg:text-[34.5px]">Our Core Values</Header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[34px] w-full">
        {items.map((item: any, index: number) => (
          <Card
            key={index}
            className="!rounded-[15px] lg:!rounded-[25px] px-[16px] lg:px-[37px] py-[45px]"
          >
            <div className="flex flex-col items-start gap-[32px]">
              <div className="flex flex-col items-start gap-[27px]">
                <GoldTitle>{item.title}</GoldTitle>
                <p className="whitespace-pre-line text-[#505050] text-[14px] lg:text-[18px] leading-[160%]">
                  {addBreakAfterFullStop(item.text)}
                </p>
              </div>
              {item.image && <img loading="lazy" src={item.image} alt="" />}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
