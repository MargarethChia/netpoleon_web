'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import React from 'react';
import Link from 'next/link';

const World = dynamic(
  () => import('../../components/ui/globe').then(m => m.World),
  {
    ssr: false,
  }
);

// Static Globe Component - completely isolated from slide changes
const StaticGlobe = React.memo(
  ({ onCityHover }: { onCityHover?: (city: string | null) => void }) => {
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
        initialPosition: { lat: -15.0, lng: 30.0 },
        autoRotate: false,
        autoRotateSpeed: 0,
      }),
      []
    );

    return <World globeConfig={staticGlobeConfig} onCityHover={onCityHover} />;
  }
);
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
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  // Debug logging
  useEffect(() => {
    console.log('Hovered city changed:', hoveredCity);
  }, [hoveredCity]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex(prevIndex => (prevIndex + 1) % slides.length);
    }, 10000);

    setIntervalId(interval);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleDotClick = (index: number) => {
    setCurrentSlideIndex(index);

    // Reset the timer
    if (intervalId) {
      clearInterval(intervalId);
    }

    // Start new timer
    const newInterval = setInterval(() => {
      setCurrentSlideIndex(prevIndex => (prevIndex + 1) % slides.length);
    }, 10000);

    setIntervalId(newInterval);
  };

  return (
    <section className="relative min-h-[60vh] lg:min-h-screen flex items-center justify-start bg-black pt-[64px] overflow-hidden">
      {/* Globe Background - Static, loads only once */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-visible">
        <div className="fixed w-[200%] h-[200%] bottom-0 right-0 lg:bottom-[-50%] lg:right-[-50%] pointer-events-auto">
          <div className="w-full h-full">
            <StaticGlobe onCityHover={setHoveredCity} />
          </div>
        </div>
      </div>

      {/* City Tooltip */}
      {hoveredCity && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="bg-black/80 text-white px-3 py-2 rounded text-sm font-bold whitespace-nowrap shadow-lg">
            {hoveredCity}
          </div>
        </div>
      )}

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
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-rubikOne font-bold text-white leading-tight mt-36 lg:mt-48 mb-3">
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
              {currentSlide.button_link && (
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 mb-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                >
                  <Link
                    href={currentSlide.button_link}
                    className="inline-block px-12 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all duration-300 text-lg text-center"
                  >
                    {currentSlide.button_text || 'Learn More'} →
                  </Link>
                </motion.div>
              )}

              {/* Pagination Dots */}
            </motion.div>
          </AnimatePresence>

          {slides.length > 1 && (
            <motion.div
              className="flex gap-5 my-12"
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
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
