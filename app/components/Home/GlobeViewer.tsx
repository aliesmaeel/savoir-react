import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import * as turf from '@turf/turf';

const GlobeViewer = () => {
    const globeRef = useRef<HTMLDivElement>(null);
    const [labels, setLabels] = useState<any[]>([]);
    const worldRef = useRef<any>(null);

    const selectedCountries = [
        'United Arab Emirates',
        'Egypt',
        'Bulgaria',
        'Greece',
        'Malta',
        'Cyprus',
        'South Africa',
    ];

    useEffect(() => {
        if (!globeRef.current) return;

        (async () => {
            // ✅ import only on client
            const Globe = (await import('globe.gl')).default;

            const world = Globe()(globeRef.current)
                .showAtmosphere(false)
                .backgroundColor('white')
                .polygonCapColor(() => 'yellow')
                .polygonSideColor(() => 'rgba(0, 0, 0, 0.2)')
                .polygonStrokeColor(() => '#000')
                .labelsData([])
                .labelSize(0.8)
                .labelDotRadius(0.2)
                .labelColor(() => 'black')
                .labelResolution(50);

            world.controls().enableZoom = false;

            world.globeMaterial().color = new THREE.Color('transparent');
            world.globeMaterial().opacity = 0.7;
            world.globeMaterial().transparent = true;

            worldRef.current = world;

            // Load countries GeoJSON
            const res = await fetch(
                'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
            );
            const countries = await res.json();

            const filteredFeatures = countries.features.filter((f: any) =>
                selectedCountries.includes(f.properties.name)
            );

            world.polygonsData(countries.features).polygonAltitude(0.005)
                .polygonCapColor(() => 'rgba(196, 175, 134, 0.7)');

            const labelsData = filteredFeatures.map((f: any) => {
                const centroid = turf.centroid(f).geometry.coordinates;
                return {
                    lat: centroid[1],
                    lng: centroid[0],
                    name: f.properties.name,
                    feature: f,
                };
            });

            setLabels(labelsData);
            world.labelsData(labelsData).labelText((d: any) => d.name);
        })();
    }, []);

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <div ref={globeRef} style={{ width: '100%', height: '100%' }} />
            <div
                id="filters"
                style={{
                    padding: '10px',
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(255,255,255,0.8)',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
            >
                {labels.map((c) => (
                    <button
                        key={c.name}
                        onClick={() => {
                            worldRef.current.pointOfView(
                                { lat: c.lat, lng: c.lng, altitude: 1.5 },
                                1200
                            );
                            worldRef.current.polygonCapColor((d: any) =>
                                d.properties.name === c.name
                                    ? 'rgba(255, 215, 0, 0.7)'
                                    : 'rgba(198, 175, 134, 0.7)'
                            );
                        }}
                    >

                    </button>
                ))}
            </div>
        </div>
    );
};

export default GlobeViewer;
