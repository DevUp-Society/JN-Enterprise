import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RetailerPortalHeader } from '../../components/navigation/RetailerPortalHeader';
import { ProductCard } from '../../components/premium/ProductCard';
import { QuickOrderMatrix } from '../../components/premium/QuickOrderMatrix';
import { Star, ShieldCheck, Truck, Package, ChevronRight } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('specifications');

  // Unified mock product (in real app, fetch by id)
  const product = {
    id: parseInt(id || "1"),
    name: "ARCHITECTURAL OVERCOAT",
    price: 840,
    category: "APPAREL",
    sku: "JN-APPA-001-B",
    image: "https://images.unsplash.com/photo-1591047139829-d91aec16adcd?auto=format&fit=crop&q=80&w=1200",
    description: "Industrial-grade textile engineering applied to modern silhouettes. The Architectural Overcoat features high-density weave patterns and reinforced structural seams for durability in wholesale environments.",
    specs: {
       material: "80% Wool, 20% Technical Poly",
       weight: "850 GSM",
       origin: "Shenzhen Hub",
       treatment: "DWR Water Repellent"
    },
    reviews: [
       { id: 1, user: "GlobalRetail_A", rating: 5, comment: "Exceptional build quality. The sizing matrix is accurate.", date: "2024-03-12" },
       { id: 2, user: "TextileHub_NY", rating: 4, comment: "Batch consistency is impressive. Shipping was prompt.", date: "2024-03-05" }
    ]
  };

  const similarProducts = [
    { id: 101, name: "UTILITY PARKA", price: 620, category: "APPAREL", image: "https://images.unsplash.com/photo-1544022613-e87ca7da9da1?auto=format&fit=crop&q=80&w=400" },
    { id: 102, name: "GRID TEXTURE VEST", price: 410, category: "APPAREL", image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=400" },
    { id: 103, name: "THERMAL LINER", price: 215, category: "APPAREL", image: "https://images.unsplash.com/photo-1544923246-77307dd654ca?auto=format&fit=crop&q=80&w=400" },
    { id: 104, name: "MODULAR HOODIE", price: 180, category: "APPAREL", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400" },
  ];

  return (
    <div className="min-h-screen bg-bone text-slate font-sans selection:bg-gold selection:text-white pb-48">
      <RetailerPortalHeader />
      
      <main className="max-w-[1700px] mx-auto px-12 pt-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate/30 mb-8">
           <Link to="/home" className="hover:text-slate transition-colors">PORTAL</Link>
           <ChevronRight size={10} />
           <Link to={`/shop?category=${product.category}`} className="hover:text-slate transition-colors">{product.category}</Link>
           <ChevronRight size={10} />
           <span className="text-gold">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-24">
           {/* Product Visuals */}
           <div className="space-y-6">
              <div className="aspect-[4/5] bg-white border border-black/5 overflow-hidden">
                 <img 
                   src={product.image} 
                   className="w-full h-full object-cover grayscale-[0.2]" 
                   alt={product.name} 
                 />
              </div>
              <div className="grid grid-cols-4 gap-4">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-square bg-white border border-black/5 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                        <img src={product.image} className="w-full h-full object-cover" />
                    </div>
                 ))}
              </div>
           </div>

           {/* Product Procurement Info */}
           <div className="space-y-12">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-gold/10 text-gold text-[8px] font-black uppercase tracking-widest">Verified OEM Archive</span>
                    <span className="text-[10px] font-bold text-slate/30 uppercase tracking-widest">SKU: {product.sku}</span>
                 </div>
                 <h1 className="text-5xl font-black text-slate tracking-tighter uppercase leading-none">{product.name}</h1>
                 <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-1 text-gold">
                       {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-gold" />)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate/40 underline cursor-pointer">Read 24 Procurement Reviews</span>
                 </div>
              </div>

              <p className="text-sm font-medium text-slate/60 leading-relaxed max-w-xl uppercase italic">
                 "{product.description}"
              </p>

              {/* High Volume Ordering Matrix */}
              <div className="space-y-6 bg-white border border-black/5 p-10 shadow-sm">
                 <div className="flex justify-between items-center pb-6 border-b border-black/5">
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                       <Package size={16} className="text-gold" />
                       Procurement Matrix
                    </h3>
                    <div className="flex items-center gap-2 text-green-600">
                       <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Ready for Shipment</span>
                    </div>
                 </div>
                 <QuickOrderMatrix />
              </div>

              {/* Service Cards */}
              <div className="grid grid-cols-2 gap-6">
                 <div className="p-8 border border-black/5 bg-white space-y-3">
                    <Truck size={18} className="text-gold" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate">Global Freight</h4>
                    <p className="text-[9px] font-bold text-slate/30 uppercase tracking-widest leading-loose">Expedited container logistics available for this archive.</p>
                 </div>
                 <div className="p-8 border border-black/5 bg-white space-y-3">
                    <ShieldCheck size={18} className="text-gold" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate">Quality Node</h4>
                    <p className="text-[9px] font-bold text-slate/30 uppercase tracking-widest leading-loose">100% inspection guaranteed at Shenzhen collection hub.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Extended Details Tabs */}
        <section className="mt-32 border-t border-black/5 pt-16">
           <div className="flex gap-16 mb-12">
              {['specifications', 'reviews', 'shipping'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[11px] font-black uppercase tracking-widest pb-4 border-b-2 transition-all ${activeTab === tab ? 'border-gold text-slate' : 'border-transparent text-slate/20 hover:text-slate/40'}`}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
           </div>

           <div className="max-w-4xl min-h-[300px]">
              <AnimatePresence mode="wait">
                 {activeTab === 'specifications' && (
                   <motion.div 
                     key="specs"
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 10 }}
                     className="grid grid-cols-2 gap-y-8 gap-x-16"
                   >
                      {Object.entries(product.specs).map(([key, val]) => (
                        <div key={key} className="space-y-1">
                           <h5 className="text-[9px] font-bold text-slate/30 uppercase tracking-widest">{key}</h5>
                           <p className="text-[11px] font-black text-slate uppercase">{val}</p>
                        </div>
                      ))}
                   </motion.div>
                 )}

                 {activeTab === 'reviews' && (
                   <motion.div 
                     key="reviews"
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 10 }}
                     className="space-y-12"
                   >
                      {product.reviews.map(review => (
                        <div key={review.id} className="space-y-4 max-w-2xl">
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate">{review.user}</span>
                              <span className="text-[9px] font-bold text-slate/30 uppercase tracking-widest">{review.date}</span>
                           </div>
                           <div className="flex gap-1">
                              {[1,2,3,4,5].map(i => (
                                <Star key={i} size={10} className={i <= review.rating ? 'fill-gold text-gold' : 'text-slate/10'} />
                              ))}
                           </div>
                           <p className="text-[11px] font-medium text-slate/60 uppercase leading-relaxed italic">"{review.comment}"</p>
                        </div>
                      ))}
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </section>

        {/* Similar Products */}
        <section className="mt-48 space-y-12">
           <div className="flex justify-between items-end border-b border-black/5 pb-4">
              <h2 className="text-2xl font-black text-slate tracking-tighter uppercase leading-none">Similar Procurement Archives</h2>
              <Link to="/shop" className="text-[9px] font-black text-slate/30 hover:text-gold uppercase tracking-widest transition-all">SEE ALL</Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarProducts.map(p => (
                <div key={p.id} onClick={() => window.scrollTo(0, 0)} className="cursor-pointer">
                   <ProductCard product={p} />
                </div>
              ))}
           </div>
        </section>
      </main>
    </div>
  );
}
