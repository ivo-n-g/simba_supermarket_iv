import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface CategorySidebarProps {
  categories: string[];
  categoryCounts: Record<string, number>;
  totalCount: number;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'All': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  'Alcoholic Drinks': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  'Baby Products': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'Cleaning & Sanitary': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  'Cosmetics & Personal Care': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'Food Products': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  'General': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  ),
  'Kitchen Storage': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  'Kitchenware & Electronics': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  'Pet Care': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  'Sports & Wellness': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleCategorySelect = (category: string) => {
    onSelectCategory(category);
    setIsOpen(false);
  };

  return (
    <aside className="w-full md:w-72 bg-white dark:bg-gray-900 md:bg-gray-50 dark:md:bg-gray-900 sticky top-[104px] lg:top-16 z-40 md:h-[calc(100vh-64px)] md:overflow-y-auto border-b md:border-r border-gray-100 dark:border-gray-800 shadow-sm md:shadow-none transition-all duration-300">
      {/* Mobile Dropdown Button */}
      <div className="md:hidden p-3 px-4 bg-white dark:bg-gray-900 relative z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 font-bold text-sm transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center gap-2">
            {categoryIcons[selectedCategory] || categoryIcons['All']}
            <span>{selectedCategory === 'All' ? t('allCategories') : t(selectedCategory)}</span>
          </div>
          <svg className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Categories List (Desktop Sidebar / Mobile Dropdown Content) */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block absolute md:static top-full left-0 w-full bg-white dark:bg-gray-900 md:bg-transparent border-b md:border-0 border-gray-100 dark:border-gray-800 md:p-6 shadow-xl md:shadow-none z-50`}>
        <div className="p-2 md:p-0 flex flex-col gap-1 md:gap-1.5">
          <div className="flex items-center gap-2 mb-4 hidden md:flex">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-widest">{t('categories')}</h3>
          </div>

          <button
            onClick={() => handleCategorySelect('All')}
            className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm md:text-base text-left transition-all w-full ${
              selectedCategory === 'All'
                ? 'bg-primary text-white font-bold md:shadow-lg md:shadow-primary/20 md:scale-[1.02]'
                : 'hover:bg-primary/5 dark:hover:bg-primary/20 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`${selectedCategory === 'All' ? 'text-secondary' : 'text-gray-400 group-hover:text-primary dark:group-hover:text-primary'}`}>
                {categoryIcons['All']}
              </span>
              <span>{t('allCategories')}</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              selectedCategory === 'All' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}>
              {totalCount}
            </span>
          </button>

          {categories.sort().map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm md:text-base text-left transition-all w-full ${
                selectedCategory === category
                  ? 'bg-primary text-white font-bold md:shadow-lg md:shadow-primary/20 md:scale-[1.02]'
                  : 'hover:bg-primary/5 dark:hover:bg-primary/20 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${selectedCategory === category ? 'text-secondary' : 'text-gray-400 group-hover:text-primary dark:group-hover:text-primary'}`}>
                  {categoryIcons[category] || categoryIcons['General']}
                </span>
                <span>{t(category)}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                selectedCategory === category ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}>
                {categoryCounts[category] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Mobile Overlay for Dropdown */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 z-40 backdrop-blur-[1px]" 
          style={{ top: '156px' }} 
          onClick={() => setIsOpen(false)}
        />
      )}
    </aside>
  );
};

export default CategorySidebar;
