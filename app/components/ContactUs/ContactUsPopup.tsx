import React, { useState } from "react";
import BookingInput from "../Project/BookYourViewing/BookingInput";
import Button from "~/UI/Button";
import BookingSelect from "../Project/BookYourViewing/BookingSelect";
import { contactUs } from "~/api/form.service";
import { useNotify } from "../notifications/NotificationsProvider";

export default function ContactUsPopup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = React.useState("");
  const [submitting, setSubmitting] = useState(false);
  const notify = useNotify();

  const validate = () => {
    if (!name.trim()) return "Name is required.";
    if (!email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Email is invalid.";
    if (!message.trim()) return "Message is required.";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      notify.error(validationError, 4000);
      return;
    }

    setSubmitting(true);
    try {
      await contactUs({
        type: "talk_to_expert",
        email: email.trim(),
        name: name.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });

      notify.success("Enquiry sent successfully.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to send enquiry.";
      notify.error(msg, 6000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-[25px] w-full px-[45px] pb-[82px]">
      <BookingInput placeholder="Enter Full Name" value={name} onChange={setName} />
      <BookingInput type="tel" placeholder="Enter Phone Number" value={phone} onChange={setPhone} />
      <BookingInput type="email" placeholder="Enter your Email" value={email} onChange={setEmail} />
      <BookingInput
        type="textAria"
        placeholder="Enter your Message here.."
        value={message}
        onChange={setMessage}
      />
      <Button
        className="!rounded-[4px] !px-[78px] !py-[15px] h-[44px] text-[18px] w-full"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "Sending..." : "Send Enquiry"}
      </Button>
    </div>
  );
}
