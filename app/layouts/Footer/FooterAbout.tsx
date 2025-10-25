import React, { useState } from "react";
import { Link } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";
import { subscribe } from "~/api/form.service";
import { useNotify } from "~/components/notifications/NotificationsProvider";

export default function FooterAbout() {
  const icon = useIcons();
  const notify = useNotify();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const icons = [
    { icon: icon.facebookFooter, path: "#" },
    { icon: icon.instagramFooter, path: "#" },
    { icon: icon.twitterFooter, path: "#" },
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
    <div className="flex flex-col items-start gap-[23px] lg:gap-[30px] w-full max-w-[456px]">
      <img loading="lazy" src={icon.logoFooter} alt="" className="w-[183px] brightness-[0.7]" />
      <p className="text-[13px] lg:text-[18.7px] leading-[200%]">
        Savoir Properties is committed to delivering a high level of expertise, customer service,
        and attention to detail to the marketing and sales of luxury real estate and rental
        properties <span className="text-[#C6A45A] font-semibold underline">Read More</span>
      </p>

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
          <Link key={index} to={i.path}>
            <img loading="lazy" src={i.icon} alt="" className="w-[35px] lg:w-[48px]" />
          </Link>
        ))}
      </div>
    </div>
  );
}
