import { useState, useEffect } from 'react';
import { 
  Search, 
  Check,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../../components/premium/ProductCard';
import axios from 'axios';

const FilterSection = ({ title, children, isOpen = true }: any) => {
  const [open, setOpen] = useState(isOpen);
  return (
    <div className="border-b border-black/[0.08] last:border-0 pb-1 mb-1">
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full group py-1.5"
      >
        <span className="text-[13px] font-black uppercase tracking-tight text-black group-hover:opacity-60 transition-opacity flex items-center gap-3 font-display">
           <div className="w-1 h-3 bg-black rounded-full" />
           {title}
        </span>
        <ChevronDown size={14} className={`text-black/60 transition-transform duration-500 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategories, priceRange, inStockOnly, sortBy]);

  const fetchInitialData = async () => {
    try {
      const { data } = await axios.get('/api/products/categories');
      setCategories(data.categories);
    } catch (err) {
      console.error('FETCH_INIT_ERROR:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategories.length > 0) params.append('categoryId', selectedCategories.join(','));
      if (sortBy !== 'relevance') params.append('sort', sortBy);
      
      const { data } = await axios.get(`/api/products?${params.toString()}`);
      
      let filtered = data.products;
      if (priceRange.min) filtered = filtered.filter((p: any) => Number(p.price) >= Number(priceRange.min));
      if (priceRange.max) filtered = filtered.filter((p: any) => Number(p.price) <= Number(priceRange.max));
      if (inStockOnly) filtered = filtered.filter((p: any) => p.stockQuantity > 0);
      
      setProducts(filtered);
    } catch (err) {
      console.error('FETCH_PRODUCTS_ERROR:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    setInStockOnly(false);
    setSortBy('relevance');
  };

  const FilterBody = () => (
    <>
      {/* 1. Sort Mode - Compact Grid */}
      <FilterSection title="SORT BY" isOpen={true}>
         <div className="grid grid-cols-2 gap-2">
            {[
               { id: 'relevance', label: 'Default' },
               { id: 'price_asc', label: 'Price: Low' },
               { id: 'price_desc', label: 'Price: High' },
               { id: 'newest', label: 'Newest' }
            ].map((option) => (
               <button 
                 key={option.id}
                 onClick={() => setSortBy(option.id)}
                 className={`px-4 py-2.5 rounded-[12px] text-[12px] font-black uppercase tracking-normal transition-all duration-300 border-2 ${sortBy === option.id ? 'bg-black text-white border-black' : 'bg-white text-black/70 border-transparent hover:bg-white/80 active:scale-95 shadow-sm'}`}
               >
                  {option.label}
               </button>
            ))}
         </div>
      </FilterSection>

      {/* 2. Categories - Optimized Dual-Column */}
      <FilterSection title="SECTORS" isOpen={true}>
         <div className="grid grid-cols-2 gap-x-4 gap-y-2 pb-2">
            {categories.map((cat: any) => (
               <label key={cat.id} className="flex items-center gap-2 group cursor-pointer select-none">
                  <div 
                    onClick={() => toggleCategory(cat.id)}
                    className={`w-5 h-5 rounded-[4px] border-2 transition-all duration-300 flex items-center justify-center shrink-0 ${selectedCategories.includes(cat.id) ? 'bg-black border-black' : 'bg-white border-black/10 group-hover:border-black/30'}`}
                  >
                     {selectedCategories.includes(cat.id) && <Check size={12} className="text-white" strokeWidth={4} />}
                  </div>
                  <span className={`text-[12px] font-black uppercase tracking-normal transition-colors ${selectedCategories.includes(cat.id) ? 'text-black' : 'text-black/70 group-hover:text-black'}`}>
                     {cat.name}
                  </span>
               </label>
            ))}
         </div>
      </FilterSection>

      {/* 3. Price Range - High-End Inputs */}
      <FilterSection title="PRICE_BAND" isOpen={false}>
         <div className="flex flex-col sm:flex-row items-center gap-2 pb-2">
            <div className="relative w-full group/input">
               <input 
                 type="number" 
                 placeholder="MIN" 
                 value={priceRange.min}
                 onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                 className="w-full bg-white border-2 border-transparent group-hover/input:bg-white focus:bg-white focus:border-black rounded-[8px] py-3 px-4 text-[13px] font-black text-black outline-none transition-all placeholder:text-black/10"
               />
            </div>
            <div className="hidden sm:block w-2 h-0.5 bg-black/10" />
            <div className="relative w-full group/input">
               <input 
                 type="number" 
                 placeholder="MAX" 
                 value={priceRange.max}
                 onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                 className="w-full bg-white border-2 border-transparent group-hover/input:bg-white focus:bg-white focus:border-black rounded-[8px] py-3 px-4 text-[13px] font-black text-black outline-none transition-all placeholder:text-black/10"
               />
            </div>
         </div>
      </FilterSection>

      {/* 4. Operational Toggle */}
      <FilterSection title="SYNC_MODE" isOpen={true}>
          <button 
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`w-full flex items-center justify-between p-2.5 rounded-[12px] border-2 transition-all duration-500 ${inStockOnly ? 'bg-black text-white border-black shadow-lg ring-4 ring-black/5' : 'bg-white text-black/70 border-transparent hover:bg-white hover:text-black active:scale-95'}`}
          >
             <span className="text-[12px] font-black uppercase tracking-normal text-left leading-none">Live Stock Focus</span>
             <div className={`w-8 h-5 rounded-full relative transition-all duration-500 ${inStockOnly ? 'bg-white' : 'bg-black/20'}`}>
                <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all duration-500 ${inStockOnly ? 'right-0.5 bg-black' : 'left-0.5 bg-black/40'}`} />
             </div>
          </button>
      </FilterSection>

      {/* 5. Primary Reset Action */}
      <div className="pt-2 mt-1 border-t border-black/[0.05]">
          <button 
             onClick={clearAllFilters}
             className="w-full py-3 bg-black text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-black/80 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
          >
             <RotateCcw size={12} strokeWidth={3} />
             Reset Filters
          </button>
      </div>
    </>
  );

  return (
    <div className="bg-[#FFFFFF] min-h-screen font-sans selection:bg-[#000000] selection:text-[#FFFFFF]">
      
      <main className="max-w-[2000px] mx-auto pt-8 lg:pt-12 px-6 md:px-12 pb-40 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex w-80 flex-shrink-0 sticky top-28 max-h-[calc(100vh-160px)] flex-col group/sidebar">
           <div className="flex items-end justify-between mb-4 px-2">
              <h2 className="text-3xl font-black text-black uppercase tracking-normal leading-none flex items-center gap-3 font-display">
                 FILTERS <SlidersHorizontal size={18} strokeWidth={3} className="text-black/10" />
              </h2>
              <button 
                onClick={clearAllFilters}
                className="text-[10px] font-black uppercase tracking-normal text-black/40 hover:text-black transition-colors"
                title="Reset All"
              >
                <RotateCcw size={14} />
              </button>
           </div>

           <div className="bg-[#D6D6D6] rounded-[24px] p-4 flex flex-col overflow-hidden border border-black/5">
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-1">
                  <FilterBody />
              </div>
           </div>
        </aside>

        {/* MOBILE FILTER MODAL / DRAWER */}
        <AnimatePresence>
           {isMobileFiltersOpen && (
             <>
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 onClick={() => setIsMobileFiltersOpen(false)}
                 className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
               />
               <motion.div 
                 initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                 transition={{ type: "spring", damping: 25, stiffness: 200 }}
                 className="fixed inset-x-0 bottom-0 bg-[#D6D6D6] z-[101] rounded-t-[40px] max-h-[90vh] overflow-hidden lg:hidden p-8 flex flex-col shadow-3xl"
               >
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-4xl font-black text-black uppercase tracking-tighter font-display">Filters</h2>
                     <button 
                       onClick={() => setIsMobileFiltersOpen(false)}
                       className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all"
                     >
                       <X size={24} />
                     </button>
                  </div>
                  <div className="overflow-y-auto custom-scrollbar flex-1 pb-20">
                     <FilterBody />
                  </div>
               </motion.div>
             </>
           )}
        </AnimatePresence>

        {/* FEED SECTION */}
        <section className="flex-1 min-w-0">
           {/* Mobile-Only Header (Static) */}
           <div className="lg:hidden mb-12 flex flex-col gap-8">
              <div className="flex items-center justify-between gap-4">
                 <h1 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter font-display leading-tight flex-1">All Products</h1>
                 <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => setIsMobileFiltersOpen(true)}
                      className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                    >
                      <SlidersHorizontal size={14} strokeWidth={3} /> Filters
                    </button>
                    {(selectedCategories.length > 0 || priceRange.min || priceRange.max || inStockOnly) && (
                       <button 
                          onClick={clearAllFilters}
                          className="w-7 h-7 bg-white border-2 border-black/10 rounded-full flex items-center justify-center text-black/40 hover:text-black transition-all shadow-sm active:scale-95"
                          title="Reset All"
                       >
                          <RotateCcw size={12} strokeWidth={3} />
                       </button>
                    )}
                 </div>
              </div>

              {/* Active Filter Chips with 'Box-X' icons - Horizontal Scroll for Density */}
              {(selectedCategories.length > 0 || priceRange.min || priceRange.max || inStockOnly) && (
                <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2 snap-x">
                   <AnimatePresence>
                      {selectedCategories.map(catId => {
                         const cat = categories.find(c => c.id === catId);
                         return (
                            <motion.button 
                              key={catId} layout initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                              onClick={() => toggleCategory(catId)}
                              className="pl-4 pr-1 py-1 bg-black text-white rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 group/chip"
                            >
                               {cat?.name} 
                               <div className="w-4 h-4 bg-white text-black rounded-[4px] flex items-center justify-center group-hover/chip:scale-110 transition-transform">
                                  <X size={10} strokeWidth={4} />
                               </div>
                            </motion.button>
                         );
                      })}
                      {(priceRange.min || priceRange.max) && (
                         <motion.button 
                           key="price" layout initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                           onClick={() => setPriceRange({ min: '', max: '' })}
                           className="pl-4 pr-1 py-1 bg-black text-white rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 group/chip"
                         >
                            ₹{priceRange.min || '0'} - {priceRange.max || 'MAX'}
                            <div className="w-4 h-4 bg-white text-black rounded-[4px] flex items-center justify-center group-hover/chip:scale-110 transition-transform">
                               <X size={10} strokeWidth={4} />
                            </div>
                         </motion.button>
                      )}
                      {inStockOnly && (
                         <motion.button 
                           key="stock" layout initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                           onClick={() => setInStockOnly(false)}
                           className="pl-4 pr-1 py-1 bg-black text-white rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 group/chip"
                         >
                            LIVE STOCK
                            <div className="w-4 h-4 bg-white text-black rounded-[4px] flex items-center justify-center group-hover/chip:scale-110 transition-transform">
                               <X size={10} strokeWidth={4} />
                            </div>
                         </motion.button>
                      )}
                   </AnimatePresence>
                </div>
              )}
           </div>
           {loading ? (
             <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-[260px] md:h-[360px] bg-black/[0.03] rounded-[16px] animate-pulse" />
                ))}
             </div>
           ) : products.length === 0 ? (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className="py-40 flex flex-col items-center justify-center text-black/20 space-y-12 bg-black/[0.02] rounded-[40px] border-2 border-dashed border-black/[0.05]"
             >
                <Search size={80} strokeWidth={1} />
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-black uppercase tracking-tighter">Inventory Gap</h2>
                  <p className="text-[11px] font-bold uppercase tracking-normal max-w-sm mx-auto leading-relaxed">No synchronization nodes matching your criteria. Reset parameters to re-init.</p>
                </div>
                <button onClick={clearAllFilters} className="bg-black text-white px-20 py-6 rounded-full text-[12px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl">Re-Init Inventory</button>
             </motion.div>
           ) : (
             <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-12">
                <AnimatePresence mode="popLayout">
                   {products.map((p) => (
                      <motion.div 
                         key={p.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                         exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      >
                         <ProductCard product={p as any} className="!bg-[#D6D6D6] !border-black/5" />
                      </motion.div>
                   ))}
                </AnimatePresence>
             </div>
           )}
        </section>
      </main>
    </div>
  );
}
