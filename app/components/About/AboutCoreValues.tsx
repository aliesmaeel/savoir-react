import React from "react";
import Card from "~/UI/Card";
import GoldTitle from "~/UI/GoldTitle";
import Header from "~/UI/Header";

export default function AboutCoreValues() {
  const items = [
    {
      title: "Knowledge",
      text: "In our real estate domain, knowledge is not just information; it is  power. At Savoir Privé Properties, we empower our clients with the  information they need to make the smartest choices, recognizing that  knowledge is the key to success in the dynamic world of real estate.",
      image: "/images/about/Knowledge.jpg",
    },
    {
      title: "Passion",
      text: "We firmly believe that genuine passion is the driving force behind  transformative change. At Savoir Privé Properties, we wholeheartedly  commit ourselves to creating a positive influence in the lives of our  clients. Our motivation is humble yet powerful – to change our clients'  world for the better through unwavering passion.",
      image: "/images/about/Passion.jpg",
    },
    {
      title: "Trust",
      text: "At SAVOIR we do not have clients, we have partners. This is a healthy relationship based on trust and mutual understanding. Trust is what leads us to success.",
      image: "/images/about/Trust.jpg",
    },
    {
      title: "Excellence",
      text: "The synergy of knowledge and  experience culminates in excellence, and that is precisely what we stand for at Savoir Privé Properties. Our commitment is to provide excellence in every facet of our work. As wisdom and hands-on expertise converge, a new echelon of quality defines our distinctive approach to the realm of real estate.",
      image: "/images/about/Excellence.jpg",
    },
  ];

  return (
    <div className="flex flex-col items-start gap-[52px] w-full mt-[82px]">
      <Header className="text-[20px] lg:text-[34.5px]">Our Core Values</Header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[34px] w-full">
        {items.map((item: any, index: number) => (
          <Card
            key={index}
            className="!rounded-[15px] lg:!rounded-[67.5px] px-[16px] lg:px-[37px] py-[45px]"
          >
            <div className="flex flex-col items-start gap-[32px]">
              <div className="flex flex-col items-start gap-[27px]">
                <GoldTitle>{item.title}</GoldTitle>
                <p className="text-black text-[15px] lg:text-[22px] leading-[200%]">{item.text}</p>
              </div>
              {item.image && <img loading="lazy" src={item.image} alt="" />}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
