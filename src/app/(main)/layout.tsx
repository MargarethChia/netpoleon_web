import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './main.css';
import { ToastContainer } from '@/components/ui/toast';
import Header from '../components/Header';
import Footer from '../components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <Header />
        {children}
        <ToastContainer />
        <Footer />
      </body>
    </html>
  );
}
