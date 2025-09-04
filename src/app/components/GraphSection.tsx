'use client';

import ForceBasedGraph from './ForceBasedGraph';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { vendorsApi, type Vendor } from '@/lib/api';

export default function GraphSection() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNodeClicked, setIsNodeClicked] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const data = await vendorsApi.getAll();
        const vendorsWithLogos = data.filter(v => v.logo_url).reverse();
        setVendors(vendorsWithLogos);
        setFilteredVendors(vendorsWithLogos); // Initially show all vendors
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const handleVendorsChange = useCallback(
    (newVendors: Vendor[]) => {
      setFilteredVendors(newVendors);
      setIsNodeClicked(newVendors.length !== vendors.length);
    },
    [vendors.length]
  );

  return (
    <section className="bg-white relative overflow-hidden py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12">
          {/* Left side - Graph */}
          <div className="lg:w-2/3 h-[720px]">
            <ForceBasedGraph onVendorsChange={handleVendorsChange} />
          </div>

          {/* Right side - Vendor Images */}
          <div className="lg:w-1/3 text-left">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : filteredVendors.length > 0 ? (
              <div>
                {/* Vendor Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {filteredVendors.map(vendor => (
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
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Vendors Found
                </h3>
                <p className="text-sm text-gray-600">
                  {isNodeClicked
                    ? 'No vendors found for the selected category'
                    : 'No vendor logos available'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
