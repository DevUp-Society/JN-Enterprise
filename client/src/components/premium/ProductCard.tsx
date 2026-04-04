import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../store/CartContext';

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
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem([{
      cartItemId: `${product.id}-OS`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      sku: product.sku || 'N/A',
      size: 'OS',
      quantity: 1
    }]);
  };

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

      {/* Content Area */}
      <div className="flex-1 px-6 py-4 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex justify-between items-start">
            <h4 className="text-[13px] font-bold text-black tracking-tight leading-tight line-clamp-2 max-w-[80%]">
              {product.name}
            </h4>
            <span className="text-[9px] font-medium text-black/30 tracking-widest uppercase mt-1">
              {product.sku?.split('-').pop() || 'PROT-X'}
            </span>
          </div>
        </div>
        
      <div className="p-0 md:p-3 border-t border-black/[0.02] bg-white mt-auto overflow-hidden">
        <button 
          onClick={handleQuickAdd}
          className="w-full h-8 md:h-10 bg-black text-white hover:bg-black/80 transition-all flex items-center justify-center gap-2 md:gap-3 rounded-none md:rounded-[8px] group/add active:scale-[0.98]"
        >
           <ShoppingCart size={14} className="md:w-4 md:h-4 text-white" />
           <span className="text-[8px] md:text-[10px] font-black uppercase tracking-normal whitespace-nowrap">Add to Cart</span>
        </button>
      </div>
      </div>

      {/* Bottom Architectural Border */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black/0 group-hover:bg-black/5 transition-colors" />
    </motion.div>
  );
};

export default ProductCard;
