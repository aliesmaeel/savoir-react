import React, { useRef, useState } from "react";
import useIcons from "~/hooks/imageHooks/useIcons";

import Button from "~/UI/Button";
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
      "Dear SAVOIR Team,",
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
      message.trim() ||
        "I am interested in learning more about your services. Please contact me at your earliest convenience.",
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
    <div className="mx-auto mt-[92px] flex w-full max-w-[1080px] flex-col items-start gap-[22px]">
      <form
        ref={formRef}
        onSubmit={handleFormSubmit}
        className="relative z-10 flex w-full items-center gap-[24px] overflow-hidden rounded-[9px] border border-[#111111] bg-white px-[20px] py-[24px]"
        noValidate={false}
      >
        <div className="hidden w-full max-w-[280px] flex-col items-center gap-[12px] lg:flex">
          <div className="relative z-10">
            <img
              loading="lazy"
              src="https://res.cloudinary.com/djd3y5gzw/image/fetch/f_auto,q_auto,fl_lossy/https%3A%2F%2Fsavoirbucket.s3.eu-north-1.amazonaws.com%2Fstorage%2Fimage%2FAgent%2FuVx9BuxNjc1uBa0dgcVyichT2koE59IPFIUhe5L9.jpg"
              alt=""
              className="aspect-[328/440] w-full rounded-[9px] object-cover"
            />

            <img
              loading="lazy"
              src="https://res.cloudinary.com/djd3y5gzw/image/fetch/f_auto,q_auto,fl_lossy/https%3A%2F%2Fsavoirbucket.s3.eu-north-1.amazonaws.com%2Fstorage%2Fimage%2FAgent%2FuVx9BuxNjc1uBa0dgcVyichT2koE59IPFIUhe5L9.jpg"
              alt=""
              className="absolute left-0 top-[75%] aspect-[328/440] w-full rotate-x-180 rounded-[9px] object-cover blur-[50px]"
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-[40px]">
          <div className="flex w-full flex-col items-start gap-[42px]">
            <div className="grid w-full grid-cols-1 gap-[20px] gap-x-[28px] lg:grid-cols-2 lg:gap-y-[46px]">
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

            <div className="flex w-full flex-col items-center justify-between gap-[14px] lg:flex-row">
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
                  h-[42px]
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
                aria-label="Send your message"
              >
                Send Your Message
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-[17px] lg:flex-row">
            <p
              className="text-[18px]"
              style={{
                color: "#111111",
                fontWeight: 600,
                opacity: 1,
              }}
            >
              Or contact us via
            </p>

            <a
              href="https://wa.me/971542327815"
              target="_blank"
              rel="noreferrer"
              aria-label="Chat with us on WhatsApp"
              className="
                flex h-[42px] items-center justify-center gap-[8px]
                rounded-[13px] bg-[#2B2B2B] px-[18px]
                text-[16px] font-semibold text-white
                shadow-[0_10px_22px_rgba(43,43,43,0.18)]
                transition-colors hover:bg-[#242424]
              "
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