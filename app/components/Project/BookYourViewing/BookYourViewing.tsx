import React, { useRef, useState } from "react";
import useIcons from "~/hooks/imageHooks/useIcons";
import BookingInput from "./BookingInput";
import BookingDropdown from "./BookingDropdown";
import BookingCheckbox from "./BookingCheckbox";
import Button from "~/UI/Button";
import { useLoaderData } from "react-router";

type Agent = {
  name?: string;
  email?: string;
  image?: string;
  Job_Description?: string;
  phone?: string;
};

type Props = {
  agent?: Agent;
};

const DEFAULT_AGENT: Agent = {
  name: "Wade Warren",
  email: "info@savoirproperties.com",
  image: "/images/placeholders/user.webp",
  Job_Description: "Property Consultant",
  phone: "971505074686",
};

export default function BookYourViewing({ agent }: Props) {
  const { property, similar } = useLoaderData() as { property: any; similar: any };

  const icon = useIcons();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [inquiryType, setInquiryType] = useState("");
  const [checked, setChecked] = useState(false);
  const [mixed, setMixed] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  const activeAgent = agent || property?.user || DEFAULT_AGENT;
  const TO_EMAIL = activeAgent.email || DEFAULT_AGENT.email;
  const agentName = activeAgent.name || DEFAULT_AGENT.name;
  const agentImage = activeAgent.image || DEFAULT_AGENT.image;
  const agentRole = activeAgent.Job_Description || DEFAULT_AGENT.Job_Description;
  const agentPhone = activeAgent.phone || DEFAULT_AGENT.phone || "";

  const cleanWhatsappNumber = String(agentPhone).replace(/[^\d]/g, "");
  const whatsappLink = `https://wa.me/${cleanWhatsappNumber || "971505074686"}`;

  const handleSendEmail = () => {
    if (!TO_EMAIL || typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const formattedName = name.trim() || "Prospective Client";
    const propertyTitle = property?.title_en || property?.title || "Property";

    const subject = `Property Inquiry — ${formattedName} - ${propertyTitle}`;
    const body = [
      "Dear SAVOIR Team,",
      "",
      "I hope this message finds you well.",
      "",
      `My name is ${formattedName}, and I would like to inquire about one of your properties.`,
      "",
      "Here are my details:",
      `- Full Name: ${formattedName}`,
      `- Email: ${email.trim() || "-"}`,
      `- Phone: ${phone.trim() || "-"}`,
      `- Inquiry Type: ${inquiryType || "-"}`,
      `- Preferred Date: ${date || "-"}`,
      `- Preferred Time: ${time || "-"}`,
      "",
      "Message:",
      message.trim() ||
        "I am interested in scheduling a viewing. Please let me know available slots.",
      "",
      "Thank you for your time and assistance. I look forward to hearing from you soon.",
      "",
      "Best regards,",
      formattedName,
    ].join("\n");

    const mailtoLink = `mailto:${TO_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

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

    if (!checked) {
      formRef.current.reportValidity();
      alert("Please agree to the Terms and Privacy Policy.");
      return;
    }

    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    handleSendEmail();
  };

  return (
    <div className="mt-[60px] flex w-full flex-col items-start gap-[22px]">
      <div className="flex flex-col items-start gap-[7px]">
        <p className="CormorantGaramond text-[28px] font-[900] leading-[1.08] text-[#050505] [text-shadow:0_0_0.45px_#050505] lg:text-[34px]">
          Book a Viewing
        </p>
      </div>

      <form
        ref={formRef}
        onSubmit={handleFormSubmit}
        className="
          relative z-10 mx-auto flex w-full max-w-[1080px] flex-col
          overflow-hidden rounded-[16px] border border-[#111111]
          bg-white px-[16px] py-[18px]
          shadow-[0_22px_60px_rgba(17,17,17,0.10)]
          lg:flex-row lg:items-stretch lg:gap-[26px]
          lg:px-[22px] lg:py-[24px]
          [&_input]:!text-[#111111]
          [&_input]:!font-semibold
          [&_input::placeholder]:!text-[#111111]
          [&_input::placeholder]:!opacity-100
          [&_textarea]:!text-[#111111]
          [&_textarea]:!font-semibold
          [&_textarea::placeholder]:!text-[#111111]
          [&_textarea::placeholder]:!opacity-100
          [&_select]:!text-[#111111]
          [&_select]:!font-semibold
          [&_label]:!text-[#111111]
          [&_label]:!font-semibold
        "
        noValidate={false}
      >
        <div className="hidden w-full max-w-[270px] shrink-0 overflow-hidden rounded-[14px] bg-[#2B2B2B] lg:flex lg:flex-col">
          <div className="relative h-[330px] w-full overflow-hidden">
            <img
              loading="lazy"
              src={agentImage}
              alt={agentName}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B] via-[#2B2B2B]/18 to-transparent" />
          </div>

          <div className="flex flex-col items-center gap-[4px] bg-[#2B2B2B] px-[16px] pb-[20px] pt-[16px]">
            <p className="text-center text-[24px] font-semibold leading-[1.1] text-white">
              {agentName}
            </p>

            <p className="text-center text-[19px] leading-[1.2] text-white/80">
              {agentRole}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-[30px] py-[4px] lg:py-[12px]">
          <div className="flex w-full flex-col items-start gap-[34px]">
            <div className="grid w-full grid-cols-1 gap-[18px] gap-x-[26px] lg:grid-cols-3 lg:gap-y-[42px]">
              <BookingInput
                placeholder="Enter Full Name"
                value={name}
                onChange={setName}
                name="fullName"
                minLength={2}
                ariaLabel="Enter your full name"
                autoComplete="name"
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

              <BookingDropdown
                placeholder="Select Inquiry Type"
                value={inquiryType}
                onChange={setInquiryType}
                options={[
                  { label: "Request for Viewing", value: "Request for Viewing" },
                  { label: "More Information", value: "More Information" },
                ]}
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
                type="date"
                placeholder="Select Date"
                value={date}
                onChange={setDate}
                name="date"
                ariaLabel="Select preferred date"
              />

              <BookingInput
                type="time"
                placeholder="Select Time"
                value={time}
                onChange={setTime}
                name="time"
                ariaLabel="Select preferred time"
              />

              <div
                className="
                  w-full lg:col-span-3 lg:col-start-1 lg:mt-[0px]
                  [&_*]:!ml-0
                  [&_*]:!pl-0
                  [&_textarea]:!ml-0
                  [&_textarea]:!pl-0
                  [&_textarea]:!text-left
                  [&_textarea::placeholder]:!text-left
                "
              >
                <BookingInput
                  type="textAria"
                  placeholder="Enter your Message here.."
                  value={message}
                  onChange={setMessage}
                  name="message"
                  ariaLabel="Enter your message"
                />
              </div>
            </div>

            <div className="flex w-full flex-col items-center justify-between gap-[18px] lg:flex-row">
              <BookingCheckbox
                checked={checked}
                onChange={(n) => {
                  setChecked(n);
                  setMixed(false);
                }}
                indeterminate={mixed && !checked}
                label="I agree with Terms of Use and Privacy Policy"
                size={20}
              />

              <Button
                className="
                  h-[44px] w-full
                  !rounded-[8px]
                  !border-0 !border-none
                  !bg-[#2B2B2B]
                  !px-[24px] !py-[8px]
                  text-[16px] font-semibold !text-white
                  shadow-[0_10px_24px_rgba(43,43,43,0.16)]
                  transition-all duration-300
                  hover:!bg-[#242424]
                  lg:w-auto lg:min-w-[210px]
                "
                htmlType="submit"
                aria-label={`Send email to ${agentName}`}
              >
                Send Your Message
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-[13px] lg:flex-row">
            <p
              className="text-[18px] leading-[1.2]"
              style={{
                color: "#111111",
                fontWeight: 700,
                opacity: 1,
              }}
            >
              Or contact us via
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex h-[44px] items-center justify-center gap-[8px]
                rounded-[13px]
                border-0 border-none
                bg-[#2B2B2B] px-[18px]
                text-[16px] font-semibold text-white
                shadow-[0_10px_22px_rgba(43,43,43,0.16)]
                transition-colors duration-300
                hover:bg-[#242424]
              "
              aria-label={`Chat with ${agentName} on WhatsApp`}
            >
              <img
                loading="lazy"
                src={icon.whatsappWhite}
                alt=""
                className="w-[22px]"
              />
              <span>Whatsapp</span>
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}