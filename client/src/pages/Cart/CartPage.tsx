import { RetailerPortalHeader } from '../../components/navigation/RetailerPortalHeader';
import { Trash2, ShoppingBag, ArrowRight, Package, Truck, FileText } from 'lucide-react';
import { useCart } from '../../store/CartContext';
import { Link } from 'react-router-dom';
import ArchitecturalEmptyState from '../../components/feedback/ArchitecturalEmptyState';

export default function CartPage() {
  const { cart, totalQty, totalPrice, removeItem } = useCart();
  const totalWeight = cart.length * 5.2; // Simulating weight calculation

  return (
    <div className="min-h-screen bg-bone text-primary font-sans selection:bg-primary/20 pb-40">
      <RetailerPortalHeader />
      
      <main className="max-w-[1700px] mx-auto px-12 py-32 space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end border-b-4 border-primary/10 pb-8">
           <div className="space-y-4">
              <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">PROCUREMENT TRAY_</h1>
              <p className="text-[14px] font-black text-primary/40 tracking-[0.4em] uppercase">Enterprise Batch Reservation Node</p>
           </div>
           <div className="text-right opacity-20 text-[10px] font-bold uppercase tracking-widest hidden md:block">
              Registry UID: {Math.random().toString(36).substring(7).toUpperCase()}
           </div>
        </div>

        {cart.length === 0 ? (
          <ArchitecturalEmptyState 
            icon={ShoppingBag}
            title="REGISTRY INACTIVE"
            subtitle="YOUR PROCUREMENT RESERVATION NODE IS CURRENTLY EMPTY. INITIALIZE YOUR FLOW FROM THE INDUSTRIAL CATALOG."
            actionText="RETURN TO ARCHIVE"
            actionPath="/shop"
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
               {/* Wholesale Matrix Table */}
               <div className="bg-white border border-primary/5 shadow-sm">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-bone border-b border-primary/5 text-[10px] font-black uppercase tracking-widest text-primary/30">
                           <th className="px-10 py-8">Procurement item</th>
                           <th className="px-10 py-8 text-center">Batch Matrix</th>
                           <th className="px-10 py-8 text-right">Batch total</th>
                           <th className="px-6 py-8"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-primary/5">
                        {cart.map((item) => (
                          <tr key={item.sku} className="group hover:bg-bone transition-colors">
                             <td className="px-10 py-12">
                                <div className="flex gap-8 items-center">
                                   <div className="w-20 h-28 bg-bone border border-primary/5 shrink-0 overflow-hidden">
                                      <img src={item.image} className="w-full h-full object-cover grayscale-[0.2] transition-transform duration-500 group-hover:scale-110" alt={item.name} />
                                   </div>
                                   <div className="space-y-2">
                                      <p className="text-[9px] font-black text-primary/30 tracking-widest uppercase">{item.sku}</p>
                                      <p className="font-black uppercase tracking-tight text-xl leading-none">{item.name}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-10 py-12">
                                <div className="flex flex-wrap justify-center gap-2">
                                   {Object.entries(item.sizeQuantities).map(([size, qty]) => (
                                     <div key={size} className="px-4 py-2 bg-bone border border-primary/5 flex flex-col items-center min-w-[50px]">
                                        <span className="text-[10px] font-black text-primary/30">{size}</span>
                                        <span className="text-[12px] font-black text-primary">{qty}</span>
                                     </div>
                                   ))}
                                </div>
                             </td>
                             <td className="px-10 py-12 text-right">
                                <div className="space-y-1">
                                   <p className="text-[9px] font-black text-primary/30 uppercase tracking-widest">Total Value</p>
                                   <p className="font-black text-2xl tracking-tighter text-primary">
                                      ${(item.price * Object.values(item.sizeQuantities).reduce((a, b) => a + b, 0)).toLocaleString()}
                                   </p>
                                </div>
                             </td>
                             <td className="px-6 py-12">
                                <button 
                                  onClick={() => removeItem(item.sku)}
                                  className="p-3 text-primary/20 hover:text-red-500 transition-colors"
                                >
                                   <Trash2 size={18} />
                                </button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               {/* Metrics Panel */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { label: "Total Asset Units", val: totalQty, icon: Package },
                    { label: "Metric Volume", val: `${totalWeight.toFixed(1)}kg`, icon: Truck },
                    { label: "Protocol Status", val: "APPROVED", icon: ShieldCheck, color: "text-primary" }
                  ].map((stat, i) => (
                     <div key={i} className="p-10 bg-white border border-primary/5 space-y-6 shadow-sm hover:translate-y-[-5px] transition-transform">
                        <stat.icon size={24} className="text-primary/20" />
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">{stat.label}</p>
                           <p className={`text-4xl font-black ${stat.color || 'text-primary'}`}>{stat.val}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Procurement Summary */}
            <aside className="space-y-12">
               <div className="bg-primary p-12 shadow-2xl relative overflow-hidden border-b-8 border-gold">
                  <div className="relative z-10 space-y-12">
                     <div className="space-y-4">
                        <p className="text-[11px] font-black tracking-widest uppercase text-white/30">Aggregate Fulfillment Net</p>
                        <h4 className="text-7xl font-black tracking-tighter text-white leading-none">${totalPrice.toLocaleString()}</h4>
                     </div>
                     
                     <div className="space-y-8 border-t border-white/10 pt-12">
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                           <span className="text-white/30">Bulk Capacity</span>
                           <span className="text-white">{totalQty} Units</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                           <span className="text-white/30">Logistics Node</span>
                           <span className="text-gold">FREE FREIGHT (verified)</span>
                        </div>
                     </div>

                     <div className="space-y-4 pt-4">
                        <Link 
                          to="/checkout"
                          className="w-full h-20 bg-white text-primary text-[12px] font-black uppercase tracking-widest-xl hover:bg-gold hover:text-white transition-all flex items-center justify-center gap-4 shadow-2xl"
                        >
                           INITIALIZE REGISTRY <ArrowRight size={20} />
                        </Link>
                        <button className="w-full h-16 bg-white/5 text-white/40 border border-white/10 text-[11px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-4">
                           <FileText size={18} /> DOWNLOAD QUOTE (MOCK)
                        </button>
                     </div>
                  </div>
                  {/* Grid Pattern Background */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
               </div>

               <div className="px-10 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary/20 leading-relaxed italic">
                     Verification by internal workforce is required prior to industrial terminal dispatch.
                  </p>
               </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

function ShieldCheck({ size, className }: any) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="square" 
      strokeLinejoin="inherit" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
