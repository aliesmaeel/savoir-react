import React, { useState } from "react";
import { Link } from "react-router";
import BookingInput from "~/components/Project/BookYourViewing/BookingInput";
import useIcons from "~/hooks/imageHooks/useIcons";
import Button from "~/UI/Button";

export default function ContactMember() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const icon = useIcons();
  return (
    <div className="flex flex-col items-start gap-[52px] px-[24px] py-[30px] border border-[#C6A45A] rounded-[15px] w-full lg:w-[439px] shrink-0 bg-[#FBFBFB] relative overflow-hidden z-10">
      <div className="flex flex-col items-start gap-[20px] w-full">
        <div className="flex flex-col items-start w-full">
          <p className="text-[30px] font-semibold">Prompt consultation :</p>
          <p className="text-[21px]">Fill form below and our agent will contact you shortly</p>
        </div>
        <div className="flex flex-col items-start gap-[22px] w-full">
          <BookingInput placeholder="Enter last Name" value={name} onChange={setName} />
          <BookingInput placeholder="Enter Phone Number" value={phone} onChange={setPhone} />
          <BookingInput placeholder="Enter your Email" value={email} onChange={setEmail} />
        </div>
      </div>
      <div className="flex flex-col items-start gap-[24px] w-full">
        <Button className="!rounded-[4px] !px-[78px] !py-[15px] h-[44px] text-[18px] w-full">
          Send Your Message
        </Button>
        <div className="flex flex-col items-center gap-[15px] w-full">
          <p className="text-black text-[18px] font-medium">Or contact us right now via</p>
          <Link to="#" className="flex items-center gap-[9px]">
            <img loading="lazy" src={icon.whatsappGold} alt="" className="w-[27px]" />
            <p className="text-[#C6A45A] text-[18px] font-medium">Whatsapp</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
