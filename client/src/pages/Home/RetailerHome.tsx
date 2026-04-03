import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Package,
  Layers,
  Archive
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../../components/premium/ProductCard';

interface CategorySection {
  id: string;
  name: string;
  icon: any;
  products: any[];
}

export default function RetailerHome() {
  // Rich dataset for a "proper" experience
  const categoryData: CategorySection[] = [
    {
      id: 'cat-1',
      name: "Hardware & Engineering",
      icon: <Package size={20} />,
      products: [
        { id: "1", name: "Industrial Zinc-Coated Wall Hooks", price: 2450, category: "Hardware", image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=600", sku: "HW-99X" },
        { id: "2", name: "Heavy-Duty Support Bracket", price: 4100, category: "Hardware", image: "https://images.unsplash.com/photo-1584982223243-7f7cd4aa3b26?auto=format&fit=crop&q=80&w=600", sku: "HW-102" },
        { id: "101", name: "Precision Steel Bearing Set", price: 12500, category: "Hardware", image: "https://images.unsplash.com/photo-1548142723-aae7678afd53?auto=format&fit=crop&q=80&w=600", sku: "HW-045" },
        { id: "102", name: "M6 Industrial Bolt Batch", price: 850, category: "Hardware", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800", sku: "HW-882" },
        { id: "103", name: "Aerospace Grade Fasteners", price: 18900, category: "Hardware", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600", sku: "HW-Alpha" },
        { id: "104", name: "Titanium Alloy Truss Pins", price: 34000, category: "Hardware", image: "https://images.unsplash.com/photo-1530124560676-4f99198283df?auto=format&fit=crop&q=80&w=600", sku: "HW-TI" },
      ]
    },
    {
      id: 'cat-2',
      name: "Textiles & Materials",
      icon: <Layers size={20} />,
      products: [
        { id: "3", name: "Cotton Blend Crew Socks", price: 1200, category: "Textiles", image: "https://images.unsplash.com/photo-1582966298431-99c6a1e8eb8a?auto=format&fit=crop&q=80&w=600", sku: "TX-440" },
        { id: "105", name: "High-Density Nylon Webbing", price: 5400, category: "Textiles", image: "https://images.unsplash.com/photo-1558273109-60437a70127b?auto=format&fit=crop&q=80&w=800", sku: "TX-990" },
        { id: "106", name: "Waterproof Polyester Mesh", price: 2800, category: "Textiles", image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=600", sku: "TX-DRY" },
        { id: "107", name: "Carbon Fiber Reinforcement", price: 45000, category: "Textiles", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600", sku: "TX-CF" },
        { id: "108", name: "Recycled PET Fabric Batch", price: 15600, category: "Textiles", image: "https://images.unsplash.com/photo-1610492488739-107583bb1bb1?auto=format&fit=crop&q=80&w=600", sku: "TX-ECO" },
      ]
    },
    {
      id: 'cat-3',
      name: "Industrial Storage",
      icon: <Archive size={20} />,
      products: [
        { id: "4", name: "Clear Molded Box Set", price: 3750, category: "Storage", image: "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?auto=format&fit=crop&q=80&w=600", sku: "ST-001" },
        { id: "109", name: "Heavy-Duty Pallet Bin", price: 8900, category: "Storage", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800", sku: "ST-PLT" },
        { id: "110", name: "Modular Tool Organizer", price: 4200, category: "Storage", image: "https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&q=80&w=800", sku: "ST-MOD" },
        { id: "111", name: "ESD Safe Electronics Bin", price: 1250, category: "Storage", image: "https://images.unsplash.com/photo-1618354721073-209e2da245a4?auto=format&fit=crop&q=80&w=600", sku: "ST-ESD" },
      ]
    }
  ];

  return (
    <div className="bg-[#F6F4F2] min-h-screen">
      <main className="max-w-[1400px] mx-auto px-8 pt-[120px] pb-40 space-y-24">
        
        {/* Categories Sections */}

        {/* Categories Sections */}
        {categoryData.map((cat, i) => (
          <CategoryRow key={cat.id} category={cat} index={i} />
        ))}
        
      </main>
    </div>
  );
}

function CategoryRow({ category, index }: { category: CategorySection, index: number }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Drag interaction states
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeftState(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // scroll-fast multiplier
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeftState - walk;
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      className="space-y-8"
    >
      {/* Category Header */}
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#425664] shadow-sm border border-[#425664]/5">
            {category.icon}
          </div>
          <h2 className="text-2xl font-bold text-[#425664] tracking-tight lowercase">
            {category.name}
          </h2>
        </div>
        
        <Link 
          to="/shop" 
          className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#C6AD8F] hover:text-[#425664] transition-colors group"
        >
          View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative group/scroll px-2">
        {/* Navigation Arrows */}
        {showLeftArrow && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-2xl border border-[#425664]/5 flex items-center justify-center text-[#425664] hover:bg-[#C6AD8F] hover:text-white transition-all -translate-x-6 opacity-0 group-hover/scroll:opacity-100"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {showRightArrow && (
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-2xl border border-[#425664]/5 flex items-center justify-center text-[#425664] hover:bg-[#C6AD8F] hover:text-white transition-all translate-x-6 opacity-0 group-hover/scroll:opacity-100"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Products Row */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex gap-6 overflow-x-auto scrollbar-hide pb-8 pt-2 scroll-smooth cursor-grab active:cursor-grabbing snap-x snap-proximity`}
        >
          {category.products.map((product) => (
            <div key={product.id} className="min-w-[320px] md:min-w-[380px] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
          
          {/* Last partial card indicator / View More link */}
          <Link to="/shop" className="min-w-[200px] flex items-center justify-center group/more">
            <div className="flex flex-col items-center gap-4 text-[#C6AD8F] font-bold group-hover/more:scale-110 transition-transform">
              <div className="w-16 h-16 rounded-full border-2 border-[#C6AD8F]/20 flex items-center justify-center">
                <ArrowRight size={24} />
              </div>
              <span className="uppercase tracking-[0.2em] text-xs">Explore All</span>
            </div>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
