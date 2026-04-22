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
  loginWithGoogle: () => Promise<void>;
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

  // Persistence: Load session and cart on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('simba_user_session');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedCart = localStorage.getItem('simba_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem('simba_cart', JSON.stringify(cart));
  }, [cart]);

  const login = async (email: string, password?: string): Promise<boolean> => {
    // Mock database check
    const users: User[] = JSON.parse(localStorage.getItem('simba_users_db') || '[]');
    const foundUser = users.find(u => u.email === email && (!password || u.password === password));
    
    if (foundUser) {
      const sessionUser = { ...foundUser };
      delete sessionUser.password; // Don't keep password in session
      setUser(sessionUser);
      localStorage.setItem('simba_user_session', JSON.stringify(sessionUser));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password?: string): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem('simba_users_db') || '[]');
    if (users.find(u => u.email === email)) return false; // User exists

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('simba_users_db', JSON.stringify(users));
    
    // Auto login
    const sessionUser = { name, email };
    setUser(sessionUser);
    localStorage.setItem('simba_user_session', JSON.stringify(sessionUser));
    return true;
  };

  const loginWithGoogle = async () => {
    // Simulate real OAuth popup
    return new Promise<void>((resolve) => {
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        'about:blank',
        'Google Login',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (popup) {
        popup.document.write(`
          <div style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
            <svg width="48" height="48" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-3.35 5.08-6.39 6.01l7.62 5.91c4.47-4.12 7.03-10.21 7.03-16.39z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.62-5.91c-2.15 1.45-4.92 2.3-8.27 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
            <h2 style="margin-top: 20px;">Sign in with Google</h2>
            <p style="color: #666;">Mock Authentication in progress...</p>
            <div style="width: 100px; height: 4px; background: #eee; border-radius: 2px; overflow: hidden; margin-top: 20px;">
              <div style="width: 50%; height: 100%; background: #4285F4; animation: move 1s infinite linear;"></div>
            </div>
            <style>
              @keyframes move { from { transform: translateX(-100%); } to { transform: translateX(200%); } }
            </style>
          </div>
        `);

        setTimeout(() => {
          popup.close();
          const googleUser = {
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            photoURL: 'https://lh3.googleusercontent.com/a/default-user'
          };
          setUser(googleUser);
          localStorage.setItem('simba_user_session', JSON.stringify(googleUser));
          resolve();
        }, 2000);
      }
    });
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
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
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
      user, 
      cart, 
      login, 
      signup,
      loginWithGoogle,
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
