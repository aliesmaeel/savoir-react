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
      { icon: icon.contactEmail, text: "info@savoirproperties.com" },
      {
        icon: icon.contactLocation,
        text: "Emaar Business Park, Bldg.4, Office 502, Shk. Zayed Road, Dubai",
      },
    ],
    [icon]
  );

  const social = useMemo(
    () => [
      {
        kind: "facebook",
        label: "Facebook",
        link: "https://www.facebook.com/Savoir-Priv%C3%A9-Properties-114526231138380/",
      },
      {
        kind: "instagram",
        label: "Instagram",
        link: "https://instagram.com/savoirpriveproperties?igshid=MzRlODBiNWFlZA==",
      },
      { kind: "x", label: "X", link: "https://x.com/savoirprive" },
      { kind: "tiktok", label: "TikTok", link: "https://www.tiktok.com/@savoir_properties" },
      { kind: "youtube", label: "YouTube", link: "http://youtube.com/@SavoirPriveProperties" },
    ],
    []
  );

  const renderSocialIcon = (kind: string) => {
    if (kind === "facebook") {
      return <span className="text-[20px] font-bold leading-none lg:text-[24px]">f</span>;
    }

    if (kind === "instagram") {
      return (
        <span className="relative h-[18px] w-[18px] rounded-[5px] border-[2px] border-white lg:h-[22px] lg:w-[22px] lg:rounded-[6px]">
          <span className="absolute left-1/2 top-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] border-white lg:h-[8px] lg:w-[8px]" />
          <span className="absolute right-[3px] top-[3px] h-[3px] w-[3px] rounded-full bg-white" />
        </span>
      );
    }

    if (kind === "youtube") {
      return (
        <span className="flex h-[18px] w-[24px] items-center justify-center rounded-[5px] border-[2px] border-white lg:h-[20px] lg:w-[28px]">
          <span className="ml-[2px] h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-white lg:border-y-[6px] lg:border-l-[10px]" />
        </span>
      );
    }

    return <span className="text-[16px] font-bold leading-none lg:text-[19px]">{kind === "tiktok" ? "t" : "X"}</span>;
  };

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
    <div className="mx-auto mt-[82px] flex w-full max-w-[1080px] flex-col items-start gap-[22px]">
      <div className="relative z-10 flex w-full flex-col items-center gap-[32px] overflow-hidden rounded-[9px] border border-[#9b957f] bg-white p-[10px] lg:flex-row">
        <div
          className="flex flex-col items-start justify-between gap-[20px] p-[16px] lg:p-[34px] w-full lg:max-w-[405px] lg:aspect-[405/560] rounded-[11px] text-white"
          style={{ background: "black" }}
        >
          <div className="flex flex-col items-start gap-[20px] lg:gap-[58px]">
            <div className="flex flex-col items-start gap-[6px]">
              <p className="text-[31px] font-semibold CormorantGaramond">Contact Information</p>
              <p className="text-[21px]">Let's Connect!</p>
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
          <div className="flex gap-[10px]">
            {social.map((s, index) => (
              <a
                key={index}
                href={s.link}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/75 text-white transition-colors duration-300 hover:border-white hover:bg-white/10 lg:h-[52px] lg:w-[52px]"
              >
                {renderSocialIcon(s.kind)}
              </a>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="flex w-full flex-col items-center gap-[42px] relative"
          noValidate
        >
          <div className="flex w-full flex-col items-start gap-[44px]">
            <div className="flex w-full flex-col items-start gap-[20px] lg:gap-[40px]">
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
                className="h-[44px] !rounded-[4px] !bg-[#111111] !px-[78px] !py-[15px] text-[18px] hover:!bg-[#262626]"
                htmlType="submit"
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send Your Message"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-[17px]">
            <p className="text-black text-[18px] font-medium">Or contact us right now via</p>
            <Link
              to="https://wa.me/971505074686"
              target="_blank"
              rel="noreferrer"
              className="flex h-[44px] items-center justify-center gap-[8px] rounded-[13px] bg-[#111111] px-[18px] text-[16px] font-semibold text-white shadow-[0_10px_22px_rgba(17,17,17,0.18)] transition-colors hover:bg-[#000000]"
            >
              <img loading="lazy" src={icon.whatsappWhite} alt="" className="w-[22px]" />
              <span>Whatsapp</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
