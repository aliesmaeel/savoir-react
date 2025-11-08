import React from "react";
import { Link } from "react-router";
import AdvisoryHero from "~/components/RealEstateAdvisory/AdvisoryHero";
import PageLayout from "~/layouts/PageLayout";
import Button from "~/UI/Button";
import Content from "~/UI/Content";
import GoldTitle from "~/UI/GoldTitle";

export default function realEstateAdvisory() {
  const items = [
    {
      title: "Real Estate Advisory",
      text: "Embark on an extraordinary journey where the complex decisions that often consume your time are transformed into seamless, effortless choices. At Savoir Prive, our real estate advisory solutions redefine how you engage with the Dubai property market, offering more than conventional services. Here, we promise a personalized approach to investing that not only aligns with your primary goals but anticipates your specific requirements.",
      image: "/images/real-estate-advisory/image1.jpg",
      link: "/contact-us",
    },
    {
      title: "Ready to Redefine Your Real Estate Success?",
      text: "Get in touch with us today to find out how our real estate consultancy can help you maximize the return on your real estate assets. Our team of experts, specialized in formulating strategic suggestions designed to fit your specific property objectives and investment ambitions, is here to advise and support you whether you are an experienced investor or are just entering in the market.Navigating the complexities of the dynamic real estate landscape in Dubai requires more than routine solutions. That's why our advisory services stand out, promising customized investment plans that provide not just guidance but a transformative experience that complement your key goals. We support you every step of the way, drawing on our specific knowledge to make sure the journey goes well.",
      image: "/images/real-estate-advisory/image2.jpg",
      link: "/contact-us",
    },
    {
      title: "Crafting Your Real Estate Journey",
      text: "At Savoir Prive, we understand that your real estate journey is as unique as you are. Therefore, our advisory solutions are more than just a service – they are a personalized experience designed to elevate your real estate success story. Every suggestion, every strategy, and every tip is a testament to our commitment to ensuring that your investment journey is not only smooth, but also truly exceptional. Our mission goes beyond the ordinary: every interaction is an opportunity to redefine your real estate journey. We believe in more than only transactional relations; we want to develop lifelong ties. With Savoir Prive, you are more than simply a customer; you are an essential component of our dedication to excellence in premium real estate services.",
      image: "/images/real-estate-advisory/image3.png",
      link: "/contact-us",
    },
  ];

  return (
    <div>
      <AdvisoryHero />
      <PageLayout>
        <div className="flex flex-col items-start gap-[100px] w-full">
          {items.map((item: any, index: number) => (
            <Content key={index} item={item} isRight={index % 2 === 0} />
          ))}
        </div>
      </PageLayout>
    </div>
  );
}
