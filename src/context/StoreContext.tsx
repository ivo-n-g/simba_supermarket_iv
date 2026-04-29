import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Location {
  name: string;
  lat: number;
  lng: number;
  address: string;
  rating: number;
  reviewCount: number;
}

export const locations: Location[] = [
  { name: 'Simba Supermarket Town', lat: -1.9460, lng: 30.0598, address: 'KN 4 Ave, UTC Building, Town', rating: 4.8, reviewCount: 342 },
  { name: 'Simba Supermarket Gishushu', lat: -1.9515, lng: 30.1035, address: 'KG 622 St, Gishushu', rating: 4.7, reviewCount: 156 },
  { name: 'Simba Supermarket Kigali Heights', lat: -1.9530, lng: 30.0933, address: 'KG 7 Ave, Kigali Heights', rating: 4.9, reviewCount: 184 },
  { name: 'Simba Supermarket Kimironko', lat: -1.9498, lng: 30.1247, address: 'KG 11 Ave, near Kimironko Market', rating: 4.7, reviewCount: 89 },
  { name: 'Simba Supermarket Kicukiro', lat: -1.9732, lng: 30.1035, address: 'KK 15 Rd, Kicukiro Center', rating: 4.6, reviewCount: 124 },
  { name: 'Simba Supermarket Remera', lat: -1.9587, lng: 30.1130, address: 'Amahoro Stadium Area, Remera', rating: 4.7, reviewCount: 198 },
  { name: 'Simba Supermarket Kacyiru', lat: -1.9420, lng: 30.0880, address: 'Near Police HQ, Kacyiru', rating: 4.6, reviewCount: 54 },
  { name: 'Simba Supermarket Nyamirambo', lat: -1.9770, lng: 30.0460, address: 'Near Green Mosque, Nyamirambo', rating: 4.4, reviewCount: 215 },
  { name: 'Simba Supermarket Gikondo', lat: -1.9710, lng: 30.0750, address: 'Magerwa Rd, Gikondo', rating: 4.3, reviewCount: 112 },
  { name: 'Simba Supermarket Kanombe', lat: -1.9680, lng: 30.1380, address: 'Airport Rd, Kanombe', rating: 4.5, reviewCount: 78 },
  { name: 'Simba Supermarket Kinyinya', lat: -1.9160, lng: 30.1110, address: 'Kinyinya Center', rating: 4.2, reviewCount: 43 },
  { name: 'Simba Supermarket Kibagabaga', lat: -1.9280, lng: 30.1160, address: 'Kibagabaga Hospital Rd', rating: 4.8, reviewCount: 92 },
  { name: 'Simba Supermarket Nyanza', lat: -2.0000, lng: 30.0860, address: 'Nyanza Bus Park Area', rating: 4.1, reviewCount: 31 },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  unit: string;
}

interface User {
  name: string;
  email: string;
  photoURL?: string;
  password?: string;
  role: 'customer' | 'representative';
  repRole?: 'manager' | 'staff';
  branch?: string;
}

interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  total: number;
  branch: string;
  pickupTime: string;
  status: 'pending' | 'assigned' | 'ready' | 'completed';
  assignedStaff?: string;
  timestamp: number;
}

