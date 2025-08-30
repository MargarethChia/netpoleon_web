# Blog Post System

This document explains how the blog post system works in the Netpoleon web application.

## Overview

The blog post system allows users to view individual blog posts based on their titles. Each blog post gets a unique URL based on its title, converted to a URL-friendly slug.

## URL Structure

Blog posts are accessible at: `/blog/[slug]`

Where `[slug]` is generated from the blog post title using the following rules:

- Convert to lowercase
- Replace all non-alphanumeric characters with hyphens
- Remove leading and trailing hyphens

### Examples:

- Title: "Cybersecurity Best Practices 2024"
- Slug: "cybersecurity-best-practices-2024"
- URL: `/blog/cybersecurity-best-practices-2024`

## How It Works

### 1. Slug Generation

The `generateSlug()` utility function in `src/lib/utils.ts` converts titles to slugs:

```typescript
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
```

### 2. Blog Post Page

The dynamic route `src/app/(main)/blog/[slug]/page.tsx` handles individual blog post requests:

- Fetches all published blog resources
- Finds the resource with a matching slug
- Displays the blog post content
- Shows error if no matching post is found

### 3. Linking from Resources

The resources page (`src/app/(main)/resources/page.tsx`) now links to individual blog posts:

- "Read More" buttons for blog posts link to `/blog/[slug]`
- Featured resources also link to individual blog posts
- External articles still open in new tabs

## Features

### Blog Post Display

- **Header**: Title, description, publication date, and type badge
- **Cover Image**: Large hero image if available
- **Content**: HTML content for blog posts, external link for articles
- **Navigation**: Back to resources links
- **Responsive Design**: Mobile-friendly layout

### Loading States

- Skeleton loading animation (same as partners page)
- Error handling for missing posts
- Graceful fallbacks for missing content

### SEO

- Proper metadata for blog posts
- Semantic HTML structure
- Accessible navigation

## Database Requirements

Blog posts are stored in the `resources` table with:

- `type = 'blog'` for blog posts
- `type = 'article'` for external articles
- `is_published = true` for published content
- `content` field for blog post HTML content
- `article_link` for external article URLs

## Usage Examples

### Creating Links to Blog Posts

```typescript
import { generateSlug } from '@/lib/utils';

const blogTitle = 'My Blog Post Title';
const blogUrl = `/blog/${generateSlug(blogTitle)}`;
// Result: /blog/my-blog-post-title
```

### Finding Blog Posts by Slug

```typescript
const foundResource = resources.find(
  resource => generateSlug(resource.title) === slug
);
```

## Error Handling

- **404 Page**: Custom not-found page for missing blog posts
- **Error States**: User-friendly error messages
- **Fallbacks**: Graceful degradation for missing content

## Future Enhancements

Potential improvements could include:

- Blog post categories and tags
- Related posts suggestions
- Social sharing buttons
- Comment system
- Search within blog posts
- RSS feeds
- Blog post pagination
