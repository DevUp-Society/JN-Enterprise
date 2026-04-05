import { useState, useEffect } from 'react';
import { 
  Package, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const activeOrders = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center font-sans">
         <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen selection:bg-black selection:text-white font-sans">
       <main className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-6 pb-32 space-y-8 md:space-y-12">
          
          {/* Simplified Responsive Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-black/10 pb-6 gap-4">
              <h1 className="text-2xl md:text-4xl font-black text-black tracking-tight uppercase">
                  Active Orders
              </h1>
              {activeOrders.length > 0 && (
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black hover:text-white transition-all bg-[#D6D6D6] px-6 py-3 rounded-[6px] border border-black/10 shadow-sm active:scale-95">
                   <Filter size={14} /> Filter
                </button>
              )}
          </div>

          {activeOrders.length === 0 ? (
             <div className="p-8 md:p-10 max-w-md mx-auto text-center space-y-6 bg-[#D6D6D6] border border-black/10 rounded-[12px] shadow-sm my-20">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto border border-black/5">
                   <Package size={28} className="text-black/30" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-lg md:text-xl font-bold tracking-tight text-black uppercase">Active Orders Empty</h3>
                   <p className="text-[12px] md:text-[13px] font-black text-black/40 leading-relaxed uppercase">Your active procurement terminal is currently synchronized with zero requisitions.</p>
                </div>
                <div className="pt-2">
                   <button 
                     onClick={() => navigate('/home')}
                     className="w-full inline-flex items-center justify-center gap-2 bg-black text-white font-bold uppercase text-[10px] tracking-widest py-4 px-8 rounded-[6px] hover:bg-white hover:text-black transition-all shadow-md active:scale-95"
                   >
                      SHOP NOW
                   </button>
                </div>
             </div>
          ) : (
             <div className="space-y-4 md:space-y-6">
                {activeOrders.map(order => (
                   <motion.div 
                     key={order.id} 
                     initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                     className="bg-[#D6D6D6] p-6 md:p-8 border border-black/10 rounded-[12px] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 group hover:border-black transition-all text-left relative overflow-hidden"
                   >
                      <div className="flex items-center gap-6 w-full sm:w-auto">
                         <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-[8px] flex items-center justify-center text-black/20 group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                            <Package className="w-6 h-6 md:w-7 md:h-7" />
                         </div>
                         <div className="min-w-0">
                            <p className="text-[9px] font-black text-black/30 uppercase tracking-[0.3em] mb-1 leading-none">REQ_{order.id.split('-')[0]}</p>
                            <p className="text-xl md:text-2xl font-black text-black tracking-tighter uppercase leading-none truncate">{order.status}</p>
                         </div>
                      </div>
                      
                      <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-10 border-t sm:border-t-0 border-black/10 pt-6 sm:pt-0">
                         <div className="sm:text-right">
                            <p className="text-[9px] font-black text-black/30 uppercase tracking-widest mb-1 leading-none">TERMINAL VALUE</p>
                            <p className="text-2xl md:text-3xl font-black text-black tracking-tighter uppercase leading-none">₹{Number(order.totalValue).toLocaleString()}</p>
                         </div>
                         <button className="h-12 w-12 rounded-[6px] border border-black/10 bg-white flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm shrink-0">
                            <ArrowRight size={18} />
                         </button>
                      </div>
                   </motion.div>
                ))}
             </div>
          )}
       </main>
    </div>
  )
}