interface StoreContextType {
  user: User | null;
  cart: CartItem[];
  wishlist: Product[];
  login: (email: string, password?: string, role?: User['role'], branch?: string, repRole?: User['repRole']) => Promise<boolean>;
  signup: (name: string, email: string, password?: string, role?: User['role'], branch?: string, repRole?: User['repRole']) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  handleGoogleSuccess: (credentialResponse: any) => void;
  logout: () => void;
  addToCart: (product: { id: number; name: string; price: number; image: string; category: string; unit: string }, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  checkout: () => Promise<void>;
  deliveryMethod: 'pickup' | 'delivery';
  setDeliveryMethod: (method: 'pickup' | 'delivery') => void;
  pickupBranch: string;
  setPickupBranch: (branch: string) => void;
  pickupTime: string;
  setPickupTime: (time: string) => void;
  cartCount: number;
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order['status'], staff?: string) => void;
  branchStock: Record<string, Record<number, number>>; // Branch Name -> { Product ID -> Quantity }
  updateStockAmount: (branch: string, productId: number, amount: number) => void;
  isProductInStock: (branch: string, productId: number) => boolean;
  getProductQuantity: (branch: string, productId: number) => number;
  customProducts: Product[];
  addNewProduct: (product: Omit<Product, 'id'>) => void;
  isBranchDashboardOpen: boolean;
  setIsBranchDashboardOpen: (isOpen: boolean) => void;
  locations: Location[];
  closestBranchName: string;
  userLocation: { lat: number; lng: number } | null;
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
}

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [pickupBranch, setPickupBranch] = useState<string>('');
  const [pickupTime, setPickupTime] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>(() => {
    const defaultOrders: Order[] = [
      {
        id: '9b2x1a',
        customerName: 'Kezia Umutoni',
        items: [{ id: 13001, name: 'Lentz Radiant Heater', price: 83600, quantity: 1, image: 'https://res.cloudinary.com/eskalate/image/upload/v1776507692/simba_contest/product_13001.jpg' }],
        total: 83600,
        branch: 'Simba Supermarket Remera',
        pickupTime: 'Today, 5:00 PM',
        status: 'pending',
        timestamp: Date.now() - 3600000
      },
      {
        id: '4m8v3z',
        customerName: 'Jean-Luc Habimana',
        items: [{ id: 13002, name: 'Icecream Scoop', price: 3000, quantity: 2, image: 'https://res.cloudinary.com/eskalate/image/upload/v1776507692/simba_contest/product_13002.jpg' }],
        total: 6000,
        branch: 'Simba Supermarket Town',
        pickupTime: 'Tomorrow, 10:00 AM',
        status: 'ready', // Show one as ready to prove the state
        timestamp: Date.now() - 7200000
      },
      {
        id: '7v9y2k',
        customerName: 'Aline Mugisha',
        items: [{ id: 16001, name: 'Aviation Remote Plane', price: 15500, quantity: 1, image: 'https://res.cloudinary.com/eskalate/image/upload/v1776507693/simba_contest/product_16001.jpg' }],
        total: 15500,
        branch: 'Simba Supermarket Remera',
        pickupTime: 'Tomorrow, 2:00 PM',
        status: 'assigned',
        assignedStaff: 'Staff',
        timestamp: Date.now() - 86400000
      }
    ];

    const savedOrders = localStorage.getItem('simba_orders');
    if (savedOrders) {
      const parsed = JSON.parse(savedOrders);
      // Merge: keep default orders and append saved ones that aren't duplicates
      const merged = [...defaultOrders];
      parsed.forEach((po: Order) => {
        if (!merged.find(do_ => do_.id === po.id)) merged.push(po);
      });
      return merged;
    }
    
    return defaultOrders;
  });
  const [branchStock, setBranchStock] = useState<Record<string, Record<number, number>>>({});
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  const [isBranchDashboardOpen, setIsBranchDashboardOpen] = useState(false);
  const [closestBranchName, setClosestBranchName] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('simba_user_session');
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedCart = localStorage.getItem('simba_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedWishlist = localStorage.getItem('simba_wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    const savedStock = localStorage.getItem('simba_branch_stock');
    if (savedStock) setBranchStock(JSON.parse(savedStock));
    const savedCustom = localStorage.getItem('simba_custom_products');
    if (savedCustom) setCustomProducts(JSON.parse(savedCustom));

    // Geolocation for closest branch
    if (navigator.geolocation) {
      const handlePosition = (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        let closest = locations[0];
        let minDistance = Infinity;

        locations.forEach(loc => {
          const distance = calculateDistance(latitude, longitude, loc.lat, loc.lng);
          if (distance < minDistance) {
            minDistance = distance;
            closest = loc;
          }
        });
        
        setClosestBranchName(closest.name);
        setPickupBranch(prev => {
          if (!prev || prev === '') return closest.name;
          return prev;
        });
      };

      const geoOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      // Get initial position
      navigator.geolocation.getCurrentPosition(handlePosition, (err) => console.error(err), geoOptions);
      
      // Watch for better accuracy refinement
      const watchId = navigator.geolocation.watchPosition(handlePosition, (err) => console.error(err), geoOptions);
      
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('simba_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('simba_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('simba_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('simba_branch_stock', JSON.stringify(branchStock));
  }, [branchStock]);

  useEffect(() => {
    localStorage.setItem('simba_custom_products', JSON.stringify(customProducts));
  }, [customProducts]);

  const addNewProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.floor(Math.random() * 90000) + 10000 // Generate a unique 5-digit ID
    };
    setCustomProducts(prev => [newProduct, ...prev]);
  };

  const updateStockAmount = (branch: string, productId: number, amount: number) => {
    setBranchStock(prev => {
      const currentBranchStock = prev[branch] || {};
      return {
        ...prev,
        [branch]: {
          ...currentBranchStock,
          [productId]: Math.max(0, amount)
        }
      };
    });
  };

  const getProductQuantity = (branch: string, productId: number) => {
    const currentBranchStock = branchStock[branch] || {};
    if (currentBranchStock[productId] !== undefined) {
      return currentBranchStock[productId];
    }
    // Generate a deterministic pseudo-random stock quantity for realism
    const pseudoRandom = (productId * branch.length * 7) % 45;
    return pseudoRandom + 2; // Quantity between 2 and 46
  };

  const isProductInStock = (branch: string, productId: number) => {
    return getProductQuantity(branch, productId) > 0;
  };

  const login = async (email: string, password?: string, role: User['role'] = 'customer', branch?: string, repRole?: User['repRole']): Promise<boolean> => {
    // Initial demo users if DB is empty
    const existingUsers = localStorage.getItem('simba_users_db');
    if (!existingUsers) {
      const demoUsers: User[] = [
        { name: 'Admin', email: 'admin@simba.rw', password: 'password', role: 'representative', repRole: 'manager', branch: 'Simba Supermarket Town' },
        { name: 'Staff', email: 'staff@simba.rw', password: 'password', role: 'representative', repRole: 'staff', branch: 'Simba Supermarket Remera' }
      ];
      localStorage.setItem('simba_users_db', JSON.stringify(demoUsers));
    }

    const users: User[] = JSON.parse(localStorage.getItem('simba_users_db') || '[]');
    const foundUser = users.find(u => u.email === email && (!password || u.password === password) && u.role === role);
    
    if (!foundUser && role === 'representative' && branch) {
      const repUser: User = { name: email.split('@')[0], email, role: 'representative', branch, repRole: repRole || 'staff' };
      setUser(repUser);
      localStorage.setItem('simba_user_session', JSON.stringify(repUser));
      setIsBranchDashboardOpen(true);
      return true;
    }

    if (foundUser) {
      const sessionUser = { ...foundUser };
      delete sessionUser.password;
      if (role === 'representative') {
        if (repRole) sessionUser.repRole = repRole;
        if (branch) sessionUser.branch = branch;
        setIsBranchDashboardOpen(true);
      }
      setUser(sessionUser);
      localStorage.setItem('simba_user_session', JSON.stringify(sessionUser));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password?: string, role: User['role'] = 'customer', branch?: string, repRole?: User['repRole']): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem('simba_users_db') || '[]');
    if (users.find(u => u.email === email && u.role === role)) return false;
    const newUser: User = { name, email, password, role, branch, repRole };
    users.push(newUser);
    localStorage.setItem('simba_users_db', JSON.stringify(users));
    
    // Create session user without password
    const sessionUser = { ...newUser };
    delete sessionUser.password;
    setUser(sessionUser);
    localStorage.setItem('simba_user_session', JSON.stringify(sessionUser));
    return true;
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem('simba_users_db') || '[]');
    return users.some(u => u.email === email);
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    const token = credentialResponse.credential;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const googleUser: User = {
        name: payload.name,
        email: payload.email,
        photoURL: payload.picture,
        role: 'customer'
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

  const addToCart = (product: { id: number; name: string; price: number; image: string; category: string; unit: string }, quantity: number = 1) => {
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

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const isExist = prev.find(p => p.id === product.id);
      if (isExist) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: number) => wishlist.some(p => p.id === productId);

  const checkout = async () => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      customerName: user?.name || 'Guest',
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + (deliveryMethod === 'delivery' ? 2000 : 0),
      branch: pickupBranch || 'Remera',
      pickupTime: pickupTime || 'As soon as possible',
      status: 'pending',
      timestamp: Date.now()
    };

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Decrease stock per branch
        cart.forEach(item => {
          const currentQty = getProductQuantity(newOrder.branch, item.id);
          updateStockAmount(newOrder.branch, item.id, Math.max(0, currentQty - item.quantity));
        });

        setOrders(prev => [newOrder, ...prev]);
        setCart([]);
        resolve();
      }, 1500);
    });
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], staff?: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status, assignedStaff: staff || order.assignedStaff } 
        : order
    ));
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <StoreContext.Provider value={{ 
      user, cart, wishlist, login, signup, forgotPassword, handleGoogleSuccess, logout, 
      addToCart, removeFromCart, updateQuantity, toggleWishlist, isInWishlist, checkout, 
      deliveryMethod, setDeliveryMethod, pickupBranch, setPickupBranch, 
      pickupTime, setPickupTime, cartCount, orders, updateOrderStatus,
      branchStock, updateStockAmount, isProductInStock, getProductQuantity,
      customProducts, addNewProduct, isBranchDashboardOpen, setIsBranchDashboardOpen, locations,
      closestBranchName, userLocation, calculateDistance
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
