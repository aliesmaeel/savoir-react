import React, { useState } from "react";
import BookingInput from "../Project/BookYourViewing/BookingInput";
import Button from "~/UI/Button";
import { contactUs } from "~/api/form.service";
import { useNotify } from "../notifications/NotificationsProvider";

export default function PopularRegisterWithUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const notify = useNotify();

  const validate = () => {
    if (!name.trim()) return "Name is required.";
    if (!email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Email is invalid.";
    if (!phone.trim()) return "Phone number is required.";
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
        type: "register_with_us",
        email: email.trim(),
        name: name.trim(),
        phone: phone.trim(),
      });

      notify.success("Enquiry sent successfully.");
      setName("");
      setEmail("");
      setPhone("");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to send enquiry.";
      notify.error(msg, 6000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-[44px] w-full max-w-[460px] p-[17px] pb-[28px] rounded-[20px] bg-[#FFFFFF40] backdrop-blur-[10px] relative z-20">
      <div className="flex flex-col items-start gap-[22px] w-full">
        <p className="text-white text-[27px] font-medium leading-[50.628%]">REGISTER WITH US</p>

        <BookingInput white={true} placeholder="Enter Full Name" value={name} onChange={setName} />
        <BookingInput
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="Enter Phone number"
          white
        />

        <BookingInput
          white={true}
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={setEmail}
        />
      </div>
      <Button className="w-full !rounded-[10px]" onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Sending..." : "Send Enquiry"}
      </Button>
    </div>
  );
}
