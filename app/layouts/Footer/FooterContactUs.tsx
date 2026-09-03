import React from "react";
import { Link } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";

type FooterLogoProps = {
  src: string;
  alt: string;
  canvas: { width: number; height: number };
  visibleBounds: { left: number; top: number; width: number; height: number };
  className?: string;
};

function FooterLogo({
  src,
  alt,
  canvas,
  visibleBounds,
  className = "",
}: FooterLogoProps) {
  return (
    <span
      className="relative block w-full overflow-hidden"
      style={{ aspectRatio: `${visibleBounds.width} / ${visibleBounds.height}` }}
    >
      <img
        loading="lazy"
        src={src}
        alt={alt}
        className={`absolute max-w-none ${className}`}
        style={{
          width: `${(canvas.width / visibleBounds.width) * 100}%`,
          height: "auto",
          left: `${(-visibleBounds.left / visibleBounds.width) * 100}%`,
          top: `${(-visibleBounds.top / visibleBounds.height) * 100}%`,
        }}
      />
    </span>
  );
}

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

      <div className="flex w-full flex-col gap-[12px] lg:gap-[38px]">
        <a
          href="https://ues.bg/en"
          target="_blank"
          rel="noreferrer"
          className="block w-full transition-all duration-300 hover:opacity-80"
        >
          <FooterLogo
            src="/images/footer1.png"
            alt="Unique Estates"
            canvas={{ width: 2100, height: 720 }}
            visibleBounds={{ left: 19, top: 200, width: 2062, height: 320 }}
            className="brightness-[0.42] contrast-[1.35] grayscale"
          />
        </a>

        <a
          href="https://www.realto.group/en"
          target="_blank"
          rel="noreferrer"
          className="block w-full transition-all duration-300 hover:opacity-80"
        >
          <FooterLogo
            src="/images/footer2.png"
            alt="Realto Group"
            canvas={{ width: 2100, height: 720 }}
            visibleBounds={{ left: 43, top: 166, width: 2014, height: 388 }}
            className="brightness-[0.42] contrast-[1.35] grayscale"
          />
        </a>

        <div className="block w-full">
          <FooterLogo
            src="/images/bulgarian-business-council.png"
            alt="Member of Bulgarian Business Council"
            canvas={{ width: 2172, height: 724 }}
            visibleBounds={{ left: 57, top: 126, width: 2049, height: 414 }}
          />
        </div>
      </div>
    </div>
  );
}
