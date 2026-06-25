import React from "react";
import ContactUsForm from "~/components/ContactUs/ContactUsForm";
import ContactUsHero from "~/components/ContactUs/ContactUsHero";
import ContactUsItems from "~/components/ContactUs/ContactUsItems";
import PageLayout from "~/layouts/PageLayout";
import DontMissBeat from "~/UI/DontMissBeat";
import Header from "~/UI/Header";
import Title from "~/UI/Title";

export default function contactUs() {
  return (
    <div>
      <ContactUsHero />

      <PageLayout>
        <style>
          {`
            .contact-heading-black,
            .contact-heading-black *,
            .contact-heading-black span,
            .contact-heading-black p,
            .contact-heading-black h1,
            .contact-heading-black h2 {
              color: #111111 !important;
              -webkit-text-fill-color: #111111 !important;
              opacity: 1 !important;
            }

            .contact-heading-black *::before,
            .contact-heading-black *::after {
              background: #111111 !important;
              border-color: #111111 !important;
            }
          `}
        </style>

        <div className="flex w-full flex-col items-center gap-[30px]">
          <div className="contact-heading-black">
            <Header className="text-center text-[28px] leading-[1.05] lg:text-[44px]">
              Get Started
            </Header>
          </div>

          <p
            className="text-center text-[15px] leading-[175%] lg:text-[20px]"
            style={{
              color: "#111111",
              fontWeight: 600,
              opacity: 1,
            }}
          >
            Take the first step towards achieving your real estate goals by
            talking to our team. Whether you are involved in residential or
            commercial transactions or considering relocation, we have the
            support and systems for your success.
          </p>
        </div>

        <ContactUsItems />
        <ContactUsForm />
      </PageLayout>
    </div>
  );
}
