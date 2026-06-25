import React, { useState, useMemo } from "react";
import BookingInput from "~/components/Project/BookYourViewing/BookingInput";
import useIcons from "~/hooks/imageHooks/useIcons";
import Button from "~/UI/Button";

type Props = {
  /** E.164 without '+' e.g. '971563562537' */
  recipientNumber: string;
};

export default function OffPlanPopup({ recipientNumber }: Props) {
  const icon = useIcons();
  const [selectedType1, setSelectedType1] = useState("Buy");
  const [selectedType2, setSelectedType2] = useState("Residential");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const type1 = ["Buy", "Rent"];
  const type2 = ["Residential", "Commercial"];

  const canSend = name.trim() && phone.trim();

  const waHref = useMemo(() => {
    const msg =
      `Hello SAVOIR\n` +
      `My Name is: ${name}\n` +
      `I'm Interest in: ${selectedType1} / ${selectedType2}\n` +
      `This is my phone number: ${phone}`;
    return `https://wa.me/${recipientNumber}?text=${encodeURIComponent(msg)}`;
  }, [recipientNumber, selectedType1, selectedType2, name, phone]);

  const handleWhatsapp = () => {
    if (!canSend) return;
    // open WhatsApp Web / app
    window.open(waHref, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col items-start gap-[55px] w-full px-[21px] lg:px-[40px] pt-[61px] pb-[104px]">
      <div className="flex flex-col items-start gap-[10px] lg:gap-[21px] w-full">
        <div className="flex w-full flex-col items-start gap-[10px] lg:gap-[14px]">
          <p className="text-[12px] font-medium lg:text-[24px]">Enter your name</p>
          <BookingInput type="text" value={name} onChange={setName} placeholder="Enter your name" />
        </div>


      </div>

      <div className="flex w-full flex-col items-start gap-2">
        <p className="text-[19px] font-medium text-[#666]">Enter Phone Number</p>
        <BookingInput
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="Enter Phone number"
        />
      </div>

      <Button
        className={`w-full gap-[6px] !py-[8px] !text-[18px] ${!canSend ? "opacity-60 pointer-events-none" : ""}`}
        onClick={handleWhatsapp}
        aria-disabled={!canSend}
      >
        <img loading="lazy" src={icon.whatsappWhite} alt="" className="w-[27px]" />
        Whatsapp
      </Button>
    </div>
  );
}
