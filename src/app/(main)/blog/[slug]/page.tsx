import React from 'react';
import { Calendar, ArrowLeft, ExternalLink, Eye, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { generateSlug } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Resource } from '@/lib/supabase';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // Await params to get the slug
  const { slug } = await params;

  try {
    // Create server-side Supabase client
    const supabase = await createClient();

    // Fetch all resources that have content (not external links)
    const { data: allResources, error } = await supabase
      .from('resources')
      .select('*')
      .eq('is_published', true)
      .not('content', 'eq', ''); // Only resources with content (not empty)

    if (error) {
      notFound();
    }

    if (!allResources || allResources.length === 0) {
      notFound();
    }

    // Find resource by title (converted to slug)
    const resource = allResources.find(
      (resource: Resource) => generateSlug(resource.title) === slug
    );

    if (!resource) {
      notFound();
    }

    return (
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 hidden lg:block">
          {/* Breadcrumb Navigation */}
          <nav className="text-sm text-gray-600 flex items-center">
            <Link
              href="/resources"
              className="hover:text-gray-900 transition-colors flex items-center"
            >
              BLOG
            </Link>
            <span className="mx-2 flex items-center">›</span>
            <span className="text-gray-900 truncate max-w-xs flex items-center">
              {resource.title.toUpperCase()}
            </span>
          </nav>
        </div>

        {/* Hero Image - Edge to edge on mobile, text width on desktop */}
        {resource.cover_image_url && (
          <div className="mb-8">
            <div className="relative aspect-video overflow-hidden bg-gray-100 lg:max-w-4xl lg:mx-auto lg:rounded-lg">
              <Image
                unoptimized
                src={resource.cover_image_url}
                alt={resource.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Blog Post Metadata */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              {resource.published_at
                ? new Date(resource.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'No publication date'}
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <Clock className="w-4 h-4 mr-2" />
              {resource.content
                ? `${Math.max(1, Math.ceil(resource.content.split(' ').length / 200))} min read`
                : '1 min read'}
            </div>
          </div>

          {/* Blog Post Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {resource.title}
          </h1>

          {/* Content */}
          <article
            className="prose prose-lg max-w-none
            prose-headings:text-gray-900 prose-headings:font-bold
            prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8 prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-2
            prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:text-gray-800
            prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5 prose-h3:text-gray-700
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-base
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-em:text-gray-800 prose-em:italic
            prose-ul:my-4 prose-ol:my-4
            prose-li:text-gray-700 prose-li:mb-2 prose-li:leading-relaxed
            prose-blockquote:border-l-4 prose-blockquote:border-orange-500 
            prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-6
            prose-blockquote:bg-orange-50 prose-blockquote:text-gray-800 prose-blockquote:rounded-r-lg
            prose-code:text-orange-700 prose-code:bg-orange-100 
            prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 
            prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-6 prose-pre:shadow-lg
            prose-a:text-orange-600 prose-a:underline prose-a:hover:text-orange-700 prose-a:font-medium
            prose-hr:border-gray-300 prose-hr:my-8
            prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
            prose-table:border-collapse prose-table:w-full prose-table:my-6
            prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-2 prose-th:bg-gray-50 prose-th:text-left prose-th:font-semibold
            prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2
            [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
          >
            {/* External Link Resources (shouldn't appear here since we filtered for content) */}
            {resource.article_link && !resource.content && (
              <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  External Resource
                </h3>
                <p className="text-blue-700 mb-4">
                  This resource links to external content. Click the button
                  below to read the full content.
                </p>
                <a
                  href={resource.article_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Read Full Content
                </a>
              </div>
            )}

            {/* Resource Content */}
            {resource.content && (
              <div
                className="[&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mb-6 [&>h1]:mt-8 [&>h1]:border-b [&>h1]:border-gray-200 [&>h1]:pb-2
                  [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-800 [&>h2]:mb-4 [&>h2]:mt-6
                  [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-gray-700 [&>h3]:mb-3 [&>h3]:mt-5
                  [&>p]:text-gray-700 [&>p]:leading-relaxed [&>p]:mb-4 [&>p]:text-base
                  [&>strong]:text-gray-900 [&>strong]:font-semibold
                  [&>em]:text-gray-800 [&>em]:italic
                  [&>ul]:my-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2
                  [&>ol]:my-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2
                  [&>li]:text-gray-700 [&>li]:leading-relaxed
                  [&>blockquote]:border-l-4 [&>blockquote]:border-orange-500 [&>blockquote]:pl-6 [&>blockquote]:py-2 [&>blockquote]:my-6 [&>blockquote]:bg-orange-50 [&>blockquote]:text-gray-800 [&>blockquote]:rounded-r-lg [&>blockquote]:italic
                  [&>code]:text-orange-700 [&>code]:bg-orange-100 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono
                  [&>pre]:bg-gray-900 [&>pre]:text-gray-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:my-6 [&>pre]:shadow-lg [&>pre]:font-mono
                  [&>a]:text-orange-600 [&>a]:underline [&>a]:hover:text-orange-700 [&>a]:font-medium
                  [&>hr]:border-gray-300 [&>hr]:my-8
                  [&>img]:rounded-lg [&>img]:shadow-md [&>img]:my-6
                  [&>table]:border-collapse [&>table]:w-full [&>table]:my-6
                  [&>th]:border [&>th]:border-gray-300 [&>th]:px-4 [&>th]:py-2 [&>th]:bg-gray-50 [&>th]:text-left [&>th]:font-semibold [&>th]:text-gray-900
                  [&>td]:border [&>td]:border-gray-300 [&>td]:px-4 [&>td]:py-2 [&>td]:text-gray-700
                  [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: resource.content }}
              />
            )}

            {/* Fallback for resources without content */}
            {!resource.content && !resource.article_link && (
              <div className="text-center py-12">
                <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Content Not Available
                </h3>
                <p className="text-gray-500">
                  The content for this resource is not currently available.
                </p>
              </div>
            )}
          </article>

          {/* Back to Resources Link */}
          <div className="my-16 pt-8 border-t border-gray-200">
            <Link
              href="/resources"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Resources
            </Link>
          </div>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
