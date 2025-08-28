# 🚀 Netpoleon Admin API Documentation

## Overview

The Netpoleon admin system uses a modern Next.js 13+ App Router architecture with RESTful API routes for all database operations. This provides better security, performance, and maintainability compared to direct client-side database calls.

## 📁 API Structure

```
src/app/api/
├── events/
│   ├── route.ts              # GET (all), POST (create)
│   └── [id]/
│       └── route.ts          # GET (single), PUT (update), DELETE
├── resources/
│   ├── route.ts              # GET (all), POST (create)
│   ├── [id]/
│   │   └── route.ts          # GET (single), PUT (update), DELETE
│   └── featured/
│       └── route.ts          # GET, POST featured resources
├── vendors/
│   ├── route.ts              # GET (all), POST (create)
│   └── [id]/
│       └── route.ts          # GET (single), PUT (update), DELETE
└── test/
    └── route.ts              # Simple test endpoint
```

## 🔗 API Endpoints

### Events API

#### `GET /api/events`

**Description:** Fetch all events  
**Response:** Array of Event objects  
**Example:**

```typescript
const events = await eventsApi.getAll();
```

#### `POST /api/events`

**Description:** Create a new event  
**Body:**

```typescript
{
  title: string,           // Required
  event_date: string,      // Required (YYYY-MM-DD)
  location?: string,       // Optional
  description?: string,    // Optional
  link?: string           // Optional (URL)
}
```

**Response:** Created Event object  
**Example:**

```typescript
const newEvent = await eventsApi.create({
  title: 'Tech Conference 2024',
  event_date: '2024-06-15',
  location: 'Sydney Convention Centre',
  description: 'Annual technology conference',
});
```

#### `GET /api/events/[id]`

**Description:** Fetch a single event by ID  
**Response:** Event object  
**Example:**

```typescript
const event = await eventsApi.getById(123);
```

#### `PUT /api/events/[id]`

**Description:** Update an existing event  
**Body:** Same as POST, but all fields optional  
**Response:** Updated Event object  
**Example:**

```typescript
const updatedEvent = await eventsApi.update(123, {
  title: 'Updated Conference Title',
  location: 'New Location',
});
```

#### `DELETE /api/events/[id]`

**Description:** Delete an event  
**Response:** `{ success: true }`  
**Example:**

```typescript
await eventsApi.delete(123);
```

### Resources API

#### `GET /api/resources`

**Description:** Fetch all resources (articles and blog posts)  
**Response:** Array of Resource objects  
**Example:**

```typescript
const resources = await resourcesApi.getAll();
```

#### `POST /api/resources`

**Description:** Create a new resource  
**Body:**

```typescript
{
  title: string,              // Required
  content: string,            // Required
  type: 'article' | 'blog',   // Required
  published_at?: string,      // Optional (YYYY-MM-DD)
  is_published?: boolean,     // Optional (default: false)
  cover_image_url?: string    // Optional (URL)
}
```

**Response:** Created Resource object  
**Example:**

```typescript
const newResource = await resourcesApi.create({
  title: 'Getting Started with Cloud',
  content: 'A comprehensive guide...',
  type: 'article',
  is_published: true,
});
```

#### `GET /api/resources/[id]`

**Description:** Fetch a single resource by ID  
**Response:** Resource object

#### `PUT /api/resources/[id]`

**Description:** Update an existing resource  
**Body:** Same as POST, but all fields optional

#### `DELETE /api/resources/[id]`

**Description:** Delete a resource

#### `GET /api/resources/featured`

**Description:** Fetch all featured resources  
**Response:** Array of FeaturedResource objects  
**Example:**

```typescript
const featured = await resourcesApi.getFeatured();
```

#### `POST /api/resources/featured`

**Description:** Add a resource to featured list  
**Body:**

```typescript
{
  resource_id: number; // Required
}
```

**Response:** Created FeaturedResource object  
**Example:**

```typescript
const featured = await resourcesApi.addFeatured(123);
```

### Vendors API

#### `GET /api/vendors`

**Description:** Fetch all vendors  
**Response:** Array of Vendor objects  
**Example:**

```typescript
const vendors = await vendorsApi.getAll();
```

#### `POST /api/vendors`

**Description:** Create a new vendor  
**Body:**

```typescript
{
  name: string,              // Required
  logo_url?: string,         // Optional (URL)
  description?: string,       // Optional
  image_url?: string,        // Optional (URL)
  link?: string             // Optional (URL)
}
```

**Response:** Created Vendor object

#### `GET /api/vendors/[id]`

**Description:** Fetch a single vendor by ID

#### `PUT /api/vendors/[id]`

**Description:** Update an existing vendor

