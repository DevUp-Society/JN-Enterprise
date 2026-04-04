import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNavbar } from './BottomNavbar';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const location = useLocation();
  const hideFooterPaths = ['/wishlist', '/waiting-list', '/cart'];
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <Header />
      <main className="transition-all duration-300 pb-[80px] md:pb-12 pt-[env(safe-area-inset-top)] min-h-screen flex flex-col">
        {children}
      </main>
      {!shouldHideFooter && <Footer />}
      <BottomNavbar />
    </div>
  );
}










