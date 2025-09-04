'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-orange-600 to-amber-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/images/netpoleon.png"
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
              { href: '/partners', text: 'Cybersecurity Vendors' },
              { href: '/services', text: 'Services' },
              { href: '/events', text: 'Events' },
              { href: '/resources', text: 'Resources' },
              { href: '/contact', text: 'Contact Us' },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/90 hover:text-white transition-colors font-medium relative group"
              >
                {link.text}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white rounded-full group-hover:w-full transition-all duration-300" />
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-white rounded-full opacity-0 group-hover:opacity-20 transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white hover:text-white/80 p-2 rounded-lg hover:bg-white/10 transition-all duration-300">
              <svg
                className="h-6 w-6"
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
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
