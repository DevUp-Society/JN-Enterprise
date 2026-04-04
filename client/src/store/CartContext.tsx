import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  cartItemId: string; // e.g. "sku-size"
  productId: string;
  name: string;
  price: number;
  image: string;
  sku: string;
  size: string;
  quantity: number;
}

export interface ShoppingCartModel {
  id: string;
  name: string;
  items: CartItem[];
}

interface CartContextType {
  carts: ShoppingCartModel[];
  activeCartId: string;
  cart: CartItem[];
  totalQty: number;
  totalPrice: number;
  
  setActiveCartId: (id: string) => void;
  createCart: (name: string) => void;
  deleteCart: (id: string) => void;

  addItem: (items: CartItem[]) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  
  isMiniCartOpen: boolean;
  setIsMiniCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [carts, setCarts] = useState<ShoppingCartModel[]>([
    { id: 'default-1', name: 'Cart', items: [] }
  ]);
  const [activeCartId, setActiveCartId] = useState<string>('default-1');
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

  // 1. Initial Load (LocalStorage fallback)
  useEffect(() => {
    const stored = localStorage.getItem('jn_carts_v4');
    if (stored) {
      try {
        const { savedCarts, savedActive } = JSON.parse(stored);
        if (savedCarts && savedCarts.length > 0) {
          setCarts(savedCarts);
          setActiveCartId(savedActive || savedCarts[0].id);
        }
      } catch (e) {
        console.error('Cart restoration failed:', e);
      }
    }
  }, []);

  // 2. Sync with Backend when Logged In
  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const resp = await fetch('/api/cart');
      if (resp.ok) {
        const backendItems = await resp.json();
        // Transform backend schema to local schema
        const transformed: CartItem[] = backendItems.map((item: any) => ({
          cartItemId: item.productId, // Simplified for now since sizes aren't fully integrated in API yet
          productId: item.productId,
          name: item.product.name,
          price: Number(item.product.price),
          image: item.product.image || '',
          sku: item.product.sku,
          size: 'OS', // Default
          quantity: item.quantity,
        }));

        setCarts(prev => prev.map(c => c.id === activeCartId ? { ...c, items: transformed } : c));
      }
    } catch (err) {
      console.error('Failed to sync cart with backend:', err);
    }
  };

  useEffect(() => {
    localStorage.setItem('jn_carts_v4', JSON.stringify({ savedCarts: carts, savedActive: activeCartId }));
  }, [carts, activeCartId]);

  const activeCart = carts.find(c => c.id === activeCartId) || carts[0];
  const cart = activeCart?.items || [];

  const updateActiveCartItems = (updater: (prevItems: CartItem[]) => CartItem[]) => {
    setCarts(prev => prev.map(c => c.id === activeCartId ? { ...c, items: updater(c.items) } : c));
  };

  const addItem = async (itemsToAdd: CartItem[]) => {
    // Update Local UI
    updateActiveCartItems(prev => {
      let nextItems = [...prev];
      itemsToAdd.forEach(newItem => {
        const existingIdx = nextItems.findIndex(i => i.productId === newItem.productId);
        if (existingIdx >= 0) {
            nextItems[existingIdx].quantity += newItem.quantity;
        } else {
            nextItems.push(newItem);
        }
      });
      return nextItems;
    });

    // Post to Backend if logged in
    if (user) {
      for (const item of itemsToAdd) {
        try {
          await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: item.productId, quantity: item.quantity })
          });
        } catch (err) {
          console.error('Sync add failed:', err);
        }
      }
    }
    
    setIsMiniCartOpen(true);
    
    // Dispatch success notification
    window.dispatchEvent(new CustomEvent('INDUSTRIAL_SUCCESS', { 
      detail: { message: `ADDED TO CART: ${itemsToAdd[0]?.name || 'ITEM'}` } 
    }));
  };

  const updateQuantity = async (cartItemId: string, delta: number) => {
    const item = cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);
    
    // Update Local UI
    updateActiveCartItems(prev => prev.map(i => i.cartItemId === cartItemId ? { ...i, quantity: newQty } : i));

    if (user) {
      try {
        await fetch('/api/cart/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: item.productId, quantity: newQty })
        });
      } catch (err) {
        console.error('Sync update failed:', err);
      }
    }
  };

  const removeItem = async (cartItemId: string) => {
    const item = cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    // Update Local UI
    updateActiveCartItems(prev => prev.filter(i => i.cartItemId !== cartItemId));

    if (user) {
      try {
        await fetch(`/api/cart/${item.productId}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Sync delete failed:', err);
      }
    }
  };

  const clearCart = async () => {
    updateActiveCartItems(() => []);
    if (user) {
      try {
        await fetch('/api/cart', { method: 'DELETE' });
      } catch (err) {
        console.error('Sync clear failed:', err);
      }
    }
  };

  const createCart = (name: string) => {
    const newId = `cart-${Date.now()}`;
    const nextNum = carts.length + 1;
    const finalName = name || `Cart ${nextNum}`;
    setCarts(prev => [...prev, { id: newId, name: finalName, items: [] }]);
    setActiveCartId(newId);
  };

  const deleteCart = (id: string) => {
    setCarts(prev => {
      const remaining = prev.filter(c => c.id !== id);
      if (remaining.length === 0) {
        const fallbackId = `cart-${Date.now()}`;
        setActiveCartId(fallbackId);
        return [{ id: fallbackId, name: 'Cart', items: [] }];
      }
      if (id === activeCartId) setActiveCartId(remaining[0].id);
      return remaining;
    });
  };

  const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      carts,
      activeCartId,
      setActiveCartId,
      createCart,
      deleteCart,
      cart, 
      totalQty, 
      totalPrice, 
      addItem, 
      updateQuantity, 
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










