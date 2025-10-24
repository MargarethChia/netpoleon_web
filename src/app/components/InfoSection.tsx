'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface InfoPoint {
  id: number;
  title: string;
  description: string;
}

interface InfoSectionProps {
  title: string;
  points: InfoPoint[];
  visual?: React.ReactNode;
  image?: string;
  imageAlt?: string;
}

export default function InfoSection({
  title,
  points,
  visual,
  image,
  imageAlt,
}: InfoSectionProps) {
  return (
    <section className="py-16 lg:min-h-screen lg:flex lg:items-center bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {title}
              </h2>
              <div className="w-16 h-1 bg-primary rounded-full"></div>
            </div>
            <div className="space-y-6">
              {points.map((point, index) => (
                <motion.div
                  key={point.id}
                  className="flex items-start space-x-4 group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-6 h-6 bg-primary rounded-full flex-shrink-0 mt-1 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {point.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-80 flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-500 overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {image ? (
              <Image
                unoptimized
                src={image}
                alt={imageAlt || 'Info section image'}
                width={400}
                height={320}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : visual ? (
              visual
            ) : (
              <span className="text-gray-500 text-lg font-medium">
                Info Visual
              </span>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
