'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface ImageTextSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  layout: 'left' | 'right';
  ctaText?: string;
  ctaLink?: string;
}

export default function ImageTextSection({
  title,
  description,
  imageSrc,
  imageAlt,
  layout,
  ctaText,
  ctaLink,
}: ImageTextSectionProps) {
  const isLeftLayout = layout === 'left';

  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div
        className={`absolute ${isLeftLayout ? 'right-0' : 'left-0'} top-1/2 transform -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl`}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col lg:flex-row items-center gap-12 ${
            isLeftLayout ? 'lg:flex-row' : 'lg:flex-row-reverse'
          }`}
        >
          {/* Image */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: isLeftLayout ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5"></div>
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-base font-medium">
                    {imageAlt || 'Image Placeholder'}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="flex-1 space-y-6"
            initial={{ opacity: 0, x: isLeftLayout ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {title}
              </h2>
              <div className="w-16 h-1 bg-primary rounded-full"></div>
              <p className="text-lg text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>
            {ctaText && ctaLink && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <a
                  href={ctaLink}
                  className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {ctaText}
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
