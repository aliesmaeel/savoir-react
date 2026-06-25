import React from "react";
import { useLoaderData } from "react-router";

export default function MemberHero() {
  const { team } = useLoaderData() as { team: any };

  const getLanguages = () => {
    const languages = (team.language ?? "N/A")
      .replace(/,/g, ", ")
      .split(",")
      .map((lang: string) => lang.trim())
      .filter(Boolean);

    const shouldAddBulgarian =
      team.name === "Eva Bogotlieva" || team.name === "Vessela Nedialkova";

    if (
      shouldAddBulgarian &&
      !languages.some((lang: string) => lang.toLowerCase() === "bulgarian")
    ) {
      languages.push("Bulgarian");
    }

    return languages.join(", ");
  };

  const infoItems = [
    {
      title: "Phone :",
      value: team.phone ?? "N/A",
    },
    {
      title: "Email :",
      value: team.email ?? "N/A",
    },
    {
      title: "Languages :",
      value: getLanguages(),
    },
  ];

  return (
    <div className="relative flex w-full items-start justify-center overflow-hidden bg-white px-[16px] pt-[118px] lg:min-h-[78vh] lg:px-[45px] lg:pt-[135px]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#ffffff_0%,#f5f8f8_42%,#ffffff_100%)]" />

      <img
        loading="lazy"
        src={team.image}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover object-center opacity-[0.05] blur-[46px]"
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.97)_0%,rgba(247,250,250,0.78)_44%,rgba(255,255,255,0.98)_100%)]" />

      <div className="relative z-20 w-full max-w-[1160px] pb-[80px] lg:pb-[105px]">
        <div
          className="relative min-h-[520px] w-full overflow-hidden rounded-[8px] border border-white/80 bg-white/55 ring-1 ring-white/70 backdrop-blur-[18px]"
          style={{
            backdropFilter: "blur(18px) saturate(150%) contrast(103%)",
            WebkitBackdropFilter: "blur(18px) saturate(150%) contrast(103%)",
            boxShadow:
              "0 30px 78px rgba(17,17,17,0.13), 0 10px 30px rgba(255,255,255,0.24), inset 1px 1px 0 rgba(255,255,255,0.86), inset -1px -1px 0 rgba(255,255,255,0.28)",
          }}
        >
          <img
            loading="lazy"
            src={team.image}
            alt={team.name}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-65 lg:left-auto lg:right-0 lg:w-[46%] lg:opacity-100"
          />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.94) 40%, rgba(255,255,255,0.32) 49%, rgba(255,255,255,0.06) 55%, rgba(255,255,255,0.00) 59%)",
            }}
          />

          <div
            className="pointer-events-none absolute inset-0 backdrop-blur-[8px] lg:backdrop-blur-[4px]"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.12) 31%, rgba(255,255,255,0.025) 46%, rgba(255,255,255,0.00) 55%)",
              maskImage:
                "linear-gradient(90deg, #000 0%, #000 42%, rgba(0,0,0,0.08) 51%, rgba(0,0,0,0) 58%)",
              WebkitMaskImage:
                "linear-gradient(90deg, #000 0%, #000 42%, rgba(0,0,0,0.08) 51%, rgba(0,0,0,0) 58%)",
            }}
          />

          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(100% 70% at 13% 3%, rgba(255,255,255,0.84) 0%, rgba(255,255,255,0.40) 27%, rgba(255,255,255,0.00) 50%), linear-gradient(128deg, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.10) 20%, rgba(255,255,255,0.00) 46%, rgba(255,255,255,0.12) 62%, rgba(255,255,255,0.00) 100%)",
              filter: "blur(3px)",
              maskImage:
                "linear-gradient(90deg, #000 0%, #000 42%, rgba(0,0,0,0.10) 51%, rgba(0,0,0,0) 58%)",
              WebkitMaskImage:
                "linear-gradient(90deg, #000 0%, #000 42%, rgba(0,0,0,0.10) 51%, rgba(0,0,0,0) 58%)",
            }}
          />

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              background:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.65) 0px, rgba(255,255,255,0.35) 1px, rgba(255,255,255,0.00) 70px, rgba(255,255,255,0.28) 86px)",
              maskImage:
                "linear-gradient(90deg, #000 0%, #000 42%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0) 56%)",
              WebkitMaskImage:
                "linear-gradient(90deg, #000 0%, #000 42%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0) 56%)",
            }}
          />

          <div
            className="pointer-events-none absolute inset-0 rounded-[8px]"
            style={{
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,0.64), inset 1px 1px 2px rgba(255,255,255,0.94), inset 22px 22px 54px rgba(255,255,255,0.34), inset -18px -18px 46px rgba(0,0,0,0.08)",
            }}
          />

          <div className="relative z-10 flex min-h-[520px] w-full flex-col justify-center gap-[24px] px-[24px] py-[42px] lg:w-[58%] lg:gap-[34px] lg:px-[58px] lg:py-[56px]">
            <div className="flex flex-col items-center gap-[6px] lg:items-start lg:gap-[8px]">
              <p
                className="text-center text-[22px] leading-[1.12] lg:text-left lg:text-[36px]"
                style={{
                  color: "#111111",
                  fontWeight: 600,
                  opacity: 1,
                }}
              >
                {team.name}
              </p>

              <p className="CormorantGaramond text-center text-[18px] leading-[1.12] text-[#161616] lg:text-left lg:text-[28px]">
                {team.Job_Description}
              </p>
            </div>

            <div className="flex w-full max-w-[520px] flex-col items-start gap-[14px] lg:gap-[18px]">
              {infoItems.map((item: any, index: number) => (
                <div
                  className="grid w-full grid-cols-[92px_minmax(0,1fr)] items-baseline gap-[12px] text-[13px] lg:grid-cols-[118px_minmax(0,1fr)] lg:gap-[18px] lg:text-[16px]"
                  key={index}
                >
                  <span
                    style={{
                      color: "rgba(17,17,17,0.72)",
                      fontWeight: 500,
                      opacity: 1,
                    }}
                  >
                    {item.title}
                  </span>

                  <span
                    className="break-words"
                    style={{
                      color: "#111111",
                      fontWeight: 600,
                      opacity: 1,
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 z-10 h-[176px] w-full"
        style={{
          background:
            "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)",
        }}
      />
    </div>
  );
}