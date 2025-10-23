import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_ANON_KEY!;

// Create admin client with service role key for full database access
// This is now only used by API routes for server-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database types based on your schema
export interface Event {
  id: number;
  title: string;
  event_date: string;
  location: string | null;
  description: string | null;
  link: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface FeaturedEventVideo {
  id: number;
  video_url: string;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: number;
  title: string;
  description: string | null;
  content: string;
  type: 'article' | 'blog' | 'news';
  published_at: string | null;
  is_published: boolean;
  cover_image_url: string | null;
  article_link: string | null;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: number;
  name: string;
  logo_url: string | null;
  description: string | null;
  image_url: string | null;
  link: string | null;
  content: string | null;
  type: string | null;
  diagram_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface FeaturedResource {
  id: number;
  resource_id: number;
  featured_at: string;
}

export interface FeaturedEvent {
  id: number;
  event_id: number;
  featured_at: string;
  display_order: number;
  events?: Event;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  photo: string | null;
  secondary_photo: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementBar {
  id: number;
  text: string;
  is_active: boolean;
  link: string | null;
  link_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface SlideGallery {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  button_link: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Note: Database operations are now handled by API routes in /app/api/
// This file only contains the Supabase client and type definitions
