'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import {
  eventsApi,
  featuredVideoApi,
  type Event,
  type FeaturedEvent,
  type FeaturedEventVideo,
} from '@/lib/api';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<FeaturedEvent[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<FeaturedEventVideo | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [eventsData, featuredData, videoData] = await Promise.all([
          eventsApi.getAll(),
          eventsApi.getFeatured(),
          featuredVideoApi.get(),
        ]);
        // Sort events by date (most recent first)
        const sortedEvents = eventsData.sort(
          (a, b) =>
            new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
        );
        setEvents(sortedEvents);
        setFeaturedEvents(featuredData);
        setFeaturedVideo(videoData);
      } catch {
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
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
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { type: 'spring' as const, stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.95 },
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
            <motion.div
              className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-6"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.98, 1, 0.98],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            ></motion.div>
            <motion.div
              className="h-6 bg-gray-200 rounded w-1/2 mx-auto"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.98, 1, 0.98],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            ></motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            className="bg-red-50 border border-red-200 rounded-lg p-8"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              type: 'spring',
              stiffness: 100,
            }}
          >
            <motion.h2
              className="text-2xl text-red-800 mb-4 font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Error Loading Events
            </motion.h2>
            <motion.p
              className="text-red-600 font-normal"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {error}
            </motion.p>
            <motion.button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-bold"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = events.filter(event => {
    const isUpcoming = new Date(event.event_date) >= now;
    const isFeatured = featuredEvents.some(f => f.event_id === event.id);
    return isUpcoming && !isFeatured; // Show upcoming events but exclude featured ones
  });

  // Get all featured events with their data
  const getFeaturedEventsWithData = () => {
    return featuredEvents
      .map(featured => {
        const event = events.find(e => e.id === featured.event_id);
        return event ? { ...featured, event } : null;
      })
      .filter(Boolean)
      .sort((a, b) => (a?.display_order || 0) - (b?.display_order || 0));
  };

  const featuredEventsWithData = getFeaturedEventsWithData();

  // Navigation functions for featured events slideshow
  const nextFeatured = () => {
    setCurrentFeaturedIndex(prev =>
      prev === featuredEventsWithData.length - 1 ? 0 : prev + 1
    );
  };

  const prevFeatured = () => {
    setCurrentFeaturedIndex(prev =>
      prev === 0 ? featuredEventsWithData.length - 1 : prev - 1
    );
  };

  const extractVideoId = (url: string) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getEmbedUrl = (url: string) => {
    const videoId = extractVideoId(url);
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&loop=1&playlist=${videoId}`
      : null;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-20">
        {/* Featured Video Section */}
        {featuredVideo && (
          <motion.section
            className="relative overflow-hidden mb-20 mx-0 lg:mx-[5%] lg:mt-6 border border-gray-300 rounded-lg"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="relative w-full aspect-video">
              <motion.iframe
                src={getEmbedUrl(featuredVideo.video_url) || ''}
                title="Featured Event Video"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
          </motion.section>
        )}
        {/* Upcoming Events Section */}
        {upcomingEvents.length > 0 && (
          <motion.section
            className="mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-3xl font-bold text-gray-900 mb-12 text-center"
              variants={fadeInUp}
            >
              Upcoming Events
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-0"
              variants={staggerContainer}
            >
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.6,
                  }}
                  className="w-full h-full"
                >
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                    {/* Event Title */}
                    <motion.div
                      className="bg-orange-500 text-white px-4 py-6 mb-4 font-bold text-lg text-center"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="line-clamp-2">{event.title}</div>
                    </motion.div>

                    {/* Date and Location */}
                    <div className="flex-1 flex flex-col justify-center mt-4 mb-8 px-6">
                      <motion.div
                        className="flex items-center text-gray-500 mb-3 text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Calendar className="w-4 h-4 mr-2 text-black" />
                        <span>
                          {new Date(event.event_date).toLocaleDateString(
                            'en-US',
                            {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )}
                        </span>
                      </motion.div>

                      {event.location && (
                        <motion.div
                          className="flex items-center text-gray-500 text-sm"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <MapPin className="w-4 h-4 mr-2 text-black" />
                          <span>{event.location}</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Register Button */}
                    {event.link && (
                      <motion.button
                        onClick={() =>
                          event.link &&
                          window.open(
                            event.link,
                            '_blank',
                            'noopener,noreferrer'
                          )
                        }
                        className="bg-orange-500 text-white py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors inline-flex items-center font-medium justify-center mx-16 mb-6"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Register
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* Event Highlights Section - Slideshow */}
        {featuredEventsWithData.length > 0 && (
          <motion.section
            className="mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-3xl font-bold text-gray-900 mb-12 text-center"
              variants={fadeInUp}
            >
              Event Highlights
            </motion.h2>

            <div className="relative flex items-center justify-center px-4 md:px-0">
              {/* Featured Event Slideshow Card */}
              <motion.div
                key={currentFeaturedIndex}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-4xl w-full"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                {(() => {
                  const featured = featuredEventsWithData[currentFeaturedIndex];
                  if (!featured?.event) return null;
                  const event = featured.event;

                  return (
                    <div className="flex flex-col">
                      {/* Event Image */}
                      <div className="w-full aspect-video relative">
                        {event.image_url ? (
                          <Image
                            unoptimized
                            src={event.image_url}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                              <p className="text-lg font-medium opacity-75">
                                Event Image
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Event Name and Date Below Image - Mobile Only */}
                      <div className="md:hidden bg-white p-4">
                        <div className="flex flex-col gap-2">
                          <motion.div
                            className="text-lg font-bold leading-tight text-black"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            {event.title}
                          </motion.div>
                          <motion.span
                            className="text-sm font-medium text-gray-600"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            {new Date(event.event_date).toLocaleDateString(
                              'en-US',
                              {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </motion.span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>

              {/* Navigation Arrows - Desktop only (on sides) */}
              {featuredEventsWithData.length > 1 && (
                <>
                  <motion.button
                    onClick={prevFeatured}
                    className="hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors z-10"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </motion.button>
                  <motion.button
                    onClick={nextFeatured}
                    className="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors z-10"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.button>
                </>
              )}

              {/* Dots Indicator - Desktop: overlay on image, Mobile: below card */}
              {featuredEventsWithData.length > 1 && (
                <div className="hidden md:flex absolute bottom-6 left-0 right-0 justify-center gap-2 z-10">
                  {featuredEventsWithData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeaturedIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentFeaturedIndex
                          ? 'bg-orange-500'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Navigation - Below card */}
            {featuredEventsWithData.length > 1 && (
              <div className="md:hidden flex items-center justify-center gap-4 mt-4">
                <motion.button
                  onClick={prevFeatured}
                  className="bg-orange-500 text-white p-2 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>

                <div className="flex justify-center gap-2">
                  {featuredEventsWithData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeaturedIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentFeaturedIndex
                          ? 'bg-orange-500'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>

                <motion.button
                  onClick={nextFeatured}
                  className="bg-orange-500 text-white p-2 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            )}
          </motion.section>
        )}

        {/* No Events Message */}
        {events.length === 0 && (
          <motion.section
            className="text-center py-16 mb-16"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              type: 'spring',
              stiffness: 100,
            }}
          >
            <motion.div
              className="bg-gray-50 rounded-lg p-8"
              whileHover={{
                y: -5,
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              </motion.div>
              <motion.h3
                className="text-xl text-gray-600 mb-4 font-bold"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                No Events Available
              </motion.h3>
              <motion.p
                className="text-gray-500 font-normal"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                We&apos;re currently planning our next cybersecurity events.
                Check back soon for updates!
              </motion.p>
            </motion.div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
