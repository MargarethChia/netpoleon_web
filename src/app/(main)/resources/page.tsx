'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ExternalLink, Calendar, Eye } from 'lucide-react';
import { resourcesApi, type Resource, type FeaturedResource } from '@/lib/api';
import Image from 'next/image';

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [featuredResources, setFeaturedResources] = useState<
    FeaturedResource[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'article' | 'blog'>(
    'all'
  );

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [resourcesData, featuredData] = await Promise.all([
          resourcesApi.getAll(),
          resourcesApi.getFeatured(),
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
      } catch (err) {
        setError('Failed to load resources');
        console.error('Error fetching resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Monitor filter changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Filter changed:', {
        selectedType,
        searchTerm,
        totalResources: resources.length,
      });
    }
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

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `Resource: ${resource.title}, Type: ${resource.type}, Selected: ${selectedType}, Matches: ${matchesType}`
      );
    }

    return matchesSearch && matchesType;
  });

  // Animation variants
  const fadeInDown = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading resources...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Hero Section */}
      <motion.section
        className="relative h-[500px] overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600 shadow-lg z-50 mb-16"
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
        {/* Circular overlays at bottom */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full transform translate-x-1/2 translate-y-1/2 blur-sm"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/15 rounded-full transform translate-x-1/3 translate-y-1/3 blur-md"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full transform translate-x-1/4 translate-y-1/4 blur-lg"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6 lg:px-8 max-w-4xl relative z-10">
            <h1 className="text-4xl lg:text-6xl mb-6 font-bold drop-shadow-lg">
              Knowledge Hub
            </h1>
            <p className="text-xl lg:text-2xl text-orange-100 max-w-3xl mx-auto font-normal drop-shadow-md">
              Discover insights, articles, and resources to help you stay ahead
              in cybersecurity
            </p>

            {/* Search and Filter */}
            <motion.div
              className="max-w-4xl mx-auto mt-8"
              variants={fadeInDown}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex flex-col md:flex-row gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>

                {/* Type Filter */}
                <div className="flex gap-2">
                  {['all', 'article', 'blog'].map(type => (
                    <button
                      key={type}
                      onClick={() =>
                        setSelectedType(type as 'all' | 'article' | 'blog')
                      }
                      className={`px-6 py-3 rounded-xl font-medium transition-all ${
                        selectedType === type
                          ? 'bg-white text-orange-600 shadow-lg'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Resources Section */}
      {featuredResourceObjects.length > 0 && (
        <motion.section
          className="py-20 bg-gradient-to-br"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {featuredResourceObjects.map(resource => (
                <motion.div
                  key={resource.id}
                  variants={cardVariants}
                  className="group relative"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Cover Image - Left Side */}
                    {resource.cover_image_url && (
                      <div className="relative lg:w-1/2 h-64 lg:h-80 overflow-hidden rounded-2xl">
                        <Image
                          src={resource.cover_image_url}
                          alt={resource.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Content Details - Right Side */}
                    <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col justify-center">
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                        {resource.title}
                      </h3>

                      <p className="text-lg text-gray-600 mb-6 leading-relaxed line-clamp-3">
                        {resource.description
                          ? resource.description.length > 150
                            ? `${resource.description.substring(0, 150)}...`
                            : resource.description
                          : 'No description available for this resource.'}
                      </p>

                      <div className="flex items-center justify-between text-base text-gray-500 mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          {resource.published_at
                            ? new Date(
                                resource.published_at
                              ).toLocaleDateString()
                            : 'No date'}
                        </div>
                      </div>

                      {resource.type === 'article' && resource.article_link ? (
                        <a
                          href={resource.article_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium text-base w-fit"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Read Article
                        </a>
                      ) : (
                        <button className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium text-base">
                          <Eye className="h-4 w-4" />
                          Read More
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* All Resources Section */}
      <motion.section
        key={`resources-${selectedType}-${searchTerm}`}
        className="py-20 bg-white"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={fadeInDown}>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              All Resources
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {filteredResources.length}{' '}
              {filteredResources.length === 1 ? 'resource' : 'resources'} found
              {searchTerm && ` for "${searchTerm}"`}
              {selectedType !== 'all' && ` in ${selectedType}s`}
            </p>

            {/* Active Filters Display */}
            {(searchTerm || selectedType !== 'all') && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
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
                  <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    Type: {selectedType}
                    <button
                      onClick={() => setSelectedType('all')}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </motion.div>

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
              {filteredResources.map(resource => (
                <motion.div
                  key={resource.id}
                  variants={cardVariants}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200 h-96 flex flex-col">
                    {resource.cover_image_url && (
                      <div className="relative h-40 overflow-hidden flex-shrink-0">
                        <Image
                          src={resource.cover_image_url}
                          alt={resource.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              resource.type === 'article'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {resource.type}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-5 flex flex-col h-full">
                      <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2 min-h-[2.5rem]">
                        {resource.title}
                      </h3>

                      <p className="text-gray-600 mb-3 text-sm line-clamp-3 flex-grow min-h-[3.75rem]">
                        {resource.description
                          ? resource.description.length > 100
                            ? `${resource.description.substring(0, 100)}...`
                            : resource.description
                          : 'No description available for this resource.'}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4 mt-auto">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {resource.published_at
                            ? new Date(
                                resource.published_at
                              ).toLocaleDateString()
                            : 'No date'}
                        </div>
                      </div>

                      {resource.type === 'article' && resource.article_link ? (
                        <a
                          href={resource.article_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium self-start mt-auto"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Read Article
                        </a>
                      ) : (
                        <button className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium self-start mt-auto">
                          <Eye className="h-3 w-3" />
                          Read More
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
