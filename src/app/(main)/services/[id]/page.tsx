'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { getServiceData } from '@/data/services-data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use } from 'react';

interface ServicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ServicePage({ params }: ServicePageProps) {
  const { id } = use(params);
  const serviceData = getServiceData(id);

  if (!serviceData) {
    notFound();
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Service Header */}
      <motion.section
        className="pt-12"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-12">
          <motion.div
            className="bg-white rounded-lg border border-gray-200 p-6"
            variants={fadeInUp}
          >
            <motion.h1
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
              variants={fadeInUp}
            >
              {serviceData.title}
            </motion.h1>

            <motion.div className="flex flex-wrap gap-2" variants={fadeInUp}>
              {serviceData.categories.map((category, index) => (
                <Badge
                  key={index}
                  variant={index === 0 ? 'default' : 'secondary'}
                  className={
                    index === 0
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-red-100 text-red-800 border-red-200'
                  }
                >
                  {category}
                </Badge>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Service Overview */}
      <motion.section
        className="py-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-white rounded-lg border border-gray-200 p-6"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Service Overview
            </h2>
            <div className="space-y-3">
              {serviceData.overview.map((paragraph, index) => (
                <motion.p
                  key={index}
                  className="text-base text-gray-700 leading-relaxed"
                  variants={fadeInUp}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* What's Included & Key Benefits */}
      {(serviceData.whatsIncluded || serviceData.keyBenefits) && (
        <motion.section
          className="py"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* What's Included */}
              {serviceData.whatsIncluded && (
                <motion.div
                  className="bg-white rounded-lg border border-gray-200 p-6"
                  variants={fadeInUp}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    What&apos;s Included
                  </h3>
                  <div className="space-y-2">
                    {serviceData.whatsIncluded.map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-3"
                        variants={fadeInUp}
                      >
                        <div className="flex-shrink-0 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Key Benefits */}
              {serviceData.keyBenefits && (
                <motion.div
                  className="bg-white rounded-lg border border-gray-200 p-6"
                  variants={fadeInUp}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Key Benefits
                  </h3>
                  <div className="space-y-2">
                    {serviceData.keyBenefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-3"
                        variants={fadeInUp}
                      >
                        <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* Our Process */}
      {serviceData.process && (
        <motion.section
          className="py-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="bg-white rounded-lg border border-gray-200 p-6"
              variants={fadeInUp}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Our Process
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceData.process.map((step, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    variants={fadeInUp}
                  >
                    {/* Step Number Circle */}
                    <div className="relative mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-600">
                          {step.number}
                        </span>
                      </div>
                      <div className="w-0.5 h-8 bg-blue-200 mx-auto mt-2"></div>
                    </div>

                    {/* Step Content */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed max-w-[180px] mx-auto">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Call to Action */}
      {serviceData.ctaSection && (
        <motion.section
          className="text-center mt-16 mb-0 relative h-[300px] overflow-hidden bg-orange-500"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <div className="p-12">
            <h3 className="text-2xl lg:text-3xl mb-4 font-bold text-white">
              {serviceData.ctaSection.title}
            </h3>
            <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto font-normal">
              {serviceData.ctaSection.description}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/contact"
                className="bg-white text-orange-900 px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors inline-flex items-center font-bold"
              >
                {serviceData.ctaSection.primaryButton}
                <span className="ml-2">→</span>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
