'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface Vendor {
  id: number;
  name: string;
  logo?: string;
}

interface VendorCarouselProps {
  title: string;
  vendors: Vendor[];
}

export default function VendorCarousel({
  title,
  vendors,
}: VendorCarouselProps) {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-normal text-gray-900 mb-8 font-inter">
            {title}
          </h2>
        </motion.div>
      </div>

      {/* Full-width Marquee Container */}
      <div className="relative overflow-hidden w-full">
        <div className="flex animate-marquee py-4">
          {/* First set of vendors */}
          {vendors.map(vendor => (
            <div
              key={`first-${vendor.id}`}
              className="flex-shrink-0 mx-12 items-center justify-center"
            >
              {vendor.logo ? (
                <Image
                  src={vendor.logo}
                  alt={vendor.name}
                  width={160}
                  height={160}
                  className="h-24 object-contain"
                />
              ) : (
                <span className="text-gray-600 font-medium text-base">
                  {vendor.name}
                </span>
              )}
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {vendors.map(vendor => (
            <div
              key={`second-${vendor.id}`}
              className="flex-shrink-0 mx-12 items-center justify-center"
            >
              {vendor.logo ? (
                <Image
                  src={vendor.logo}
                  alt={vendor.name}
                  width={160}
                  height={160}
                  className="h-24 object-contain"
                />
              ) : (
                <span className="text-gray-600 font-medium text-base">
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
