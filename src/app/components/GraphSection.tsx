'use client';

import ForceBasedGraph from './ForceBasedGraph';

export default function GraphSection() {
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
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Vendor Images Here
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
