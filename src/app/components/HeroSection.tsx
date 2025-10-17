'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import React from 'react';

const World = dynamic(
  () => import('../../components/ui/globe').then(m => m.World),
  {
    ssr: false,
  }
);

// Static Globe Component - completely isolated from slide changes
const StaticGlobe = React.memo(() => {
  const staticGlobeConfig = useMemo(
    () => ({
      pointSize: 6,
      globeColor: '#000000',
      showAtmosphere: true,
      atmosphereColor: '#ffffff',
      atmosphereAltitude: 0.2,
      emissive: '#000000',
      emissiveIntensity: 0.1,
      shininess: 0.9,
      polygonColor: '#ff6600',
      ambientLight: '#ffffff',
      directionalLeftLight: '#ffffff',
      directionalTopLight: '#ffffff',
      directionalRightLight: '#ffffff',
      directionalBottomLight: '#ffffff',
      pointLight: '#ffffff',
      arcTime: 1000,
      arcLength: 0.9,
      rings: 1,
      maxRings: 3,
      initialPosition: { lat: -15.0, lng: 20.0 },
      autoRotate: false,
      autoRotateSpeed: 0,
    }),
    []
  );

  const staticColors = useMemo(() => ['#ffffff', '#f05922', '#ffffff'], []);

  const staticSampleArcs = useMemo(
    () => [
      {
        order: 1,
        startLat: -19.885592,
        startLng: -43.951191,
        endLat: -22.9068,
        endLng: -43.1729,
        arcAlt: 0.1,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 1,
        startLat: 28.6139,
        startLng: 77.209,
        endLat: 3.139,
        endLng: 101.6869,
        arcAlt: 0.2,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 1,
        startLat: -19.885592,
        startLng: -43.951191,
        endLat: -1.303396,
        endLng: 36.852443,
        arcAlt: 0.5,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 2,
        startLat: 1.3521,
        startLng: 103.8198,
        endLat: 35.6762,
        endLng: 139.6503,
        arcAlt: 0.2,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 2,
        startLat: 51.5072,
        startLng: -0.1276,
        endLat: 3.139,
        endLng: 101.6869,
        arcAlt: 0.3,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 2,
        startLat: -15.785493,
        startLng: -47.909029,
        endLat: 36.162809,
        endLng: -115.119411,
        arcAlt: 0.3,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 3,
        startLat: -33.8688,
        startLng: 151.2093,
        endLat: 22.3193,
        endLng: 114.1694,
        arcAlt: 0.3,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 3,
        startLat: 21.3099,
        startLng: -157.8581,
        endLat: 40.7128,
        endLng: -74.006,
        arcAlt: 0.3,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 3,
        startLat: -6.2088,
        startLng: 106.8456,
        endLat: 51.5072,
        endLng: -0.1276,
        arcAlt: 0.3,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 4,
        startLat: 11.986597,
        startLng: 8.571831,
        endLat: -15.595412,
        endLng: -56.05918,
        arcAlt: 0.5,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 4,
        startLat: -34.6037,
        startLng: -58.3816,
        endLat: 22.3193,
        endLng: 114.1694,
        arcAlt: 0.7,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 4,
        startLat: 51.5072,
        startLng: -0.1276,
        endLat: 48.8566,
        endLng: -2.3522,
        arcAlt: 0.1,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 5,
        startLat: 14.5995,
        startLng: 120.9842,
        endLat: 51.5072,
        endLng: -0.1276,
        arcAlt: 0.3,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 5,
        startLat: 1.3521,
        startLng: 103.8198,
        endLat: -33.8688,
        endLng: 151.2093,
        arcAlt: 0.2,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 5,
        startLat: 34.0522,
        startLng: -118.2437,
        endLat: 48.8566,
        endLng: -2.3522,
        arcAlt: 0.2,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 6,
        startLat: -15.432563,
        startLng: 28.315853,
        endLat: 1.094136,
        endLng: -63.34546,
        arcAlt: 0.7,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 6,
        startLat: 37.5665,
        startLng: 126.978,
        endLat: 35.6762,
        endLng: 139.6503,
        arcAlt: 0.1,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 6,
        startLat: 22.3193,
        startLng: 114.1694,
        endLat: 51.5072,
        endLng: -0.1276,
        arcAlt: 0.3,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 7,
        startLat: -19.885592,
        startLng: -43.951191,
        endLat: -15.595412,
        endLng: -56.05918,
        arcAlt: 0.1,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 7,
        startLat: 48.8566,
        startLng: -2.3522,
        endLat: 52.52,
        endLng: 13.405,
        arcAlt: 0.1,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 7,
        startLat: 52.52,
        startLng: 13.405,
        endLat: 34.0522,
        endLng: -118.2437,
        arcAlt: 0.2,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 8,
        startLat: -8.833221,
        startLng: 13.264837,
        endLat: -33.936138,
        endLng: 18.436529,
        arcAlt: 0.2,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 8,
        startLat: 49.2827,
        startLng: -123.1207,
        endLat: 52.3676,
        endLng: 4.9041,
        arcAlt: 0.2,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 8,
        startLat: 1.3521,
        startLng: 103.8198,
        endLat: 40.7128,
        endLng: -74.006,
        arcAlt: 0.5,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 9,
        startLat: 51.5072,
        startLng: -0.1276,
        endLat: 34.0522,
        endLng: -118.2437,
        arcAlt: 0.2,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 9,
        startLat: 22.3193,
        startLng: 114.1694,
        endLat: -22.9068,
        endLng: -43.1729,
        arcAlt: 0.7,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 9,
        startLat: 1.3521,
        startLng: 103.8198,
        endLat: -34.6037,
        endLng: -58.3816,
        arcAlt: 0.5,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 10,
        startLat: -22.9068,
        startLng: -43.1729,
        endLat: 28.6139,
        endLng: 77.209,
        arcAlt: 0.7,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 10,
        startLat: 34.0522,
        startLng: -118.2437,
        endLat: 31.2304,
        endLng: 121.4737,
        arcAlt: 0.3,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 10,
        startLat: -6.2088,
        startLng: 106.8456,
        endLat: 52.3676,
        endLng: 4.9041,
        arcAlt: 0.3,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 11,
        startLat: 41.9028,
        startLng: 12.4964,
        endLat: 34.0522,
        endLng: -118.2437,
        arcAlt: 0.2,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 11,
        startLat: -6.2088,
        startLng: 106.8456,
        endLat: 31.2304,
        endLng: 121.4737,
        arcAlt: 0.2,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 11,
        startLat: 22.3193,
        startLng: 114.1694,
        endLat: 1.3521,
        endLng: 103.8198,
        arcAlt: 0.2,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 12,
        startLat: 34.0522,
        startLng: -118.2437,
        endLat: 37.7749,
        endLng: -122.4194,
        arcAlt: 0.1,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 12,
        startLat: 35.6762,
        startLng: 139.6503,
        endLat: 22.3193,
        endLng: 114.1694,
        arcAlt: 0.2,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 12,
        startLat: 22.3193,
        startLng: 114.1694,
        endLat: 34.0522,
        endLng: -118.2437,
        arcAlt: 0.3,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 13,
        startLat: 52.52,
        startLng: 13.405,
        endLat: 22.3193,
        endLng: 114.1694,
        arcAlt: 0.3,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 13,
        startLat: 11.986597,
        startLng: 8.571831,
        endLat: 35.6762,
        endLng: 139.6503,
        arcAlt: 0.3,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 13,
        startLat: -22.9068,
        startLng: -43.1729,
        endLat: -34.6037,
        endLng: -58.3816,
        arcAlt: 0.1,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 14,
        startLat: -33.936138,
        startLng: 18.436529,
        endLat: 21.395643,
        endLng: 39.883798,
        arcAlt: 0.3,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      // Melbourne arcs
      {
        order: 15,
        startLat: -37.8136,
        startLng: 144.9631,
        endLat: -33.8688,
        endLng: 151.2093,
        arcAlt: 0.2,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 15,
        startLat: -37.8136,
        startLng: 144.9631,
        endLat: 1.3521,
        endLng: 103.8198,
        arcAlt: 0.4,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 15,
        startLat: -37.8136,
        startLng: 144.9631,
        endLat: 22.3193,
        endLng: 114.1694,
        arcAlt: 0.3,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      // Brisbane arcs
      {
        order: 16,
        startLat: -27.4698,
        startLng: 153.0251,
        endLat: -33.8688,
        endLng: 151.2093,
        arcAlt: 0.1,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 16,
        startLat: -27.4698,
        startLng: 153.0251,
        endLat: -37.8136,
        endLng: 144.9631,
        arcAlt: 0.2,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 16,
        startLat: -27.4698,
        startLng: 153.0251,
        endLat: 35.6762,
        endLng: 139.6503,
        arcAlt: 0.3,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
      {
        order: 16,
        startLat: -27.4698,
        startLng: 153.0251,
        endLat: 1.3521,
        endLng: 103.8198,
        arcAlt: 0.4,
        color:
          staticColors[Math.floor(Math.random() * (staticColors.length - 1))],
      },
    ],
    [staticColors]
  );

  return <World data={staticSampleArcs} globeConfig={staticGlobeConfig} />;
});
StaticGlobe.displayName = 'StaticGlobe';

interface HeroSectionProps {
  slides: Slide[];
}

interface Slide {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  button_link: string | null;
  is_active: boolean;
  display_order: number;
}

export default function HeroSection({ slides }: HeroSectionProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const currentSlide = slides[currentSlideIndex] || slides[0];

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex(prevIndex => (prevIndex + 1) % slides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleDotClick = (index: number) => {
    setCurrentSlideIndex(index);
  };

  return (
    <section className="relative min-h-[70vh] lg:min-h-screen flex items-center justify-start bg-black pt-[112px]">
      {/* Globe Background - Static, loads only once */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-visible">
        <div className="absolute -top-220 -left-300 w-[200%] h-[200%] scale-125">
          <StaticGlobe />
        </div>
      </div>

      {/* City Hover Areas */}
      <div className="absolute inset-0 pointer-events-auto z-10">
        {/* Sydney */}
        <div className="absolute w-12 h-12 top-[60%] left-[65%] group cursor-pointer">
          <div className="w-full h-full bg-transparent hover:bg-orange-500/20 rounded-full transition-colors duration-200"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-2 rounded text-sm font-bold whitespace-nowrap">
              Sydney
            </div>
          </div>
        </div>

        {/* Melbourne */}
        <div className="absolute w-12 h-12 top-[70%] left-[55%] group cursor-pointer">
          <div className="w-full h-full bg-transparent hover:bg-orange-500/20 rounded-full transition-colors duration-200"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-2 rounded text-sm font-bold whitespace-nowrap">
              Melbourne
            </div>
          </div>
        </div>

        {/* Brisbane */}
        <div className="absolute w-12 h-12 top-[50%] left-[75%] group cursor-pointer">
          <div className="w-full h-full bg-transparent hover:bg-orange-500/20 rounded-full transition-colors duration-200"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-2 rounded text-sm font-bold whitespace-nowrap">
              Brisbane
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative flex flex-col lg:flex-row items-start justify-start px-4 sm:px-6 lg:px-8 gap-8 lg:gap-16 xl:gap-20 z-10 -mt-16 lg:-mt-30">
        {/* Left side - Text content */}
        <div className="flex-1 max-w-2xl lg:max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              className="relative z-20 text-left text-white"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-inter font-bold font-weight-700 text-white leading-tight mb-3">
                {currentSlide.title.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < currentSlide.title.split('\n').length - 1 && (
                      <br />
                    )}
                  </span>
                ))}
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-lg lg:text-xl text-white leading-relaxed max-w-2xl mb-3">
                {currentSlide.subtitle}
              </p>

              {/* Call to Action */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              >
                <button className="px-12 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all duration-300 text-lg">
                  {currentSlide.button_text || 'Learn More'} →
                </button>
              </motion.div>

              {/* Pagination Dots */}
            </motion.div>
          </AnimatePresence>

          {slides.length > 1 && (
            <div
              className="flex gap-5 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlideIndex
                      ? 'bg-orange-600 scale-125'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
