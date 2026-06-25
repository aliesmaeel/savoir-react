import React, { useState, useRef, useEffect } from "react";
import { Link, useLoaderData } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";

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

  if (!user) return null;

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
    if (!agentEmail || typeof window === "undefined") return;

    const propertyTitle = property?.title_en || property?.title || "Property";
    const propertyUrl = window.location.href;

    const subject = `Contact Us - ${propertyTitle}`;
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

    window.location.href = `mailto:${agentEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const userImage = user?.image || "/images/placeholders/user-placeholder.png";
  const userName = user?.name || "Agent";
  const userPhone = (user?.phone || "").replace(/\s/g, "");
  const userRole = user?.Job_Description || "Property Consultant";

  return (
    <div className="relative z-10 flex w-full max-w-[390px] shrink-0 flex-col gap-[20px] rounded-[18px] border border-[#E4C97F] bg-white px-[18px] py-[20px] shadow-[0_14px_34px_rgba(17,17,17,0.08)]">
      <div className="flex items-center gap-[14px] rounded-[15px] border border-[#F1E5C3] bg-white px-[14px] py-[14px]">
        <img
          loading="lazy"
          src={userImage}
          alt=""
          className="w-[68px] aspect-square rounded-full object-cover ring-4 ring-white shadow-[0_8px_18px_rgba(17,17,17,0.14)]"
        />

        <div className="flex flex-col items-start gap-[3px]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8A6A2F]">
            Listed By
          </p>
          <p className="text-[24px] leading-[1.15] text-[#111111]">{userName}</p>
          <p className="text-[14px] font-medium text-[#3A3A3A]">{userRole}</p>
        </div>
      </div>

      {userPhone && (
        <div className="grid w-full grid-cols-1 gap-[12px] sm:grid-cols-2">
          <Link
            to={`tel:${userPhone}`}
            className="flex h-[48px] w-full items-center justify-center gap-[8px] rounded-[13px] bg-[#111111] px-[14px] text-[16px] font-semibold text-white shadow-[0_10px_22px_rgba(17,17,17,0.18)]"
          >
            <img loading="lazy" src={icon.phoneWhite} alt="" className="w-[22px]" />
            Call
          </Link>

          <Link
            to={`https://wa.me/${userPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[48px] w-full items-center justify-center gap-[8px] rounded-[13px] bg-[#111111] px-[14px] text-[16px] font-semibold text-white shadow-[0_10px_22px_rgba(17,17,17,0.18)]"
          >
            <img loading="lazy" src={icon.whatsappWhite} alt="" className="w-[22px]" />
            Whatsapp
          </Link>
        </div>
      )}

      <div className="flex w-full flex-col items-center gap-[12px]">
        <button
          type="button"
          onClick={handleBookingViewing}
          className="flex h-[50px] w-full items-center justify-center gap-[8px] rounded-[13px] border border-[#D9B86D] bg-white px-[14px] text-[16px] font-semibold text-[#111111] shadow-[0_8px_18px_rgba(17,17,17,0.05)]"
        >
          <img loading="lazy" src={icon.dateBlack} alt="" className="w-[22px]" />
          Contact US
        </button>

        <div className="relative flex w-full justify-center" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((open) => !open)}
            className="flex items-center gap-[8px] rounded-full px-[12px] py-[6px] text-[#111111] transition-colors hover:bg-white"
            aria-label="Share this listing"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            tabIndex={0}
          >
            <img loading="lazy" src={icon.shareBlack} alt="" className="w-[22px]" />
            <p className="text-[16px] font-medium underline decoration-black underline-offset-4">
              {copied ? "Copied!" : "Share this Listing"}
            </p>
          </button>

          {dropdownOpen && (
            <div
              className="absolute left-1/2 top-full z-20 mt-2 flex min-w-[180px] -translate-x-1/2 flex-col gap-0 rounded-[12px] border border-[#EAD7A6] bg-white py-2 shadow-[0_14px_30px_rgba(17,17,17,0.12)]"
              role="menu"
            >
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-[8px] rounded-t-[10px] px-4 py-2 text-left text-[13px] hover:bg-white"
                role="menuitem"
              >
                <img loading="lazy" src={icon.bodyShare} alt="" className="w-[18px]" />
                Copy link
              </button>

              <button
                type="button"
                onClick={handleLinkedInShare}
                className="flex items-center gap-[8px] px-4 py-2 text-left text-[13px] hover:bg-white"
                role="menuitem"
              >
                <img loading="lazy" src={icon.linkedinShare} alt="" className="w-[18px]" />
                LinkedIn
              </button>

              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="flex items-center gap-[8px] px-4 py-2 text-left text-[13px] hover:bg-white"
                role="menuitem"
              >
                <img loading="lazy" src={icon.whatsappGold} alt="" className="w-[18px]" />
                WhatsApp
              </button>

              <button
                type="button"
                onClick={handleFacebookShare}
                className="flex items-center gap-[8px] rounded-b-[10px] px-4 py-2 text-left text-[13px] hover:bg-white"
                role="menuitem"
              >
                <img loading="lazy" src={icon.facebookShare} alt="" className="w-[18px]" />
                Facebook
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
