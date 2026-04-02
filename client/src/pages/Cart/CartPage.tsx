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
    <div className="min-h-screen bg-bone text-slate font-sans selection:bg-gold selection:text-white pb-32">
      <RetailerPortalHeader />
      
      <main className="max-w-[1400px] mx-auto px-12 py-16 space-y-16">
        <div className="grid lg:grid-cols-3 gap-16">
           <div className="lg:col-span-2 space-y-8">
              {/* Cart Table */}
              <div className="overflow-x-auto border border-black/5 bg-white shadow-sm">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F6F4F2] border-b border-black/5">
                       <tr className="text-[10px] font-black uppercase tracking-widest text-slate/40">
                          <th className="px-8 py-6">Product Item</th>
                          <th className="px-8 py-6 text-center">Qty</th>
                          <th className="px-8 py-6 text-center">Unit Price</th>
                          <th className="px-8 py-6 text-right">Subtotal</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                       {cartItems.map((item) => (
                         <tr key={item.id} className="text-xs group hover:bg-bone/20 transition-colors">
                            <td className="px-8 py-10">
                               <div className="flex gap-8 items-center">
                                  <div className="w-20 h-24 bg-bone border border-black/5 overflow-hidden">
                                     <img src={`https://images.unsplash.com/photo-${item.id === 1 ? '1591047139829-d91aec16adcd' : '1620799140408-edc6dcb6d633'}?auto=format&fit=crop&q=80&w=200`} className="w-full h-full object-cover grayscale-[0.3]" alt={item.name} />
                                  </div>
                                  <div className="space-y-1.5">
                                     <p className="font-bold uppercase tracking-tight text-sm">{item.name}</p>
                                     <p className="text-[10px] font-bold opacity-30 tracking-widest uppercase">SKU: {item.sku} | SIZE: {item.size}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-10 text-center font-black">{item.quantity}</td>
                            <td className="px-8 py-10 text-center opacity-40">${item.price}</td>
                            <td className="px-8 py-10 text-right font-black">
                               <div className="flex flex-col items-end gap-3">
                                  <span>${item.price * item.quantity}</span>
                                  <button className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <Trash2 size={14} />
                                  </button>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>

              {/* Matrix Summary Blocks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="p-10 bg-white border border-black/5 space-y-4">
                    <Package size={20} className="text-gold" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Total Units</p>
                    <p className="text-3xl font-black">{totalItems}</p>
                 </div>
                 <div className="p-10 bg-white border border-black/5 space-y-4">
                    <Truck size={20} className="text-gold" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Volume (Est.)</p>
                    <p className="text-3xl font-black">{totalWeight}kg</p>
                 </div>
                 <div className="p-10 bg-white border border-black/5 space-y-4">
                    <Database size={20} className="text-gold" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Verification</p>
                    <p className="text-3xl font-black uppercase text-green-600">VALID</p>
                 </div>
              </div>
           </div>

           {/* Checkout Sidebar */}
           <aside className="space-y-12">
              <div className="bg-[#425664] text-white p-12 space-y-10 shadow-2xl">
                 <div className="space-y-3">
                    <p className="text-[10px] font-black tracking-widest uppercase opacity-40">Procurement Total</p>
                    <h4 className="text-6xl font-black tracking-tighter">${totalPrice.toLocaleString()}</h4>
                 </div>
                 
                 <div className="space-y-6 border-t border-white/10 pt-10">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                       <span className="opacity-40">Shipping Est.</span>
                       <span>TBD</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                       <span className="opacity-40">Tier Discount</span>
                       <span className="text-gold">-15% Applied</span>
                    </div>
                 </div>

                 <div className="space-y-4 pt-10">
                    <button className="w-full h-14 bg-[#C6AD8F] text-white text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-[#425664] transition-all flex items-center justify-center gap-4">
                       Finalize Order <ArrowRight size={18} />
                    </button>
                    <button className="w-full h-14 bg-green-600/20 text-green-400 border border-green-600/30 text-[11px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-4">
                       <MessageSquare size={18} /> Export to WhatsApp
                    </button>
                 </div>
              </div>

              <p className="text-[10px] font-bold text-center uppercase tracking-widest opacity-30 leading-relaxed px-12">
                 Bulk orders require curatorial verification before shipment authorization.
              </p>
           </aside>
        </div>
      </main>
    </div>
  );
}
