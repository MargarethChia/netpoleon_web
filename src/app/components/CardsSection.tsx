'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface CardPost {
  id: number;
  title: string;
  excerpt: string;
  image?: string;
  type: string;
}

interface CardsSectionProps {
  title: string;
  subtitle: string;
  posts: CardPost[];
}

export default function CardsSection({
  title,
  subtitle,
  posts,
}: CardsSectionProps) {
  return (
    <section className="py-16 lg:min-h-screen lg:flex lg:items-center bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              className="bg-white rounded-lg overflow-hidden border border-gray-200 transition-shadow duration-300 hover:shadow-md group flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-primary text-base font-medium">
                      Image
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center mb-4 text-sm text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-11.293a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{post.type}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                  {post.title}
                </h3>

                <p className="text-gray-600 mb-6 flex-1">{post.excerpt}</p>

                <div className="mt-auto">
                  <a
                    href="#"
                    className="inline-flex items-center text-primary font-bold hover:text-primary/80 transition-colors duration-300"
                  >
                    <span>Read more</span>
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
