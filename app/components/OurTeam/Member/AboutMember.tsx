import ContactMember from "./ContactMember";
import { useLoaderData } from "react-router";

export default function AboutMember() {
  const { team } = useLoaderData() as { team: any };

  return (
    <div className="relative z-30 mt-[34px] flex w-full flex-col items-start gap-[28px] lg:mt-[42px] lg:grid lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start lg:gap-[38px]">
      <div className="flex w-full flex-col items-start gap-[28px]">
        <div
          className="hidden h-[65px] w-full items-center border-l-[3px] border-[#111111] px-[24px] py-[10px] lg:flex"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(17,17,17,0.08) 52%, rgba(255,255,255,0) 100%)",
          }}
        >
          <p
            className="text-[28px] leading-[1.05] lg:text-[44px]"
            style={{
              color: "#111111",
              fontWeight: 700,
              opacity: 1,
            }}
          >
            About {team.name}
          </p>
        </div>

        <div
          className="
            description-body
            w-full
            text-[15px]
            leading-[175%]
            lg:text-[17px]

            [&_*]:!text-[#111111]
            [&_*]:!font-semibold
            [&_*]:!opacity-100
            [&_p]:!text-[#111111]
            [&_p]:!font-semibold
            [&_p]:!opacity-100
            [&_span]:!text-[#111111]
            [&_span]:!font-semibold
            [&_span]:!opacity-100
          "
          style={{
            color: "#111111",
            fontWeight: 600,
            opacity: 1,
          }}
          dangerouslySetInnerHTML={{ __html: team.bio }}
        />
      </div>

      <div className="w-full lg:w-[390px] lg:justify-self-end">
        <ContactMember />
      </div>
    </div>
  );
}
