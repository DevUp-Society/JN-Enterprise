import { 
  Filter, 
  Search, 
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { ProductCard } from '../../components/premium/ProductCard';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Hardware', 'Textiles', 'Storage', 'Apparel', 'Electronics'];
  
  const products = [
    { id: "1", name: "Industrial Zinc-Coated Wall Hooks", price: 2450, image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=600", category: "Hardware" },
    { id: "2", name: "Heavy-Duty Support Bracket", price: 4100, image: "https://images.unsplash.com/photo-1584982223243-7f7cd4aa3b26?auto=format&fit=crop&q=80&w=600", category: "Hardware" },
    { id: "3", name: "Cotton Blend Crew Socks", price: 1200, image: "https://images.unsplash.com/photo-1582966298431-99c6a1e8eb8a?auto=format&fit=crop&q=80&w=600", category: "Textiles" },
    { id: "4", name: "Clear Molded Box Set", price: 3750, image: "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?auto=format&fit=crop&q=80&w=600", category: "Storage" },
    { id: "5", name: "Technical Shell Jacket", price: 8900, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600", category: "Apparel" },
    { id: "6", name: "Base Layer Thermal Top", price: 2800, image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=600", category: "Apparel" }
  ];

  return (
    <div className="bg-[#F6F4F2]">
      <main className="min-h-screen">
        {/* 2. Top Banner Section */}
        <section className="pt-[110px] pb-10 px-8">
           <div className="max-w-[1400px] mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-[#425664]/10 pb-8">
                 <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-[#425664] tracking-tight pt-2 leading-tight lowercase">
                       wholesale products
                    </h1>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
                    <div className="relative group flex-1 sm:w-[400px]">
                       <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#425664]/30 group-focus-within:text-[#C6AD8F] transition-colors" size={18} />
                       <input 
                         type="text" 
                         placeholder="Search repository..." 
                         className="w-full bg-white border border-[#425664]/5 rounded-[24px] py-4.5 pl-16 pr-8 text-base font-normal focus:outline-none focus:border-[#C6AD8F] transition-all shadow-sm text-[#425664]"
                       />
                    </div>
                    <button className="bg-white border border-[#425664]/5 rounded-[24px] px-8 py-4.5 flex items-center justify-between gap-6 hover:border-[#C6AD8F] transition-all group shadow-sm">
                       <div className="flex items-center gap-3">
                          <Filter size={18} className="text-[#425664]/40" />
                          <span className="text-base font-medium text-[#425664]">Filters</span>
                       </div>
                       <ChevronDown size={14} className="text-[#425664]/20 group-hover:text-[#C6AD8F] transition-colors" />
                    </button>
                 </div>
              </div>

              {/* Category Bubbles */}
              <div className="flex flex-wrap gap-3 mt-12">
                 {categories.map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-8 py-3 rounded-full text-base font-medium lowercase transition-all border ${selectedCategory === cat ? 'bg-[#111827] text-white border-[#111827] shadow-lg' : 'bg-white text-[#425664] border-[#425664]/5 hover:border-[#C6AD8F]'}`}
                    >
                       {cat === 'All' ? 'all products' : cat}
                    </button>
                 ))}
              </div>
           </div>
        </section>

        {/* 3. Product Grid */}
        <div className="max-w-[1400px] mx-auto px-8 pb-40">
            {products.filter(p => selectedCategory === 'All' || p.category === selectedCategory).length === 0 ? (
               <div className="py-40 text-center">
                  <p className="text-base font-medium text-[#6B7280] uppercase tracking-widest leading-relaxed">No batch matching this sector was found in the archive.</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                  {products.filter(p => selectedCategory === 'All' || p.category === selectedCategory).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
               </div>
            )}
        </div>
      </main>
    </div>
  );
}
