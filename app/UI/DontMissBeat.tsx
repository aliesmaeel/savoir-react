import React, { useState } from "react";
import useIcons from "~/hooks/imageHooks/useIcons";
import { subscribe } from "~/api/form.service";
import { useNotify } from "~/components/notifications/NotificationsProvider";

export default function DontMissBeat() {
  const icon = useIcons();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<null | { type: "ok" | "err"; text: string }>(null);
  const notify = useNotify();

  const validEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v);

  const onSubmit = async () => {
    setNote(null);

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
    if (e.key === "Enter") onSubmit();
  };

  return (
    <div
      className="newsletter-section flex flex-col items-start gap-[15px] lg:gap-[40px] w-full px-[15px] lg:px-[37px] pt-[15px] lg:pt-[45px] pb-[80px] lg:pb-[53px] rounded-[14px] lg:rounded-[46px] relative z-10 mt-[97px] overflow-hidden border border-[#C6A45A4D]"
      style={{
        background:
          "linear-gradient(120deg, #0F0F10 0%, #171717 58%, #23201A 100%)",
        boxShadow:
          "0 24px 60px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
      }}
    >
      <div className="relative z-10 flex flex-col items-start w-full gap-[6px] lg:gap-[10px] pr-[90px] lg:pr-[320px]">
        <p className="text-[14px] lg:text-[28px] font-semibold leading-[1.2]">
          Sign up for our newsletter to stay up to date on the Dubai property market.
        </p>

        <p className="text-[10px] lg:text-[18px] font-medium max-w-[900px] leading-[1.35] opacity-80">
          Stay informed about the latest real estate trends, market insights, and exclusive offers in the Dubai property market.
        </p>
      </div>

      <div className="relative z-10 flex w-full max-w-[270px] lg:max-w-[680px] h-[36px] lg:h-[56px] rounded-[8px] lg:rounded-[11px] overflow-hidden bg-white shadow-[0_16px_38px_rgba(0,0,0,0.16)]">
        <div className="flex items-center gap-[8px] lg:gap-[14px] w-full px-[10px] lg:px-[20px] py-[6px] lg:py-[13px]">
          <img
            loading="lazy"
            src={icon.dontMissEmail}
            alt=""
            className="w-[15px] lg:w-[28px] shrink-0"
          />

          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={onKeyDown}
            className="w-full border-0 outline-0 bg-white text-[#111111] placeholder:text-[#8E8E93] text-[11px] lg:text-[16px] font-medium"
            aria-label="Email address"
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={loading}
          type="button"
          className="flex items-center justify-center gap-[5px] lg:gap-[8px] px-[10px] lg:px-[22px] h-[36px] lg:h-[56px] !text-white text-[11px] lg:text-[21px] font-semibold shrink-0 border-l border-white/10 bg-[#111111]"
        >
          {loading ? "..." : "Subscribe"}

          <img
            loading="lazy"
            src={icon.dontMissSubsicribe}
            alt=""
            className="w-[14px] lg:w-[28px] brightness-0 invert"
          />
        </button>
      </div>

      {note && (
        <p
          className={`relative z-10 mt-2 text-[11px] lg:text-[16px] ${
            note.type === "ok" ? "!text-green-200" : "!text-red-200"
          }`}
          aria-live="polite"
        >
          {note.text}
        </p>
      )}

      <img
        loading="lazy"
        src={icon.Magazine}
        alt=""
        className="w-[104px] lg:w-[291px] absolute bottom-0 right-0 z-0"
      />
    </div>
  );
}