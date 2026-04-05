import { motion } from 'framer-motion';
interface ProjectProduct {
  id: string;
  name: string;
  price: number;
  category: any; // Can be string or object
  image: string;
  sku?: string;
  moq?: number;
}

interface ProductCardProps {
  product: ProjectProduct;
  className?: string;
}

const ProductCard = ({ product, className = "" }: ProductCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => window.location.href = `/product/${product.id}`}
      className={`group rounded-[12px] transition-all duration-700 border border-black/[0.03] hover:border-black/20 relative overflow-hidden flex flex-col cursor-pointer w-full h-[260px] md:h-[360px] ${className || 'bg-white'}`}
    >
      {/* Visual Accent - Top Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-black/10 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500" />

      {/* Image Container */}
      <div className="relative h-[130px] md:h-[180px] m-2 overflow-hidden rounded-[8px] bg-[#F7F7F7]">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-1000 ease-out grayscale-[20%] group-hover:grayscale-0"
        />
        
        {/* Category Badge - Glassmorphism */}
        <div className="absolute top-4 left-4 backdrop-blur-md bg-white/60 border border-white/40 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <span className="text-[9px] font-bold text-black/60 tracking-widest uppercase">
            {typeof product.category === 'string' ? product.category : product.category?.name || 'Industrial'}
          </span>
        </div>

        {/* Floating Price - Premium Pill */}
        <div className="absolute bottom-4 right-4 shadow-2xl">
          <div className="bg-black backdrop-blur-xl px-4 py-2 rounded-[14px] border border-white/10 group-hover:scale-105 transition-transform duration-500">
            <span className="text-[13px] font-bold text-white tracking-tight">
              ₹{product.price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 md:px-6 py-3 md:py-4 flex flex-col justify-between">
        <div className="space-y-0.5 md:space-y-1">
          <div className="flex justify-between items-start gap-2">
            <h4 className="text-[11px] md:text-[13px] font-black text-black tracking-tight leading-tight line-clamp-2">
              {product.name}
            </h4>
            <span className="shrink-0 text-[8px] md:text-[9px] font-medium text-black/30 tracking-widest uppercase mt-0.5">
              {product.sku?.split('-').pop() || 'UNIT'}
            </span>
          </div>
        </div>
        
      <div className="sticky bottom-0 p-3 md:p-4 border-t border-black/[0.05] bg-white mt-auto overflow-hidden">
        <button 
          onClick={(e) => { e.stopPropagation(); window.location.href = `/product/${product.id}`; }}
          className="w-full h-12 md:h-12 bg-black text-white hover:bg-black/90 transition-all flex items-center justify-center gap-3 rounded-[8px] group/add active:scale-[0.98]"
        >
           <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">View Product</span>
        </button>
      </div>
      </div>

      {/* Bottom Architectural Border */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black/0 group-hover:bg-black/5 transition-colors" />
    </motion.div>
  );
};

export default ProductCard;
