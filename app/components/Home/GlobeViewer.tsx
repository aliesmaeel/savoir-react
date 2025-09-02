import React, { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Globe from "globe.gl";
import * as turf from "@turf/turf";

type Label = {
  lat: number;
  lng: number;
  name: string;
  feature: any;
};

type Props = {
  selectedCountries?: string[];
  height?: string | number;
};

const DEFAULT_COUNTRIES = [
  "United Arab Emirates",
  "Egypt",
  "Bulgaria",
  "Greece",
  "Malta",
  "Cyprus",
  "South Africa",
];

const GEOJSON_URL =
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

const GlobeViewer: React.FC<Props> = ({
  selectedCountries = DEFAULT_COUNTRIES,
  height = "100vh",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<ReturnType<typeof Globe> | null>(null);

  const [labels, setLabels] = useState<Label[]>([]);
  const selectedNameRef = useRef<string | null>(null);

  // Initialize globe once on mount
  useEffect(() => {
    if (typeof window === "undefined") return; // SSR guard
    if (!containerRef.current) return;

    // Create globe instance
    const world = Globe()(containerRef.current)
      .showAtmosphere(false)
      .backgroundColor("white")
      .labelsData([])
      .labelSize(0.8)
      .labelDotRadius(0.2)
      .labelColor(() => "black")
      .labelResolution(50);

    // Save instance
    globeRef.current = world;

    // Tweak controls / material
    const controls = world.controls();
    if (controls) {
      controls.enableZoom = false;
    }

    const material = world.globeMaterial();
    // Transparent glossy globe look
    material.color = new THREE.Color("transparent");
    material.opacity = 0.7;
    material.transparent = true;

    // Load GeoJSON and configure polygons + labels
    let isCancelled = false;

    fetch(GEOJSON_URL)
      .then((res) => res.json())
      .then((countries) => {
        if (isCancelled) return;

        const allFeatures = countries.features as any[];
        const filtered = allFeatures.filter((f) => selectedCountries.includes(f.properties?.name));

        world
          .polygonsData(allFeatures)
          .polygonAltitude(0.005)
          .polygonSideColor(() => "rgba(0,0,0,0.2)")
          .polygonStrokeColor(() => "#000")
          .polygonCapColor((d: any) => {
            const name: string = d?.properties?.name ?? "";
            const isSelected = selectedNameRef.current === name;
            return isSelected
              ? "rgba(255, 215, 0, 0.7)" // highlighted (gold-ish)
              : "rgba(196, 175, 134, 0.7)"; // default
          });

        const labelsData: Label[] = filtered.map((f) => {
          const centroid = turf.centroid(f).geometry.coordinates; // [lng, lat]
          return {
            lat: centroid[1],
            lng: centroid[0],
            name: f.properties?.name ?? "Unknown",
            feature: f,
          };
        });

        setLabels(labelsData);
        world.labelsData(labelsData).labelText((d: any) => d.name);
      })
      .catch((err) => {
        // Optional: surface errors in dev
        console.error("Failed to load world geojson:", err);
      });

    // Handle resize
    const handleResize = () => {
      world.width(containerRef.current!.clientWidth);
      world.height(containerRef.current!.clientHeight);
    };
    window.addEventListener("resize", handleResize);
    // Initial size sync
    handleResize();

    // Cleanup
    return () => {
      isCancelled = true;
      window.removeEventListener("resize", handleResize);

      try {
        // Dispose three objects to avoid leaks
        (world as any)._renderer?.dispose?.();
        (world as any)._scene?.traverse?.((obj: any) => {
          if (obj.isMesh) {
            obj.geometry?.dispose?.();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m: any) => m?.dispose?.());
            } else {
              obj.material?.dispose?.();
            }
          }
        });
        world.controls()?.dispose?.();
      } catch {
        // ignore best-effort cleanup errors
      }

      // Remove canvas from container
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      globeRef.current = null;
    };
  }, [selectedCountries]);

  const handleSelect = useCallback((name: string, lat: number, lng: number) => {
    const world = globeRef.current;
    if (!world) return;

    selectedNameRef.current = name;

    // Re-apply coloring function to reflect new selection
    world.polygonCapColor((d: any) => {
      const n: string = d?.properties?.name ?? "";
      const isSelected = n === selectedNameRef.current;
      return isSelected ? "rgba(255, 215, 0, 0.7)" : "rgba(196, 175, 134, 0.7)";
    });

    // Animate the camera
    world.pointOfView({ lat, lng, altitude: 1.5 }, 1200);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height,
        position: "relative",
      }}
    >
      <div ref={containerRef} style={{ width: "100%", height: "100%", display: "block" }} />
      <div
        style={{
          padding: "10px",
          position: "absolute",
          top: 10,
          left: 10,
          background: "rgba(255,255,255,0.85)",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        {labels.map((c) => (
          <button
            key={c.name}
            onClick={() => handleSelect(c.name, c.lat, c.lng)}
            style={{
              margin: 4,
              padding: "6px 10px",
              fontSize: 12,
              borderRadius: 6,
              border: "1px solid rgba(0,0,0,0.1)",
              background: selectedNameRef.current === c.name ? "#ffe08a" : "#fff",
              cursor: "pointer",
            }}
            title={`Focus on ${c.name}`}
          >
            {c.name}
          </button>
        ))}
        {labels.length === 0 && <div style={{ fontSize: 12, opacity: 0.7 }}>Loading regions…</div>}
      </div>
    </div>
  );
};

export default GlobeViewer;
