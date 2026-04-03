import { Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { ProductCard } from '../../components/premium/ProductCard';
import Sidebar from '../../components/catalog/Sidebar';

export default function ShopPage() {
   const [selectedCategory, setSelectedCategory] = useState('All');
   const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
   const [searchQuery, setSearchQuery] = useState('');
   const [sortBy, setSortBy] = useState('featured');

   const products = [
      { id: "1", name: "Industrial Zinc-Coated Wall Hooks", price: 2450, image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=600", category: "Hardware" },
      { id: "2", name: "Heavy-Duty Support Bracket", price: 4100, image: "https://images.unsplash.com/photo-1584982223243-7f7cd4aa3b26?auto=format&fit=crop&q=80&w=600", category: "Hardware" },
      { id: "3", name: "Cotton Blend Crew Socks", price: 1200, image: "https://images.unsplash.com/photo-1582966298431-99c6a1e8eb8a?auto=format&fit=crop&q=80&w=600", category: "Accessories" },
      { id: "4", name: "Clear Molded Box Set", price: 3750, image: "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?auto=format&fit=crop&q=80&w=600", category: "Outerwear" },
      { id: "5", name: "Technical Shell Jacket", price: 8900, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600", category: "Outerwear" },
      { id: "6", name: "Base Layer Thermal Top", price: 2800, image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=600", category: "Shirts" }
   ];

   const filteredProducts = products.filter(p => {
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchPrice = p.price >= priceRange[0] && (priceRange[1] === 0 || p.price <= priceRange[1]);
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchPrice && matchSearch;
   }).sort((a, b) => {
      if (sortBy === 'price-low-high') return a.price - b.price;
      if (sortBy === 'price-high-low') return b.price - a.price;
      return 0;
   });

   return (
      <div className="bg-[#F6F4F2]">
         <main className="min-h-screen">
            {/* Top Banner & Search Section */}
            <section className="pt-[110px] pb-6 px-8">
               <div className="max-w-[1400px] mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-[#425664]/10 pb-8">
                     <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-[#425664] tracking-tight pt-2 leading-tight lowercase">
                           wholesale catalog
                        </h1>
                     </div>

                     <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
                        <div className="relative group flex-1 sm:w-[400px]">
                           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#425664]/30 group-focus-within:text-[#C6AD8F] transition-colors" size={18} />
                           <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search repository..."
                              className="w-full bg-white border border-[#425664]/5 rounded-[24px] py-4.5 pl-16 pr-8 text-base font-normal focus:outline-none focus:border-[#C6AD8F] transition-all shadow-sm text-[#425664]"
                           />
                        </div>

                        {/* Amazon-style Sort by Dropdown */}
                        <div className="relative group min-w-[220px]">
                           <select
                              value={sortBy}
                              onChange={(e) => setSortBy(e.target.value)}
                              className="appearance-none w-full bg-white border border-[#425664]/5 rounded-[24px] px-8 pl-6 pr-12 py-4.5 text-base font-medium text-[#425664] focus:outline-none focus:border-[#C6AD8F] transition-all shadow-sm cursor-pointer"
                           >
                              <option value="featured">Sort by: Featured</option>
                              <option value="price-low-high">Price: Low to High</option>
                              <option value="price-high-low">Price: High to Low</option>
                           </select>
                           <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#425664]/20 pointer-events-none" />
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* Catalog Layout with Amazon Style Sidebar */}
            <div className="max-w-[1400px] mx-auto px-8 pb-40 flex flex-col lg:flex-row gap-10 mt-8 items-start">

               {/* Left Sidebar Filters */}
               <div className="hidden lg:block w-72 flex-shrink-0 rounded-[32px] overflow-hidden shadow-sm border border-[#425664]/5">
                  <Sidebar
                     category={selectedCategory}
                     setCategory={setSelectedCategory}
                     priceRange={priceRange}
                     setPriceRange={setPriceRange}
                  />
               </div>

               {/* Right Product Grid */}
               <div className="flex-1 w-full">
                  {filteredProducts.length === 0 ? (
                     <div className="py-40 text-center bg-white rounded-[32px] border border-[#425664]/5 shadow-sm">
                        <p className="text-base font-medium text-[#6B7280] uppercase tracking-widest leading-relaxed">No batch matching these filters was found in the archive.</p>
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                        {filteredProducts.map((product) => (
                           <ProductCard key={product.id} product={product} />
                        ))}
                     </div>
                  )}
               </div>
            </div>
         </main>
      </div>
   );
}
