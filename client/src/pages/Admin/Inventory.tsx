import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  X,
  Filter,
  LayoutGrid,
  List,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import { SkeletonTableRow } from '../../components/premium/SkeletonCards';
import { IndustrialAlert } from '../../components/premium/IndustrialAlert';

type ViewMode = 'LIST' | 'CATEGORIZE';

export default function Inventory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // High-Fidelity Authority Logic
  const canView = user?.isSuperAdmin || user?.permissions?.canViewInventory;
  const canAdd = user?.isSuperAdmin || user?.permissions?.canAddProduct;
  const canEdit = user?.isSuperAdmin || user?.permissions?.canAddProduct; // Edit and Add are linked here
  
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Interaction State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter Logic State
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [stockStatus, setStockStatus] = useState('ALL');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchProducts = async (pageToFetch = 1, append = false) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/products?page=${pageToFetch}&limit=8`);
      
      const { products: newProducts, pagination } = response.data;

      // Map Prisma schema to UI schema
      const mapped = newProducts.map((p: any) => ({
        ...p,
        stock: p.stockQuantity,
        price: Number(p.price),
        image: p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200'
      }));

      if (append) {
        setProducts(prev => [...prev, ...mapped]);
      } else {
        setProducts(mapped);
      }
      
      setHasMore(pagination.hasNextPage);
      setPage(pagination.page);
      
      // Still load category matrix for UI structure
      if (isInitialLoad) {
        const catRes = await axiosInstance.get('/products/categories');
        setCategories(catRes.data.categories);
        setIsInitialLoad(false);
      }
      setError(null);
    } catch (err: any) {
      console.error('FETCH_PRODUCTS_FAILURE', err);
      setError('Unable to synchronize inventory control registry.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchProducts(page + 1, true);
    }
  };

  useEffect(() => {
    fetchProducts(1, false);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const pCategoryName = typeof p.category === 'object' ? p.category?.name : p.category;
      const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = activeCategoryFilter === 'ALL' || pCategoryName === activeCategoryFilter;
      const matchPrice = p.price >= priceRange.min && p.price <= priceRange.max;
      const matchStock = stockStatus === 'ALL' || (stockStatus === 'IN_STOCK' ? p.stock > 0 : p.stock === 0);
      return matchQuery && matchCategory && matchPrice && matchStock;
    });
  }, [products, searchQuery, activeCategoryFilter, priceRange, stockStatus]);


  const handleCategoryClick = (categoryName: string) => {
    setActiveCategoryFilter(categoryName);
    setViewMode('LIST');
  };

  return (
    <div className="space-y-8 pb-24 select-none">
      {/* Header Section */}
      {error && (
        <div className="fixed inset-0 z-[200] bg-white/60 backdrop-blur-sm flex items-center justify-center p-20">
          <IndustrialAlert message={error} onRetry={fetchProducts} />
        </div>
      )}
      <header className="flex flex-col gap-6 border-b border-[#000000]/10 pb-8 mt-4">
        <div className="flex items-center">
           <h1 className="text-3xl font-black text-[#000000] tracking-tight uppercase">
              Inventory Control
           </h1>
        </div>

        {/* OPERATION_BAR_PROTOCOL */}
         <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] items-center gap-6">
            <div className="flex-1 min-w-0">
               <AnimatePresence mode="wait">
                  {viewMode === 'LIST' && (
                     <motion.div 
                        key="search"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center gap-4 w-full"
                     >
                        <div className="relative group flex-1">
                           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#000000]/20 group-focus-within:text-[#000000] transition-colors" size={18} />
                           <input 
                             type="text" 
                             placeholder="SYNC_SEARCH_IDENTIFIER..."
                             value={searchQuery}
                             onChange={(e) => setSearchQuery(e.target.value)}
                             className="w-full h-14 bg-white border-2 border-[#000000]/5 rounded-[24px] pl-16 pr-8 text-[12px] font-black tracking-widest focus:outline-none focus:border-[#000000]/20 transition-all placeholder:text-[#000000]/20 text-[#000000] uppercase"
                           />
                        </div>
                        <button 
                           onClick={() => setIsFilterOpen(true)}
                           className="flex items-center gap-3 px-8 h-14 bg-white border-2 border-[#000000]/5 rounded-[24px] text-[11px] font-black text-[#000000]/40 hover:text-[#000000] hover:bg-[#D6D6D6] transition-all group shrink-0 uppercase tracking-widest shadow-sm"
                        >
                           <Filter size={18} className="text-[#000000]/20 group-hover:text-[#000000]" />
                           Filter
                        </button>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>

            <div className="flex items-center gap-4 w-full xl:w-auto shrink-0 justify-end">
               <div className="bg-white p-1.5 border-2 border-[#000000]/5 rounded-[24px] flex items-center shadow-sm">
                  <button 
                     onClick={() => setViewMode('LIST')}
                     className={`flex items-center gap-3 px-8 h-12 text-[10px] font-black uppercase tracking-widest rounded-[18px] transition-all ${viewMode === 'LIST' ? 'bg-[#000000] text-[#D6D6D6] shadow-xl' : 'text-[#000000]/40 hover:text-[#000000] hover:bg-[#D6D6D6]'}`}
                  >
                     <List size={18} />
                     List
                  </button>
                  <button 
                     onClick={() => setViewMode('CATEGORIZE')}
                     className={`flex items-center gap-3 px-8 h-12 text-[10px] font-black uppercase tracking-widest rounded-[18px] transition-all ${viewMode === 'CATEGORIZE' ? 'bg-[#000000] text-[#D6D6D6] shadow-xl' : 'text-[#000000]/40 hover:text-[#000000] hover:bg-[#D6D6D6]'}`}
                  >
                     <LayoutGrid size={18} />
                     Grid
                  </button>
               </div>
               {canAdd && (
                  <button 
                     onClick={() => navigate('/admin/inventory/create')}
                     className="px-10 h-14 bg-[#000000] text-[#D6D6D6] rounded-[24px] flex items-center justify-center gap-4 text-[11px] font-black hover:bg-[#FFFFFF] transition-all shadow-xl active:scale-95 whitespace-nowrap uppercase tracking-widest"
                  >
                     <Plus size={20} strokeWidth={3} />
                     Add New Product
                  </button>
               )}
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
            {canView ? (
              <div className="bg-white border border-[#000000]/5 shadow-sm rounded-[40px] relative overflow-hidden">
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-[#000000] text-[#D6D6D6]">
                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] min-w-[300px]">Product Descriptor</th>
                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em]">Category</th>
                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em]">Capital Valuation</th>
                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em]">Stock Available</th>
                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-right"></th>
                         </tr>
                      </thead>
                       <tbody className="divide-y divide-[#000000]/5">
                         {loading && products.length === 0 ? (
                           Array.from({ length: 6 }).map((_, i) => <SkeletonTableRow key={i} />)
                         ) : filteredProducts.length === 0 ? (
                            <tr>
                               <td colSpan={5} className="p-20 text-center">
                                  <p className="text-xs font-bold text-[#000000]/40 uppercase tracking-widest">No Products Found</p>
                               </td>
                            </tr>
                         ) : filteredProducts.map((p) => (
                            <tr 
                               key={p.id} 
                               className="hover:bg-[#D6D6D6]/40 transition-all group cursor-pointer"
                               onClick={() => setSelectedProduct(p)}
                            >
                               <td className="px-10 py-10">
                                  <div className="flex items-center gap-8">
                                     <div className="w-20 h-20 bg-white rounded-[24px] border-2 border-[#000000]/5 p-1.5 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform overflow-hidden">
                                        <img src={p.image} className="w-full h-full object-cover rounded-[18px]" alt="P" />
                                     </div>
                                     <div className="space-y-1.5 overflow-hidden">
                                        <h4 className="text-[15px] font-black text-[#000000] uppercase tracking-tighter truncate leading-tight">{p.name}</h4>
                                        <code className="text-[10px] font-black text-[#000000]/30 uppercase tracking-[0.2em] block">ID: {p.id.split('-')[0]}</code>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-10 py-10">
                                  <span className="text-[10px] font-black text-[#000000] uppercase tracking-[0.2em]">
                                     {typeof p.category === 'object' ? (p.category as any)?.name : (p.category || 'UNASSIGNED')}
                                  </span>
                               </td>
                               <td className="px-10 py-10 text-[16px] font-black text-[#000000] tracking-tighter">
                                  ₹{p.price.toLocaleString()}
                               </td>
                               <td className="px-10 py-10">
                                  <div className="inline-flex items-center gap-4 px-8 py-3 bg-[#000000]/5 rounded-full border-2 border-[#000000]/5 shadow-inner">
                                     <span className="text-[14px] font-black text-[#000000]">{p.stock}</span>
                                     <span className="text-[9px] font-black text-[#000000]/30 uppercase tracking-[0.2em]">units_present</span>
                                  </div>
                               </td>
                               <td className="px-10 py-10 text-right">
                                  <div className="w-12 h-12 rounded-full bg-white border-2 border-[#000000]/5 flex items-center justify-center text-[#000000]/20 group-hover:text-[#000000] group-hover:bg-[#D6D6D6] transition-all ml-auto shadow-sm">
                                     <ChevronRight size={22} />
                                  </div>
                               </td>
                            </tr>
                         ))}
                       </tbody>
                   </table>
                </div>
              </div>
            ) : (
              <div className="p-32 text-center bg-white border-2 border-black/5 rounded-[40px] shadow-sm">
                 <p className="text-[12px] font-black text-[#000000]/20 uppercase tracking-[0.5em]">Inventory Metadata Registry: Restricted View</p>
                 <p className="text-[10px] font-bold text-black/40 mt-4 uppercase">Direct modification authorized. Use 'Add New Product' to synchronize with catalog.</p>
              </div>
            )}

            <div className="flex justify-center pt-12">
               {hasMore ? (
                <button 
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-12 h-16 bg-white border-2 border-[#000000]/5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] text-[#000000]/40 hover:text-[#000000] hover:bg-[#D6D6D6] transition-all disabled:opacity-50 group flex items-center gap-4 shadow-xl active:scale-95"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                       <div className="w-4 h-4 border-2 border-[#000000]/20 border-t-[#000000] animate-spin rounded-full" />
                       SYNCING...
                    </div>
                  ) : (
                    <>
                      LOAD MORE RECORDS
                      <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                    </>
                  )}
                </button>
              ) : products.length > 0 && (
                <div className="flex flex-col items-center gap-4 opacity-20">
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#000000]">END OF REGISTRY DATA STREAM</p>
                </div>
              )}
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
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: i * 0.05 }}
                   onClick={() => handleCategoryClick(cat.name)}
                   className="group bg-white border-2 border-[#000000]/5 p-10 transition-all hover:bg-[#D6D6D6] cursor-pointer shadow-xl rounded-[40px] relative overflow-hidden"
                >
                   <div className="space-y-6">
                      <div className="flex justify-between items-start">
                         <h2 className="text-2xl font-black text-[#000000] group-hover:scale-105 transition-transform uppercase tracking-tighter">
                            {cat.name}
                         </h2>
                         <ChevronRight size={24} className="text-[#000000]/20 group-hover:text-[#000000] transition-all" />
                      </div>

                      <div className="flex items-center gap-4">
                         <p className="text-[10px] font-black text-[#000000]/40 uppercase tracking-[0.4em]">{cat.totalSkus} units</p>
                         <div className="h-[2px] flex-1 bg-[#000000]/5" />
                      </div>
                   </div>
                   <div className="absolute top-0 right-0 w-24 h-24 bg-[#000000]/5 -translate-y-1/2 translate-x-1/2 rounded-full group-hover:bg-[#000000]/10 transition-colors" />
                </motion.div>
             ))}
          </motion.section>
        )}
      </AnimatePresence>

      {/* FOOTER_RECORDS_LOG */}
      <footer className="pt-12 border-t border-[#000000]/10 text-center">
         <p className="text-[10px] font-black text-[#000000]/20 uppercase tracking-[0.5em]">Inventory Metadata Registry: Industrial Catalog Mode</p>
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
        {selectedProduct && <EditProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} canEdit={canEdit} />}
      </AnimatePresence>
    </div>
  );
}

function FilterModal({ onClose, categories, activeFilter, setActiveFilter, priceRange, setPriceRange, stockStatus, setStockStatus }: any) {
  return (
    <div className="fixed inset-0 bg-[#000000]/30 backdrop-blur-md z-[600] flex justify-end">
       <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="w-full max-w-xl bg-white h-full shadow-[0_0_80px_rgba(0,0,0,0.2)] flex flex-col font-sans"
       >
          <header className="p-10 border-b border-[#000000]/10 flex items-center justify-between bg-[#D6D6D6]/30">
             <div className="space-y-1">
                <h2 className="text-3xl font-black text-[#000000] tracking-tighter uppercase">Filter Settings</h2>
                <p className="text-[10px] font-black text-[#000000]/20 uppercase tracking-[0.3em]">Refine registry view</p>
             </div>
             <button onClick={onClose} className="p-4 bg-white rounded-full text-[#000000]/20 hover:text-black hover:bg-black transition-all active:scale-90">
                <X size={24} />
             </button>
          </header>

          <div className="flex-1 p-10 overflow-y-auto space-y-12 custom-scrollbar">
             <div className="space-y-6">
                <h3 className="text-[10px] font-black text-[#000000]/30 uppercase tracking-[0.5em]">Sector Focus</h3>
                <div className="grid grid-cols-2 gap-4">
                   <button 
                      onClick={() => setActiveFilter('ALL')}
                      className={`h-14 border-2 rounded-[20px] text-[10px] font-black tracking-widest transition-all ${activeFilter === 'ALL' ? 'bg-[#000000] text-[#D6D6D6] border-[#000000] shadow-lg' : 'border-[#000000]/5 text-[#000000]/40 hover:bg-[#D6D6D6]'} uppercase px-6`}
                   >
                      All Nodes
                   </button>
                   {categories.map((cat: any) => (
                      <button 
                         key={cat.id}
                         onClick={() => setActiveFilter(cat.name)}
                         className={`h-14 border-2 rounded-[20px] text-[10px] font-black tracking-widest transition-all ${activeFilter === cat.name ? 'bg-[#000000] text-[#D6D6D6] border-[#000000] shadow-lg' : 'border-[#000000]/5 text-[#000000]/40 hover:bg-[#D6D6D6]'} uppercase px-6 truncate`}
                      >
                         {cat.name}
                      </button>
                   ))}
                </div>
             </div>

             <div className="space-y-6">
                <h3 className="text-[10px] font-black text-[#000000]/30 uppercase tracking-[0.5em]">Valuation Range</h3>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#000000]/30 uppercase tracking-widest">Min (₹)</label>
                      <input 
                         type="number" 
                         value={priceRange.min}
                         onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                         className="w-full h-14 bg-[#D6D6D6]/30 border-2 border-transparent rounded-[20px] px-6 text-sm font-black text-[#000000] focus:outline-none focus:border-[#000000]/10 focus:bg-white transition-all shadow-inner" 
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#000000]/30 uppercase tracking-widest">Max (₹)</label>
                      <input 
                         type="number" 
                         value={priceRange.max}
                         onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                         className="w-full h-14 bg-[#D6D6D6]/30 border-2 border-transparent rounded-[20px] px-6 text-sm font-black text-[#000000] focus:outline-none focus:border-[#000000]/10 focus:bg-white transition-all shadow-inner" 
                      />
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <h3 className="text-[10px] font-black text-[#000000]/30 uppercase tracking-[0.5em]">Operational Status</h3>
                <div className="flex flex-col gap-4">
                   {['ALL', 'IN_STOCK', 'OUT_OF_STOCK'].map(status => (
                      <button 
                         key={status}
                         onClick={() => setStockStatus(status)}
                         className={`h-14 px-8 border-2 rounded-[20px] text-[10px] font-black transition-all flex items-center justify-between ${stockStatus === status ? 'bg-[#000000] text-[#D6D6D6] border-[#000000] shadow-lg' : 'border-[#000000]/5 text-[#000000]/40 hover:bg-[#D6D6D6]'} uppercase tracking-widest`}
                      >
                         {status.replace(/_/g, ' ')}
                         <div className={`w-3 h-3 rounded-full ${stockStatus === status ? 'bg-[#FFFFFF] animate-pulse shadow-[0_0_8px_rgba(93,170,104,0.5)]' : 'bg-[#000000]/10'}`} />
                      </button>
                   ))}
                </div>
             </div>
          </div>

          <footer className="p-10 border-t border-[#000000]/10 flex justify-between gap-6 bg-[#D6D6D6]/10">
             <button 
                onClick={() => {
                   setActiveFilter('ALL');
                   setPriceRange({ min: 0, max: 10000 });
                   setStockStatus('ALL');
                }}
                className="flex-1 h-14 bg-white border-2 border-[#000000]/5 rounded-[20px] text-[11px] font-black text-[#000000]/40 hover:text-[#000000] hover:bg-[#D6D6D6] transition-all uppercase tracking-widest shadow-sm"
             >
                ABORT_FILTER
             </button>
             <button 
                onClick={onClose}
                className="flex-1 h-14 bg-[#000000] text-[#D6D6D6] rounded-[20px] text-[11px] font-black hover:bg-[#FFFFFF] transition-all shadow-xl uppercase tracking-widest active:scale-95"
             >
                SYNC_CATALOG
             </button>
          </footer>
       </motion.div>
    </div>
  );
}

function EditProductModal({ product, onClose, canEdit }: any) {
    return (
       <div className="fixed inset-0 bg-[#000000]/30 backdrop-blur-md z-[600] flex items-center justify-center p-6 md:p-12">
          <motion.div 
             initial={{ opacity: 0, scale: 0.95, y: 30 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.95, y: 30 }}
             className="bg-white w-full max-w-5xl border-2 border-[#000000]/5 rounded-[48px] shadow-[0_0_100px_rgba(0,0,0,0.2)] flex flex-col relative overflow-hidden font-sans"
          >
             <button onClick={onClose} className="absolute top-10 right-10 p-4 bg-[#D6D6D6] rounded-full text-[#000000]/20 hover:text-black hover:bg-black transition-all z-20 shadow-sm active:scale-90">
                <X size={24} />
             </button>
             
             <div className="flex flex-col lg:flex-row h-auto max-h-[90vh]">
                <div className="lg:w-2/5 border-r-2 border-[#000000]/5 bg-[#D6D6D6]/30 p-12 flex flex-col space-y-8 items-center text-center">
                   <div className="w-full aspect-square bg-white border-2 border-[#000000]/5 rounded-[40px] p-2 flex-shrink-0 shadow-2xl relative group overflow-hidden">
                      <img src={product.image} className="w-full h-full object-cover rounded-[34px] group-hover:scale-110 transition-transform duration-700" alt="P" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                   <div className="space-y-3 w-full">
                      <p className="text-[10px] font-black text-[#000000]/30 uppercase tracking-[0.4em]">{product.id ? product.id.split('-')[0] : 'TEMP_ID'}</p>
                      <h3 className="text-3xl font-black text-[#000000] tracking-tighter uppercase leading-tight line-clamp-3">{product.name}</h3>
                      <div className="h-[2px] w-16 bg-[#FFFFFF] mx-auto mt-6 rounded-full" />
                   </div>
                </div>
                
                <div className="flex-1 p-12 overflow-y-auto space-y-12 custom-scrollbar bg-white">
                   <div className="space-y-4">
                      <h4 className="text-4xl font-black text-[#000000] tracking-tighter uppercase">Product Registry_</h4>
                      <p className="text-[10px] font-black text-[#000000]/20 uppercase tracking-[0.3em]">Update institutional control parameters</p>
                   </div>

                   <div className="grid grid-cols-1 gap-10">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-[#000000]/40 uppercase tracking-[0.4em] ml-2">Display Name_</label>
                         <input type="text" readOnly={!canEdit} defaultValue={product.name} className="w-full h-16 bg-[#D6D6D6]/30 border-2 border-transparent rounded-[24px] px-8 font-bold text-[#000000] text-sm focus:outline-none focus:border-[#000000]/10 focus:bg-white transition-all shadow-inner uppercase" />
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-[#000000]/40 uppercase tracking-[0.4em] ml-2">Stock Inventory_</label>
                            <input type="number" readOnly={!canEdit} defaultValue={product.stock} className="w-full h-16 bg-[#D6D6D6]/30 border-2 border-transparent rounded-[24px] px-8 font-bold text-[#000000] text-sm focus:outline-none focus:border-[#000000]/10 focus:bg-white transition-all shadow-inner" />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-[#000000]/40 uppercase tracking-[0.4em] ml-2">Valuation (₹)_</label>
                            <input type="number" readOnly={!canEdit} defaultValue={product.price} className="w-full h-16 bg-[#D6D6D6]/30 border-2 border-transparent rounded-[24px] px-8 font-bold text-[#000000] text-sm focus:outline-none focus:border-[#000000]/10 focus:bg-white transition-all shadow-inner" />
                         </div>
                      </div>
                   </div>

                   {canEdit && (
                     <div className="pt-8 mt-auto sticky bottom-0 bg-white">
                        <button className="w-full h-20 bg-[#000000] text-[#D6D6D6] rounded-[28px] text-[12px] font-black uppercase tracking-[0.5em] hover:bg-[#FFFFFF] transition-all shadow-2xl active:scale-95 group flex items-center justify-center gap-4">
                           Commit Changes_ <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                     </div>
                   )}
                </div>
             </div>
          </motion.div>
       </div>
    );
}
