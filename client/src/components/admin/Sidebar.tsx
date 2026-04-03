import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  User,
  LogOut, 
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../premium/Logo';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ issuesCount = 0 }: { issuesCount?: number }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'OVERVIEW', path: '/admin/overview' },
    { id: 'inventory', icon: Package, label: 'INVENTORY', path: '/admin/inventory' },
    { id: 'retailers', icon: Users, label: 'PARTNERS', path: '/admin/partners' },
    { id: 'orders', icon: ShoppingCart, label: 'ORDERS', path: '/admin/orders', notification: issuesCount > 0 },
    { id: 'settings', icon: Settings, label: 'SETTINGS', path: '/admin/settings' },
  ];

  return (
    <aside className="w-72 bg-[#425664] flex flex-col fixed h-full z-20 rounded-none shadow-2xl transition-all font-mono">
      {/* Top Section: Branding Logo */}
      <div className="p-12 border-b border-white/5">
        <Logo className="text-[14px] !text-white tracking-[0.5em]" />
      </div>
      
      {/* Navigation Matrix: Re-introduced Icons */}
      <nav className="flex-1 mt-12 space-y-0">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => 
              `w-full flex items-center gap-6 px-12 py-8 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative group ${
                isActive 
                  ? 'bg-[#C6AD8F] text-[#425664] shadow-[0_4px_20px_rgba(0,0,0,0.1)]' 
                  : 'text-white/30 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} strokeWidth={ isActive ? 3 : 2 } className="relative z-10" />
                <span className="relative z-10">{item.label}</span>
                
                {item.notification && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`ml-auto w-2 h-2 rounded-full ${
                      isActive ? 'bg-[#425664]' : 'bg-red-500 animate-pulse'
                    }`}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Restored: Simplified Profile Node */}
      <div className="relative" ref={menuRef}>
         <AnimatePresence>
            {showProfileMenu && (
               <motion.div 
                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 10, scale: 0.95 }}
                 className="absolute bottom-full left-6 right-6 mb-4 bg-white border border-primary/10 shadow-2xl p-4 overflow-hidden z-30"
               >
                  <div className="space-y-1">
                     <button 
                        onClick={() => { navigate('/admin/profile'); setShowProfileMenu(false); }}
                        className="w-full flex items-center justify-between px-6 py-4 text-[10px] font-black text-[#425664]/40 uppercase tracking-widest hover:bg-[#425664]/5 hover:text-[#425664] transition-all group"
                     >
                        VIEW_PROFILE <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-all" />
                     </button>
                     <button 
                        onClick={() => logout()}
                        className="w-full flex items-center justify-between px-6 py-4 text-[10px] font-black text-red-500/60 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all group"
                     >
                        LOGOUT_PROTOCOL <LogOut size={12} />
                     </button>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`p-12 border-t border-white/5 flex items-center gap-6 group cursor-pointer transition-all ${showProfileMenu ? 'bg-white/10' : 'hover:bg-white/5'}`}
         >
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-[#C6AD8F] group-hover:border-[#C6AD8F] transition-all overflow-hidden relative">
               <User size={20} className="relative z-10" />
               {user?.name && (
                  <div className="absolute inset-0 flex items-center justify-center text-[18px] font-black text-white/5">
                     {user.name.charAt(0).toUpperCase()}
                  </div>
               )}
            </div>
            <div className="min-w-0">
               <p className="text-[11px] font-black text-white uppercase tracking-widest truncate leading-none">{user?.name || 'ADMIN'}</p>
               <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] mt-2">OPERATOR_LIVE</p>
            </div>
         </div>
      </div>
    </aside>
  );
}
