import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@fontsource/rubik-one';
import { GoogleAnalytics } from '@next/third-parties/google';
import './main.css';
import LayoutWrapper from './components/LayoutWrapper';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Netpoleon ANZ | Your Cybersecurity Solution',
  description:
    'Netpoleon ANZ is a value-added distributor delivering next-generation cybersecurity solutions and services across Australia and New Zealand.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter antialiased bg-white`}>
        <LayoutWrapper>{children}</LayoutWrapper>
        <GoogleAnalytics gaId="G-LV9ZZN2FSG" />
      </body>
    </html>
  );
}
