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

const countryAliases: Record<string, string[]> = {
  Egypt: ["Egypt"],
  Bulgaria: ["Bulgaria"],
  Greece: ["Greece"],
  Cyprus: ["Cyprus", "Northern Cyprus"],
  "South Africa": ["South Africa"],
  Malta: ["Malta"],
};

const isCountryFeature = (featureName: string, countryName: string) => {
  const aliases = countryAliases[countryName] ?? [countryName];
  return aliases.some((name) => norm(name) === norm(featureName));
};

const getSmallCountryMarker = (countryName: string) => {
  if (countryName === "Cyprus") {
    return {
      name: "Cyprus",
      lat: 35.1264,
      lng: 33.4299,
      radius: 0.55,
    };
  }

  if (countryName === "Malta") {
    return {
      name: "Malta",
      lat: 35.9375,
      lng: 14.3754,
      radius: 0.48,
    };
  }

  return null;
};

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
    "Egypt",
    "Bulgaria",
    "Greece",
    "Cyprus",
    "South Africa",
    "Malta",
  ];

  const brandGold = "#C6A45A";
  const searchBoxBlack = "rgba(10, 12, 13, 0.94)";
  const searchBoxBorder = "rgba(214, 180, 95, 0.72)";
  const dropdownHoverGold =
    "linear-gradient(90deg, rgba(198, 164, 90, 0.28) 0%, rgba(198, 164, 90, 0.07) 52%, rgba(198, 164, 90, 0.00) 100%)";

  const transparentGlobeBase = "#FFFFFF";
  const transparentCountryFill = "rgba(255, 255, 255, 0)";

  const globeMapLineGold = "rgba(255, 211, 112, 1)";
  const globeSideTransparent = "rgba(255, 211, 112, 0.08)";
  const selectedGlobeGold = "#D6B45F";
  const selectedStrokeGold = "#FFE9B0";

  useEffect(() => {
    if (!syncSelectedToUrl) return;

    try {
      const url = new URL(window.location.href);
      const fromUrl = url.searchParams.get(selectedParamKey);

      if (!fromUrl || fromUrl.trim() === "") {
        const defaultCountry = "Bulgaria";

        if (selectedCountry !== defaultCountry) {
          setSelectedCountry(defaultCountry);
        }

        return;
      }

      const canonical = findCanonical(fromUrl, selectedCountries);

      if (canonical && canonical !== selectedCountry) {
        setSelectedCountry(canonical);
      } else if (!canonical && selectedCountry !== "Bulgaria") {
        setSelectedCountry("Bulgaria");
      }
    } catch {}

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!syncSelectedToUrl) return;

    try {
      const url = new URL(window.location.href);
      const currentParam = url.searchParams.get(selectedParamKey);
      const normalizedSelected = norm(selectedCountry);

      if (currentParam !== normalizedSelected) {
        url.searchParams.set(selectedParamKey, normalizedSelected);
        window.history.replaceState(null, "", url.toString());
      }
    } catch {}
  }, [selectedCountry, syncSelectedToUrl, selectedParamKey]);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;

    const applySize = () => {
      const w = el.clientWidth || el.offsetWidth;
      const h = el.clientHeight || el.offsetHeight;

      if (worldRef.current) {
        worldRef.current.width(w).height(h);
      }
    };

    const ro = new ResizeObserver(applySize);
    ro.observe(el);

    const t = setTimeout(applySize, 0);

    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    (async () => {
      const Globe = (await import("globe.gl")).default;
      if (cancelled) return;

      const world = new Globe(container)
        .showAtmosphere(false)
        .backgroundColor("rgba(0, 0, 0, 0.0)")
        .labelsData([])
        .labelSize(0.8)
        .labelDotRadius(0.2)
        .labelColor(() => "rgba(255, 255, 255, 0)")
        .labelResolution(50);

      world.controls().enableZoom = enableZoom;

      const globeMaterial = world.globeMaterial() as THREE.MeshPhongMaterial;

      globeMaterial.opacity = 0.045;
      globeMaterial.transparent = true;
      globeMaterial.color = new THREE.Color(transparentGlobeBase);
      globeMaterial.shininess = 120;
      globeMaterial.specular = new THREE.Color("#FFD370");
      globeMaterial.depthWrite = false;

      world.controls().autoRotate = false;

      if (globeScale !== 1) {
        world.scene().scale.set(globeScale, globeScale, globeScale);
      }

      worldRef.current = world;

      const w = container.clientWidth || 0;
      const h = container.clientHeight || 0;

      world.width(w).height(h);

      world.pointOfView({
        lat: 20,
        lng: 30,
        altitude: initialAltitude,
      });

      const res = await fetch(
        "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
      );

      const countries = await res.json();
      if (cancelled) return;

      const filtered = countries.features.filter((f: any) =>
        selectedCountries.some((c) => isCountryFeature(f.properties.name, c))
      );
      const selectedMarker = getSmallCountryMarker(selectedCountry);

      world
        .polygonsData(countries.features)
        .polygonAltitude((d: any) =>
          isCountryFeature(d.properties.name, selectedCountry) ? 0.013 : 0.007
        )
        .polygonCapColor((d: any) =>
          isCountryFeature(d.properties.name, selectedCountry)
            ? selectedGlobeGold
            : transparentCountryFill
        )
        .polygonSideColor(() => globeSideTransparent)
        .polygonStrokeColor((d: any) =>
          isCountryFeature(d.properties.name, selectedCountry)
            ? selectedStrokeGold
            : globeMapLineGold
        )
        .pointsData(selectedMarker ? [selectedMarker] : [])
        .pointLat((d: any) => d.lat)
        .pointLng((d: any) => d.lng)
        .pointAltitude(0.018)
        .pointRadius((d: any) => d.radius)
        .pointColor(() => selectedGlobeGold)
        .pointResolution(32);

      const labelsData = filtered.map((f: any) => {
        const [lng, lat] = turf.centroid(f).geometry.coordinates;

        const canonicalName =
          selectedCountries.find((c) =>
            isCountryFeature(f.properties.name, c)
          ) ?? f.properties.name;

        return {
          lat,
          lng,
          name: canonicalName,
          feature: f,
        };
      });

      if (!labelsData.some((d: any) => d.name === "Cyprus")) {
        labelsData.push({
          name: "Cyprus",
          lat: 35.1264,
          lng: 33.4299,
          feature: null,
        });
      }

      if (!labelsData.some((d: any) => d.name === "Malta")) {
        labelsData.push({
          name: "Malta",
          lat: 35.9375,
          lng: 14.3754,
          feature: null,
        });
      }

      setLabels(labelsData);

      world.labelsData(labelsData).labelText((d: any) => d.name);

      const target =
        labelsData.find((d: any) => d.name === selectedCountry) ??
        labelsData.find((d: any) => d.name === "Bulgaria");

      if (target) {
        world.pointOfView(
          {
            lat: target.lat,
            lng: target.lng,
            altitude: initialAltitude,
          },
          2000
        );
      }
    })();

    return () => {
      cancelled = true;
      worldRef.current?._destructor?.();
      worldRef.current = null;
      container.innerHTML = "";
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableZoom, globeScale, initialAltitude]);

  useEffect(() => {
    const world = worldRef.current;
    if (!world) return;

    world
      .polygonAltitude((d: any) =>
        isCountryFeature(d.properties.name, selectedCountry) ? 0.013 : 0.007
      )
      .polygonCapColor((d: any) =>
        isCountryFeature(d.properties.name, selectedCountry)
          ? selectedGlobeGold
          : transparentCountryFill
      )
      .polygonSideColor(() => globeSideTransparent)
      .polygonStrokeColor((d: any) =>
        isCountryFeature(d.properties.name, selectedCountry)
          ? selectedStrokeGold
          : globeMapLineGold
      )
      .pointsData(
        getSmallCountryMarker(selectedCountry)
          ? [getSmallCountryMarker(selectedCountry)]
          : []
      )
      .pointLat((d: any) => d.lat)
      .pointLng((d: any) => d.lng)
      .pointAltitude(0.018)
      .pointRadius((d: any) => d.radius)
      .pointColor(() => selectedGlobeGold)
      .pointResolution(32);

    const target =
      labels.find((d: any) => d.name === selectedCountry) ??
      labels.find((d: any) => d.name === "Bulgaria");

    if (target) {
      const alt =
        selectedCountry === "Malta" || selectedCountry === "Cyprus"
          ? Math.min(initialAltitude, 0.9)
          : initialAltitude;

      world.pointOfView(
        {
          lat: target.lat,
          lng: target.lng,
          altitude: alt,
        },
        1200
      );
    }
  }, [selectedCountry, labels, initialAltitude]);

  const handleSelect = (countryName: string) => {
    setSelectedCountry(countryName);
    setDropdownOpen(false);
  };

  const style: React.CSSProperties = fullscreen
    ? {
        width: "100vh",
        height: "100vh",
        position: "relative",
      }
    : {
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size}px` : size,
        position: "relative",
      };

  const icon = useIcons();

  return (
    <div className="relative z-10 mt-0 flex w-full flex-col items-center justify-between gap-[15px] overflow-visible lg:mt-0 lg:flex-row">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[calc(100%+120px)] w-screen -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.46) 0%, rgba(0,0,0,0.38) 42%, rgba(0,0,0,0.22) 72%, rgba(0,0,0,0.08) 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute bottom-[-55px] left-1/2 z-[1] h-[150px] w-screen -translate-x-1/2 lg:bottom-[-115px] lg:h-[240px]"
        style={{
          background:
            "linear-gradient(0deg, #FFFFFF 0%, rgba(255,255,255,0.96) 22%, rgba(255,255,255,0.72) 46%, rgba(255,255,255,0.32) 72%, rgba(255,255,255,0.00) 100%)",
        }}
      />

      <div className="relative z-10 flex w-full flex-col items-start gap-[15px] lg:w-[390px] lg:gap-[26px]">
        <div className="flex flex-col items-start">
          <p className="CormorantGaramond text-[30px] font-semibold leading-[1.08] text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.75)] lg:text-[46px]">
            Explore properties in {selectedCountry}
          </p>
        </div>

        <div
          className="flex w-full max-w-[330px] items-center justify-between rounded-[18px] px-[22px] py-[16px] text-white backdrop-blur-[18px] lg:max-w-[315px] lg:px-[26px] lg:py-[18px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(8,10,12,0.96) 0%, rgba(18,20,22,0.92) 52%, rgba(8,10,12,0.96) 100%)",
            border: `1px solid ${searchBoxBorder}`,
            boxShadow:
              "0 22px 55px -24px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 22px rgba(198,164,90,0.16)",
            position: "relative",
            overflow: "visible",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "1px",
              borderRadius: "17px",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 38%, rgba(198,164,90,0.10) 100%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: 0,
              left: "18%",
              width: "42%",
              height: "1px",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,231,176,0.85), rgba(255,255,255,0))",
              pointerEvents: "none",
            }}
          />

          <div
            className="w-full"
            style={{
              cursor: "pointer",
              position: "relative",
              userSelect: "none",
              zIndex: 2,
            }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-[10px]">
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "999px",
                    backgroundColor: brandGold,
                    boxShadow: "0 0 12px rgba(198,164,90,0.8)",
                    flexShrink: 0,
                  }}
                />

                <p
                  className="text-[16px] tracking-[0.02em] text-white lg:text-[17px]"
                  style={{
                    fontWeight: 900,
                    fontFamily: "Inter, Poppins, Arial, Helvetica, sans-serif",
                    textShadow: "0 1px 10px rgba(0,0,0,0.75)",
                  }}
                >
                  {selectedCountry}
                </p>
              </div>

              <span
                className={`text-[18px] transition-transform duration-300 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                style={{
                  color: "#FFE9B0",
                  fontWeight: 900,
                  textShadow: "0 0 12px rgba(198,164,90,0.65)",
                }}
              >
                ▼
              </span>
            </div>

            {dropdownOpen && (
              <ul
                className="small-scroll"
                style={{
                  margin: 0,
                  padding: "8px 0",
                  listStyle: "none",
                  position: "absolute",
                  top: "165%",
                  left: 0,
                  width: "100%",
                  background:
                    "linear-gradient(135deg, rgba(8,10,12,0.98) 0%, rgba(18,20,22,0.96) 100%)",
                  color: "#FFFFFF",
                  borderRadius: "0 0 20px 20px",
                  maxHeight: 200,
                  overflowY: "auto",
                  zIndex: 20,
                  border: `1px solid ${searchBoxBorder}`,
                  borderTop: "none",
                  boxShadow:
                    "0 28px 60px -20px rgba(0,0,0,0.75), 0 0 22px rgba(198,164,90,0.12)",
                  backdropFilter: "blur(18px)",
                }}
              >
                {selectedCountries.map((c) => (
                  <li
                    key={c}
                    onClick={() => handleSelect(c)}
                    className="flex w-full items-center border-l-[3px] px-[14px] py-[11px]"
                    style={{
                      borderColor:
                        c === selectedCountry ? brandGold : "transparent",
                      background:
                        c === selectedCountry
                          ? dropdownHoverGold
                          : "transparent",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "999px",
                        marginRight: 10,
                        backgroundColor:
                          c === selectedCountry
                            ? brandGold
                            : "rgba(255,255,255,0.28)",
                        boxShadow:
                          c === selectedCountry
                            ? "0 0 10px rgba(198,164,90,0.75)"
                            : "none",
                        flexShrink: 0,
                      }}
                    />

                    <p
                      className="text-[16px]"
                      style={{
                        fontWeight: c === selectedCountry ? 900 : 800,
                        fontFamily:
                          "Inter, Poppins, Arial, Helvetica, sans-serif",
                        color: c === selectedCountry ? "#FFE9B0" : "#FFFFFF",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {c}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className={`${className} relative z-10 hidden lg:block`} style={style}>
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};

export default GlobalGlobe;
