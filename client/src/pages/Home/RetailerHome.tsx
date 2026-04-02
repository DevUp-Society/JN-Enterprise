import { motion } from 'framer-motion';
import { RetailerPortalHeader } from '../../components/navigation/RetailerPortalHeader';
import { ProductCard } from '../../components/premium/ProductCard';
import { Logo } from '../../components/premium/Logo';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
};

export default function RetailerHome() {
  const navigate = useNavigate();

  const categories = [
    { name: "APPAREL", count: "450+", image: "https://images.unsplash.com/photo-1591047139829-d91aec16adcd?auto=format&fit=crop&q=80&w=400" },
    { name: "TEXTILES", count: "320+", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=400" },
    { name: "HOME CARE", count: "120+", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400" },
    { name: "HARDWARE", count: "280+", image: "https://images.unsplash.com/photo-1518481612222-68bbe828ec1e?auto=format&fit=crop&q=80&w=400" },
    { name: "PLASTICS", count: "150+", image: "https://images.unsplash.com/photo-1595461135849-bf08893fdc2c?auto=format&fit=crop&q=80&w=400" },
    { name: "KITCHEN", count: "210+", image: "https://images.unsplash.com/photo-1584990344321-27682ad0f140?auto=format&fit=crop&q=80&w=400" },
    { name: "TOOLING", count: "95+", image: "https://images.unsplash.com/photo-1530124560676-41bc3c02d1d5?auto=format&fit=crop&q=80&w=400" },
    { name: "OFFICE", count: "110+", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400" },
    { name: "DECOR", count: "300+", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=400" },
    { name: "TOYS", count: "400+", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=400" },
  ];

  const products = [
    { id: 1, name: "ARCHITECTURAL OVERCOAT", price: 840, category: "APPAREL", image: "https://images.unsplash.com/photo-1591047139829-d91aec16adcd?auto=format&fit=crop&q=80&w=800" },
    { id: 2, name: "SLATE WOVEN TEXTILE", price: 45, category: "TEXTILES", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800" },
    { id: 3, name: "BONE CERAMIC VASE", price: 120, category: "DECOR", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800" },
    { id: 4, name: "STAINLESS COOKWARE", price: 299, category: "KITCHEN", image: "https://images.unsplash.com/photo-1584990344321-27682ad0f140?auto=format&fit=crop&q=80&w=800" },
    { id: 5, name: "LINEN PLY TEXTURE", price: 38, category: "TEXTILES", image: "https://images.unsplash.com/photo-1524383190304-a76f034fd478?auto=format&fit=crop&q=80&w=800" },
    { id: 6, name: "BRASS NODE HARDWARE", price: 15, category: "HARDWARE", image: "https://images.unsplash.com/photo-1518481612222-68bbe828ec1e?auto=format&fit=crop&q=80&w=800" },
  ];

  return (
    <div className="min-h-screen bg-bone text-slate font-sans selection:bg-gold selection:text-white pb-32">
      <RetailerPortalHeader />
      
      <main>
        {/* Categories Grid - High Density, Image-Led */}
        <section className="px-12 py-8 bg-white border-b border-black/5">
           <div className="max-w-[1700px] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2">
              {categories.map((cat) => (
                <Link 
                  key={cat.name}
                  to={`/shop?category=${cat.name}`}
                  className="group flex flex-col items-center gap-2"
                >
                   <div className="w-full aspect-square overflow-hidden bg-bone border border-black/5 group-hover:border-gold transition-all duration-500">
                      <img 
                        src={cat.image} 
                        alt={cat.name}
                        className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                   </div>
                   <div className="text-center">
                      <h3 className="text-[8px] font-black tracking-widest uppercase text-slate/40 group-hover:text-slate transition-colors">{cat.name}</h3>
                      <p className="text-[6px] font-bold opacity-20 uppercase tracking-tighter">{cat.count} ARCHIVES</p>
                   </div>
                </Link>
              ))}
           </div>
        </section>

        {/* Home Sections - Category Streams */}
        <div className="max-w-[1700px] mx-auto px-12 mt-12 space-y-16">
           {categories.slice(0, 3).map((cat) => (
             <motion.section 
               key={cat.name}
               {...fadeInUp}
               className="space-y-6"
             >
                <div className="flex justify-between items-end border-b border-black/5 pb-2">
                   <h2 className="text-xl font-black text-slate tracking-tighter uppercase leading-none">{cat.name}</h2>
                   <Link to={`/shop?category=${cat.name}`} className="text-[8px] font-black text-slate/30 hover:text-gold uppercase tracking-widest-xl transition-all flex items-center gap-2 group">
                      EXPLORE ALL
                      <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                   </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                   {products.map((p) => (
                     <div key={`${cat.name}-${p.id}`} onClick={() => navigate(`/product/${p.id}`)} className="cursor-pointer">
                        <ProductCard product={{...p, category: cat.name}} />
                     </div>
                   ))}
                   
                   {/* "View More" Card */}
                   <Link 
                     to={`/shop?category=${cat.name}`}
                     className="aspect-[4/5] bg-slate/5 border border-dashed border-slate/20 flex flex-col items-center justify-center gap-3 group hover:border-gold hover:bg-white transition-all"
                   >
                      <div className="w-8 h-8 rounded-none border border-slate/10 flex items-center justify-center text-slate group-hover:text-gold group-hover:border-gold transition-colors">
                         <ArrowRight size={16} />
                      </div>
                      <span className="text-[8px] font-black tracking-widest uppercase text-slate/30 group-hover:text-gold">VIEW ALL</span>
                   </Link>
                </div>
             </motion.section>
           ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-48 px-12 py-16 bg-white border-t border-black/5">
         <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-4 max-w-xs">
               <Logo />
               <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest-xl">WHOLESALE PROCUREMENT INFRASTRUCTURE</p>
            </div>
            <div className="flex gap-24">
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-slate tracking-widest">Portal</h4>
                  <ul className="space-y-2 text-[9px] font-bold text-slate/40 uppercase tracking-wide">
                     <li><Link to="/home" className="hover:text-gold transition-colors">Home Archive</Link></li>
                     <li><Link to="/shop" className="hover:text-gold transition-colors">Bulk Procurement</Link></li>
                     <li><Link to="/wishlist" className="hover:text-gold transition-colors">Waiting List</Link></li>
                  </ul>
               </div>
            </div>
         </div>
         <div className="max-w-[1700px] mx-auto mt-16 pt-6 border-t border-slate/5 text-[8px] font-black uppercase tracking-widest-xl text-slate/20 flex justify-between">
            <span>© 2024 JN Enterprise. Secured Wholesale Gateway.</span>
            <span>TLS 1.3 ENCRYPTION ACTIVE</span>
         </div>
      </footer>
    </div>
  );
}
