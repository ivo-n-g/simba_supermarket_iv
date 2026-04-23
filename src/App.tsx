import { useState, useMemo } from 'react';
import productsData from '../simba_products.json';
import Header from './components/Header';
import Hero from './components/Hero';
import CategorySidebar from './components/CategorySidebar';
import ProductGrid from './components/ProductGrid';
import { StoreProvider } from './context/StoreContext';
import { useLanguage } from './context/LanguageContext';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
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

  return (
    <StoreProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header onSearch={setSearchQuery} />
        
        <main>
          <Hero />
          
          <div className="container mx-auto flex flex-col min-h-screen">
            <CategorySidebar 
              categories={categories}
              categoryCounts={categoryCounts}
              totalCount={totalCount}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            
            <div className="bg-white dark:bg-gray-800/50 shadow-sm md:rounded-[32px] md:mb-12 overflow-hidden">
              <ProductGrid 
                products={filteredProducts}
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </main>
        
        <footer className="bg-primary text-white py-12 transition-colors duration-300">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-black text-secondary mb-8">Simba {t('supermarket')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-left">
              <div>
                <h4 className="font-black mb-4 uppercase text-xs tracking-widest opacity-50">Discover</h4>
                <ul className="space-y-2 text-sm font-bold">
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Contact</li>
                </ul>
              </div>
              <div>
                <h4 className="font-black mb-4 uppercase text-xs tracking-widest opacity-50">Help</h4>
                <ul className="space-y-2 text-sm font-bold">
                  <li>FAQ</li>
                  <li>Privacy Policy</li>
                  <li>Terms</li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">© 2025 Simba {t('supermarket')}. All rights reserved.</p>
              <p className="text-gray-400 text-sm">{productsData.store.location}</p>
            </div>
          </div>
        </footer>
      </div>
    </StoreProvider>
  );
}

export default App;
