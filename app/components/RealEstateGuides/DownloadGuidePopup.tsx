import React, { useState } from "react";
import BookingInput from "../Project/BookYourViewing/BookingInput";
import Button from "~/UI/Button";
import { trackGuideDownload } from "~/api/realEstateGuides.service";
import { useNotify } from "../notifications/NotificationsProvider";

type Props = {
  guideId: number | string;
  brochureName: string;
  onClose: () => void;
  onDownload: () => void;
};

export default function DownloadGuidePopup({
  guideId,
  brochureName,
  onClose,
  onDownload,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const notify = useNotify();

  const validate = () => {
    if (!name.trim()) return "Name is required.";
    if (!email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Email is invalid.";
    if (!phone.trim()) return "Phone is required.";
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
      await trackGuideDownload({
        email: email.trim(),
        name: name.trim(),
        phone: phone.trim(),
        brochure_name: brochureName,
      });

      notify.success("Thank you! Downloading your guide...");
      onClose();
      onDownload();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to submit information.";
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
      <Button
        className="!rounded-[4px] !px-[78px] !py-[15px] h-[44px] text-[18px] w-full"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Download Guide"}
      </Button>
    </div>
  );
}

