import PageLayout from "~/layouts/PageLayout";
import type { Route } from "./+types/home";
import HeroSection from "~/components/Home/HeroSection";
import HomeAbout from "~/components/Home/HomeAbout";
import HomeOurData from "~/components/Home/HomeOurData";
import NewsInsights from "~/components/Home/NewsInsights/NewsInsights";
import HomeProperties from "~/components/Home/HomeProperties/HomeProperties";
import GlobalProjects from "~/components/Home/GlobalProjects/GlobalProjects";
import GlobalAccess from "~/components/Home/GlobalAccess";
import Locations from "~/components/Home/Locations/Locations";
import OffPlanProjects from "~/components/Home/OffPlanProjects/OffPlanProjects";
import OurCustomers from "~/components/Home/OurCustomers/OurCustomers";
import LuxuryPortfolio from "~/components/Home/LuxuryPortfolio";
import Sponsors from "~/components/Home/Sponsors/Sponsors";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Savoir" }];
}

export default function Home() {
  return (
    <div className="relative ">
      <HeroSection />
      <div className="absolute w-full  top-[calc(100vh+100px)] z-[-1]">
        <img src="/images/placeholders/homeBackground.webp" alt="" className="w-full opacity-25" />
        <div
          className="absolute bottom-0 left-0 w-full h-[250px]"
          style={{
            background: "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)",
          }}
        />
      </div>

      <PageLayout>
        <div className="w-full max-w-[1226px] mx-auto">
          <HomeAbout />
          <HomeOurData />
          <div className="grid grid-cols-2 gap-[37.5px] w-full mt-[99px] mb-[167px]">
            {/* <div className="w-full" data-aos="fade-right"> */}
            <HomeProperties />
            {/* </div> */}
            <div className="flex flex-col items-end justify-end gap-[37px] w-full">
              <NewsInsights />
              <div className="w-full flex justify-end" data-aos="fade-left">
                <GlobalProjects />
              </div>
            </div>
          </div>

          <GlobalAccess />
          <div className="grid grid-cols-2 gap-[37.5px] w-full mt-[142px]">
            <Locations />
            <OurCustomers />
            <OffPlanProjects />
            <LuxuryPortfolio />
          </div>
        </div>
      </PageLayout>
      <div>
        <Sponsors />
      </div>
    </div>
  );
}
