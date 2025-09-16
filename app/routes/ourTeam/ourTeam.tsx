import React from "react";
import FindYourPartner from "~/components/OurTeam/FindYourPartner";
import OurTeamContact from "~/components/OurTeam/OurTeamContact";
import OurTeamHero from "~/components/OurTeam/OurTeamHero";
import BookYourViewing from "~/components/Project/BookYourViewing/BookYourViewing";
import PageLayout from "~/layouts/PageLayout";

export default function ourTeam() {
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
