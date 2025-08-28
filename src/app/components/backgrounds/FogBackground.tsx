"use client";

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    VANTA: {
      CLOUDS: (config: any) => any;
      FOG: (config: any) => any;
    };
    THREE: any;
  }
}

export default function FogBackground() {
  const vantaRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load Three.js first, then Vanta.js
    const loadDependencies = async () => {
      // Load Three.js if not already loaded
      if (!window.THREE) {
        console.log('Loading Three.js...');
        const threeScript = document.createElement('script');
        threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        threeScript.onload = () => {
          console.log('Three.js loaded, now loading Vanta.js...');
          loadVanta();
        };
        document.head.appendChild(threeScript);
      } else {
        console.log('Three.js already available, loading Vanta.js...');
        loadVanta();
      }
    };

    // Load Vanta.js script if not already loaded
    const loadVanta = async () => {
      if (!window.VANTA) {
        console.log('Loading Vanta.js FOG...');
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.fog.min.js';
        script.onload = () => {
          console.log('Vanta.js FOG loaded, initializing effect...');
          initVanta();
        };
        script.onerror = () => {
          console.error('Failed to load Vanta.js FOG, trying alternative...');
          // Try alternative CDN
          const altScript = document.createElement('script');
          altScript.src = 'https://unpkg.com/vanta@latest/dist/vanta.fog.min.js';
          altScript.onload = () => {
            console.log('Vanta.js FOG loaded from alternative CDN, initializing effect...');
            initVanta();
          };
          altScript.onerror = () => {
            console.error('Failed to load Vanta.js from both CDNs');
          };
          document.head.appendChild(altScript);
        };
        document.head.appendChild(script);
      } else {
        console.log('Vanta.js already available, initializing FOG effect...');
        initVanta();
      }
    };

    const initVanta = () => {
      if (!window.VANTA || !window.THREE || !containerRef.current) {
        console.log('Dependencies not ready:', { 
          VANTA: !!window.VANTA, 
          THREE: !!window.THREE, 
          container: !!containerRef.current 
        });
        return;
      }

      console.log('Initializing Vanta.js FOG effect...');
      
      vantaRef.current = window.VANTA.FOG({
        el: containerRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        highlightColor: 0xff6600,    // Orange highlight
        midtoneColor: 0xff4400,      // Darker orange midtone
        lowlightColor: 0x2d1b00,     // Dark brown lowlight
        baseColor: 0x0a0a0a,         // Dark base
        blurFactor: 0.6,
        speed: 1.0,
        zoom: 1.0,
        scale: 2,
        scaleMobile: 4
      });
      
      console.log('Vanta.js FOG effect initialized successfully');
    };

    loadDependencies();

    return () => {
      if (vantaRef.current && vantaRef.current.destroy) {
        vantaRef.current.destroy();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ 
        zIndex: 0,
        minHeight: '100vh',
        minWidth: '100vw'
      }}
    />
  );
}
