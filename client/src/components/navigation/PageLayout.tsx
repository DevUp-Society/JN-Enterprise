import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNavbar } from './BottomNavbar';

interface PageLayoutProps {
  children: ReactNode;
}

import { useMobile } from '../../hooks/useMobile';
import { MobileHeader } from './MobileHeader';

export function PageLayout({ children }: PageLayoutProps) {
  const isMobile = useMobile();
  const location = useLocation();
  const hideFooterPaths = ['/wishlist', '/waiting-list', '/cart'];
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {isMobile ? <MobileHeader /> : <Header />}
      <main className={`transition-all duration-300 pt-[env(safe-area-inset-top)] min-h-screen flex flex-col ${isMobile ? 'pb-32 pt-24' : 'md:pb-12'}`}>
        {children}
      </main>
      {!shouldHideFooter && <Footer />}
      <BottomNavbar />
    </div>
  );
}










