import { RetailerPortalHeader } from '../../components/navigation/RetailerPortalHeader';
import { Trash2, ArrowRight, PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WishlistPage() {
  const wishlistItems = [
    { id: 3, name: "BONE CERAMIC VASE", price: 120, category: "HOME & DECOR", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800", sku: "JN-0003" },
    { id: 6, name: "BRASS NODE HARDWARE", price: 15, category: "HARDWARE & TOOLS", image: "https://images.unsplash.com/photo-1518481612222-68bbe828ec1e?auto=format&fit=crop&q=80&w=800", sku: "JN-0006" },
  ];

  return (
    <div className="min-h-screen bg-dark text-white font-sans selection:bg-primary/20 pb-40">
      <RetailerPortalHeader />
      
      <main className="max-w-[1750px] mx-auto px-12 py-32 space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8">
           <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tighter uppercase font-serif">Registry Drafts</h1>
              <p className="text-[12px] font-black text-primary tracking-widest uppercase">Saved Wholesale Assets</p>
           </div>
           <div className="text-right opacity-30 text-[10px] font-bold uppercase tracking-widest">
              Total Drafted Units: {wishlistItems.length}
           </div>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="border border-white/5 bg-dark-surface rounded-[48px] shadow-2xl overflow-hidden">
             <table className="w-full text-left border-collapse">
                <thead className="bg-white/5 border-b border-white/5">
                   <tr className="text-[10px] font-black uppercase tracking-widest-xl text-white/20">
                      <th className="px-10 py-8">Asset Details</th>
                      <th className="px-10 py-8 text-center">Sector</th>
                      <th className="px-10 py-8 text-center">Audit Status</th>
                      <th className="px-10 py-8 text-right">Transfer Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {wishlistItems.map((item) => (
                     <tr key={item.id} className="text-sm group hover:bg-white/[0.02] transition-colors">
                        <td className="px-10 py-12">
                           <div className="flex gap-10 items-center">
                              <div className="w-24 h-32 bg-dark border border-white/5 rounded-2xl overflow-hidden shadow-inner">
                                 <img src={item.image} className="w-full h-full object-cover grayscale-[0.2]" alt={item.name} />
                              </div>
                              <div className="space-y-2">
                                 <p className="font-black uppercase tracking-tighter text-lg leading-none">{item.name}</p>
                                 <p className="text-[10px] font-bold text-white/30 tracking-widest uppercase">SKU: {item.sku}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-12 text-center">
                           <span className="px-5 py-2 bg-white/5 text-[9px] font-black uppercase tracking-widest-xl border border-white/5 rounded-full text-white/40">{item.category}</span>
                        </td>
                        <td className="px-10 py-12 text-center text-green-500 font-bold text-[10px] uppercase tracking-widest-xl">
                           AVAILABLE
                        </td>
                        <td className="px-10 py-12 text-right">
                           <div className="flex justify-end items-center gap-6">
                              <button className="h-14 px-10 bg-primary text-white text-[11px] font-black uppercase tracking-widest-xl hover:bg-white hover:text-dark transition-all flex items-center gap-4 rounded-full shadow-xl shadow-primary/20">
                                 Move to Final Order <ArrowRight size={16} />
                              </button>
                              <button className="h-14 w-14 flex items-center justify-center border border-white/5 rounded-full text-white/10 hover:text-red-500 hover:bg-white/5 transition-all">
                                 <Trash2 size={20} />
                              </button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        ) : (
          <div className="py-48 text-center space-y-10 bg-dark-surface border border-dashed border-white/5 rounded-[64px] shadow-2xl">
             <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5 opacity-20">
                <PackageOpen size={64} className="text-white" />
             </div>
             <div className="space-y-4">
                <h3 className="text-3xl font-black uppercase tracking-tighter text-white/20">No Procurement Drafts Detected</h3>
                <p className="text-[11px] font-bold text-white/5 uppercase tracking-widest-xl">Your archive waiting list is currently empty</p>
             </div>
             <Link to="/shop" className="inline-block px-14 py-5 bg-primary text-white text-[12px] font-black uppercase tracking-widest-xl rounded-full shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                Audit Main Registry
             </Link>
          </div>
        )}
      </main>
    </div>
  );
}
