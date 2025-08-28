'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import BigBangBackground from "./BigBangBackground";
import CloudBackground from "./backgrounds/CloudBackground";
import HeroParticles from "./backgrounds/ParticlesBackground";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  heroImage?: string;
  heroImageAlt?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onExploreVendors?: () => void;
  onExploreSolutions?: () => void;
}

export default function HeroSection({
  title,
  subtitle,
  heroImage,
  heroImageAlt = "Hero Image",
  primaryButtonText = "Get Started Today",
  secondaryButtonText = "Learn More",
  onExploreVendors,
  onExploreSolutions,
}: HeroSectionProps) {
  const [showContent, setShowContent] = useState(false);
  
  // Show content after BigBang animation completes (5s + 2s zoom + 0.5s delay = 7.5s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3000); // Reduced from 7500ms to 3000ms (3 seconds)
    
    return () => clearTimeout(timer);
  }, []);

  //console.log('HeroSection rendering with:', { title, subtitle, primaryButtonText, secondaryButtonText });
  
  return (
    <section className="relative min-h-screen flex items-center justify-start overflow-hidden">
      <div className="absolute inset-0 z-0">
        <BigBangBackground />
      </div>
      
      <AnimatePresence>
        {showContent && (
          <motion.div 
            className="relative z-20 text-left text-white px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="max-w-2xl">
              {/* Header */}
              <motion.h1
                className="text-5xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent leading-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {title}
              </motion.h1>

              {/* Descriptive Text */}
              <motion.div
                className="text-xl lg:text-2xl leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent font-medium tracking-wide drop-shadow-lg">
                  {subtitle}
                </span>
              </motion.div>
              {/* Buttons should be here */}
              
             
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
