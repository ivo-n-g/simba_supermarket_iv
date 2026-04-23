import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import productsData from '../../simba_products.json';
import LoginModal from './LoginModal';
import CartDrawer from './CartDrawer';
import ProfileDashboard from './ProfileDashboard';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const { user, cartCount } = useStore();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('simba_search_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideDesktop = desktopSearchRef.current && !desktopSearchRef.current.contains(event.target as Node);
      const isOutsideMobile = mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node);
      if (isOutsideDesktop && isOutsideMobile) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addToHistory = (query: string) => {
    if (!query.trim()) return;
    const newHistory = [query, ...history.filter(h => h !== query)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('simba_search_history', JSON.stringify(newHistory));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch(value);
    setShowSuggestions(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
    addToHistory(inputValue);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (query: string) => {
    setInputValue(query);
    onSearch(query);
    addToHistory(query);
    setShowSuggestions(false);
  };

  const handleAuthClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      setIsProfileOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const suggestions = React.useMemo(() => {
    if (!inputValue.trim()) return [];
    const query = inputValue.toLowerCase();
    const results = productsData.products
      .filter(p => {
        const name = (p as any)[`name_${language}`] || p.name;
        return name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
      })
      .map(p => (p as any)[`name_${language}`] || p.name)
      .slice(0, 6);
    return Array.from(new Set(results));
  }, [inputValue, language]);

  return (
    <>
      <header className="sticky top-0 z-[100] bg-primary text-white shadow-lg transition-all duration-300">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">
          {/* Logo & Search */}
          <div className="flex items-center gap-4 md:gap-12 flex-1">
            <h1 className="text-3xl font-black text-secondary tracking-tighter cursor-pointer hover:opacity-90 transition-opacity">
              Simba
            </h1>
            
            {/* Desktop Search Bar */}
            <div className="hidden md:block relative flex-1 max-w-xl" ref={desktopSearchRef}>
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={inputValue}
                  onChange={handleSearch}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full h-12 py-2 px-12 rounded-2xl text-gray-800 dark:text-white bg-white/10 backdrop-blur-md border border-white/20 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-4 focus:ring-secondary/20 transition-all text-sm placeholder:text-gray-300"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </form>

              {/* Suggestions Dropdown */}
              {showSuggestions && (inputValue || history.length > 0) && (
                <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 mt-2 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-[60] text-gray-800 dark:text-gray-200">
                  {inputValue && suggestions.length > 0 && (
                    <div className="py-2">
                      {suggestions.map((s, i) => (
                        <button key={i} onClick={() => handleSuggestionClick(s)} className="w-full text-left px-6 py-3 hover:bg-primary/5 dark:hover:bg-primary/20 flex items-center gap-3 transition-colors font-medium">
                          <span className="text-sm line-clamp-1">{s}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {history.length > 0 && !inputValue && (
                    <div className="py-3">
                      <div className="px-6 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t('recentSearches')}</div>
                      {history.map((h, i) => (
                        <button key={i} onClick={() => handleSuggestionClick(h)} className="w-full text-left px-6 py-3 hover:bg-primary/5 dark:hover:bg-primary/20 flex items-center gap-3 transition-colors">
                          <svg className="w-4 h-4 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{h}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all hover:rotate-12">
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 18v1m9-9h1M3 9h1m12.728-4.272l.707.707M6.343 17.657l.707.707M17.657 17.657l-.707.707M4.272 6.343l-.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" /></svg>
              )}
            </button>

            {/* Language Switcher */}
            <div className="hidden lg:flex items-center gap-1 bg-white/10 p-1 rounded-xl">
              {(['en', 'rw', 'fr'] as const).map((lang) => (
                <button key={lang} onClick={() => setLanguage(lang)} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${language === lang ? 'bg-white text-primary shadow-lg' : 'hover:bg-white/10'}`}>{lang}</button>
              ))}
            </div>

            {/* Auth */}
            <button onClick={handleAuthClick} className="flex items-center gap-2 md:px-4 py-2 hover:bg-white/10 rounded-2xl transition-all font-black text-sm">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="h-9 w-9 rounded-full border-2 border-secondary object-cover shadow-lg" />
              ) : (
                <div className="p-2 bg-white/20 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
              )}
              <span className="hidden sm:inline">{user ? user.name.split(' ')[0] : t('login')}</span>
            </button>

            {/* Cart Button */}
            <button onClick={() => setIsCartDrawerOpen(true)} className="flex items-center gap-3 bg-secondary text-primary px-4 h-12 rounded-2xl font-black hover:bg-yellow-400 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-secondary/20 border-2 border-secondary/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[10px] uppercase opacity-70">Cart</span>
                <span className="text-sm">{cartCount}</span>
              </div>
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar Area */}
        <div className="lg:hidden bg-primary/95 dark:bg-gray-900 px-4 pb-4 border-b border-white/5 relative" ref={mobileSearchRef}>
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={inputValue}
              onChange={handleSearch}
              onFocus={() => setShowSuggestions(true)}
              className="w-full h-12 py-2.5 pl-12 pr-10 border border-white/10 rounded-2xl text-white dark:text-gray-100 focus:bg-white focus:text-gray-900 outline-none transition-all text-sm bg-white/10 backdrop-blur-md"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </form>

          {showSuggestions && (inputValue || history.length > 0) && (
            <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 rounded-b-2xl shadow-2xl border-x border-b border-gray-100 dark:border-gray-700 overflow-hidden z-[60] text-gray-800 dark:text-gray-200">
              {inputValue && suggestions.length > 0 && (
                <div className="py-2">
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => handleSuggestionClick(s)} className="w-full text-left px-6 py-4 hover:bg-primary/5 dark:hover:bg-primary/20 border-b border-gray-50 dark:border-gray-700 last:border-0 transition-colors">
                      <span className="text-sm font-medium">{s}</span>
                    </button>
                  ))}
                </div>
              )}
              {history.length > 0 && !inputValue && (
                <div className="py-2">
                  <div className="px-6 py-3 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('recentSearches')}</div>
                  {history.map((h, i) => (
                    <button key={i} onClick={() => handleSuggestionClick(h)} className="w-full text-left px-6 py-4 hover:bg-primary/5 dark:hover:bg-primary/20 border-b border-gray-50 dark:border-gray-700 last:border-0">
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{h}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <CartDrawer isOpen={isCartDrawerOpen} onClose={() => setIsCartDrawerOpen(false)} />
      <ProfileDashboard isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
};

export default Header;
