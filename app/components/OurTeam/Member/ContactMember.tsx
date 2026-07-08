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

  const handleLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    url?: string
  ) => {
    if (url) {
      return;
    }

    event.preventDefault();
  };

  const handleLinkKeyDown = (
    event: React.KeyboardEvent<HTMLAnchorElement>,
    url?: string
  ) => {
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
      `Hello, my name is ${formattedName}, phone is ${fallbackPhone}, email is ${fallbackEmail}. I want to contact regarding real estate.`
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
      className="
        relative z-10 flex w-full shrink-0 flex-col items-start
        gap-[30px] overflow-hidden rounded-[18px]
        border border-[#111111]/20 bg-white
        px-[22px] py-[26px]
        shadow-[0_18px_48px_rgba(17,17,17,0.08)]
        lg:w-[380px] lg:gap-[34px] lg:px-[24px] lg:py-[28px]

        [&_input]:!text-[#111111]
        [&_input]:!font-semibold
        [&_input::placeholder]:!text-[#111111]
        [&_input::placeholder]:!opacity-100
        [&_label]:!text-[#111111]
        [&_label]:!font-semibold
      "
      onSubmit={handleFormSubmit}
      noValidate={false}
    >
      <div className="flex w-full flex-col items-start gap-[22px]">
        <div className="flex w-full flex-col items-start gap-[8px]">
          <p
            className="CormorantGaramond text-[28px] leading-[1.12]"
            style={{
              color: "#111111",
              fontWeight: 700,
              opacity: 1,
            }}
          >
            Contact Us :
          </p>

          <p
            className="text-[17px] leading-[155%]"
            style={{
              color: "#111111",
              fontWeight: 600,
              opacity: 1,
            }}
          >
            Fill form below and our agent will contact you shortly
          </p>
        </div>

        <div className="flex w-full flex-col items-start gap-[20px]">
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

      <div className="flex w-full flex-col items-start gap-[22px]">
        <Button
          className="
            h-[42px]
            w-full
            !rounded-[13px]
            !bg-[#2B2B2B]
            !px-[24px]
            !py-[9px]
            text-[15px]
            font-semibold
            !text-white
            shadow-[0_10px_22px_rgba(43,43,43,0.18)]
            hover:!bg-[#242424]
            lg:h-[44px]
            lg:!px-[28px]
            lg:text-[16px]
          "
          htmlType="submit"
          aria-label={`Send email to ${contactName}`}
        >
          Send Your Message
        </Button>

        <div className="flex w-full flex-col items-center gap-[14px]">
          <p
            className="text-center text-[16px] leading-[140%]"
            style={{
              color: "#111111",
              fontWeight: 600,
              opacity: 1,
            }}
          >
            Or contact {contactName} right now via
          </p>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex h-[42px] items-center justify-center gap-[8px]
              rounded-[13px] bg-[#2B2B2B] px-[18px]
              text-[16px] font-semibold text-white
              shadow-[0_10px_22px_rgba(43,43,43,0.18)]
              transition-colors hover:bg-[#242424]
            "
            aria-label={`Chat with ${contactName} on WhatsApp`}
            tabIndex={0}
            onClick={(event) => handleLinkClick(event, whatsappLink)}
            onKeyDown={(event) => handleLinkKeyDown(event, whatsappLink)}
          >
            <img
              loading="lazy"
              src={icon.whatsappWhite}
              alt=""
              className="w-[22px]"
            />

            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </form>
  );
}