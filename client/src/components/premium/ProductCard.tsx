import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
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
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white p-4 rounded-[28px] space-y-4 hover:shadow-2xl transition-all duration-500 border border-slate-muted/5"
    >
      <div className="relative aspect-square overflow-hidden rounded-[24px] bg-[#F3F6F5]">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        />
      </div>

      <div className="px-1 space-y-3 relative pb-2">
        <div className="space-y-1">
          <h4 className="text-[14px] font-bold text-[#1A1A1A] tracking-tight leading-tight">
            {product.name}
          </h4>
          <p className="text-[10px] font-medium text-slate-muted tracking-wide">
            Bulk ID: {product.sku || (Math.floor(Math.random() * 500) + 100) + ' units'}
          </p>
        </div>
        
        <div className="flex justify-between items-end">
          <p className="text-[16px] font-black text-[#1A1A1A]">
            ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          
          <button 
            className="w-10 h-10 rounded-full bg-[#EBF1EF] flex items-center justify-center text-[#1A1A1A] group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm"
          >
            <ShoppingCart size={16} className="fill-current group-hover:fill-none" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
