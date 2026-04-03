import { 
  Bell, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Activity,
  AlertTriangle,
  Package
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotificationsPage() {
  const notifications = [
    { 
      id: 1, 
      title: "Consignment Dispatched", 
      message: "Batch #Z-990-X has been initialized for transit to the Mumbai Distribution Hub.", 
      time: "2 hours ago", 
      type: "success", 
      icon: <CheckCircle2 size={18} /> 
    },
    { 
      id: 2, 
      title: "Stock Depletion Alert", 
      message: "Industrial Zinc-Coated Wall Hooks are currently below the critical MOQ threshold.", 
      time: "5 hours ago", 
      type: "warning", 
      icon: <AlertTriangle size={18} /> 
    },
    { 
      id: 3, 
      title: "Procurement Finalized", 
      message: "Requisition #R-102 has been successfully audited and finalized for fulfillment.", 
      time: "Yesterday", 
      type: "info", 
      icon: <Package size={18} /> 
    },
    { 
      id: 4, 
      title: "System Update", 
      message: "Global Distribution Network Matrix version 2.4 is now operational.", 
      time: "2 days ago", 
      type: "info", 
      icon: <Activity size={18} /> 
    }
  ];

  return (
    <div className="bg-[#F6F4F2] min-h-screen">
      <main className="max-w-[1400px] mx-auto px-8 pt-[120px] pb-32 space-y-12">
        
        {/* Terminal Header */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-[#425664]/10 pb-8">
           <h1 className="text-3xl font-bold text-[#425664] tracking-tight lowercase pt-2 leading-tight">
              notifications
           </h1>
           <div className="flex gap-4">
              <button className="flex items-center gap-2 text-base font-medium lowercase text-[#C6AD8F] hover:text-[#111827] transition-all bg-white px-8 py-3.5 rounded-2xl border border-[#425664]/5 shadow-sm">
                 <Filter size={16} /> filter option
              </button>
           </div>
        </div>

        {/* Unified Notification List */}
        <div className="space-y-6">
           {notifications.map((notif, i) => (
             <motion.div
               key={notif.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.05 }}
               className="group block bg-white p-8 rounded-[40px] border border-[#425664]/5 shadow-sm hover:border-[#C6AD8F]/30 hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
             >
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                   <div className={`w-16 h-16 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-inner ${
                      notif.type === 'success' ? 'bg-green-50 text-green-500' :
                      notif.type === 'warning' ? 'bg-red-50 text-red-500' :
                      'bg-[#F6F4F2] text-[#425664]/40'
                   }`}>
                      {notif.icon}
                   </div>

                   <div className="flex-1 space-y-2">
                       <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-[#425664] tracking-tight">{notif.title}</h3>
                          <span className="text-xs font-medium uppercase tracking-widest text-[#6B7280] flex items-center gap-2">
                             <Clock size={12} /> {notif.time}
                          </span>
                       </div>
                       <p className="text-base text-[#6B7280] font-normal leading-relaxed max-w-2xl">{notif.message}</p>
                   </div>

                   <div className="flex items-center gap-4">
                      <button className="bg-[#425664] text-white px-8 py-3 rounded-2xl text-sm font-medium uppercase tracking-widest hover:bg-[#111827] transition-all">
                         View Log
                      </button>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        {notifications.length === 0 && (
           <div className="py-60 text-center space-y-8 bg-white border border-[#425664]/5 rounded-[60px] shadow-sm">
               <div className="w-32 h-32 rounded-full bg-[#F6F4F2] flex items-center justify-center mx-auto mb-4">
                  <Bell size={48} className="text-[#425664]/10" />
               </div>
               <div className="space-y-4">
                  <h3 className="text-2xl font-semibold tracking-tight text-[#425664]/20 uppercase">No System Logs_</h3>
                  <p className="text-xs font-medium text-[#6B7280] uppercase tracking-widest max-w-xs mx-auto">The JN Global notification terminal currently contains no operational logs.</p>
               </div>
           </div>
        )}
      </main>
    </div>
  );
}
