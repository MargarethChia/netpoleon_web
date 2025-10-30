import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Netpoleon ANZ',
  description:
    'Contact Netpoleon ANZ for partnerships, sales inquiries, technical support or general questions.',
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
