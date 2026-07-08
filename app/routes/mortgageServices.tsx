import PageLayout from "~/layouts/PageLayout";
import ServiceContentCards from "~/components/ServiceCards/ServiceContentCards";

export default function mortgageServices() {
  const items = [
    {
      title: "Mortgage Services",
      text: "Discover an innovative approach to mortgage solutions, fine-tuned to suit your requirements, financial situation and circumstances. Our skilled team of experts is ready to provide you with one-on-one support and guidance as you navigate the complexities of mortgage servicing. No matter your background or nationality, we offer outstanding support and customized solutions, driven by strong partnerships with leading banks in the UAE.",
      image: "/images/mortgageServices/mortgage1.jpg",
      link: "/contact-us",
    },
    {
      title: "Partnerships That Support Success",
      text: "Savoir are partnering with the first digital mortgage platform in the Middle East with access to over 500 mortgage products available across the UAE. We can get you the best deal on your mortgage. we harness these partnerships to deliver tailored solutions that cater to your specific needs and aspirations. Our strategy goes beyond simply getting you the loan; it also involves getting to know your particular situation and financial objectives in order to offer options that work best for you. When you have skilled staff and years of expertise behind you, navigating the complicated mortgage servicing landscape becomes effortless. Regardless of your level of expertise and desire to increase your real estate holdings, our knowledgeable team of professionals are prepared to offer personalised assistance and direction at every stage of the process.",
      image: "/images/mortgageServices/mortgage2.jpg",
      link: "/contact-us",
    },
    {
      title: "Charting Your Mortgage Journey With Honesty And Refinement",
      text: "You can rely on forthright, refined, and transparent advice to support your decision-making process. Whether you're a seasoned investor growing your portfolio or a first-time homeowner starting your next chapter, our commitment to honesty, sophistication, and transparency ensures a smooth and stress-free experience, surpassing the ordinary.",
      image: "/images/mortgageServices/mortgage3.jpg",
      link: "/contact-us",
    },
  ];

  const visitSiteIndexes: number[] = [1];
  const stretchImageIndexes: number[] = [1];

  const linkToSite =
    "https://savoirprive.useholo.com/en/mortgage-products-services";

  return (
    <div className="mt-[100px] mortgage-services-page">
      <PageLayout>
        <ServiceContentCards
          items={items}
          visitSiteIndexes={visitSiteIndexes}
          stretchImageIndexes={stretchImageIndexes}
          getVisitLink={() => linkToSite}
        />
      </PageLayout>

      <style>
        {`
          .mortgage-services-page a,
          .mortgage-services-page button {
            border-color: transparent !important;
          }

          .mortgage-services-page a[href*="savoirprive.useholo.com"],
          .mortgage-services-page a[target="_blank"] {
            background: #2B2B2B !important;
            color: #ffffff !important;
            border: none !important;
            box-shadow: 0 12px 28px rgba(43, 43, 43, 0.18) !important;
          }

          .mortgage-services-page a[href*="savoirprive.useholo.com"]:hover,
          .mortgage-services-page a[target="_blank"]:hover {
            background: #242424 !important;
            color: #ffffff !important;
          }

          .mortgage-services-page a[href*="savoirprive.useholo.com"] *,
          .mortgage-services-page a[target="_blank"] * {
            color: #ffffff !important;
          }
        `}
      </style>
    </div>
  );
}