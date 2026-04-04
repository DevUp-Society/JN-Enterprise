import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface ListsContextType {
  wishlist: any[];
  waitlist: any[];
  toggleWishlist: (product: any) => void;
  toggleWaitlist: (product: any) => void;
  isInWishlist: (id: string) => boolean;
  isInWaitlist: (id: string) => boolean;
}

const ListsContext = createContext<ListsContextType | undefined>(undefined);

export const ListsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [waitlist, setWaitlist] = useState<any[]>([]);

  // 1. Initial Load (LocalStorage fallback)
  useEffect(() => {
    const storedWishlist = localStorage.getItem('jn_wishlist');
    const storedWaitlist = localStorage.getItem('jn_waitlist');
    if (storedWishlist) {
      try { setWishlist(JSON.parse(storedWishlist)); } catch (e) {}
    }
    if (storedWaitlist) {
      try { setWaitlist(JSON.parse(storedWaitlist)); } catch (e) {}
    }
  }, []);

  // 2. Sync with Backend when Logged In
  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const resp = await fetch('/api/wishlist');
      if (resp.ok) {
        const backendItems = await resp.json();
        const transformed = backendItems.map((item: any) => ({
          ...item.product,
          id: item.productId // Ensure ID alignment
        }));
        setWishlist(transformed);
      }
    } catch (err) {
      console.error('Failed to sync wishlist:', err);
    }
  };

  useEffect(() => {
    localStorage.setItem('jn_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('jn_waitlist', JSON.stringify(waitlist));
  }, [waitlist]);

  const toggleWishlist = async (product: any) => {
    // Update Local UI
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.filter(item => item.id !== product.id);
      return [...prev, product];
    });

    // Update Backend if logged in
    if (user) {
      try {
        await fetch('/api/wishlist/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        });
      } catch (err) {
        console.error('Sync wishlist toggle failed:', err);
      }
    }
  };

  const toggleWaitlist = (product: any) => {
    setWaitlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.filter(item => item.id !== product.id);
      return [...prev, product];
    });
  };

  const isInWishlist = (id: string) => wishlist.some(item => item.id === id);
  const isInWaitlist = (id: string) => waitlist.some(item => item.id === id);

  return (
    <ListsContext.Provider value={{ wishlist, waitlist, toggleWishlist, toggleWaitlist, isInWishlist, isInWaitlist }}>
      {children}
    </ListsContext.Provider>
  );
};

export const useLists = () => {
  const context = useContext(ListsContext);
  if (context === undefined) {
    throw new Error('useLists must be used within a ListsProvider');
  }
  return context;
};










