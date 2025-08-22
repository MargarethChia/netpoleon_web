"use client";

import ForceBasedGraph from "./ForceBasedGraph";

export default function GraphSection() {
  return (
    <section className="mt-20 py-20 bg-white relative overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
          Our Services
        </h2>
      </div>

      <ForceBasedGraph />
    </section>
  );
}
