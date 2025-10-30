import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services | Netpoleon ANZ',
  description:
    'Explore Netpoleon ANZ’s end-to-end cybersecurity services: pre-sales consultation, enablement, deployment and post-sales support.',
};

export default function ServicesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
