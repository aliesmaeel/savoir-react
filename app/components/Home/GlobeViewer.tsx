import React, { useEffect, useRef } from "react";
import * as THREE from "three";

type GlobeViewerProps = {
  fullscreen?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
  initialAltitude?: number;
  enableZoom?: boolean;
  globeScale?: number;
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
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    globe: THREE.Mesh;
    controls?: any;
    animationId?: number;
  } | null>(null);

  // Keep canvas sized to container
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    const applySize = () => {
      if (!sceneRef.current) return;
      const { camera, renderer } = sceneRef.current;
      const w = el.clientWidth || el.offsetWidth;
      const h = el.clientHeight || el.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
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

    // Clear any existing content first
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    if (!containerRef.current) return;

    // Create camera
    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    // Move camera further away to make globe appear smaller
    camera.position.set(0, 0, initialAltitude * 0.7);

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    if (containerRef.current && !cancelled) {
      const existingCanvas = containerRef.current.querySelector("canvas");
      if (!existingCanvas) {
        containerRef.current.appendChild(renderer.domElement);
      }
    }

    // Create globe sphere - smaller radius
    const globeRadius = 0.5;
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);
    
    // Create material with transparent oceans and colored continents - brighter
    const globeMaterial = new THREE.MeshPhongMaterial({
      color: 0xd4bf9e, // Brighter beige color for continents
      transparent: false,
      opacity: 1,
      shininess: 350,
      side: THREE.DoubleSide,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Add brighter lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Increased from 0.6 to 1.0
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // Increased from 0.8 to 1.2
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Add additional light for more brightness
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight2.position.set(-5, -3, -5);
    scene.add(directionalLight2);

    // Load world map texture with alpha channel for transparent oceans
    const textureLoader = new THREE.TextureLoader();
    
    // Try to load a texture that supports transparency
    // Using a simple approach: create a texture that makes oceans transparent
    textureLoader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg",
      (texture) => {
        if (cancelled) return;
        // Create a canvas to process the texture and make oceans transparent
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Process pixels: make oceans lighter and land brighter
           // Improved land + water processing
for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];

  const isWater = b > r + 20 && b > g + 20;

  if (isWater) {
    // --- LIGHTER OCEANS ---
    // soft pastel blue
    data[i]     = 180; // R
    data[i + 1] = 205; // G
    data[i + 2] = 255; // B
    data[i + 3] = 85;  // transparency
  } else {
    // --- INCREASE LAND CONTRAST ---
    // boost brightness + contrast
    const brightness = 1.35;
    const contrast   = 1.25;

    let nr = (r - 128) * contrast + 128;
    let ng = (g - 128) * contrast + 128;
    let nb = (b - 128) * contrast + 128;

    nr = Math.min(255, nr * brightness);
    ng = Math.min(255, ng * brightness);
    nb = Math.min(255, nb * brightness);

    // warm beige tint
    data[i]     = (nr + 240) / 2;
    data[i + 1] = (ng + 220) / 2;
    data[i + 2] = (nb + 190) / 2;
    data[i + 3] = 255; // opaque land
  }
}

            
            ctx.putImageData(imageData, 0, 0);
            const processedTexture = new THREE.CanvasTexture(canvas);
            processedTexture.needsUpdate = true;
            globeMaterial.map = processedTexture;
            globeMaterial.transparent = true;
            globeMaterial.needsUpdate = true;
          };
          img.src = texture.image.src || texture.image.currentSrc;
        } else {
          // Fallback: just use the texture with transparency
          globeMaterial.map = texture;
          globeMaterial.transparent = true;
          globeMaterial.opacity = 0.7;
          globeMaterial.needsUpdate = true;
        }
      },
      undefined,
      (error) => {
        console.warn("Failed to load earth texture, using solid beige color:", error);
        // Use solid beige color as fallback
        globeMaterial.color.setHex(0xc4af86);
        globeMaterial.transparent = true;
        globeMaterial.opacity = 0.7;
      }
    );

    // Auto-rotate animation
    let animationId: number | undefined;
    const animate = () => {
      if (cancelled) return;
      animationId = requestAnimationFrame(animate);
      globe.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    // Optional: Add orbit controls
    if (enableZoom) {
      import("three/examples/jsm/controls/OrbitControls.js").then((module) => {
        if (cancelled) return;
        const OrbitControls = module.OrbitControls;
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 1.5;
        controls.maxDistance = 5;

        sceneRef.current = {
          scene,
          camera,
          renderer,
          globe,
          controls,
          animationId,
        };

        const controlsAnimate = () => {
          if (cancelled) return;
          controls.update();
          globe.rotation.y += 0.005;
          renderer.render(scene, camera);
          requestAnimationFrame(controlsAnimate);
        };
        controlsAnimate();
      });
    } else {
      sceneRef.current = {
        scene,
        camera,
        renderer,
        globe,
        animationId,
      };
    }

    // Apply scale - default to smaller size
    const finalScale = globeScale !== 1 ? globeScale : 0.6;
    globe.scale.set(finalScale, finalScale, finalScale);

    return () => {
      cancelled = true;
      
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      
      if (sceneRef.current?.renderer) {
        sceneRef.current.renderer.dispose();
        const canvas = sceneRef.current.renderer.domElement;
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
      
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      
      sceneRef.current = null;
    };
  }, [enableZoom, globeScale, initialAltitude]);

  const style: React.CSSProperties = fullscreen
    ? { width: "100vw", height: "100vh", position: "relative" }
    : {
        width: "100%", // Always full width
        height: typeof height === "number" ? `${height}px` : height,
        position: "relative",
      };

  return (
    <div className={className} style={style}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default GlobeViewer;
