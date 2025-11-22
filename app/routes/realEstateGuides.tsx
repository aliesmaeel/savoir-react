import React, { useState } from "react";
import { useLoaderData } from "react-router";
import AdvisoryHero from "~/components/RealEstateAdvisory/AdvisoryHero";
import PageLayout from "~/layouts/PageLayout";
import Button from "~/UI/Button";
import Popup from "~/UI/Popup";
import DownloadGuidePopup from "~/components/RealEstateGuides/DownloadGuidePopup";
import { getRealEstateGuides, downloadGuide } from "~/api/realEstateGuides.service";
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

  const handleDownload = async () => {
    if (!selectedGuide) return;

    try {
      const blob = await downloadGuide(selectedGuide.id);

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = selectedGuide.pdf || "guide.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading guide:", error);
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = envConfig.baseUrl?.replace(/\/+$/, "") || "";
    return `${baseUrl}/${imagePath}`;
  };

  return (
    <div>
      <AdvisoryHero />
      <PageLayout>
        <div className="flex flex-col items-start gap-[89px] w-full">
          <div className="flex flex-col items-start gap-[24px] w-full">
            <p className="text-black text-[24px] lg:text-[60px] font-semibold">
              Real estate guides from industry experts
            </p>
            <p className="text-[14px] lg:text-[27px]">
              From buying or selling a property to discovering Dubai's key areas and investments,
              the Savior Properties guides are packed with essential information and key market insights.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[40px] w-full">
            {guides.map((item: any, index: number) => (
              <div key={item.id ?? index} className="flex flex-col items-start gap-[18px] w-full">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.title || ""}
                  className="w-full aspect-[414.75/292.5] rounded-[10.93px] object-cover"
                />
                <div className="flex items-center justify-between w-full">
                  <p className="text-[27px]">{item.title}</p>
                  <Button
                    onClick={() => handleDownloadClick(item.id, item.pdf)}
                    className="!rounded-[4px] !py-[6px] !px-[12px] text-[16px] h-[37px] w-fit"
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
            onDownload={handleDownload}
          />
        </Popup>
      )}
    </div>
  );
}
