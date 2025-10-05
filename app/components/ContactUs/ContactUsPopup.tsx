import React, { useState } from "react";
import BookingInput from "../Project/BookYourViewing/BookingInput";
import Button from "~/UI/Button";
import BookingSelect from "../Project/BookYourViewing/BookingSelect";

export default function ContactUsPopup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = React.useState("");
  return (
    <div className="flex flex-col items-start gap-[25px] w-full px-[45px] pb-[82px]">
      <BookingInput placeholder="Enter Full Name" value={name} onChange={setName} />
      <BookingInput type="tel" placeholder="Enter Phone Number" value={phone} onChange={setPhone} />
      <BookingInput placeholder="Enter your Email" value={email} onChange={setEmail} />
      <BookingSelect
        placeholder="Select Categories"
        value={selected}
        onChange={setSelected}
        white={false}
        options={[
          { label: "Category 1", value: "Category 1" },
          { label: "Category 2", value: "Category 2" },
          { label: "Category 3", value: "Category 3" },
        ]}
      />
      <BookingInput
        type="textAria"
        placeholder="Enter your Message here.."
        value={message}
        onChange={setMessage}
      />
      <Button className="!rounded-[4px] !px-[78px] !py-[15px] h-[44px] text-[18px] w-full">
        Send Enquiry
      </Button>
    </div>
  );
}
