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
        <div className="flex flex-col items-start gap-[89px] w-full">
          <div className="flex flex-col items-start gap-[24px] w-full">
            <p className="CormorantGaramond text-[28px] font-semibold leading-[1.05] capitalize text-[#111111] lg:text-[44px]">
              Real estate guides from industry experts
            </p>
            <p className="text-[14px] font-semibold leading-[160%] text-[#111111] lg:text-[18px]">
              From buying or selling a property to discovering Dubai's key areas and investments,
              the Savior Properties guides are packed with essential information and key market insights.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[40px] w-full">
            {guides.map((item: any, index: number) => (
              <div key={item.id ?? index} className="flex flex-col items-start gap-[18px] w-full">
                <div className="w-full overflow-hidden rounded-[10.93px] bg-white">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title || ""}
                    className="w-full aspect-[414.75/292.5] rounded-[10.93px] object-contain object-center"
                    style={{
                      imageRendering: "auto",
                      filter: "none",
                    }}
                  />
                </div>

                <div className="flex items-center justify-between w-full">
                  <p className="text-[27px]">{item.title}</p>
                  <Button
                    onClick={() => handleDownloadClick(item.id, item.pdf)}
                    className="!rounded-[6px] !bg-[#2B2B2B] !py-[6px] !px-[14px] text-[16px] h-[37px] w-fit !text-white shadow-[0_10px_22px_rgba(43,43,43,0.16)] hover:!bg-[#242424]"
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