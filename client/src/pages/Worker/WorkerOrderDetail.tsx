import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  CheckCircle2, 
  ShieldCheck,
  Box,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DataService } from '../../services/DataService';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    name: string;
    sku: string;
    imageUrl?: string;
  };
  verified?: boolean;
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  company: {
    name: string;
    logoUrl?: string;
  };
  items: OrderItem[];
}

export default function WorkerOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [finalizing, setFinalizing] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const details = await DataService.getOrderById(id);
        if (details) {
          setOrder(details);
          // Initialize checkboxes
          const initialChecked: Record<string, boolean> = {};
          details.items.forEach((item: any) => {
            initialChecked[item.id] = false;
          });
          setCheckedItems(initialChecked);
        }
      } catch (error) {
        console.error('FETCH_ORDER_FAILURE:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const toggleItem = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const allChecked = order?.items.every(item => checkedItems[item.id]) ?? false;

  const handleFinalize = async () => {
    if (!order || !allChecked) return;
    setFinalizing(true);
    try {
      await DataService.updateOrderStatus(order.id, 'COMPLETED');
      // Success feedback would go here, then navigate back
      setTimeout(() => {
        navigate('/worker/orders');
      }, 800);
    } catch (error) {
      console.error('FINALIZATION_FAILURE:', error);
    } finally {
      setFinalizing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Synchronizing Ledger...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <AlertCircle size={48} className="text-black/20" />
        <h2 className="text-xl font-bold text-black uppercase tracking-tight">Order Terminal Inaccessible</h2>
        <button 
          onClick={() => navigate('/worker/orders')}
          className="px-8 py-3 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
        >
          Return to Queue
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 select-none pb-32">
      {/* Dynamic Header Node */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/worker/orders')}
            className="p-4 bg-white hover:bg-black hover:text-white rounded-[24px] transition-all shadow-sm border border-black/5 group"
          >
            <ArrowLeft size={20} className="group-active:scale-90 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
               <h1 className="text-3xl font-black text-black tracking-tighter uppercase leading-none">
                  ORDER_{order.id.slice(0, 8)}
               </h1>
               <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                 order.status === 'PENDING' ? 'bg-[#FFEB3B] text-black' : 'bg-black text-white'
               }`}>
                 {order.status}
               </div>
            </div>
            <div className="flex items-center gap-4">
               <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">Ordered Date: {new Date(order.createdAt).toLocaleDateString()}</p>
               <div className="w-1 h-1 rounded-full bg-black/10" />
               <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">
                  {Object.values(checkedItems).filter(Boolean).length} / {order.items.length} Verified Products
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logistics Manifest */}
      <div className="bg-white rounded-[40px] border border-black/5 shadow-sm overflow-hidden">
         <div className="px-10 py-8 border-b border-black/5 bg-black/[0.01] flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-black rounded-xl text-white">
                  <Box size={20} />
               </div>
               <div>
                  <h3 className="text-lg font-black text-black uppercase tracking-tight">Units Verification</h3>
                  <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Verify units for shipment</p>
               </div>
            </div>
         </div>

         <div className="divide-y divide-black/5">
            {order.items.map((item) => (
              <motion.div 
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex items-center gap-8 px-10 py-10 transition-all cursor-pointer group ${
                  checkedItems[item.id] ? 'bg-black/[0.02]' : 'hover:bg-black/[0.01]'
                }`}
              >
                <div className="relative">
                   <div className={`w-12 h-12 border-2 rounded-xl flex items-center justify-center transition-all ${
                     checkedItems[item.id] ? 'bg-black border-black text-white' : 'border-black/20'
                   }`}>
                      {checkedItems[item.id] && <CheckCircle2 size={24} />}
                   </div>
                </div>

                <div className="w-24 h-24 bg-[#D6D6D6] rounded-24 overflow-hidden border border-black/5 relative group-hover:scale-105 transition-transform flex items-center justify-center">
                   {item.product.imageUrl ? (
                     <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover grayscale" />
                   ) : (
                      <Package size={40} className="text-black/10" />
                   )}
                </div>

                <div className="flex-1 min-w-0">
                   <p className="text-[11px] font-black text-black/30 uppercase tracking-[0.2em] mb-1">{item.product.sku}</p>
                   <h4 className="text-2xl font-bold text-black uppercase tracking-tight group-hover:tracking-wide transition-all truncate">
                      {item.product.name}
                   </h4>
                   <div className="flex items-center gap-6 mt-3">
                      <div className="px-4 py-1.5 bg-black/[0.03] rounded-full flex items-center gap-2">
                         <span className="text-[10px] font-black text-black/40 uppercase tracking-widest">Quantity:</span>
                         <span className="text-[12px] font-black text-black uppercase">{item.quantity} units</span>
                      </div>
                      <div className="px-4 py-1.5 bg-black/[0.03] rounded-full flex items-center gap-2">
                         <span className="text-[10px] font-black text-black/40 uppercase tracking-widest">Dimension:</span>
                         <span className="text-[12px] font-black text-black uppercase">Standard_Unit</span>
                      </div>
                   </div>
                </div>

                {checkedItems[item.id] && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2"
                  >
                    <CheckCircle2 size={14} />
                    VERIFIED_
                  </motion.div>
                )}
              </motion.div>
            ))}
         </div>
      </div>

      {/* Global Action Node */}
      <div className="fixed bottom-12 left-64 right-12 z-[100] flex justify-center pointer-events-none">
         <div className="w-full max-w-4xl pointer-events-auto">
            <button 
              disabled={!allChecked || finalizing}
              onClick={handleFinalize}
              className={`w-full py-8 rounded-[32px] flex items-center justify-center gap-4 text-[14px] font-black uppercase tracking-[0.4em] transition-all relative overflow-hidden shadow-2xl border-2 ${
                allChecked 
                  ? 'bg-black text-white border-black hover:scale-[1.02] active:scale-[0.98]' 
                  : 'bg-white text-black/20 border-black/5 cursor-not-allowed opacity-50'
              }`}
            >
               {finalizing ? (
                 <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
               ) : (
                 <>
                   <ShieldCheck size={24} />
                   <span>Submit Fulfillment Unit</span>
                 </>
               )}
               
               {allChecked && (
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                  />
               )}
            </button>
            
            {!allChecked && (
               <p className="text-center mt-4 text-[10px] font-bold text-black/30 uppercase tracking-[0.34em]">
                  Verification sequence pending: {order.items.length - Object.values(checkedItems).filter(Boolean).length} units remaining
               </p>
            )}
         </div>
      </div>
    </div>
  );
}
