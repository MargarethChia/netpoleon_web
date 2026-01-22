'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { publicAnnouncementBarApi } from '@/lib/api';

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasAnnouncementBar, setHasAnnouncementBar] = useState(false);
  const [isAnnouncementBarLoading, setIsAnnouncementBarLoading] =
    useState(true);

  // Calculate trigger point for background change
  const [triggerPoint, setTriggerPoint] = useState(0);

  // Check for announcement bar status
  useEffect(() => {
    const checkAnnouncementBar = async () => {
      try {
        const announcement = await publicAnnouncementBarApi.get();
        setHasAnnouncementBar(!!announcement);
      } catch {
        setHasAnnouncementBar(false);
      } finally {
        setIsAnnouncementBarLoading(false);
      }
    };

    checkAnnouncementBar();
  }, []);

  useEffect(() => {
    // Set trigger point on mount
    const windowHeight = window.innerHeight;
    setTriggerPoint(windowHeight * 0.75); // 75% of window height

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 100; // Minimum scroll distance before hiding

      // Always show header when at the very top
      if (currentScrollY <= 10) {
        setIsVisible(true);
      }
      // Hide header when scrolling down past threshold
      else if (
        currentScrollY > lastScrollY &&
        currentScrollY > scrollThreshold
      ) {
        setIsVisible(false);
      }
      // Show header when scrolling up
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle window resize
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      setTriggerPoint(windowHeight * 0.75);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [lastScrollY]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  // Don't show header on home page until announcement bar check is complete
  const shouldShowHeader = !isHomePage || !isAnnouncementBarLoading;

  // Determine if header should be visible
  const isHeaderVisible = shouldShowHeader && isVisible;

  // Use slower animation for home page initial fade-in
  const transitionDuration =
    isHomePage && shouldShowHeader && lastScrollY < triggerPoint
      ? 'duration-1000'
      : 'duration-300';

  return (
    <header
      className={`${
        isHomePage
          ? lastScrollY < triggerPoint && !isMobileMenuOpen
            ? `bg-transparent ${hasAnnouncementBar ? 'top-16' : ''}`
            : 'bg-white'
          : 'bg-white'
      } fixed top-0 left-0 right-0 z-50 transition-all ${transitionDuration} ease-in-out ${
        isHeaderVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-0'
      }`}
      onMouseEnter={handleMouseEnter}
    >
      <div className="max-w-7xl mx-auto py-1 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 mt-1">
            <Link href="/">
              <Image
                unoptimized
                src={
                  isHomePage
                    ? lastScrollY < triggerPoint && !isMobileMenuOpen
                      ? '/logos/Netpoleon ANZ White.png'
                      : '/logos/Netpoleon ANZ Orange Black .png'
                    : '/logos/Netpoleon ANZ Orange Black .png'
                }
                alt="Netpoleon"
                width={120}
                height={80}
                className="h-16 w-auto cursor-pointer hover:opacity-90 transition-opacity"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-10">
            {[
              { href: '/about', text: 'About' },
              { href: '/vendors', text: 'Vendors' },
              { href: '/services', text: 'Services' },
              { href: '/events', text: 'Events' },
              { href: '/resources', text: 'Resources' },
              { href: '/contact', text: 'Contact' },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`${
                  isHomePage
                    ? lastScrollY < triggerPoint && !isMobileMenuOpen
                      ? 'text-white/90 hover:text-white'
                      : 'text-gray-700 hover:text-orange-600'
                    : 'text-gray-700 hover:text-orange-600'
                } transition-colors font-medium relative group`}
              >
                {link.text}
                <div
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                    isHomePage
                      ? lastScrollY < triggerPoint && !isMobileMenuOpen
                        ? 'bg-orange-600'
                        : 'bg-orange-600'
                      : 'bg-orange-600'
                  } rounded-full group-hover:w-full transition-all duration-300`}
                />
                <div
                  className={`absolute -bottom-1 left-0 w-full h-0.5 bg-orange-600 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-300`}
                />
              </a>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`relative ${
                isHomePage
                  ? lastScrollY < triggerPoint && !isMobileMenuOpen
                    ? 'text-white hover:text-white/90 hover:bg-white/10'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                  : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
              } p-3 rounded-xl transition-all duration-300 group`}
            >
              <div className="relative w-6 h-6">
                <svg
                  className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
                    isMobileMenuOpen
                      ? 'rotate-180 opacity-0'
                      : 'rotate-0 opacity-100'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
                    isMobileMenuOpen
                      ? 'rotate-0 opacity-100'
                      : '-rotate-180 opacity-0'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <nav className="px-6 py-6 space-y-3">
              {[
                {
                  href: '/about',
                  text: 'About',
                  icon: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  ),
                },
                {
                  href: '/vendors',
                  text: 'Vendors',
                  icon: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  ),
                },
                {
                  href: '/services',
                  text: 'Services',
                  icon: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  ),
                },
                {
                  href: '/events',
                  text: 'Events',
                  icon: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                },
                {
                  href: '/resources',
                  text: 'Resources',
                  icon: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  ),
                },
                {
                  href: '/contact',
                  text: 'Contact Us',
                  icon: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  ),
                },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center space-x-4 text-gray-700 hover:text-orange-600 transition-all duration-300 font-medium py-4 px-4 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="text-orange-600 group-hover:scale-110 transition-transform duration-300">
                    {link.icon}
                  </div>
                  <span className="text-lg font-semibold">{link.text}</span>
                  <svg
                    className="ml-auto w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
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
                </Link>
              ))}

              {/* Contact CTA */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link
                  href="/contact"
                  className="block w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white text-center font-bold py-3 px-6 rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started Today
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
