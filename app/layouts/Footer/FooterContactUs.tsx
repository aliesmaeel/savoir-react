import React, { useState } from "react";
import { Link } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";
import { subscribe } from "~/api/form.service";
import { useNotify } from "~/components/notifications/NotificationsProvider";

export default function FooterContactUs() {
  const icon = useIcons();
  const notify = useNotify();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const icons = [
    { icon: icon.facebook, path: "https://www.facebook.com/Savoir-Priv%C3%A9-Properties-114526231138380/" },
    { icon: icon.instagram, path: "https://instagram.com/savoirpriveproperties?igshid=MzRlODBiNWFlZA==" },
    { icon: icon.x, path: "https://x.com/savoirprive" },
    { icon: icon.tiktok, path: "https://www.tiktok.com/@savoir_properties" },
    { icon: icon.youtube, path: "http://youtube.com/@SavoirPriveProperties" },
  ];

  const validEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v);

  const handleSubmit = async () => {
    if (!validEmail(email)) {
      notify.error("Enter a valid email.");
      return;
    }
    try {
      setLoading(true);
      await subscribe({ email });
      setEmail("");
      notify.success("Subscribed.");
    } catch (e: any) {
      notify.error(e?.response?.data?.message || e?.message || "Subscription failed.");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="flex flex-col items-start gap-[8px] lg:gap-[20px] w-full max-w-[272px]">
      <p className="text-[#C6A45A]  text-[14px] lg:text-[24px] font-semibold">Contact Us</p>
      <div className="flex flex-col items-start gap-[20px] lg:gap-[27px] w-full">
        <Link to={`tel:+71505074686`} className="flex items-center gap-[10px]">
          <img loading="lazy" src={icon.phoneGold} alt="" className="w-[16px] lg:w-[18px]" />
          <p className="text-[16px] lg:text-[18px] underline">+971505074686</p>
        </Link>
        <Link to={`mailto:info@saviorproperties.com`} className="flex items-center gap-[10px]">
          <img loading="lazy" src={icon.emailGold} alt="" className="w-[16px] lg:w-[18px]" />
          <p className="text-[16px] lg:text-[18px]">info@saviorproperties.com</p>
        </Link>
      </div>

      <div className="flex items-center w-full rounded-full border border-[#C6A45A] bg-[#ebebeb] h-[39px] lg:h-[54px] overflow-hidden">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={onKeyDown}
          className="border-0 outline-0 px-[16px] lg:px-[22px] py-[11px] lg:py-[15px] text-[14px] lg:text-[16px] w-full"
          placeholder="Your email"
          aria-label="Email address"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="py-[11px] lg:py-[15px] pr-[7px] lg:pr-[10px] pl-[13px] lg:pl-[18px] bg-[#C6A45A] h-[39px] lg:h-[54px] disabled:opacity-60"
        >
          <p className="text-[14px] lg:text-[16px]">{loading ? "..." : "Subscribe"}</p>
        </button>
        
      </div>

      <div className="flex items-center gap-[14px] lg:gap-[19px]">
        {icons.map((i, index) => (
          <a key={index} href={i.path} target="_blank" rel="noreferrer">
            <img loading="lazy" src={i.icon} alt="" className="w-[35px] h-[35px] lg:w-[48px] lg:h-[48px]" />
          </a>
        ))}
      </div>
      <div className="flex flex-col gap-[10px] bg-[#B59B62]">
        <img loading="lazy" src="/images/footer2.png" alt="" className="w-full" />
      </div>
    </div>
  );
}
