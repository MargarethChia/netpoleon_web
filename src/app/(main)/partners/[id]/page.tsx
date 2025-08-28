'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { vendorsApi, type Vendor } from '@/lib/api';

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

        const vendorData = await vendorsApi.getById(parseInt(vendorId));
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

  // Mock additional vendor data - in real app this would come from the API
  const vendorDetails = {
    category: 'Cybersecurity Solutions',
    rating: 4.8,
    projects: 150,
    founded: '2018',
    employees: '25-50',
    location: 'San Francisco, CA',
    about: `${vendor.name} is a leading cybersecurity solutions provider with proven enterprise deployment success. We specialize in comprehensive security services including endpoint protection, network security, and threat intelligence.

Our team of certified security professionals has successfully completed over 150 projects across various industries, from startups to Fortune 500 companies. We pride ourselves on our customer-first approach and commitment to delivering results that protect business assets and ensure compliance.

Founded in 2018, ${vendor.name} has built a reputation for reliability, innovation, and exceptional customer service. We work closely with our clients to understand their unique security challenges and provide tailored solutions that align with their business objectives and compliance requirements.`,
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/partners"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Partners
          </Link>
        </div>

        {/* Vendor Header */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {vendorDetails.category}
                </span>
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm text-gray-600 ml-1">
                    {vendorDetails.rating}
                  </span>
                </div>
              </div>
              <h1 className="text-3xl lg:text-4xl mb-6">{vendor.name}</h1>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Founded:</span>
                  <div className="font-medium">{vendorDetails.founded}</div>
                </div>
                <div>
                  <span className="text-gray-500">Team Size:</span>
                  <div className="font-medium">{vendorDetails.employees}</div>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>
                  <div className="font-medium">{vendorDetails.location}</div>
                </div>
                <div>
                  <span className="text-gray-500">Projects:</span>
                  <div className="font-medium">{vendorDetails.projects}</div>
                </div>
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
                <span className="text-gray-500">{vendor.name} Image</span>
              )}
            </div>
          </div>
        </div>

        {/* About Vendor */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h2 className="text-2xl mb-6">About {vendor.name}</h2>
          <div className="prose max-w-none text-gray-600">
            {vendorDetails.about.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Solution Architecture Diagram */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h2 className="text-2xl mb-6">Solution Architecture</h2>
          <div className="bg-gray-100 rounded-lg h-64 md:h-80 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-lg mb-2">Architecture Diagram</p>
              <p className="text-sm">
                Security solution implementation diagram for {vendor.name}
              </p>
            </div>
          </div>
        </div>

        {/* Interested Section */}
        <div className="bg-gray-50 rounded-lg p-8 text-center">
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
        </div>
      </div>
    </div>
  );
}
