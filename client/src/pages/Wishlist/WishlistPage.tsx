import {
   Heart,
   ArrowRight,
   ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { ProductCard } from '../../components/premium/ProductCard';
import { useWishlist } from '../../store/WishlistContext';

export default function WishlistPage() {
   const { wishlist: wishlistItems } = useWishlist();
   const [filterMode, setFilterMode] = useState('All');
   const [sortBy, setSortBy] = useState('featured');

   const categories = ['All', 'Hardware', 'Textiles', 'Storage', 'Apparel', 'Accessories', 'Outerwear', 'Shirts'];

   // Apply category filter and then sorting strategy
   const displayedList = wishlistItems
      .filter(i => filterMode === 'All' || i.category === filterMode)
      .sort((a, b) => {
         if (sortBy === 'price-low-high') return a.price - b.price;
         if (sortBy === 'price-high-low') return b.price - a.price;
         return 0;
      });

   return (
      <div className="bg-[#F6F4F2] min-h-screen">
         <main className="max-w-[1400px] mx-auto px-8 pt-[120px] pb-32 space-y-12">

            {/* Minimal Header */}
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-[#425664]/10 pb-8 gap-6">
               <h1 className="text-3xl font-bold text-[#425664] tracking-tight lowercase pt-2 leading-tight">
                  wishlist
               </h1>

               <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                  <div className="relative group w-full sm:w-[200px]">
                     <select
                        value={filterMode}
                        onChange={(e) => setFilterMode(e.target.value)}
                        className="appearance-none w-full bg-white border border-[#425664]/5 rounded-[24px] px-8 pl-6 pr-12 py-3.5 text-sm font-medium text-[#425664] focus:outline-none focus:border-[#C6AD8F] transition-all shadow-sm cursor-pointer"
                     >
                        {categories.map(cat => <option key={cat} value={cat}>Filter: {cat}</option>)}
                     </select>
                     <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#425664]/20 pointer-events-none" />
                  </div>

                  <div className="relative group w-full sm:w-[220px]">
                     <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none w-full bg-white border border-[#425664]/5 rounded-[24px] px-8 pl-6 pr-12 py-3.5 text-sm font-medium text-[#425664] focus:outline-none focus:border-[#C6AD8F] transition-all shadow-sm cursor-pointer"
                     >
                        <option value="featured">Sort Option</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
                     </select>
                     <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#425664]/20 pointer-events-none" />
                  </div>
               </div>
            </div>

            {/* Content Section */}
            {displayedList.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10">
                  {displayedList.map((item) => (
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
                     <p className="text-xs font-medium text-[#6B7280] uppercase tracking-widest max-w-sm mx-auto leading-relaxed">No wholesale assets match current filters in this session.</p>
                     <div className="pt-8">
                        <button onClick={() => { setFilterMode('All'); setSortBy('featured'); }} className="inline-flex items-center gap-3 text-[#C6AD8F] font-semibold uppercase text-xs tracking-widest hover:gap-5 transition-all">
                           Reset Directory Filters <ArrowRight size={16} />
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </main>
      </div>
   );
}
