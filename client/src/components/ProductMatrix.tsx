import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface ProductMatrixProps {
  product: Product;
  onAddToCart: (quantities: Record<string, number>) => void;
}

const SIZES = ['S', 'M', 'L', 'XL'] as const;
type Size = typeof SIZES[number];

const ProductMatrix: React.FC<ProductMatrixProps> = ({ product, onAddToCart }) => {
  const [quantities, setQuantities] = useState<Record<Size, number>>({
    S: 0, M: 0, L: 0, XL: 0
  });

  const totalQuantity = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalPrice = totalQuantity * product.price;

  const updateQuantity = (size: Size, delta: number) => {
    setQuantities(prev => {
      const newVal = Math.max(0, prev[size] + delta);
      // For simplicity, we assume each size has its own stock, 
      // but here we just check if total doesn't exceed global stock.
      const currentTotal = Object.values({ ...prev, [size]: newVal }).reduce((a, b) => a + b, 0);
      if (currentTotal > product.stock) return prev;
      return { ...prev, [size]: newVal };
    });
  };

  const handleInputChange = (size: Size, val: string) => {
    const num = parseInt(val) || 0;
    setQuantities(prev => {
      const otherTotal = Object.entries(prev)
        .filter(([s]) => s !== size)
        .reduce((sum, [_, v]) => sum + v, 0);
      
      const allowed = Math.min(Math.max(0, num), product.stock - otherTotal);
      return { ...prev, [size]: allowed };
    });
  };

  const handleAddToCart = () => {
    const breakdown = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([size, qty]) => `${qty}${size}`)
      .join(', ');
    
    console.log(`[WHOLESALE MATRIX] Added ${breakdown} of ${product.name} to cart. Total: $${totalPrice.toFixed(2)}`);
    onAddToCart(quantities);
    
    // Reset quantities after adding
    setQuantities({ S: 0, M: 0, L: 0, XL: 0 });
  };

  return (
    <div className="w-full bg-[#FAFAFA] md:bg-slate-50/80 rounded-[20px] md:rounded-none p-5 md:p-6 border border-slate-200/60 shadow-lg md:shadow-sm">
      <div className="flex flex-col md:grid md:grid-cols-4 gap-4 md:gap-3 mb-6 md:mb-5">
        {SIZES.map(size => (
          <div key={size} className="flex items-center justify-between md:flex-col md:gap-4 bg-white md:bg-transparent p-4 md:p-0 rounded-[16px] md:rounded-none border border-black/[0.03] md:border-none shadow-sm md:shadow-none transition-all hover:border-black/10">
            <div className="flex flex-col md:items-center">
              <span className="text-[11px] md:text-[10px] font-black text-black/40 uppercase tracking-widest">{size} UNIT</span>
              <span className="md:hidden text-[9px] font-bold text-black/20 mt-0.5">AVAILABILITY: {product.stock}</span>
            </div>
            
            <div className="flex items-center bg-[#F1F1F1] md:bg-white border border-slate-200 rounded-[10px] md:rounded-none overflow-hidden hover:border-black transition-all">
              <button 
                onClick={() => updateQuantity(size, -1)}
                className={`p-3 md:p-2 transition-colors ${quantities[size] > 0 ? 'text-black hover:bg-white' : 'text-black/10 cursor-not-allowed'}`}
                disabled={quantities[size] === 0}
              >
                <Minus size={16} strokeWidth={3} />
              </button>
              
              <input 
                type="number"
                value={quantities[size] || ''}
                onChange={(e) => handleInputChange(size, e.target.value)}
                placeholder="0"
                className="w-12 md:w-12 text-center py-2.5 text-sm font-black text-black outline-none bg-transparent [appearance:textfield] focus:bg-black/5 transition-colors"
                onFocus={(e) => e.target.select()}
              />
              
              <button 
                onClick={() => updateQuantity(size, 1)}
                className="p-3 md:p-2 hover:bg-white text-black transition-colors"
                disabled={totalQuantity >= product.stock}
              >
                <Plus size={16} strokeWidth={3} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-5 pt-5 border-t border-black/[0.05] mt-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-black/30 uppercase tracking-widest">MANIFEST TOTAL</span>
          <span className="text-xl md:text-2xl font-black text-black tracking-tight">₹{totalPrice.toLocaleString()}</span>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={totalQuantity === 0}
          className="flex-grow bg-black hover:bg-[#111111] disabled:bg-black/5 text-[#D6D6D6] disabled:text-black/10 min-h-[56px] md:min-h-[52px] py-4 px-8 rounded-[12px] md:rounded-none font-black text-[11px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl group"
        >
          <ShoppingCart size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
          <span>MANIFEST {totalQuantity > 0 ? `(${totalQuantity})` : ''}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductMatrix;










