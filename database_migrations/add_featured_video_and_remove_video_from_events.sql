-- Database Migration: Remove video from events and create featured_event_video table
-- Run these commands in your Supabase SQL Editor

-- 1. Remove video column from events table (if it exists)
ALTER TABLE public.events DROP COLUMN IF EXISTS video;

-- 2. Add image_url column to events table (if it doesn't exist)
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url text;

-- 3. Create featured_event_video table
CREATE TABLE IF NOT EXISTS public.featured_event_video (
  id SERIAL PRIMARY KEY,
  video_url text NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);


-- 4. Create featured_event table (if it doesn't exist) - Updated to allow multiple featured events
CREATE TABLE IF NOT EXISTS public.featured_event (
  id SERIAL PRIMARY KEY,
  event_id integer NOT NULL,
  featured_at timestamp without time zone DEFAULT now(),
  display_order integer DEFAULT 0,
  CONSTRAINT featured_event_pkey PRIMARY KEY (id),
  CONSTRAINT featured_event_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE
);

-- 5. Add unique constraint to ensure only one featured event video at a time
-- This will be enforced by application logic (delete existing before inserting new)
-- But we can add a check constraint to ensure video_url is not empty
ALTER TABLE public.featured_event_video ADD CONSTRAINT check_video_url_not_empty CHECK (video_url IS NOT NULL AND length(trim(video_url)) > 0);

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_featured_event_video_created_at ON public.featured_event_video(created_at);
CREATE INDEX IF NOT EXISTS idx_featured_event_event_id ON public.featured_event(event_id);
CREATE INDEX IF NOT EXISTS idx_featured_event_featured_at ON public.featured_event(featured_at);

-- 7. Add RLS policies (if using Row Level Security)
-- Uncomment these if you have RLS enabled on your tables

-- ALTER TABLE public.featured_event_video ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read access for featured event video" ON public.featured_event_video FOR SELECT USING (true);
-- CREATE POLICY "Admin write access for featured event video" ON public.featured_event_video FOR ALL USING (auth.role() = 'authenticated');

-- ALTER TABLE public.featured_event ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read access for featured event" ON public.featured_event FOR SELECT USING (true);
-- CREATE POLICY "Admin write access for featured event" ON public.featured_event FOR ALL USING (auth.role() = 'authenticated');
