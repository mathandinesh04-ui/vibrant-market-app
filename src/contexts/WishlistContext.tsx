import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';
import { toast } from '@/hooks/use-toast';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('freshmart_wishlist');
    if (savedWishlist) {
      setItems(JSON.parse(savedWishlist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('freshmart_wishlist', JSON.stringify(items));
  }, [items]);

  const addToWishlist = (product: Product) => {
    if (!items.find(item => item.id === product.id)) {
      setItems(prev => [...prev, product]);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} added to your wishlist.`,
      });
    }
  };

  const removeFromWishlist = (productId: string) => {
    setItems(prev => prev.filter(item => item.id !== productId));
    toast({
      title: "Removed from Wishlist",
      description: "Item removed from your wishlist.",
    });
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
