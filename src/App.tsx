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
  const { user, logout, customProducts } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<GroqResponse | null>(null);
  const [view, setView] = useState<'landing' | 'shop'>('landing');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isBranchDashboardOpen, setIsBranchDashboardOpen] = useState(false);
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
    if (aiResponse) {
      if (aiResponse.productIds.length > 0) {
        return allProducts.filter(p => aiResponse.productIds.includes(p.id));
      }
      return [];
    }

    const query = searchQuery.toLowerCase();
    return allProducts.filter(product => {
      const p = product as any;
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      
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
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, language, aiResponse]);

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <header className="bg-primary p-4 flex justify-between items-center shadow-2xl h-20 shrink-0 border-b border-white/5 px-4 md:px-12">
          <img src="/logo.png" alt="Simba" className="h-10 md:h-12 w-auto" />
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-white text-sm font-black uppercase tracking-widest">{user.name}</p>
              <p className="text-secondary text-[11px] font-bold uppercase tracking-wider">{user.branch}</p>
            </div>
            <button 
              onClick={() => { if(window.confirm(t('logoutConfirm'))) logout(); }}
              className="text-white font-black text-xs uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-6 py-3 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 relative overflow-hidden flex items-center justify-center p-4 md:p-8">
           <div className="w-full max-w-6xl h-full bg-white dark:bg-gray-900 rounded-[48px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden border-8 border-white/10">
              <BranchDashboard isOpen={true} onClose={() => {}} hideClose={true} />
           </div>
        </main>
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
            />
            
            <div className="flex-1 bg-white dark:bg-gray-800/50 shadow-sm md:rounded-[32px] md:my-8 overflow-hidden">
              {aiResponse && (
                <div className="p-6 md:p-8 bg-secondary/10 border-b border-secondary/20 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-secondary text-primary rounded-2xl flex items-center justify-center text-xl shadow-lg shrink-0">✨</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-black text-primary uppercase text-xs tracking-widest">AI Assistant</h3>
                        <button 
                          onClick={() => setAiResponse(null)}
                          className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                        >
                          Clear Results
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
            <img 
              src="/logo.png" 
              alt="Simba Supermarket" 
              className="h-16 md:h-20 w-auto cursor-pointer object-contain"
              onClick={resetToLanding}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 text-left">
            <div>
              <h4 className="font-black mb-6 uppercase text-xs tracking-[0.3em] opacity-40">Discover</h4>
              <ul className="space-y-3 text-sm font-bold">
                <li className="hover:text-secondary cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-secondary cursor-pointer transition-colors">Careers</li>
                <li 
                  className="hover:text-secondary cursor-pointer transition-colors font-bold"
                  onClick={() => setIsContactOpen(true)}
                >
                  {t('contactUs')}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-6 uppercase text-xs tracking-[0.3em] opacity-40">Help</h4>
              <ul className="space-y-3 text-sm font-bold">
                <li className="hover:text-secondary cursor-pointer transition-colors">FAQ</li>
                <li className="hover:text-secondary cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-secondary cursor-pointer transition-colors">Terms</li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-sm font-medium">© 2025 Simba {t('supermarket')}. All rights reserved.</p>
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
