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
    {
      icon: icon.facebook,
      path: "https://www.facebook.com/Savoir-Priv%C3%A9-Properties-114526231138380/",
    },
    {
      icon: icon.instagram,
      path: "https://instagram.com/savoirpriveproperties?igshid=MzRlODBiNWFlZA==",
    },
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
    <div className="flex w-full max-w-[456px] flex-col items-start gap-[23px] lg:gap-[30px]">
      <img
        loading="lazy"
        src={icon.logoFooterPriveClean}
        alt=""
        className="w-[168px] translate-y-[8px] lg:w-[172px]"
      />

      <p
        className="text-[13px] leading-[200%] lg:text-[18.7px]"
        style={{
          color: "#000000",
          fontWeight: 600,
          opacity: 1,
        }}
      >
        SAVOIR is committed to delivering a high level of expertise, customer service,
        and attention to details{" "}
        <Link
          to="/about-us"
          className="underline"
          style={{
            color: "#000000",
            fontWeight: 700,
            opacity: 1,
          }}
        >
          Read More
        </Link>
      </p>

      <div className="flex h-[42px] w-full max-w-[305px] items-center overflow-hidden rounded-full border border-[#2B2B2B] bg-white shadow-[0_10px_24px_rgba(43,43,43,0.08)] lg:h-[52px] lg:max-w-[330px]">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={onKeyDown}
          className="h-full w-full border-0 bg-white px-[18px] text-[14px] font-medium text-[#111111] outline-0 placeholder:text-[#111111]/65 lg:px-[22px] lg:text-[16px]"
          placeholder="Your email"
          aria-label="Email address"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex h-full shrink-0 items-center justify-center bg-[#2B2B2B] px-[18px] text-white transition-colors duration-300 hover:bg-[#242424] disabled:opacity-60 lg:px-[22px]"
        >
          <p className="text-[13px] font-semibold text-white lg:text-[15px]">
            {loading ? "..." : "Subscribe"}
          </p>
        </button>
      </div>

      <div className="flex items-center gap-[14px] lg:gap-[19px]">
        {icons.map((i, index) => (
          <a
            key={index}
            href={i.path}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center rounded-full transition-all duration-300 hover:scale-[1.08]"
          >
            <img
              loading="lazy"
              src={i.icon}
              alt=""
              className="h-[35px] w-[35px] object-contain brightness-0 opacity-[0.82] contrast-[1.15] lg:h-[48px] lg:w-[48px]"
            />
          </a>
        ))}
      </div>
    </div>
  );
}