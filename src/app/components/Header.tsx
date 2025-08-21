'use client';

import { motion } from "framer-motion";
import Image from "next/image";

export default function Header() {
  return (
    <motion.header 
      className="bg-gradient-to-r from-orange-600 to-amber-600 shadow-lg sticky top-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
          >
            <Image 
              src="/images/netpoleon.png" 
              alt="Netpoleon" 
              width={120} 
              height={80} 
              className="h-16 w-auto"
            />
          </motion.div>
          
          {/* Navigation */}
          <motion.nav 
            className="hidden md:flex space-x-10"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
          >
            {[
              { href: "/", text: "Home" },
              { href: "/about", text: "About" },
              { href: "/partners", text: "Security Partners" },
              { href: "#services", text: "Services" },
              { href: "#events", text: "Events" },
              { href: "#resources", text: "Resources" },
              { href: "#contact_us", text: "Contact Us" }


            ].map((link, index) => (
              <motion.a 
                key={link.href}
                href={link.href} 
                className="text-white/90 hover:text-white transition-colors font-medium relative group"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.5 + (index * 0.1), 
                  ease: "easeInOut" 
                }}
                whileHover={{ 
                  y: -2,
                  transition: { duration: 0.3, ease: "easeInOut" }
                }}
              >
                {link.text}
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white rounded-full"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-white rounded-full opacity-0 group-hover:opacity-20"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </motion.a>
            ))}
          </motion.nav>
          
          {/* Mobile menu button */}
          <motion.div 
            className="md:hidden"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeInOut" }}
          >
            <motion.button 
              className="text-white hover:text-white/80 p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
} 