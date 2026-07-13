import React, { useState } from "react";
import { useLoaderData } from "react-router";
import AdvisoryHero from "~/components/RealEstateAdvisory/AdvisoryHero";
import PageLayout from "~/layouts/PageLayout";
import Button from "~/UI/Button";
import Popup from "~/UI/Popup";
import DownloadGuidePopup from "~/components/RealEstateGuides/DownloadGuidePopup";
import { getRealEstateGuides } from "~/api/realEstateGuides.service";
import { envConfig } from "~/config/envConfig";

export async function clientLoader() {
  try {
    const res: any = await getRealEstateGuides();
    const guides = res.data ?? res ?? [];
    return { guides };
  } catch (error) {
    return { guides: [] };
  }
}

export default function realEstateGuides() {
  const { guides } = useLoaderData() as { guides: any[] };
  const [selectedGuide, setSelectedGuide] = useState<{
    id: number | string;
    pdf: string;
  } | null>(null);

  const handleDownloadClick = (id: number | string, pdf: string) => {
    setSelectedGuide({ id, pdf });
  };

  const handleClosePopup = () => {
    setSelectedGuide(null);
  };

  const handleDownload = async (guide: { id: number | string; pdf: string }) => {
    if (!guide) return;
    const baseUrl = envConfig.baseUrl?.replace(/\/+$/, "") || "";
    const downloadUrl = `${baseUrl}/api/download-guide/${guide.id}`;
    window.open(downloadUrl, "_blank", "noopener,noreferrer");
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = envConfig.baseUrl?.replace(/\/+$/, "") || "";
    return `${baseUrl}/${imagePath}`;
  };

  /** Only items at these indexes show the “Visit The Site” button. */
  const visitSiteIndexes: number[] = [];

  return (
    <div className="mt-[100px]">
      <PageLayout>
        <div className="flex w-full flex-col items-start gap-[58px]">
          <div className="flex w-full flex-col items-start gap-[22px]">
            <p className="CormorantGaramond text-[28px] font-semibold leading-[1.05] capitalize text-[#111111] lg:text-[44px]">
              Real estate guides from industry experts
            </p>

            <p className="text-[14px] font-semibold leading-[160%] text-[#111111] lg:text-[18px]">
              From buying or selling a property to discovering Dubai's key areas and investments,
              the Savior Properties guides are packed with essential information and key market insights.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-[28px] md:grid-cols-2 lg:grid-cols-3">
            {guides.map((item: any, index: number) => (
              <div
                key={item.id ?? index}
                className="
                  flex w-full flex-col items-center
                  rounded-[16px]
                  border border-[#E8DFD2]
                  bg-white
                  px-[16px]
                  py-[18px]
                  shadow-[0_14px_38px_rgba(17,17,17,0.045)]
                  transition-all
                  duration-300
                  hover:-translate-y-[2px]
                  hover:shadow-[0_20px_48px_rgba(17,17,17,0.08)]
                "
              >
                <div className="flex h-[260px] w-full items-center justify-center overflow-hidden rounded-[12px] bg-[#FBFAF7] lg:h-[280px]">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title || ""}
                    className="h-full w-auto max-w-full object-contain object-center"
                    style={{
                      imageRendering: "auto",
                      filter: "none",
                    }}
                  />
                </div>

                <div className="mt-[16px] flex w-full items-center justify-between gap-[12px]">
                  <p className="CormorantGaramond text-[20px] leading-[1.1] text-[#111111] lg:text-[23px]">
                    {item.title}
                  </p>

                  <Button
                    onClick={() => handleDownloadClick(item.id, item.pdf)}
                    className="
                      h-[30px]
                      w-fit
                      shrink-0
                      !rounded-[5px]
                      !bg-[#2B2B2B]
                      !px-[10px]
                      !py-[4px]
                      text-[12px]
                      font-semibold
                      !text-white
                      shadow-[0_8px_18px_rgba(43,43,43,0.14)]
                      transition-all
                      duration-300
                      hover:!bg-[#242424]
                      lg:h-[32px]
                      lg:px-[12px]
                      lg:text-[13px]
                    "
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageLayout>

      {selectedGuide && (
        <Popup title="Download Guide" onClose={handleClosePopup}>
          <DownloadGuidePopup
            guideId={selectedGuide.id}
            brochureName={selectedGuide.pdf}
            onClose={handleClosePopup}
            onDownload={() => handleDownload(selectedGuide)}
          />
        </Popup>
      )}
    </div>
  );
}