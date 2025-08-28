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
            <Link
              href="/partners"
              className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-bold"
            >
              Back to Partners
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/partners"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Partners
          </Link>
        </motion.div>

        {/* Vendor Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border p-8 mb-8"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl lg:text-4xl mb-6">{vendor.name}</h1>

              {vendor.description && (
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {vendor.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                {vendor.link && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Check Them Out:</span>
                    <div className="font-medium">
                      <a
                        href={vendor.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="aspect-video overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
              {vendor.logo_url ? (
                <Image
                  src={vendor.logo_url}
                  alt={`${vendor.name} logo`}
                  width={400}
                  height={225}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">{vendor.name} Logo</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* About Vendor - Using Dynamic Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border p-8 mb-8"
        >
          <h2 className="text-2xl mb-6">About {vendor.name}</h2>

          {vendor.content ? (
            <div
              className="prose max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: vendor.content }}
            />
          ) : (
            <div className="text-gray-500 text-center py-12">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg">No content available for this vendor.</p>
              <p className="text-sm">
                Please check back later or contact us for more information.
              </p>
            </div>
          )}
        </motion.div>

        {/* Vendor Image Section */}
        {vendor.image_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border p-8 mb-8"
          >
            <h2 className="text-2xl mb-6">Gallery</h2>
            <div className="aspect-video overflow-hidden rounded-lg relative">
              <Image
                src={vendor.image_url}
                alt={`${vendor.name} gallery image`}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        )}

        {/* Interested Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gray-50 rounded-lg p-8 text-center"
        >
          <h3 className="text-2xl mb-4">
            Interested in Working with {vendor.name}?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Ready to discuss your project requirements? Get in touch with us to
            learn more about how {vendor.name} can help your business succeed.
          </p>
          <Link
            href="/contact"
            className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center"
          >
            Contact Us About This Vendor
            <span className="ml-2">→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
