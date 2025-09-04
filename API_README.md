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
  description?: string,       // Optional
  content?: string,           // Required for blog posts, optional for articles
  type: 'article' | 'blog',   // Required
  published_at?: string,      // Optional (YYYY-MM-DD)
  is_published?: boolean,     // Optional (default: false)
  cover_image_url?: string,   // Optional (URL)
  article_link?: string       // Required for articles, optional for blog posts
}
```

**Notes:**

- For `type: 'article'`: `article_link` is required, `content` is optional
- For `type: 'blog'`: `content` is required, `article_link` is optional

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

```

```
