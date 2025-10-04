'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Timeline } from '@/components/ui/timeline';
import Image from 'next/image';
import Link from 'next/link';
import { TeamMember } from '@/lib/supabase';

export default function AboutUs() {
  const timelineData = [
    {
      title: '2018',
      content: (
        <div>
          <p className="mb-4 text-sm font-normal text-gray-800 dark:text-neutral-200">
            Foundation - Netpoleon was founded with the vision to democratize
            enterprise cybersecurity solutions for organizations of all sizes.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <Image
                  src="/icons/User.png"
                  alt="Foundation"
                  width={24}
                  height={24}
                  className="mr-3"
                />
                <span className="font-semibold text-gray-900">
                  Company Founded
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Started with a small team of cybersecurity experts dedicated to
                making enterprise-grade security accessible to all
                organizations.
              </p>
              <div className="text-xs text-gray-600">
                <strong>Mission:</strong> Democratize enterprise cybersecurity
                solutions
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '2020',
      content: (
        <div>
          <p className="mb-4 text-sm font-normal text-gray-800 dark:text-neutral-200">
            Growth phase - Expanded our vendor network to 50+ partners and
            established our first enterprise client relationships across the
            region.
          </p>
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              50+ Strategic vendor partnerships established
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              First enterprise client relationships
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Regional expansion into Asia-Pacific
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Professional services team established
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
              <h4 className="font-semibold mb-2">Key Achievement</h4>
              <p className="text-sm opacity-90">
                Successfully onboarded first 100 enterprise clients with 99.8%
                customer satisfaction rate
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '2022',
      content: (
        <div>
          <p className="mb-8 text-sm font-normal text-gray-800 dark:text-neutral-200">
            Innovation milestone - Launched our managed security services
            division and achieved SOC 2 Type II certification, establishing
            ourselves as a trusted security partner.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-lg border border-orange-100">
              <div className="flex items-center mb-4">
                <Image
                  src="/icons/Post Sales & Customer Support Services.png"
                  alt="Managed Services"
                  width={24}
                  height={24}
                  className="mr-3"
                />
                <span className="font-semibold text-gray-900">
                  Managed Services
                </span>
              </div>
              <p className="text-sm text-gray-700">
                24/7 security monitoring and management
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-100">
              <div className="flex items-center mb-4">
                <Image
                  src="/icons/Settings.png"
                  alt="SOC 2"
                  width={24}
                  height={24}
                  className="mr-3"
                />
                <span className="font-semibold text-gray-900">
                  SOC 2 Type II
                </span>
              </div>
              <p className="text-sm text-gray-700">
                Security compliance certification
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '2024',
      content: (
        <div>
          <p className="mb-8 text-sm font-normal text-gray-800 dark:text-neutral-200">
            Leadership position achieved - Now serving 200+ vendors and 500+
            implementations, recognized as a leading cybersecurity value-added
            distributor in the Asia-Pacific region.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-lg border border-orange-100">
              <div className="flex items-center mb-4">
                <Image
                  src="/icons/Marketing & Business Development Support.png"
                  alt="Partners"
                  width={24}
                  height={24}
                  className="mr-3"
                />
                <span className="font-semibold text-gray-900">
                  200+ Vendors
                </span>
              </div>
              <p className="text-sm text-gray-700">
                Comprehensive partner network
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-100">
              <div className="flex items-center mb-4">
                <Image
                  src="/icons/Dashboard.png"
                  alt="Implementations"
                  width={24}
                  height={24}
                  className="mr-3"
                />
                <span className="font-semibold text-gray-900">
                  500+ Deployments
                </span>
              </div>
              <p className="text-sm text-gray-700">
                Successful implementations
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg border border-green-100">
              <div className="flex items-center mb-4">
                <Image
                  src="/icons/Lock.png"
                  alt="Security"
                  width={24}
                  height={24}
                  className="mr-3"
                />
                <span className="font-semibold text-gray-900">
                  Enterprise Grade
                </span>
              </div>
              <p className="text-sm text-gray-700">Security solutions</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg border border-purple-100">
              <div className="flex items-center mb-4">
                <Image
                  src="/icons/Technology & Product Training.png"
                  alt="Training"
                  width={24}
                  height={24}
                  className="mr-3"
                />
                <span className="font-semibold text-gray-900">
                  Expert Training
                </span>
              </div>
              <p className="text-sm text-gray-700">Comprehensive programs</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const services = [
    {
      title: 'Vendor Partner Management',
      icon: '/icons/Marketing & Business Development Support.png',
      desc: 'Strategic cybersecurity vendor relationship management and partnership optimization',
      highlight: 'Enterprise Focus',
    },
    {
      title: 'Solution Architecture',
      icon: '/icons/Dashboard.png',
      desc: 'Custom security architecture design, planning, and implementation roadmaps',
      highlight: 'Custom Design',
    },
    {
      title: 'Implementation Services',
      icon: '/icons/Module.png',
      desc: 'End-to-end deployment, integration, and configuration support',
      highlight: 'Full Service',
    },
    {
      title: 'Training & Certification',
      icon: '/icons/Technology & Product Training.png',
      desc: 'Comprehensive security awareness and technical certification programs',
      highlight: 'Expert Training',
    },
    {
      title: 'Managed Security Services',
      icon: '/icons/Lock.png',
      desc: 'Continuous monitoring, management, and optimization of security solutions',
      highlight: '24/7 Monitoring',
    },
    {
      title: 'Security Support',
      icon: '/icons/Post Sales & Customer Support Services.png',
      desc: 'Round-the-clock incident response, troubleshooting, and technical support',
      highlight: 'Always Available',
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
  };

  const [team_members, set_team_members] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch_team_members = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/members');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        set_team_members(data);
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch team members'
        );
      } finally {
        setLoading(false);
      }
    };

    fetch_team_members();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Animated Hero Section */}
      <motion.section
        className="relative py-24 bg-gradient-to-br from-orange-50 to-white overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Simple background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-32 right-32 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-32 left-32 w-48 h-48 bg-orange-400/8 rounded-full blur-2xl"
            animate={{ scale: [1.1, 1, 1.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div className="space-y-8" variants={fadeInUp}>
            <motion.div
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge
                variant="outline"
                className="text-orange-600 border-orange-600 px-4 py-2 text-sm font-medium"
              >
                Trusted Cybersecurity Partner Since 2018
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              About{' '}
              <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                Netpoleon
              </span>
            </motion.h1>

            <motion.p
              className="text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Leading cybersecurity value-added distributor, empowering
              organizations with cutting-edge security technologies and expert
              implementation services.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
                >
                  Partner With Us
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3 text-lg"
                >
                  View Our Solutions
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Hero Message Section - Inspired by Cloudflare */}
      <motion.section
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Image Section */}
          <motion.div
            className="relative h-64 bg-gradient-to-r from-orange-100 via-orange-50 to-blue-50 rounded-2xl overflow-hidden mb-16"
            variants={fadeInUp}
          >
            {/* Animated Security Icons */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-8 gap-4 opacity-60">
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-12 h-16 bg-gradient-to-b from-orange-400 to-orange-600 rounded-t-full rounded-b-sm"
                    style={{
                      background: `linear-gradient(to bottom, 
                        ${
                          i % 4 === 0
                            ? '#f97316, #ea580c'
                            : i % 4 === 1
                              ? '#3b82f6, #1d4ed8'
                              : i % 4 === 2
                                ? '#10b981, #059669'
                                : '#8b5cf6, #7c3aed'
                        })`,
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.6, 0.8, 0.6],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Overlay pattern */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
          </motion.div>

          {/* Two Column Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Main Message */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
                Building a more{' '}
                <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                  secure Internet
                </span>
              </h2>
            </motion.div>

            {/* Right Column - Description */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  About Netpoleon
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-3"></div>
                  <p className="text-gray-700">
                    Protecting organizations across the Asia-Pacific region
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-3"></div>
                  <p className="text-gray-700">
                    Democratizing enterprise-grade security for businesses of
                    all sizes
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-3"></div>
                  <p className="text-gray-700">
                    Building the future of cybersecurity distribution
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Our Story Section with Timeline */}
      <section className="bg-gray-50">
        <div className="relative w-full overflow-clip">
          <Timeline data={timelineData} />
        </div>
      </section>

      {/* Services Section */}
      <motion.section
        className="py-24 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div variants={fadeInUp} className="space-y-6">
              <Badge
                variant="outline"
                className="text-orange-600 border-orange-600 px-4 py-2"
              >
                What We Do
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Our Services
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Comprehensive cybersecurity distribution and support services
                tailored to your organization&apos;s needs.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Card className="p-6 h-full border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 bg-white">
                  <CardContent className="p-0 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Image
                          src={service.icon}
                          alt={service.title}
                          width={32}
                          height={32}
                          className="w-8 h-8"
                        />
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs text-orange-600 border-orange-600"
                      >
                        {service.highlight}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {service.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {service.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Team Members Section */}
      <motion.section
        className="py-24 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div variants={fadeInUp} className="space-y-6">
              <Badge
                variant="outline"
                className="text-orange-600 border-orange-600 px-4 py-2"
              >
                Our Team
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Meet Our Experts
              </h2>
            </motion.div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">
                Error loading team members: {error}
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                Try Again
              </Button>
            </div>
          ) : team_members.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No team members found.</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12"
              variants={staggerContainer}
            >
              {team_members.map(member => (
                <motion.div
                  key={member.id}
                  variants={fadeInUp}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="text-center space-y-6">
                    <div className="w-40 h-40 mx-auto rounded-lg overflow-hidden bg-orange-500">
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.name}
                          width={160}
                          height={160}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image
                            src="/icons/User.png"
                            alt="Default avatar"
                            width={80}
                            height={80}
                            className="opacity-80"
                          />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-s font-bold text-gray-900">
                        {member.name}
                      </h3>
                      <p className="text-gray-600 text-base">{member.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        className="py-24 bg-gradient-to-r from-orange-600 to-orange-500 text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={fadeInUp} className="space-y-8">
            <h2 className="text-4xl lg:text-6xl font-bold">
              Ready to Strengthen Your Security Posture?
            </h2>
            <p className="text-xl lg:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Partner with Netpoleon to access enterprise-grade cybersecurity
              solutions and expert implementation services tailored to your
              organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-50 text-lg px-8 py-4 font-semibold"
              >
                Schedule Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-orange-600 bg-transparent font-semibold"
              >
                View Our Solutions
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
