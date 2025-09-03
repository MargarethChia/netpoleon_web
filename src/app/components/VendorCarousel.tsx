'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { vendorsApi, type Vendor } from '@/lib/api';

interface VendorCarouselProps {
  title: string;
}

export default function VendorCarousel({ title }: VendorCarouselProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const data = await vendorsApi.getAll();
        console.log('Fetched vendors:', data.length, data);
        // Filter vendors that have logo_url or show all if none have logos
        const vendorsWithLogos = data.filter(v => v.logo_url).reverse();
        console.log('Vendors with logos:', vendorsWithLogos.length);

        // If no vendors with logos, use all vendors or fallback data
        if (vendorsWithLogos.length > 0) {
          setVendors(vendorsWithLogos);
        } else if (data.length > 0) {
          setVendors(data.reverse());
        } else {
          // Fallback data if no vendors in database
          const fallbackVendors = [
            { id: 1, name: 'Microsoft', logo_url: '/images/logos/logo-1.png' },
            { id: 2, name: 'Google', logo_url: '/images/logos/logo-2.png' },
            { id: 3, name: 'Amazon', logo_url: '/images/logos/logo-3.png' },
            { id: 4, name: 'Apple', logo_url: '/images/logos/logo-4.png' },
            { id: 5, name: 'Meta', logo_url: '/images/logos/logo-5.png' },
            { id: 6, name: 'Netflix', logo_url: '/images/logos/logo-6.png' },
          ];
          console.log('Using fallback vendors');
          setVendors(fallbackVendors as Vendor[]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch vendors'
        );
        console.error('Error fetching vendors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-normal text-gray-900 mb-8 font-inter">
              {title}
            </h2>
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-normal text-gray-900 mb-8 font-inter">
              {title}
            </h2>
            <p className="text-red-600">Error loading vendors: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (vendors.length === 0) {
    return (
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-normal text-gray-900 mb-8 font-inter">
              {title}
            </h2>
            <p className="text-gray-500">No vendors available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-normal text-gray-900 mb-8 font-inter">
            {title}
          </h2>
        </motion.div>
      </div>

      {/* Full-width Marquee Container */}
      <div className="relative overflow-hidden w-full">
        <div
          className="flex py-4"
          style={{
            animation: 'marquee 200s linear infinite',
            width: 'max-content',
          }}
        >
          {/* Create multiple sets of vendors for smooth scrolling */}
          {Array.from({ length: 4 }, (_, setIndex) =>
            vendors.map(vendor => (
              <div
                key={`set-${setIndex}-${vendor.id}`}
                className="flex-shrink-0 mx-12 items-center justify-center min-w-[200px]"
              >
                {vendor.logo_url ? (
                  <Image
                    src={vendor.logo_url}
                    alt={vendor.name}
                    width={160}
                    height={160}
                    className="h-24 object-contain"
                  />
                ) : (
                  <span className="text-gray-600 font-medium text-base">
                    {vendor.name}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
