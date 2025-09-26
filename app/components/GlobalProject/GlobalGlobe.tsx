import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as turf from "@turf/turf";
import useIcons from "~/hooks/imageHooks/useIcons";

type GlobalGlobeProps = {
  fullscreen?: boolean;
  size?: number | string; // enforce square (default 400px)
  className?: string;
  initialAltitude?: number; // default 1.2
  enableZoom?: boolean; // default false
  globeScale?: number; // default 0.8 for smaller globe
};

const GlobalGlobe: React.FC<GlobalGlobeProps> = ({
  fullscreen = false,
  size = 400,
  className = "",
  initialAltitude = 1.4,
  enableZoom = false,
  globeScale = 0.8,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<any>(null);
  const [labels, setLabels] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("United Arab Emirates");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedCountries = [
    "United Arab Emirates",
    "Egypt",
    "Bulgaria",
    "Greece",
    "Cyprus",
    "South Africa",
  ];

  // Resize handling
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const applySize = () => {
      const w = el.clientWidth || el.offsetWidth;
      const h = el.clientHeight || el.offsetHeight;
      if (worldRef.current) worldRef.current.width(w).height(h);
    };
    const ro = new ResizeObserver(applySize);
    ro.observe(el);
    const t = setTimeout(applySize, 0);
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, []);

  // Globe setup
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    (async () => {
      const Globe = (await import("globe.gl")).default;
      const world = Globe()(containerRef.current)
        .showAtmosphere(false)
        .backgroundColor("rgba(0, 0, 0, 0.0)")
        .labelsData([])
        .labelSize(0.8)
        .labelDotRadius(0.2)
        .labelColor(() => "black")
        .labelResolution(50);

      world.controls().enableZoom = enableZoom;
      world.globeMaterial().color = new THREE.Color("#bebbb3");
      world.globeMaterial().opacity = 1;
      world.globeMaterial().transparent = true;
      world.controls().autoRotate = false;

      if (globeScale !== 1) {
        world.scene().scale.set(globeScale, globeScale, globeScale);
      }

      worldRef.current = world;

      const w = containerRef.current.clientWidth || 0;
      const h = containerRef.current.clientHeight || 0;
      world.width(w).height(h);

      world.pointOfView({ lat: 20, lng: 30, altitude: initialAltitude });

      const res = await fetch(
        "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
      );
      const countries = await res.json();
      if (cancelled) return;

      const filtered = countries.features.filter((f: any) =>
        selectedCountries.includes(f.properties.name)
      );

      world
        .polygonsData(countries.features)
        .polygonAltitude(0.005)
        .polygonCapColor((d: any) =>
          d.properties.name === selectedCountry
            ? "rgba(255, 215, 0, 1)"
            : "rgba(196, 175, 134, 0.7)"
        )
        .polygonSideColor(() => "rgba(0, 0, 0, 0.2)")
        .polygonStrokeColor((d: any) => (d.properties.name === selectedCountry ? "#fff" : "#000"));

      const labelsData = filtered.map((f: any) => {
        const [lng, lat] = turf.centroid(f).geometry.coordinates;
        return { lat, lng, name: f.properties.name, feature: f };
      });

      setLabels(labelsData);
      world.labelsData(labelsData).labelText((d: any) => d.name);

      const uae = labelsData.find((d) => d.name === "United Arab Emirates");
      if (uae) {
        world.pointOfView({ lat: uae.lat, lng: uae.lng, altitude: initialAltitude }, 2000);
      }
    })();

    return () => {
      cancelled = true;
      worldRef.current = null;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [enableZoom, globeScale, initialAltitude]);

  // Update highlighting
  useEffect(() => {
    if (!worldRef.current) return;
    worldRef.current
      .polygonCapColor((d: any) =>
        d.properties.name === selectedCountry ? "rgba(255, 215, 0, 1)" : "rgba(196, 175, 134, 0.7)"
      )
      .polygonStrokeColor((d: any) => (d.properties.name === selectedCountry ? "#fff" : "#000"));
  }, [selectedCountry]);

  // Handle selection
  const handleSelect = (countryName: string) => {
    setSelectedCountry(countryName);
    setDropdownOpen(false);

    const country = labels.find((d) => d.name === countryName);
    if (country && worldRef.current) {
      worldRef.current.pointOfView(
        { lat: country.lat, lng: country.lng, altitude: initialAltitude },
        2000
      );
    }
  };

  const style: React.CSSProperties = fullscreen
    ? { width: "100vh", height: "100vh", position: "relative" }
    : {
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size}px` : size,
        position: "relative",
      };

  const icon = useIcons();

  return (
    <div className="flex items-center justify-between w-full relative z-50">
      <div className="flex flex-col items-start gap-[37px]">
        <div className="flex flex-col items-start">
          <p className="text-[51px]">Real estate agents in Dubai</p>
          <p className="text-[#353635B2] text-[31px]">Real estate agents in Dubai</p>
        </div>
        <div
          className="flex items-center justify-between w-full px-[45px] py-[20px] rounded-[20px] bg-[#ECE1C8] shadow-[0_31px_62px_-16px_rgba(143,144,188,0.15)] backdrop-blur-[10px]
"
        >
          <div className="flex flex-col items-start">
            <p className="text-[18px] font-semibold">Search </p>
            <div
              style={{
                cursor: "pointer",
                position: "relative",
                userSelect: "none",
              }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="flex items-center justify-between w-[270px]">
                <p className="text-[16px]">{selectedCountry}</p>{" "}
                <span className={`${dropdownOpen && "rotate-180"}`}>▼</span>
              </div>
              {dropdownOpen && (
                <ul
                  className="small-scroll"
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    position: "absolute",
                    top: "180%",
                    left: 0,
                    width: "100%",
                    backgroundColor: "#FFFFFF40",
                    color: "#000",
                    borderRadius: " 0 0 20px 20px",
                    maxHeight: 200,
                    overflowY: "auto",
                    zIndex: 20,
                    boxShadow: "0 31.242px 62.484px -15.621px rgba(143, 144, 188, 0.15)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {/*  */}
                  {selectedCountries.map((c) => (
                    <li
                      key={c}
                      onClick={() => handleSelect(c)}
                      className={`flex items-center gap-[20px] w-full py-[9px] px-[12px] border-l-[3px] ${c === selectedCountry ? " border-[#C6A45A]" : "border-transparent"}`}
                      style={{
                        background:
                          c === selectedCountry
                            ? "linear-gradient(90deg, #FFF 0%, rgba(198, 164, 90, 0.00) 100%)"
                            : "transparent",
                      }}
                    >
                      <img
                        src={c === selectedCountry ? icon.zap : ""}
                        alt=""
                        className="w-[12px]"
                      />
                      <p className="text-[18px]">{c}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={className} style={style}>
        {/* Custom Dropdown */}

        {/* Globe */}
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};

export default GlobalGlobe;
