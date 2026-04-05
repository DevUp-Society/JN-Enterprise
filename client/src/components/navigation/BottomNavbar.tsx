import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  PackageSearch, 
  Package,
  List, 
  User, 
  Heart, 
  LayoutGrid,
  ShoppingBag,
  Users,
  Archive,
  X,
  LogOut,
  Settings,
  ChevronRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export function BottomNavbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  
  const isActive = (path: string) => {
    if (path === '/profile' || path === '/admin/profile' || path === '/worker/settings') {
      return location.pathname.includes('profile') || location.pathname.includes('settings');
    }
    return location.pathname === path;
  };

  const hiddenPaths = ['/', '/login', '/signup', '/checkout'];
  if (hiddenPaths.includes(location.pathname) || !user) return null;

  // Role-based navigation items
  const getNavItems = () => {
    const role = user.role;
    
    if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'MANAGER') {
      return [
        { path: '/admin/overview', icon: LayoutGrid, label: 'Control' },
        { path: '/admin/inventory', icon: Package, label: 'Nodes' },
        { path: '/admin/orders', icon: ShoppingBag, label: 'Registry' },
        { path: '/admin/partners', icon: Users, label: 'Partners' },
        { id: 'session', icon: User, label: 'Session' }
      ];
    }
    
    if (role === 'WORKER') {
      return [
        { path: '/worker/orders', icon: List, label: 'Queue' },
        { path: '/worker/inventory', icon: Package, label: 'Assets' },
        { path: '/worker/completed', icon: Archive, label: 'Log' },
        { id: 'session', icon: User, label: 'Session' }
      ];
    }
    
    return [
      { path: '/home', icon: Home, label: 'Home' },
      { path: '/shop', icon: PackageSearch, label: 'Shop' },
      { id: 'session', icon: User, label: 'Session' }
    ];
  };

  const navItems = getNavItems();

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-2xl border-t border-black/5 px-4 pb-[env(safe-area-inset-bottom)] h-[72px] shadow-[0_-8px_40px_rgba(0,0,0,0.06)]">
        <div className="flex h-full items-center justify-between max-w-md mx-auto">
          {navItems.map((item) => (
            'id' in item && item.id === 'session' ? (
              <button 
                key="session-trigger"
                onClick={() => setIsSessionOpen(true)}
                className="relative flex flex-col items-center justify-center w-full h-full group outline-none"
              >
                <div className={`transition-all duration-300 flex flex-col items-center gap-1 ${isSessionOpen ? 'text-black scale-110' : 'text-black/30'}`}>
                  <User size={22} strokeWidth={isSessionOpen ? 3 : 2} className="group-active:scale-90 transition-transform" />
                  <span className={`text-[8px] font-black uppercase tracking-widest transition-opacity duration-300 ${isSessionOpen ? 'opacity-100' : 'opacity-0'}`}>Session</span>
                </div>
              </button>
            ) : (
              <Link 
                key={(item as any).path}
                to={(item as any).path} 
                className="relative flex flex-col items-center justify-center w-full h-full group outline-none"
              >
                <div className={`transition-all duration-300 flex flex-col items-center gap-1 ${isActive((item as any).path) ? 'text-black scale-110' : 'text-black/30'}`}>
                  <item.icon size={22} strokeWidth={isActive((item as any).path) ? 3 : 2} className="group-active:scale-90 transition-transform" />
                  <span className={`text-[8px] font-black uppercase tracking-widest transition-opacity duration-300 ${isActive((item as any).path) ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
                </div>
                {isActive((item as any).path) && (
                  <motion.div layoutId="nav-glow" className="absolute -top-[1px] w-8 h-[2.5px] bg-black rounded-full" />
                )}
              </Link>
            )
          ))}
        </div>
      </nav>

      {/* Session Drawer (One-Handed Mobile) */}
      <AnimatePresence>
        {isSessionOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSessionOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-[120] rounded-t-[40px] px-8 pt-10 pb-12 shadow-3xl text-left border-t border-black/5"
            >
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-black rounded-2xl text-white shadow-xl">
                      <ShieldCheck size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">{user?.role} IDENTIFIED</p>
                      <h3 className="text-2xl font-black text-black tracking-tighter uppercase">{user?.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-black/[0.03] rounded-full w-fit">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-black/40">Active Session</span>
                  </div>
                </div>
                <button onClick={() => setIsSessionOpen(false)} className="p-3 bg-black/5 rounded-full hover:bg-black/10 transition-colors">
                  <X size={20} className="text-black" />
                </button>
              </div>

              <div className="space-y-3">
                <Link to="/wishlist" 
                  onClick={() => setIsSessionOpen(false)}
                  className="flex items-center justify-between p-6 bg-[#F7F7F7] rounded-[24px] border border-black/[0.03] hover:bg-black hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <Heart size={22} className="text-black/40 group-hover:text-white transition-colors" />
                    <span className="text-xs font-black uppercase tracking-[0.1em]">Wishlist Registry</span>
                  </div>
                  <ChevronRight size={18} className="text-black/20 group-hover:text-white transition-colors" />
                </Link>

                <Link to="/waiting-list" 
                  onClick={() => setIsSessionOpen(false)}
                  className="flex items-center justify-between p-6 bg-[#F7F7F7] rounded-[24px] border border-black/[0.03] hover:bg-black hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <Clock size={22} className="text-black/40 group-hover:text-white transition-colors" />
                    <span className="text-xs font-black uppercase tracking-[0.1em]">Waiting List</span>
                  </div>
                  <ChevronRight size={18} className="text-black/20 group-hover:text-white transition-colors" />
                </Link>

                <Link to={user?.role === 'RETAILER' ? '/profile' : user?.role === 'WORKER' ? '/worker/settings' : '/admin/settings'} 
                  onClick={() => setIsSessionOpen(false)}
                  className="flex items-center justify-between p-6 bg-[#F7F7F7] rounded-[24px] border border-black/[0.03] hover:bg-black hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <Settings size={22} className="text-black/40 group-hover:text-white transition-colors" />
                    <span className="text-xs font-black uppercase tracking-[0.1em]">Security & Preferences</span>
                  </div>
                  <ChevronRight size={18} className="text-black/20 group-hover:text-white transition-colors" />
                </Link>

                <button 
                  onClick={() => { logout(); setIsSessionOpen(false); }}
                  className="w-full flex items-center justify-between p-6 bg-red-50 rounded-[24px] border border-red-100 hover:bg-red-500 hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <LogOut size={22} className="text-red-500 group-hover:text-white transition-colors" />
                    <span className="text-xs font-black uppercase tracking-[0.1em] text-red-600 group-hover:text-white">Terminate Session</span>
                  </div>
                  <X size={18} className="text-red-500/20 group-hover:text-white transition-colors" />
                </button>
              </div>

              <div className="mt-12 text-center">
                 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black/20">JN Enterprise Protocol v4.0.2</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
