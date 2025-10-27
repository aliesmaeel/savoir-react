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
      `Hello Savoir Properties\n` +
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
        <p className="text-[12px] lg:text-[24px] font-medium">What are you interested in?</p>

        <div className="grid grid-cols-2 gap-[29px] lg:gap-[50px] w-full">
          <div className="grid grid-cols-2 gap-[2px] lg:gap-[9px] w-full">
            {type1.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType1(type)}
                className={`flex items-center justify-center w-full h-[33px] lg:h-[64px] rounded-[4px] lg:rounded-[9px] border border-[#353635] ${type === selectedType1 ? "bg-[#C6A45A99]" : "bg-white"}`}
              >
                <p className="text-[8px] lg:text-[16px] font-medium">{type}</p>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-[2px] lg:gap-[9px] w-full">
            {type2.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType2(type)}
                className={`flex items-center justify-center w-full h-[33px] lg:h-[64px] rounded-[4px] lg:rounded-[9px] border border-[#353635] ${type === selectedType2 ? "bg-[#C6A45A99]" : "bg-white"}`}
              >
                <p className="text-[8px] lg:text-[16px] font-medium">{type}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start w-full gap-2">
        <p className="text-[#666] text-[19px] font-medium">Enter Phone Number</p>
        <BookingInput type="text" value={name} onChange={setName} placeholder="Enter Full Name" />
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
