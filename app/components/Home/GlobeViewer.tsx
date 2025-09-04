import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as turf from "@turf/turf";

type GlobeViewerProps = {
  /** Container sizing */
  fullscreen?: boolean;
  width?: number | string; // default "100%"
  height?: number | string; // default 600
  className?: string;

  /** How big the globe looks inside the canvas (camera distance). Smaller = closer. */
  initialAltitude?: number; // default 1.2

  /** Allow mouse-wheel zoom/pinch. */
  enableZoom?: boolean; // default false

  /** Optional hard scale of the 3D globe object (rarely needed). 1 = no scale. */
  globeScale?: number; // default 1
};

const GlobeViewer: React.FC<GlobeViewerProps> = ({
  fullscreen = false,
  width = "100%",
  height = 600,
  className = "",
  initialAltitude = 1.4,
  enableZoom = false,
  globeScale = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<any>(null);
  const [labels, setLabels] = useState<any[]>([]);

  const selectedCountries = [
    "United Arab Emirates",
    "Egypt",
    "Bulgaria",
    "Greece",
    "Malta",
    "Cyprus",
    "South Africa",
  ];

  // Keep canvas sized to container
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

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    (async () => {
      const Globe = (await import("globe.gl")).default;

      const world = Globe()(containerRef.current)
        .showAtmosphere(false)
        .backgroundColor("white")
        .polygonCapColor(() => "yellow")
        .polygonSideColor(() => "rgba(0, 0, 0, 0.2)")
        .polygonStrokeColor(() => "#000")
        .labelsData([])
        .labelSize(0.8)
        .labelDotRadius(0.2)
        .labelColor(() => "black")
        .labelResolution(50);

      // Controls & material
      world.controls().enableZoom = enableZoom;
      world.globeMaterial().color = new THREE.Color("transparent");
      world.globeMaterial().opacity = 0.7;
      world.globeMaterial().transparent = true;
      world.controls().autoRotate = true;
      world.controls().autoRotateSpeed = 0.6;

      // Optional hard scale of the whole globe object
      if (globeScale !== 1) {
        world.scene().scale.set(globeScale, globeScale, globeScale);
      }

      worldRef.current = world;

      // Ensure size is correct on first paint
      const w = containerRef.current.clientWidth || 0;
      const h = containerRef.current.clientHeight || 0;
      world.width(w).height(h);

      // Start closer to the globe (make it look bigger)
      // You can tweak the lat/lng to your preferred starting region
      world.pointOfView({ lat: 20, lng: 30, altitude: initialAltitude });

      // Load countries
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
        .polygonCapColor(() => "rgba(196, 175, 134, 0.7)");

      const labelsData = filtered.map((f: any) => {
        const [lng, lat] = turf.centroid(f).geometry.coordinates;
        return { lat, lng, name: f.properties.name, feature: f };
      });

      setLabels(labelsData);
      world.labelsData(labelsData).labelText((d: any) => d.name);
    })();

    return () => {
      cancelled = true;
      worldRef.current = null;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [enableZoom, globeScale, initialAltitude]);

  // Container style controls canvas size
  const style: React.CSSProperties = fullscreen
    ? { width: "100vw", height: "100vh", position: "relative" }
    : {
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        position: "relative",
      };

  return (
    <div className={className} style={style}>
      {/* globe.gl renders into this and it fills 100% of it */}
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default GlobeViewer;
