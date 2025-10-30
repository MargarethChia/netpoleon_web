import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Netpoleon ANZ',
  description:
    'Learn about Netpoleon ANZ’s mission, vision, leadership and growth across Australia and New Zealand.',
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
