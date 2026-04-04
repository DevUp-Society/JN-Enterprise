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
    chunkedProducts: any[][];
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
  };
}

const Row = ({ index, style, data }: RowProps) => {
  const { chunkedProducts, hasNextPage, isFetchingNextPage, fetchNextPage } = data;
  const productChunk = chunkedProducts[index];

  if (!productChunk || productChunk.length === 0) return null;

  if (index === chunkedProducts.length - 2 && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  return (
    <div style={style} className="px-2 md:px-6 py-4">
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 md:gap-4 lg:gap-0 lg:flex lg:flex-row h-full">
        {productChunk.map(product => (
          <div key={product.id} className="flex flex-col lg:flex-row gap-6 p-6 bg-white border border-black/[0.03] hover:border-black/10 transition-all duration-700 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] h-full lg:h-[300px] overflow-visible lg:overflow-hidden group active:scale-[0.99] rounded-[12px] cursor-pointer relative">
            {/* Visual Accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-black/5 group-hover:bg-black transition-colors duration-700" />

            <div className="w-full lg:w-56 aspect-square lg:h-full bg-[#F7F7F7] flex-shrink-0 self-center rounded-[8px] border border-black/[0.01] group-hover:scale-105 transition-transform duration-1000 relative overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="flex-grow flex flex-col justify-between py-4 pr-4">
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black text-black/40 bg-black/5 px-3 py-1 uppercase tracking-widest rounded-full">
                        {product.category || 'REGISTRY'}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-600 tracking-widest uppercase italic">LIVE_STOCK</span>
                    </div>
                    <h3 className="text-2xl font-black text-black line-clamp-2 group-hover:text-black transition-colors uppercase tracking-tighter leading-none">{product.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-black/20 uppercase tracking-widest mb-1">UNIT_SPEC</p>
                    <p className="text-3xl font-black text-black tracking-tighter italic">
                      ₹{product.price ? product.price.toLocaleString() : '0.00'}
                    </p>
                  </div>
                </div>
                <p className="text-black/40 text-[11px] line-clamp-2 leading-relaxed font-medium hidden lg:block uppercase tracking-wider">Industrial-grade specification for bulk distribution and enterprise procurement clusters.</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-[10px] font-black border-t border-black/[0.03] pt-6 mt-auto">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${product.stock > 100 ? 'bg-emerald-500 animate-pulse' : 'bg-black'}`} />
                  <span className="text-black/60 uppercase tracking-widest">
                    AVAILABILITY: {product.stock > 0 ? `${product.stock} UNITS` : "RESTOCK_PENDING"}
                  </span>
                </div>
                <span className="text-black/20 uppercase tracking-tighter">SKU_REF: {product.id.slice(0, 8).toUpperCase()}</span>
              </div>
            </div>

            <div className="w-full lg:w-[350px] border-t lg:border-t-0 lg:border-l border-black/[0.03] lg:pl-10 mt-4 lg:mt-0 pt-4 lg:pt-2 flex flex-col justify-center transition-colors">
              <ProductMatrix 
                product={product} 
                onAddToCart={() => console.log(`[CATALOG] Order Success: ${product.name} manifested.`)} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const chunkedProducts = useMemo(() => {
    if (windowWidth >= 1024) return allProducts.map(p => [p]);
    const chunks = [];
    for (let i = 0; i < allProducts.length; i += 2) {
      chunks.push(allProducts.slice(i, i + 2));
    }
    return chunks;
  }, [allProducts, windowWidth]);

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
    <div className="flex flex-col h-screen bg-[#D6D6D6] font-sans selection:bg-[#000000] selection:text-[#D6D6D6] overflow-hidden">
       <div className="bg-[#000000] text-white/50 text-[9px] font-black uppercase tracking-[0.3em] py-2 px-8 flex justify-between items-center shrink-0">
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
            <div className="w-14 h-14 bg-[#000000] rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-slate-400 transition-transform hover:scale-105 active:scale-95 duration-500">
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
            <button className="bg-[#000000] text-white rounded-[1.25rem] px-8 py-5 font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-400 hover:bg-[#111111] transition-all active:scale-95 flex items-center gap-4">
              Begin Export
              <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                 <ShoppingCart size={12} strokeWidth={3} />
              </div>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden min-h-0">
        <div className="hidden lg:block shrink-0">
          <Sidebar 
            category={category} 
            setCategory={setCategory} 
            priceRange={priceRange} 
            setPriceRange={setPriceRange} 
          />
        </div>

        <main className="flex-grow bg-white overflow-hidden relative h-full">
          {isError ? (
            <div className="flex h-full items-center justify-center p-12">
              <div className="max-w-md w-full bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 text-center">
                 <AlertCircle size={48} className="text-slate-300 mx-auto mb-6" />
                 <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Sync Failed</h2>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">Gateway connection refused. Retrying...</p>
                 <button onClick={() => window.location.reload()} className="w-full bg-[#000000] text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest">Retry manually</button>
              </div>
            </div>
          ) : allProducts.length === 0 && !isLoading ? (
            <div className="flex h-full items-center justify-center p-12">
               <div className="text-center">
                  <h2 className="text-4xl font-black text-slate-200 uppercase mb-4">No Inventory</h2>
               </div>
            </div>
          ) : (
            <AutoSizer renderProp={({ height, width }: any) => {
                const itemSize = windowWidth < 1024 ? 500 : 340;
                return (
                  <FixedSizeList
                    height={height || 800}
                    itemCount={chunkedProducts.length}
                    itemSize={itemSize}
                    width={width || 1200}
                    className="overflow-y-auto lg:pt-6 pt-2 lg:px-10 px-2 scrollbar-hide pb-24"
                    itemData={{
                      chunkedProducts,
                      hasNextPage,
                      isFetchingNextPage,
                      fetchNextPage
                    }}
                  >
                    {Row}
                  </FixedSizeList>
                )
              }}
            />
          )}

          {/* Sticky FAB for Mobile Filter Drawer */}
          <button 
            onClick={() => setIsMobileDrawerOpen(true)}
            className="lg:hidden absolute bottom-24 right-6 w-14 h-14 bg-black text-white rounded-none shadow-2xl flex items-center justify-center z-40 active:scale-95 transition-transform"
          >
            <Search size={24} />
          </button>
        </main>
      </div>

      {/* Drawer Overlay */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileDrawerOpen(false)} />
          <div className="w-full bg-white max-h-[80vh] overflow-y-auto relative z-[101] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] border-t-[6px] border-black animate-in slide-in-from-bottom flex flex-col pb-[env(safe-area-inset-bottom)]">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center z-[102] shrink-0">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-1.5 bg-slate-200 rounded-full cursor-grab active:cursor-grabbing self-center" onClick={() => setIsMobileDrawerOpen(false)} />
                 <h3 className="font-black text-xl uppercase tracking-widest text-[#000000]">filters</h3>
               </div>
               <button onClick={() => setIsMobileDrawerOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 text-[#000000] font-black">X</button>
            </div>
            <div className="overflow-y-auto p-4 shrink-0">
              <Sidebar 
                category={category} 
                setCategory={setCategory} 
                priceRange={priceRange} 
                setPriceRange={setPriceRange} 
              />
            </div>
          </div>
        </div>
      )}

      <footer className="bg-slate-50 border-t border-slate-100 px-10 py-5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 shrink-0">
        <div className="flex items-center gap-10">
          <span>Active Registry: {allProducts.length} SKU</span>
        </div>
        <div className="flex items-center gap-4">
          {isFetchingNextPage && (
            <div className="flex items-center gap-3 animate-pulse text-black">
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










