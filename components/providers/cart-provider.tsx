"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  options?: {
    name: string;
    value: string;
    price: number;
  }[];
}

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const { toast } = useToast();

  // Calculate subtotal whenever items change
  const subtotal = items.reduce((total, item) => {
    const itemTotal = item.price * item.quantity;
    const optionsTotal = item.options?.reduce((acc, option) => acc + option.price, 0) || 0;
    return total + (itemTotal + optionsTotal * item.quantity);
  }, 0);

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart.items || []);
        setRestaurantId(parsedCart.restaurantId || null);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify({
        items,
        restaurantId,
      }));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [items, restaurantId]);

  const addItem = (item: CartItem) => {
    // Check if adding from a different restaurant
    if (restaurantId && item.restaurantId !== restaurantId && items.length > 0) {
      // Confirm with user before clearing cart
      if (window.confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
        setItems([{ ...item }]);
        setRestaurantId(item.restaurantId);
        toast({
          title: 'Cart cleared',
          description: 'Your cart has been cleared and a new item added',
        });
      }
    } else {
      // Check if item already exists in cart
      const existingItem = items.find(i => i.id === item.id);

      if (existingItem) {
        // Update quantity of existing item
        setItems(items.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
        ));
      } else {
        // Add new item
        setItems([...items, { ...item }]);
      }
      
      // Set restaurant ID if not already set
      if (!restaurantId) {
        setRestaurantId(item.restaurantId);
      }

      toast({
        title: 'Item added',
        description: `${item.name} added to your cart`,
      });
    }
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
    
    // If cart is empty, reset restaurant ID
    if (items.length === 1) {
      setRestaurantId(null);
    }

    toast({
      title: 'Item removed',
      description: 'Item removed from your cart',
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, quantity } 
        : item
    ));
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    toast({
      title: 'Cart cleared',
      description: 'All items have been removed from your cart',
    });
  };

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        restaurantId, 
        subtotal, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};