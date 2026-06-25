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
    <div className="flex flex-col items-start gap-[23px] lg:gap-[30px] w-full max-w-[456px]">
      <img
        loading="lazy"
        src={icon.logoFooter}
        alt=""
        className="w-[183px] brightness-[0.58] contrast-[1.3]"
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

      <div className="flex items-center w-full rounded-full border border-black bg-white h-[39px] lg:h-[54px] overflow-hidden">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-full border-0 bg-white px-[16px] py-[11px] text-[14px] text-black outline-0 placeholder:text-black/70 lg:px-[22px] lg:py-[15px] lg:text-[16px]"
          placeholder="Your email"
          aria-label="Email address"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="h-[39px] bg-black py-[11px] pl-[13px] pr-[7px] transition-colors duration-200 hover:bg-[#1A1A1A] disabled:opacity-60 lg:h-[54px] lg:py-[15px] lg:pl-[18px] lg:pr-[10px]"
        >
          <p className="text-[14px] text-white lg:text-[16px]">
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
              className="w-[35px] h-[35px] lg:w-[48px] lg:h-[48px] brightness-0 contrast-[1.4]"
            />
          </a>
        ))}
      </div>
    </div>
  );
}