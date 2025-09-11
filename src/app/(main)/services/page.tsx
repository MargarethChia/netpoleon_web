'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const whatWeDo = [
  {
    id: 1,
    title: 'Professional Installation',
    shortTitle: 'Installation',
    description: 'Certified engineers handle deployment',
    icon: '/icons/Module.png',
  },
  {
    id: 2,
    title: 'Training & Certification',
    shortTitle: 'Training',
    description: 'Comprehensive user and admin training',
    icon: '/icons/Technology & Product Training.png',
  },
  {
    id: 3,
    title: 'Custom Configuration',
    shortTitle: 'Configuration',
    description: 'Tailored to your security requirements',
    icon: '/icons/Dashboard.png',
  },
  {
    id: 4,
    title: 'Ongoing Support',
    shortTitle: 'Support',
    description: '24/7 monitoring and maintenance',
    icon: '/icons/Marketing & Business Development Support.png',
  },
];

const services = [
  {
    id: 1,
    slug: 'channel-sales-enablement',
    title: 'Channel Sales & Enablement',
    description:
      'Comprehensive channel sales strategies and enablement programs to maximize your distribution network effectiveness.',
    icon: '/icons/Channel Sales & Enablement.png',
  },
  {
    id: 2,
    slug: 'operations-logistics',
    title: 'Operations & Logistics Services',
    description:
      'End-to-end operational excellence and logistics solutions to streamline your business processes.',
    icon: '/icons/Operations & Logistics Services.png',
  },
  {
    id: 3,
    slug: 'pre-sales-consultation',
    title: 'Pre-Sales POV, Consultation & Professional Services',
    description:
      'Strategic pre-sales consultation and professional services to enhance customer engagement and solution design.',
    icon: '/icons/Pre-Sales POV, Consultation & Professional Services.png',
  },
  {
    id: 4,
    slug: 'post-sales-support',
    title: 'Post-Sales & Customer Support Services',
    description:
      'Comprehensive post-sales support and customer service solutions to ensure long-term customer satisfaction.',
    icon: '/icons/Post Sales & Customer Support Services.png',
  },
  {
    id: 5,
    slug: 'technology-training',
    title: 'Technology & Product Training',
    description:
      'Specialized training programs for technology products and solutions to maximize user adoption and proficiency.',
    icon: '/icons/Technology & Product Training.png',
  },
  {
    id: 6,
    slug: 'vendor-promotion',
    title: 'Vendor Promotion & Augmentation',
    description:
      'Strategic vendor promotion and augmentation services to enhance market presence and operational capabilities.',
    icon: '/icons/Vendor Promotion & Augmentation.png',
  },
  {
    id: 7,
    slug: 'marketing-business-development',
    title: 'Marketing & Business Development Support',
    description:
      'Comprehensive marketing strategies and business development support to drive growth and market expansion.',
    icon: '/icons/Marketing & Business Development Support.png',
  },
  {
    id: 8,
    slug: 'finance-services',
    title: 'Finance Services',
    description:
      'Professional financial services and consulting to optimize your business financial performance and strategy.',
    icon: '/icons/Financial Services.png',
  },
  {
    id: 9,
    slug: 'marketplace-solutions',
    title: 'Marketplace',
    description:
      'Digital marketplace solutions and platforms to facilitate commerce and business transactions.',
    icon: '/icons/Marketplace.png',
  },
];

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(0);
  const [sectionOpacities, setSectionOpacities] = useState<number[]>(
    whatWeDo.map((_, index) => (index === 0 ? 1 : 0.1))
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const [isServicesVisible, setIsServicesVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;

      // Calculate which service should be active based on scroll position
      // Only consider the main scrollable section (whatWeDo), not the services section
      const mainSectionHeight = whatWeDo.length * windowHeight; // Each whatWeDo item takes full screen height
      const scrollProgress = Math.min(scrollTop / mainSectionHeight, 1);
      const serviceIndex = scrollProgress * whatWeDo.length;
      const clampedIndex = Math.max(
        0,
        Math.min(Math.floor(serviceIndex), whatWeDo.length - 1)
      );

      setActiveService(clampedIndex);

      // Calculate opacity for each section based on scroll position
      const newOpacities = whatWeDo.map((_, index) => {
        const sectionStart = index * windowHeight;
        const sectionEnd = (index + 1) * windowHeight;

        // Check if current scroll position is within this section
        const isInSection = scrollTop >= sectionStart && scrollTop < sectionEnd;

        // Binary focus: either 100% (in focus) or 10% (not in focus)
        return isInSection ? 1 : 0.1;
      });

      setSectionOpacities(newOpacities);

      // Check if services section is visible (separate from main scrollable section)
      if (servicesRef.current) {
        const servicesRect = servicesRef.current.getBoundingClientRect();
        const isVisible = servicesRect.top < windowHeight * 0.8;
        setIsServicesVisible(isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderIcon = (service: (typeof whatWeDo)[0], index: number) => {
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
                width: `${((activeService + 1) / whatWeDo.length) * 100}%`,
              }}
            ></div>

            {whatWeDo.map((service, index) => (
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
                {service.shortTitle}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Left Side - Fixed Icon (Half the page) */}
        <div className="w-[30%] flex items-center justify-center top-20 h-screen sticky bg-amber-100">
          <div className="text-center">
            {/* Icon Container with Fade Effect */}
            <div className="relative w-full h-full">
              {whatWeDo.map((service, index) => renderIcon(service, index))}
            </div>
          </div>
        </div>

        {/* Right Side - Scrolling Content */}
        <div className="w-[70%]">
          <div ref={containerRef} className="relative">
            {whatWeDo.map((service, index) => (
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
                    {index + 1}/{whatWeDo.length}
                  </div>

                  {/* Service Title */}
                  <h2 className="text-5xl font-bold text-amber-700 mb-6 leading-tight">
                    {service.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-700 text-lg leading-relaxed mb-6 text-left">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Cards Section */}
      <div ref={servicesRef} className="bg-gray-50 py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-8">
          {/* Section Header */}
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isServicesVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive solutions designed to accelerate your business
              growth and operational excellence
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className={`block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 transform hover:-translate-y-3 hover:scale-105 cursor-pointer ${
                  isServicesVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-16'
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                <div className="flex items-start space-x-6">
                  {/* Service Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-amber-200 hover:scale-110 hover:rotate-3">
                      <Image
                        src={service.icon}
                        alt={service.title}
                        width={40}
                        height={40}
                        className="object-contain transition-transform duration-200 hover:scale-110"
                      />
                    </div>
                  </div>

                  {/* Service Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 transition-colors duration-200 hover:text-amber-700">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
