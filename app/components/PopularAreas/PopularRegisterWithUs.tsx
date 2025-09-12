import React, { useState } from "react";
import BookingInput from "../Project/BookYourViewing/BookingInput";
import Button from "~/UI/Button";

export default function PopularRegisterWithUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="flex flex-col gap-[44px] w-full max-w-[744px] p-[37px] pb-[28px] rounded-[20px] bg-[#FFFFFF40] backdrop-blur-[10px] relative z-20">
      <div className="flex flex-col items-start gap-[22px] w-full">
        <p className="text-white text-[27px] font-medium leading-[50.628%]">REGISTER WITH US</p>

        <BookingInput white={true} placeholder="Enter Full Name" value={name} onChange={setName} />
        <BookingInput
          type="tel"
          value={phone}
          onChange={setPhone} // gets a string like "+971563562537"
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
      <Button className="w-full !rounded-[10px]">Send Enquiry</Button>
    </div>
  );
}
