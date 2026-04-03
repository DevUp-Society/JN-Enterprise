import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { RetailerPortalHeader } from '../../components/navigation/RetailerPortalHeader';
import { ProductCard } from '../../components/premium/ProductCard';
import { ProductDetailModal } from '../../components/premium/ProductDetailModal';
import { ChevronDown, Loader2, PackageSearch, Box, Filter } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export default function ShopPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category');

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  const fetchProducts = async () => {
     setLoading(true);
     try {
        const categoryQuery = selectedCategory.length > 0 ? selectedCategory[0] : 'All';
        const response = await axiosInstance.get('/products', {
           params: {
              category: categoryQuery,
              limit: 50
           }
        });
        
        let filteredProducts = response.data.products;
        if (inStockOnly) {
           filteredProducts = filteredProducts.filter((p: any) => p.stock > 0);
        }

        setProducts(filteredProducts);
        setTotalResults(response.data.total);
     } catch (error) {
        console.error('Error fetching products:', error);
     } finally {
        setLoading(false);
     }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, inStockOnly]);

  return (
    <div className="min-h-screen bg-dark text-white font-sans selection:bg-primary/20 pb-40">
      <RetailerPortalHeader />
      
      <main className="max-w-[1750px] mx-auto px-12 flex gap-16 py-32">
        {/* Sidebar Filters - Minimal Integrated Style */}
        <aside className="w-72 hidden lg:block space-y-12 h-fit sticky top-32">
          <div className="flex items-center gap-4 text-primary mb-8 border-b border-white/5 pb-6">
             <Filter size={18} />
             <h4 className="text-[12px] font-black uppercase tracking-widest-xl">Audit Filters</h4>
          </div>

          <div className="space-y-10">
            {/* Availability Toggle */}
            <div className="space-y-6">
               <h5 className="text-[10px] font-black uppercase tracking-widest-xl text-white/20">Stock Availability</h5>
               <div className="flex items-center justify-between bg-dark-surface p-5 rounded-3xl border border-white/5 shadow-2xl">
                  <span className="text-[11px] font-bold uppercase text-white/60">In Stock only</span>
                  <button 
                    onClick={() => setInStockOnly(!inStockOnly)}
                    className={`w-12 h-6 rounded-full relative p-1 transition-all duration-300 ${inStockOnly ? 'bg-primary' : 'bg-white/10'}`}
                  >
                     <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-md ${inStockOnly ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
               </div>
            </div>

            {/* Price Selection */}
            <div className="space-y-6">
                <h5 className="text-[10px] font-black uppercase tracking-widest-xl text-white/20">Price Threshold</h5>
                <div className="bg-dark-surface p-8 rounded-[38px] border border-white/5 shadow-2xl space-y-8">
                   <input type="range" className="w-full accent-primary bg-white/5 h-[3px] cursor-pointer" />
                   <div className="flex justify-between text-[10px] font-black uppercase text-white/20 tracking-tighter">
                      <span>$0 USD</span>
                      <span>$5,000+ USD</span>
                   </div>
                </div>
            </div>

            {/* Active Archive Info */}
            <div className="pt-8">
               <div className="p-8 bg-primary/5 rounded-[40px] border border-primary/10">
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest-xl block mb-3">Sector Path</span>
                  <p className="text-[12px] font-black text-white uppercase tracking-tighter">
                     {selectedCategory.length > 0 ? selectedCategory[0] : "Global"} Archive Registry
                  </p>
                  <button onClick={() => setSelectedCategory([])} className="text-[10px] font-black text-primary uppercase tracking-widest mt-6 border-b border-primary/20 hover:border-primary transition-all">Reset All Pathing</button>
               </div>
            </div>
          </div>
        </aside>

        {/* Product Grid - Deep Enterprise UI */}
        <div className="flex-1 space-y-16">
          {/* Header Banner - High Density */}
          <div className="bg-dark-surface p-12 rounded-[56px] border border-white/5 shadow-2xl relative overflow-hidden group">
             <div className="relative z-10 space-y-8">
                <div className="inline-flex items-center gap-3 px-4 py-1 bg-primary/10 rounded-full">
                    <Box size={14} className="text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest-xl">Authorized Wholesale Terminal</span>
                </div>
                <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.85] font-serif">
                   Inventory <br /> 
                   <span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-12">Registry_</span>
                </h2>
                <div className="flex items-center gap-8 text-[11px] font-bold text-white/20 uppercase tracking-widest-xl">
                   <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> {totalResults} SKUs Vetted</span>
                   <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Global Fulfillment</span>
                </div>
             </div>
             <PackageSearch size={250} className="absolute -bottom-16 -right-16 text-white/[0.02] -rotate-12 transition-transform group-hover:rotate-0 duration-[3s]" />
          </div>

          <header className="flex justify-between items-center bg-white/5 p-5 rounded-3xl border border-white/5 shadow-inner">
             <div className="px-6">
                <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em]">Sector Stream Archive / {selectedCategory.length > 0 ? selectedCategory[0] : "Global"}</span>
             </div>
             <button className="flex items-center gap-4 px-10 h-14 bg-dark-surface border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-primary transition-all shadow-xl">
                Sort Archives <ChevronDown size={14} />
             </button>
          </header>

          {loading ? (
             <div className="flex flex-col items-center justify-center py-48 space-y-8">
                <Loader2 className="animate-spin text-primary" size={64} />
                <span className="text-[12px] font-black uppercase tracking-widest-xl text-white/10 animate-pulse">Scanning Inventory Grid...</span>
             </div>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                {products.length === 0 ? (
                  <div className="col-span-full py-64 text-center space-y-8">
                     <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-2xl">
                        <PackageSearch size={48} className="text-white/10" />
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-3xl font-black text-white/10 uppercase tracking-widest">Sector Void: No Logged SKUs</h3>
                        <p className="text-white/5 uppercase font-bold tracking-widest text-xs">Path Registry returned null for this query</p>
                     </div>
                     <button onClick={() => { setSelectedCategory([]); setInStockOnly(false); }} className="px-12 py-5 bg-primary text-white rounded-full text-[13px] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 transition-all">Clear All Audit Logs</button>
                  </div>
                ) : (
                  products.map((p) => (
                    <div key={p.id} onClick={() => setSelectedProduct(p)} className="cursor-pointer group">
                      <ProductCard product={p} />
                    </div>
                  ))
                )}
             </div>
          )}
        </div>
      </main>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
