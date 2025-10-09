import React from "react";
import { Link } from "react-router";
import AdvisoryHero from "~/components/RealEstateAdvisory/AdvisoryHero";
import PageLayout from "~/layouts/PageLayout";
import Button from "~/UI/Button";
import GoldTitle from "~/UI/GoldTitle";

export default function realEstateAdvisory() {
  const items = [
    {
      title: "Real Estate Advisory",
      text: "Embark on an extraordinary journey where the complex decisions that often consume your time are transformed into seamless, effortless choices. At Savoir Prive, our real estate advisory solutions redefine how you engage with the Dubai property market, offering more than conventional services. Here, we promise a personalized approach to investing that not only aligns with your primary goals but anticipates your specific requirements.",
      link: "#",
    },
    {
      title: "Ready to Redefine Your Real Estate Success?",
      text: "Get in touch with us today to find out how our real estate  consultancy can help you maximize the return on your real estate assets. Our team of experts, specialized in formulating strategic suggestions  designed to fit your specific property objectives and investment  ambitions, is here to advise and support you whether you are an  experienced investor or are just entering in the market. Navigating the complexities of the dynamic real estate  landscape in Dubai requires more than routine solutions. That's why our  advisory services stand out, promising customized investment plans that  provide not just guidance but a transformative experience that  complement your key goals. We support you every step of the way, drawing on our specific knowledge to make sure the journey goes well.",
      link: "#",
    },
    {
      title: "Ready to Redefine Your Real Estate Success?",
      text: "Get in touch with us today to find out how our real estate  consultancy can help you maximize the return on your real estate assets. Our team of experts, specialized in formulating strategic suggestions  designed to fit your specific property objectives and investment  ambitions, is here to advise and support you whether you are an  experienced investor or are just entering in the market. Navigating the complexities of the dynamic real estate  landscape in Dubai requires more than routine solutions. That's why our  advisory services stand out, promising customized investment plans that  provide not just guidance but a transformative experience that  complement your key goals. We support you every step of the way, drawing on our specific knowledge to make sure the journey goes well.",
      link: "#",
    },
  ];

  return (
    <div>
      <AdvisoryHero />
      <PageLayout>
        <div className="flex flex-col items-start gap-[100px] w-full">
          {items.map((item: any, index: number) => (
            <div key={index} className="flex flex-col items-start gap-[35px] w-full">
              <GoldTitle className="font-[34px]">{item.title}</GoldTitle>
              <p className="text-[15px] lg:text-[27px] leading-[180%]">{item.text}</p>
              <Link to={item.link}>
                <Button className="!rounded-[4px] !py-[15px] lg:!px-[81px] text-[18px] h-[44px]">
                  visit the site
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </PageLayout>
    </div>
  );
}
