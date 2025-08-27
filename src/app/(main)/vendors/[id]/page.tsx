"use client";

import { useEffect, useState } from 'react';
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
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/vendors/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Vendor not found');
          } else {
            setError('Failed to fetch vendor information');
          }
          return;
        }

        const data = await response.json();
        setVendor(data);
      } catch (err) {
        setError('An error occurred while fetching vendor information');
        console.error('Error fetching vendor:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchVendor();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading vendor information...</p>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Vendor Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">{error || 'The vendor you are looking for does not exist.'}</p>
          <a
            href="/vendors"
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Vendors
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            {vendor.logo_url && (
              <img
                src={vendor.logo_url}
                alt={`${vendor.name} logo`}
                className="h-20 w-auto mr-4"
              />
            )}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              {vendor.name}
            </h1>
          </div>
          
          {vendor.description && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {vendor.description}
            </p>
          )}
        </motion.div>

        {/* Main Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-3 gap-12"
        >
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About {vendor.name}</h2>
              
              {vendor.content ? (
                <div 
                  className="prose prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: vendor.content }}
                />
              ) : (
                <div className="text-gray-500 text-center py-12">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg">No content available for this vendor.</p>
                  <p className="text-sm">Please check back later or contact us for more information.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Vendor Image */}
            {vendor.image_url && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <img
                  src={vendor.image_url}
                  alt={`${vendor.name} image`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </motion.div>
            )}

            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Information</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Added:</span>
                  <p className="text-gray-900">
                    {new Date(vendor.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                {vendor.updated_at !== vendor.created_at && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Last Updated:</span>
                    <p className="text-gray-900">
                      {new Date(vendor.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
              
              <div className="space-y-3">
                {vendor.link && (
                  <a
                    href={vendor.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center block"
                  >
                    Visit Website
                  </a>
                )}
                
                <a
                  href="/contact"
                  className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-center block"
                >
                  Contact Vendor
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Back to Vendors */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16"
        >
          <a
            href="/vendors"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Vendors
          </a>
        </motion.div>
      </div>
    </div>
  );
}
