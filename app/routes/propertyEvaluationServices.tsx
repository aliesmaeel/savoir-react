import AdvisoryHero from "~/components/RealEstateAdvisory/AdvisoryHero";
import PageLayout from "~/layouts/PageLayout";
import Content from "~/UI/Content";

export default function propertyEvaluationServices() {
  const items = [
    {
      title: "Property Evaluation Services",
      text: "Entrust your property valuation to our seasoned experts who leverage their extensive experience and profound knowledge of Dubai and the UAE real estate landscape. We go far beyond by providing a thorough comparative market study to accurately ascertain the worth of your asset or potential investment. Discover the distinction with Savoir Prive's property evaluation expertise. Elevate your experience with our tailored approach that combines precision, insight, and innovation. Partner with us to unlock the full potential of your property and embark on a journey of unparalleled success in the real estate market.",
      image: "/images/propertyEvaluationServices/image1.jpg",
      link: "/contact-us",
    },
    {
      title: "Navigating the Property Valuation Landscape",
      text: "Property valuation is a strategic process that requires a thorough comprehension of market dynamics, trends, and possible risks. Our knowledgeable professionals take the time to do in-depth investigation and analysis, taking into account variables including location, property condition, demand in the market, and comparable sales data. We recognize that every property is unique, with its own set of opportunities and challenges. That's why our property valuation services are fully customized to meet your specific needs and objectives. Whether you're looking to sell your property, refinance your mortgage, or make informed investment decisions, our team will provide you with comprehensive insights and recommendations tailored to your situation. In today's competitive real estate market, uncovering hidden value is key to maximizing your investment returns. Our property experts have a keen eye for spotting opportunities and identifying areas where value can be enhanced. Whether it's optimizing property features, improving market positioning, or leveraging strategic partnerships, we'll work tirelessly to ensure that your property achieves its full potential.",
      image: "/images/propertyEvaluationServices/image2.jpg",
      link: "/contact-us",
    },
    {
      title: "Unveil the True Worth of Your Property with Savoir Prive's Evaluation Expertise.",
      text: "Our skilled property specialists provide a detailed evaluation of your home's genuine value by drawing on their vast expertise and in-depth knowledge of Dubai and the UAE. We provide a thorough competitive market study in addition to a standard evaluation to make sure your property stands out from the competition.",
      image: "/images/propertyEvaluationServices/image3.jpg",
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
