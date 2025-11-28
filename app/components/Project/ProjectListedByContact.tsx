import React, { useState } from "react";
import { Link, useLoaderData } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";
import Button from "~/UI/Button";

type Props = {
  user: any;
};

export default function ProjectListedByContact({ user }: Props) {
  const icon = useIcons();
  const [copied, setCopied] = useState(false);
  const { property } = useLoaderData() as { property: any };

  const handleShareListing = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const handleBookingViewing = () => {
    const agentEmail = user?.email;
    if (!agentEmail || typeof window === "undefined") {
      return;
    }

    const propertyTitle = property?.title_en || property?.title || "Property";
    const propertyUrl = window.location.href;
    
    const subject = `Booking a Viewing - ${propertyTitle}`;
    const body = [
      "Dear " + (user?.name || "Agent") + ",",
      "",
      "I hope this message finds you well.",
      "",
      "I am interested in booking a viewing for the following property:",
      `- Property: ${propertyTitle}`,
      `- Property Link: ${propertyUrl}`,
      "",
      "I would like to schedule a viewing at your earliest convenience. Please let me know your available dates and times.",
      "",
      "Thank you for your time and assistance. I look forward to hearing from you soon.",
      "",
      "Best regards,",
    ].join("\n");

    const mailtoLink = `mailto:${agentEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  };

  return (
    <div className="flex flex-col gap-[38px] px-[18px] py-[48px] border border-[#C6A45A] rounded-[15px] w-full max-w-[499px] shrink-0 bg-[#FBFBFB] relative overflow-hidden z-10">
      <img loading="lazy" src={icon.Ellipse9} alt="" className="absolute top-0 left-0 z-[-1]" />
      <img loading="lazy" src={icon.Ellipse8} alt="" className="absolute bottom-0 right-0 z-[-1]" />

      <div className="flex items-center gap-[16px]">
        <img
          loading="lazy"
          src={user.image}
          alt=""
          className="w-[85px] aspect-square object-cover"
        />
        <div className="flex flex-col items-start gap-[4px]">
          <p className="text-[#353635B2] text-[24px]">Listed By</p>
          <p className="text-[27px]">{user.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-[19px] w-full">
        <Link to={`tel:${user.phone}`} className="w-full">
          <Button className="w-full gap-[6px] !py-[8px] !text-[18px]">
            <img loading="lazy" src={icon.phoneWhite} alt="" className="w-[27px]" />
            Call
          </Button>
        </Link>
        <Link to={`https://wa.me/${user.phone}`} className="w-full">
          <Button className="w-full gap-[6px] !py-[8px] !text-[18px]">
            <img loading="lazy" src={icon.whatsappWhite} alt="" className="w-[27px]" />
            Whatsapp
          </Button>
        </Link>
      </div>
      <div className="flex flex-col items-center gap-[21px] w-full">
        <Button
          type="border"
          className="w-full gap-[9px] !py-[9px] !text-[18px]"
          onClick={handleBookingViewing}
        >
          <img loading="lazy" src={icon.dateBlack} alt="" className="w-[27px]" />
          Booking a viewing
        </Button>
        <button
          onClick={handleShareListing}
          className="flex items-center gap-[9px]"
          aria-label="Share this listing"
          tabIndex={0}
        >
          <img loading="lazy" src={icon.shareBlack} alt="" className="w-[27px]" />
          <p className="text-[18px] underline">{copied ? "Copied!" : "Share this Listing"}</p>
        </button>
      </div>
    </div>
  );
}
