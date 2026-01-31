import React, { useRef, useState } from "react";
import { useLoaderData } from "react-router";
import BookingInput from "~/components/Project/BookYourViewing/BookingInput";
import useIcons from "~/hooks/imageHooks/useIcons";
import Button from "~/UI/Button";

export default function ContactMember() {
  const { team } = useLoaderData() as { team?: any };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const icon = useIcons();
  const phoneDigits = team?.phone?.replace(/\D/g, "") ?? "";
  const whatsappLink = phoneDigits ? `https://wa.me/${phoneDigits}` : undefined;
  const contactName = team?.name ?? "our agent";

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, url?: string) => {
    if (url) {
      return;
    }
    event.preventDefault();
  };

  const handleLinkKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>, url?: string) => {
    if (event.key !== "Enter") {
      return;
    }
    if (url) {
      return;
    }
    event.preventDefault();
  };

  const handleSendEmail = () => {
    if (!team?.email || typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const formattedName = name.trim() || "Prospective Client";
    const fallbackPhone = phone.trim() || team?.phone || "N/A";
    const fallbackEmail = email.trim() || "N/A";

    const subject = encodeURIComponent(`Real Estate Inquiry - ${formattedName}`);
    const body = encodeURIComponent(
      `Hello, my name is ${formattedName}, phone is ${fallbackPhone}, email is ${fallbackEmail}. I want to contact regarding real estate.`,
    );

    const mailtoLink = `mailto:${team.email}?subject=${subject}&body=${body}`;
    const tempAnchor = document.createElement("a");
    tempAnchor.href = mailtoLink;
    tempAnchor.target = "_self";
    document.body.appendChild(tempAnchor);
    tempAnchor.click();
    tempAnchor.remove();
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) {
      return;
    }

    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    handleSendEmail();
  };

  return (
    <form
      ref={formRef}
      className="flex flex-col items-start gap-[52px] px-[24px] py-[30px] border border-[#C6A45A] rounded-[15px] w-full lg:w-[439px] shrink-0 bg-white relative overflow-hidden z-10"
      onSubmit={handleFormSubmit}
      noValidate={false}
    >
      <div className="flex flex-col items-start gap-[20px] w-full">
        <div className="flex flex-col items-start w-full">
          <p className="text-[30px] font-semibold">Prompt consultation :</p>
          <p className="text-[21px]">Fill form below and our agent will contact you shortly</p>
        </div>
        <div className="flex flex-col items-start gap-[22px] w-full">
          <BookingInput
            placeholder="Enter full name"
            value={name}
            onChange={setName}
            name="fullName"
            minLength={2}
            ariaLabel="Enter your full name"
            autoComplete="name"
          />
          <BookingInput
            placeholder="Enter Phone Number"
            value={phone}
            onChange={setPhone}
            type="tel"
            name="phone"
            pattern=".{6,}"
            ariaLabel="Enter your phone number"
            autoComplete="tel"
            inputMode="tel"
          />
          <BookingInput
            placeholder="Enter your Email"
            value={email}
            onChange={setEmail}
            type="email"
            name="email"
            ariaLabel="Enter your email address"
            autoComplete="email"
          />
        </div>
      </div>
      <div className="flex flex-col items-start gap-[24px] w-full">
        <Button
          className="!rounded-[4px] !px-0 lg:!px-[78px] !py-[15px] h-[44px] text-[18px] w-full"
          htmlType="submit"
          aria-label={`Send email to ${contactName}`}
        >
          Send Your Message
        </Button>
        <div className="flex flex-col items-center gap-[15px] w-full">
          <p className="text-black text-[18px] font-medium">
            Or contact {contactName} right now via
          </p>
          <div className="flex flex-wrap items-center justify-center gap-[18px] w-full">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[9px]"
              aria-label={`Chat with ${contactName} on WhatsApp`}
              tabIndex={0}
              onClick={(event) => handleLinkClick(event, whatsappLink)}
              onKeyDown={(event) => handleLinkKeyDown(event, whatsappLink)}
            >
              <img loading="lazy" src={icon.whatsappGold} alt="" className="w-[27px]" />
              <p className="text-[#C6A45A] text-[18px] font-medium">WhatsApp</p>
            </a>

          </div>
        </div>
      </div>
    </form>
  );
}
