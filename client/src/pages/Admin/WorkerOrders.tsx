import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Package, 
  CheckCircle2, 
  Box, 
  ArrowRight, 
  AlertCircle,
  Search,
  Check,
  Zap,
  Info,
  Maximize,
  X,
  Camera,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { DataService } from '../../services/DataService';

export default function WorkerOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'QUEUE' | 'INVENTORY'>('QUEUE');
  const [showScanOverlay, setShowScanOverlay] = useState(false);

  const products = DataService.getProducts();

  useEffect(() => {
    fetchWorkerOrders();
  }, []);

  const fetchWorkerOrders = () => {
    setLoading(true);
    const allOrders = DataService.getOrders();
    // In v4.0, we also show ON_HOLD orders but with a special indicator
    setOrders(allOrders.filter((o: any) => o.status === 'PENDING' || o.status === 'PROCESSING' || o.status === 'ON_HOLD'));
    setLoading(false);
  };

  const completeOrder = (orderId: string) => {
    DataService.updateOrderStatus(orderId, 'PACKED');
    setOrders(prev => prev.filter(o => o.id !== orderId));
    setSelectedOrder(null);
  };

  const handleReportIssue = (orderId: string, type: string) => {
    DataService.reportIssue(orderId, type);
    fetchWorkerOrders();
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter((o: any) => 
    o.retailer.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 md:space-y-12 pb-24 h-full flex flex-col relative">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-4 border-primary/10 pb-8 transition-colors">
         <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-3 h-3 bg-gold animate-pulse" />
               <h2 className="text-4xl md:text-5xl font-black text-primary dark:text-white uppercase tracking-tighter leading-none">FULFILLMENT_HUB_V4</h2>
            </div>
            <p className="text-[10px] font-black text-primary/30 dark:text-white/20 uppercase tracking-[0.5em]">Real-Time Logistics Engine | Status: Live</p>
         </div>
         
         <div className="flex gap-4 w-full md:w-auto">
            <button 
               onClick={() => setActiveTab('QUEUE')}
               className={`flex-1 md:flex-none px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'QUEUE' ? 'bg-primary text-white shadow-xl' : 'bg-bone dark:bg-dark-surface text-primary/40 dark:text-white/40 hover:bg-primary/5'}`}
            >
               QUEUE ({orders.length})
            </button>
            <button 
               onClick={() => setActiveTab('INVENTORY')}
               className={`flex-1 md:flex-none px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'INVENTORY' ? 'bg-primary text-white shadow-xl' : 'bg-bone dark:bg-dark-surface text-primary/40 dark:text-white/40 hover:bg-primary/5'}`}
            >
               INVENTORY PULSE
            </button>
         </div>
      </div>

      {activeTab === 'QUEUE' ? (
        <>
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 py-40">
               <div className="w-16 h-16 border-8 border-primary/5 border-t-gold animate-spin" />
               <p className="text-[11px] font-black text-primary dark:text-white/40 uppercase tracking-[0.4em]">SYNCING NODES...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredOrders.map((o) => (
                  <OrderCard 
                    key={o.id} 
                    order={o} 
                    onClick={() => setSelectedOrder(o)} 
                  />
                ))}
              </AnimatePresence>
              
              {orders.length === 0 && (
                <div className="col-span-full py-48 floating-card flex flex-col items-center justify-center space-y-8">
                   <div className="relative">
                      <CheckCircle2 size={64} className="text-gold opacity-10" />
                      <Zap size={24} className="text-gold absolute -top-2 -right-2 animate-bounce" />
                   </div>
                   <div className="text-center space-y-2">
                      <h4 className="text-3xl font-black text-primary dark:text-white uppercase tracking-tighter leading-none">QUEUE_DEPLETED</h4>
                      <p className="text-[11px] font-bold text-primary/30 dark:text-white/20 uppercase tracking-[0.4em]">All units dispatched successfully</p>
                   </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <InventoryPulse products={products} />
      )}

      {/* Fixed Controllers v4.0 */}
      <div className="fixed bottom-28 md:bottom-12 right-6 md:right-12 z-50 flex flex-col gap-4 items-end">
        {/* Quick Scan FAB */}
        <button 
           onClick={() => setShowScanOverlay(true)}
           className="w-16 h-16 bg-gold text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group"
        >
           <Maximize size={24} className="group-hover:rotate-90 transition-transform" />
        </button>

        {/* Search Toggle */}
        <div className="relative flex items-center group">
          <input 
            type="text"
            placeholder="FILTER REGISTRY..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-16 focus:w-72 h-16 bg-primary text-white pl-16 pr-6 text-[10px] font-black uppercase tracking-widest transition-all duration-500 shadow-2xl focus:outline-none placeholder:text-white/30 border-l-4 border-gold"
          />
          <div className="absolute left-0 w-16 h-16 bg-primary text-white flex items-center justify-center cursor-pointer pointer-events-none">
            <Search size={22} className="group-focus-within:text-gold transition-colors" />
          </div>
        </div>
      </div>

      {/* Quick Scan Simulation Overlay */}
      <AnimatePresence>
         {showScanOverlay && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[200] bg-dark/95 backdrop-blur-xl flex flex-col items-center justify-center p-10"
            >
               <button 
                  onClick={() => setShowScanOverlay(false)}
                  className="absolute top-10 right-10 p-4 text-white/40 hover:text-white transition-colors"
               >
                  <X size={32} />
               </button>

               <div className="w-full max-w-lg aspect-square border-[8px] border-white/10 relative overflow-hidden flex flex-col items-center justify-center">
                  {/* Scanner Graphic */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gold shadow-[0_0_20px_#C6AD8F] animate-scan" />
                  
                  <Camera size={80} className="text-white/10 mb-8" />
                  <div className="text-center space-y-2">
                     <p className="text-[12px] font-black text-white uppercase tracking-[0.5em] animate-pulse">Ready to Scan SKU_CODE</p>
                     <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">v4.0 Vision Protocol Active</p>
                  </div>

                  {/* Corner Marks */}
                  <div className="absolute top-10 left-10 w-10 h-10 border-t-4 border-l-4 border-gold" />
                  <div className="absolute top-10 right-10 w-10 h-10 border-t-4 border-r-4 border-gold" />
                  <div className="absolute bottom-10 left-10 w-10 h-10 border-b-4 border-l-4 border-gold" />
                  <div className="absolute bottom-10 right-10 w-10 h-10 border-b-4 border-r-4 border-gold" />
               </div>
               
               <div className="mt-12 text-center">
                  <p className="text-[11px] font-black text-gold uppercase tracking-[0.4em] mb-4 underline cursor-pointer hover:text-white transition-colors">Switch to Manual entry_</p>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedOrder && (
          <PackingList 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
            onPack={() => completeOrder(selectedOrder.id)}
            onReportIssue={(type: string) => handleReportIssue(selectedOrder.id, type)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function OrderCard({ order, onClick }: any) {
  const isOnHold = order.status === 'ON_HOLD';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
      onClick={onClick}
      className={`floating-card p-10 cursor-pointer hover:border-gold hover:shadow-2xl transition-all group relative overflow-hidden ${isOnHold ? 'border-red-500/50 grayscale' : ''}`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[40px] pointer-events-none group-hover:opacity-100 transition-all duration-700 ${isOnHold ? 'bg-red-500/10' : 'bg-primary/5 group-hover:bg-gold/10'}`} />
      
      <div className="space-y-8 relative z-10">
         <div className="flex justify-between items-start">
            <div className="space-y-1.5 overflow-hidden">
               <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isOnHold ? 'text-red-500/40' : 'text-primary/30 dark:text-white/20'}`}>{order.id}_UNIT</p>
               <h3 className="text-xl font-black text-primary dark:text-white uppercase tracking-tight truncate max-w-[180px] leading-none">{order.retailer}</h3>
               <div className="flex gap-2">
                  <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${order.priority === 'HIGH' ? 'bg-red-500 text-white' : 'bg-primary/10 dark:bg-white/10 text-primary dark:text-white/60'}`}>
                     {order.priority || 'STANDARD'}_PRIORITY
                  </span>
                  {isOnHold && (
                    <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest bg-red-600 text-white flex items-center gap-1">
                       <AlertTriangle size={8} /> ISSUE_HELD
                    </span>
                  )}
               </div>
            </div>
            <div className={`w-14 h-14 flex items-center justify-center transition-all transform group-hover:rotate-12 ${isOnHold ? 'bg-red-500/10 text-red-500' : 'bg-bone dark:bg-dark-surface text-primary/10 group-hover:bg-primary group-hover:text-white'}`}>
               {isOnHold ? <AlertCircle size={24} /> : <Package size={24} />}
            </div>
         </div>

         <div className="flex justify-between items-end border-t border-primary/5 pt-8">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-primary/20 dark:text-white/20 uppercase tracking-widest leading-none">Load Volume</p>
               <p className={`text-4xl font-black tracking-tighter leading-none ${isOnHold ? 'text-red-500/50' : 'text-primary dark:text-white'}`}>{order.itemsCount}</p>
            </div>
            <div className={`flex items-center gap-3 transition-transform ${isOnHold ? 'text-red-500' : 'text-gold group-hover:translate-x-3'}`}>
               <span className="text-[10px] font-black uppercase tracking-widest">{isOnHold ? 'VIEW ISSUE' : 'DRAG TO COMMIT'}</span>
               <ArrowRight size={18} />
            </div>
         </div>
      </div>
    </motion.div>
  );
}

function InventoryPulse({ products }: { products: any[] }) {
  const [filter, setFilter] = useState('');
  
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase()) || 
    p.sku.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 50);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
       <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
          <input 
             type="text" 
             placeholder="QUICK_SCAN_INVENTORY_SKU..."
             value={filter}
             onChange={(e) => setFilter(e.target.value)}
             className="w-full h-20 bg-white dark:bg-dark-surface border border-primary/10 dark:border-white/5 pl-16 pr-8 text-sm font-black text-primary dark:text-white uppercase tracking-widest focus:outline-none focus:border-gold transition-all shadow-sm"
          />
       </div>

       <div className="grid grid-cols-1 gap-4">
          {filtered.map(p => (
             <div key={p.id} className="floating-card p-6 flex items-center justify-between group hover:bg-bone dark:hover:bg-primary/5 transition-all">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 bg-bone dark:bg-dark border border-primary/5 flex items-center justify-center overflow-hidden">
                      <img src={p.image} className="w-full h-full object-cover grayscale opacity-50" alt="" />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-primary/30 dark:text-white/20 uppercase tracking-widest mb-0.5">{p.sku}</p>
                      <h5 className="text-[14px] font-black text-primary dark:text-white uppercase tracking-tight">{p.name}</h5>
                   </div>
                </div>
                <div className="text-right">
                   <p className={`text-2xl font-black tracking-tighter leading-none ${p.stock < 50 ? 'text-gold' : 'text-primary dark:text-white'}`}>
                      {p.stock}
                   </p>
                   <p className="text-[8px] font-black text-primary/30 dark:text-white/20 uppercase tracking-widest mt-1">AVAILABLE_BAL</p>
                </div>
             </div>
          ))}
       </div>
    </motion.div>
  );
}

function PackingList({ order, onClose, onPack, onReportIssue }: any) {
  const [packedItems, setPackedItems] = useState<string[]>([]);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 200], [1, 0]);
  const scale = useTransform(x, [0, 200], [1, 0.9]);

  const toggleItem = (sku: string) => {
    setPackedItems(prev => 
      prev.includes(sku) ? prev.filter(s => s !== sku) : [...prev, sku]
    );
  };

  const allPacked = packedItems.length === (order.items?.length || 0);

  const handleDragEnd = (_: any, info: any) => {
    if (allPacked && info.offset.x > 150) {
      onPack();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 md:p-12 overflow-hidden"
    >
      <div onClick={onClose} className="absolute inset-0 bg-primary/40 dark:bg-black/80 backdrop-blur-xl" />
      
      <motion.div 
        style={{ x, opacity, scale }}
        drag={allPacked ? "x" : false}
        dragConstraints={{ left: 0, right: 300 }}
        onDragEnd={handleDragEnd}
        className="w-full max-w-5xl bg-white dark:bg-dark h-[90vh] md:h-[800px] shadow-2xl flex flex-col relative z-20 border border-primary/10 overflow-hidden"
      >
        <div className="md:hidden w-16 h-1.5 bg-primary/10 rounded-full mx-auto my-6" />
        
        <header className="px-10 py-12 md:px-20 md:py-16 border-b border-primary/5 bg-bone dark:bg-dark-surface flex justify-between items-end transition-colors">
           <div className="space-y-3">
              <div className="flex items-center gap-3">
                 <Package size={16} className="text-gold" />
                 <p className="text-[10px] font-black text-primary/40 dark:text-white/40 uppercase tracking-[0.3em]">COMMAND_MANIFEST: {order.id}</p>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-primary dark:text-white uppercase tracking-tighter leading-none truncate max-w-[300px] md:max-w-md">{order.retailer}</h3>
           </div>
           <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-primary/20 dark:text-white/20 uppercase tracking-widest leading-none mb-1">UNITS_READY</p>
              <p className="text-5xl font-black text-primary dark:text-white tracking-tighter leading-none">{packedItems.length}/{order.items?.length || 0}</p>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 md:p-20 space-y-12 bg-white dark:bg-dark transition-colors">
            <div className="space-y-4">
               {order.items?.map((item: any) => {
                  const isPacked = packedItems.includes(item.sku);
                  return (
                    <motion.div 
                       key={item.sku} 
                       onClick={() => toggleItem(item.sku)}
                       whileTap={{ scale: 0.98 }}
                       className={`p-8 md:p-10 flex items-center gap-8 cursor-pointer border transition-all duration-300 relative overflow-hidden ${isPacked ? 'bg-primary border-primary' : 'bg-white dark:bg-dark-surface border-primary/5 hover:border-primary/20 shadow-sm'}`}
                    >
                       {isPacked && <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 0.5 }} className="absolute inset-0 bg-gold/10 skew-x-12 pointer-events-none" />}
                       
                       <div className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center transition-all ${isPacked ? 'bg-white text-primary' : 'bg-bone dark:bg-dark text-primary/20'}`}>
                          {isPacked ? <Check size={24} strokeWidth={4} /> : <Box size={24} />}
                       </div>
                       
                       <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="overflow-hidden">
                             <p className={`text-[9px] font-black uppercase tracking-widest mb-1 transition-all ${isPacked ? 'text-white/40' : 'text-primary/20 dark:text-white/20'}`}>{item.sku}</p>
                             <h5 className={`text-lg md:text-xl font-black uppercase tracking-tight leading-tight truncate transition-all ${isPacked ? 'text-white' : 'text-primary dark:text-white'}`}>{item.name}</h5>
                          </div>
                          <div className="text-left md:text-right">
                             <div className="flex items-baseline gap-2 justify-start md:justify-end">
                                <p className={`text-4xl md:text-5xl font-black tracking-tighter transition-all ${isPacked ? 'text-white' : 'text-primary dark:text-white'}`}>{item.qty}</p>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${isPacked ? 'text-white/40' : 'text-primary/30'}`}>PCS</p>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                  );
               })}
            </div>
        </div>

        <footer className="px-10 py-12 md:px-20 md:py-14 bg-bone dark:bg-dark-surface border-t border-primary/10 transition-colors">
           {allPacked ? (
             <div className="space-y-6">
                <div className="flex items-center gap-4 text-gold mb-4 animate-pulse">
                   <Info size={16} />
                   <p className="text-[10px] font-black uppercase tracking-[0.3em]">SWIPE RIGHT TO DISPATCH_</p>
                </div>
                <div className="relative h-20 bg-primary/10 dark:bg-white/5 border border-primary/20 flex items-center justify-center group overflow-hidden">
                   <motion.div 
                      animate={{ x: [0, 40, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute left-8 text-primary/30 dark:text-white/20"
                   >
                      <ArrowRight size={28} />
                   </motion.div>
                   <p className="text-[12px] font-black text-primary dark:text-white uppercase tracking-[0.5em] z-10">DISPATCH_HUB_01</p>
                   <div className="absolute inset-0 bg-gold/5 group-hover:bg-gold/10 transition-all pointer-events-none" />
                </div>
             </div>
           ) : (
             <div className="flex flex-col md:flex-row gap-6">
                <button 
                  onClick={() => setShowIssueModal(true)}
                  className="flex-1 h-20 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                   <AlertTriangle size={20} />
                   REPORT ISSUE_
                </button>
                <div className="flex-[2] h-20 bg-primary/5 dark:bg-white/5 border border-dashed border-primary/10 flex items-center justify-center gap-4 text-primary/30 dark:text-white/20">
                   <Flame size={18} />
                   <span className="text-[10px] font-black uppercase tracking-widest tracking-[0.2em]">PENDING_VERIFICATION</span>
                </div>
             </div>
           )}
        </footer>

        {/* Issue Reporting Overlay */}
        <AnimatePresence>
           {showIssueModal && (
             <motion.div 
               initial={{ opacity: 0, y: 100 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 100 }}
               className="absolute inset-0 z-50 bg-white dark:bg-dark p-12 flex flex-col justify-center gap-12"
             >
               <div className="space-y-4">
                  <h3 className="text-4xl font-black text-red-500 uppercase tracking-tighter">REPORT_LOGISTICS_ISSUE</h3>
                  <p className="text-[11px] font-bold text-primary/40 dark:text-white/40 uppercase tracking-widest">Select failure node category below</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { type: 'STOCK_OUT', icon: Box, label: 'INSUFFICIENT_STOCK' },
                    { type: 'DAMAGED', icon: AlertTriangle, label: 'DAMAGED_EQUIPMENT' },
                    { type: 'SKU_MISMATCH', icon: Flame, label: 'REGISTRY_ERROR' }
                  ].map(issue => (
                    <button 
                      key={issue.type}
                      onClick={() => onReportIssue(issue.type)}
                      className="p-10 border-2 border-primary/5 hover:border-red-500 bg-bone dark:bg-dark-surface transition-all flex flex-col items-center gap-6 group"
                    >
                      <issue.icon size={32} className="text-primary/20 group-hover:text-red-500 transition-colors" />
                      <span className="text-[10px] font-black text-primary dark:text-white uppercase tracking-widest">{issue.label}</span>
                    </button>
                  ))}
               </div>

               <button 
                onClick={() => setShowIssueModal(false)}
                className="w-full py-6 border border-primary/10 text-[10px] font-black text-primary/40 uppercase tracking-widest hover:bg-primary/5 transition-all"
               >
                 CANCEL_REPORT
               </button>
             </motion.div>
           )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
