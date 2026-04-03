import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../store/WishlistContext';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  sku?: string;
  moq?: number;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [qty, setQty] = useState(product.moq || 50);
  const { addToWishlist, wishlist, addToWaitingList, waitingList } = useWishlist();
  const isAdded = wishlist.some(i => i.id === product.id);
  const isWaiting = waitingList.some(i => i.id === product.id);

  const handleAddToProcurement = (e: React.MouseEvent) => {
    e.preventDefault();
    addToWishlist({
      ...product,
      moq: qty
    });
  };

  const handleAddToWaitlist = (e: React.MouseEvent) => {
    e.preventDefault();
    addToWaitingList({
      ...product,
      moq: qty
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white p-5 rounded-[32px] space-y-5 hover:shadow-2xl transition-all duration-500 border border-[#425664]/5 relative overflow-hidden h-full"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden rounded-[24px] bg-[#F6F4F2]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#425664]/5">
          <span className="text-[10px] font-bold text-[#425664] uppercase tracking-widest">In Stock</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      <div className="px-1 space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[#C6AD8F]">
            <span className="text-xs font-semibold uppercase tracking-widest">{product.category}</span>
            <span className="text-[10px] font-medium text-[#6B7280]">MOQ: {product.moq || 50} units</span>
          </div>
          <h4 className="text-lg font-medium text-[#425664] tracking-tight leading-snug line-clamp-2 min-h-[48px]">
            {product.name}
          </h4>
        </div>

        <div className="flex justify-between items-end border-t border-[#425664]/5 pt-4">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-widest">Pricing Matrix</p>
            <p className="text-xl font-bold text-[#425664]">
              ₹{product.price.toLocaleString()}
              <span className="text-xs font-normal text-[#6B7280] ml-1">/ unit</span>
            </p>
          </div>

          <div className="flex items-center bg-[#F6F4F2] rounded-xl px-2 py-1 gap-3">
            <button onClick={(e) => { e.preventDefault(); setQty(Math.max(product.moq || 50, qty - 10)) }} className="text-[#425664] hover:text-[#C6AD8F] font-bold text-lg">-</button>
            <span className="text-sm font-bold text-[#425664] min-w-[30px] text-center">{qty}</span>
            <button onClick={(e) => { e.preventDefault(); setQty(qty + 10) }} className="text-[#425664] hover:text-[#C6AD8F] font-bold text-lg">+</button>
          </div>
        </div>

        <button
          onClick={handleAddToProcurement}
          disabled={isAdded}
          className={`w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn shadow-lg ${isAdded ? 'bg-green-600 text-white shadow-green-600/10' : 'bg-[#C6AD8F] text-white hover:bg-[#425664] shadow-[#C6AD8F]/10'
            }`}
        >
          {isAdded ? "Added to Procurement" : "Add to Procurement"}
          {isAdded ? <Check size={14} /> : <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />}
        </button>

        <button
          onClick={handleAddToWaitlist}
          disabled={isWaiting}
          className={`w-full mt-2 text-center text-[10px] font-bold uppercase tracking-widest transition-colors ${isWaiting ? 'text-green-600' : 'text-[#425664]/50 hover:text-[#C6AD8F]'
            }`}
        >
          {isWaiting ? "✓ On Waiting List" : "+ Add to Waiting List"}
        </button>
      </div>
    </motion.div>
  );
};
