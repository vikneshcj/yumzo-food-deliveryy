import React, { createContext, useContext, useState, useEffect } from 'react';
import { Food, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (food: Food, restaurantName?: string) => void;
  increaseQuantity: (foodId: string) => void;
  decreaseQuantity: (foodId: string) => void;
  removeFromCart: (foodId: string) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  totalItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('yumzo_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('yumzo_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (food: Food, restaurantName: string = 'YUMZO Partner Restaurant') => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.food._id === food._id);
      if (existing) {
        return prevCart.map((item) =>
          item.food._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { food, quantity: 1, restaurant_id: food.restaurant_id, restaurant_name: restaurantName }];
    });
  };

  const increaseQuantity = (foodId: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.food._id === foodId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (foodId: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.food._id === foodId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (foodId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.food._id !== foodId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? (subtotal > 500 ? 0 : 40) : 0;
  const total = subtotal + deliveryFee;
  const totalItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        deliveryFee,
        total,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
