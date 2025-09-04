# Netpoleon Admin Panel

A comprehensive admin dashboard for managing the Netpoleon website content, built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 📊 Dashboard

- Overview statistics for events, resources, vendors, and featured content
- Quick access to recent items
- Visual representation of data

### 📅 Events Management

- Create, edit, and delete events
- Event status tracking (Past, Today, Upcoming)
- Search and filter functionality
- Event details management

### 📄 Resources Management

- Manage articles and blog posts
- Publish/unpublish functionality
- Featured resources system
- Content type categorization (article/blog)
- Cover image support

### 🏢 Vendors Management

- Partner vendor information management
- Logo and image upload support
- Website link management
- Vendor overview with card view

### 📈 Analytics

- Website performance metrics
- Content analytics
- Top pages and resources tracking
- Recent activity feed
- Performance indicators

### ⚙️ Settings

- General configuration
- Website settings
- Security settings
- Notification preferences
- Appearance customization
- Advanced database settings

## Database Schema

The admin panel is designed to work with the following Supabase schema:

```sql
-- Events table
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

-- Resources table
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

-- Vendors table
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

-- Featured resources table
CREATE TABLE public.featured_resource (
  id integer NOT NULL DEFAULT nextval('featured_resource_id_seq'::regclass),
  resource_id integer NOT NULL UNIQUE,
  featured_at timestamp without time zone DEFAULT now(),
  CONSTRAINT featured_resource_pkey PRIMARY KEY (id),
  CONSTRAINT featured_resource_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.resources(id)
);
```

## Setup Instructions

### 1. Database Setup

First, you need to create the database tables in your Supabase project. The schema is defined in `DB_README.md`. You can either:

1. **Use the Supabase Dashboard**: Go to your Supabase project → SQL Editor and run the CREATE TABLE statements from `DB_README.md`
2. **Use the Supabase CLI**: If you have the CLI installed, you can run the schema directly

### 2. Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Important:** Use the service role key (not the anon key) for admin operations. The service role key has full database access and can perform all CRUD operations.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

### 4. Access the Admin Panel

Navigate to `http://localhost:3000/admin` to access the admin dashboard.

## File Structure

```
src/app/(admin)/
├── admin/
│   ├── page.tsx              # Dashboard
│   ├── events/
│   │   └── page.tsx          # Events management
│   ├── resources/
│   │   └── page.tsx          # Resources management
│   ├── vendors/
│   │   └── page.tsx          # Vendors management
│   ├── analytics/
│   │   └── page.tsx          # Analytics dashboard
│   └── settings/
│       └── page.tsx          # Settings panel
├── components/
│   └── AdminLayout.tsx       # Shared admin layout
├── layout.tsx                # Admin layout wrapper
└── admin.css                 # Admin-specific styles

src/lib/
└── supabase.ts              # Supabase configuration and database operations
```

## Usage

### Dashboard

- View overview statistics
- Quick access to recent content
- Navigate to different sections

### Events Management

- Click "Add Event" to create new events
- Use search and filters to find specific events
- Edit or delete events using the dropdown menu
- View event status and details

### Resources Management

- Create new articles or blog posts
- Toggle publish status
- Feature/unfeature resources
- Manage content types and cover images

### Vendors Management

- Add new partner vendors
- Upload logos and images
- Manage vendor information and links
- View vendors in both table and card formats

### Analytics

- Monitor website performance
- Track content engagement
- View recent activity
- Export analytics data

### Settings

- Configure website information
- Set up security preferences
- Customize notification settings
- Adjust appearance and theme

## Customization

### Adding New Features

1. Create new pages in the appropriate directory
2. Update the `AdminLayout` component navigation
3. Add corresponding database operations in `supabase.ts`
4. Update types and interfaces as needed

### Styling

- The admin panel uses Tailwind CSS for styling
- Custom CSS variables are defined in `admin.css`
- Components use the shadcn/ui design system

### Database Operations

- All database operations are centralized in `src/lib/supabase.ts`
- Use the provided `db` object for CRUD operations
- Error handling is built into the database functions

## Security Considerations

- Implement proper authentication and authorization
- Add input validation for all forms
- Use environment variables for sensitive data
- Implement rate limiting for API endpoints
- Regular security audits and updates

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for type safety
3. Implement proper error handling
4. Add appropriate comments and documentation
5. Test thoroughly before submitting changes

## Support

For issues or questions regarding the admin panel, please refer to the project documentation or contact the development team.
