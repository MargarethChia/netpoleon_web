'use client';

import ForceBasedGraph from './ForceBasedGraph';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { vendorsApi, type Vendor } from '@/lib/api';
import { createSlug } from '@/lib/slug-utils';

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
        // Sort vendors alphabetically by name
        const sortedVendors = data.sort((a, b) => a.name.localeCompare(b.name));
        setVendors(sortedVendors);
        setFilteredVendors(sortedVendors); // Initially show all vendors
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
      // Sort filtered vendors alphabetically
      const sortedVendors = newVendors.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setFilteredVendors(sortedVendors);
      setIsNodeClicked(sortedVendors.length !== vendors.length);
    },
    [vendors.length]
  );

  return (
    <section className="bg-white relative overflow-hidden py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: show static full diagram only */}
        <div className="md:hidden">
          <div className="w-full">
            <Image
              src="/images/full-diagram/full_diagram.png"
              alt="Full Security Diagram"
              width={1200}
              height={900}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Desktop/Tablet: interactive graph + vendor list */}
        <div className="hidden md:flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12">
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
            ) : vendors.length > 0 ? (
              <div>
                {/* Vendor Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {vendors.map(vendor => {
                    const isSelected = filteredVendors.some(
                      fv => fv.id === vendor.id
                    );
                    return (
                      <Link
                        key={vendor.id}
                        href={`/partners/${createSlug(vendor.name)}`}
                        className={`flex items-center justify-center p-2 bg-gray-50 rounded-lg border hover:shadow-md transition-all duration-300 cursor-pointer ${
                          isSelected ? 'opacity-100' : 'opacity-10 grayscale'
                        }`}
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
                          <div className="flex items-center justify-center h-8 w-full">
                            <span className="text-xs text-gray-600 font-medium text-center px-2">
                              {vendor.name}
                            </span>
                          </div>
                        )}
                      </Link>
                    );
                  })}
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
