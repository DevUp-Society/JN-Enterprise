import { 
  Bell, 
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotificationsPage() {
  const notifications: any[] = [];
  const isEmpty = notifications.length === 0;

  return (
    <div className={`bg-[#D6D6D6] min-h-screen selection:bg-[#000000] selection:text-[#D6D6D6] ${isEmpty ? 'h-screen overflow-hidden' : ''}`}>
      <main className={`max-w-[1400px] mx-auto px-8 pt-[40px] pb-32 space-y-12 ${isEmpty ? 'flex items-center justify-center pt-0 h-full' : ''}`}>
        
        {!isEmpty && (
          <>
            {/* Terminal Header (No Filters) */}
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-[#000000]/10 pb-8">
                <h1 className="text-4xl font-black text-[#000000] tracking-tighter uppercase">
                    Notifications_
                </h1>
            </div>

            {/* Unified Notification List */}
            <div className="space-y-6">
              {notifications.map((notif: any, i: number) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group block bg-white p-8 rounded-[40px] border border-[#000000]/5 shadow-sm hover:border-[#000000]/10 transition-all duration-500"
                >
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center flex-shrink-0 ${
                          notif.type === 'success' ? 'bg-[#FFFFFF]/10 text-[#FFFFFF]' :
                          notif.type === 'warning' ? 'bg-black text-black' :
                          'bg-[#D6D6D6] text-[#000000]/40'
                      }`}>
                          {notif.icon}
                      </div>

                      <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                              <h3 className="text-xl font-bold text-[#000000] tracking-tight">{notif.title}</h3>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#000000]/40 flex items-center gap-2">
                                <Clock size={12} /> {notif.time}
                              </span>
                          </div>
                          <p className="text-base text-[#000000]/70 font-normal leading-relaxed max-w-2xl">{notif.message}</p>
                      </div>

                      <div className="flex items-center gap-4">
                          <button className="bg-[#000000] text-white px-8 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#FFFFFF] transition-all shadow-lg active:scale-95">
                            View Log
                          </button>
                      </div>
                    </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {isEmpty && (
           <div className="p-20 text-center space-y-8 bg-white border border-[#000000]/5 rounded-[60px] shadow-sm max-w-sm mx-auto">
               <div className="w-24 h-24 rounded-full bg-[#D6D6D6] flex items-center justify-center mx-auto mb-4">
                  <Bell size={32} className="text-[#000000]/10" />
               </div>
               <div className="space-y-4">
                  <h3 className="text-2xl font-black tracking-tight text-[#000000] uppercase">No Notifications</h3>
                  <p className="text-[10px] font-bold text-[#000000]/40 uppercase tracking-[0.2em] max-w-xs mx-auto text-center">Your JN Enterprise log terminal is currently synchronized and quiet.</p>
               </div>
           </div>
        )}
      </main>
    </div>
  );
}










