import React, { useState } from "react";
import BookingInput from "~/components/Project/BookYourViewing/BookingInput";
import useIcons from "~/hooks/imageHooks/useIcons";
import Button from "~/UI/Button";

export default function OffPlanPopup() {
  const icon = useIcons();
  const [selectedType1, setSelectedType1] = useState("Buy");
  const [selectedType2, setSelectedType2] = useState("Residential");
  const [phone, setPhone] = useState("");

  const type1 = ["Buy", "Rent"];
  const type2 = ["Residential", "Commercial"];

  return (
    <div className="flex flex-col items-start gap-[55px] w-full px-[21px] lg:px-[40px] pt-[61px] pb-[104px]">
      <div className="flex flex-col items-start  gap-[10px] lg:gap-[21px] w-full">
        <p className="text-[12px] lg:text-[24px] font-medium">What are you interested in?</p>
        <div className="grid grid-cols-2 gap-[29px] lg:gap-[50px] w-full">
          <div className="grid grid-cols-2 gap-[2px] lg:gap-[9px] w-full">
            {type1.map((type: string) => (
              <button
                onClick={() => setSelectedType1(type)}
                className={`flex items-center justify-center w-full h-[33px] lg:h-[64px] rounded-[4px] lg:rounded-[9px] border border-[#353635] ${type === selectedType1 ? "bg-[#C6A45A99]" : "bg-white"}`}
              >
                <p className="text-[8px] lg:text-[16px] font-medium">{type}</p>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-[2px] lg:gap-[9px] w-full">
            {type2.map((type: string) => (
              <button
                onClick={() => setSelectedType2(type)}
                className={`flex items-center justify-center w-full h-[33px] lg:h-[64px] rounded-[4px] lg:rounded-[9px] border border-[#353635] ${type === selectedType2 ? "bg-[#C6A45A99]" : "bg-white"}`}
              >
                <p className="text-[8px] lg:text-[16px] font-medium">{type}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start w-full">
        <p className="text-[#666] text-[19px] font-medium">Enter Phone Number</p>
        <BookingInput
          type="tel"
          value={phone}
          onChange={setPhone} // gets a string like "+971563562537"
          placeholder="Enter Phone number"
        />
      </div>
      <Button className="w-full gap-[6px] !py-[8px] !text-[18px]">
        <img loading="lazy" src={icon.whatsappWhite} alt="" className="w-[27px]" />
        Whatsapp
      </Button>
    </div>
  );
}
