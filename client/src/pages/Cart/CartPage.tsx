import { RetailerPortalHeader } from '../../components/navigation/RetailerPortalHeader';
import { Trash2, MessageSquare, ArrowRight, Package, Truck, Database } from 'lucide-react';

export default function CartPage() {
  const cartItems = [
    { id: 1, name: "ARCHITECTURAL OVERCOAT", price: 840, quantity: 12, size: "XL", sku: "JN-0001", weight: 0.8 },
    { id: 2, name: "SLATE WOVEN TEXTILE", price: 45, quantity: 50, size: "Roll", sku: "JN-0002", weight: 2.5 },
  ];

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalWeight = cartItems.reduce((acc, item) => acc + (item.weight * item.quantity), 0);

  return (
    <div className="min-h-screen bg-dark text-white font-sans selection:bg-primary/20 pb-40">
      <RetailerPortalHeader />
      
      <main className="max-w-[1750px] mx-auto px-12 py-32 space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8">
           <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tighter uppercase font-serif">Procurement Cart</h1>
              <p className="text-[12px] font-black text-primary tracking-widest uppercase">Verified Wholesale Registry</p>
           </div>
           <div className="text-right opacity-30 text-[10px] font-bold uppercase tracking-widest">
              Session ID: PROC-992-VERIFIED
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
           <div className="lg:col-span-2 space-y-12">
              {/* Cart Table - Enterprise Dark Style */}
              <div className="overflow-hidden border border-white/5 bg-dark-surface rounded-[40px] shadow-2xl">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 border-b border-white/5">
                       <tr className="text-[10px] font-black uppercase tracking-widest-xl text-white/20">
                          <th className="px-10 py-8">Product Item</th>
                          <th className="px-10 py-8 text-center">Batch Qty</th>
                          <th className="px-10 py-8 text-center">Unit Val</th>
                          <th className="px-10 py-8 text-right">Inventory Val</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {cartItems.map((item) => (
                         <tr key={item.id} className="text-sm group hover:bg-white/[0.02] transition-colors">
                            <td className="px-10 py-12">
                               <div className="flex gap-10 items-center">
                                  <div className="w-24 h-32 bg-dark border border-white/5 rounded-2xl overflow-hidden shadow-inner">
                                     <img src={`https://images.unsplash.com/photo-${item.id === 1 ? '1591047139829-d91aec16adcd' : '1620799140408-edc6dcb6d633'}?auto=format&fit=crop&q=80&w=300`} className="w-full h-full object-cover grayscale-[0.2]" alt={item.name} />
                                  </div>
                                  <div className="space-y-2">
                                     <p className="font-black uppercase tracking-tighter text-lg leading-none">{item.name}</p>
                                     <p className="text-[10px] font-bold text-white/30 tracking-widest uppercase">SKU: {item.sku} | SCALE: {item.size}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-10 py-12 text-center font-black text-lg">{item.quantity}</td>
                            <td className="px-10 py-12 text-center text-white/40">${item.price}</td>
                            <td className="px-10 py-12 text-right font-black text-lg">
                               <div className="flex flex-col items-end gap-4">
                                  <span className="text-primary">${(item.price * item.quantity).toLocaleString()}</span>
                                  <button className="w-10 h-10 rounded-full border border-red-500/10 text-red-500/30 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
                                     <Trash2 size={16} />
                                  </button>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>

              {/* Data Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   { label: "Total Asset Units", val: totalItems, icon: Package },
                   { label: "Metric Volume", val: `${totalWeight}kg`, icon: Truck },
                   { label: "Audit Status", val: "VERIFIED", icon: Database, color: "text-green-500" }
                 ].map((stat, i) => (
                    <div key={i} className="p-10 bg-dark-surface border border-white/5 rounded-[40px] space-y-6 shadow-xl">
                       <stat.icon size={24} className="text-primary" />
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest-xl text-white/20">{stat.label}</p>
                          <p className={`text-4xl font-black ${stat.color || 'text-white'}`}>{stat.val}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Checkout Matrix Sidebar */}
           <aside className="space-y-12">
              <div className="bg-dark-surface p-12 rounded-[56px] border border-white/5 shadow-2xl relative overflow-hidden">
                 <div className="relative z-10 space-y-12">
                    <div className="space-y-4">
                       <p className="text-[10px] font-black tracking-widest-xl uppercase text-white/20">Procurement Final Total</p>
                       <h4 className="text-7xl font-black tracking-tighter text-white leading-none">${totalPrice.toLocaleString()}</h4>
                    </div>
                    
                    <div className="space-y-8 border-t border-white/5 pt-12">
                       <div className="flex justify-between text-[12px] font-black uppercase tracking-widest">
                          <span className="text-white/20">Shipping Estimate</span>
                          <span className="text-white/60">Calculated at Hub</span>
                       </div>
                       <div className="flex justify-between text-[12px] font-black uppercase tracking-widest">
                          <span className="text-white/20">Enterprise Discount</span>
                          <span className="text-primary">-15% Applied</span>
                       </div>
                    </div>

                    <div className="space-y-4 pt-4">
                       <button className="w-full h-16 bg-primary text-white text-[12px] font-black uppercase tracking-widest-xl hover:bg-white hover:text-dark transition-all flex items-center justify-center gap-4 rounded-full shadow-2xl shadow-primary/20">
                          Transfer to Checkout <ArrowRight size={20} />
                       </button>
                       <button className="w-full h-16 bg-white/5 text-white/40 border border-white/5 text-[12px] font-black uppercase tracking-widest-xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-4 rounded-full">
                          <MessageSquare size={20} /> WhatsApp Expert Registry
                       </button>
                    </div>
                 </div>
                 {/* Visual Accent */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[100px] -z-0" />
              </div>

              <div className="px-10 text-center">
                 <p className="text-[10px] font-bold uppercase tracking-widest-xl text-white/10 leading-relaxed">
                    Bulk procurement requires ISO standard verification before fulfillment terminal release.
                 </p>
              </div>
           </aside>
        </div>
      </main>
    </div>
  );
}
