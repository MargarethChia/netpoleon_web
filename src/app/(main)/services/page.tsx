'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllServiceIds, getServiceData } from '@/data/services-data';

const whatWeDo = [
  {
    id: 1,
    title: 'Outreach',
    shortTitle: 'Outreach',
    description:
      'Awareness & Promotions: Channel, Sales, Marketing & Business Development Support',
    icon: '/icons/Marketing & Business Development Support White.png',
  },
  {
    id: 2,
    title: 'Educate',
    shortTitle: 'Educate',
    description: 'Training & Certification: Technology & Product Training',
    icon: '/icons/Technology & Product Training White.png',
  },
  {
    id: 3,
    title: 'Support',
    shortTitle: 'Support',
    description:
      'Technical Assistance: Pre & Post Sales Consultation & Professional Services',
    icon: '/icons/Pre-Sales POV, Consultation & Professional Services White.png',
  },
  {
    id: 4,
    title: 'Operations',
    shortTitle: 'Operations',
    description: 'Business Process: Procurement, Logistics & Finance Services',
    icon: '/icons/Operations & Logistics Services White.png',
  },
  {
    id: 5,
    title: 'Specialisation',
    shortTitle: 'Specialisation',
    description:
      'Custom Configuration: Vendor Promotion & Product Augmentation',
    icon: '/icons/Vendor Promotion & Augmentation White.png',
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
        nxone: '/icons/Channel Sales & Enablement White.png',
        nable: '/icons/Technology & Product Training White.png',
        nsure:
          '/icons/Pre-Sales POV, Consultation & Professional Services White.png',
        ncircle: '/icons/Post Sales & Customer Support Services White.png',
      };

      return {
        id: index + 1,
        slug: id,
        title: serviceData.title,
        description: serviceData.overview[0], // Use first paragraph of overview
        icon: iconMap[id] || '/icons/Dashboard White.png',
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
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const isManualScrolling = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;

      // Check if header is visible by checking its position, opacity, and transform
      const header = document.querySelector('header');
      if (header) {
        const headerRect = header.getBoundingClientRect();
        const headerComputed = window.getComputedStyle(header);
        const opacity = parseFloat(headerComputed.opacity);
        const transform = headerComputed.transform;

        // Header is visible if:
        // 1. It has opacity > 0 (not transparent)
        // 2. It's positioned at or near the top of the viewport (within reasonable bounds)
        // 3. It's not translated up (transform doesn't contain negative translateY or matrix with negative Y)
        const isTranslatedUp =
          transform.includes('translateY(-') ||
          (transform.includes('matrix') && transform.includes(', -'));
        const isAtTop = headerRect.top >= -10 && headerRect.top <= 10; // Allow small margin for rounding
        const isVisible = opacity > 0 && isAtTop && !isTranslatedUp;
        setIsHeaderVisible(isVisible);
      } else {
        // If header doesn't exist, assume it's not visible
        setIsHeaderVisible(false);
      }

      // Get actual section positions from DOM elements
      const sectionElements = whatWeDo
        .map((_, index) => {
          const element = document.getElementById(`service-${index}`);
          if (element) {
            const rect = element.getBoundingClientRect();
            return {
              top: rect.top + scrollTop,
              bottom: rect.bottom + scrollTop,
              height: rect.height,
              center: rect.top + scrollTop + rect.height / 2,
            };
          }
          return null;
        })
        .filter(Boolean) as Array<{
        top: number;
        bottom: number;
        height: number;
        center: number;
      }>;

      // Calculate which service should be active based on actual section positions
      // Use viewport center to determine active section
      const viewportCenter = scrollTop + windowHeight / 2;
      let activeIndex = 0;
      let foundMatch = false;

      // Use a threshold-based approach: section is active if viewport center is within its bounds
      // with a small buffer zone to prevent rapid switching
      for (let i = 0; i < sectionElements.length; i++) {
        const section = sectionElements[i];
        const sectionTop = section.top;
        const sectionBottom = section.bottom;
        const bufferZone = section.height * 0.15; // 15% buffer at top and bottom for smoother transitions

        // Check if viewport center is within this section (with buffer zones)
        if (
          viewportCenter >= sectionTop - bufferZone &&
          viewportCenter <= sectionBottom + bufferZone
        ) {
          activeIndex = i;
          foundMatch = true;
          break;
        }
      }

      // Fallback: if no section matched, find the closest one by distance to center
      if (!foundMatch && sectionElements.length > 0) {
        let minDistance = Infinity;
        for (let i = 0; i < sectionElements.length; i++) {
          const section = sectionElements[i];
          const distance = Math.abs(viewportCenter - section.center);
          if (distance < minDistance) {
            minDistance = distance;
            activeIndex = i;
          }
        }
      }

      // Only update if not manually scrolling
      if (!isManualScrolling.current) {
        setActiveService(activeIndex);
      }

      // Calculate opacity for each section based on actual positions
      const newOpacities = whatWeDo.map((_, index) => {
        if (index >= sectionElements.length) return 0.1;

        const section = sectionElements[index];
        const sectionCenter = section.center;

        // Check if current scroll position is within this section
        // Use a smoother transition with distance from center
        const distanceFromCenter = Math.abs(viewportCenter - sectionCenter);
        const maxDistance = section.height;
        const opacity = Math.max(
          0.1,
          1 - (distanceFromCenter / maxDistance) * 0.9
        );

        return opacity;
      });

      setSectionOpacities(newOpacities);

      // Check if services section is visible (separate from main scrollable section)
      if (servicesRef.current) {
        const servicesRect = servicesRef.current.getBoundingClientRect();
        const isVisible = servicesRect.top < windowHeight * 0.7;
        setIsServicesVisible(isVisible);
      }
    };

    // Initial check after a short delay to ensure DOM is ready
    const initialCheck = () => {
      setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // Recalculate on resize
    initialCheck(); // Initial call with delay

    // Also check on scroll using MutationObserver to catch header visibility changes
    const headerObserver = new MutationObserver(handleScroll);
    const header = document.querySelector('header');
    if (header) {
      headerObserver.observe(header, {
        attributes: true,
        attributeFilter: ['class', 'style'],
      });
      // Also check on initial load
      initialCheck();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      headerObserver.disconnect();
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
        <div className="w-full h-5/6 flex flex-col items-center justify-center">
          {/* Orange card container */}
          <div className="bg-orange-500 px-40 py-16 shadow-xl flex items-center justify-center">
            {/* Icon display area with fixed sizing */}
            <div className="w-64 h-64 flex items-center justify-center">
              <Image
                src={service.icon}
                alt={service.title}
                width={256}
                height={256}
                unoptimized
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Navigation Bar - Becomes sticky when it reaches the top */}
      <nav
        className={`sticky ${isHeaderVisible ? 'top-16' : 'top-0'} z-40 bg-white transition-all duration-300`}
      >
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
                className={`text-xs sm:text-sm font-semibold transition-all duration-300 px-1 sm:px-4 py-3 sm:py-5 border-none cursor-pointer bg-transparent relative uppercase tracking-wide flex-1 ${
                  index === activeService
                    ? 'text-amber-700 bg-amber-50 border-b-2 border-amber-600'
                    : 'text-gray-400 hover:text-amber-600 hover:bg-orange-50 hover:border-b-2 hover:border-orange-300'
                }`}
                onClick={() => {
                  const element = document.getElementById(`service-${index}`);
                  if (element) {
                    isManualScrolling.current = true;
                    setActiveService(index);

                    const header = document.querySelector('header');
                    const headerHeight = isHeaderVisible
                      ? (header?.getBoundingClientRect().height ?? 0)
                      : 0;
                    const navbar = document.querySelector('nav.sticky');
                    const navbarHeight = navbar
                      ? navbar.getBoundingClientRect().height
                      : 60;
                    const stickyOffset = headerHeight + navbarHeight;

                    const elementTop =
                      element.getBoundingClientRect().top + window.scrollY;
                    const elementCenter = elementTop + element.offsetHeight / 2;
                    const viewportCenter = window.innerHeight / 2;

                    window.scrollTo({
                      top: elementCenter - viewportCenter + stickyOffset / 2,
                      behavior: 'smooth',
                    });

                    setTimeout(() => {
                      isManualScrolling.current = false;
                    }, 1000);
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
      <div className="flex flex-col lg:flex-row mx-20">
        {/* Left Side - Fixed Icon (Hidden on mobile, shown on desktop) */}
        <div className="hidden lg:flex lg:w-[40%] items-center justify-center top-16 h-[90vh] sticky">
          <div className="text-center">
            {/* Icon Container with Fade Effect */}
            <div className="relative w-full h-full mb-0">
              {whatWeDo.map((service, index) => renderIcon(service, index))}
            </div>
          </div>
        </div>

        {/* Right Side - Scrolling Content */}
        <div className="w-full lg:w-[50%] lg:px-20 mb-20 md:mb-0 lg:py-[30vh]">
          <div ref={containerRef} className="relative">
            {whatWeDo.map((service, index) => (
              <div
                key={service.id}
                id={`service-${index}`}
                className="sm:h-[45vh] lg:h-[35vh] flex items-center px-4 sm:px-8 lg:px-16 py-6 sm:py-8 lg:py-20 pt-[20vh] lg:pt-6"
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
                    <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center">
                      <Image
                        src={service.icon}
                        alt={service.title}
                        width={64}
                        height={64}
                        unoptimized
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
      <div ref={servicesRef} className="pb-12 sm:pb-20 overflow-hidden">
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
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-orange-500 hover:scale-110 hover:rotate-3">
                      <Image
                        src={service.icon}
                        alt={service.title}
                        width={40}
                        height={40}
                        unoptimized
                        className="object-contain transition-transform duration-200 hover:scale-110"
                      />
                    </div>
                  </div>

                  {/* Service Content */}
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 transition-colors duration-200 hover:text-amber-700">
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
