'use client';

import { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import VendorCarousel from '../components/VendorCarousel';
import LatestResources from '../components/LatestResources';
import GraphSection from '../components/GraphSection';
import Statistics from '../components/Statistics';
import { slideGalleryApi } from '@/lib/api';

interface Slide {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  button_link: string | null;
  is_active: boolean;
  display_order: number;
}

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await slideGalleryApi.getAll();
        // Filter only active slides and sort by display_order
        const activeSlides = data
          .filter(slide => slide.is_active)
          .sort((a, b) => a.display_order - b.display_order);
        setSlides(activeSlides);
      } catch (error) {
        console.error('Error fetching slides:', error);
        // Fallback to default slide if API fails
        setSlides([
          {
            id: 0,
            title: "MAKING CYBER\nEVERYONE'S BUSINESS",
            subtitle:
              'Leading the way into the next generation of cyber security solutions',
            description: null,
            button_text: 'Learn More',
            button_link: null,
            is_active: true,
            display_order: 1,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div>
      <HeroSection slides={slides} />
      <VendorCarousel title="Trusted by 10,000+ customers, from startup to enterprise " />
      <GraphSection />
      <Statistics />

      {/*
      {imageTextSections.map((section, idx) => (
        <ImageTextSection key={idx} {...section} />
      ))}
      */}

      <LatestResources />
    </div>
  );
}
