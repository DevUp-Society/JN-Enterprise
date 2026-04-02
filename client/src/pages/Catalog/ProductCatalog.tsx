import { useState, useMemo, useEffect } from 'react';
import type { CSSProperties } from 'react';
import * as ReactWindowModule from 'react-window';
import { AutoSizer } from 'react-virtualized-auto-sizer';
import { Search, Loader2, AlertCircle, ShoppingCart, Globe, Phone, Mail } from 'lucide-react';
import ProductMatrix from '../../components/ProductMatrix';
import Sidebar from '../../components/catalog/Sidebar';
import { useProducts } from '../../hooks/useProducts';

// Compatibility hack for react-window with certain TS/Vite configurations
const { FixedSizeList } = ReactWindowModule as any;

interface RowProps {
  index: number;
  style: CSSProperties;
  data: {
    allProducts: any[];
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
  };
}

const Row = ({ index, style, data }: RowProps) => {
  const { allProducts, hasNextPage, isFetchingNextPage, fetchNextPage } = data;
  const product = allProducts[index];

  if (!product) return null;

  if (index === allProducts.length - 2 && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  return (
    <div style={style} className="px-6 py-4">
      <div className="flex flex-col lg:flex-row gap-8 p-8 bg-white rounded-[2.5rem] border border-slate-200/60 hover:border-slate-800 transition-all shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 h-[300px] overflow-hidden group">
        <div className="w-56 h-56 bg-slate-50 rounded-3xl overflow-hidden flex-shrink-0 self-center border border-slate-100 group-hover:scale-105 transition-transform duration-500">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity" 
          />
        </div>
        
        <div className="flex-grow flex flex-col justify-between py-2">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-slate-200">
                  {product.category}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-3 line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{product.name}</h3>
              </div>
              <p className="text-3xl font-black text-slate-900 leading-none tracking-tighter">
                ${product.price ? product.price.toLocaleString() : '0.00'}
              </p>
            </div>
            <p className="text-slate-400 text-sm line-clamp-1 leading-relaxed font-medium">Wholesale professional grade {product.category?.toLowerCase() || 'item'} intended for bulk distribution.</p>
          </div>
          
          <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 border-t border-slate-50 pt-4 mt-auto">
            <span className={product.stock > 100 ? "text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded uppercase" : "text-amber-500 bg-amber-50 px-2 py-0.5 rounded uppercase"}>
              {product.stock > 0 ? `Inventory: ${product.stock}` : "Restocking Required"}
            </span>
            <span className="bg-slate-50 px-2 py-0.5 rounded uppercase tracking-tighter">SKU: {product.id}</span>
          </div>
        </div>

        <div className="w-full lg:w-[400px] border-l border-slate-100 pl-10 flex items-center bg-slate-50/10 -mr-8 -my-8 group-hover:bg-slate-50/40 transition-colors">
          <ProductMatrix 
            product={product} 
            onAddToCart={() => console.log(`[CATALOG] Order Success: ${product.name} manifested.`)} 
          />
        </div>
      </div>
    </div>
  );
};

const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useProducts({
    search: debouncedSearch,
    category,
    minPrice: priceRange[0],
    maxPrice: priceRange[1]
  });

  const allProducts = useMemo(() => {
    return data?.pages.flatMap((page) => page.products) || [];
  }, [data]);

  if (isLoading && allProducts.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-slate-900 animate-spin mx-auto opacity-10" />
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400">Syncing Catalog...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white font-sans selection:bg-slate-900 selection:text-white overflow-hidden">
       <div className="bg-slate-950 text-white/50 text-[9px] font-black uppercase tracking-[0.3em] py-2 px-8 flex justify-between items-center shrink-0">
          <div className="flex gap-8">
             <span className="flex items-center gap-2 text-white/70"><Globe size={10} /> Global Network Active</span>
             <span className="hidden md:flex items-center gap-2"><Phone size={10} /> Enterprise Support</span>
          </div>
          <div className="flex gap-6">
             <span className="flex items-center gap-2"><Mail size={10} /> sales@jn-enterprise.com</span>
          </div>
       </div>

      <header className="bg-white border-b border-slate-100 px-10 py-8 sticky top-0 z-50 shrink-0">
        <div className="max-w-[2000px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-6 group cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="w-14 h-14 bg-slate-950 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-slate-400 transition-transform hover:scale-105 active:scale-95 duration-500">
               <ShoppingCart className="w-7 h-7" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">JN Enterprise</h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] mt-0.5">Wholesale Engine</p>
            </div>
          </div>
          
          <div className="flex-grow max-w-3xl w-full">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 transition-colors group-focus-within:text-slate-900" strokeWidth={3} />
              <input
                type="text"
                placeholder="Search premium inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 pl-16 pr-8 focus:bg-white focus:border-slate-800 transition-all outline-none text-slate-900 font-bold placeholder:text-slate-300 placeholder:italic placeholder:font-medium shadow-sm hover:border-slate-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-8 shrink-0">
            <div className="hidden xl:flex flex-col text-right">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Quotation</span>
               <span className="text-2xl font-black text-slate-900 leading-none mt-1">$0.00</span>
            </div>
            <button className="bg-slate-950 text-white rounded-[1.25rem] px-8 py-5 font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-400 hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-4">
              Begin Export
              <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                 <ShoppingCart size={12} strokeWidth={3} />
              </div>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden min-h-0">
        <Sidebar 
          category={category} 
          setCategory={setCategory} 
          priceRange={priceRange} 
          setPriceRange={setPriceRange} 
        />

        <main className="flex-grow bg-white overflow-hidden relative h-full">
          {isError ? (
            <div className="flex h-full items-center justify-center p-12">
              <div className="max-w-md w-full bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 text-center">
                 <AlertCircle size={48} className="text-slate-300 mx-auto mb-6" />
                 <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Sync Failed</h2>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">Gateway connection refused. Retrying...</p>
                 <button onClick={() => window.location.reload()} className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest">Retry manually</button>
              </div>
            </div>
          ) : allProducts.length === 0 && !isLoading ? (
            <div className="flex h-full items-center justify-center p-12">
               <div className="text-center">
                  <h2 className="text-4xl font-black text-slate-200 uppercase mb-4">No Inventory</h2>
               </div>
            </div>
          ) : (
            <AutoSizer renderProp={({ height, width }: any) => (
                <FixedSizeList
                  height={height || 800}
                  itemCount={allProducts.length}
                  itemSize={340}
                  width={width || 1200}
                  className="overflow-y-auto pt-6 px-10 scrollbar-hide"
                  itemData={{
                    allProducts,
                    hasNextPage,
                    isFetchingNextPage,
                    fetchNextPage
                  }}
                >
                  {Row}
                </FixedSizeList>
              )}
            />
          )}
        </main>
      </div>

      <footer className="bg-slate-50 border-t border-slate-100 px-10 py-5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 shrink-0">
        <div className="flex items-center gap-10">
          <span>Active Registry: {allProducts.length} SKU</span>
        </div>
        <div className="flex items-center gap-4">
          {isFetchingNextPage && (
            <div className="flex items-center gap-3 animate-pulse text-indigo-600">
              <Loader2 size={12} className="animate-spin" strokeWidth={3} />
              <span>Streaming Data...</span>
            </div>
          )}
          <span>v1.0.0 JN-ENTERPRISE</span>
        </div>
      </footer>
    </div>
  );
};

export default ProductCatalog;
