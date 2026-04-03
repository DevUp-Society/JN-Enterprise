import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobile } from '../hooks/useMobile';
import BottomNavbar from './BottomNavbar';
import { 
  LayoutGrid, 
  Package, 
  Users, 
  ShoppingBag, 
  Settings,
  Bell,
  X
} from 'lucide-react';
import { DataService } from '../services/DataService';

export default function AdminLayout() {
  const isMobile = useMobile();
  const location = useLocation();
  const [broadcast, setBroadcast] = useState<any>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [issuesCount, setIssuesCount] = useState(0);

  useEffect(() => {
    setBroadcast(DataService.getBroadcast());
    setIssuesCount(DataService.getPendingIssuesCount());
    
    // Night Shift Sync
    const theme = DataService.getTheme();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const navItems = [
    { id: 'overview', icon: LayoutGrid, label: 'OVERVIEW', path: '/admin/overview' },
    { id: 'inventory', icon: Package, label: 'INVENTORY', path: '/admin/inventory' },
    { 
      id: 'orders', 
      icon: ShoppingBag, 
      label: 'ORDERS', 
      path: '/admin/orders',
      notification: issuesCount > 0 ? true : false 
    },
    { id: 'partners', icon: Users, label: 'PARTNERS', path: '/admin/partners' },
    { id: 'settings', icon: Settings, label: 'SETTINGS', path: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-bone dark:bg-dark font-sans selection:bg-primary/10 transition-colors overflow-x-hidden">
      {/* Notification Drawer */}
      <AnimatePresence>
         {isNotificationsOpen && (
            <>
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsNotificationsOpen(false)}
                  className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-[150]"
               />
               <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-dark-surface z-[200] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] border-l border-primary/5 p-12 flex flex-col"
               >
                  <div className="flex justify-between items-center mb-12">
                     <div className="space-y-1">
                        <h3 className="text-2xl font-black text-primary dark:text-white uppercase tracking-tighter">NOTIFICATIONS_</h3>
                        <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest italic">System Comms Protocol_v4.1</p>
                     </div>
                     <button 
                        onClick={() => setIsNotificationsOpen(false)}
                        className="p-4 hover:bg-bone dark:hover:bg-dark transition-colors border border-primary/5"
                     >
                        <X size={20} className="text-primary dark:text-white" />
                     </button>
                  </div>

                  <div className="flex-1 space-y-6 overflow-y-auto pr-4 custom-scrollbar">
                     {broadcast && broadcast.active ? (
                        <div className="p-8 bg-primary text-white space-y-4 relative overflow-hidden group">
                           <div className="flex items-center gap-4 relative z-10">
                              <Bell size={18} className="text-gold" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Active_Broadcast</span>
                           </div>
                           <p className="text-sm font-bold leading-relaxed relative z-10">{broadcast.message}</p>
                           <p className="text-[9px] opacity-40 italic relative z-10">{new Date(broadcast.createdAt).toLocaleString()}</p>
                           <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform pointer-events-none">
                              <Bell size={80} />
                           </div>
                        </div>
                     ) : (
                        <div className="py-24 text-center space-y-4 opacity-20">
                           <Bell size={48} className="mx-auto" />
                           <p className="text-[10px] font-black uppercase tracking-widest">Registry_Empty</p>
                        </div>
                     )}

                     {issuesCount > 0 && (
                        <div className="p-8 bg-gold/10 border border-gold/20 space-y-4">
                           <div className="flex items-center gap-4">
                              <X size={18} className="text-primary" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Pending_Issues</span>
                           </div>
                           <p className="text-sm font-bold text-primary">{issuesCount} Critical Fulfillment Blocks requiring dispatch override.</p>
                           <button 
                              onClick={() => { setIsNotificationsOpen(false); /* navigate to orders */ }}
                              className="text-[9px] font-black text-primary uppercase tracking-widest border-b border-primary/40"
                           >
                              Resolve_Protocol
                           </button>
                        </div>
                     )}
                  </div>
               </motion.div>
            </>
         )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar issuesCount={issuesCount} />}

      <main className={`flex-1 transition-all duration-500 shadow-inner ${isMobile ? 'p-6 pt-24 pb-32' : 'ml-72 p-12 pt-10'}`}>
         {/* Mobile Header / Logo */}
         {isMobile && (
            <div className="fixed top-0 left-0 right-0 h-20 bg-bone/80 dark:bg-dark/80 backdrop-blur-md flex items-center justify-between px-8 z-50 border-b border-primary/5">
            <h1 className="text-[12px] font-black tracking-[0.4em] text-primary dark:text-white uppercase text-center flex-1">JN ENTERPRISE</h1>
            <button 
               onClick={() => setIsNotificationsOpen(true)}
               className="relative p-3"
            >
               <Bell size={20} className="text-primary dark:text-white" />
               {(broadcast?.active || issuesCount > 0) && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-gold animate-ping" />
               )}
            </button>
            </div>
         )}

         <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Navigation */}
      {isMobile && <BottomNavbar items={navItems} />}

      <div className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
    </div>
  );
}
