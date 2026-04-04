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
    <div className="w-full bg-slate-50/80 rounded-none p-5 border border-slate-200/60 shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {SIZES.map(size => (
          <div key={size} className="flex flex-col items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{size}</span>
            <div className="flex flex-col items-center bg-white border border-slate-200 rounded-none overflow-hidden shadow-sm hover:border-black transition-colors">
              <button 
                onClick={() => updateQuantity(size, 1)}
                className="p-2 hover:bg-slate-50 text-black transition-colors border-b border-slate-100"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
              <input 
                type="number"
                value={quantities[size] || ''}
                onChange={(e) => handleInputChange(size, e.target.value)}
                placeholder="0"
                className="w-12 text-center py-1.5 text-sm font-black text-slate-900 outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:bg-black/30 transition-colors"
                onFocus={(e) => e.target.select()}
              />
              <button 
                onClick={() => updateQuantity(size, -1)}
                className="p-2 hover:bg-slate-50 text-slate-400 transition-colors border-t border-slate-100"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-5 pt-3 border-t border-slate-200/80 mt-1">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Line Total</span>
          <span className="text-xl font-black text-slate-950">${totalPrice.toLocaleString()}</span>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={totalQuantity === 0}
          className="flex-grow bg-black hover:bg-black disabled:bg-slate-200 text-white disabled:text-slate-400 min-h-[48px] py-3.5 px-5 rounded-none font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-black hover:shadow-black"
        >
          <ShoppingCart size={16} strokeWidth={2.5} />
          Add To Procurement {totalQuantity > 0 ? `(${totalQuantity})` : ''}
        </button>
      </div>
    </div>
  );
};

export default ProductMatrix;










