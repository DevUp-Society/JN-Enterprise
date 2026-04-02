import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { RetailerPortalHeader } from '../../components/navigation/RetailerPortalHeader';
import { ProductCard } from '../../components/premium/ProductCard';
import { ProductDetailModal } from '../../components/premium/ProductDetailModal';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

export default function ShopPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category');

  const [selectedCategory, setSelectedCategory] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const categories = ["HOME & DECOR", "APPAREL & TEXTILES", "HARDWARE & TOOLS", "HOUSEHOLD UTENSILS", "PLASTIC GOODS", "TOYS & GIFTS", "KITCHENWARE", "OFFICE SUPPLIES"];

  const products = [
    { id: 1, name: "ARCHITECTURAL OVERCOAT", price: 840, category: "APPAREL & TEXTILES", sku: "JN-APPA-001", description: "Premium wool blend, water-resistant finish, professional cut.", image: "https://images.unsplash.com/photo-1591047139829-d91aec16adcd?auto=format&fit=crop&q=80&w=800" },
    { id: 2, name: "SLATE WOVEN TEXTILE", price: 45, category: "APPAREL & TEXTILES", sku: "JN-TEXT-012", description: "Sustainable cotton, high-density weave, 500TC equivalent.", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800" },
    { id: 3, name: "BONE CERAMIC VASE", price: 120, category: "HOME & DECOR", sku: "JN-HOME-044", description: "Minimalist ceramic, matte bone finish.", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800" },
    { id: 6, name: "BRASS NODE HARDWARE", price: 15, category: "HARDWARE & TOOLS", sku: "JN-HARD-005", description: "Solid brass finish, industrial grade.", image: "https://images.unsplash.com/photo-1518481612222-68bbe828ec1e?auto=format&fit=crop&q=80&w=800" },
  ];

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory([initialCategory]);
    }
  }, [initialCategory]);

  const toggleCategory = (cat: string) => {
    setSelectedCategory(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const filteredProducts = selectedCategory.length > 0 
    ? products.filter(p => selectedCategory.includes(p.category))
    : products;

  return (
    <div className="min-h-screen bg-bone text-slate font-sans selection:bg-gold selection:text-white pb-32">
      <RetailerPortalHeader />
      
      <main className="max-w-[1600px] mx-auto px-12 flex gap-16 py-16">
        {/* Sidebar Filters */}
        <aside className="w-72 hidden lg:block space-y-12 h-fit sticky top-32">
          <div className="flex items-center gap-4 text-gold mb-8">
             <SlidersHorizontal size={18} />
             <h4 className="text-xs font-black uppercase tracking-widest-xl">Procurement Filters</h4>
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <h5 className="text-[10px] font-black uppercase tracking-widest-xl text-slate/40 border-b border-slate/5 pb-4">Categories</h5>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-4 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedCategory.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-4 h-4 rounded-none border-slate/20 text-gold focus:ring-0 cursor-pointer"
                    />
                    <span className={`text-[10px] font-bold uppercase transition-colors ${selectedCategory.includes(cat) ? 'text-slate' : 'text-slate/40 group-hover:text-slate/60'}`}>
                       {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-6">
               <h5 className="text-[10px] font-black uppercase tracking-widest-xl text-slate/40 border-b border-slate/5 pb-4">Availability</h5>
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate/60">In Stock only</span>
                  <button className="w-10 h-5 bg-slate/10 rounded-full relative p-1 group transition-all">
                     <div className="w-3 h-3 bg-white rounded-full transition-transform" />
                  </button>
               </div>
            </div>

            <div className="space-y-6">
               <h5 className="text-[10px] font-black uppercase tracking-widest-xl text-slate/40 border-b border-slate/5 pb-4">Price Range</h5>
               <div className="space-y-4">
                  <input type="range" className="w-full accent-gold bg-slate/10 h-[2px]" />
                  <div className="flex justify-between text-[8px] font-black uppercase text-slate/30">
                     <span>$0</span>
                     <span>$5000+</span>
                  </div>
               </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 space-y-12">
          <header className="flex justify-between items-end border-b border-black/5 pb-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate tracking-tighter uppercase leading-none">Shop All Supplies</h1>
              <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest-xl">Showing {filteredProducts.length} Results</p>
            </div>
            
            <button className="flex items-center gap-3 px-6 h-10 border border-slate/10 text-[9px] font-black uppercase hover:bg-slate hover:text-white transition-all tracking-widest">
               Sort by Relevance <ChevronDown size={14} />
            </button>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-16">
            {filteredProducts.map((p) => (
              <div key={p.id} onClick={() => setSelectedProduct(p)} className="cursor-pointer">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
