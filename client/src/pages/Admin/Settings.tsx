import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Smartphone, 
  Send,
  Zap,
  UserPlus,
  Users,
  Palette,
  Layers,
  Settings as SettingsIcon,
  Layout
} from 'lucide-react';
import { DataService } from '../../services/DataService';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSendBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    DataService.sendBroadcast(broadcastMsg);
    setBroadcastMsg('');
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  const actionCards = [
    { id: 'admins', label: 'Admin Profiles', icon: UserPlus, desc: 'Personnel Registry Expansion', path: '/admin/settings/personnel/admins' },
    { id: 'workers', label: 'Worker Profiles', icon: Users, desc: 'Fulfillment Capacity Growth', path: '/admin/settings/personnel/workers' },
    { id: 'theme', label: 'Theme Settings', icon: Palette, desc: 'Visual Projection Matrix' },
    { id: 'categories', label: 'Manage Categories', icon: Layers, desc: 'Registry Catalog Logic' },
    { id: 'category-order', label: 'Manage Category Order', icon: SettingsIcon, desc: 'Logical Hierarchy Pulse' },
    { id: 'slides', label: 'Manage Slides', icon: Layout, desc: 'Frontend Interface Logic' },
  ];

  return (
    <div className="space-y-12 pb-24 font-mono select-none">
      {/* TERMINAL_HEADER_PROTOCOL */}
      <header className="flex flex-col gap-10 border-b border-primary/10 pb-12">
        <div className="flex items-center">
           <h1 className="text-3xl font-black text-primary dark:text-bone tracking-tighter uppercase leading-none">
              SYSTEM SETTINGS
           </h1>
           <div className="h-[1px] flex-1 bg-primary/5 mx-10" />
        </div>
      </header>

      {/* ACTION_COLLECTION_GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {actionCards.map((card, idx) => (
            <motion.div 
               key={card.id}
               onClick={() => card.path && navigate(card.path)}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.05 }}
               className="floating-card p-10 flex flex-col justify-between group hover:border-gold transition-all cursor-pointer relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] group-hover:scale-110 transition-all">
                  <card.icon size={120} />
               </div>
               <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 bg-primary/5 flex items-center justify-center text-primary/30 group-hover:bg-gold group-hover:text-white transition-all">
                     <card.icon size={24} />
                  </div>
                  <div className="space-y-1">
                     <h4 className="text-[12px] font-black text-primary dark:text-white uppercase tracking-widest">{card.label}</h4>
                     <p className="text-[9px] font-black text-primary/20 dark:text-white/20 uppercase tracking-widest">{card.desc}</p>
                  </div>
               </div>
               <div className="pt-10 relative z-10">
                  <div className="h-[1px] w-full bg-primary/5 group-hover:bg-gold/20 transition-all mb-4" />
                  <p className="text-[10px] font-black text-gold uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all">Initiate Protocol</p>
               </div>
            </motion.div>
         ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
        {/* Unified Broadcast Dispatcher */}
        <div className="lg:col-span-2 space-y-12">
           <section className="floating-card p-12 space-y-10 relative overflow-hidden h-full border-t-4 border-primary">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <Smartphone size={280} className="rotate-12" />
              </div>

              <div className="space-y-2">
                 <div className="flex items-center gap-3">
                    <Bell size={20} className="text-gold" />
                    <h3 className="text-3xl font-black text-primary dark:text-white uppercase tracking-tighter">Global Broadcast</h3>
                 </div>
                 <p className="text-[10px] font-black text-primary/30 dark:text-white/30 uppercase tracking-[0.4em]">Unified Communication Protocol</p>
              </div>

              <div className="space-y-6 relative z-10">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary/30 dark:text-white/20 uppercase tracking-widest pl-2">System Dispatch Message</label>
                    <textarea 
                       value={broadcastMsg}
                       onChange={(e) => setBroadcastMsg(e.target.value)}
                       placeholder="Enter priority directive for all fulfillment nodes..."
                       className="w-full h-40 bg-bone dark:bg-dark border border-primary/10 p-8 text-sm font-black uppercase tracking-widest focus:outline-none focus:border-gold transition-all resize-none placeholder:text-primary/10 dark:placeholder:text-white/5"
                    />
                 </div>

                 <div className="flex flex-col md:flex-row gap-6">
                    <button 
                       onClick={handleSendBroadcast}
                       className="flex-[2] h-20 bg-primary text-white text-[11px] font-black uppercase tracking-widest hover:bg-gold transition-all flex items-center justify-center gap-4 group shadow-2xl active:scale-95"
                    >
                       Initiated Dispatch <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                    </button>
                    <button 
                       onClick={() => DataService.clearBroadcast()}
                       className="flex-1 h-20 bg-white dark:bg-dark-surface border border-primary/20 text-primary dark:text-white/40 text-[11px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
                    >
                       Halt Sync
                    </button>
                 </div>

                 <AnimatePresence>
                    {showConfirmation && (
                       <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-3 text-gold p-6 bg-gold/5 border border-gold/10"
                       >
                          <Zap size={16} className="animate-pulse" />
                          <p className="text-[10px] font-black uppercase tracking-[0.4em]">Broadcast Committed to Master Registry</p>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
