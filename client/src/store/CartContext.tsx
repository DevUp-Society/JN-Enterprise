import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  sku: string;
  sizeQuantities: Record<string, number>; // e.g. { S: 50, M: 100 }
}

interface CartContextType {
  cart: CartItem[];
  totalQty: number;
  totalPrice: number;
  addItem: (product: any, sizeQuantities: Record<string, number>) => void;
  removeItem: (sku: string) => void;
  clearCart: () => void;
  isMiniCartOpen: boolean;
  setIsMiniCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

  // Persistence
  useEffect(() => {
    const storedCart = localStorage.getItem('jn_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error('Cart restoration failed:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jn_cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (product: any, sizeQuantities: Record<string, number>) => {
    setCart(prev => {
      const existing = prev.find(item => item.sku === product.sku);
      if (existing) {
        // Merge quantities
        const newSizeQuantities = { ...existing.sizeQuantities };
        Object.entries(sizeQuantities).forEach(([size, qty]) => {
          newSizeQuantities[size] = (newSizeQuantities[size] || 0) + qty;
        });
        return prev.map(item => item.sku === product.sku ? { ...item, sizeQuantities: newSizeQuantities } : item);
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        sku: product.sku,
        sizeQuantities
      }];
    });
    setIsMiniCartOpen(true); // Auto-open on add
  };

  const removeItem = (sku: string) => {
    setCart(prev => prev.filter(item => item.sku !== sku));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalQty = cart.reduce((acc, item) => 
    acc + Object.values(item.sizeQuantities).reduce((a, b) => a + b, 0), 0
  );

  const totalPrice = cart.reduce((acc, item) => 
    acc + (item.price * Object.values(item.sizeQuantities).reduce((a, b) => a + b, 0)), 0
  );

  return (
    <CartContext.Provider value={{ 
      cart, 
      totalQty, 
      totalPrice, 
      addItem, 
      removeItem, 
      clearCart, 
      isMiniCartOpen, 
      setIsMiniCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
