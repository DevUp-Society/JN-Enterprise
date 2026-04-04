import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Box, 
  Search,
  ChevronRight,
  Maximize,
  X,
  Camera
} from 'lucide-react';
import { DataService } from '../../services/DataService';

export default function WorkerOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScanOverlay, setShowScanOverlay] = useState(false);

  useEffect(() => {
    fetchWorkerOrders();
  }, []);

  const fetchWorkerOrders = () => {
    setLoading(true);
    try {
      const allOrders = DataService.getOrders();
      setOrders(allOrders.filter((o: any) => o.status === 'PENDING' || o.status === 'PROCESSING' || o.status === 'ON_HOLD'));
    } catch (e) {
      console.error('FETCH_ORDERS_FAILURE', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((o: any) => 
    (o.retailer || o.company?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (o.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const metrics = {
    unpacked: orders.filter(o => o.status === 'PENDING').length,
    units: orders.reduce((acc, o) => acc + (o.itemsCount || o.items?.length || 0), 0),
    urgent: orders.filter(o => o.status === 'PROCESSING').length
  };

  return (
    <div className="space-y-8 md:space-y-12 pb-24 h-full flex flex-col relative select-none">
      {/* 1. OPERATIVE METRICS HUB */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white rounded-[32px] border border-black/5 p-8 shadow-sm flex flex-col gap-4">
            <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">Unpacked_Orders</p>
            <div className="flex items-end justify-between">
               <h2 className="text-5xl font-black text-black tracking-tighter">{metrics.unpacked}</h2>
               <div className="px-3 py-1 bg-[#FFEB3B] rounded-full text-[9px] font-black uppercase tracking-widest">Action_Required</div>
            </div>
         </div>
         <div className="bg-black rounded-[32px] p-8 shadow-2xl flex flex-col gap-4 text-white">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Pending_Units</p>
            <div className="flex items-end justify-between">
               <h2 className="text-5xl font-black text-white tracking-tighter">{metrics.units}</h2>
               <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                  <Box size={16} />
               </div>
            </div>
         </div>
         <div className="bg-white rounded-[32px] border border-black/5 p-8 shadow-sm flex flex-col gap-4">
            <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">Urgent_Manifests</p>
            <div className="flex items-end justify-between">
               <h2 className="text-5xl font-black text-black tracking-tighter">{metrics.urgent}</h2>
               <div className="px-3 py-1 bg-black text-white rounded-full text-[9px] font-black uppercase tracking-widest">High_Priority</div>
            </div>
         </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-40">
           <div className="w-16 h-16 border-4 border-[#000000]/5 border-t-[#000000] rounded-full animate-spin" />
           <p className="text-xs font-bold text-[#000000]/40 uppercase tracking-widest">Synchronizing Queue...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-black uppercase tracking-tight">Active fulfillment queue_</h3>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Live Ledger Stream</span>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredOrders.map((o: any) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                key={o.id}
                onClick={() => navigate(`/worker/orders/${o.id}`)}
                className="group bg-white rounded-[32px] border border-black/5 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:shadow-2xl hover:border-black/20 transition-all cursor-pointer overflow-hidden relative shadow-sm"
              >
                 <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${
                      o.status === 'PENDING' ? 'bg-[#FFEB3B]/10 border-[#FFEB3B]' :
                      o.status === 'PROCESSING' ? 'bg-[#2196F3]/10 border-[#2196F3]' :
                      'bg-black/10 border-black'
                    }`}>
                       <Box className={
                         o.status === 'PENDING' ? 'text-black' :
                         o.status === 'PROCESSING' ? 'text-[#2196F3]' :
                         'text-black'
                       } size={28} />
                    </div>
                    <div>
                       <div className="flex items-center gap-3 mb-1">
                          <p className="text-[10px] font-black text-black/30 uppercase tracking-widest">ORDER_{o.id.slice(0, 8)}</p>
                          <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            o.status === 'PENDING' ? 'bg-[#FFEB3B] text-black' : 'bg-black text-white'
                          }`}>
                            {o.status}
                          </div>
                       </div>
                       <h4 className="text-2xl font-black text-black uppercase tracking-tighter italic group-hover:tracking-normal transition-all">
                         {o.retailer || o.company?.name || 'MANUAL_ENTRY'}
                       </h4>
                    </div>
                 </div>

                 <div className="flex items-center gap-12">
                    <div className="text-right hidden md:block">
                       <p className="text-[10px] font-black text-black/30 uppercase tracking-widest mb-1">ORDERED_DATE</p>
                       <p className="text-xs font-bold text-black uppercase">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-black/30 uppercase tracking-widest mb-1">TOTAL_UNITS</p>
                       <p className="text-xs font-bold text-black uppercase">{o.itemsCount || o.items?.length || 0} Units</p>
                    </div>
                    <div className="p-4 bg-black/5 rounded-full group-hover:bg-black group-hover:text-white transition-all">
                       <ChevronRight size={20} />
                    </div>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {orders.length === 0 && (
            <div className="py-40 bg-white border border-[#000000]/5 rounded-[32px] flex flex-col items-center justify-center space-y-6 shadow-sm">
               <div className="w-24 h-24 bg-[#D6D6D6] rounded-full flex items-center justify-center mb-2">
                   <CheckCircle2 size={48} className="text-[#000000] opacity-50" />
               </div>
               <div className="text-center space-y-2">
                  <h4 className="text-2xl font-semibold text-[#000000] tracking-tight">Queue Completed</h4>
                  <p className="text-sm font-medium text-[#000000]/60">All assigned units have been dispatched successfully</p>
               </div>
               <button onClick={fetchWorkerOrders} className="text-xs font-bold text-[#000000] uppercase tracking-widest hover:underline">Request Fresh Queue_</button>
            </div>
          )}
        </div>
      )}

      {/* 3. SYSTEM CONTROLLERS */}
      <div className="fixed bottom-28 md:bottom-12 right-6 md:right-12 z-[50] flex flex-col gap-6 items-end">
        <motion.button 
           whileHover={{ scale: 1.1 }}
           whileTap={{ scale: 0.9 }}
           onClick={() => setShowScanOverlay(true)}
           className="w-16 h-16 bg-[#000000] text-white flex items-center justify-center rounded-full shadow-2xl transition-all group border border-white/10"
        >
           <Maximize size={24} className="group-hover:rotate-90 transition-transform" />
        </motion.button>

        <div className="relative flex items-center group">
          <input 
            type="text"
            placeholder="Filter active queue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-16 focus:w-80 h-16 rounded-full bg-white text-[#000000] pl-16 pr-8 text-sm font-semibold transition-all duration-500 shadow-2xl border border-[#000000]/5 focus:border-[#000000] focus:outline-none placeholder:text-[#000000]/30"
          />
          <div className="absolute left-0 w-16 h-16 rounded-full flex items-center justify-center cursor-pointer pointer-events-none text-[#000000]/40 group-focus-within:text-[#000000]">
            <Search size={22} className="transition-colors" />
          </div>
        </div>
      </div>

      <AnimatePresence>
         {showScanOverlay && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[1000] bg-[#000000]/95 backdrop-blur-xl flex flex-col items-center justify-center p-10"
            >
               <button 
                  onClick={() => setShowScanOverlay(false)}
                  className="absolute top-10 right-10 p-4 text-white/40 hover:text-white transition-colors"
               >
                  <X size={32} />
               </button>

               <div className="w-full max-w-lg aspect-square border-[10px] border-white/10 relative overflow-hidden flex flex-col items-center justify-center rounded-[40px] bg-black/40">
                  <motion.div 
                    animate={{ y: [0, 480, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-full h-1.5 bg-white shadow-[0_0_30px_rgba(255,255,255,0.5)] z-10" 
                  />
                  
                  <div className="p-12 rounded-full relative z-0 bg-white/5">
                     <Camera size={80} className="text-white/20" />
                  </div>
                  <div className="text-center space-y-4 mt-8">
                     <p className="text-[14px] font-bold text-white uppercase tracking-[0.5em] animate-pulse">Scanning Registry SKU_</p>
                     <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">v4.2 Vision Protocol Integrated</p>
                  </div>

                  <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-white/20 rounded-tl-2xl" />
                  <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-white/20 rounded-tr-2xl" />
                  <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-white/20 rounded-bl-2xl" />
                  <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-white/20 rounded-br-2xl" />
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
