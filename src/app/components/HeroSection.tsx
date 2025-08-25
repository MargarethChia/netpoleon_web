"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import BigBangBackground from "./BigBangBackground";
import CloudBackground from "./CloudBackground";
import HeroParticles from "./ParticlesBackground";

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
    }, 7500);
    
    return () => clearTimeout(timer);
  }, []);

  console.log('HeroSection rendering with:', { title, subtitle, primaryButtonText, secondaryButtonText });
  
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
                className="text-5xl lg:text-5xl font-bold text-orange leading-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {title}
              </motion.h1>

              {/* Horizontal Rectangle */}
              <motion.div
                className="w-100 h-1 bg-white mb-6"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              />

              {/* Descriptive Text */}
              <motion.div
                className="text-xl lg:text-2xl text-white/90 leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <span className="typewriter">{subtitle}</span>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                <motion.button
                  onClick={onExploreVendors}
                  className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {primaryButtonText}
                </motion.button>

                <motion.button
                  onClick={onExploreSolutions}
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {secondaryButtonText}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
