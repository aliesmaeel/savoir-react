// components/GlobalProject/GlobalGlobe.tsx
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as turf from "@turf/turf";
import useIcons from "~/hooks/imageHooks/useIcons";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";

type GlobalGlobeProps = {
  fullscreen?: boolean;
  size?: number | string;
  className?: string;
  initialAltitude?: number;
  enableZoom?: boolean;
  globeScale?: number;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  syncSelectedToUrl?: boolean;
  selectedParamKey?: string;
};

const norm = (s: string) => s.toLowerCase();
const findCanonical = (name: string, list: string[]) =>
  list.find((c) => norm(c) === norm(name)) ?? null;

const GlobalGlobe: React.FC<GlobalGlobeProps> = ({
  fullscreen = false,
  size = 400,
  className = "",
  initialAltitude = 1.4,
  enableZoom = false,
  globeScale = 0.8,
  selectedCountry,
  setSelectedCountry,
  syncSelectedToUrl = true,
  selectedParamKey = "country",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<any>(null);
  const [labels, setLabels] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isMobile = useIsMobile();

  const selectedCountries = [
    "United Arab Emirates",
    "Egypt",
    "Bulgaria",
    "Greece",
    "Cyprus",
    "South Africa",
    "Malta",
  ];

  // read initial country from URL once
  useEffect(() => {
    if (!syncSelectedToUrl) return;
    try {
      const url = new URL(window.location.href);
      const fromUrl = url.searchParams.get(selectedParamKey);
      if (!fromUrl) return;
      const canonical = findCanonical(fromUrl, selectedCountries);
      if (canonical && canonical !== selectedCountry) setSelectedCountry(canonical);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // write selection to URL without navigation
  useEffect(() => {
    if (!syncSelectedToUrl) return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set(selectedParamKey, norm(selectedCountry));
      window.history.replaceState(null, "", url.toString());
    } catch {}
  }, [selectedCountry, syncSelectedToUrl, selectedParamKey]);

  // responsive canvas
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

  // globe setup ONCE (does not depend on selectedCountry)
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
      
      world.globeMaterial().opacity = 1;
      world.globeMaterial().transparent = true;
      world.controls().autoRotate = false;
      world.globeMaterial().color = new THREE.Color("#bebbb3");
      
      if (globeScale !== 1) world.scene().scale.set(globeScale, globeScale, globeScale);

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
        selectedCountries.some((c) => norm(c) === norm(f.properties.name))
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

      if (!labelsData.some((d: any) => d.name === "Malta")) {
        labelsData.push({ name: "Malta", lat: 35.9375, lng: 14.3754, feature: null });
      }

      setLabels(labelsData);
      world.labelsData(labelsData).labelText((d: any) => d.name);

      const target =
        labelsData.find((d: any) => d.name === selectedCountry) ??
        labelsData.find((d: any) => d.name === "United Arab Emirates");
      if (target) {
        world.pointOfView({ lat: target.lat, lng: target.lng, altitude: initialAltitude }, 2000);
      }
    })();

    return () => {
      cancelled = true;
      worldRef.current = null;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
    // only run once for stable props; remove selectedCountry
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableZoom, globeScale, initialAltitude]);

  // update highlight and camera when selectedCountry changes
  useEffect(() => {
    const world = worldRef.current;
    if (!world) return;

    world
      .polygonCapColor((d: any) =>
        d.properties.name === selectedCountry ? "rgba(255, 215, 0, 1)" : "rgba(196, 175, 134, 0.7)"
      )
      .polygonStrokeColor((d: any) => (d.properties.name === selectedCountry ? "#fff" : "#000"));

    const target =
      labels.find((d: any) => d.name === selectedCountry) ??
      labels.find((d: any) => d.name === "United Arab Emirates");

    if (target) {
      const alt = selectedCountry === "Malta" ? Math.min(initialAltitude, 0.9) : initialAltitude;
      world.pointOfView({ lat: target.lat, lng: target.lng, altitude: alt }, 1200);
    }
  }, [selectedCountry, labels, initialAltitude]);

  const handleSelect = (countryName: string) => {
    setSelectedCountry(countryName); // no globe re-init
    setDropdownOpen(false);
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
    <div className="flex flex-col lg:flex-row gap-[15px] items-center justify-between w-full relative z-50">
      <div className="flex flex-col items-start gap-[15px] lg:gap-[37px]">
        <div className="flex flex-col items-start">
          <p className="text-[20px] lg:text-[51px] text-white">
            Real estate agents in {selectedCountry}
          </p>
          <p className="text-white/60 text-[15px] lg:text-[31px]">
            Explore properties in {selectedCountry}
          </p>
        </div>
        <div className="flex items-center justify-between w-full px-[45px] py-[20px] rounded-[20px] bg-[#ECE1C8] shadow-[0_31px_62px_-16px_rgba(143,144,188,0.15)] backdrop-blur-[10px]">
          <div className="flex flex-col items-start w-full">
            <p className="text-[18px] font-semibold">Search</p>
            <div
              className="w-full"
              style={{ cursor: "pointer", position: "relative", userSelect: "none" }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="flex items-center justify-between w-full">
                <p className="text-[16px]">{selectedCountry}</p>
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
                    backgroundColor: "#ece1c8",
                    color: "#000",
                    borderRadius: "0 0 20px 20px",
                    maxHeight: 200,
                    overflowY: "auto",
                    zIndex: 20,
                    boxShadow: "0 31.242px 62.484px -15.621px rgba(143, 144, 188, 0.15)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {selectedCountries.map((c) => (
                    <li
                      key={c}
                      onClick={() => handleSelect(c)}
                      className={`flex items-center gap-[20px] w-full py-[9px] px-[12px] border-l-[3px] ${
                        c === selectedCountry ? " border-[#C6A45A]" : "border-transparent"
                      }`}
                      style={{
                        background:
                          c === selectedCountry
                            ? "linear-gradient(90deg, #FFF 0%, rgba(198, 164, 90, 0.00) 100%)"
                            : "transparent",
                      }}
                    >
                      <img
                        loading="lazy"
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
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};

export default GlobalGlobe;
