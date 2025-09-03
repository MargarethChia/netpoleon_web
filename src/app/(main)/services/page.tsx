'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const services = [
  {
    id: 1,
    title: 'Channel Sales & Enablement',
    description:
      'Comprehensive channel sales strategies and enablement programs to maximize your distribution network effectiveness.',
    icon: '/icons/Channel Sales & Enablement.png',
  },
  {
    id: 2,
    title: 'Operations & Logistics Services',
    description:
      'End-to-end operational excellence and logistics solutions to streamline your business processes.',
    icon: '/icons/Operations & Logistics Services.png',
  },
  {
    id: 3,
    title: 'Pre-Sales POV, Consultation & Professional Services',
    description:
      'Strategic pre-sales consultation and professional services to enhance customer engagement and solution design.',
    icon: '/icons/Pre-Sales POV, Consultation & Professional Services.png',
  },
  {
    id: 4,
    title: 'Post-Sales & Customer Support Services',
    description:
      'Comprehensive post-sales support and customer service solutions to ensure long-term customer satisfaction.',
    icon: '/icons/Post Sales & Customer Support Services.png',
  },
  {
    id: 5,
    title: 'Technology & Product Training',
    description:
      'Specialized training programs for technology products and solutions to maximize user adoption and proficiency.',
    icon: '/icons/Technology & Product Training.png',
  },
  {
    id: 6,
    title: 'Vendor Promotion & Augmentation',
    description:
      'Strategic vendor promotion and augmentation services to enhance market presence and operational capabilities.',
    icon: '/icons/Vendor Promotion & Augmentation.png',
  },
  {
    id: 7,
    title: 'Marketing & Business Development Support',
    description:
      'Comprehensive marketing strategies and business development support to drive growth and market expansion.',
    icon: '/icons/Marketing & Business Development Support.png',
  },
  {
    id: 8,
    title: 'Finance Services',
    description:
      'Professional financial services and consulting to optimize your business financial performance and strategy.',
    icon: '/icons/Financial Services.png',
  },
  {
    id: 9,
    title: 'Marketplace',
    description:
      'Digital marketplace solutions and platforms to facilitate commerce and business transactions.',
    icon: '/icons/Marketplace.png',
  },
];

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(0);
  const [sectionOpacities, setSectionOpacities] = useState<number[]>(
    services.map((_, index) => (index === 0 ? 1 : 0.1))
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Calculate which service should be active based on scroll position
      const scrollProgress = scrollTop / (documentHeight - windowHeight);
      const serviceIndex = scrollProgress * services.length;
      const clampedIndex = Math.max(
        0,
        Math.min(Math.floor(serviceIndex), services.length - 1)
      );

      setActiveService(clampedIndex);

      // Calculate opacity for each section based on scroll position
      const newOpacities = services.map((_, index) => {
        const sectionStart =
          (index / services.length) * (documentHeight - windowHeight);
        const sectionEnd =
          ((index + 1) / services.length) * (documentHeight - windowHeight);

        // Check if current scroll position is within this section
        const isInSection = scrollTop >= sectionStart && scrollTop < sectionEnd;

        // Binary focus: either 100% (in focus) or 10% (not in focus)
        return isInSection ? 1 : 0.1;
      });

      setSectionOpacities(newOpacities);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderIcon = (service: (typeof services)[0], index: number) => {
    return (
      <div
        key={service.id}
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
          index === activeService ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Large icon container with consistent positioning */}
        <div className="w-5/6 h-5/6 flex flex-col items-center justify-center">
          {/* Icon display area with fixed sizing */}
          <div className="w-64 h-64 flex items-center justify-center">
            <Image
              src={service.icon}
              alt={service.title}
              width={256}
              height={256}
              className="object-contain drop-shadow-lg mb-16"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-center gap-0 relative">
            {/* Progress Bar Background */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-sm"></div>

            {/* Active Progress Bar */}
            <div
              className="absolute bottom-0 left-0 h-1 bg-amber-600 rounded-sm transition-all duration-300"
              style={{
                width: `${((activeService + 1) / services.length) * 100}%`,
              }}
            ></div>

            {services.map((service, index) => (
              <button
                key={service.id}
                className={`text-sm font-semibold transition-all duration-300 px-6 py-3 border-none cursor-pointer bg-transparent relative uppercase tracking-wide ${
                  index === activeService
                    ? 'text-amber-700 bg-amber-50 border-b-2 border-amber-600 pb-2'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => {
                  const element = document.getElementById(`service-${index}`);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {service.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Left Side - Fixed Icon (Half the page) */}
        <div className="w-1/2 flex items-center justify-center top-20 h-screen sticky bg-amber-100">
          <div className="text-center">
            {/* Icon Container with Fade Effect */}
            <div className="relative w-full h-full">
              {services.map((service, index) => renderIcon(service, index))}
            </div>
          </div>
        </div>

        {/* Right Side - Scrolling Content */}
        <div className="w-1/2">
          <div ref={containerRef} className="relative">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={`service-${index}`}
                className="min-h-screen flex items-center px-16 py-20"
              >
                <div
                  className="max-w-md"
                  style={{
                    opacity: sectionOpacities[index],
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {/* Section Indicator */}
                  <div className="text-amber-600 text-sm font-semibold mb-4 uppercase tracking-wide">
                    {index + 1}/{services.length}
                  </div>

                  {/* Service Title */}
                  <h2 className="text-5xl font-bold text-amber-700 mb-6 leading-tight">
                    {service.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-700 text-lg leading-relaxed mb-6 text-left">
                    {service.description}
                  </p>

                  {/* Learn More Link */}
                  <div className="flex items-center cursor-pointer mb-4">
                    <span className="text-black font-semibold mr-3 text-lg">
                      Learn more
                    </span>
                    <div className="flex-1 h-0.5 bg-amber-600 mr-3"></div>
                    <svg
                      className="w-5 h-5 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
