"use client";

import { motion } from "framer-motion";

interface Vendor {
  id: number;
  name: string;
  logo?: string;
}

interface VendorCarouselProps {
  title: string;
  subtitle: string;
  vendors: Vendor[];
}

export default function VendorCarousel({
  title,
  subtitle,
  vendors,
}: VendorCarouselProps) {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Full-width Marquee Container */}
      <div className="relative overflow-hidden w-full">
        <div className="flex animate-marquee p-8">
          {/* First set of vendors */}
          {vendors.map((vendor) => (
            <div key={`first-${vendor.id}`} className="flex-shrink-0 mx-6 items-center justify-center">
              {vendor.logo ? (
                <img
                  src={vendor.logo}
                  alt={vendor.name}
                  className="h-32 object-contain p-3"
                />
              ) : (
                <span className="text-gray-500 font-semibold text-sm">
                  {vendor.name}
                </span>
              )}
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {vendors.map((vendor) => (
            <div key={`second-${vendor.id}`} className="flex-shrink-0 mx-6 items-center justify-center">
              {vendor.logo ? (
                <img
                  src={vendor.logo}
                  alt={vendor.name}
                  className="h-32 object-contain p-3"
                />
              ) : (
                <span className="text-gray-500 font-semibold text-sm">
                  {vendor.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
