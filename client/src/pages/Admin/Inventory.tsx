import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  X,
  Filter,
  LayoutGrid,
  List,
  ChevronRight,
  DollarSign,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DataService } from '../../services/DataService';

type ViewMode = 'LIST' | 'CATEGORIZE';

export default function Inventory() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Interaction State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter Logic State
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [stockStatus, setStockStatus] = useState('ALL');

  useEffect(() => {
    const load = () => {
      setProducts(DataService.getProducts());
      setCategories(DataService.getCategoryMatrix());
    };
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = activeCategoryFilter === 'ALL' || p.category === activeCategoryFilter;
      const matchPrice = p.price >= priceRange.min && p.price <= priceRange.max;
      const matchStock = stockStatus === 'ALL' || (stockStatus === 'IN_STOCK' ? p.stock > 0 : p.stock === 0);
      return matchQuery && matchCategory && matchPrice && matchStock;
    });
  }, [products, searchQuery, activeCategoryFilter, priceRange, stockStatus]);

  const totalCapital = useMemo(() => products.reduce((acc, p) => acc + (p.stock * p.price), 0), [products]);

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategoryFilter(categoryName);
    setViewMode('LIST');
  };

  return (
    <div className="space-y-10 pb-24 font-mono select-none">
      {/* TERMINAL_HEADER_PROTOCOL */}
      <header className="flex flex-col gap-10 border-b border-primary/10 pb-12">
        <div className="flex items-center">
           <h1 className="text-3xl font-black text-primary dark:text-bone tracking-tighter uppercase leading-none">
              INVENTORY CONTROL
           </h1>
           <div className="h-[1px] flex-1 bg-primary/5 mx-10" />
        </div>

        {/* OPERATION_BAR_PROTOCOL */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] items-center gap-10">
           {/* Conditional Tool Visibility based on viewMode */}
           <div className="flex-1 min-w-0">
             <AnimatePresence mode="wait">
                {viewMode === 'LIST' && (
                   <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center gap-4 w-full"
                   >
                      <div className="relative group flex-1">
                         <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-gold transition-colors" size={16} />
                         <input 
                           type="text" 
                           placeholder="SEARCH REGISTRY..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="w-full h-12 bg-white dark:bg-dark-surface border border-primary/10 pl-14 pr-6 text-[11px] font-black tracking-widest uppercase focus:outline-none focus:border-primary transition-all placeholder:text-primary/10"
                         />
                      </div>
                      <button 
                         onClick={() => setIsFilterOpen(true)}
                         className="flex items-center gap-3 px-8 h-12 bg-white dark:bg-dark-surface border border-primary/10 text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 hover:text-primary hover:border-primary transition-all group shrink-0"
                      >
                         <Filter size={14} className="text-primary/40 group-hover:text-primary" />
                         FILTER
                      </button>
                   </motion.div>
                )}
             </AnimatePresence>
           </div>

           <div className="flex items-center gap-4 w-full xl:w-auto shrink-0 justify-end">
              <div className="bg-white dark:bg-dark-surface p-1 border border-primary/5 shadow-sm flex items-center">
                 <button 
                    onClick={() => setViewMode('LIST')}
                    className={`flex items-center gap-2 px-6 h-10 text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'LIST' ? 'bg-[#4B5E6D] text-white' : 'text-primary/30 hover:text-primary hover:bg-primary/5'}`}
                 >
                    <List size={14} />
                    LIST MODE
                 </button>
                 <button 
                    onClick={() => setViewMode('CATEGORIZE')}
                    className={`flex items-center gap-2 px-6 h-10 text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'CATEGORIZE' ? 'bg-[#4B5E6D] text-white' : 'text-primary/30 hover:text-primary hover:bg-primary/5'}`}
                 >
                    <LayoutGrid size={14} />
                    GRID
                 </button>
              </div>
              <button 
                 onClick={() => navigate('/admin/inventory/create')}
                 className="px-10 h-12 bg-[#4B5E6D] text-white flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-primary transition-all shadow-xl active:scale-95 whitespace-nowrap"
              >
                 <Plus size={18} />
                 ADD NEW
              </button>
           </div>
        </div>
      </header>

      {/* DUAL_MODE_DISPLAY */}
      <AnimatePresence mode="wait">
        {viewMode === 'LIST' ? (
          <motion.section 
            key="list"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            className="space-y-10"
          >
            {/* HIGH_FIDELITY_REGISTRY_TABLE */}
            <div className="bg-white dark:bg-dark-surface border border-primary/10 shadow-2xl relative overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-bone dark:bg-dark border-b border-primary/10">
                           <th className="p-10 text-[8px] font-black text-primary/40 uppercase tracking-widest font-mono">UID_SERIAL</th>
                           <th className="p-10 text-[8px] font-black text-primary/40 uppercase tracking-widest font-mono">DESCRIPTOR</th>
                           <th className="p-10 text-[8px] font-black text-primary/40 uppercase tracking-widest font-mono">CATEGORY</th>
                           <th className="p-10 text-[8px] font-black text-primary/40 uppercase tracking-widest font-mono">VALUATION</th>
                           <th className="p-10 text-[8px] font-black text-primary/40 uppercase tracking-widest font-mono">RESERVE</th>
                           <th className="p-10 text-[8px] font-black text-primary/40 uppercase tracking-widest font-mono text-center">STATUS</th>
                           <th className="p-10 text-[8px] font-black text-primary/40 uppercase tracking-widest font-mono text-right"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-primary/5">
                        {filteredProducts.map((p) => {
                           const statuses = ['VERIFIED', 'TRANSIT', 'LOCKED', 'REJECTED'];
                           const statusSelection = statuses[Math.floor(Math.random() * statuses.length)];
                           const colors: any = {
                              VERIFIED: 'text-green-500 bg-green-500/10 border-green-500/20',
                              TRANSIT: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
                              LOCKED: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
                              REJECTED: 'text-red-500 bg-red-500/10 border-red-500/20'
                           };
                           const reserve = Math.floor(Math.random() * 100);

                           return (
                              <tr 
                                 key={p.id} 
                                 className="hover:bg-bone/40 dark:hover:bg-primary/5 transition-all group cursor-pointer"
                                 onClick={() => setSelectedProduct(p)}
                              >
                                 <td className="p-10">
                                    <div className="flex items-center gap-6">
                                       <div className="w-14 h-14 bg-white dark:bg-dark border border-primary/10 p-1">
                                          <img src={p.image} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all border border-primary/5" alt="P" />
                                       </div>
                                       <code className="text-[12px] font-black text-primary/40 uppercase tracking-widest group-hover:text-primary transition-colors">{p.id}</code>
                                    </div>
                                 </td>
                                 <td className="p-10">
                                    <h4 className="text-[12px] font-black text-primary dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors">{p.name}</h4>
                                 </td>
                                 <td className="p-10">
                                    <span className="text-[10px] font-black text-primary/30 uppercase tracking-widest border border-primary/5 px-4 py-2 bg-bone/30 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                                       {p.category}
                                    </span>
                                 </td>
                                 <td className="p-10 font-mono text-[13px] font-black text-primary dark:text-bone/80 tracking-tighter italic">
                                    ${p.price.toLocaleString()}.00
                                 </td>
                                 <td className="p-10">
                                    <div className="flex items-center gap-4">
                                       <span className="text-[12px] font-black text-primary/40">{reserve}%</span>
                                       <div className="w-20 h-1.5 bg-bone dark:bg-dark border border-primary/5 overflow-hidden">
                                          <div className="h-full bg-primary/20" style={{ width: `${reserve}%` }} />
                                       </div>
                                    </div>
                                 </td>
                                 <td className="p-10">
                                    <div className="flex justify-center">
                                       <div className={`inline-flex items-center gap-3 px-4 py-1.5 border text-[8px] font-black uppercase tracking-[0.2em] ${colors[statusSelection]}`}>
                                          <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                          {statusSelection}
                                       </div>
                                    </div>
                                 </td>
                                 <td className="p-10 text-right">
                                    <button className="w-10 h-10 bg-white dark:bg-dark border border-primary/10 flex items-center justify-center text-primary/20 group-hover:text-primary group-hover:border-primary transition-all">
                                       <ChevronRight size={16} />
                                    </button>
                                 </td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>
            </div>
          </motion.section>
        ) : (
          <motion.section 
            key="categorize"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
             {categories.map((cat, i) => (
                <motion.div 
                   key={cat.id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.04 }}
                   onClick={() => handleCategoryClick(cat.name)}
                   className="group bg-white dark:bg-dark-surface border border-primary/10 p-10 transition-all hover:bg-bone/40 cursor-pointer shadow-xl relative overflow-hidden"
                >
                   <div className="space-y-6">
                      <div className="flex justify-between items-start">
                         <h2 className="text-2xl font-black text-primary dark:text-white uppercase tracking-tighter leading-none group-hover:text-gold transition-colors">
                            {cat.name}
                         </h2>
                         <ChevronRight size={16} className="text-primary/10 group-hover:text-primary transition-all" />
                      </div>

                      <div className="flex items-center gap-2">
                         <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest">{cat.totalSkus} ITEMS_REGISTERED</p>
                         <div className="h-[1px] flex-1 bg-primary/5" />
                      </div>
                   </div>
                </motion.div>
             ))}
          </motion.section>
        )}
      </AnimatePresence>

      {/* TERMINAL_OPERATIONAL_FOOTER */}
      <footer className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-primary/5">
         <div className="bg-white dark:bg-dark-surface p-8 border border-primary/10 shadow-sm relative overflow-hidden group hover:border-gold/20 transition-colors">
            <DollarSign className="absolute -top-4 -right-4 text-6xl text-primary/5 group-hover:text-gold/5 transition-colors" />
            <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-4">TOTAL_CAPITAL</p>
            <p className="text-3xl font-black text-primary dark:text-white tracking-tighter italic">${totalCapital.toLocaleString()}.00</p>
            <div className="h-0.5 w-full bg-primary/5 mt-6" />
         </div>

         <div className="bg-white dark:bg-dark-surface p-8 border border-primary/10 shadow-sm group hover:border-blue-500/20 transition-colors">
            <Layers className="absolute -top-4 -right-4 text-6xl text-primary/5 group-hover:text-blue-500/5 transition-colors" />
            <div className="flex justify-between items-start mb-4">
               <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">STORAGE_UTILITY</p>
               <p className="text-lg font-black text-primary dark:text-white tracking-tighter">78.4%</p>
            </div>
            <div className="h-1 w-full bg-bone dark:bg-dark border border-primary/5 mt-6 relative overflow-hidden">
               <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '78.4%' }}
                  className="h-full bg-[#D4C3A3] shadow-[0_0_10px_rgba(212,195,163,0.3)]"
               />
            </div>
         </div>

         <div className="bg-white dark:bg-dark-surface p-8 border border-primary/10 shadow-sm relative group overflow-hidden hover:border-green-500/20 transition-colors">
            <div className="flex justify-between items-start mb-4">
               <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">SYSTEM_STATUS</p>
               <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse" />
            </div>
            <p className="text-3xl font-black text-[#1E3A8A] dark:text-green-400/80 tracking-tighter uppercase italic">NOMINAL</p>
            <div className="h-0.5 w-full bg-green-500/20 mt-6" />
         </div>
      </footer>

      {/* MODAL_LAYERS_STACK */}
      <AnimatePresence>
        {isFilterOpen && (
           <FilterModal 
              onClose={() => setIsFilterOpen(false)} 
              categories={categories}
              activeFilter={activeCategoryFilter}
              setActiveFilter={setActiveCategoryFilter}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              stockStatus={stockStatus}
              setStockStatus={setStockStatus}
           />
        )}
        {selectedProduct && <EditProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================================
   ADVANCED_FILTER_MODAL
   ========================================================================== */
function FilterModal({ onClose, categories, activeFilter, setActiveFilter, priceRange, setPriceRange, stockStatus, setStockStatus }: any) {
  return (
    <div className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-xl z-[150] flex justify-end">
       <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="w-full max-w-xl bg-white dark:bg-[#0F172A] h-full shadow-2xl flex flex-col font-mono"
       >
          <header className="p-12 border-b border-primary/10 flex items-baseline justify-between bg-bone dark:bg-dark">
             <div className="space-y-1">
                <h2 className="text-4xl font-black text-primary dark:text-white uppercase tracking-tighter italic">FILTER_STACK</h2>
                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.3em]">Operational Scoping Engine</p>
             </div>
             <button onClick={onClose} className="p-4 bg-primary text-white hover:bg-gold transition-all">
                <X size={20} />
             </button>
          </header>

          <div className="flex-1 p-12 overflow-y-auto space-y-16">
             {/* SECTOR_PROTOCOL */}
             <div className="space-y-6">
                <h3 className="text-[11px] font-black text-[#1E3A8A] uppercase tracking-[0.4em] border-l-2 border-[#1E3A8A] pl-4">SECTOR_MATRIX</h3>
                <div className="grid grid-cols-2 gap-3">
                   <button 
                      onClick={() => setActiveFilter('ALL')}
                      className={`h-12 border text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === 'ALL' ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'border-primary/10 text-primary/30 hover:border-primary'}`}
                   >
                      TOTAL_ARCHIVE
                   </button>
                   {categories.map((cat: any) => (
                      <button 
                         key={cat.id}
                         onClick={() => setActiveFilter(cat.name)}
                         className={`h-12 border text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === cat.name ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'border-primary/10 text-primary/30 hover:border-primary px-4 truncate'}`}
                      >
                         {cat.name}
                      </button>
                   ))}
                </div>
             </div>

             {/* RANGE_PROTOCOL */}
             <div className="space-y-8">
                <h3 className="text-[11px] font-black text-[#1E3A8A] uppercase tracking-[0.4em] border-l-2 border-[#1E3A8A] pl-4">VALUATION_RANGE</h3>
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-primary/40 uppercase tracking-widest">MIN_PROTOCOL ($)</label>
                      <input 
                         type="number" 
                         value={priceRange.min}
                         onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                         className="w-full h-14 bg-bone dark:bg-dark border border-primary/10 px-6 text-[11px] font-black text-primary dark:text-white focus:outline-none focus:border-[#1E3A8A]" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-primary/40 uppercase tracking-widest">MAX_PROTOCOL ($)</label>
                      <input 
                         type="number" 
                         value={priceRange.max}
                         onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                         className="w-full h-14 bg-bone dark:bg-dark border border-primary/10 px-6 text-[11px] font-black text-primary dark:text-white focus:outline-none focus:border-[#1E3A8A]" 
                      />
                   </div>
                </div>
             </div>

             {/* AVAILABILITY_PROTOCOL */}
             <div className="space-y-6">
                <h3 className="text-[11px] font-black text-[#1E3A8A] uppercase tracking-[0.4em] border-l-2 border-[#1E3A8A] pl-4">STOCK_STATUS</h3>
                <div className="flex flex-col gap-3">
                   {['ALL', 'IN_STOCK', 'OUT_OF_STOCK'].map(status => (
                      <button 
                         key={status}
                         onClick={() => setStockStatus(status)}
                         className={`h-14 px-8 border text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-between ${stockStatus === status ? 'bg-primary text-white border-primary' : 'border-primary/10 text-primary/30 hover:border-primary'}`}
                      >
                         {status.replace(/_/g, ' ')}
                         <div className={`w-2 h-2 rounded-full ${stockStatus === status ? 'bg-gold animate-pulse' : 'bg-primary/10'}`} />
                      </button>
                   ))}
                </div>
             </div>
          </div>

          <footer className="p-12 border-t border-primary/10 bg-bone dark:bg-dark flex justify-between gap-6">
             <button 
                onClick={() => {
                   setActiveFilter('ALL');
                   setPriceRange({ min: 0, max: 10000 });
                   setStockStatus('ALL');
                }}
                className="flex-1 h-16 border border-primary/40 text-[11px] font-black uppercase tracking-[0.3em] text-primary/60 hover:bg-white transition-all"
             >
                RESET_ENGINE
             </button>
             <button 
                onClick={onClose}
                className="flex-1 h-16 bg-primary text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gold transition-all shadow-xl"
             >
                APPLY_SCOPING
             </button>
          </footer>
       </motion.div>
    </div>
  );
}

/* ==========================================================================
   EDIT_PRODUCT_MODAL (SIMPLIFIED FOR REF)
   ========================================================================== */
function EditProductModal({ product, onClose }: any) {
   return (
      <div className="fixed inset-0 bg-dark/60 backdrop-blur-md z-[100] flex items-center justify-center p-12">
         <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-surface w-full max-w-4xl border border-primary/10 shadow-2xl flex flex-col relative"
         >
            <button onClick={onClose} className="absolute top-8 right-8 p-3 text-primary/20 hover:text-primary transition-colors z-20">
               <X size={24} />
            </button>
            
            <div className="flex h-[700px]">
               <div className="w-1/3 border-r border-primary/5 bg-bone p-10 space-y-8">
                  <div className="aspect-[4/5] bg-white border border-primary/10 p-1">
                     <img src={product.image} className="w-full h-full object-cover grayscale" alt="P" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-[#1E3A8A] uppercase tracking-widest">{product.id}</p>
                     <h3 className="text-2xl font-black text-primary dark:text-white uppercase tracking-tighter leading-none mt-2">{product.name}</h3>
                  </div>
               </div>
               <div className="flex-1 p-20 overflow-y-auto space-y-12">
                  <div className="space-y-4">
                     <h4 className="text-[11px] font-black text-gold uppercase tracking-[0.4em] border-l-2 border-gold pl-4">MASTER_CONTROLS</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-10">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-primary/30 uppercase tracking-widest font-mono">NODE_DESCRIPTOR</label>
                        <input type="text" defaultValue={product.name} className="w-full h-14 bg-bone dark:bg-dark border border-primary/5 px-6 font-black uppercase text-xs" />
                     </div>
                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-primary/30 uppercase tracking-widest font-mono">STOCK_VOLUME</label>
                           <input type="number" defaultValue={product.stock} className="w-full h-14 bg-bone dark:bg-dark border border-primary/5 px-6 font-black text-xs" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-primary/30 uppercase tracking-widest font-mono">UNIT_RATE</label>
                           <input type="number" defaultValue={product.price} className="w-full h-14 bg-bone dark:bg-dark border border-primary/5 px-6 font-black text-xs" />
                        </div>
                     </div>
                  </div>
                  <button className="w-full h-16 bg-[#1E3A8A] text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-black transition-all shadow-xl">
                     PERSIST_PROTOCOL_UPDATES
                  </button>
               </div>
            </div>
         </motion.div>
      </div>
   );
}
