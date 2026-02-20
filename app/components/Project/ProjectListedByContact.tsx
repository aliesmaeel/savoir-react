import React, { useState, useRef, useEffect } from "react";
import { Link, useLoaderData } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";
import Button from "~/UI/Button";

type Props = {
  user: any;
};

const shareUrl = () =>
  typeof window !== "undefined" ? window.location.href : "";

export default function ProjectListedByContact({ user }: Props) {
  const icon = useIcons();
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { property } = useLoaderData() as { property: any };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Return null if user is not provided
  if (!user) {
    return null;
  }

  const url = shareUrl();
  const shareLocation =
    [property?.community, property?.city].filter(Boolean).join(", ") || "Dubai";
  const shareMessage = `I have found this amazing property in ${shareLocation}\n\nlink : ${url}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedShareMessage = encodeURIComponent(shareMessage);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setDropdownOpen(false);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleLinkedInShare = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
    setDropdownOpen(false);
  };

  const handleWhatsAppShare = () => {
    window.open(
      `https://wa.me/?text=${encodedShareMessage}`,
      "_blank",
      "noopener,noreferrer"
    );
    setDropdownOpen(false);
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
    setDropdownOpen(false);
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

  const userImage = user?.image || "/images/placeholders/user-placeholder.png";
  const userName = user?.name || "Agent";
  const userPhone = (user?.phone || "").replace(/\s/g, "");

  return (
    <div className="flex flex-col gap-[38px] px-[18px] py-[48px] border border-[#C6A45A] rounded-[15px] w-full max-w-[499px] shrink-0 bg-white relative  z-10">
      {/* <img loading="lazy" src={icon.Ellipse9} alt="" className="absolute top-0 left-0 z-[-1]" />
      <img loading="lazy" src={icon.Ellipse8} alt="" className="absolute bottom-0 right-0 z-[-1]" /> */}

      <div className="flex items-center gap-[16px]">
        <img
          loading="lazy"
          src={userImage}
          alt=""
          className="w-[85px] aspect-square object-cover rounded-full"
        />
        <div className="flex flex-col items-start gap-[4px]">
          <p className="text-[#353635B2] text-[24px]">Listed By</p>
          <p className="text-[27px]">{userName}</p>
        </div>
      </div>
      {userPhone && (
        <div className="flex items-center gap-[19px] w-full">
          <Link to={`tel:${userPhone}`} className="w-full">
            <Button className="w-full gap-[6px] !py-[8px] !text-[18px]">
              <img loading="lazy" src={icon.phoneWhite} alt="" className="w-[27px]" />
              Call
            </Button>
          </Link>
          <Link to={`https://wa.me/${userPhone}`} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button className="w-full gap-[6px] !py-[8px] !text-[18px]">
              <img loading="lazy" src={icon.whatsappWhite} alt="" className="w-[27px]" />
              Whatsapp
            </Button>
          </Link>
        </div>
      )}
      <div className="flex flex-col items-center gap-[21px] w-full">
        <Button
          type="border"
          className="w-full gap-[9px] !py-[9px] !text-[18px]"
          onClick={handleBookingViewing}
        >
          <img loading="lazy" src={icon.dateBlack} alt="" className="w-[27px]" />
          Booking a viewing
        </Button>
        <div className="relative w-full flex justify-center" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((open) => !open)}
            className="flex items-center gap-[9px]"
            aria-label="Share this listing"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            tabIndex={0}
          >
            <img loading="lazy" src={icon.shareBlack} alt="" className="w-[27px]" />
            <p className="text-[18px] underline">{copied ? "Copied!" : "Share this Listing"}</p>
          </button>
          {dropdownOpen && (
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 flex flex-col gap-0 rounded-[8px] border border-[#E5E5E5] bg-white py-1 shadow-lg min-w-[180px] z-20"
              role="menu"
            >
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-[10px] px-4 py-2 text-left text-[14px] hover:bg-[#F5F5F5] rounded-t-[6px]"
                role="menuitem"
              >
                <img loading="lazy" src={icon.bodyShare} alt="" className="w-[20px]" />
                Copy link
              </button>
              <button
                type="button"
                onClick={handleLinkedInShare}
                className="flex items-center gap-[10px] px-4 py-2 text-left text-[14px] hover:bg-[#F5F5F5]"
                role="menuitem"
              >
                <img loading="lazy" src={icon.linkedinShare} alt="" className="w-[20px]" />
                LinkedIn
              </button>
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="flex items-center gap-[10px] px-4 py-2 text-left text-[14px] hover:bg-[#F5F5F5]"
                role="menuitem"
              >
                <img loading="lazy" src={icon.whatsappGold} alt="" className="w-[20px]" />
                WhatsApp
              </button>
              <button
                type="button"
                onClick={handleFacebookShare}
                className="flex items-center gap-[10px] px-4 py-2 text-left text-[14px] hover:bg-[#F5F5F5] rounded-b-[6px]"
                role="menuitem"
              >
                <img loading="lazy" src={icon.facebookShare} alt="" className="w-[20px]" />
                Facebook
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
