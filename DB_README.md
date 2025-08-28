-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.events (
id integer NOT NULL DEFAULT nextval('events_id_seq'::regclass),
title text NOT NULL,
event_date date NOT NULL,
location text,
description text,
link text,
created_at timestamp without time zone DEFAULT now(),
updated_at timestamp without time zone DEFAULT now(),
CONSTRAINT events_pkey PRIMARY KEY (id)
);

CREATE TABLE public.featured_resource (
id integer NOT NULL DEFAULT nextval('featured_resource_id_seq'::regclass),
resource_id integer NOT NULL UNIQUE,
featured_at timestamp without time zone DEFAULT now(),
CONSTRAINT featured_resource_pkey PRIMARY KEY (id),
CONSTRAINT featured_resource_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.resources(id)
);

CREATE TABLE public.resources (
id integer NOT NULL DEFAULT nextval('resources_id_seq'::regclass),
title text NOT NULL,
content text NOT NULL,
type text NOT NULL CHECK (type = ANY (ARRAY['article'::text, 'blog'::text])),
published_at date,
is_published boolean DEFAULT false,
cover_image_url text,
created_at timestamp without time zone DEFAULT now(),
updated_at timestamp without time zone DEFAULT now(),
CONSTRAINT resources_pkey PRIMARY KEY (id)
);

CREATE TABLE public.vendors (
id integer NOT NULL DEFAULT nextval('vendors_id_seq'::regclass),
name text NOT NULL,
logo_url text,
description text,
image_url text,
link text,
created_at timestamp without time zone DEFAULT now(),
updated_at timestamp without time zone DEFAULT now(),
CONSTRAINT vendors_pkey PRIMARY KEY (id)
);
