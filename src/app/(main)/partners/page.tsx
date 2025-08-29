'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { vendorsApi, type Vendor } from '@/lib/api';
import { getVendorPortfolioUrl } from '@/lib/storage';

export default function OurVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayedVendors, setDisplayedVendors] = useState<number>(6);
  const [portfolioUrl, setPortfolioUrl] = useState<string>('');
  const [portfolioLoading, setPortfolioLoading] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await vendorsApi.getAll();
        setVendors(data);
      } catch (err) {
        setError('Failed to load vendors');
        console.error('Error fetching vendors:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchPortfolioUrl = async () => {
      try {
        setPortfolioLoading(true);
        const url = getVendorPortfolioUrl();
        setPortfolioUrl(url);
      } catch (err) {
        console.error('Error fetching portfolio URL:', err);
      } finally {
        setPortfolioLoading(false);
      }
    };

    fetchVendors();
    fetchPortfolioUrl();
  }, []);

  // Load more vendors
  const loadMore = () => {
    setDisplayedVendors(prev => {
      const newCount = Math.min(prev + 6, vendors.length);
      return newCount;
    });
  };

  // Handle portfolio download
  const handlePortfolioDownload = () => {
    if (portfolioUrl) {
      window.open(portfolioUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Animation variants
  const fadeInDown = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            className="animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            className="bg-red-50 border border-red-200 rounded-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl text-red-800 mb-4 font-bold">
              Error Loading Partners
            </h2>
            <p className="text-red-600 font-normal">{error}</p>
            <motion.button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Calculate these values inside the render function so they update properly
  const vendorsToShow = vendors.slice(0, displayedVendors);
  const hasMoreVendors = displayedVendors < vendors.length;

  return (
    <div className="min-h-screen">
      {/* Header - Full Width */}
      <motion.section
        className="relative h-[500px] overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600 shadow-lg z-50 mb-16"
        style={{
          clipPath:
            'polygon(0 0, 100% 0, 100% 90%, 80% 95%, 50% 100%, 20% 95%, 0 90%)',
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInDown}
        transition={{ duration: 0.6 }}
      >
        {/* Circular overlays at bottom */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full transform translate-x-1/2 translate-y-1/2 blur-sm"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/15 rounded-full transform translate-x-1/3 translate-y-1/3 blur-md"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full transform translate-x-1/4 translate-y-1/4 blur-lg"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6 lg:px-8 max-w-4xl relative z-10">
            <h1 className="text-4xl lg:text-6xl mb-6 font-bold drop-shadow-lg">
              Our Cybersecurity Partners
            </h1>
            <p className="text-xl lg:text-2xl text-orange-100 max-w-3xl mx-auto font-normal drop-shadow-md">
              Discover our carefully curated portfolio of leading cybersecurity
              vendors, each vetted for innovation, reliability, and proven
              enterprise deployment success.
            </p>
          </div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Vendor Portfolio Download */}
        <motion.section
          className="mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInDown}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg mb-2 font-bold">
                  Complete Vendor Portfolio
                </h3>
                <p className="text-gray-600 text-sm font-normal">
                  Download our comprehensive vendor portfolio with detailed
                  specifications, comparisons, and implementation guides.
                </p>
              </div>
              <motion.button
                onClick={handlePortfolioDownload}
                disabled={portfolioLoading || !portfolioUrl}
                className={`px-6 py-3 rounded-lg transition-colors inline-flex items-center font-bold ${
                  portfolioLoading || !portfolioUrl
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                whileHover={
                  portfolioLoading || !portfolioUrl ? {} : { scale: 1.05 }
                }
                whileTap={
                  portfolioLoading || !portfolioUrl ? {} : { scale: 0.95 }
                }
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {portfolioLoading
                  ? 'Loading...'
                  : !portfolioUrl
                    ? 'No PDF Available'
                    : 'Download PDF'}
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Vendors Grid */}
        {vendorsToShow.length > 0 ? (
          <motion.section
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            transition={{ duration: 0.6 }}
          >
            <div className="grid lg:grid-cols-3 gap-8">
              {vendorsToShow.map((vendor, index) => (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3 },
                  }}
                  className="w-full"
                >
                  <Link href={`/partners/${vendor.id}`} className="group block">
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                      <motion.div
                        className="aspect-video overflow-hidden bg-gray-200 flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        {vendor.logo_url ? (
                          <Image
                            src={vendor.logo_url}
                            alt={`${vendor.name} logo`}
                            width={400}
                            height={225}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500 text-sm font-normal">
                            {vendor.name} Logo
                          </span>
                        )}
                      </motion.div>
                      <div className="p-6">
                        <h3 className="text-xl mb-3 group-hover:text-blue-600 transition-colors font-bold">
                          {vendor.name}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-4 font-normal">
                          {vendor.description ||
                            'Leading cybersecurity solutions provider with proven enterprise deployment success.'}
                        </p>
                        <div className="flex items-center justify-right text-sm text-gray-500">
                          <motion.span
                            className="group-hover:text-blue-600 transition-colors font-normal"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            View Details →
                          </motion.span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ) : (
          <motion.section
            className="text-center py-16 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl text-gray-600 mb-4 font-bold">
                No Partners Available
              </h3>
              <p className="text-gray-500 font-normal">
                We&apos;re currently updating our partner portfolio. Please
                check back soon.
              </p>
            </div>
          </motion.section>
        )}

        {hasMoreVendors && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              onClick={loadMore}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Load More Partners
              <span className="ml-2">→</span>
            </motion.button>
          </motion.div>
        )}

        {!hasMoreVendors && vendors.length > 6 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              onClick={() => setDisplayedVendors(6)}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Show Less
              <span className="ml-2">←</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* CTA Section */}
      <motion.section
        className="text-center mt-16 relative h-[270px] overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600"
        style={{
          clipPath:
            'polygon(0 10%, 20% 5%, 50% 0, 80% 5%, 100% 10%, 100% 100%, 0 100%)',
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInDown}
        transition={{ duration: 0.6 }}
      >
        <div className="p-12">
          <h3 className="text-2xl lg:text-3xl mb-4 font-bold text-white">
            Need a Specific Security Solution?
          </h3>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto font-normal">
            We&apos;re constantly expanding our cybersecurity vendor portfolio.
            Let us know what security challenges you&apos;re facing, and
            we&apos;ll connect you with the right solution provider.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/contact"
              className="bg-white text-orange-900 px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors inline-flex items-center font-bold"
            >
              Request Security Assessment
              <span className="ml-2">→</span>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
