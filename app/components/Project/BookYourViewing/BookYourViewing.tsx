import React, { useState } from "react";
import useIcons from "~/hooks/imageHooks/useIcons";
import BookingInput from "./BookingInput";
import BookingDropdown from "./BookingDropdown";
import BookingCheckbox from "./BookingCheckbox";
import Button from "~/UI/Button";
import { Link } from "react-router";

export default function BookYourViewing() {
  const icon = useIcons();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [checked, setChecked] = useState(false);
  const [mixed, setMixed] = useState(true);

  return (
    <div className="flex flex-col items-start gap-[22px] w-full mt-[75px]">
      <div className="flex flex-col items-start gap-[7px]">
        <p className="text-[36px] font-semibold">Book your viewing</p>
        <p className="text-[#999999] text-[13px] font-medium">
          And our agent will show you property
        </p>
      </div>
      <div className="flex items-center gap-[28px] w-full px-[24px] pt-[40px] pb-[22px] rounded-[9px] border border-[#C6A45A] overflow-hidden relative z-10">
        <img src={icon.Ellipse8} alt="" className="absolute bottom-0 right-0 z-[-1]" />
        <div className="flex flex-col items-center gap-[12px] w-full max-w-[347px]">
          <div className="relative z-10">
            <img
              src="/images/placeholders/user.webp"
              alt=""
              className="w-full aspect-[347/429] rounded-[9px] object-cover"
            />
            <img
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
            <div className="grid grid-cols-3 gap-x-[28px] gap-y-[75px] w-full">
              <BookingInput placeholder="Enter Full Name" value={name} onChange={setName} />
              <BookingInput placeholder="Enter your Email" value={email} onChange={setEmail} />
              <BookingDropdown placeholder="Select Inquiry Type" />
              <BookingInput placeholder="Enter Phone Number" value={phone} onChange={setPhone} />
              <BookingInput
                type="date"
                placeholder="Enter Phone Number"
                value={date}
                onChange={setDate}
              />
              <BookingInput
                type="time"
                placeholder="Enter Phone Number"
                value={time}
                onChange={setTime}
              />

              <div className="col-span-3">
                <BookingInput
                  type="textAria"
                  placeholder="Enter your Message here.."
                  value={message}
                  onChange={setMessage}
                />
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
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
              <Button className="!rounded-[4px] !px-[78px] !py-[15px] h-[44px] text-[18px]">
                Send Your Message
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-[17px]">
            <p className="text-black text-[18px] font-medium">Or contact us right now via</p>
            <Link to="#" className="flex items-center gap-[9px]">
              <img src={icon.whatsappGold} alt="" className="w-[27px]" />
              <p className="text-[#C6A45A] text-[18px] font-medium">Whatsapp</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
