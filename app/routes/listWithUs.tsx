import React from "react";
import ListGlobalNetwork from "~/components/ListWithUs/ListGlobalNetwork";
import ListGlobalPartners from "~/components/ListWithUs/ListGlobalPartners";
import ListHero from "~/components/ListWithUs/ListHero";
import WhyListWithUs from "~/components/ListWithUs/WhyListWithUs";
import PageLayout from "~/layouts/PageLayout";

export default function listWithUs() {
  return (
    <div>
      <ListHero />
      <PageLayout>
        <WhyListWithUs />
        <ListGlobalNetwork />
        <ListGlobalPartners />
      </PageLayout>
    </div>
  );
}
