import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F6F4F2] text-[#425664] font-sans selection:bg-[#C6AD8F] selection:text-white">
      <Header />
      <main className="transition-all duration-300">
        {children}
      </main>
      <Footer />
    </div>
  );
}
