import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events | Netpoleon ANZ',
  description:
    'Join Netpoleon ANZ events, webinars and trainings across Australia and New Zealand.',
};

export default function EventsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
