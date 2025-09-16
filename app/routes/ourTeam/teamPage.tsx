import AboutMember from "~/components/OurTeam/Member/AboutMember";
import MemberHero from "~/components/OurTeam/Member/MemberHero";
import MemberReviewSwiper from "~/components/OurTeam/Member/MemberReviewSwiper";
import OurAgents from "~/components/OurTeam/Member/OurAgents";
import PageLayout from "~/layouts/PageLayout";

export default function teamPage() {
  return (
    <div className="relative">
      <MemberHero />
      <PageLayout>
        <AboutMember />

        <MemberReviewSwiper />
        <OurAgents />
      </PageLayout>
    </div>
  );
}
