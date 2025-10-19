import React from "react";
import styles from "./ProjectCard.module.css";
import { Link } from "react-router";
import Card from "~/UI/Card";
import useIcons from "~/hooks/imageHooks/useIcons";

type props = {
  project: any;
};

export default function ProjectCard({ project }: props) {
  const icon = useIcons();
  return (
    <Card luxury={project.isLuxury} className="!rounded-[46.534px]">
      <Link to={`/project/${project.slug}`} className="block px-[24px] pb-[28px] pt-[21px]">
        <div className="flex items-center justify-between w-full py-[8px]">
          <p
            className={`text-[21px] font-semibold ${project.isLuxury ? styles.priceLuxury : styles.price}`}
          >
            {project.price}
          </p>
          {project.isLuxury ? (
            <div className="flex items-center justify-center px-[7px] py-[3px] rounded-[6px] h-[22px] bg-[#C6A45A] w-[81px]">
              <p className="text-white text-[10px] Jakarta font-bold">LUXURY</p>
            </div>
          ) : (
            <div
              className="px-[7px] py-[3px] rounded-[6px] h-[21px]"
              style={{
                background:
                  "linear-gradient(90deg, rgba(53, 54, 53, 0.40) 0.02%, rgba(255, 255, 255, 0.00) 180.22%)",
              }}
            >
              <p className="Text-[#353635] text-[10px] Jakarta font-bold">
                For {project.offering_type === "RS" ? "SALE" : "RENT"}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between w-full mt-[6px]">
          <div className="flex items-center gap-[4px]">
            <img
              loading="lazy"
              src={project.isLuxury ? icon.locationWhite : icon.locationBlack}
              alt=""
              className="w-[18px]"
            />
            <p className={`text-[13px] font-medium Jakarta ${project.isLuxury && "text-white"}`}>
              {project.location}
            </p>
          </div>
          <div className="flex items-center gap-[4px]">
            <img
              loading="lazy"
              src={project.isLuxury ? icon.ClockWhite : icon.Clock}
              alt=""
              className="w-[14px]"
            />
            <p className={`text-[12px] font-medium Jakarta ${project.isLuxury && "text-white"}`}>
              {project.updated_at}
            </p>
          </div>
        </div>
        <img
          loading="lazy"
          src={project.photo}
          alt=""
          className="w-full aspect-[375.733/242.119] object-cover rounded-[10px] mt-[22px]"
        />
        <p
          className={`text-[#C6A45A] text-[14px] Jakarta font-medium leading-[150%] max-w-[227px] mt-[17px] ${project.isLuxury && "text-white"} `}
        >
          {project.title_en}
        </p>
        <div className="flex items-center justify-between w-full mt-[18px]">
          <div className="flex items-center gap-[8px]">
            <img
              loading="lazy"
              src={project.isLuxury ? icon.bedroomWhite : icon.searchBedroom}
              alt=""
              className="w-[22px]"
            />
            <p className={`text-black text-[14px] shrink-0 ${project.isLuxury && "text-white"}`}>
              {project.bedroom} Beds
            </p>
          </div>
          <div className="flex items-center gap-[8px]">
            <img
              loading="lazy"
              src={project.isLuxury ? icon.bathroomWhite : icon.searchBathRoom}
              alt=""
              className="w-[22px]"
            />
            <p
              className={`text-black text-[14px] shrink-0 ${project.featured === 1 && "text-white"}`}
            >
              {project.bathroom} Bathroom
            </p>
          </div>
          <div className="flex items-center gap-[8px]">
            <img
              loading="lazy"
              src={project.isLuxury ? icon.squareWhite : icon.searchSquare}
              alt=""
              className="w-[22px]"
            />
            <p className={`text-black text-[14px] shrink-0 ${project.isLuxury && "text-white"}`}>
              {project.size}
            </p>
          </div>
        </div>
        <hr className="w-full border-[#00000099] mt-[34px]" />
        <div className="flex items-center justify-between w-full mt-[18px]">
          <div className="flex items-center gap-[9px]">
            <img
              loading="lazy"
              src={project.listedByImage}
              alt=""
              className="w-[46px] aspect-square object-cover"
            />
            <div className="flex flex-col items-start gap-[2px]">
              <p className="text-[#353635B2] text-[13px]">Listed By</p>
              <p className="text-[15px]">{project.listedBy}</p>
            </div>
          </div>
          <div className="flex items-center gap-[14px]">
            <button>
              <img loading="lazy" src={icon.whatsapp} alt="" className="w-[34px]" />
            </button>
            <button>
              <img loading="lazy" src={icon.callProjectCard} alt="" className="w-[39px]" />
            </button>
          </div>
        </div>
      </Link>
    </Card>
  );
}
