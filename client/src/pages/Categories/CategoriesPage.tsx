import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CategoriesPage() {
  const categories = [
    { 
      id: 'electronics', 
      name: 'Industrial Electronics', 
      count: 125,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80"
    },
    { 
      id: 'raw-materials', 
      name: 'Synthetic Raw Materials', 
      count: 450,
      image: "https://images.unsplash.com/photo-1536909526839-8f1ec6398b18?w=500&q=80"
    },
    { 
      id: 'machinery', 
      name: 'High-Precision Machinery', 
      count: 85,
      image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=500&q=80"
    },
    { 
      id: 'logistics', 
      name: 'Logistics Infrastructure', 
      count: 210,
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&q=80"
    }
  ];

  return (
    <div className="bg-[#D6D6D6] min-h-screen selection:bg-[#000000] selection:text-[#D6D6D6]">
       <main className="max-w-[1400px] mx-auto px-8 pt-[140px] pb-32">
          {/* Header */}
          <div className="border-b border-[#000000]/10 pb-12 mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
             <div className="space-y-1">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-[1px] bg-[#000000]/30" />
                   <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#000000]/60">Taxonomy</h2>
                </div>
                <h1 className="text-5xl font-black text-[#000000] tracking-tighter uppercase">Inventory Sectors</h1>
             </div>
             <p className="text-[12px] font-black uppercase text-[#000000]/40 tracking-widest pl-10 border-l border-[#000000]/10">ISO 9001 Audited Segments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <Link to={`/shop?category=${cat.id}`} key={cat.id} className="group relative overflow-hidden bg-white border border-[#000000]/5 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[3/4] relative">
                   <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                   
                   <div className="absolute bottom-0 left-0 right-0 p-10 space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D6D6D6]/60">{cat.count} SKUs Active</p>
                      <h2 className="text-2xl font-black text-[#D6D6D6] uppercase tracking-tighter leading-none">{cat.name}</h2>
                      <div className="pt-4 flex items-center gap-4 text-[#D6D6D6] group-hover:gap-6 transition-all">
                         <span className="text-[11px] font-black uppercase tracking-widest">Entry Catalog</span>
                         <ArrowRight size={18} />
                      </div>
                   </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-32 pt-16 border-t border-[#000000]/10 flex flex-col md:flex-row justify-between items-center gap-12">
             <div className="space-y-4 max-w-lg">
                <h3 className="text-2xl font-black text-[#000000] uppercase tracking-tighter">Request Sector Audit</h3>
                <p className="text-[14px] text-[#000000]/60 font-medium leading-relaxed">If you require classification access to a specific procurement channel currently restricted, please submit an administrative query node.</p>
             </div>
             <button className="h-20 px-16 bg-[#000000] text-[#D6D6D6] text-[12px] font-black uppercase tracking-widest rounded-[32px] hover:bg-[#FFFFFF] hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-4">
                Open Query Console <ArrowRight size={20} />
             </button>
          </div>
       </main>
    </div>
  );
}










