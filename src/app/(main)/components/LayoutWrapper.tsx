'use client';

import { usePathname } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Banner from '../../components/Banner';
import { ToastContainer } from '@/components/ui/toast';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      {isHomePage && <Banner />}
      <Header />
      {children}
      <ToastContainer />
      <Footer />
    </>
  );
}
