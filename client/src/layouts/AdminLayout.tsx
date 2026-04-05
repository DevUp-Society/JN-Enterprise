import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobile } from '../hooks/useMobile';
import { BottomNavbar } from '../components/navigation/BottomNavbar';
import { MobileHeader } from '../components/navigation/MobileHeader';
import { 
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

  return (
    <div className="flex min-h-screen bg-[#D6D6D6] font-sans text-black selection:bg-[#000000] selection:text-[#D6D6D6] transition-colors overflow-x-hidden">
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
                  className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[200] shadow-2xl border-l border-[#000000]/5 p-8 flex flex-col"
               >
                  <div className="flex justify-between items-center mb-8">
                     <div className="space-y-1">
                        <h3 className="text-2xl font-semibold text-[#000000] tracking-tight">Notifications</h3>
                        <p className="text-sm font-medium text-[#000000]/40">System Updates & Alerts</p>
                     </div>
                     <button 
                        onClick={() => setIsNotificationsOpen(false)}
                        className="p-3 hover:bg-[#D6D6D6] rounded-full transition-colors"
                     >
                        <X size={20} className="text-[#000000]" />
                     </button>
                  </div>

                  <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                     {broadcast && broadcast.active ? (
                        <div className="p-6 bg-[#FFFFFF] rounded-[24px] text-black space-y-3 relative overflow-hidden shadow-md">
                           <div className="flex items-center gap-3 relative z-10">
                              <Bell size={18} className="text-[#D6D6D6] opacity-80" />
                              <span className="text-xs font-bold uppercase tracking-widest text-[#D6D6D6]">System Broadcast</span>
                           </div>
                           <p className="text-sm font-medium leading-relaxed relative z-10">{broadcast.message}</p>
                           <p className="text-[10px] opacity-40 font-medium relative z-10">{new Date(broadcast.createdAt).toLocaleString()}</p>
                        </div>
                     ) : (
                        <div className="py-24 text-center space-y-4 text-[#000000]/20 border border-dashed border-[#000000]/10 rounded-[24px]">
                           <Bell size={40} className="mx-auto" />
                           <p className="text-xs font-semibold">No active broadcasts</p>
                        </div>
                     )}

                     {issuesCount > 0 && (
                        <div className="p-6 bg-[#000000]/10 border border-[#000000]/20 rounded-[24px] space-y-3">
                           <div className="flex items-center gap-3">
                              <X size={16} className="text-black" />
                              <span className="text-xs font-bold text-black uppercase tracking-widest">Action Required</span>
                           </div>
                           <p className="text-sm font-semibold text-black">{issuesCount} Critical tasks require your attention.</p>
                           <button 
                              onClick={() => { setIsNotificationsOpen(false); /* navigate to orders */ }}
                              className="text-xs font-bold text-black hover:text-[#000000] transition-colors mt-2"
                           >
                              Review Issues →
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

      <main className={`flex-1 transition-all duration-500 shadow-sm ${isMobile ? 'p-4 pt-24 pb-32' : 'ml-56 p-8 pt-8'}`}>
         {/* Mobile Native Header */}
         {isMobile && <MobileHeader />}

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
      {isMobile && <BottomNavbar />}
    </div>
  );
}











