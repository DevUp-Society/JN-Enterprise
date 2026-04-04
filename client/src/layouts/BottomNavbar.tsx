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
    <div className="fixed bottom-0 left-0 right-0 z-[200] lg:hidden px-4 pb-4">
      <div className="bg-[#D6D6D6]/80 dark:bg-[#FFFFFF]/80 backdrop-blur-2xl border border-[#FFFFFF]/5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] px-8 h-20 transition-all flex items-center justify-between">
        <nav className="flex justify-between items-center h-full w-full">
          {items.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center space-y-1.5 transition-all relative w-16 h-full ${
                  isActive ? 'text-black dark:text-[#D6D6D6]' : 'text-black/30 dark:text-[#D6D6D6]/30 hover:text-black/60 dark:hover:text-[#D6D6D6]/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                     <item.icon 
                        size={isActive ? 22 : 20} 
                        strokeWidth={isActive ? 2.5 : 2} 
                        className={`transition-all duration-300 transform ${isActive ? 'scale-110 text-[#000000] dark:text-[#D6D6D6]' : ''}`}
                     />
                     {item.notification && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-2 h-2 bg-black rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"
                        />
                     )}
                  </div>
                  <span className={`text-[8px] font-bold uppercase tracking-[0.2em] transition-all ${isActive ? 'text-black dark:text-[#D6D6D6]' : 'text-black/40 dark:text-[#D6D6D6]/40'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-dot"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-1.5 w-1 h-1 bg-[#000000] dark:bg-[#D6D6D6] rounded-full shadow-[0_0_8px_rgba(63,104,68,0.8)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
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











