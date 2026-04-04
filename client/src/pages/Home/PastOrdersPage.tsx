import { useState, useEffect } from 'react';
import { CheckCircle2, RotateCcw, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../store/CartContext';

export default function PastOrdersPage() {
  const { createCart, addItem } = useCart();
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

  const pastOrders = orders.filter(o => o.status === 'DELIVERED' || o.status === 'CANCELLED');

  const handleRebatch = (items: any[]) => {
    const cartName = `Re-Batch [${new Date().toLocaleDateString()}]`;
    createCart(cartName);
    const cartItems = items.map(i => ({
       cartItemId: `rb-${Date.now()}-${i.product.name}`,
       productId: i.productId,
       name: i.product.name,
       price: i.pricePaid,
       image: i.product.image,
       sku: i.product.sku,
       size: 'L', 
       quantity: i.quantity
    }));
    addItem(cartItems);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="bg-[#D6D6D6] min-h-screen flex items-center justify-center font-sans">
         <div className="w-10 h-10 border-4 border-[#000000]/10 border-t-[#000000] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#D6D6D6] min-h-screen selection:bg-[#000000] selection:text-[#D6D6D6] font-sans">
       <main className="max-w-[1400px] mx-auto px-8 pt-[40px] pb-32 space-y-12">
          
          {/* Simplified Header */}
          <div className="flex justify-between items-end border-b border-[#000000]/10 pb-6">
              <h1 className="text-4xl font-black text-[#000000] tracking-tight uppercase">
                  Past Orders
              </h1>
              {pastOrders.length > 0 && (
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#000000] hover:text-[#FFFFFF] transition-all bg-white px-8 py-4 rounded-2xl border border-[#000000]/10 shadow-sm">
                   <Filter size={16} /> Filter
                </button>
              )}
          </div>

          <div className="space-y-8">
            {pastOrders.length === 0 ? (
               <div className="p-10 max-w-md mx-auto text-center space-y-6 bg-white border border-[#000000]/10 rounded-[40px] shadow-sm my-20">
                  <div className="w-20 h-20 rounded-full bg-[#D6D6D6] flex items-center justify-center mx-auto border border-[#000000]/5">
                     <CheckCircle2 size={32} className="text-[#000000]/30" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-xl font-bold tracking-tight text-[#000000]">Past Orders Empty</h3>
                     <p className="text-[13px] font-medium text-[#000000]/60 leading-relaxed">Your procurement history is currently synchronized with zero archived logs.</p>
                  </div>
                  <div className="pt-2">
                     <button 
                       onClick={() => navigate('/home')}
                       className="w-full inline-flex items-center justify-center gap-2 bg-[#000000] text-white font-bold uppercase text-[11px] tracking-widest py-4 px-8 rounded-2xl hover:bg-[#D6D6D6] hover:text-[#000000] transition-all shadow-lg active:scale-95"
                     >
                        SHOP NOW
                     </button>
                  </div>
               </div>
            ) : (
               <div className="grid grid-cols-1 gap-6">
                  {pastOrders.map(order => (
                     <motion.div 
                       key={order.id} 
                       initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                       className="bg-white p-6 md:p-10 border border-black/[0.03] rounded-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-black/10 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-700 text-left relative overflow-hidden"
                     >
                        {/* Diagonal Accent */}
                        <div className="absolute top-0 left-0 w-2 h-full bg-black/5 group-hover:bg-black transition-colors duration-700" />

                        <div className="flex items-center gap-8 w-full md:w-auto">
                           <div className="w-20 h-20 bg-[#F7F7F7] rounded-[8px] flex items-center justify-center text-black/10 group-hover:bg-black group-hover:text-white transition-all duration-700 shadow-inner">
                               <CheckCircle2 size={28} />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.4em] mb-1">LOG_ID: {order.id.split('-')[0].toUpperCase()}</p>
                              <div className="flex items-center gap-4">
                                <h3 className="text-3xl font-black text-black tracking-tighter uppercase leading-none">{order.status}</h3>
                                <span className="h-6 px-3 flex items-center bg-black/5 rounded-full text-[9px] font-bold text-black/40 tracking-widest uppercase italic">ARCHIVED</span>
                              </div>
                              <p className="text-[11px] font-medium text-black/30 mt-3 uppercase tracking-[0.1em]">{new Date(order.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                        </div>
                        
                        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-12 border-t md:border-t-0 border-black/5 pt-6 md:pt-0">
                           <div className="md:text-right">
                              <p className="text-[10px] font-black text-black/20 uppercase tracking-widest mb-1">REMITTANCE</p>
                              <p className="text-4xl font-black text-black tracking-tighter uppercase">₹{Number(order.totalValue).toLocaleString()}</p>
                           </div>
                           <button 
                             onClick={() => handleRebatch(order.items)}
                             className="h-16 px-10 bg-black text-white rounded-[24px] font-black uppercase text-[11px] tracking-widest hover:bg-black/80 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 group/btn overflow-hidden relative"
                           >
                              <span className="relative z-10">RE-BATCH</span>
                              <RotateCcw size={18} className="relative z-10 group-hover/btn:rotate-[-180deg] transition-transform duration-700" />
                           </button>
                        </div>
                     </motion.div>
                  ))}
               </div>
            )}
          </div>
       </main>
    </div>
  )
}
