import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vendors | Netpoleon ANZ',
  description:
    'Discover Netpoleon ANZ’s portfolio of leading cybersecurity vendors and technology partners across the ANZ region.',
};

export default function VendorsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
