import { 
  Heart, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { ProductCard } from '../../components/premium/ProductCard';

export default function WishlistPage() {
  const wishlistItems = [
    { id: "1", name: "Industrial Zinc-Coated Wall Hooks", price: 2450, image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=600", category: "Hardware" },
    { id: "3", name: "Cotton Blend Crew Socks", price: 1200, image: "https://images.unsplash.com/photo-1582966298431-99c6a1e8eb8a?auto=format&fit=crop&q=80&w=600", category: "Textiles" },
  ];

  return (
    <div className="bg-[#F6F4F2]">
      <main className="max-w-[1400px] mx-auto px-8 pt-[120px] pb-32 space-y-12">
        
        {/* Minimal Header */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-[#425664]/10 pb-8">
            <h1 className="text-3xl font-bold text-[#425664] tracking-tight lowercase pt-2 leading-tight">
                wishlist
            </h1>
            <button className="flex items-center gap-2 text-base font-medium lowercase text-[#C6AD8F] hover:text-[#111827] transition-all bg-white px-8 py-3.5 rounded-2xl border border-[#425664]/5 shadow-sm">
                <Filter size={16} /> filter option
            </button>
        </div>

        {/* Content Section */}
        {wishlistItems.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10">
              {wishlistItems.map((item) => (
                 <ProductCard key={item.id} product={item} />
              ))}
           </div>
        ) : (
           <div className="py-60 text-center space-y-10 bg-white border border-[#425664]/5 rounded-[60px] shadow-sm">
              <div className="w-40 h-40 rounded-full bg-[#F6F4F2] flex items-center justify-center mx-auto mb-4 border border-[#425664]/5">
                 <Heart size={80} className="text-[#425664]/10" />
              </div>
              <div className="space-y-4">
                 <h3 className="text-2xl font-semibold tracking-tight text-[#425664]/20 uppercase">Registry Empty_</h3>
                 <p className="text-xs font-medium text-[#6B7280] uppercase tracking-widest max-w-sm mx-auto leading-relaxed">No wholesale assets have been archived in this session.</p>
                 <div className="pt-8">
                    <button className="inline-flex items-center gap-3 text-[#C6AD8F] font-semibold uppercase text-xs tracking-widest hover:gap-5 transition-all">
                       Browse Procurement Terminal <ArrowRight size={16} />
                    </button>
                 </div>
              </div>
           </div>
        )}
      </main>
    </div>
  );
}
