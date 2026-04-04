import React from 'react';
import { Filter, SlidersHorizontal, Package, Database, Zap } from 'lucide-react';

interface SidebarProps {
  category: string;
  setCategory: (cat: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const CATEGORIES = ['All', 'Outerwear', 'Suits', 'Shirts', 'Accessories', 'Shoes'];
const TAGS = ['In Stock', 'Limited', 'Enterprise'];

const Sidebar: React.FC<SidebarProps> = ({ category, setCategory, priceRange, setPriceRange }) => {
  return (
    <aside className="w-80 h-full border-r border-[#000000]/10 bg-[#D6D6D6] p-8 flex flex-col gap-6 sticky top-0 overflow-y-auto font-sans selection:bg-[#000000] selection:text-[#D6D6D6]">
      <div className="flex items-center gap-3 text-[#000000] border-b border-[#000000]/5 pb-6">
        <div className="w-10 h-10 bg-[#000000] rounded-xl flex items-center justify-center text-[#D6D6D6]">
          <SlidersHorizontal size={20} />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tighter">filters</h2>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[#000000]/40">
           <Package size={14} />
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Sector Registry</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`w-full text-left px-5 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border ${
                category === cat 
                  ? 'bg-[#000000] text-[#D6D6D6] border-transparent shadow-xl scale-[1.02]' 
                  : 'text-[#000000]/60 hover:text-[#000000] hover:bg-[#000000]/5 border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[#000000]/40">
           <Filter size={14} />
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Volume Price</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-2">
                <span className="text-[9px] font-black text-[#000000]/30 uppercase tracking-widest">Min</span>
                <input 
                  type="number" 
                  value={priceRange[0]} 
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  className="w-full bg-white border border-[#000000]/5 rounded-xl px-4 py-3 text-xs font-black text-[#000000] outline-none focus:border-[#000000] transition-colors shadow-inner"
                />
             </div>
             <div className="space-y-2">
                <span className="text-[9px] font-black text-[#000000]/30 uppercase tracking-widest">Max</span>
                <input 
                  type="number" 
                  value={priceRange[1]} 
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                  className="w-full bg-white border border-[#000000]/5 rounded-xl px-4 py-3 text-xs font-black text-[#000000] outline-none focus:border-[#000000] transition-colors shadow-inner"
                />
             </div>
          </div>
          <div className="h-2 w-full bg-[#000000]/5 rounded-full relative">
             <div className="absolute top-0 left-0 h-full bg-[#000000] rounded-full w-3/4" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[#000000]/40">
           <Database size={14} />
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Availability</h3>
        </div>
        <div className="space-y-2">
          {TAGS.map((tag) => (
             <div key={tag} className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 rounded-md border-2 border-[#000000]/20 flex items-center justify-center group-hover:border-[#000000] transition-colors">
                   <div className="w-2.5 h-2.5 bg-[#000000] rounded-[2px]" />
                </div>
                <span className="text-[11px] font-black text-[#000000]/60 group-hover:text-[#000000] transition-colors uppercase tracking-widest">{tag}</span>
             </div>
          ))}
        </div>
      </section>

      <div className="mt-auto bg-[#000000] p-8 rounded-[32px] shadow-2xl relative overflow-hidden group border border-white/5">
         <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[40px] group-hover:scale-150 transition-transform duration-700" />
         <div className="relative z-10 space-y-4">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white"><Zap size={16} /></div>
            <h4 className="text-[12px] font-black text-white uppercase tracking-widest">Enterprise Access</h4>
            <p className="text-[10px] text-white/50 leading-relaxed font-medium">Orders exceeding ₹100,000 qualify for priority cargo logistics.</p>
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;










