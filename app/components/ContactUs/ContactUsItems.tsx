import React, { useState } from "react";
import { useNavigate } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";
import Card from "~/UI/Card";
import Popup from "~/UI/Popup";
import ContactUsPopup from "./ContactUsPopup";

export default function ContactUsItems() {
  const icon = useIcons();
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);

  const items = [
    {
      title: "General enquiry",
      subtitle:
        "Have a question or request? Drop us a message, and a Savior Properties expert will get back to you shortly.",
      icon: icon.GeneralEnquiry,
      onClick: () => setOpenPopup(true),
    },
    {
      title: "Press",
      subtitle:
        "Connect with our PR team for media inquiries or press-related requests",
      icon: icon.Press,
      onClick: () => setOpenPopup(true),
    },
    {
      title: "Partnerships",
      subtitle:
        "Let’s explore collaboration opportunities. Reach out to discuss how we can work together",
      icon: icon.Partnerships,
      onClick: () => setOpenPopup(true),
    },
    {
      title: "Our team",
      subtitle:
        "Meet our diverse team of trusted property professionals and see what sets us apart.",
      icon: icon.OurTeam,
      onClick: () => navigate("/our-team"),
    },
  ];

  return (
    <div className="mt-[74px] grid w-full grid-cols-1 gap-[23px] lg:grid-cols-4">
      {items.map((item: any, index: number) => (
        <Card
          key={index}
          className="
            group
            !rounded-[34px]
            border border-[#111111]/10
            bg-white
            shadow-[0_16px_42px_rgba(17,17,17,0.06)]
            transition-all
            duration-300
            hover:-translate-y-[3px]
            hover:border-[#111111]
            hover:shadow-[0_24px_58px_rgba(17,17,17,0.12)]
          "
        >
          <div className="flex flex-col items-center justify-between gap-[42px] px-[14px] py-[44px] lg:w-full lg:aspect-[318/435] lg:gap-0">
            <div className="flex flex-col items-center gap-[16px]">
              <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-[#2B2B2B] shadow-[0_12px_28px_rgba(43,43,43,0.16)]">
                <img
                  loading="lazy"
                  src={item.icon}
                  alt=""
                  className="max-h-[36px] max-w-[36px] brightness-0 invert"
                />
              </div>

              <p
                className="CormorantGaramond text-center text-[24px] leading-[1.15]"
                style={{
                  color: "#111111",
                  fontWeight: 700,
                  opacity: 1,
                }}
              >
                {item.title}
              </p>

              <p
                className="text-center text-[16px] leading-[170%] lg:text-[17px]"
                style={{
                  color: "#111111",
                  fontWeight: 600,
                  opacity: 1,
                }}
              >
                {item.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={item.onClick}
              className="
                flex h-[44px] w-full items-center justify-center
                rounded-[11px] bg-[#2B2B2B] px-[18px]
                shadow-[0_12px_26px_rgba(43,43,43,0.16)]
                transition-all duration-300 hover:bg-[#242424]
              "
            >
              <p className="text-[16px] font-semibold text-white">
                {item.title}
              </p>
            </button>
          </div>
        </Card>
      ))}

      {openPopup && (
        <Popup onClose={() => setOpenPopup(false)}>
          <ContactUsPopup />
        </Popup>
      )}
    </div>
  );
}