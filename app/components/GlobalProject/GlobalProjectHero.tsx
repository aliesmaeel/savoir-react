import React, { useState } from "react";
import GlobalGlobe from "./GlobalGlobe";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";

export default function GlobalProjectHero() {
  const [selectedCountry, setSelectedCountry] = useState("United Arab Emirates");
  const isMobile = useIsMobile();

  // Define your country background images here
  const countryBackgrounds: Record<string, string> = {
    "United Arab Emirates": "/images/countries/uae-bg.webp",
    Egypt: "/images/countries/egypt-bg.jpg",
    Bulgaria: "/images/countries/bulgaria-bg.webp",
    Greece: "/images/countries/greece-bg.jpeg",
    Cyprus: "/images/countries/cyprus-bg.webp",
    "South Africa": "/images/countries/southafrica-bg.jpeg",
  };

  const backgroundImage =
    countryBackgrounds[selectedCountry] || "/images/placeholders/memberBg.svg";

  return (
    <div className="flex flex-col items-center justify-center w-full h-[100vh] relative">
      {/* Dynamic background image */}
      <img
        src={backgroundImage}
        alt={selectedCountry}
        className="w-full h-[100vh] object-cover transition-all duration-700"
        key={selectedCountry} // ensures smooth transition
      />

      <div className="flex flex-col items-center justify-center w-full h-[100vh] absolute top-0 left-0 px-[16px] lg:px-[45px]">
        {/* Pass selectedCountry state & setter down */}
        <GlobalGlobe
          size={isMobile ? 300 : 559}
          globeScale={0.8}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[176px] z-10"
          style={{
            background: "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)",
          }}
        />
      </div>
    </div>
  );
}
