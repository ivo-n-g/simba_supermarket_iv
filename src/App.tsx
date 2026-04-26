import { useState, useMemo } from 'react';
import productsData from '../simba_products.json';
import Header from './components/Header';
import Hero from './components/Hero';
import CategorySidebar from './components/CategorySidebar';
import ProductGrid from './components/ProductGrid';
import LandingPage from './components/LandingPage';
import ContactModal from './components/ContactModal';
import BranchDashboard from './components/BranchDashboard';
import { GroqResponse } from './services/GroqService';
import { StoreProvider, useStore } from './context/StoreContext';
import { useLanguage } from './context/LanguageContext';

function AppContent() {
  const { user, customProducts, isBranchDashboardOpen, setIsBranchDashboardOpen } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [aiResponse, setAiResponse] = useState<GroqResponse | null>(null);
  const [view, setView] = useState<'landing' | 'shop'>('landing');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { language, t } = useLanguage();

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
    return products.filter(product => {
      const p = product as any;
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      
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
      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [selectedCategory, searchQuery, language, aiResponse, minPrice, maxPrice, allProducts]);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setAiResponse(null);
    setSearchQuery(query);
    if (query.trim() && view !== 'shop') {
      setView('shop');
    }
  };

  const handleAiSearch = (response: GroqResponse) => {
    setAiResponse(response);
    setSearchQuery('');
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetToLanding = () => {
    setView('landing');
    setSelectedCategory('All');
    setSearchQuery('');
    setAiResponse(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Representative-only view
  if (user?.role === 'representative') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <BranchDashboard isOpen={true} onClose={() => {}} hideClose={true} />
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
      />
      
      <main key={view + searchQuery + (aiResponse ? 'ai' : '')} className="animate-fade-in-up">
        {view === 'landing' ? (
          <>
            <Hero />
            <LandingPage 
              categories={categories} 
              onSelectCategory={handleSelectCategory} 
            />
          </>
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
            />
            
            <div className="flex-1 bg-white dark:bg-gray-800/50 shadow-sm md:rounded-[32px] md:my-8 overflow-hidden">
              {aiResponse && (
                <div className="p-6 md:p-8 bg-secondary/10 border-b border-secondary/20 animate-in fade-in slide-in-from-top-4 duration-500">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 text-left">
            <div>
              <h4 className="font-black mb-6 uppercase text-xs tracking-[0.3em] opacity-40">{t('discover')}</h4>
              <ul className="space-y-3 text-sm font-bold">
                <li className="hover:text-secondary cursor-pointer transition-colors">{t('aboutUs')}</li>
                <li className="hover:text-secondary cursor-pointer transition-colors">{t('careers')}</li>
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
                <li className="hover:text-secondary cursor-pointer transition-colors">{t('faq')}</li>
                <li className="hover:text-secondary cursor-pointer transition-colors">{t('privacyPolicy')}</li>
                <li className="hover:text-secondary cursor-pointer transition-colors">{t('terms')}</li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-sm font-medium">© 2025 Simba {t('supermarket')}. {t('allRightsReserved')}</p>
            <div className="flex gap-6">
              <span className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-all cursor-pointer">IG</span>
              <span className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-all cursor-pointer">FB</span>
              <span className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-all cursor-pointer">TW</span>
            </div>
            <p className="text-gray-400 text-sm font-medium">{productsData.store.location}</p>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <BranchDashboard isOpen={isBranchDashboardOpen} onClose={() => setIsBranchDashboardOpen(false)} />
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
