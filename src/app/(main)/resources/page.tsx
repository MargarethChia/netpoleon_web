'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ExternalLink, Calendar, Eye } from 'lucide-react';
import { resourcesApi, type Resource, type FeaturedResource } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { generateSlug } from '@/lib/utils';

interface ResourceType {
  id: number;
  name: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [featuredResources, setFeaturedResources] = useState<
    FeaturedResource[]
  >([]);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
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
        const [resourcesData, featuredData, typesResponse] = await Promise.all([
          resourcesApi.getAll(),
          resourcesApi.getFeatured(),
          fetch('/api/resource-type').then(res => res.json()),
        ]);

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

        setResources(sortedResources);
        setFeaturedResources(featuredData);
        setResourceTypes(typesResponse || []);
      } catch {
        setError('Failed to load resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Monitor filter changes
  useEffect(() => {
    // Filter monitoring
  }, [selectedType, searchTerm, resources.length]);

  // Get featured resource objects
  const getFeaturedResourceObjects = () => {
    return featuredResources
      .map(featured =>
        resources.find(resource => resource.id === featured.resource_id)
      )
      .filter(Boolean) as Resource[];
  };

  // Filter resources based on search and type
  const filteredResources = resources.filter(resource => {
    const matchesSearch =
      searchTerm === '' ||
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.description &&
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType =
      selectedType === 'all' || resource.type === selectedType;

    return matchesSearch && matchesType;
  });

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
      <div className="min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            className="animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h1>
          <p className="text-xl text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const featuredResourceObjects = getFeaturedResourceObjects();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        className="relative h-[300px] lg:h-[500px] overflow-hidden bg-orange-500 shadow-lg z-1 mb-16"
        style={{
          clipPath:
            'polygon(0 0, 100% 0, 100% 90%, 80% 95%, 50% 100%, 20% 95%, 0 90%)',
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInDown}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6 lg:px-8 lg:pt-12 max-w-4xl relative z-10">
            <h1 className="text-4xl lg:text-6xl mb-6 font-bold drop-shadow-lg">
              Knowledge Hub
            </h1>
            <p className="text-xl lg:text-2xl text-orange-100 max-w-3xl mx-auto font-normal drop-shadow-md">
              Discover insights, articles, and resources to help you stay ahead
              in the cyber landscape
            </p>
          </div>
        </div>
      </motion.section>

      {/* Featured Resources Section */}
      {featuredResourceObjects.length > 0 && (
        <motion.section
          className="py-8 bg-gradient-to-br"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {featuredResourceObjects.map((resource, index) => (
                <motion.article
                  key={resource.id}
                  className="bg-white rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-md hover:border-orange-300 hover:-translate-y-1 group flex flex-col lg:flex-row mb-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
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
                      className="flex flex-col lg:flex-row w-full"
                    >
                      {/* Cover Image - Left Side */}
                      <div className="relative lg:w-1/2 aspect-video overflow-hidden">
                        {resource.cover_image_url ? (
                          <Image
                            unoptimized
                            src={resource.cover_image_url}
                            alt={resource.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-orange-500 flex items-center justify-center">
                            <Image
                              unoptimized
                              src="/images/netpoleon.png"
                              alt="Netpoleon Logo"
                              width={120}
                              height={120}
                              className="object-contain opacity-80"
                            />
                          </div>
                        )}
                      </div>

                      {/* Content Details - Right Side */}
                      <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
                        <div className="flex items-center mb-4 text-sm text-gray-500">
                          <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                          <span className="uppercase">{resource.type}</span>
                        </div>

                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                          {resource.title}
                        </h3>

                        <p className="text-lg text-gray-600 mb-6 leading-relaxed flex-1">
                          {resource.description
                            ? resource.description.length > 200
                              ? `${resource.description.substring(0, 200)}...`
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
                      className="flex flex-col lg:flex-row w-full"
                    >
                      {/* Cover Image - Left Side */}
                      <div className="relative lg:w-1/2 aspect-video overflow-hidden">
                        {resource.cover_image_url ? (
                          <Image
                            unoptimized
                            src={resource.cover_image_url}
                            alt={resource.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-orange-500 flex items-center justify-center">
                            <Image
                              unoptimized
                              src="/images/netpoleon.png"
                              alt="Netpoleon Logo"
                              width={120}
                              height={120}
                              className="object-contain opacity-80"
                            />
                          </div>
                        )}
                      </div>

                      {/* Content Details - Right Side */}
                      <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
                        <div className="flex items-center mb-4 text-sm text-gray-500">
                          <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                          <span className="uppercase">{resource.type}</span>
                        </div>

                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                          {resource.title}
                        </h3>

                        <p className="text-lg text-gray-600 mb-6 leading-relaxed flex-1">
                          {resource.description
                            ? resource.description.length > 200
                              ? `${resource.description.substring(0, 200)}...`
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
            </div>
          </div>
        </motion.section>
      )}

      {/* All Resources Section */}
      <motion.section
        className="py-8 bg-white"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Type Filter */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    selectedType === 'all'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {resourceTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.name)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      selectedType === type.name
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count and Active Filters */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 mb-2">
                {filteredResources.length}{' '}
                {filteredResources.length === 1 ? 'resource' : 'resources'}{' '}
                found
                {searchTerm && ` for "${searchTerm}"`}
                {selectedType !== 'all' && ` in ${selectedType}`}
              </p>

              {/* Active Filters Display */}
              <div className="flex flex-wrap justify-center gap-2 min-h-[2rem]">
                {searchTerm && (
                  <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                    Search: &ldquo;{searchTerm}&rdquo;
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-orange-600 hover:text-orange-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedType !== 'all' && (
                  <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                    Type: {selectedType}
                    <button
                      onClick={() => setSelectedType('all')}
                      className="text-orange-600 hover:text-orange-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>

          {filteredResources.length === 0 ? (
            <motion.div className="text-center py-16" variants={fadeInDown}>
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                No resources found
              </h3>
              <p className="text-gray-600 mb-8">
                Try adjusting your search terms or filters to find what
                you&apos;re looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                }}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredResources.map((resource, index) => (
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
                            unoptimized
                            src={resource.cover_image_url}
                            alt={resource.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-orange-500 flex items-center justify-center">
                            <Image
                              unoptimized
                              src="/images/netpoleon.png"
                              alt="Netpoleon Logo"
                              width={120}
                              height={120}
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
                            unoptimized
                            src={resource.cover_image_url}
                            alt={resource.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-orange-500 flex items-center justify-center">
                            <Image
                              unoptimized
                              src="/images/netpoleon.png"
                              alt="Netpoleon Logo"
                              width={120}
                              height={120}
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
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
