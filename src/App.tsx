import { useState, useMemo } from 'react';
import productsData from '../simba_products.json';
import Header from './components/Header';
import Hero from './components/Hero';
import CategorySidebar from './components/CategorySidebar';
import ProductGrid from './components/ProductGrid';
import LandingPage from './components/LandingPage';
import ContactModal from './components/ContactModal';
import BranchDashboard from './components/BranchDashboard';
import { StoreProvider } from './context/StoreContext';
import { useLanguage } from './context/LanguageContext';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'landing' | 'shop'>('landing');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isBranchDashboardOpen, setIsBranchDashboardOpen] = useState(false);
  const { language, t } = useLanguage();

  // Extract unique categories and their counts
  const { categories, categoryCounts, totalCount } = useMemo(() => {
    const counts: Record<string, number> = {};
    productsData.products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    
    return {
      categories: Object.keys(counts),
      categoryCounts: counts,
      totalCount: productsData.products.length
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return productsData.products.filter(product => {
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
  }, [selectedCategory, searchQuery, language]);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && view !== 'shop') {
      setView('shop');
    }
  };

  const resetToLanding = () => {
    setView('landing');
    setSelectedCategory('All');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <StoreProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header 
          onSearch={handleSearch} 
          onLogoClick={resetToLanding} 
          onOpenBranchDashboard={() => setIsBranchDashboardOpen(true)}
        />
        
        <main>
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
                    className="hover:text-secondary cursor-pointer transition-colors"
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
    </StoreProvider>
  );
}

export default App;
