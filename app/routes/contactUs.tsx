import React from "react";
import ContactUsForm from "~/components/ContactUs/ContactUsForm";
import ContactUsHero from "~/components/ContactUs/ContactUsHero";
import ContactUsItems from "~/components/ContactUs/ContactUsItems";
import PageLayout from "~/layouts/PageLayout";
import Header from "~/UI/Header";
import Title from "~/UI/Title";

export default function contactUs() {
  return (
    <div>
      <ContactUsHero />
      <PageLayout>
        <div className="flex flex-col items-center gap-[30px] w-full">
          <Header className="text-center text-[52.5px]">Get Started</Header>
          <p className="text-[27px] text-center">
            Take the first step towards achieving your real estate goals by talking to our team.
            Whether you are involved in residential or commercial transactions or considering
            relocation, we have the support and systems for your success.
          </p>
        </div>

        <ContactUsItems />
        <ContactUsForm />
      </PageLayout>
    </div>
  );
}
