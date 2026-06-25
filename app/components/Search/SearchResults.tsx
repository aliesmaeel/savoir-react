import React from "react";
import { Link } from "react-router";
import SearchSortBy from "./SearchSortBy";
import ProjectCard from "../Cards/ProjectCard";
import useArrow from "~/hooks/imageHooks/useArrow";
import useIcons from "~/hooks/imageHooks/useIcons";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";

type Props = {
  projects: any;
  currentPage: number;
};

export default function SearchResults({ projects, currentPage }: Props) {
  const arrow = useArrow();
  const icon = useIcons();
  const isMobile = useIsMobile();

  const showPromoCard = !isMobile;

  const leadingProjects = showPromoCard ? projects.slice(0, 3) : projects;
  const trailingProjects = showPromoCard ? projects.slice(3) : [];

  return (
    <div className="flex w-full flex-col items-start gap-[30px]">
      {isMobile && (
        <div className="flex w-full items-center justify-between">
          <SearchSortBy />
        </div>
      )}

      <div className="grid w-full grid-cols-1 gap-x-[24px] gap-y-[30px] md:grid-cols-2 xl:grid-cols-4">
        {leadingProjects.map((project: any, index: number) => (
          <ProjectCard key={`lead-${index}`} project={project} compact />
        ))}

        {showPromoCard && (
          <div
            className="relative hidden h-full min-h-[100%] flex-col items-start overflow-hidden rounded-[30px] border border-[#C6A45A] bg-[#111111] px-[24px] py-[32px] xl:flex"
            style={{
              background:
                "linear-gradient(145deg, #0E0E0F 0%, #171717 62%, #101010 100%)",
              boxShadow:
                "0 26px 62px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <div className="relative z-10 flex w-full flex-col items-start">
              <p className="CormorantGaramond max-w-[250px] text-[30px] leading-[1.18] text-white">
                List your property
                <br />
                with Savoir
              </p>

              <span className="mt-[16px] block h-px w-[96px] bg-[#C6A45A]" />

              <p className="mt-[18px] max-w-[255px] text-[15px] font-medium leading-[1.72] text-white/88">
                We unlock a world of real estate opportunities with leading
                agents and real estate experts.
              </p>
            </div>

            <div className="relative mt-auto h-[122px] w-full">
              <Link
                to="/list-with-us"
                className="
                  group absolute bottom-[12px] left-0 z-20 flex h-[42px] min-w-[176px]
                  items-center justify-center overflow-hidden rounded-[10px]
                  border border-[#C6A45A]/90
                  bg-[linear-gradient(135deg,#0B0B0B_0%,#17120A_100%)] px-[16px]
                  shadow-[0_14px_34px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.08)]
                  transition-all duration-300 hover:border-[#D8B96C] hover:shadow-[0_18px_38px_rgba(0,0,0,0.42),0_0_18px_rgba(198,164,90,0.14),inset_0_1px_0_rgba(255,255,255,0.12)]
                "
              >
                <span className="absolute inset-x-[12px] top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                <p className="whitespace-nowrap text-[14px] font-semibold text-white">
                  List your property
                </p>

                <img
                  loading="lazy"
                  src={arrow.longWhite}
                  alt=""
                  className="ml-[7px] w-[13px] rotate-[-45deg] transition-transform duration-300 group-hover:translate-x-[2px] group-hover:translate-y-[-2px]"
                />
              </Link>

              <div className="absolute bottom-[-34px] right-[-18px] z-30">
                <span className="absolute bottom-[18px] right-[6px] h-[72px] w-[132px] rounded-full bg-[#C6A45A]/12 blur-[18px]" />
                <img
                  loading="lazy"
                  src={icon.Magazine}
                  alt=""
                  className="relative w-[162px] drop-shadow-[0_20px_28px_rgba(0,0,0,0.42)]"
                />
              </div>
            </div>
          </div>
        )}

        {trailingProjects.map((project: any, index: number) => (
          <ProjectCard key={`trail-${index}`} project={project} compact />
        ))}
      </div>

      <hr className="w-full border-[#26262680]" />
    </div>
  );
}
