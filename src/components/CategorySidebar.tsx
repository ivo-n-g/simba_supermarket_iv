import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import productsData from '../../simba_products.json';
import PriceRangeSlider from './PriceRangeSlider';

interface CategorySidebarProps {
  categories: string[];
  categoryCounts: Record<string, number>;
  totalCount: number;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  minPrice: number;
  maxPrice: number;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  onlyInStock: boolean;
  setOnlyInStock: (val: boolean) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'All': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  'Alcoholic Drinks': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  'Baby Products': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'Cleaning & Sanitary': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  'Cosmetics & Personal Care': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'Food Products': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  'General': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  ),
  'Kitchen Storage': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  'Kitchenware & Electronics': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  'Pet Care': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  'Sports & Wellness': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
};

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  categoryCounts,
  totalCount,
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  onlyInStock,
  setOnlyInStock
}) => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const getCategoryName = (category: string) => {
    if (category === 'All') return t('allCategories');
    const product = productsData.products.find(p => p.category === category) as any;
    if (product) {
      return product[`category_${language}`] || category;
    }
    return t(category);
  };

  const handleCategorySelect = (category: string) => {
    onSelectCategory(category);
    setIsOpen(false);
  };

  return (
    <aside className="w-full md:w-80 bg-transparent md:bg-gray-50 dark:md:bg-gray-900 sticky top-20 z-40 md:h-[calc(100vh-80px)] md:overflow-y-auto border-b md:border-r border-gray-200 dark:border-gray-800 transition-all duration-300">
      {/* Mobile Dropdown Button */}
      <div className="md:hidden p-4 bg-white dark:bg-gray-900 relative z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 font-black text-sm"
        >
          <div className="flex items-center gap-3">
            <div className="text-secondary">{categoryIcons[selectedCategory] || categoryIcons['All']}</div>
            <span>{getCategoryName(selectedCategory)}</span>
          </div>
          <svg className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Categories Grid (Desktop) */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block absolute md:static top-full left-0 w-full bg-white dark:bg-gray-900 md:bg-transparent border-b md:border-0 border-gray-100 dark:border-gray-800 md:p-8 shadow-2xl md:shadow-none z-50`}>
        <div className="p-4 md:p-0 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-6 hidden md:flex">
            <h3 className="text-sm font-black text-primary dark:text-secondary uppercase tracking-[0.2em]">{t('categories')}</h3>
          </div>

          <button
            data-testid="category-filter-all"
            onClick={() => handleCategorySelect('All')}
            className={`group flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-black transition-all w-full border-2 ${
              selectedCategory === 'All'
                ? 'bg-white dark:bg-gray-800 border-primary dark:border-secondary text-primary dark:text-secondary shadow-lg scale-[1.02]'
                : 'bg-transparent border-transparent text-gray-500 hover:bg-primary/5 hover:text-primary dark:hover:text-secondary'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`${selectedCategory === 'All' ? 'text-primary dark:text-secondary' : 'text-gray-300 group-hover:text-primary'}`}>
                {categoryIcons['All']}
              </div>
              <span>{t('allCategories')}</span>
            </div>
            <span className={`text-[10px] px-2 py-1 rounded-lg font-black ${
              selectedCategory === 'All' ? 'bg-primary dark:bg-secondary text-white dark:text-primary' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
            }`}>
              {totalCount}
            </span>
          </button>

          {categories.sort().map((category) => (
            <button
              key={category}
              data-testid={`category-filter-${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
              onClick={() => handleCategorySelect(category)}
              className={`group flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-black transition-all w-full border-2 ${
                selectedCategory === category
                  ? 'bg-white dark:bg-gray-800 border-primary dark:border-secondary text-primary dark:text-secondary shadow-lg scale-[1.02]'
                  : 'bg-transparent border-transparent text-gray-500 hover:bg-primary/5 hover:text-primary dark:hover:text-secondary'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`${selectedCategory === category ? 'text-primary dark:text-secondary' : 'text-gray-300 group-hover:text-primary'}`}>
                  {categoryIcons[category] || categoryIcons['General']}
                </div>
                <span>{getCategoryName(category)}</span>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-lg font-black ${
                selectedCategory === category ? 'bg-primary dark:bg-secondary text-white dark:text-primary' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
              }`}>
                {categoryCounts[category] || 0}
              </span>
            </button>
          ))}

          {/* Price Range Filter */}
          <div className="mt-10 pt-10 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-primary dark:text-secondary uppercase tracking-[0.2em]">{t('filters')}</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('onlyInStock')}</span>
                <button 
                  data-testid="in-stock-toggle"
                  onClick={() => setOnlyInStock(!onlyInStock)}
                  className={`w-10 h-5 rounded-full relative transition-all duration-300 ${onlyInStock ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${onlyInStock ? 'left-6' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
            
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{t('priceRange')}</h4>
            
            <div className="space-y-8 px-2">
              <PriceRangeSlider 
                min={100}
                max={500000}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onMinChange={setMinPrice}
                onMaxChange={setMaxPrice}
              />
              
              <div className="grid grid-cols-2 gap-2">
                {[5000, 10000, 50000, 100000].map(p => (
                  <button 
                    key={p}
                    onClick={() => setMaxPrice(p)}
                    className="py-2 rounded-xl border border-gray-100 dark:border-gray-800 text-[10px] font-black text-gray-400 hover:border-primary hover:text-primary transition-all uppercase tracking-widest"
                  >
                    Under {p.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-primary/10 z-40 backdrop-blur-sm" 
          style={{ top: '168px' }} 
          onClick={() => setIsOpen(false)}
        />
      )}
    </aside>
  );
};

export default CategorySidebar;
