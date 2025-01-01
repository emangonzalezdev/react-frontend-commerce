import React, { createContext, useState, useContext } from 'react';

// Definimos un tipo para los ítems del carrito:
export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  // ... cualquier otra propiedad que necesites
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  // Podrías agregar funciones para aumentar/disminuir cantidad, etc.
}

const CartContext = createContext<CartContextProps>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Agregar al carrito: si el item ya existe, incrementa la cantidad
  const addToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex((it) => it.id === newItem.id);
      if (existingItemIndex >= 0) {
        // Copiamos array
        const updatedItems = [...prev];
        // Actualizamos la cantidad
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
