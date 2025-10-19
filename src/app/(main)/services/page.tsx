'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllServiceIds, getServiceData } from '@/data/services-data';

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

// Get services dynamically from services data
const getServices = () => {
  const serviceIds = getAllServiceIds();
  return serviceIds
    .map((id, index) => {
      const serviceData = getServiceData(id);
      if (!serviceData) return null;

      // Map service IDs to appropriate icons
      const iconMap: Record<string, string> = {
        nxone: '/icons/Channel Sales & Enablement.png',
        nable: '/icons/Technology & Product Training.png',
        nsure: '/icons/Pre-Sales POV, Consultation & Professional Services.png',
        ncircle: '/icons/Post Sales & Customer Support Services.png',
      };

      return {
        id: index + 1,
        slug: id,
        title: serviceData.title,
        description: serviceData.overview[0], // Use first paragraph of overview
        icon: iconMap[id] || '/icons/Dashboard.png',
      };
    })
    .filter(
      (service): service is NonNullable<typeof service> => service !== null
    );
};

const services = getServices();

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
      const isMobile = window.innerWidth < 1024; // lg breakpoint

      // Get the actual container element to calculate proper scroll positions
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerTop = containerRect.top + scrollTop;

      // Calculate section height based on screen size
      const sectionHeight = isMobile ? windowHeight * 0.45 : windowHeight; // 45vh on mobile, full height on desktop

      // Calculate which service should be active based on scroll position relative to container
      const relativeScrollTop = scrollTop - containerTop;
      const mainSectionHeight = whatWeDo.length * sectionHeight;
      const scrollProgress = Math.min(
        Math.max(relativeScrollTop, 0) / mainSectionHeight,
        1
      );
      const serviceIndex = scrollProgress * whatWeDo.length;
      const clampedIndex = Math.max(
        0,
        Math.min(Math.floor(serviceIndex), whatWeDo.length - 1)
      );

      setActiveService(clampedIndex);

      // Calculate opacity for each section based on scroll position
      const newOpacities = whatWeDo.map((_, index) => {
        const sectionStart = index * sectionHeight;
        const sectionEnd = (index + 1) * sectionHeight;

        // Check if current scroll position is within this section
        const isInSection =
          relativeScrollTop >= sectionStart && relativeScrollTop < sectionEnd;

        // Binary focus: either 100% (in focus) or 10% (not in focus)
        return isInSection ? 1 : 0.1;
      });

      setSectionOpacities(newOpacities);

      // Check if services section is visible (separate from main scrollable section)
      if (servicesRef.current) {
        const servicesRect = servicesRef.current.getBoundingClientRect();
        const isVisible = servicesRect.top < windowHeight * 0.7;
        setIsServicesVisible(isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // Recalculate on resize
    handleScroll(); // Initial call
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
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
      {/* Progress Navigation Bar - Becomes sticky when it reaches the top */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-2 pb-3">
          <div className="flex justify-between w-full relative">
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
                className={`text-xs sm:text-sm font-semibold transition-all duration-300 px-1 sm:px-4 py-2 sm:py-3 border-none cursor-pointer bg-transparent relative uppercase tracking-wide flex-1 ${
                  index === activeService
                    ? 'text-amber-700 bg-amber-50 border-b-2 border-amber-600 pb-1 sm:pb-2'
                    : 'text-gray-400 hover:text-amber-600 hover:bg-orange-50 hover:border-b-2 hover:border-orange-300 hover:pb-1 sm:hover:pb-2'
                }`}
                onClick={() => {
                  const element = document.getElementById(`service-${index}`);
                  if (element) {
                    // Calculate offset to account for sticky navbar
                    const navbarHeight = 60; // Approximate navbar height
                    const elementPosition = element.offsetTop - navbarHeight;
                    window.scrollTo({
                      top: elementPosition,
                      behavior: 'smooth',
                    });
                  }
                }}
              >
                <span className="hidden sm:inline">{service.shortTitle}</span>
                <span className="sm:hidden">
                  {service.shortTitle.charAt(0)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Fixed Icon (Hidden on mobile, shown on desktop) */}
        <div className="hidden lg:flex lg:w-[40%] items-center justify-center top-16 h-screen sticky bg-orange-200">
          <div className="text-center">
            {/* Icon Container with Fade Effect */}
            <div className="relative w-full h-full">
              {whatWeDo.map((service, index) => renderIcon(service, index))}
            </div>
          </div>
        </div>

        {/* Right Side - Scrolling Content */}
        <div className="w-full lg:w-[60%] mb-20 md:mb-0">
          <div ref={containerRef} className="relative">
            {whatWeDo.map((service, index) => (
              <div
                key={service.id}
                id={`service-${index}`}
                className="min-h-[45vh] lg:min-h-screen flex items-center px-4 sm:px-8 lg:px-16 py-6 sm:py-8 lg:py-20 pt-[20vh] lg:pt-6"
              >
                <div
                  className="max-w-md mx-auto lg:mx-0"
                  style={{
                    opacity: sectionOpacities[index],
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {/* Mobile Icon - Only shown on mobile */}
                  <div className="lg:hidden flex justify-center mb-6">
                    <div className="w-24 h-24 bg-orange-200 rounded-full flex items-center justify-center">
                      <Image
                        src={service.icon}
                        alt={service.title}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Section Indicator */}
                  <div className="text-amber-600 text-sm font-semibold mb-4 uppercase tracking-wide">
                    {index + 1}/{whatWeDo.length}
                  </div>

                  {/* Service Title */}
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-700 mb-6 leading-tight">
                    {service.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6 text-left">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Cards Section */}
      <div
        ref={servicesRef}
        className="bg-gray-50 py-12 sm:py-20 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          {/* Section Header */}
          <div
            className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
              isServicesVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Professional Services
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Find our tailored services to ease and enhance your business
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {services.map((service, index) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className={`block bg-white rounded-xl transition-all duration-300 p-4 sm:p-6 lg:p-8 border border-gray-100 transform hover:-translate-y-3 hover:scale-105 cursor-pointer ${
                  isServicesVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-16'
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                <div className="flex items-start space-x-4 sm:space-x-6">
                  {/* Service Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-orange-200 hover:scale-110 hover:rotate-3">
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
                    <h3 className="text-lg sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 transition-colors duration-200 hover:text-amber-700">
                      {service.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
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
