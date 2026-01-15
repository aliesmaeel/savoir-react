import useIcons from "~/hooks/imageHooks/useIcons";
import ContactMember from "./ContactMember";
import { useLoaderData } from "react-router";

export default function AboutMember() {
  const { team } = useLoaderData() as { team: any };

  const icon = useIcons();
  return (
    <div className="flex flex-col lg:flex-row items-start gap-[22px] w-full">
      <div className="flex flex-col items-start gap-[33px] w-full">
        <div
          className="hidden lg:flex items-center gap-[38px] px-[24px] py-[10px] w-full h-[65px] border-l border-[#C6A45A]"
          style={{
            background:
              "linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, rgba(240, 232, 214, 1) 50%, rgba(255, 255, 255, 0) 100%)",
          }}
        >
          <img loading="lazy" src={icon.zap} alt="" className="w-[24px]" />
          <p className="text-[23px] lg:text-[34px] font-semibold">About {team.name}</p>
        </div>
        <div
          className="text-[15px] lg:text-[27px] leading-[170%]"
          dangerouslySetInnerHTML={{ __html: team.bio }}
        ></div>
      </div>
      <ContactMember />
    </div>
  );
}
