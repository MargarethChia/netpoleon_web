"use client";

import { useEffect, useRef, useState } from "react";

const services = [
  {
    id: 1,
    title: "Channel Sales & Enablement",
    description: "Comprehensive channel sales strategies and enablement programs to maximize your distribution network effectiveness.",
    icon: "/icons/Channel Sales & Enablement.png"
  },
  {
    id: 2,
    title: "Operations & Logistics Services",
    description: "End-to-end operational excellence and logistics solutions to streamline your business processes.",
    icon: "/icons/Operations & Logistics Services.png"
  },
  {
    id: 3,
    title: "Pre-Sales POV, Consultation & Professional Services",
    description: "Strategic pre-sales consultation and professional services to enhance customer engagement and solution design.",
    icon: "/icons/Pre-Sales POV, Consultation & Professional Services.png"
  },
  {
    id: 4,
    title: "Post-Sales & Customer Support Services",
    description: "Comprehensive post-sales support and customer service solutions to ensure long-term customer satisfaction.",
    icon: "/icons/Post Sales & Customer Support Services.png"
  },
  {
    id: 5,
    title: "Technology & Product Training",
    description: "Specialized training programs for technology products and solutions to maximize user adoption and proficiency.",
    icon: "/icons/Technology & Product Training.png"
  },
  {
    id: 6,
    title: "Vendor Promotion & Augmentation",
    description: "Strategic vendor promotion and augmentation services to enhance market presence and operational capabilities.",
    icon: "/icons/Vendor Promotion & Augmentation.png"
  },
  {
    id: 7,
    title: "Marketing & Business Development Support",
    description: "Comprehensive marketing strategies and business development support to drive growth and market expansion.",
    icon: "/icons/Marketing & Business Development Support.png"
  },
  {
    id: 8,
    title: "Finance Services",
    description: "Professional financial services and consulting to optimize your business financial performance and strategy.",
    icon: "/icons/Financial Services.png"
  },
  {
    id: 9,
    title: "Marketplace",
    description: "Digital marketplace solutions and platforms to facilitate commerce and business transactions.",
    icon: "/icons/Marketplace.png"
  }
];

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(0);
  const [sectionOpacities, setSectionOpacities] = useState<number[]>(services.map(() => 0));
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
      const clampedIndex = Math.max(0, Math.min(Math.floor(serviceIndex), services.length - 1));
      
      setActiveService(clampedIndex);
      
              // Calculate opacity for each section based on scroll position
        const newOpacities = services.map((_, index) => {
          const sectionStart = (index / services.length) * (documentHeight - windowHeight);
          const sectionEnd = ((index + 1) / services.length) * (documentHeight - windowHeight);
          
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

  const renderIcon = (service: typeof services[0], index: number) => {
    return (
      <div
        key={service.id}
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
          index === activeService ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Large icon container with consistent positioning */}
        <div className="w-5/6 h-5/6 flex flex-col items-center justify-start pt-16">
          {/* Icon display area with fixed sizing */}
          <div className="w-64 h-64 flex items-center justify-start mb-6">
            <img 
              src={service.icon} 
              alt={service.title} 
              className="w-64 h-64 object-contain drop-shadow-lg"
              style={{ minWidth: '256px', minHeight: '256px', maxWidth: '256px', maxHeight: '256px' }}
            />
          </div>
          {/* Service title below the icon */}
          {/* <h3 className="text-2xl font-bold text-amber-800 text-center px-4">
            {service.title.split(' ')[0]}
          </h3> */}
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      {/* Navigation Bar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem 1rem 1rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '0',
            position: 'relative'
          }}>
            {/* Progress Bar Background */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              height: '3px',
              backgroundColor: '#f3f4f6',
              borderRadius: '2px'
            }}></div>
            
            {/* Active Progress Bar */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              height: '3px',
              backgroundColor: '#d97706',
              borderRadius: '2px',
              transition: 'width 0.3s ease',
              width: `${((activeService + 1) / services.length) * 100}%`
            }}></div>
            
            {services.map((service, index) => (
              <button
                key={service.id}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  color: index === activeService ? '#92400e' : '#6b7280',
                  position: 'relative',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => {
                  if (index !== activeService) {
                    e.currentTarget.style.color = '#374151';
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== activeService) {
                    e.currentTarget.style.color = '#6b7280';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
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
        <div className="w-1/2 flex items-center justify-center top-20 h-screen sticky bg-blue-600" style={{
          width: '60%',
          height: '100vh'
        }}>
          <div style={{ textAlign: 'center' }}>
            {/* Icon Container with Fade Effect */}
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {services.map((service, index) => renderIcon(service, index))}
            </div>

          </div>
        </div>

        {/* Right Side - Scrolling Content */}
        <div style={{ width: '50%' }}>
          <div ref={containerRef} style={{ position: 'relative' }}>
            {services.map((service, index) => (
              <div
                key={service.id}
                id={`service-${index}`}
                style={{
                  minHeight: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '5rem 4rem'
                }}
              >
                <div style={{ 
                  maxWidth: '28rem',
                  opacity: sectionOpacities[index],
                  transition: 'opacity 0.3s ease'
                }}>
                  {/* Section Indicator */}
                  <div style={{
                    color: '#d97706',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: '1.5rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
                  }}>
                    {index + 1}/{services.length}
                  </div>
                  
                  {/* Service Title */}
                  <h2 style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: '#92400e',
                    marginBottom: '2rem',
                    lineHeight: '1.1'
                  }}>
                    {service.title}
                  </h2>
                  
                  {/* Description */}
                  <p style={{
                    color: '#374151',
                    fontSize: '1.125rem',
                    lineHeight: '1.75',
                    marginBottom: '2.5rem',
                    textAlign: 'left'
                  }}>
                    {service.description}
                  </p>
                  
                  {/* Learn More Link */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginBottom: '2rem'
                  }}>
                    <span style={{
                      color: 'black',
                      fontWeight: '600',
                      marginRight: '0.75rem',
                      fontSize: '1.125rem'
                    }}>
                      Learn more
                    </span>
                    <div style={{
                      flex: 1,
                      height: '2px',
                      backgroundColor: '#d97706',
                      marginRight: '0.75rem'
                    }}></div>
                    <svg 
                      style={{
                        width: '1.25rem',
                        height: '1.25rem',
                        color: '#d97706'
                      }}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
