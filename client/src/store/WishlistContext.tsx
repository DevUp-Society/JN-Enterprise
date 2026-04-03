import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface WishlistItem {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    moq?: number;
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    waitingList: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: string) => void;
    addToWaitingList: (item: WishlistItem) => void;
    removeFromWaitingList: (id: string) => void;
    wishlistCount: number;
    waitingListCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [waitingList, setWaitingList] = useState<WishlistItem[]>([]);

    useEffect(() => {
        try {
            const storedWishlist = localStorage.getItem('jn_wishlist');
            const storedWaitlist = localStorage.getItem('jn_waitlist');
            if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
            if (storedWaitlist) setWaitingList(JSON.parse(storedWaitlist));
        } catch (e) {
            console.error('Failed to parse from local storage', e);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('jn_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    useEffect(() => {
        localStorage.setItem('jn_waitlist', JSON.stringify(waitingList));
    }, [waitingList]);

    const addToWishlist = (item: WishlistItem) => {
        setWishlist(prev => {
            if (prev.find(i => i.id === item.id)) return prev;
            return [...prev, item];
        });
    };

    const removeFromWishlist = (id: string) => {
        setWishlist(prev => prev.filter(i => i.id !== id));
    };

    const addToWaitingList = (item: WishlistItem) => {
        setWaitingList(prev => {
            if (prev.find(i => i.id === item.id)) return prev;
            return [...prev, item];
        });
    };

    const removeFromWaitingList = (id: string) => {
        setWaitingList(prev => prev.filter(i => i.id !== id));
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            waitingList,
            addToWishlist,
            removeFromWishlist,
            addToWaitingList,
            removeFromWaitingList,
            wishlistCount: wishlist.length,
            waitingListCount: waitingList.length
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
