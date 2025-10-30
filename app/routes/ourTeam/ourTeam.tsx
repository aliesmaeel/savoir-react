import React from "react";
import { useLoaderData } from "react-router";
import { getTeams } from "~/api/team.service";
import FindYourPartner from "~/components/OurTeam/FindYourPartner";
import OurTeamContact from "~/components/OurTeam/OurTeamContact";
import OurTeamHero from "~/components/OurTeam/OurTeamHero";
import BookYourViewing from "~/components/Project/BookYourViewing/BookYourViewing";
import PageLayout from "~/layouts/PageLayout";

export async function clientLoader({ request }: { request: Request }) {
  try {
    const res: any = await getTeams();
    const teams = res;

    return { teams };
  } catch (error) {
    return { teams: [] };
  }
}

export default function ourTeam() {
  const { teams } = useLoaderData() as { teams: any };

  return (
    <div className="relative">
      <OurTeamHero />
      <PageLayout>
        <FindYourPartner />
        <OurTeamContact />
      </PageLayout>
    </div>
  );
}
