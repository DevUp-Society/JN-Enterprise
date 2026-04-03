import { motion, AnimatePresence } from 'framer-motion';
import { RetailerPortalHeader } from '../../components/navigation/RetailerPortalHeader';
import { ProductCard } from '../../components/premium/ProductCard';
import { Logo } from '../../components/premium/Logo';
import { 
  ArrowRight, Loader2, Shirt, Layers, Home, Hammer, ShieldAlert, 
  Truck, Cpu, Wrench, Archive, 
  FlaskConical, MapPin, Phone, Share2, Globe, Send, Link2 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useState, useEffect } from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
};

const slides = [
  {
    title: "Industrial Scale Solutions.",
    subtitle: "Precision-engineered global procurement infrastructure.",
    tag: "Market Authority",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000"
  },
  {
    title: "Global Supply Chain.",
    subtitle: "Linking manufacturers to high-volume retail sectors.",
    tag: "Fulfillment Hub",
    image: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=2000"
  }
];

export default function RetailerHome() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const globalCategories = [
    { name: "Apparel", icon: <Shirt size={24} />, path: 'Shirts' },
    { name: "Hardware", icon: <Hammer size={24} />, path: 'Outerwear' },
    { name: "Textiles", icon: <Layers size={21} />, path: 'Shirts' },
    { name: "Tools", icon: <Wrench size={24} />, path: 'Accessories' },
    { name: "Tech", icon: <Cpu size={24} />, path: 'Shoes' },
    { name: "Safety", icon: <ShieldAlert size={24} />, path: 'Outerwear' },
    { name: "Logistics", icon: <Truck size={24} />, path: 'Shirts' },
    { name: "Home Care", icon: <Home size={24} />, path: 'Accessories' },
    { name: "Storage", icon: <Archive size={24} />, path: 'Shoes' },
    { name: "Chemicals", icon: <FlaskConical size={24} />, path: 'Outerwear' },
  ];

  const fetchCategoryData = async () => {
     setLoading(true);
     try {
        const categoriesToFetch = ['Shirts', 'Accessories', 'Outerwear', 'Shoes', 'Suits'];
        const promises = categoriesToFetch.map(cat => 
           axiosInstance.get('/products', { params: { category: cat, limit: 3 } })
        );
        const results = await Promise.all(promises);
        const productsMap: Record<string, any[]> = {};
        results.forEach((res, i) => {
           productsMap[categoriesToFetch[i]] = res.data.products;
        });
        setFeaturedProducts(productsMap);
     } catch (error) {
        console.error('Error fetching categories:', error);
     } finally {
        setLoading(false);
     }
  };

  useEffect(() => {
    fetchCategoryData();
    const timer = setInterval(() => setCurrentSlide(s => (s + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-dark text-white font-sans selection:bg-primary/20 pb-40">
      <RetailerPortalHeader />
      
      <main className="space-y-40">
        {/* 1. Hero Slideshow - Minimal Industrial Overlay */}
        <section className="relative h-[550px] w-full overflow-hidden">
           <AnimatePresence mode="wait">
              <motion.div 
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
              >
                 <img 
                   src={slides[currentSlide].image} 
                   alt="Slide"
                   className="w-full h-full object-cover grayscale-[0.1]"
                 />
                 <div className="absolute inset-0 bg-dark/40 bg-gradient-to-t from-dark via-transparent to-black/20" />
              </motion.div>
           </AnimatePresence>

           <div className="absolute inset-0 flex flex-col justify-center px-12 sm:px-24">
              <div className="max-w-2xl space-y-6">
                 <motion.div 
                    key={`tag-${currentSlide}`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="inline-block bg-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white"
                 >
                    {slides[currentSlide].tag}
                 </motion.div>
                 <motion.h1 
                    key={`title-${currentSlide}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-7xl font-black tracking-tighter uppercase font-serif leading-[0.9]"
                 >
                    {slides[currentSlide].title}
                 </motion.h1>
              </div>
           </div>
           
           <div className="absolute bottom-12 left-24 flex gap-3">
              {slides.map((_, i) => (
                 <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-12 bg-primary' : 'w-4 bg-white/20'}`} />
              ))}
           </div>
        </section>

        <div className="max-w-[1750px] mx-auto px-12 space-y-40">
           {/* 2. Global Category Explorer Header */}
           <section className="space-y-12">
              <div className="flex justify-between items-end border-b border-white/5 pb-8">
                 <div>
                    <h2 className="text-4xl font-black tracking-tighter uppercase font-serif underline decoration-primary decoration-4 underline-offset-8">Explore Our Sectors</h2>
                    <p className="text-slate-muted text-[12px] font-bold tracking-widest uppercase mt-4">Authorized Registry Access</p>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                 {globalCategories.map((cat, i) => (
                    <motion.div 
                      key={cat.name}
                      {...fadeInUp}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -10 }}
                      onClick={() => navigate(`/shop?category=${cat.path}`)}
                      className="bg-dark-surface border border-white/5 rounded-[32px] p-8 flex flex-col items-center gap-6 cursor-pointer group shadow-2xl"
                    >
                       <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          {cat.icon}
                       </div>
                       <span className="text-[13px] font-black tracking-widest uppercase opacity-70 group-hover:opacity-100">{cat.name}</span>
                    </motion.div>
                 ))}
              </div>
           </section>

           {/* 3. Integrated Inventory Sector Rows */}
           <div className="space-y-48">
              {loading ? (
                 <div className="flex justify-center py-24"><Loader2 className="animate-spin text-primary" size={48} /></div>
              ) : (
                 Object.entries(featuredProducts).map(([category, products]) => (
                    <section key={category} className="space-y-12">
                       <div className="flex justify-between items-end border-b border-white/5 pb-8">
                          <h2 className="text-3xl font-black tracking-tighter uppercase font-serif">{category} Inventory</h2>
                          <Link to={`/shop?category=${category}`} className="text-primary font-black text-[12px] tracking-widest uppercase flex items-center gap-2 group hover:gap-4 transition-all">
                             View Full Registry <ArrowRight size={16} />
                          </Link>
                       </div>

                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                          {products.map((p) => (
                             <ProductCard key={p.id} product={p} />
                          ))}
                          
                          {/* Dedicated View All Card for Category */}
                          <Link 
                            to={`/shop?category=${category}`}
                            className="bg-primary/5 border-2 border-dashed border-primary/20 rounded-[28px] flex flex-col items-center justify-center gap-6 group hover:bg-primary transition-all p-12"
                          >
                             <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all shadow-xl">
                                <ArrowRight size={28} />
                             </div>
                             <div className="text-center">
                                <span className="block text-[14px] font-black uppercase tracking-widest text-primary group-hover:text-white">View Full</span>
                                <span className="block text-[10px] font-bold text-primary/40 uppercase group-hover:text-white/40 tracking-widest-xl whitespace-nowrap mt-1">{category} Archive</span>
                             </div>
                          </Link>
                       </div>
                    </section>
                 ))
              )}
           </div>
        </div>
      </main>

      {/* 4. Cohesive Industrial Footer */}
      <footer className="bg-dark-surface border-t border-white/5 pt-32 pb-16 rounded-t-[80px]">
         <div className="max-w-[1750px] mx-auto px-12 grid grid-cols-1 md:grid-cols-4 gap-20">
            <div className="space-y-10">
               <Logo />
               <p className="text-slate-muted text-[13px] font-medium leading-relaxed max-w-xs">
                  Enterprise-scale procurement infrastructure. ISO 9001 Audited Operations.
               </p>
               <div className="flex gap-4">
                  {[Share2, Globe, Send, Link2].map((Icon, i) => (
                     <div key={i} className="w-11 h-11 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer">
                        <Icon size={18} />
                     </div>
                  ))}
               </div>
            </div>

            <div className="space-y-10">
               <h4 className="text-[14px] font-black uppercase tracking-widest text-white">Logistics</h4>
               <ul className="space-y-5 text-[12px] font-bold text-slate-muted uppercase tracking-widest">
                  <li className="hover:text-primary transition-colors cursor-pointer">Cargo Tracking</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Manufacturer Audit</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Bulk Supply Chain</li>
               </ul>
            </div>

            <div className="space-y-10">
               <h4 className="text-[14px] font-black uppercase tracking-widest text-white">Resources</h4>
               <ul className="space-y-5 text-[12px] font-bold text-slate-muted uppercase tracking-widest">
                  <li className="hover:text-primary transition-colors cursor-pointer">Procurement API</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Security Protocol</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Compliance Register</li>
               </ul>
            </div>

            <div className="space-y-10">
               <h4 className="text-[14px] font-black uppercase tracking-widest text-white">Contact Hub</h4>
               <ul className="space-y-7 text-[12px] font-medium text-slate-muted">
                  <li className="flex gap-5 items-start">
                     <MapPin size={22} className="text-primary mt-1 shrink-0" />
                     <span>Sector-9 Warehouse District,<br />Terminal 4, Global Gate</span>
                  </li>
                  <li className="flex gap-5 items-center">
                     <Phone size={22} className="text-primary shrink-0" />
                     <span className="text-lg font-black tracking-tighter uppercase whitespace-nowrap">+1 800 JN ENTERPRISE</span>
                  </li>
               </ul>
            </div>
         </div>
         <div className="mt-32 pt-12 border-t border-white/5 text-center text-[11px] font-black text-white/10 uppercase tracking-[0.4em]">
            Authorized Wholesale Gateway © 2024 JN Enterprise
         </div>
      </footer>
    </div>
  );
}
