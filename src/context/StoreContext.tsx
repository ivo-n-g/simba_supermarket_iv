import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface User {
  name: string;
  email: string;
  photoURL?: string;
  password?: string; // For mock local auth
}

interface StoreContextType {
  user: User | null;
  cart: CartItem[];
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string) => Promise<boolean>;
  handleGoogleSuccess: (credentialResponse: any) => void;
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

  // Load session and cart
  useEffect(() => {
    const savedUser = localStorage.getItem('simba_user_session');
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedCart = localStorage.getItem('simba_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('simba_cart', JSON.stringify(cart));
  }, [cart]);

  const login = async (email: string, password?: string): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem('simba_users_db') || '[]');
    const foundUser = users.find(u => u.email === email && (!password || u.password === password));
    if (foundUser) {
      const sessionUser = { ...foundUser };
      delete sessionUser.password;
      setUser(sessionUser);
      localStorage.setItem('simba_user_session', JSON.stringify(sessionUser));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password?: string): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem('simba_users_db') || '[]');
    if (users.find(u => u.email === email)) return false;
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('simba_users_db', JSON.stringify(users));
    const sessionUser = { name, email };
    setUser(sessionUser);
    localStorage.setItem('simba_user_session', JSON.stringify(sessionUser));
    return true;
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    // In a real app, you would send this token to your backend
    // For this prototype, we'll decode the JWT (it's a base64 string)
    const token = credentialResponse.credential;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const googleUser = {
        name: payload.name,
        email: payload.email,
        photoURL: payload.picture
      };
      setUser(googleUser);
      localStorage.setItem('simba_user_session', JSON.stringify(googleUser));
    } catch (e) {
      console.error("Failed to decode Google token", e);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('simba_user_session');
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
    setCart((prevCart) => prevCart.map((item) => item.id === productId ? { ...item, quantity } : item));
  };

  const checkout = async () => {
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
      user, cart, login, signup, handleGoogleSuccess, logout, 
      addToCart, removeFromCart, updateQuantity, checkout, 
      deliveryMethod, setDeliveryMethod, cartCount 
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
