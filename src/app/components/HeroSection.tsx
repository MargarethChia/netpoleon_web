"use client";

import { motion } from "framer-motion";
import FogBackground from "./FogBackground";
import CloudBackground from "./CloudBackground";
import HeroParticles from "./ParticlesBackground";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  heroImage?: string;
  heroImageAlt?: string;
  onExploreVendors?: () => void;
  onExploreSolutions?: () => void;
}

export default function HeroSection({
  title,
  subtitle,
  heroImage,
  heroImageAlt = "Hero Image",
  onExploreVendors,
  onExploreSolutions,
}: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative py-32 flex items-center overflow-hidden"
    >
      {/* Cloud Background */}
      {/* <CloudBackground /> */}

      {/* Fog Background */}
      {/*  <FogBackground /> */}

      {/* Particle Background */}
      <HeroParticles />
      
      {/* Light overlay for text readability */}
      {/* <div className="absolute inset-0 bg-black/30 z-10"></div> */}

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20">
        <div className="max-w-2xl">
          {/* Header */}
          <motion.h1
            className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {title}
          </motion.h1>

          {/* Descriptive Text */}
          <motion.p
            className="text-xl lg:text-2xl text-white/90 leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {subtitle}
          </motion.p>

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
              Explore Vendors
            </motion.button>

            <motion.button
              onClick={onExploreSolutions}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Solutions
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
