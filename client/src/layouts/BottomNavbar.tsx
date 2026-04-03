import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
  path: string;
  notification?: boolean;
}

interface BottomNavbarProps {
  items: NavItem[];
}

export default function BottomNavbar({ items }: BottomNavbarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] lg:hidden">
      <div className="bg-bone/80 dark:bg-dark/80 backdrop-blur-xl border-t border-primary/20 shadow-floating px-8 pb-safe-area-inset-bottom h-22 transition-colors">
        <nav className="flex justify-between items-center h-full">
          {items.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center space-y-2 transition-all relative w-16 h-full ${
                  isActive ? 'text-primary dark:text-white' : 'text-primary/20 dark:text-white/20 hover:text-primary/40'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                     <item.icon 
                        size={isActive ? 24 : 22} 
                        strokeWidth={isActive ? 2.5 : 1.8} 
                        className="transition-transform duration-300 transform active:scale-90"
                     />
                     {item.notification && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"
                        />
                     )}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-indicator"
                      className="absolute bottom-1 w-1 h-1 bg-primary dark:bg-white rounded-full shadow-[0_0_10px_rgba(66,86,100,0.4)]"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
