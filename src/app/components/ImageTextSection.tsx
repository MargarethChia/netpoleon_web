'use client';

import { motion } from 'framer-motion';

interface ImageTextSectionProps {
  ctaText?: string;
  ctaLink?: string;
}

export default function ImageTextSection({
  ctaText,
  ctaLink,
}: ImageTextSectionProps) {
  return (
    <section className="pt-24 pb-36 bg-white relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Simplify security and compliance{' '}
            <span className="text-orange-600">at every stage</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Whether you&apos;re working toward your first SOC 2 audit or running
            a security and compliance program at enterprise scale, we&apos;re
            here to do the heavy lifting.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Side - Image with Progress Cards */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative bg-white rounded-2xl p-6 shadow-2xl">
              {/* Enterprise Visual */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-32">
                    {/* Building/Enterprise Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-24 bg-gradient-to-b from-blue-600 to-blue-800 rounded-lg relative">
                        {/* Windows */}
                        <div className="absolute top-2 left-2 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-2 left-5 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-2 left-8 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-2 left-11 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-2 left-14 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-2 left-17 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-2 left-20 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-2 left-23 w-2 h-2 bg-blue-200 rounded"></div>

                        <div className="absolute top-6 left-2 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-6 left-5 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-6 left-8 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-6 left-11 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-6 left-14 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-6 left-17 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-6 left-20 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-6 left-23 w-2 h-2 bg-blue-200 rounded"></div>

                        <div className="absolute top-10 left-2 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-10 left-5 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-10 left-8 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-10 left-11 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-10 left-14 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-10 left-17 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-10 left-20 w-2 h-2 bg-blue-200 rounded"></div>
                        <div className="absolute top-10 left-23 w-2 h-2 bg-blue-200 rounded"></div>

                        {/* Security Shield */}
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Network connections */}
                    <div className="absolute top-8 left-0 w-4 h-0.5 bg-gray-400"></div>
                    <div className="absolute top-8 right-0 w-4 h-0.5 bg-gray-400"></div>
                    <div className="absolute top-12 left-0 w-6 h-0.5 bg-gray-400"></div>
                    <div className="absolute top-12 right-0 w-6 h-0.5 bg-gray-400"></div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-sm font-semibold text-gray-900">
                    Global Enterprise
                  </div>
                  <div className="text-xs text-gray-600">
                    Multi-location security infrastructure
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Solutions Card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-6 h-full flex flex-col justify-between shadow-2xl">
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Enterprise
                </h3>
                <p className="text-white/90 text-base leading-relaxed mb-6">
                  Enterprises handle vast amounts of sensitive data across
                  multiple systems, teams, and geographies. Any gap in security
                  or compliance can lead to regulatory fines, reputational
                  damage, and loss of customer trust.
                </p>
              </div>

              {ctaText && ctaLink && (
                <a
                  href={ctaLink}
                  className="inline-flex items-center text-orange-200 hover:text-white font-semibold transition-colors duration-300 group"
                >
                  {ctaText}
                  <svg
                    className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
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
              )}
            </div>
          </motion.div>
        </div>

        {/* Second Section - Mid-market */}
        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          {/* Left Side - Mid-market Card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-6 h-full flex flex-col justify-between shadow-2xl">
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Mid-market
                </h3>
                <p className="text-white/90 text-base leading-relaxed mb-6">
                  As your business scales, so does the responsibility to protect
                  customer data and meet rising regulatory expectations.
                  Mid-market companies often face the same compliance
                  requirements as enterprises but with leaner teams and tighter
                  resources
                </p>
              </div>

              <a
                href="#"
                className="inline-flex items-center text-orange-200 hover:text-white font-semibold transition-colors duration-300 group"
              >
                Explore mid-market solutions
                <svg
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
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
            </div>
          </motion.div>

          {/* Right Side - Data Visualization Cards Only */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative bg-white rounded-2xl p-6 shadow-2xl">
              {/* Mid-Market Visual */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-32">
                    {/* Office Building */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-20 bg-gradient-to-b from-green-500 to-green-700 rounded-lg relative">
                        {/* Windows */}
                        <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-2 left-4 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-2 left-6 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-2 left-8 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-2 left-10 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-2 left-12 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-2 left-14 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-2 left-16 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-2 left-18 w-1.5 h-1.5 bg-green-200 rounded"></div>

                        <div className="absolute top-5 left-2 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-5 left-4 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-5 left-6 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-5 left-8 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-5 left-10 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-5 left-12 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-5 left-14 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-5 left-16 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-5 left-18 w-1.5 h-1.5 bg-green-200 rounded"></div>

                        <div className="absolute top-8 left-2 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-8 left-4 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-8 left-6 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-8 left-8 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-8 left-10 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-8 left-12 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-8 left-14 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-8 left-16 w-1.5 h-1.5 bg-green-200 rounded"></div>
                        <div className="absolute top-8 left-18 w-1.5 h-1.5 bg-green-200 rounded"></div>

                        {/* Security Badge */}
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Growth arrows */}
                    <div className="absolute top-4 left-0 w-3 h-0.5 bg-green-400 transform rotate-45"></div>
                    <div className="absolute top-4 right-0 w-3 h-0.5 bg-green-400 transform -rotate-45"></div>
                    <div className="absolute top-8 left-0 w-4 h-0.5 bg-green-400 transform rotate-45"></div>
                    <div className="absolute top-8 right-0 w-4 h-0.5 bg-green-400 transform -rotate-45"></div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-sm font-semibold text-gray-900">
                    Growing Business
                  </div>
                  <div className="text-xs text-gray-600">
                    Scalable security solutions
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Third Section - Startup */}
        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          {/* Left Side - Startup Chart */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            viewport={{ once: true }}
          >
            <div className="relative bg-white rounded-2xl p-6 shadow-2xl">
              {/* Startup Visual */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-32">
                    {/* Startup Office */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-16 bg-gradient-to-b from-purple-500 to-purple-700 rounded-lg relative">
                        {/* Windows */}
                        <div className="absolute top-2 left-2 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-2 left-4 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-2 left-6 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-2 left-8 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-2 left-10 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-2 left-12 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-2 left-14 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-2 left-16 w-1 h-1 bg-purple-200 rounded"></div>

                        <div className="absolute top-4 left-2 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-4 left-4 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-4 left-6 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-4 left-8 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-4 left-10 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-4 left-12 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-4 left-14 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-4 left-16 w-1 h-1 bg-purple-200 rounded"></div>

                        <div className="absolute top-6 left-2 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-6 left-4 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-6 left-6 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-6 left-8 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-6 left-10 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-6 left-12 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-6 left-14 w-1 h-1 bg-purple-200 rounded"></div>
                        <div className="absolute top-6 left-16 w-1 h-1 bg-purple-200 rounded"></div>

                        {/* Innovation Spark */}
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Innovation rays */}
                    <div className="absolute top-2 left-0 w-2 h-0.5 bg-yellow-400 transform rotate-45"></div>
                    <div className="absolute top-2 right-0 w-2 h-0.5 bg-yellow-400 transform -rotate-45"></div>
                    <div className="absolute top-6 left-0 w-3 h-0.5 bg-yellow-400 transform rotate-45"></div>
                    <div className="absolute top-6 right-0 w-3 h-0.5 bg-yellow-400 transform -rotate-45"></div>
                    <div className="absolute top-10 left-0 w-2 h-0.5 bg-yellow-400 transform rotate-45"></div>
                    <div className="absolute top-10 right-0 w-2 h-0.5 bg-yellow-400 transform -rotate-45"></div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-sm font-semibold text-gray-900">
                    Innovative Startup
                  </div>
                  <div className="text-xs text-gray-600">
                    Essential security foundation
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Startup Card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-6 h-full flex flex-col justify-between shadow-2xl">
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Startup</h3>
                <p className="text-white/90 text-base leading-relaxed mb-6">
                  When you’re building fast, security and compliance can feel
                  like a distraction — but they’re critical for winning trust
                  early. Investors, partners, and customers increasingly expect
                  startups to safeguard data and show proof of compliance, even
                  before the first big deal.
                </p>
              </div>

              <a
                href="#"
                className="inline-flex items-center text-orange-200 hover:text-white font-semibold transition-colors duration-300 group"
              >
                Explore startup solutions
                <svg
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
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
            </div>
          </motion.div>
        </div>

        {/* Statistics Section
        <div className="mt-8">
          <Statistics />
        </div> */}
      </div>
    </section>
  );
}
