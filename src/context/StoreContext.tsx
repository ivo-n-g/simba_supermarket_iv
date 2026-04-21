import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface User {
  name: string;
  email?: string;
  photoURL?: string;
}

interface StoreContextType {
  user: User | null;
  cart: CartItem[];
  login: (name: string, email?: string, photoURL?: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
  addToCart: (product: { id: number; name: string; price: number; image: string }, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  checkout: () => Promise<void>;
  deliveryMethod: 'pickup' | 'delivery';
  setDeliveryMethod: (method: 'pickup' | 'delivery') => void;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');

  const login = (name: string, email?: string, photoURL?: string) => {
    setUser({ name, email, photoURL });
  };

  const signup = (name: string, email: string) => {
    setUser({ name, email });
  };

  const logout = () => {
    setUser(null);
  };

  const addToCart = (product: { id: number; name: string; price: number; image: string }, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const checkout = async () => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setCart([]);
        resolve();
      }, 1000);
    });
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <StoreContext.Provider value={{ 
      user, 
      cart, 
      login, 
      signup,
      logout, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      checkout, 
      deliveryMethod,
      setDeliveryMethod,
      cartCount 
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
