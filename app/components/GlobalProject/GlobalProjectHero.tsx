// components/GlobalProject/GlobalProjectHero.tsx
import React, { useEffect, useState } from "react";
import GlobalGlobe from "./GlobalGlobe";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";
import { getGlobalProject } from "~/api/global.service";

type GlobalProjectHeroProps = {
  initialCountry: string;
  initialImage?: string;
  onCountryDataChange: (country: string, global: any) => void;
};

const GlobalProjectHero: React.FC<GlobalProjectHeroProps> = ({
  initialCountry,
  initialImage,
  onCountryDataChange,
}) => {
  const isMobile = useIsMobile();

  const normalizedInitialCountry =
    initialCountry && initialCountry.length > 0
      ? initialCountry
      : "united arab emirates";

  // Display name (capitalize) for UI / globe
  const toDisplayName = (name: string) =>
    name
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const [selectedCountry, setSelectedCountry] = useState<string>(
    toDisplayName(normalizedInitialCountry)
  );

  const fallback = "/images/placeholders/memberBg.svg";
  const [backgroundImage, setBackgroundImage] = useState<string>(
    initialImage || fallback
  );

  // fetch hero background + global data when country changes, and notify parent
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const apiCountry = selectedCountry.toLowerCase();
        const g: any = await getGlobalProject(apiCountry);
        if (!alive) return;

        setBackgroundImage(g?.project?.image || fallback);
        onCountryDataChange(apiCountry, g);
      } catch {
        if (!alive) return;
        setBackgroundImage(fallback);
      }
    })();
    return () => {
      alive = false;
    };
  }, [selectedCountry, onCountryDataChange]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-[100vh] relative ">
      <div className="relative w-full">
        <img
          loading="lazy"
          src={backgroundImage}
          alt={selectedCountry}
          className="w-full h-[100vh] object-cover transition-all duration-700 grayscale-25 brightness-50"
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
          className="absolute bottom-0 left-0 w-full h-[176px] z-1"
          style={{ background: "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)" }}
        />
      </div>
    </div>
  );
};

export default GlobalProjectHero;
