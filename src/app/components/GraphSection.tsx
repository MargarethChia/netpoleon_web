'use client';

import ForceBasedGraph from './ForceBasedGraph';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { vendorsApi, type Vendor } from '@/lib/api';

export default function GraphSection() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const data = await vendorsApi.getAll();
        const vendorsWithLogos = data.filter(v => v.logo_url).reverse();
        setVendors(vendorsWithLogos);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return (
    <section className="bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12">
          {/* Left side - Graph */}
          <div className="lg:w-2/3 h-[720px]">
            <ForceBasedGraph />
          </div>

          {/* Right side - Vendor Images */}
          <div className="lg:w-1/3 text-left">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : vendors.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {vendors.map(vendor => (
                  <div
                    key={vendor.id}
                    className="flex items-center justify-center p-2 bg-gray-50 rounded-lg border hover:shadow-md transition-shadow"
                  >
                    {vendor.logo_url ? (
                      <Image
                        src={vendor.logo_url}
                        alt={vendor.name}
                        width={80}
                        height={60}
                        className="h-8 object-contain"
                      />
                    ) : (
                      <span className="text-xs text-gray-600 font-medium text-center">
                        {vendor.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No vendor logos available</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
