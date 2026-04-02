import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  sku?: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group space-y-4"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-bone border border-slate/5 transition-all group-hover:border-slate/20">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
        />
        
        {/* Quick Add to Wishlist Button */}
        <button 
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md flex items-center justify-center text-slate hover:bg-gold hover:text-white transition-all shadow-sm border border-slate/10 opacity-0 group-hover:opacity-100 duration-300"
          title="Quick Add to Wishlist"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-bold text-slate uppercase tracking-tight leading-tight max-w-[80%]">
            {product.name}
          </h4>
          <span className="text-xs font-black text-slate/40 tracking-tighter">
             ${product.price}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-[10px] tracking-widest uppercase font-bold text-slate/30">
          <span>SKU: {product.sku || 'JN-' + product.id.toString().padStart(4, '0')}</span>
          <span className="text-slate/60 text-[9px]">Starting at: <span className="text-slate font-black">${product.price}</span></span>
        </div>
      </div>
    </motion.div>
  );
};
