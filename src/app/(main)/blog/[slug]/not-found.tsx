import Link from 'next/link';
import { ArrowLeft, Search, Home } from 'lucide-react';

export default function BlogPostNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-12 border border-orange-100">
          {/* Icon */}
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-orange-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Blog Post Not Found
          </h1>

          {/* Message */}
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            We couldn&apos;t find the blog post you&apos;re looking for. It
            might have been moved, deleted, or the link might be incorrect.
          </p>

          {/* Helpful suggestions */}
          <div className="bg-orange-50 rounded-xl p-6 mb-8 border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-900 mb-3">
              Here are some things you can try:
            </h3>
            <ul className="text-left text-orange-800 space-y-2">
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                Check if the URL is spelled correctly
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                Go back to our resources page to browse all content
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                Use the search function to find what you&apos;re looking for
              </li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/resources"
              className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold inline-flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Resources
            </Link>
            <Link
              href="/"
              className="bg-white text-orange-600 border border-orange-300 px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors font-semibold inline-flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
