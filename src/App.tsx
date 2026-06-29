import { useState, useMemo, useEffect } from 'react';
import productsData from '../simba_products.json';
import Header from './components/Header';
import Hero from './components/Hero';
import CategorySidebar from './components/CategorySidebar';
import ProductGrid from './components/ProductGrid';
import ProductDetail from './components/ProductDetail';
import LandingPage from './components/LandingPage';
import BranchesPage from './components/BranchesPage';
import AboutPage from './components/AboutPage';
import ContactModal from './components/ContactModal';
import InfoModal from './components/InfoModal';
import BranchDashboard from './components/BranchDashboard';
import ChatAssistant from './components/ChatAssistant';
import { GroqResponse } from './services/GroqService';
import { StoreProvider, useStore } from './context/StoreContext';
import { useLanguage } from './context/LanguageContext';

function AddProductModal() {
  const { isAddProductModalOpen, setIsAddProductModalOpen, addNewProduct } = useStore();
  const { t } = useLanguage();
  const [newProductName, setNewProductName] = useState('');
  const [newProductID, setNewProductID] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Food Products');
  const [newProductUnit, setNewProductUnit] = useState('Pcs');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductImage, setNewProductImage] = useState('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;
    addNewProduct({ 
      id: newProductID ? parseInt(newProductID) : undefined,
      name: newProductName, 
      price: parseInt(newProductPrice), 
      image: newProductImage, 
      category: newProductCategory, 
      unit: newProductUnit 
    });
    setNewProductName(''); 
    setNewProductID('');
    setNewProductPrice(''); 
    setIsAddProductModalOpen(false);
  };

  if (!isAddProductModalOpen) return null;

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-4 md:p-6 bg-gray-900/60 backdrop-blur-md">
      <div className="bg-white dark:bg-gray-900 rounded-[32px] md:rounded-[48px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
        <div className="p-6 md:p-12">
          <div className="flex justify-between items-center mb-8 md:mb-12">
            <h2 className="text-xl lg:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{t('addNewProduct')}</h2>
            <button 
             
              onClick={() => setIsAddProductModalOpen(false)} 
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form onSubmit={handleAddProduct} className="space-y-8 lg:space-y-10">
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">{t('productTitle')}</label>
              <input 
                type="text" 
                required 
               
                value={newProductName} 
                onChange={(e) => setNewProductName(e.target.value)} 
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none outline-none font-black text-base lg:text-lg dark:text-white focus:ring-4 focus:ring-primary/5 transition-all" 
                placeholder="e.g. Organic Avocados" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block ml-1">{t('category')}</label>
                <select 
                 
                  value={newProductCategory} 
                  onChange={(e) => setNewProductCategory(e.target.value)} 
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-black text-[10px] lg:text-xs dark:text-white border-none outline-none focus:ring-4 focus:ring-primary/5"
                >
                  {['Food Products', 'Baby Products', 'Cleaning & Sanitary', 'Cosmetics & Personal Care'].map(c => <option key={c} value={c}>{t(c)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block ml-1">{t('unitType')}</label>
                <input 
                  type="text" 
                  required 
                 
                  value={newProductUnit} 
                  onChange={(e) => setNewProductUnit(e.target.value)} 
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-black text-[10px] lg:text-xs dark:text-white border-none outline-none focus:ring-4 focus:ring-primary/5" 
                  placeholder="Pcs / Kg"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block ml-1">{t('sku')}</label>
                <input 
                  type="number" 
                  required 
                 
                  value={newProductID} 
                  onChange={(e) => setNewProductID(e.target.value)} 
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-black text-[10px] lg:text-xs dark:text-white border-none outline-none focus:ring-4 focus:ring-primary/5" 
                  placeholder="e.g. 12345"
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block ml-1">{t('unitPrice')}</label>
                <input 
                  type="number" 
                  required 
                 
                  value={newProductPrice} 
                  onChange={(e) => setNewProductPrice(e.target.value)} 
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-black text-[10px] lg:text-xs dark:text-white border-none outline-none focus:ring-4 focus:ring-primary/5" 
                  placeholder="e.g. 5000"
                />
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 lg:p-8 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center">
                <div className="flex flex-col items-center gap-4 lg:gap-6">
                    <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center p-3 shadow-lg">
                        {newProductImage ? <img src={newProductImage} alt="Preview" className="w-full h-full object-contain" /> : <span className="text-2xl grayscale opacity-20">🖼️</span>}
                    </div>
                    <label className="cursor-pointer">
                        <span className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline">{t('uploadIdentity')}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                </div>
            </div>
            <button 
              type="button"
              onClick={handleAddProduct}
             
              className="w-full bg-primary text-white py-5 lg:py-6 rounded-2xl font-black uppercase text-[10px] lg:text-xs tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              {t('syncCatalog')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const store = useStore();
  const { user, customProducts, isBranchDashboardOpen, setIsBranchDashboardOpen, pickupBranch, isProductInStock } = store;
  
  // Expose store for the internal portal button
  useEffect(() => {
    (window as any).simbaStore = store;
  }, [store]);
  // Initialize state from localStorage for persistence
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return localStorage.getItem('simba_selected_category') || 'All';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(() => {
    const saved = localStorage.getItem('simba_selected_product_id');
    return saved ? parseInt(saved) : null;
  });
  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [aiResponse, setAiResponse] = useState<GroqResponse | null>(null);
  const [view, setView] = useState<'landing' | 'shop' | 'details' | 'checkout' | 'branches' | 'about'>(() => {
    return (localStorage.getItem('simba_current_view') as any) || 'landing';
  });
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [infoModal, setInfoModal] = useState<{ isOpen: boolean; title: string; content: string }>({
    isOpen: false,
    title: '',
    content: ''
  });
  const { language, t } = useLanguage();

  // Persist states to localStorage
  useEffect(() => {
    localStorage.setItem('simba_current_view', view);
    localStorage.setItem('simba_selected_category', selectedCategory);
    if (selectedProductId) {
      localStorage.setItem('simba_selected_product_id', selectedProductId.toString());
    } else {
      localStorage.removeItem('simba_selected_product_id');
    }
  }, [view, selectedCategory, selectedProductId]);

  useEffect(() => {
    if (window.location.pathname === '/dashboard') {
      setIsBranchDashboardOpen(true);
    }
    if (window.location.pathname === '/checkout') {
      setView('checkout');
    }
  }, [setIsBranchDashboardOpen]);

  const allProducts = useMemo(() => {
    return [...customProducts, ...productsData.products];
  }, [customProducts]);

  // Extract unique categories and their counts
  const { categories, categoryCounts, totalCount } = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    
    return {
      categories: Object.keys(counts),
      categoryCounts: counts,
      totalCount: allProducts.length
    };
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let products = allProducts;

    if (aiResponse) {
      if (aiResponse.productIds.length > 0) {
        products = allProducts.filter(p => aiResponse.productIds.includes(p.id));
      } else {
        return [];
      }
    }

    const query = searchQuery.toLowerCase();
    const currentBranch = pickupBranch || 'Simba Supermarket Remera';

    return products.filter(product => {
      const p = product as any;
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      
      const inStock = isProductInStock(currentBranch, product.id);
      const matchesStock = !onlyInStock || inStock;

      const searchableText = [
        p.name,
        p.name_en,
        p.name_rw,
        p.name_fr,
        p.category,
        p.category_en,
        p.category_rw,
        p.category_fr,
      ].filter(Boolean).join(' ').toLowerCase();

      const matchesSearch = searchableText.includes(query);
      return matchesCategory && matchesSearch && matchesPrice && matchesStock;
    });
  }, [selectedCategory, searchQuery, language, aiResponse, minPrice, maxPrice, allProducts, onlyInStock, pickupBranch, isProductInStock]);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setView('shop');
    setSelectedProductId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (id: number) => {
    setSelectedProductId(id);
    setView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setAiResponse(null);
    setSearchQuery(query);
    setSelectedProductId(null);
    if (query.trim() && (view === 'landing' || view === 'details')) {
      setView('shop');
    }
  };

  const handleAiSearch = (response: GroqResponse) => {
    setAiResponse(response);
    setSearchQuery('');
    setSelectedProductId(null);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetToLanding = () => {
    setView('landing');
    setSelectedCategory('All');
    setSearchQuery('');
    setAiResponse(null);
    setSelectedProductId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Representative-only view
  if (user?.role === 'representative') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <BranchDashboard isOpen={true} onClose={() => {}} hideClose={true} />
        <AddProductModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header 
        onSearch={handleSearch} 
        onLogoClick={resetToLanding} 
        onOpenBranchDashboard={() => setIsBranchDashboardOpen(true)}
        onAiSearch={handleAiSearch}
        onNavigate={(v) => setView(v as any)}
      />
      
      <main key={view + searchQuery + (aiResponse ? 'ai' : '') + selectedProductId} className="animate-fade-in-up">
        {view === 'landing' ? (
          <>
            <Hero />
            <LandingPage 
              categories={categories} 
              onSelectCategory={handleSelectCategory} 
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              onlyInStock={onlyInStock}
              setOnlyInStock={setOnlyInStock}
            />
          </>
        ) : view === 'details' && selectedProductId ? (
          <ProductDetail 
            productId={selectedProductId} 
            onBack={() => setView('shop')} 
          />
        ) : view === 'checkout' ? (
          <div className="container mx-auto max-w-4xl py-12 md:py-24 px-6">
             <div className="bg-white dark:bg-gray-800 rounded-[48px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="bg-primary p-12 text-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-white/5 opacity-10 blur-3xl rounded-full translate-y-1/2"></div>
                   <h1 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter relative z-10">{t('checkout')}</h1>
                   <p className="text-white/60 font-bold uppercase tracking-widest mt-4 relative z-10">{t('secureTransaction') || 'Secure Enterprise Transaction'}</p>
                </div>
                <div className="p-4 md:p-8">
                   <div className="bg-gray-50 dark:bg-gray-900/50 rounded-[32px] p-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-800">
                      <p className="text-gray-500 font-bold mb-4">{t('checkoutPageIntegrated') || 'The dedicated checkout experience is integrated into our high-performance slide-out module for speed.'}</p>
                      <button 
                        onClick={() => {
                          (window as any).simbaStore.addToCart(allProducts[0], 1);
                          // Open the cart drawer
                          const cartBtn = document.querySelector('#cart-button') as HTMLButtonElement;
                          cartBtn?.click();
                        }}
                        className="px-12 py-5 bg-primary text-white rounded-[32px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"
                      >
                        {t('openCheckoutInterface') || 'Open Checkout Interface'} →
                      </button>
                   </div>
                </div>
             </div>
          </div>
        ) : view === 'branches' ? (
          <BranchesPage />
        ) : view === 'about' ? (
          <AboutPage />
        ) : (
          <div className="container mx-auto flex flex-col md:flex-row min-h-screen">
            <CategorySidebar 
              categories={categories}
              categoryCounts={categoryCounts}
              totalCount={totalCount}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              onlyInStock={onlyInStock}
              setOnlyInStock={setOnlyInStock}
            />
            
            <div className="flex-1 bg-white dark:bg-gray-800/50 shadow-sm md:rounded-[32px] md:my-8 overflow-hidden">
              <div className="px-8 pt-8 pb-4 border-b border-gray-50 dark:border-gray-800 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">{t('shopping')}</p>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                    {selectedCategory === 'All' ? t('allCategories') : (language === 'rw' ? ((allProducts.find(p => p.category === selectedCategory) as any)?.[`category_rw`] || selectedCategory) : t(selectedCategory))}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-primary leading-none">{filteredProducts.length}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t('productsFound')}</p>
                </div>
              </div>

              {searchQuery && !aiResponse && (
                <div className="px-8 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-bold text-gray-500">
                    {t('searchResults')}: <span className="text-primary font-black">"{searchQuery}"</span>
                  </p>
                </div>
              )}
              {aiResponse && (                <div className="p-6 md:p-8 bg-secondary/10 border-b border-secondary/20 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-secondary text-primary rounded-2xl flex items-center justify-center text-xl shadow-lg shrink-0">✨</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-black text-primary uppercase text-xs tracking-widest">{t('aiAssistant')}</h3>
                        <button 
                          onClick={() => setAiResponse(null)}
                          className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                        >
                          {t('clearResults')}
                        </button>
                      </div>
                      <p className="text-gray-800 dark:text-white font-bold leading-relaxed">
                        {aiResponse.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <ProductGrid 
                products={filteredProducts}
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                onProductClick={handleProductClick}
              />
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-primary text-white py-16 transition-colors duration-300">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-12">
            <div 
              onClick={resetToLanding}
              className="bg-white/10 backdrop-blur-sm p-3 md:p-4 rounded-[32px] border border-white/10 shadow-2xl hover:bg-white/20 transition-all cursor-pointer group"
            >
              <img 
                src="/logo.png" 
                alt="Simba Supermarket" 
                className="h-12 md:h-16 w-auto object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 mb-16 text-left">
            <div>
              <h4 className="font-black mb-6 uppercase text-xs tracking-[0.3em] opacity-40">{t('discover')}</h4>
              <ul className="space-y-3 text-sm font-bold">
                <li 
                  className="hover:text-secondary cursor-pointer transition-colors"
                  onClick={() => setView('about')}
                >
                  {t('aboutUs')}
                </li>
                <li 
                  className="hover:text-secondary cursor-pointer transition-colors"
                  onClick={() => setView('branches')}
                >
                  {t('branches') || 'Our Branches'}
                </li>
                <li 
                  className="hover:text-secondary cursor-pointer transition-colors"
                  onClick={() => setInfoModal({ isOpen: true, title: t('careers'), content: t('careersContent') })}
                >
                  {t('careers')}
                </li>
                <li 
                  className="hover:text-secondary cursor-pointer transition-colors font-bold"
                  onClick={() => setIsContactOpen(true)}
                >
                  {t('contactUs')}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-6 uppercase text-xs tracking-[0.3em] opacity-40">{t('help')}</h4>
              <ul className="space-y-3 text-sm font-bold">
                <li 
                  className="hover:text-secondary cursor-pointer transition-colors"
                  onClick={() => setInfoModal({ isOpen: true, title: t('faq'), content: t('faqContent') })}
                >
                  {t('faq')}
                </li>
                <li 
                  className="hover:text-secondary cursor-pointer transition-colors"
                  onClick={() => setInfoModal({ isOpen: true, title: t('privacyPolicy'), content: t('privacyPolicyContent') })}
                >
                  {t('privacyPolicy')}
                </li>
                <li 
                  className="hover:text-secondary cursor-pointer transition-colors"
                  onClick={() => setInfoModal({ isOpen: true, title: t('terms'), content: t('termsContent') })}
                >
                  {t('terms')}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-6 uppercase text-xs tracking-[0.3em] opacity-40">{t('internal')}</h4>
              <button 
               
                className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl border border-white/10 transition-all font-black uppercase text-[10px] tracking-widest text-secondary"
                onClick={() => {
                  if ((window as any).simbaHeader?.openLoginModal) {
                    (window as any).simbaHeader.openLoginModal('representative');
                  } else {
                    alert("Please log in using the profile icon in the header.");
                  }
                }}
              >
                {t('marketRepPortal')} →
              </button>
            </div>
          </div>
          <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <p className="text-gray-400 text-sm font-medium">© 2025 Simba {t('supermarket')}. {t('allRightsReserved')}</p>
            <p className="text-gray-400 text-sm font-medium">{productsData.store.location}</p>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <InfoModal 
        isOpen={infoModal.isOpen} 
        onClose={() => setInfoModal({ ...infoModal, isOpen: false })}
        title={infoModal.title}
        content={infoModal.content}
      />
      <BranchDashboard isOpen={isBranchDashboardOpen} onClose={() => setIsBranchDashboardOpen(false)} />
      <AddProductModal />
      <ChatAssistant />
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
