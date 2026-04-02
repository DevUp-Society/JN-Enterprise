import { RetailerPortalHeader } from '../../components/navigation/RetailerPortalHeader';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WishlistPage() {
  const wishlistItems = [
    { id: 3, name: "BONE CERAMIC VASE", price: 120, category: "HOME & DECOR", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800", sku: "JN-0003" },
    { id: 6, name: "BRASS NODE HARDWARE", price: 15, category: "HARDWARE & TOOLS", image: "https://images.unsplash.com/photo-1518481612222-68bbe828ec1e?auto=format&fit=crop&q=80&w=800", sku: "JN-0006" },
  ];

  return (
    <div className="min-h-screen bg-bone text-slate font-sans selection:bg-gold selection:text-white pb-32">
      <RetailerPortalHeader />
      
      <main className="max-w-[1400px] mx-auto px-12 py-16 space-y-16">
        {wishlistItems.length > 0 ? (
          <div className="border border-black/5 bg-white shadow-sm overflow-hidden">
             <table className="w-full text-left border-collapse">
                <thead className="bg-[#F6F4F2] border-b border-black/5">
                   <tr className="text-[10px] font-black uppercase tracking-widest text-slate/40">
                      <th className="px-8 py-6">Product Details</th>
                      <th className="px-8 py-6 text-center">Category</th>
                      <th className="px-8 py-6 text-center">Status</th>
                      <th className="px-8 py-6 text-right">Draft Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                   {wishlistItems.map((item) => (
                     <tr key={item.id} className="text-xs group hover:bg-bone/20 transition-colors">
                        <td className="px-8 py-10">
                           <div className="flex gap-8 items-center">
                              <div className="w-20 h-24 bg-bone border border-black/5 overflow-hidden">
                                 <img src={item.image} className="w-full h-full object-cover grayscale-[0.3]" alt={item.name} />
                              </div>
                              <div className="space-y-1.5">
                                 <p className="font-bold uppercase tracking-tight text-sm">{item.name}</p>
                                 <p className="text-[10px] font-bold opacity-30 tracking-widest uppercase">SKU: {item.sku}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-10 text-center">
                           <span className="px-4 py-1.5 bg-slate/5 text-[9px] font-black uppercase tracking-widest border border-black/5">{item.category}</span>
                        </td>
                        <td className="px-8 py-10 text-center">
                           <span className="flex items-center justify-center gap-2 text-green-600 font-bold text-[9px] uppercase tracking-widest">
                              <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" /> In Stock
                           </span>
                        </td>
                        <td className="px-8 py-10 text-right">
                           <div className="flex justify-end gap-5">
                              <button className="h-12 px-8 bg-[#425664] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#C6AD8F] transition-all flex items-center gap-3">
                                 Move to Cart <ArrowRight size={14} />
                              </button>
                              <button className="h-12 w-12 flex items-center justify-center border border-black/5 text-red-500 hover:bg-red-50 transition-all">
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        ) : (
          <div className="py-32 text-center space-y-8 bg-white border border-dashed border-black/10">
             <Heart size={64} className="mx-auto text-slate/10" />
             <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tighter">Your Waiting List is Empty</h3>
                <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest-xl">No procurement drafts found in your archives</p>
             </div>
             <Link to="/home" className="inline-block px-12 h-14 bg-[#425664] text-white text-[10px] font-black uppercase tracking-widest items-center content-center hover:bg-[#C6AD8F] transition-all">
                Search Collections
             </Link>
          </div>
        )}
      </main>
    </div>
  );
}
