'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink, Eye } from 'lucide-react';
import { resourcesApi, type Resource } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { generateSlug } from '@/lib/utils';

interface LatestResourcesProps {
  title?: string;
  subtitle?: string;
  limit?: number;
}

export default function LatestResources({
  title = 'Latest News & Insights',
  subtitle = 'Stay updated with the latest trends and insights from our team.',
  limit = 4,
}: LatestResourcesProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingLinks, setLoadingLinks] = useState<Set<number>>(new Set());

  const handleLinkClick = (resourceId: number) => {
    setLoadingLinks(prev => new Set(prev).add(resourceId));
  };

  const handleLinkLoad = (resourceId: number) => {
    setLoadingLinks(prev => {
      const newSet = new Set(prev);
      newSet.delete(resourceId);
      return newSet;
    });
  };

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const resourcesData = await resourcesApi.getAll();

        // Filter out resources that are not published
        const publishedResources = resourcesData.filter(
          resource => resource.is_published
        );

        // Sort resources by published date (most recent first)
        const sortedResources = publishedResources.sort((a, b) => {
          if (!a.published_at) return 1;
          if (!b.published_at) return -1;
          return (
            new Date(b.published_at).getTime() -
            new Date(a.published_at).getTime()
          );
        });

        // Take only the latest resources up to the limit
        setResources(sortedResources.slice(0, limit));
      } catch {
        setError('Failed to load resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [limit]);

  // Animation variants
  const fadeInDown = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut' as const,
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  if (loading) {
    return (
      <section className="py-16 lg:min-h-screen lg:flex lg:items-center bg-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: limit }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden border border-gray-200"
              >
                <div className="aspect-video bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 lg:min-h-screen lg:flex lg:items-center bg-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              {subtitle}
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:min-h-screen lg:flex lg:items-center bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          </div>
        </motion.div>

        {resources.length === 0 ? (
          <motion.div className="text-center py-16" variants={fadeInDown}>
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-12 w-12 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              No resources available
            </h3>
            <p className="text-gray-600 mb-8">
              Check back later for the latest news and resources.
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {resources.map((resource, index) => (
              <motion.article
                key={resource.id}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-md hover:border-orange-300 hover:-translate-y-1 group flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: 'easeOut',
                }}
                viewport={{ once: true }}
              >
                {resource.article_link ? (
                  <a
                    href={resource.article_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick(resource.id)}
                    onLoad={() => handleLinkLoad(resource.id)}
                    className="flex flex-col h-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden">
                      {resource.cover_image_url ? (
                        <Image
                          src={resource.cover_image_url}
                          alt={resource.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-orange-600 to-amber-600 flex items-center justify-center">
                          <Image
                            src="/images/netpoleon.png"
                            alt="Netpoleon Logo"
                            width={120}
                            height={120}
                            unoptimized
                            className="object-contain opacity-80"
                          />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center mb-4 text-sm text-gray-500">
                        <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                        <span className="uppercase">{resource.type}</span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                        {resource.title}
                      </h3>

                      <p className="text-gray-600 mb-6 flex-1">
                        {resource.description
                          ? resource.description.length > 120
                            ? `${resource.description.substring(0, 120)}...`
                            : resource.description
                          : 'No description available for this resource.'}
                      </p>

                      <div className="mt-auto">
                        <span
                          className={`inline-flex items-center font-bold transition-colors duration-300 ${
                            loadingLinks.has(resource.id)
                              ? 'text-orange-400 cursor-wait'
                              : 'text-orange-500 hover:text-orange-600'
                          }`}
                        >
                          <span>
                            {loadingLinks.has(resource.id)
                              ? 'Loading...'
                              : 'Read Full Content'}
                          </span>
                          {loadingLinks.has(resource.id) ? (
                            <div className="ml-2 w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <ExternalLink className="ml-2 w-4 h-4" />
                          )}
                        </span>
                      </div>
                    </div>
                  </a>
                ) : (
                  <Link
                    href={`/blog/${generateSlug(resource.title)}`}
                    onClick={() => handleLinkClick(resource.id)}
                    className="flex flex-col h-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden">
                      {resource.cover_image_url ? (
                        <Image
                          src={resource.cover_image_url}
                          alt={resource.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-orange-600 to-amber-600 flex items-center justify-center">
                          <Image
                            src="/images/netpoleon.png"
                            alt="Netpoleon Logo"
                            width={120}
                            height={120}
                            unoptimized
                            className="object-contain opacity-80"
                          />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center mb-4 text-sm text-gray-500">
                        <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                        <span className="uppercase">{resource.type}</span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                        {resource.title}
                      </h3>

                      <p className="text-gray-600 mb-6 flex-1">
                        {resource.description
                          ? resource.description.length > 120
                            ? `${resource.description.substring(0, 120)}...`
                            : resource.description
                          : 'No description available for this resource.'}
                      </p>

                      <div className="mt-auto">
                        <span
                          className={`inline-flex items-center font-bold transition-colors duration-300 ${
                            loadingLinks.has(resource.id)
                              ? 'text-orange-400 cursor-wait'
                              : 'text-orange-500 hover:text-orange-600'
                          }`}
                        >
                          <span>
                            {loadingLinks.has(resource.id)
                              ? 'Loading Content...'
                              : 'Read More'}
                          </span>
                          {loadingLinks.has(resource.id) ? (
                            <div className="ml-2 w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Eye className="ml-2 w-4 h-4" />
                          )}
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
