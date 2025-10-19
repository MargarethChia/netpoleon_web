'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timeline } from '@/components/ui/timeline';
import Image from 'next/image';
import Link from 'next/link';
import { TeamMember } from '@/lib/supabase';

export default function AboutUs() {
  const timelineData = [
    {
      title: '2019',
      content: (
        <div>
          <p className="mb-4 text-md font-normal text-gray-800 dark:text-neutral-200">
            Entry into Australia - In late 2019, Netpoleon Solutions expanded
            beyond Asia, establishing its first branch in Australia to serve the
            Pacific region.
          </p>
        </div>
      ),
    },
    {
      title: '2021',
      content: (
        <div>
          <p className="mb-4 text-md font-normal text-gray-800 dark:text-neutral-200">
            Expansion into New Zealand - Following its success in Australia,
            Netpoleon opened its second Pacific branch in New Zealand in 2021,
            formally launching Netpoleon ANZ.
          </p>
          <div className="mb-8">
            <div className="flex items-center gap-2 text-md text-gray-700 mb-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              New Zealand branch established
            </div>
            <div className="flex items-center gap-2 text-md text-gray-700 mb-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Netpoleon ANZ formally launched
            </div>
            <div className="flex items-center gap-2 text-md text-gray-700 mb-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Pacific region coverage completed
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
              <h4 className="font-semibold mb-2">Key Milestone</h4>
              <p className="text-md opacity-90">
                Successfully established presence across both Australia and New
                Zealand markets
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
          <p className="mb-8 text-md font-normal text-gray-800 dark:text-neutral-200">
            Foundation for Growth - Across 2022 and 2023, Netpoleon ANZ
            strengthened its vendor portfolio, invested in technical expertise,
            and built a strong foundation for continued regional growth.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-lg border border-orange-100">
              <div className="flex items-center mb-4">
                <Image
                  src="/icons/Marketing & Business Development Support.png"
                  alt="Vendor Portfolio"
                  width={24}
                  height={24}
                  className="mr-3"
                />
                <span className="font-semibold text-gray-900">
                  Vendor Portfolio
                </span>
              </div>
              <p className="text-md text-gray-700">
                Strengthened partnerships and expanded vendor network
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-lg border border-orange-100">
              <div className="flex items-center mb-4">
                <Image
                  src="/icons/Technology & Product Training.png"
                  alt="Technical Expertise"
                  width={24}
                  height={24}
                  className="mr-3"
                />
                <span className="font-semibold text-gray-900">
                  Technical Expertise
                </span>
              </div>
              <p className="text-md text-gray-700">
                Invested in team capabilities and knowledge
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
          <p className="mb-8 text-md font-normal text-gray-800 dark:text-neutral-200">
            Introduction of Professional Services - In 2024, Netpoleon ANZ
            expanded its role as a value-added distributor with the launch of
            its comprehensive service suite: N.XONE, N.Able, N.Sure, and
            N.Circle. These services enhanced its capabilities to support
            partners across lead generation, enablement, deployment, and ongoing
            support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-lg border border-orange-100">
              <div className="flex items-center mb-4">
                <Image
                  src="/icons/Marketing & Business Development Support.png"
                  alt="N.XONE"
                  width={24}
                  height={24}
                  className="mr-3"
                />
                <span className="font-semibold text-gray-900">
                  N.XONE - Lead Generation
                </span>
              </div>
              <p className="text-md text-gray-700">
                SDR as a Service, executive roundtables, and demand generation
                campaigns to accelerate pipeline growth
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-100">
              <div className="flex items-center mb-4">
                <Image
                  src="/icons/Technology & Product Training.png"
                  alt="N.Able"
                  width={24}
                  height={24}
                  className="mr-3"
                />
                <span className="font-semibold text-gray-900">
                  N.Able - Technology Enablement
                </span>
              </div>
              <p className="text-md text-gray-700">
                Educational sessions, workshops, and technology enablement
                services to maximize partner potential
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg border border-green-100">
              <div className="flex items-center mb-4">
                <Image
                  src="/icons/Post Sales & Customer Support Services.png"
                  alt="N.Sure"
                  width={24}
                  height={24}
                  className="mr-3"
                />
                <span className="font-semibold text-gray-900">
                  N.Sure - Professional Services
                </span>
              </div>
              <p className="text-md text-gray-700">
                Certified delivery engineers and consultants for cybersecurity
                deployments
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg border border-purple-100">
              <div className="flex items-center mb-4">
                <Image
                  src="/icons/Lock.png"
                  alt="N.Circle"
                  width={24}
                  height={24}
                  className="mr-3"
                />
                <span className="font-semibold text-gray-900">
                  N.Circle - Support Services
                </span>
              </div>
              <p className="text-md text-gray-700">
                First-line support and customer success management for
                technology investments
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '2025',
      content: (
        <div>
          <p className="mb-8 text-md font-normal text-gray-800 dark:text-neutral-200">
            Five-Year Milestone - In 2025, Netpoleon ANZ marks five years of
            operations. From its initial startup presence, the business has
            grown into a team of 32 professionals, led by 7 team leaders, and
            now partners with more than five times the number of vendors since
            its inception.
          </p>
        </div>
      ),
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
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.08 },
    },
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
      {/* Hero Section */}
      <section className="pt-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Orange Badge */}
            <div className="inline-block">
              <div className="border border-orange-600 text-orange-600 px-6 py-3 rounded-lg text-sm font-medium">
                Trusted Cybersecurity Partner Since 2019
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl font-bold lg:text-6xl text-gray-900">
              Netpoleon ANZ
            </h1>

            {/* Tagline */}
            <p className="text-lg lg:text-xl text-gray-700 max-w-4xl mx-auto">
              ANZ Trusted Partner for Next Generation Cyber Security Solutions
              and Value-Added Services
            </p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - About Us Text */}
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl lg:text-5xl text-orange-600 mb-6">
                About us
              </h2>
              <p className="text-base text-gray-700 leading-relaxed">
                Originally founded in 2000, Netpoleon Group has become a leading
                provider of integrated security, networking solutions and
                value-added services throughout the APAC region. And, thanks to
                our equity partnership with Macnica, a leading value-added
                distributor of Network Security solutions to the worldwide
                market, Netpoleon has been elevated to the global arena and can
                now engage global clients in the market. Amid all our success
                Netpoleon ANZ was established covering bases in both Australia
                and New Zealand.
              </p>
            </div>

            {/* Right Column - Team Photo */}
            <div className="flex justify-center order-1 lg:order-2">
              <div className="w-full h-96 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/netpoleon-about-us.png"
                  alt="Netpoleon ANZ Team at Sydney Motor Sport Park"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="md:pt-12 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Vision Section */}
            <div>
              <h3 className="text-2xl font-bold text-orange-600 mb-6">
                Our Vision
              </h3>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  To be the regional leader in sourcing and distributing
                  world-class IT Security solutions as we create winning
                  partnerships with our employees and customers.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We aim to be an employer of choice as we grow with our people
                  and to align with our clients to meet their varying technology
                  demands.
                </p>
              </div>
            </div>

            {/* Mission Section */}
            <div>
              <h3 className="text-2xl font-bold text-orange-600 mb-6">
                Our Mission
              </h3>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  To be the leading ANZ distributor and lead the sourcing of
                  emerging technologies and to provide in-depth product
                  knowledge, technical expertise and excellent customer service
                  to our channel partners to address current and new business
                  opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section with Timeline */}
      <section className="bg-gray-50">
        <div className="relative w-full overflow-clip">
          <Timeline data={timelineData} />
        </div>
      </section>

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
        className="py-24 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 text-white relative overflow-hidden"
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
            <h2 className="text-2xl lg:text-4xl font-bold">
              Ready to Strengthen Your Security Posture?
            </h2>
            <p className="text-lg lg:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Partner with Netpoleon to access enterprise-grade cybersecurity
              solutions and expert implementation services tailored to your
              organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
              <Button
                size="lg"
                className="text-lg px-10 py-6 bg-white text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl border-2 border-white/20"
                asChild
              >
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
              <Button
                size="lg"
                className="text-lg px-10 py-6 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl"
                asChild
              >
                <Link href="/services">View Our Solutions</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
