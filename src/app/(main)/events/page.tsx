'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ExternalLink, Play } from 'lucide-react';
import Image from 'next/image';
import { eventsApi, type Event, type FeaturedEvent } from '@/lib/api';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<FeaturedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [eventsData, featuredData] = await Promise.all([
          eventsApi.getAll(),
          eventsApi.getFeatured(),
        ]);
        // Sort events by date (most recent first)
        const sortedEvents = eventsData.sort(
          (a, b) =>
            new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
        );
        setEvents(sortedEvents);
        setFeaturedEvents(featuredData);
      } catch (err) {
        setError('Failed to load events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Enhanced animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
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

  // Get the main featured event - with either video or image
  const getMainFeaturedEvent = () => {
    if (featuredEvents.length > 0) {
      const featured = featuredEvents[0];
      const event = events.find(e => e.id === featured.event_id);
      if (event && (event.video || event.image_url)) return event;
    }

    // No fallback - only show featured event
    return null;
  };

  const mainFeaturedEvent = getMainFeaturedEvent();

  return (
    <div className="min-h-screen">
      {/* Main Featured Event Hero Section */}
      {mainFeaturedEvent ? (
        mainFeaturedEvent.video ? (
          // Video Hero Section
          <motion.section
            className="md:mt-16 relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden shadow-lg z-1 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="relative h-full w-full">
              {/* Video Background */}
              <motion.iframe
                src={`https://www.youtube.com/embed/${mainFeaturedEvent.video!.match(/[?&]v=([^&]+)/)?.[1]}?autoplay=1&mute=1&modestbranding=1&controls=0&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&fs=0`}
                title={`${mainFeaturedEvent.title} - Featured Event Video`}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
              {/* Video Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </div>

            {/* Content Overlay */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-8 text-white"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div
                className="flex items-center gap-3 mb-4"
                variants={fadeInLeft}
              >
                <motion.div
                  className="text-sm text-blue-200 font-semibold"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {new Date(mainFeaturedEvent.event_date).toLocaleDateString(
                    'en-US',
                    {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    }
                  )}
                </motion.div>
              </motion.div>

              <motion.h1
                className="text-2xl lg:text-4xl mb-4 font-bold drop-shadow-lg"
                variants={fadeInLeft}
              >
                {mainFeaturedEvent.title}
              </motion.h1>

              {mainFeaturedEvent.description && (
                <motion.p
                  className="text-md text-blue-100 mb-6 font-normal max-w-3xl drop-shadow-md"
                  variants={fadeInLeft}
                >
                  {mainFeaturedEvent.description}
                </motion.p>
              )}

              <motion.div
                className="flex flex-wrap items-center gap-4 mb-2 md:mb-6"
                variants={fadeInLeft}
              >
                {mainFeaturedEvent.location && (
                  <motion.div
                    className="flex items-center text-blue-200"
                    whileHover={{ scale: 1.05, x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    <span className="font-medium">
                      {mainFeaturedEvent.location}
                    </span>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-4"
                variants={fadeInLeft}
              >
                {mainFeaturedEvent.link && (
                  <motion.button
                    onClick={() =>
                      mainFeaturedEvent.link &&
                      window.open(
                        mainFeaturedEvent.link,
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }
                    className="bg-white text-blue-900 px-8 py-2 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center font-bold shadow-lg"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    View Event
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </motion.section>
        ) : (
          // Image Hero Section
          <motion.section
            className="relative h-[600px] overflow-hidden shadow-lg z-1 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="relative h-full w-full">
              {/* Image Background */}
              <motion.div
                className="absolute inset-0 w-full h-full"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              >
                <Image
                  src={mainFeaturedEvent.image_url!}
                  alt={mainFeaturedEvent.title}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
              {/* Image Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </div>

            {/* Content Overlay */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-8 text-white"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div
                className="flex items-center gap-3 mb-4"
                variants={fadeInLeft}
              >
                <motion.div
                  className="text-sm text-blue-200 font-semibold"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {new Date(mainFeaturedEvent.event_date).toLocaleDateString(
                    'en-US',
                    {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    }
                  )}
                </motion.div>
              </motion.div>

              <motion.h1
                className="text-2xl lg:text-4xl mb-4 font-bold drop-shadow-lg"
                variants={fadeInLeft}
              >
                {mainFeaturedEvent.title}
              </motion.h1>

              {mainFeaturedEvent.description && (
                <motion.p
                  className="text-xl text-blue-100 mb-6 font-normal max-w-3xl drop-shadow-md"
                  variants={fadeInLeft}
                >
                  {mainFeaturedEvent.description}
                </motion.p>
              )}

              <motion.div
                className="flex flex-wrap items-center gap-4 mb-6"
                variants={fadeInLeft}
              >
                {mainFeaturedEvent.location && (
                  <motion.div
                    className="flex items-center text-blue-200"
                    whileHover={{ scale: 1.05, x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    <span className="font-medium">
                      {mainFeaturedEvent.location}
                    </span>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-4"
                variants={fadeInLeft}
              >
                {mainFeaturedEvent.link && (
                  <motion.button
                    onClick={() =>
                      mainFeaturedEvent.link &&
                      window.open(
                        mainFeaturedEvent.link,
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }
                    className="bg-white text-blue-900 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center font-bold shadow-lg"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    View Event Details
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </motion.section>
        )
      ) : (
        // Show featured event information even without video
        <motion.section
          className="relative h-[500px] overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg z-1 mb-16"
          style={{
            clipPath:
              'polygon(0 0, 100% 0, 100% 90%, 80% 95%, 50% 100%, 20% 95%, 0 90%)',
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={scaleIn}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Animated Circular overlays at bottom */}
          <motion.div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full transform translate-x-1/2 translate-y-1/2 blur-sm"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          ></motion.div>
          <motion.div
            className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/15 rounded-full transform translate-x-1/3 translate-y-1/3 blur-md"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          ></motion.div>
          <motion.div
            className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full transform translate-x-1/4 translate-y-1/4 blur-lg"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
          ></motion.div>

          {/* Featured Event Information Overlay */}
          {featuredEvents.length > 0 &&
            (() => {
              const featured = featuredEvents[0];
              const event = events.find(e => e.id === featured.event_id);
              if (!event) return null;

              return (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div className="text-center text-white px-6 lg:px-8 max-w-4xl relative z-1">
                    <motion.div
                      className="flex items-center justify-center gap-3 mb-6"
                      variants={fadeInUp}
                    >
                      <motion.span
                        className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        ⭐ Featured Event
                      </motion.span>
                      <motion.div
                        className="text-sm text-blue-200 font-semibold"
                        variants={fadeInUp}
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
                      </motion.div>
                    </motion.div>

                    <motion.h1
                      className="text-4xl lg:text-6xl mb-6 font-bold drop-shadow-lg"
                      variants={fadeInUp}
                    >
                      {event.title}
                    </motion.h1>

                    {event.description && (
                      <motion.p
                        className="text-xl text-blue-100 mb-6 font-normal max-w-3xl mx-auto drop-shadow-md"
                        variants={fadeInUp}
                      >
                        {event.description}
                      </motion.p>
                    )}

                    <motion.div
                      className="flex flex-wrap items-center justify-center gap-4 mb-6"
                      variants={fadeInUp}
                    >
                      {event.location && (
                        <motion.div
                          className="flex items-center text-blue-200"
                          whileHover={{ scale: 1.05, x: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <MapPin className="w-5 h-5 mr-2" />
                          <span className="font-medium">{event.location}</span>
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.div
                      className="flex flex-wrap gap-4 justify-center"
                      variants={fadeInUp}
                    >
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
                          className="bg-white text-blue-900 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center font-bold shadow-lg"
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <ExternalLink className="w-5 h-5 mr-2" />
                          View Event Details
                        </motion.button>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })()}

          {/* Fallback if no featured event at all */}
          {featuredEvents.length === 0 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="text-center text-white px-6 lg:px-8 max-w-4xl relative z-10">
                <motion.h1
                  className="text-4xl lg:text-6xl mb-6 font-bold drop-shadow-lg"
                  variants={fadeInUp}
                >
                  Cybersecurity Events
                </motion.h1>
                <motion.p
                  className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto font-normal drop-shadow-md"
                  variants={fadeInUp}
                >
                  Join us at industry-leading cybersecurity events, workshops,
                  and conferences. Network with experts and stay ahead of
                  emerging threats.
                </motion.p>
              </div>
            </motion.div>
          )}
        </motion.section>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Remove the separate featured events section since we only have one featured event */}
        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <motion.section
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-3xl font-bold text-gray-900 mb-20 text-center"
              variants={fadeInUp}
            >
              Upcoming Events
            </motion.h2>
            <motion.div
              className="grid lg:grid-cols-3 gap-8"
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
                  <div className="bg-white rounded-xl shadow-lg border-0 overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col group">
                    {/* Event Image */}
                    {event.image_url && (
                      <motion.div
                        className="relative h-48 w-full overflow-hidden"
                        initial={{ opacity: 0, scale: 1.1 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                      >
                        <Image
                          src={event.image_url}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </motion.div>
                    )}

                    {/* Clean Header */}
                    <motion.div
                      className={`${event.image_url ? 'bg-white text-gray-900' : 'bg-gradient-to-r from-orange-500 to-amber-600 text-white'} p-4`}
                      whileHover={{
                        background: event.image_url
                          ? 'linear-gradient(90deg, #f9fafb, #f3f4f6)'
                          : 'linear-gradient(90deg, #f97316, #ea580c)',
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <motion.span
                          className={`text-xs font-medium ${event.image_url ? 'text-gray-500' : 'text-orange-100'}`}
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          {new Date(event.event_date).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )}
                        </motion.span>
                      </div>
                      <h3
                        className={`text-lg font-bold leading-tight line-clamp-2 ${event.image_url ? 'text-gray-900' : 'text-white'}`}
                      >
                        {event.title}
                      </h3>
                    </motion.div>

                    {/* Clean Body */}
                    <div className="p-4 flex-1 flex flex-col">
                      {event.description && (
                        <motion.p
                          className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 flex-1"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {event.description}
                        </motion.p>
                      )}

                      {/* Simple Location */}
                      {event.location && (
                        <motion.div
                          className="flex items-center text-gray-500 mb-4 text-sm"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                          <span>{event.location}</span>
                        </motion.div>
                      )}

                      {/* Clean Buttons */}
                      <div className="flex gap-2 mt-auto">
                        {event.video && (
                          <motion.button
                            onClick={() =>
                              event.video &&
                              window.open(
                                event.video,
                                '_blank',
                                'noopener,noreferrer'
                              )
                            }
                            className="bg-orange-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors inline-flex items-center font-medium flex-1 justify-center"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Watch
                          </motion.button>
                        )}
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
                            className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors inline-flex items-center font-medium flex-1 justify-center"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Details
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
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
