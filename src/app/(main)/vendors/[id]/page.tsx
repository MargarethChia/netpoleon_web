'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';
import { vendorsApi, type Vendor } from '@/lib/api';
import { createSlug } from '@/lib/slug-utils';

export default function VendorDetailPage() {
  const params = useParams();
  const vendorSlug = params.id as string;

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendor = async () => {
      if (!vendorSlug) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch all vendors and find the one matching the slug
        const allVendors = await vendorsApi.getAll();
        const foundVendor = allVendors.find(
          v => createSlug(v.name) === vendorSlug
        );

        if (!foundVendor) {
          setError('Vendor not found');
          return;
        }

        setVendor(foundVendor);
      } catch (err) {
        console.error('Error fetching vendor:', err);
        setError('Failed to load vendor details');
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [vendorSlug]);

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
    <div className="min-h-screen bg-stone-100">
      <div className="max-w-4xl mx-auto px-0 sm:px-6 py-0 sm:py-12">
        {/* Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Featured Image Banner */}
          <div className="relative h-64 w-full overflow-hidden">
            {vendor.image_url ? (
              <Image
                src={vendor.image_url}
                alt={`${vendor.name} featured image`}
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center"></div>
            )}
          </div>

          {/* Profile Section */}
          <div className="relative px-8 pb-8">
            {/* Circular Logo */}
            <div className="absolute -top-16 left-8 w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              {vendor.logo_url ? (
                <Image
                  src={vendor.logo_url}
                  alt={`${vendor.name} logo`}
                  width={96}
                  height={96}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="text-gray-500 text-4xl font-bold">
                  {vendor.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Company Info */}
            <div className="pt-20">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {vendor.name}
                </h1>
                <Badge className="bg-orange-100 text-orange-600 border-orange-200 font-semibold">
                  <Award className="w-4 h-4 mr-2" />
                  Verified Partner
                </Badge>
              </div>

              {/* Type Badges */}
              {vendor.type && (
                <div className="flex flex-wrap gap-2">
                  {vendor.type.split(',').map((typeItem, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {typeItem.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Bookmark Icon */}
              <div className="absolute top-8 right-8">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Description */}
          {vendor.description && (
            <div className="px-8 pb-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                {vendor.description}
              </p>
            </div>
          )}

          {/* Main Content Section */}
          {vendor.content && (
            <div className="px-8 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About {vendor.name}
              </h2>
              <div
                className="text-gray-700 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: vendor.content }}
              />
            </div>
          )}

          {/* Diagram Section */}
          {vendor.diagram_url && (
            <div className="px-8 pb-8">
              <div className="bg-stone-200 rounded-lg p-8 w-full h-80 flex items-center justify-center">
                <Image
                  src={vendor.diagram_url}
                  alt={`${vendor.name} diagram`}
                  width={600}
                  height={400}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Interested in Working Section */}
          <div className="px-8 pb-8 text-center">
            <div className="rounded-lg py-8 lg:px-20 text-center">
              <h3 className="text-xl lg:text-2xl mb-6 font-bold text-gray-900">
                Interested in Working with {vendor.name}?
              </h3>
              <p className="text-gray-600 mb-8 max-w-3xl mx-auto text-base lg:text-lg leading-relaxed">
                Ready to discuss your project requirements? Get in touch with us
                to learn more about how {vendor.name} can help your business
                succeed.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold text-base transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Contact us about this vendor
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
