// components/GlobalProject/GlobalProjectHero.tsx
import React, { useEffect, useState } from "react";
import GlobalGlobe from "./GlobalGlobe";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";
import { useLoaderData } from "react-router";
import { getGlobalProject } from "~/api/global.service";

export default function GlobalProjectHero() {
  const isMobile = useIsMobile();
  const { global } = useLoaderData() as { global: any; country: string };

  const [selectedCountry, setSelectedCountry] = useState("United Arab Emirates");

  const fallback = "/images/placeholders/memberBg.svg";
  const [backgroundImage, setBackgroundImage] = useState<string>(
    global?.project?.image || fallback
  );

  // fetch hero background when country changes, without reloading page
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const g: any = await getGlobalProject(selectedCountry.toLowerCase());
        if (alive) setBackgroundImage(g?.project?.image || fallback);
      } catch {
        if (alive) setBackgroundImage(fallback);
      }
    })();
    return () => {
      alive = false;
    };
  }, [selectedCountry]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-[100vh] relative">
      <div className="relative w-full">
        <img
          loading="lazy"
          src={backgroundImage}
          alt={selectedCountry}
          className="w-full h-[100vh] object-cover transition-all duration-700 grayscale-25"
          key={selectedCountry}
        />
        <div className="w-full h-full bg-[#00000026] absolute top-0 left-0" />
      </div>

      <div className="flex flex-col items-center justify-center w-full h-[100vh] absolute top-0 left-0 px-[16px] lg:px-[45px]">
        <GlobalGlobe
          size={isMobile ? 300 : 559}
          globeScale={0.8}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          syncSelectedToUrl={true}
          selectedParamKey="country"
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[176px] z-10"
          style={{ background: "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)" }}
        />
      </div>
    </div>
  );
}
