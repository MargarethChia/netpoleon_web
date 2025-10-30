import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources | Netpoleon ANZ',
  description:
    'Access whitepapers, guides, blogs and curated cybersecurity resources from Netpoleon ANZ.',
};

export default function ResourcesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
