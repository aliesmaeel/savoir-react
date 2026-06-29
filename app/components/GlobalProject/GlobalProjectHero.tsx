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
      : "Bulgaria";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]);

  return (
    <div className="relative flex h-[640px] w-full flex-col items-center justify-center lg:h-[100vh]">
      <div className="relative w-full">
        <img
          loading="lazy"
          src={backgroundImage}
          alt={selectedCountry}
          className="h-[640px] w-full object-cover transition-all duration-700 grayscale-25 brightness-50 lg:h-[100vh]"
          key={selectedCountry}
        />
        <div className="w-full h-full bg-[#00000026] absolute top-0 left-0" />
      </div>

      <div className="absolute left-0 top-0 flex h-[640px] w-full flex-col items-center justify-start px-[16px] pt-[128px] lg:flex lg:h-[100vh] lg:justify-center lg:px-[45px] lg:pt-0">
        <GlobalGlobe
          size={isMobile ? 400 : 559}
          globeScale={0.8}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          syncSelectedToUrl={true}
          selectedParamKey="country"
        />
        <div
          className="absolute bottom-0 left-0 z-1 h-[140px] w-full lg:h-[176px]"
          style={{ background: "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)" }}
        />
      </div>
    </div>
  );
};

export default GlobalProjectHero;
