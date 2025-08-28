// components/CloudBackground.tsx
'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    VANTA: {
      CLOUDS: (config: Record<string, unknown>) => { destroy: () => void };
      FOG: (config: Record<string, unknown>) => { destroy: () => void };
    };
    THREE: Record<string, unknown>;
  }
}

export default function CloudBackground() {
  const vantaRef = useRef<{ destroy: () => void } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load Three.js first, then Vanta.js
    const loadDependencies = async () => {
      // Load Three.js if not already loaded
      if (!window.THREE) {
        console.log('Loading Three.js...');
        const threeScript = document.createElement('script');
        threeScript.src =
          'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
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
        console.log('Loading Vanta.js CLOUDS...');
        const script = document.createElement('script');
        script.src =
          'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.clouds.min.js';
        script.onload = () => {
          console.log('Vanta.js loaded, initializing effect...');
          initVanta();
        };
        document.head.appendChild(script);
      } else {
        console.log('Vanta.js already available, initializing effect...');
        initVanta();
      }
    };

    const initVanta = () => {
      if (!window.VANTA || !window.THREE || !containerRef.current) {
        console.log('Dependencies not ready:', {
          VANTA: !!window.VANTA,
          THREE: !!window.THREE,
          container: !!containerRef.current,
        });
        return;
      }

      console.log('Initializing Vanta.js CLOUDS effect...');

      vantaRef.current = window.VANTA.CLOUDS({
        el: containerRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        skyColor: 0x6899b7,
        cloudColor: 0xadc4d6,
        cloudShadowColor: 0x183a4a,
        sunColor: 0xffd93c,
        sunGlareColor: 0xff6b35,
        sunlightColor: 0xffd93c,
        speed: 1.0,
        backgroundColor: 0x0a0a0a,
      });

      console.log('Vanta.js CLOUDS effect initialized successfully');
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
        minWidth: '100vw',
      }}
    />
  );
}
