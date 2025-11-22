import React, { useRef, useState } from "react";
import useIcons from "~/hooks/imageHooks/useIcons";

import Button from "~/UI/Button";
import { Link } from "react-router";
import BookingInput from "../Project/BookYourViewing/BookingInput";
import BookingCheckbox from "../Project/BookYourViewing/BookingCheckbox";

const DEFAULT_EMAIL = "nain@savoirproperties.com";

export default function OurTeamContact() {
  const icon = useIcons();
  const formRef = useRef<HTMLFormElement>(null);

  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [checked, setChecked] = useState(false);
  const [mixed, setMixed] = useState(true);

  const handleSendEmail = () => {
    if (!DEFAULT_EMAIL || typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const fullName = `${fName.trim()} ${lName.trim()}`.trim() || "Prospective Client";
    
    const subject = `Team Contact Inquiry — ${fullName}`;
    const body = [
      "Dear Savoir Properties Team,",
      "",
      "I hope this message finds you well.",
      "",
      `My name is ${fullName}, and I would like to get in touch with your team.`,
      "",
      "Here are my details:",
      `- First Name: ${fName.trim() || "-"}`,
      `- Last Name: ${lName.trim() || "-"}`,
      `- Email: ${email.trim() || "-"}`,
      `- Phone: ${phone.trim() || "-"}`,
      "",
      "Message:",
      message.trim() || "I am interested in learning more about your services. Please contact me at your earliest convenience.",
      "",
      "Thank you for your time and assistance. I look forward to hearing from you soon.",
      "",
      "Best regards,",
      fullName,
    ].join("\n");

    const mailtoLink = `mailto:${DEFAULT_EMAIL}?subject=${encodeURIComponent(
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
    <div className="flex flex-col items-start gap-[22px] w-full mt-[142px]">
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
              src="https://res.cloudinary.com/djd3y5gzw/image/fetch/f_auto,q_auto,fl_lossy/https%3A%2F%2Fsavoirbucket.s3.eu-north-1.amazonaws.com%2Fstorage%2Fimage%2FAgent%2FuVx9BuxNjc1uBa0dgcVyichT2koE59IPFIUhe5L9.jpg"
              alt=""
              className="w-full aspect-[328/482] rounded-[9px] object-cover"
            />
            <img
              loading="lazy"
              src="https://res.cloudinary.com/djd3y5gzw/image/fetch/f_auto,q_auto,fl_lossy/https%3A%2F%2Fsavoirbucket.s3.eu-north-1.amazonaws.com%2Fstorage%2Fimage%2FAgent%2FuVx9BuxNjc1uBa0dgcVyichT2koE59IPFIUhe5L9.jpg"
              alt=""
              className="w-full aspect-[328/482] rounded-[9px] object-cover rotate-x-180 blur-[50px] absolute left-0 top-[75%]"
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-[64px] w-full">
          <div className="flex flex-col items-start gap-[67px] w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[28px] gap-[20px] lg:gap-y-[75px] w-full">
              <BookingInput
                placeholder="Enter First Name"
                value={fName}
                onChange={setFName}
                name="firstName"
                minLength={2}
                ariaLabel="Enter your first name"
                autoComplete="given-name"
              />
              <BookingInput
                placeholder="Enter last Name"
                value={lName}
                onChange={setLName}
                name="lastName"
                minLength={2}
                ariaLabel="Enter your last name"
                autoComplete="family-name"
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

              <div className="lg:col-span-2">
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
                aria-label="Send your message"
              >
                Send Your Message
              </Button>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-[17px]">
            <p className="text-black text-[18px] font-medium">Or contact us right now via</p>
            <Link
              className="flex items-center gap-[9px]"
              to="https://wa.me/+971542327815"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
            >
              <img loading="lazy" src={icon.whatsappGold} alt="" className="w-[27px]" />
              <p className="text-[#C6A45A] text-[18px] font-medium">Whatsapp</p>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
