import React from "react";
import ContactUsForm from "~/components/ContactUs/ContactUsForm";
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
        <ContactUsForm />
      </PageLayout>
    </div>
  );
}
