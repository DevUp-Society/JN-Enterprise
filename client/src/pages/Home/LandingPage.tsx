import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  Package,
  Truck,
  ShieldCheck,
  Clock,
  Zap
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ProductCard from '../../components/premium/ProductCard';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
};

interface Category {
  id: string;
  name: string;
  logoUrl?: string;
  orderIndex?: number;
}

export default function LandingPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const heroImages = [
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=1200"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get('/api/products/categories'),
          axios.get('/api/products?limit=10')
        ]);
        const sortedCats = catRes.data.categories
          .filter((c: any) => c.isActive !== false)
          .sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));
        
        setCategories([...sortedCats]);
        setFeaturedProducts(prodRes.data.products);
      } catch (error) {
        console.error('Error fetching landing data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);



  const benefits = [
    { title: "Direct Source", icon: Zap, text: "Eliminate middleman costs with factory-direct procurement." },
    { title: "Global Logistics", icon: Truck, text: "Seamless shipping and customs handling for worldwide retail." },
    { title: "Quality Guaranteed", icon: ShieldCheck, text: "Industry-standard production for high-volume orders." },
    { title: "Easy Replenishment", icon: Clock, text: "Intelligent stock alerts and one-click bulk reordering." }
  ];

  return (
    <div className="bg-white selection:bg-black selection:text-white">
      <main>
        {/* 1. Hero Section - Dark Olive Background */}
        <section className="pt-10 pb-[100px] bg-[#D6D6D6] relative overflow-hidden flex items-center">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-black/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
          
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-10 md:gap-20 items-center relative z-10 w-full">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6 md:space-y-10 mt-8 lg:mt-0 text-center lg:text-left"
            >
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-4xl sm:text-6xl md:text-8xl font-black leading-tight md:leading-none text-black tracking-tighter uppercase">
                  Smarter <span className="text-black/60">Supply</span> Chains.
                </h1>
                <p className="text-sm sm:text-base md:text-lg font-medium text-black/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Access precision-molded plastics, textiles, and industrial hardware 
                  directly from the manufacturer. Built for corporate scale.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-2 md:pt-4 justify-center lg:justify-start">
                <Link to="/login" className="bg-black text-white px-8 md:px-10 py-4 md:py-5 text-sm md:text-base font-black uppercase tracking-widest rounded-3xl hover:bg-[#D6D6D6] hover:text-black border border-transparent transition-all flex items-center gap-3 active:scale-95 shadow-md">
                  Get Started <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>

            <motion.div 
              key={heroIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative aspect-square md:aspect-[4/3] rounded-[40px] overflow-hidden group border border-white/5"
            >
              <img 
                src={heroImages[heroIndex]}
                alt="Industrial Capacity" 
                className="w-full h-full object-cover transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* 2. Categories Section - White Background */}
        <section className="py-8 md:py-12 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 w-full">
            <div 
              ref={categoryScrollRef}
              className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-8 pb-2"
            >
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="aspect-square bg-black/5 animate-pulse rounded-[40px]" />
                ))
              ) : (
                categories.map((cat) => (
                  <Link to="/login" key={cat.id} className="group">
                    <motion.div 
                      className="bg-[#D6D6D6] aspect-square rounded-[40px] flex flex-col items-center justify-center p-8 border border-transparent hover:border-black transition-all duration-500 cursor-pointer overflow-hidden relative group-hover:-translate-y-2"
                    >
                      <div className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center mb-2 md:mb-4 group-hover:scale-110 transition-transform">
                        {cat.logoUrl ? (
                          <img src={cat.logoUrl} className="w-full h-full object-contain" />
                        ) : (
                          <Package size={32} className="text-black flex-shrink-0" />
                        )}
                      </div>
                      <h3 className="text-[9px] md:text-[12px] font-black text-black uppercase tracking-widest text-center px-1 leading-tight">{cat.name}</h3>
                    </motion.div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        {/* 3. Featured Products Section - Light Gray Background */}
        <section className="py-12 md:py-20 bg-[#D6D6D6] rounded-t-[40px] md:rounded-t-[60px] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-black/5 blur-[100px] rounded-full pointer-events-none" />
           <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-8 md:space-y-20 relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
               <h2 className="text-3xl md:text-7xl font-black text-black tracking-tighter uppercase leading-none text-center sm:text-left">Our Top Products</h2>
               <Link 
                 to="/login"
                 className="px-8 md:px-12 py-4 md:py-6 bg-black text-white text-[10px] md:text-[12px] font-black uppercase tracking-widest rounded-full hover:bg-white hover:text-black border border-black/10 transition-all active:scale-95 w-full sm:w-auto text-center"
               >
                  See All
               </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8">
               {loading ? (
                  Array(5).fill(0).map((_, i) => (
                     <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-[32px]" />
                  ))
               ) : (
                  featuredProducts.map((product) => (
                     <ProductCard key={product.id} product={product} />
                  ))
               )}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white relative overflow-hidden">
           <div className="max-w-[1400px] mx-auto px-4 md:px-8 grid grid-cols-2 lg:grid-cols-2 gap-3 md:gap-8 w-full">
              {benefits.map((b, i) => (
                <motion.div 
                  key={i}
                  {...fadeInUp}
                  className="p-5 md:p-12 rounded-[24px] md:rounded-[40px] border border-black/5 space-y-3 md:space-y-5 group hover:-translate-y-2 transition-all duration-500 bg-[#D6D6D6]/30 backdrop-blur-sm shadow-sm flex flex-col items-start overflow-hidden flex-1 min-w-0"
                >
                  <div className="text-black group-hover:scale-110 transition-transform origin-left"><b.icon className="w-6 h-6 md:w-8 md:h-8 shrink-0" strokeWidth={2} /></div>
                  <h3 className="text-[13px] sm:text-[16px] md:text-2xl font-black text-black tracking-tight uppercase leading-tight md:leading-none w-full break-words">{b.title}</h3>
                  <p className="text-[10px] sm:text-[11px] md:text-[14px] text-black/80 leading-snug md:leading-relaxed font-medium w-full break-words">{b.text}</p>
                </motion.div>
              ))}
           </div>
        </section>
      </main>
    </div>
  );
}










