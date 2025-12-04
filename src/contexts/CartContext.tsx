import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';
import { toast } from '@/hooks/use-toast';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  discount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const COUPONS: Record<string, number> = {
  'FRESH10': 10,
  'SAVE20': 20,
  'WELCOME15': 15,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('freshmart_cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    const savedCoupon = localStorage.getItem('freshmart_coupon');
    if (savedCoupon) {
      setAppliedCoupon(savedCoupon);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('freshmart_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.stock < quantity) {
      toast({
        title: "Out of Stock",
        description: "Sorry, this item is out of stock.",
        variant: "destructive",
      });
      return;
    }

    setItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast({
            title: "Limited Stock",
            description: `Only ${product.stock} items available.`,
            variant: "destructive",
          });
          return prev;
        }
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      return [...prev, { product, quantity }];
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
    toast({
      title: "Removed from Cart",
      description: "Item removed from your cart.",
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setItems(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          if (quantity > item.product.stock) {
            toast({
              title: "Limited Stock",
              description: `Only ${item.product.stock} items available.`,
              variant: "destructive",
            });
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('freshmart_coupon');
  };

  const applyCoupon = (code: string): boolean => {
    const upperCode = code.toUpperCase();
    if (COUPONS[upperCode]) {
      setAppliedCoupon(upperCode);
      localStorage.setItem('freshmart_coupon', upperCode);
      toast({
        title: "Coupon Applied!",
        description: `You got ${COUPONS[upperCode]}% off!`,
      });
      return true;
    }
    toast({
      title: "Invalid Coupon",
      description: "This coupon code is not valid.",
      variant: "destructive",
    });
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem('freshmart_coupon');
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = appliedCoupon ? (subtotal * COUPONS[appliedCoupon]) / 100 : 0;
  const totalPrice = subtotal - discount;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
