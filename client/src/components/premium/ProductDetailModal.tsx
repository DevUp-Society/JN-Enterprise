import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';
import { QuickOrderMatrix } from './QuickOrderMatrix';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  sku?: string;
  description?: string;
}

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal = ({ product, onClose }: ProductDetailModalProps) => {
  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate/90 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-5xl bg-bone overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
             <button 
               onClick={onClose}
               className="absolute top-6 right-6 z-10 p-2 bg-white/50 hover:bg-white transition-colors text-slate"
             >
               <X size={20} />
             </button>

             <div className="w-full md:w-1/2 aspect-[4/5] bg-white">
                <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
             </div>

             <div className="w-full md:w-1/2 p-12 space-y-8 overflow-y-auto max-h-[90vh] no-scrollbar">
                <div className="space-y-2">
                   <span className="text-[10px] font-black text-gold tracking-widest-xl uppercase">{product.category}</span>
                   <h2 className="text-4xl font-black text-slate tracking-tighter uppercase leading-none">{product.name}</h2>
                   <p className="text-[10px] font-bold text-slate/40 uppercase tracking-widest leading-loose">
                      SKU: {product.sku || `JN-${product.id.toString().padStart(4, '0')}`}
                   </p>
                </div>

                <div className="flex items-center gap-4 py-4 border-y border-slate/5">
                   <Info size={16} className="text-gold flex-shrink-0" />
                   <p className="text-xs font-medium text-slate/60 leading-relaxed uppercase">
                      {product.description || "Premium wholesale quality. Sustainably sourced and manufactured for high-volume retail environments."}
                   </p>
                </div>

                <QuickOrderMatrix />
                
                <div className="pt-8 border-t border-slate/5">
                   <h4 className="text-[10px] font-black uppercase text-slate tracking-widest mb-4">Specifications</h4>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <span className="text-[8px] font-bold text-slate/30 uppercase tracking-widest">Material</span>
                         <p className="text-[10px] font-black uppercase">Industrial Grade</p>
                      </div>
                      <div className="space-y-1">
                         <span className="text-[8px] font-bold text-slate/30 uppercase tracking-widest">Availability</span>
                         <p className="text-[10px] font-black uppercase text-black">In Stock</p>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};










