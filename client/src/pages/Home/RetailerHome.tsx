import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Package,
  Layers,
  Archive,
  Zap,
  Globe,
  LayoutGrid
} from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import ProductCard from '../../components/premium/ProductCard';

interface Category {
  id: string;
  name: string;
  logoUrl?: string;
  orderIndex?: number;
}

interface CategorySection {
  category: Category;
  products: any[];
}

export default function RetailerHome() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorySections, setCategorySections] = useState<CategorySection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const catRes = await axiosInstance.get('/products/categories');
        const cats = catRes.data.categories
          .filter((c: any) => c.isActive !== false)
          .sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));
        setCategories(cats);

        const sections = await Promise.all(cats.map(async (cat: Category) => {
          const prodRes = await axiosInstance.get(`/products?categoryId=${cat.id}&limit=12`);
          return {
            category: cat,
            products: prodRes.data.products
          };
        }));
        setCategorySections(sections);
      } catch (err) {
        console.error('Failed to fetch store data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getIcon = (name: string) => {
    const icons: Record<string, any> = {
      'Plastics': <Package size={32} />,
      'Hardware': <Package size={32} />,
      'Textiles': <Layers size={32} />,
      'Storage': <Archive size={32} />,
      'Electronics': <Zap size={32} />,
      'Logistics': <Globe size={32} />,
      'Default': <LayoutGrid size={32} />
    };
    return icons[name] || icons['Default'];
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center gap-6">
       <div className="w-12 h-12 border-4 border-[#121212]/10 border-t-[#121212] rounded-full animate-spin" />
       <p className="text-[10px] font-black text-[#121212]/40 uppercase tracking-[0.5em]">Synchronizing Portal</p>
    </div>
  );

  const trendingProducts = categorySections.flatMap(s => s.products).slice(0, 10);

  return (
    <div className="bg-[#FFFFFF] min-h-screen font-sans selection:bg-[#000000] selection:text-[#FFFFFF]">
      <main className="max-w-[1800px] mx-auto px-6 md:px-12 pt-[60px] pb-40">
        
        {/* 1. Category Icons Grid */}
        <section className="mb-8 md:mb-12 px-2">
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-9 gap-3 md:gap-6">
            {categories.map((cat: Category, i: number) => (
              <motion.button 
                key={cat.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/shop?categoryId=${cat.id}`)}
                className="group flex flex-col items-center gap-3 md:gap-6"
              >
                <div className="w-full aspect-square bg-[#D6D6D6] hover:bg-white transition-all duration-500 rounded-[20px] md:rounded-[40px] flex items-center justify-center group-hover:-translate-y-2 border border-transparent hover:border-[#D6D6D6]">
                   <div className="text-[#000000] scale-75 md:scale-110 group-hover:scale-110 transition-transform">
                      {cat.logoUrl ? <img src={cat.logoUrl} alt={cat.name} className="w-8 md:w-12 h-8 md:h-12 object-contain" /> : getIcon(cat.name)}
                   </div>
                </div>
                <p className="text-[9px] md:text-[11px] font-black text-black/60 uppercase tracking-[0.1em] md:tracking-[0.2em] group-hover:text-black transition-opacity text-center whitespace-normal max-w-full">
                   {cat.name}
                </p>
              </motion.button>
            ))}
          </div>
        </section>

        {/* 2. Our Top Products Section (Gray Background ONLY for the product line) */}
        <section className="space-y-3 mb-8 group/section">
           <div className="flex justify-between items-center border-b border-black/[0.05] pb-6 px-2">
              <h3 className="text-xl md:text-5xl font-black text-[#000000] tracking-tighter uppercase leading-none">Our Top Products</h3>
              <button 
                onClick={() => navigate('/shop')}
                className="group flex items-center gap-3 md:gap-6 px-10 md:px-20 py-3 md:py-6 bg-[#000000] text-[#FFFFFF] text-[10px] md:text-[12px] font-black uppercase tracking-widest rounded-full hover:bg-[#1A1A1A] transition-all active:scale-95"
              >
                 Product <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
           </div>

           <div className="bg-[#D6D6D6] rounded-none md:rounded-[60px] -mx-6 md:mx-0 p-6 md:p-10 relative overflow-hidden">
             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-10">
                {trendingProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
             </div>
           </div>
        </section>

        {/* 3. Category Sections */}
        <div className="space-y-8">
          {categorySections.map((section: CategorySection, index: number) => (
            <CategoryRow key={section.category.id} section={section} index={index} />
          ))}
        </div>
        
      </main>
    </div>
  );
}

function CategoryRow({ section, index }: { section: CategorySection, index: number }) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      className="space-y-3 group/row"
    >
      {/* 1. Heading on White Background */}
      <div className="flex justify-between items-center border-b border-black/[0.05] pb-4 md:pb-6 px-2">
        <h2 className="text-xl md:text-4xl font-black text-[#121212] tracking-tighter leading-none uppercase">
          {section.category.name}
        </h2>
        <div className="flex gap-2 md:gap-3">
           <button onClick={() => scroll('left')} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black/20 hover:border-black flex items-center justify-center text-black/60 hover:text-black transition-all active:scale-95 bg-white shadow-sm">
              <ChevronLeft size={18} />
           </button>
           <button onClick={() => scroll('right')} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black/20 hover:border-black flex items-center justify-center text-black/60 hover:text-black transition-all active:scale-95 bg-white shadow-sm">
              <ChevronRight size={18} />
           </button>
        </div>
      </div>

      {/* 2. Gray Background specifically for the Product Slider */}
      <div className="bg-[#D6D6D6] rounded-none md:rounded-[40px] -mx-6 md:mx-0 p-4 md:p-6 relative overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide pt-4 pb-4 md:pt-6 md:pb-6 -mx-2 px-4 snap-x"
        >
          {section.products.slice(0, 10).map((product: any) => (
            <div key={product.id} className="snap-start flex-shrink-0 w-[160px] md:w-[240px]">
               <ProductCard product={product} />
            </div>
          ))}
          {section.products.length > 0 && (
             <motion.button 
               whileHover={{ y: -8 }}
               transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
               onClick={() => navigate(`/shop?categoryId=${section.category.id}`)}
               className="w-[160px] h-[260px] md:w-[240px] md:h-[360px] snap-start flex-shrink-0 group flex flex-col items-center justify-center bg-black hover:bg-[#111111] transition-all duration-700 rounded-[12px] p-4 md:p-8 space-y-4 md:space-y-6"
             >
                <div className="w-24 h-24 rounded-full border-2 border-white/10 flex items-center justify-center text-white group-hover:border-white transition-all duration-500 group-hover:scale-105">
                   <ArrowRight size={40} className="group-hover:translate-x-2 transition-transform duration-500" />
                </div>
                
                <div className="text-center space-y-2">
                  <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] group-hover:text-white/60 transition-colors">DISCOVER ALL</p>
                  <p className="text-[14px] font-bold text-white uppercase tracking-tight leading-tight">{section.category.name}</p>
                </div>
             </motion.button>
          )}
        </div>
      </div>
    </motion.section>
  );
}