#### `DELETE /api/vendors/[id]`

**Description:** Delete a vendor

## 🛠️ Client-Side Usage

### Import the API Functions

```typescript
import {
  eventsApi,
  resourcesApi,
  vendorsApi,
  type Event,
  type Resource,
  type Vendor,
} from '@/lib/api';
```

### Basic Usage Pattern

```typescript
import { useState, useEffect } from 'react';
import { eventsApi, type Event } from '@/lib/api';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await eventsApi.getAll();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ... rest of component
}
```

### Error Handling

All API functions throw errors that you can catch and handle:

```typescript
try {
  const events = await eventsApi.getAll();
  // Success - use events data
} catch (error) {
  if (error instanceof Error) {
    console.error('API Error:', error.message);
    // Handle specific error
  } else {
    console.error('Unknown error:', error);
    // Handle unknown error
  }
}
```

## 🔒 Security & Validation

### Server-Side Validation

All API routes include basic validation:

- **Required fields** are checked before database operations
- **Data types** are validated (e.g., event_date format)
- **Enum values** are validated (e.g., resource type must be 'article' or 'blog')

### Error Responses

All API routes return consistent error responses:

```typescript
// Success Response
{
  "id": 1,
  "title": "Event Title",
  // ... other fields
}

// Error Response
{
  "error": "Descriptive error message"
}
```

### HTTP Status Codes

- `200` - Success (GET, PUT)
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (database/server issues)

## 🗄️ Database Schema

The API works with these Supabase tables:

### Events Table

```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  location TEXT,
  description TEXT,
  link TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Resources Table

```sql
CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('article', 'blog')),
  published_at DATE,
  is_published BOOLEAN DEFAULT FALSE,
  cover_image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Vendors Table

```sql
CREATE TABLE vendors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  image_url TEXT,
  link TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Featured Resources Table

```sql
CREATE TABLE featured_resource (
  id SERIAL PRIMARY KEY,
  resource_id INTEGER NOT NULL REFERENCES resources(id),
  featured_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Environment Setup

### Required Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Important:** Use the service role key (not the anon key) for admin operations.

### Database Setup

1. **Create Supabase Project** at [supabase.com](https://supabase.com)
2. **Run the SQL schema** from the Database Schema section above
3. **Set environment variables** with your project credentials
4. **Restart development server** after setting environment variables

## 🧪 Testing the API

### Test Endpoint

Visit `/api/test` to verify the API is working:

```bash
curl http://localhost:3000/api/test
# Expected: {"message":"API is working!","timestamp":"..."}
```

### Testing Individual Endpoints

```bash
# Test events endpoint
curl http://localhost:3000/api/events

# Test resources endpoint
curl http://localhost:3000/api/resources

# Test vendors endpoint
curl http://localhost:3000/api/vendors
```

## 🔧 Troubleshooting

### Common Issues

1. **"Unexpected token '<'" Error**
   - Restart development server after creating API routes
   - Check that route.ts files are in correct locations
   - Verify file syntax and imports

2. **"Failed to fetch" Errors**
   - Check environment variables are set correctly
   - Verify Supabase project is accessible
   - Check database tables exist

3. **TypeScript Errors**
   - Ensure types are properly imported from `@/lib/api`
   - Check that API functions are called with correct parameters

### Debug Steps

1. **Check Browser Network Tab** for API request details
2. **Verify API Routes** are accessible directly in browser
3. **Check Console Logs** for detailed error messages
4. **Test with Simple Endpoints** like `/api/test` first

## 📚 Best Practices

### Component Implementation

1. **Use proper loading states** for better UX
2. **Implement error boundaries** for graceful error handling
3. **Cache data appropriately** to avoid unnecessary API calls
4. **Handle empty states** when no data is returned

### API Usage

1. **Always handle errors** with try-catch blocks
2. **Use TypeScript types** for better development experience
3. **Implement retry logic** for failed requests
4. **Validate data** before sending to API

### Performance

1. **Use Promise.all** for multiple concurrent API calls
2. **Implement pagination** for large datasets
3. **Cache responses** when appropriate
4. **Debounce search inputs** to avoid excessive API calls

## 🔄 Migration from Old System

If migrating from the previous direct database approach:

1. **Replace `db.getEvents()`** with `eventsApi.getAll()`
2. **Replace `db.createEvent()`** with `eventsApi.create()`
3. **Update error handling** to catch API errors
4. **Remove old database imports** and hooks
5. **Update component state management** to use new API pattern

## 📖 Additional Resources

- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [React Query for Advanced Caching](https://tanstack.com/query/latest)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Need Help?** Check the troubleshooting section or create an issue in the project repository.
