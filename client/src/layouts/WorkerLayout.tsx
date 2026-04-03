import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  CheckCircle2, 
  Box,
  LogOut, 
  Menu, 
  X, 
  User,
  Bell
} from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useMobile } from '../hooks/useMobile';
import BottomNavbar from './BottomNavbar';
import { DataService } from '../services/DataService';

export default function WorkerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [broadcast, setBroadcast] = useState<any>(null);

  useEffect(() => {
    setBroadcast(DataService.getBroadcast());
    // Night Shift Sync
    const theme = DataService.getTheme();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'orders', name: 'QUEUE', label: 'QUEUE', path: '/worker/orders', icon: Package },
    { id: 'inventory', name: 'INVENTORY', label: 'INVENTORY', path: '/worker/inventory', icon: Box },
    { id: 'completed', name: 'COMPLETED', label: 'COMPLETED', path: '/worker/completed', icon: CheckCircle2 },
    { id: 'settings', name: 'ACCOUNT', label: 'ACCOUNT', path: '/worker/settings', icon: User },
  ];

  return (
    <div className="min-h-screen bg-bone dark:bg-dark flex font-sans text-primary dark:text-white selection:bg-gold selection:text-white transition-colors">
      {/* Broadcast Banner v4.0 */}
      <AnimatePresence>
         {broadcast && broadcast.active && (
            <motion.div 
               initial={{ y: -100 }}
               animate={{ y: 0 }}
               exit={{ y: -100 }}
               className="fixed top-0 left-0 right-0 z-[100] bg-primary text-white h-14 md:h-16 flex items-center justify-center px-10 shadow-2xl overflow-hidden"
            >
               <div className="flex items-center gap-6 max-w-7xl w-full">
                  <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-white/20 flex items-center justify-center">
                     <Bell size={18} className="animate-bounce" />
                  </div>
                  <p className="flex-1 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] truncate">{broadcast.message}</p>
                  <button 
                     onClick={() => setBroadcast(null)} 
                     className="p-3 hover:bg-white/10 transition-colors"
                  >
                     <X size={18} />
                  </button>
               </div>
               <div className="absolute inset-0 bg-white/5 opacity-[0.05] pointer-events-none" />
            </motion.div>
         )}
      </AnimatePresence>

      {/* Worker Sidebar (Desktop only) */}
      {!isMobile && (
        <motion.aside 
          initial={false}
          animate={{ width: isSidebarOpen ? 320 : 0, opacity: isSidebarOpen ? 1 : 0 }}
          className={`bg-white dark:bg-dark-surface border-r border-primary/10 flex flex-col sticky top-0 h-screen overflow-hidden z-40 transition-colors ${broadcast?.active ? 'pt-16' : ''}`}
        >
          <div className="p-10 border-b border-primary/5 mb-10">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-primary text-white flex items-center justify-center font-black shadow-lg">JN</div>
               <div>
                  <h1 className="text-[14px] font-black tracking-tighter text-primary dark:text-white uppercase leading-none">JN FULFILLMENT</h1>
                  <p className="text-[8px] font-bold text-primary/30 uppercase tracking-[0.2em] mt-1">Warehouse Node 01</p>
               </div>
            </div>
          </div>

          <nav className="flex-1 px-6 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center gap-5 px-6 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-transparent ${
                    isActive 
                      ? 'bg-primary text-white shadow-2xl scale-[1.02]' 
                      : 'text-primary/40 dark:text-white/40 hover:bg-primary/5 hover:text-primary dark:hover:text-gold'
                   }`
                }
              >
                <item.icon size={16} />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="p-8 border-t border-primary/5 space-y-4">
             <div className="p-6 bg-bone dark:bg-dark flex items-center gap-4 border border-primary/5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary/40 dark:text-white/40">
                   <User size={16} />
                </div>
                <div className="overflow-hidden">
                   <p className="text-[10px] font-black text-primary dark:text-white truncate uppercase">{user?.name}</p>
                   <p className="text-[8px] font-bold text-primary/30 uppercase">Fulfillment Specialist</p>
                </div>
             </div>
          </div>
        </motion.aside>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-500 flex flex-col min-h-screen ${isMobile ? 'pt-24 pb-32' : ''} ${broadcast?.active && isMobile ? 'pt-32' : ''}`}>
        {/* Mobile Header / Logo */}
        {isMobile && (
          <div className="fixed top-0 left-0 right-0 h-20 bg-bone/80 dark:bg-dark/80 backdrop-blur-md flex items-center justify-center z-50 border-b border-primary/5 transition-colors">
            <h1 className="text-[14px] font-black tracking-[0.4em] text-primary dark:text-white uppercase">JN ENTERPRISE</h1>
          </div>
        )}

        {/* Desktop Header */}
        {!isMobile && (
          <header className={`h-28 bg-white dark:bg-dark-surface border-b border-primary/5 px-10 flex items-center justify-between sticky top-0 z-30 shadow-sm transition-colors ${broadcast?.active ? 'mt-16' : ''}`}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-4 hover:bg-bone dark:hover:bg-dark transition-colors text-primary/40 hover:text-primary"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex items-center gap-8">
               <div className="hidden md:flex flex-col items-end">
                  <p className="text-[9px] font-black text-primary/20 uppercase tracking-widest">Active Thread</p>
                  <p className="text-[11px] font-black text-primary dark:text-white uppercase leading-none mt-1">Fulfillment-0{user?.id}-LOG</p>
               </div>
               <div className="h-10 w-px bg-primary/10 mx-2" />
               <button 
                 onClick={handleLogout}
                 className="flex items-center gap-3 px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-gold transition-all shadow-xl active:scale-95"
               >
                 <LogOut size={16} />
                 SIGN OUT
               </button>
            </div>
          </header>
        )}

        <section className={`p-6 md:p-16 max-w-7xl mx-auto w-full flex-1 flex flex-col`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      {/* Mobile Navigation */}
      {isMobile && <BottomNavbar items={menuItems} />}

      <div className="fixed inset-0 pointer-events-none opacity-[0.01] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
    </div>
  );
}
