import React, { useState } from "react";
import useIcons from "~/hooks/imageHooks/useIcons";
import Card from "~/UI/Card";
import Popup from "~/UI/Popup";
import ContactUsPopup from "./ContactUsPopup";

export default function ContactUsItems() {
  const icon = useIcons();
  const [openPopup, setOpenPopup] = useState(false);

  const items = [
    {
      title: "General enquiry",
      subtitle:
        "Have a question or request? Drop us a message, and a haus & haus expert will get back to you shortly.",
      icon: icon.GeneralEnquiry,
      onClick: () => setOpenPopup(true),
    },
    {
      title: "Press",
      subtitle: "Connect with our PR team for media inquiries or press-related requests",
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
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-[23px] w-full mt-[74px]">
      {items.map((item: any, index: number) => (
        <Card key={index} className="!rounded-[44px]">
          <div className="flex flex-col items-center justify-between w-full aspect-[318/465] px-[12px] py-[54px]">
            <div className="flex flex-col items-center gap-[14px]">
              <img src={item.icon} alt="" />
              <p className="text-[24px] font-semibold">{item.title}</p>
              <p className="text-[18px] text-center">{item.subtitle}</p>
            </div>
            <button
              onClick={item.onClick}
              className="w-full p-[14px] rounded-[13px] border border-[#C6A45A]"
            >
              <p className="text-[18px] font-medium">{item.title}</p>
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
