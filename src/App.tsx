import { useState, useMemo } from 'react';
import productsData from '../simba_products.json';
import Header from './components/Header';
import Hero from './components/Hero';
import CategorySidebar from './components/CategorySidebar';
import ProductGrid from './components/ProductGrid';
import { StoreProvider } from './context/StoreContext';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      
      const p = product as any;
      const searchableText = [
        p.name,
        p.name_en,
        p.name_rw,
        p.name_fr,
        p.category,
        // Also could add translated categories here if needed
      ].filter(Boolean).join(' ').toLowerCase();

      const matchesSearch = searchableText.includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <StoreProvider>
      <div className="min-h-screen bg-white">
        <Header onSearch={setSearchQuery} />
        
        <main>
          <Hero tagline={productsData.store.tagline} />
          
          <div className="container mx-auto flex flex-col md:flex-row min-h-screen">
            <CategorySidebar 
              categories={categories}
              categoryCounts={categoryCounts}
              totalCount={totalCount}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            
            <ProductGrid 
              products={filteredProducts}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
            />
          </div>
        </main>
        
        <footer className="bg-primary text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>© 2025 {productsData.store.name}. All rights reserved.</p>
            <p className="text-gray-300 text-sm mt-2">{productsData.store.location}</p>
          </div>
        </footer>
      </div>
    </StoreProvider>
  );
}

export default App;
