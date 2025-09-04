import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Post | Netpoleon',
  description: 'Read our latest cybersecurity insights and blog posts',
};

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
