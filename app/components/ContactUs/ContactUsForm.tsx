import { useState, useMemo } from "react";
import useIcons from "~/hooks/imageHooks/useIcons";

import Button from "~/UI/Button";
import { Link } from "react-router";
import BookingInput from "../Project/BookYourViewing/BookingInput";
import { useNotify } from "../notifications/NotificationsProvider";
import { contactUs } from "~/api/form.service";

// adjust the import path to wherever you defined contactUs()

export default function ContactUsForm() {
  const icon = useIcons();
  const notify = useNotify();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const items = useMemo(
    () => [
      { icon: icon.contactPhone, text: "+971505074686" },
      { icon: icon.contactEmail, text: "info@saviorproperties.com" },
      {
        icon: icon.contactLocation,
        text: "Emaar Business Park, Bldg.4 - Office 502A Shk. Zayed Road - Dubai",
      },
    ],
    [icon]
  );

  const social = useMemo(
    () => [
      {
        icon: icon.contactLinkedin,
        link: "https://www.facebook.com/Savoir-Priv%C3%A9-Properties-114526231138380/",
      },
      {
        icon: icon.contactInstagram,
        link: "https://instagram.com/savoirpriveproperties?igshid=MzRlODBiNWFlZA==",
      },
      { icon: icon.contactTwitter, link: "" },
    ],
    [icon]
  );

  function validate() {
    if (!name.trim()) return "Name is required.";
    if (!email.trim()) return "Email is required.";
    // simple RFC5322-lite check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Email is invalid.";
    if (!message.trim()) return "Message is required.";
    return null;
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const v = validate();
    if (v) {
      notify.error(v, 4000);
      return;
    }

    setSubmitting(true);
    try {
      await contactUs({
        type: "contact_us",
        email: email.trim(),
        name: name.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });

      notify.success("Message sent.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to send message.";
      notify.error(msg, 6000);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-[22px] w-full mt-[112px]">
      <div className="flex flex-col lg:flex-row items-center gap-[39px] w-full p-[11px] rounded-[9px] border border-[#C6A45A] overflow-hidden relative z-10">
        <img
          loading="lazy"
          src={icon.Ellipse8}
          alt=""
          className="absolute bottom-0 right-0 z-[-1]"
        />
        <div
          className="flex flex-col items-start justify-between gap-[20px] p-[16px] lg:p-[44px] w-full lg:max-w-[490px] lg:aspect-[490/727] rounded-[11px] text-white"
          style={{ background: "linear-gradient(170deg, #C6A45A 7.6%, #FFF 168.8%)" }}
        >
          <div className="flex flex-col items-start gap-[20px] lg:gap-[98px]">
            <div className="flex flex-col items-start gap-[6px]">
              <p className="text-[31px] font-semibold Theseasons">Contact Information</p>
              <p className="text-[21px]">Say something to start a live chat!</p>
            </div>
            <div className="flex flex-col items-start gap-[20px] lg:gap-[48px]">
              {items.map((item, index) => (
                <div key={index} className="flex items-start gap-[24px]">
                  <img loading="lazy"  src={item.icon} alt="" />
                  <div className="text-[17px]">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-[19px]">
            {social.map((s, index) => (
              <Link key={index} to={s.link} target="_blank" rel="noreferrer">
                <img loading="lazy" width={'35px'} height={'35px'}  src={s.icon} alt="" />
              </Link>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col items-center gap-[64px] w-full relative"
          noValidate
        >
          <img
            loading="lazy"
            src="/images/icons/popupPaterrn.svg"
            alt=""
            className="absolute bottom-0 right-0 z-[-1]"
          />
          <div className="flex flex-col items-start gap-[67px] w-full">
            <div className="flex flex-col items-start gap-[20px] lg:gap-[54px] w-full">
              <BookingInput
                placeholder="Enter Full Name"
                value={name}
                onChange={setName}
                name="name"
                required
                minLength={2}
                autoComplete="name"
                ariaLabel="Enter your full name"
              />
              <BookingInput
                type="tel"
                placeholder="Enter Phone Number"
                value={phone}
                onChange={setPhone}
                name="phone"
                autoComplete="tel"
                ariaLabel="Enter your phone number"
                inputMode="tel"
              />
              <BookingInput
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={setEmail}
                name="email"
                required
                autoComplete="email"
                ariaLabel="Enter your email address"
              />
              <BookingInput
                type="textAria"
                placeholder="Enter your Message here.."
                value={message}
                onChange={setMessage}
                name="message"
                required
                minLength={10}
                ariaLabel="Enter your message"
              />
            </div>

            <div className="flex items-center justify-center lg:justify-end w-full">
              <Button
                className="!rounded-[4px] !px-[78px] !py-[15px] h-[44px] text-[18px]"
                htmlType="submit"
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send Your Message"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-[17px]">
            <p className="text-black text-[18px] font-medium">Or contact us right now via</p>
            <Link to="#" className="flex items-center gap-[9px]">
              <img loading="lazy" src={icon.whatsappGold} alt="" className="w-[27px]" />
              <p className="text-[#C6A45A] text-[18px] font-medium">Whatsapp</p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
