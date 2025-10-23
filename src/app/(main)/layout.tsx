import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './main.css';
import LayoutWrapper from './components/LayoutWrapper';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Netpoleon Homepage Design Draft',
  description:
    'Made for Netpoleon ANZ as part of website design and development project proposal',
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
