import React, { useState } from "react";
import useIcons from "~/hooks/imageHooks/useIcons";
import BookingInput from "./BookingInput";
import BookingDropdown from "./BookingDropdown";
import BookingCheckbox from "./BookingCheckbox";
import Button from "~/UI/Button";
import { Link } from "react-router";

const TO_EMAIL = "info@savoirproperties.com"; // <-- set your recipient address

export default function BookYourViewing() {
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

  function handleSubmit() {
    // basic guards
    if (!checked) {
      alert("Please agree to the Terms and Privacy Policy.");
      return;
    }
    if (!name || !email) {
      alert("Full Name and Email are required.");
      return;
    }

    const subject = `Property Inquiry — ${name}`;
    const body = [
      "Dear Savoir Properties Team,",
      "",
      "I hope this message finds you well.",
      "",
      `My name is ${name}, and I would like to inquire about one of your properties.`,
      "",
      "Here are my details:",
      `- Full Name: ${name}`,
      `- Email: ${email}`,
      `- Phone: ${phone || "-"}`,
      `- Inquiry Type: ${inquiryType || "-"}`,
      `- Date: ${date || "-"}`,
      `- Time: ${time || "-"}`,
      "",
      "Message:",
      message || "I am interested in scheduling a viewing. Please let me know available slots.",
      "",
      "Thank you for your time and assistance. I look forward to hearing from you soon.",
      "",
      "Best regards,",
      name,
    ].join("\n");

    const mailto = `mailto:${TO_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // open default email client with prefilled draft
    window.location.href = mailto;
  }

  return (
    <div className="flex flex-col items-start gap-[22px] w-full mt-[75px]">
      <div className="flex flex-col items-start gap-[7px]">
        <p className="text-[36px] font-semibold">Book your viewing</p>
        <p className="text-[#999999] text-[13px] font-medium">
          And our agent will show you property
        </p>
      </div>
      <div className="flex items-center gap-[28px] w-full px-[24px] pt-[40px] pb-[22px] rounded-[9px] border border-[#C6A45A] overflow-hidden relative z-10">
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
              src="/images/placeholders/user.webp"
              alt=""
              className="w-full aspect-[347/429] rounded-[9px] object-cover"
            />
            <img
              loading="lazy"
              src="/images/placeholders/user.webp"
              alt=""
              className="w-full aspect-[347/429] rounded-[9px] object-cover rotate-x-180 blur-[50px] absolute left-0 top-[75%]"
            />
          </div>
          <div className="flex flex-col items-center gap-[3px] relative z-10">
            <p className="text-[30px] font-medium">Wade Warren</p>
            <p className="text-[#505050] text-[27px]">Property Consultant</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-[64px] w-full">
          <div className="flex flex-col items-start gap-[67px] w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-[28px] gap-[20px] lg:gap-y-[75px] w-full">
              <BookingInput placeholder="Enter Full Name" value={name} onChange={setName} />
              <BookingInput placeholder="Enter your Email" value={email} onChange={setEmail} />
              <BookingDropdown
                placeholder="Select Inquiry Type"
                value={inquiryType}
                onChange={setInquiryType}
                options={[
                  { label: "Request for Viewing", value: "Request for Viewing" },
                  { label: "More Information", value: "More Information" },
                ]}
              />
              <BookingInput placeholder="Enter Phone Number" value={phone} onChange={setPhone} />
              <BookingInput type="date" placeholder="Select Date" value={date} onChange={setDate} />
              <BookingInput type="time" placeholder="Select Time" value={time} onChange={setTime} />
              <div className="lg:col-span-3">
                <BookingInput
                  type="textAria"
                  placeholder="Enter your Message here.."
                  value={message}
                  onChange={setMessage}
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
                onClick={handleSubmit}
              >
                Send Your Message
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-[17px]">
            <p className="text-black text-[18px] font-medium">Or contact us right now via</p>
            <Link to="#" className="flex items-center gap-[9px]">
              <img loading="lazy" src={icon.whatsappGold} alt="" className="w-[27px]" />
              <p className="text-[#C6A45A] text-[18px] font-medium">Whatsapp</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
