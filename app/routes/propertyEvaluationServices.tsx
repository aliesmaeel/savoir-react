import PageLayout from "~/layouts/PageLayout";
import ServiceContentCards from "~/components/ServiceCards/ServiceContentCards";

export default function propertyEvaluationServices() {
  const items = [
    {
      title: "Property Evaluation Services",
      text: "Make confident decisions with expert property valuation tailored to your goals—whether you are buying, selling, refinancing, or reviewing a portfolio in Dubai. SAVOIR delivers precise, market-aware evaluations that reflect the true worth of your asset and the dynamics of today’s real estate landscape.",
      image: "/images/propertyEvaluationServices/image1.jpg",
      link: "/contact-us",
    },
    {
      title: "Accurate Market Insight",
      text: "Our evaluation approach combines data-driven analysis with deep local expertise. We assess comparable sales, location fundamentals, property condition, and current market trends to present a clear and reliable picture of fair market value—so you can move forward with clarity rather than guesswork.",
      image: "/images/propertyEvaluationServices/image2.jpg",
      link: "/contact-us",
    },
    {
      title: "Clarity For Confident Decisions",
      text: "From first consultation to final report, we prioritize transparency and practical insight. Our evaluations support negotiation, investment strategy, and financing conversations with the confidence that comes from accurate numbers and thoughtful guidance—helping you protect and maximize the value of your real estate.",
      image: "/images/propertyEvaluationServices/image3.jpg",
      link: "/contact-us",
    },
  ];

  const visitSiteIndexes: number[] = [];

  return (
    <div className="mt-[100px]">
      <PageLayout>
        <ServiceContentCards
          items={items}
          visitSiteIndexes={visitSiteIndexes}
        />
      </PageLayout>
    </div>
  );
}
