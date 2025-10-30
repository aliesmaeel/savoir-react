import { getTeamPage } from "~/api/team.service";
import AboutMember from "~/components/OurTeam/Member/AboutMember";
import MemberHero from "~/components/OurTeam/Member/MemberHero";
import MemberReviewSwiper from "~/components/OurTeam/Member/MemberReviewSwiper";
import OurAgents from "~/components/OurTeam/Member/OurAgents";
import PageLayout from "~/layouts/PageLayout";

export async function clientLoader({ params }: { params: { teamSlug: string } }) {
  const teamSlug = params.teamSlug;
  try {
    const res: any = await getTeamPage(teamSlug);

    const team = res.team;
    const teams = res.other_teams;

    return { team, teams };
  } catch (error) {
    return { team: [], teams: [] };
  }
}

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
