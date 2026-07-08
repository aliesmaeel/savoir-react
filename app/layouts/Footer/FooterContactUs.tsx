import React from "react";
import { Link } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function FooterContactUs() {
  const icon = useIcons();

  return (
    <div className="flex w-full max-w-[272px] flex-col items-start gap-[8px] lg:gap-[20px]">
      <p
        className="text-[14px] font-semibold lg:text-[24px]"
        style={{
          color: "#000000",
          fontWeight: 700,
          opacity: 1,
        }}
      >
        CONTACT US
      </p>

      <div className="flex w-full flex-col items-start gap-[20px] lg:gap-[27px]">
        <Link to={`tel:+71505074686`} className="flex items-center gap-[10px]">
          <img
            loading="lazy"
            src={icon.phoneGold}
            alt=""
            className="w-[16px] lg:w-[18px]"
          />
          <p
            className="text-[16px] lg:text-[18px]"
            style={{
              color: "#000000",
              fontWeight: 600,
              opacity: 1,
            }}
          >
            +971505074686
          </p>
        </Link>

        <Link
          to={`mailto:info@savoirproperties.com`}
          className="flex items-center gap-[10px]"
        >
          <img
            loading="lazy"
            src={icon.emailGold}
            alt=""
            className="w-[16px] lg:w-[18px]"
          />
          <p
            className="text-[16px] lg:text-[18px]"
            style={{
              color: "#000000",
              fontWeight: 600,
              opacity: 1,
            }}
          >
            info@savoirproperties.com
          </p>
        </Link>
      </div>

      <div className="flex w-full flex-col gap-[12px]">
        <a
          href="https://www.luxuryportfolio.com/"
          target="_blank"
          rel="noreferrer"
          className="block w-full transition-all duration-300 hover:opacity-80"
        >
          <img
            loading="lazy"
            src="/images/footer1.png"
            alt=""
            className="w-full brightness-[0.42] contrast-[1.35] grayscale"
          />
        </a>

        <a
          href="https://www.leadingre.com/"
          target="_blank"
          rel="noreferrer"
          className="block w-full transition-all duration-300 hover:opacity-80"
        >
          <img
            loading="lazy"
            src="/images/footer2.png"
            alt=""
            className="w-full brightness-[0.42] contrast-[1.35] grayscale"
          />
        </a>
      </div>
    </div>
  );
}