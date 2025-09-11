'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

interface Vendor {
  id: number;
  name: string;
  description: string | null;
  content: string | null;
  logo_url: string | null;
  image_url: string | null;
  diagram_url: string | null;
  type: string | null;
  link: string | null;
  created_at: string;
  updated_at: string;
}

export default function VendorDetailPage() {
  const params = useParams();
  const vendorId = params.id as string;

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendor = async () => {
      if (!vendorId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/vendors/${vendorId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('Vendor not found');
          } else {
            setError('Failed to fetch vendor details');
          }
          return;
        }

        const vendorData = await response.json();
        setVendor(vendorData);
      } catch (err) {
        console.error('Error fetching vendor:', err);
        setError('Failed to load vendor details');
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [vendorId]);

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h2 className="text-2xl text-red-800 mb-4 font-bold">
              Vendor Not Found
            </h2>
            <p className="text-red-600 font-normal">
              {error || 'The vendor you are looking for could not be found.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Logo and Info Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-stone-50 py-16"
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Logo Square */}
              <div className="w-24 h-24 bg-stone-200 rounded-2xl flex items-center justify-center shadow-sm">
                {vendor.logo_url ? (
                  <Image
                    src={vendor.logo_url}
                    alt={`${vendor.name} logo`}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain p-3"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-1">
                      <span className="text-white font-bold text-lg">
                        {vendor.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-600 text-xs font-medium">
                      {vendor.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Company Info */}
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {vendor.name}
                </h1>

                {/* Type Badges */}
                {vendor.type && (
                  <div className="flex flex-wrap gap-3">
                    {vendor.type.split(',').map((type, index) => (
                      <span
                        key={index}
                        className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg text-sm font-"
                      >
                        {type.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Verified Partner Badge */}
            <div className="bg-orange-100 text-orange-600 px-6 py-3 rounded-full flex items-center gap-3 shadow-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="font-bold text-sm">VERIFIED PARTNER</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Featured Image Section */}
      {vendor.image_url && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white py-16"
        >
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Description */}
              <div className="space-y-6">
                {vendor.description && (
                  <p className="text-3xl text-gray-700 leading-relaxed italic font-serif">
                    &ldquo;
                    <span className="text-6xl text-orange-600 font-bold">
                      {vendor.description.charAt(0)}
                    </span>
                    {vendor.description.slice(1)}
                    &rdquo;
                  </p>
                )}

                <div className="pt-4">
                  <Link
                    href="/contact"
                    className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
                  >
                    Learn More
                  </Link>
                </div>
              </div>

              {/* Right side - Featured Image */}
              <div className="flex justify-center items-center px-8 lg:px-12 xl:px-16 h-full">
                <div className="w-full max-w-lg h-80 lg:h-96 bg-white flex items-center justify-center pl-40 p-8 rounded-lg">
                  <Image
                    src={vendor.image_url}
                    alt={`${vendor.name} featured image`}
                    width={400}
                    height={300}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Diagram Section */}
      {vendor.diagram_url && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-stone-200 shadow-sm border-t border-b py-16 lg:py-20 px-0"
        >
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Left side - Diagram */}
            <div className="flex justify-center items-center px-8 lg:px-12 xl:px-16 h-full">
              <div className="w-full max-w-lg h-80 lg:h-96 bg-stone-200 flex items-center justify-center p-8 rounded-lg">
                <Image
                  src={vendor.diagram_url}
                  alt={`${vendor.name} diagram`}
                  width={500}
                  height={350}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="space-y-6 pl-8 lg:pl-12 xl:pl-16 pr-8 lg:pr-12 xl:pr-16">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                <span className="text-orange-600">About</span> {vendor.name}
              </h2>

              {vendor.content && (
                <div
                  className="font-inter text-gray-700 leading-relaxed prose max-w-none text-base lg:text-lg"
                  dangerouslySetInnerHTML={{ __html: vendor.content }}
                />
              )}

              <div className="pt-4">
                <Link
                  href="/contact"
                  className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* External Link Section */}
        {vendor.link && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border p-8 text-center"
          >
            <h3 className="text-xl mb-4 font-bold text-gray-900">
              Learn More About {vendor.name}
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-base">
              Visit their official website to explore their full range of
              cybersecurity solutions and services.
            </p>
            <a
              href={vendor.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-base transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Visit Website
              <span className="ml-2">→</span>
            </a>
          </motion.div>
        )}

        {/* Interested in Working Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gray-50 rounded-lg p-12 lg:p-16 text-center mt-8 mb-8"
        >
          <h3 className="text-3xl lg:text-4xl mb-8 font-bold text-gray-900">
            Interested in Working with {vendor.name}?
          </h3>
          <p className="text-gray-600 mb-12 max-w-3xl mx-auto text-lg lg:text-xl leading-relaxed">
            Ready to discuss your project requirements? Get in touch with us to
            learn more about how {vendor.name} can help your business succeed.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-12 py-5 rounded-lg font-semibold text-xl transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Contact us about this vendor
            <span className="ml-2">→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
