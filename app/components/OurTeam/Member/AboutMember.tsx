import useIcons from "~/hooks/imageHooks/useIcons";
import ContactMember from "./ContactMember";

export default function AboutMember() {
  const icon = useIcons();
  return (
    <div className="flex flex-col lg:flex-row items-start gap-[22px] w-full">
      <div className="flex flex-col items-start gap-[33px] w-full">
        <div
          className="flex items-center gap-[38px] px-[24px] py-[10px] w-full h-[65px] border-l border-[#C6A45A]"
          style={{
            background:
              "linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, rgba(240, 232, 214, 1) 50%, rgba(255, 255, 255, 0) 100%)",
          }}
        >
          <img loading="lazy" src={icon.zap} alt="" className="w-[24px]" />
          <p className="text-[23px] lg:text-[34px] font-semibold">About wade warren</p>
        </div>
        <p className="text-[15px] lg:text-[27px] leading-[170%]">
          Doctor of Science in International Law, an excellent negotiator and diplomat, Dimitry is
          able to gently but confidently defend the interests of clients. Dimitry has over 10 years
          of international experience in the real estate industry. He worked for the Parliamentary
          Commission on Foreign Policy, taught at thAcademy of Public Administration and was the
          owner of his own real estate agency in Chisinau.t Dimitry holds a leading position and
          sets the vector for the development of not only his team, which he calls «My Champions»,
          but also the e
        </p>
      </div>
      <ContactMember />
    </div>
  );
}
