-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.events (
id SERIAL PRIMARY KEY,
title text NOT NULL,
event_date date NOT NULL,
location text,
description text,
link text,
image_url text,
created_at timestamp without time zone DEFAULT now(),
updated_at timestamp without time zone DEFAULT now(),
CONSTRAINT events_pkey PRIMARY KEY (id)
);

CREATE TABLE public.featured_event (
id SERIAL PRIMARY KEY,
event_id integer NOT NULL,
featured_at timestamp without time zone DEFAULT now(),
display_order integer DEFAULT 0,
CONSTRAINT featured_event_pkey PRIMARY KEY (id),
CONSTRAINT featured_event_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE
);

CREATE TABLE public.featured_event_video (
id SERIAL PRIMARY KEY,
video_url text NOT NULL,
created_at timestamp without time zone DEFAULT now(),
updated_at timestamp without time zone DEFAULT now(),
CONSTRAINT featured_event_video_pkey PRIMARY KEY (id),
CONSTRAINT check_video_url_not_empty CHECK (video_url IS NOT NULL AND length(trim(video_url)) > 0)
);

CREATE TABLE public.featured_resource (
id SERIAL PRIMARY KEY,
resource_id integer NOT NULL UNIQUE,
featured_at timestamp without time zone DEFAULT now(),
CONSTRAINT featured_resource_pkey PRIMARY KEY (id),
CONSTRAINT featured_resource_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.resources(id)
);

CREATE TABLE public.resources (
id SERIAL PRIMARY KEY,
title text NOT NULL,
description text,
content text NOT NULL,
type text NOT NULL CHECK (type = ANY (ARRAY['article'::text, 'blog'::text])),
published_at date,
is_published boolean DEFAULT false,
cover_image_url text,
article_link text,
created_at timestamp without time zone DEFAULT now(),
updated_at timestamp without time zone DEFAULT now(),
CONSTRAINT resources_pkey PRIMARY KEY (id)
);

CREATE TABLE public.vendors (
id SERIAL PRIMARY KEY,
name text NOT NULL,
logo_url text,
description text,
image_url text,
link text,
created_at timestamp without time zone DEFAULT now(),
updated_at timestamp without time zone DEFAULT now(),
CONSTRAINT vendors_pkey PRIMARY KEY (id)
);

CREATE TABLE public.team_members (
id SERIAL PRIMARY KEY,
name text NOT NULL,
role text NOT NULL,
photo text,
created_at timestamp without time zone DEFAULT now(),
updated_at timestamp without time zone DEFAULT now(),
CONSTRAINT team_members_pkey PRIMARY KEY (id)
);

CREATE TABLE public.announcement_bar (
id SERIAL PRIMARY KEY,
text text NOT NULL,
is_active boolean DEFAULT false,
link text,
link_text text,
created_at timestamp without time zone DEFAULT now(),
updated_at timestamp without time zone DEFAULT now()
);

CREATE TABLE public.slide_gallery (
id SERIAL PRIMARY KEY,
title text NOT NULL,
subtitle text,
description text,
button_text text,
button_link text,
is_active boolean DEFAULT true,
display_order integer DEFAULT 1,
created_at timestamp without time zone DEFAULT now(),
updated_at timestamp without time zone DEFAULT now()
);
