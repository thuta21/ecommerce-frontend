'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, CartItem } from '@/lib/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (cartId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartId: number) => Promise<void>;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setItems([]);
    }
  }, [isAuthenticated]);

  const refreshCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await api.getCart();
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      await api.addToCart(productId, quantity);
      await refreshCart();
    } catch (error) {
      throw error;
    }
  };

  const updateQuantity = async (cartId: number, quantity: number) => {
    try {
      await api.updateCart(cartId, quantity);
      await refreshCart();
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (cartId: number) => {
    try {
      await api.removeFromCart(cartId);
      await refreshCart();
    } catch (error) {
      throw error;
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalAmount = items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;

  const value = {
    items,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalAmount,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}