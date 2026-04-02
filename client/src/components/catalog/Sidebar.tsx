import React from 'react';
import { Filter, SlidersHorizontal, Package } from 'lucide-react';

interface SidebarProps {
  category: string;
  setCategory: (cat: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const CATEGORIES = ['All', 'Outerwear', 'Suits', 'Shirts', 'Accessories', 'Shoes'];

const Sidebar: React.FC<SidebarProps> = ({ category, setCategory, priceRange, setPriceRange }) => {
  return (
    <aside className="w-80 h-full border-r border-slate-200 bg-white p-8 flex flex-col gap-10 sticky top-0 overflow-y-auto">
      <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-6">
        <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white">
          <SlidersHorizontal size={18} />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight">Refine Catalog</h2>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-400">
           <Package size={14} className="opacity-50" />
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Categories</h3>
        </div>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all border ${
                category === cat 
                  ? 'bg-slate-900 text-white border-slate-950 shadow-lg shadow-slate-200 scale-[1.02]' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-400">
           <Filter size={14} className="opacity-50" />
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Price Registry</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <span className="text-[9px] font-black text-slate-300 uppercase">Min Order</span>
                <input 
                  type="number" 
                  value={priceRange[0]} 
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 transition-colors"
                />
             </div>
             <div className="space-y-2">
                <span className="text-[9px] font-black text-slate-300 uppercase">Max Order</span>
                <input 
                  type="number" 
                  value={priceRange[1]} 
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 transition-colors"
                />
             </div>
          </div>
          <p className="text-[10px] text-slate-400 italic">Filter by item wholesale price in USD.</p>
        </div>
      </section>

      <div className="mt-auto bg-slate-50 p-6 rounded-3xl border border-slate-100">
         <h4 className="text-xs font-black text-slate-900 mb-2">Bulk Discount Active</h4>
         <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Orders exceeding $5,000 qualify for free express shipping to global hubs.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
