import React, { useRef, useState } from "react";
import useIcons from "~/hooks/imageHooks/useIcons";
import BookingInput from "./BookingInput";
import BookingDropdown from "./BookingDropdown";
import BookingCheckbox from "./BookingCheckbox";
import Button from "~/UI/Button";
import { Link, useLoaderData } from "react-router";

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
  phone: "",
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
  const [inquiryType, setInquiryType] = useState(""); // from dropdown
  const [checked, setChecked] = useState(false);
  const [mixed, setMixed] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  // Use provided agent, fallback to property.user, or default agent
  const activeAgent = agent || property?.user || DEFAULT_AGENT;
  const TO_EMAIL = activeAgent.email || DEFAULT_AGENT.email;
  const agentName = activeAgent.name || DEFAULT_AGENT.name;
  const agentImage = activeAgent.image || DEFAULT_AGENT.image;
  const agentRole = activeAgent.Job_Description || DEFAULT_AGENT.Job_Description;
  const agentPhone = activeAgent.phone || "";
  const whatsappLink = agentPhone ? `https://wa.me/${agentPhone}`: undefined;

  const handleSendEmail = () => {
    if (!TO_EMAIL || typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const formattedName = name.trim() || "Prospective Client";
    const propertyTitle = property?.title_en || property?.title || "Property";
    
    const subject = `Property Inquiry — ${formattedName} - ${propertyTitle}`;
    const body = [
      "Dear Savoir Properties Team,",
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
      message.trim() || "I am interested in scheduling a viewing. Please let me know available slots.",
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
    <div className="flex flex-col items-start gap-[22px] w-full mt-[75px]">
      <div className="flex flex-col items-start gap-[7px]">
        <p className="text-[36px] font-semibold">Book your viewing</p>
        <p className="text-[#999999] text-[13px] font-medium">
          And our agent will show you property
        </p>
      </div>
      <form
        ref={formRef}
        onSubmit={handleFormSubmit}
        className="flex items-center gap-[28px] w-full px-[24px] pt-[40px] pb-[22px] rounded-[9px] border border-[#C6A45A] overflow-hidden relative z-10"
        noValidate={false}
      >
        <img
          loading="lazy"
          src={icon.Ellipse8}
          alt=""
          className="absolute bottom-0 right-0 z-[-1] hidden lg:block"
        />
        <div className="hidden lg:flex flex-col items-center gap-[12px] w-full max-w-[347px]">
          <div className="relative z-10">
            <img
              loading="lazy"
              src={agentImage}
              alt={agentName}
              className="w-full aspect-[347/429] rounded-[9px] object-cover"
            />
            <img
              loading="lazy"
              src={agentImage}
              alt=""
              className="w-full aspect-[347/429] rounded-[9px] object-cover rotate-x-180 blur-[50px] absolute left-0 top-[75%]"
            />
          </div>
          <div className="flex flex-col items-center gap-[3px] relative z-10">
            <p className="text-[30px] font-medium text-white">{agentName}</p>
            <p className="text-[#505050] text-[27px] text-white">{agentRole}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-[64px] w-full">
          <div className="flex flex-col items-start gap-[67px] w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-[28px] gap-[20px] lg:gap-y-[75px] w-full">
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
              <div className="lg:col-span-3">
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

            <div className="flex flex-col lg:flex-row items-center justify-between gap-[10px] w-full">
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
                className="!rounded-[4px] lg:!px-[78px] !py-[15px] h-[44px] text-[18px]"
                htmlType="submit"
                aria-label={`Send email to ${agentName}`}
              >
                Send Your Message
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-[17px]">
            <p className="text-black text-[18px] font-medium">Or contact us right now via</p>
            {whatsappLink ? (
              <Link
                to={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[9px]"
                aria-label={`Chat with ${agentName} on WhatsApp`}
              >
                <img loading="lazy" src={icon.whatsappGold} alt="" className="w-[27px]" />
                <p className="text-[#C6A45A] text-[18px] font-medium">Whatsapp</p>
              </Link>
            ) : (
              <div className="flex items-center gap-[9px]">
                <img loading="lazy" src={icon.whatsappGold} alt="" className="w-[27px]" />
                <p className="text-[#C6A45A] text-[18px] font-medium">Whatsapp</p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
