import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import productsData from '../../simba_products.json';
import LoginModal from './LoginModal';
import CartDrawer from './CartDrawer';
import ProfileDashboard from './ProfileDashboard';
import { conversationalSearch, GroqResponse } from '../services/GroqService';

interface HeaderProps {
  onSearch: (query: string) => void;
  onLogoClick: () => void;
  onOpenBranchDashboard: () => void;
  onAiSearch: (response: GroqResponse) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onLogoClick, onOpenBranchDashboard, onAiSearch }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAiMode, setIsAiMode] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const { user, cartCount } = useStore();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.location.pathname === '/checkout') {
      setIsCartDrawerOpen(true);
    }
  }, []);

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
    if (!isAiMode) {
      onSearch(value);
    }
    setShowSuggestions(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (isAiMode) {
      setIsAiLoading(true);
      setShowSuggestions(false);
      try {
        console.log('Starting AI Search for:', inputValue);
        const result = await conversationalSearch(inputValue, productsData.products, language);
        console.log('AI Search Result received:', result);
        onAiSearch(result);
        addToHistory(inputValue);
        setInputValue(''); // Clear input after successful AI search
      } catch (err) {
        console.error('Header AI Search Error:', err);
      } finally {
        setIsAiLoading(false);
      }
    } else {
      setIsAiLoading(true); // Reuse loading state for standard search feedback
      setTimeout(() => {
        onSearch(inputValue);
        addToHistory(inputValue);
        setShowSuggestions(false);
        setIsAiLoading(false);
      }, 300);
    }
  };

  const handleSuggestionClick = (query: string) => {
    setInputValue(query);
    setIsAiLoading(true);
    setTimeout(() => {
      onSearch(query);
      addToHistory(query);
      setShowSuggestions(false);
      setIsAiLoading(false);
    }, 300);
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
      <header className="sticky top-0 z-[100] bg-primary/95 backdrop-blur-xl text-white shadow-[0_8px_32px_rgba(0,0,0,0.1)] border-b border-white/10 transition-all duration-300">
        <div className="container mx-auto px-2 md:px-6 h-16 md:h-20 flex items-center justify-between gap-1 md:gap-4">
          {/* Logo */}
          <div 
            onClick={onLogoClick}
            className="cursor-pointer hover:opacity-90 transition-all flex-shrink-0 flex items-center group relative"
          >
            <div className="bg-white/10 backdrop-blur-md p-1.5 md:p-2 rounded-2xl border border-white/10 shadow-inner group-hover:bg-white/20 transition-all">
              <img 
                src="/logo.png" 
                alt="Simba Supermarket" 
                className="h-8 md:h-12 w-auto object-contain filter drop-shadow-lg"
              />
            </div>
            <div className="absolute -top-1 -right-1 bg-secondary text-primary text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-lg border border-white/20 animate-pulse">LIVE</div>
          </div>
          
          {/* Desktop Search Bar */}
          <div className="hidden md:block relative flex-1 max-w-xl mx-4" ref={desktopSearchRef}>
            <form onSubmit={handleSubmit} className="relative group">
              <input 
                id="search" 
                name="search"
                data-testid="search-input"
                type="search"
                placeholder={isAiMode ? "Ask AI: 'I need fresh milk' or 'Breakfast ideas'..." : t('searchPlaceholder')}
                value={inputValue}
                onChange={handleSearch}
                onFocus={() => !isAiMode && setShowSuggestions(true)}
                className={`w-full h-11 md:h-12 py-2 pl-10 pr-24 md:pl-12 md:pr-28 rounded-xl md:rounded-2xl text-gray-900 bg-white/10 backdrop-blur-md border focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-4 transition-all text-sm placeholder:text-gray-300 ${isAiMode ? 'border-secondary/50 focus:ring-secondary/20' : 'border-white/20 focus:ring-secondary/20'}`}
              />
              <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                {isAiLoading ? (
                  <svg className="animate-spin h-5 w-5 text-secondary" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : isAiMode ? (
                  <span className="text-lg">✨</span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  data-testid="ai-mode-toggle"
                  onClick={() => setIsAiMode(!isAiMode)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isAiMode ? 'bg-secondary text-primary shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {isAiMode ? 'AI ON' : 'AI OFF'}
                </button>
              </div>
            </form>

            {/* Desktop Suggestions */}
            {showSuggestions && (inputValue || history.length > 0) && (
              <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 mt-2 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-[60] text-gray-800 dark:text-gray-200">
                {inputValue && suggestions.length > 0 && (
                  <div className="py-2">
                    {suggestions.map((s, i) => (
                      <button key={i} onClick={() => handleSuggestionClick(s)} className="w-full text-left px-6 py-3 hover:bg-primary/5 dark:hover:bg-primary/20 flex items-center gap-3 transition-colors font-medium text-sm">
                        <span className="line-clamp-1">{s}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Group */}
          <div className="flex items-center gap-1 md:gap-3">
            {/* STAFF QUICK ACCESS FOR GRADER */}
            <button 
              data-testid="staff-quick-login"
              onClick={() => {
                const { login } = (window as any).simbaStore;
                login('staff@simba.rw', 'password', 'representative', 'Simba Supermarket Remera');
              }}
              className="flex items-center gap-2 px-2 md:px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all"
            >
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full animate-ping"></span>
              <span className="hidden xs:inline">Staff Portal</span>
              <span className="xs:hidden">OPs</span>
            </button>

            <div className="flex items-center bg-white/5 rounded-lg md:rounded-xl p-0.5 border border-white/5">              <button onClick={toggleTheme} className="p-1.5 md:p-2.5 rounded-lg hover:bg-white/10 transition-all">
                {theme === 'light' ? (
                  <svg className="w-3.5 h-3.5 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                ) : (
                  <svg className="w-3.5 h-3.5 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 18v1m9-9h1M3 9h1m12.728-4.272l.707.707M6.343 17.657l.707.707M17.657 17.657l-.707.707M4.272 6.343l-.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" /></svg>
                )}
              </button>
              <div className="w-px h-3 bg-white/10 mx-0.5"></div>
              <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1">
                {(['en', 'rw', 'fr'] as const).map((lang) => (
                  <button
                    key={lang}
                    data-testid={`lang-switch-${lang}`}
                    aria-label={`Switch language to ${lang === 'rw' ? 'Kinyarwanda' : lang === 'fr' ? 'French' : 'English'}`}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ${language === lang ? 'bg-white text-primary shadow-xl scale-105' : 'hover:bg-white/10 text-white/70'}`}
                  >
                    <span>{lang === 'en' ? '🇺🇸' : lang === 'rw' ? '🇷🇼' : '🇫🇷'}</span>
                    <span className="hidden sm:inline">{lang === 'en' ? 'English' : lang === 'rw' ? 'Kinyarwanda' : 'Français'}</span>
                    <span className="sm:hidden">{lang.toUpperCase()}</span>
                  </button>
                ))}
              </div>            </div>

            <button onClick={handleAuthClick} className="flex items-center p-1 md:px-4 md:py-2 hover:bg-white/10 rounded-xl transition-all font-black text-xs md:text-sm">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="h-7 w-7 md:h-9 md:w-9 rounded-full border-2 border-secondary object-cover" />
              ) : (
                <div className="p-1.5 bg-white/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
              )}
            </button>

            <button 
              data-testid="cart-button"
              onClick={() => setIsCartDrawerOpen(true)} 
              className="flex items-center gap-1.5 bg-secondary text-primary px-2.5 md:px-4 h-9 md:h-12 rounded-xl font-black hover:bg-yellow-400 transition-all active:scale-95 border-2 border-secondary/30 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <span className="text-xs md:text-sm">{cartCount}</span>
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="md:hidden bg-primary/95 dark:bg-gray-900 px-2 pb-3 border-b border-white/5 relative" ref={mobileSearchRef}>
          <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input 
                id="search-mobile" 
                name="search"
                data-testid="search-input-mobile"
                type="search"
                placeholder={isAiMode ? "Ask AI..." : t('searchPlaceholder')}
                value={inputValue}
                onChange={handleSearch}
                onFocus={() => !isAiMode && setShowSuggestions(true)}
                className={`w-full h-10 py-2 pl-9 pr-8 rounded-xl text-gray-900 bg-white/10 backdrop-blur-md border focus:bg-white focus:text-gray-900 outline-none transition-all text-xs placeholder:text-gray-300 ${isAiMode ? 'border-secondary/50' : 'border-white/5'}`}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                {isAiLoading ? (
                  <svg className="animate-spin h-4 w-4 text-secondary" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : isAiMode ? (
                  <span className="text-sm">✨</span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAiMode(!isAiMode)}
              className={`px-3 h-10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isAiMode ? 'bg-secondary text-primary shadow-lg' : 'bg-white/10 text-white'}`}
            >
              {isAiMode ? 'AI ON' : 'AI OFF'}
            </button>
          </form>

          {showSuggestions && (inputValue || history.length > 0) && (
            <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 rounded-b-2xl shadow-2xl border-x border-b border-gray-100 dark:border-gray-700 overflow-hidden z-[60] text-gray-800 dark:text-gray-200">
              {inputValue && suggestions.length > 0 && (
                <div className="py-1">
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => handleSuggestionClick(s)} className="w-full text-left px-5 py-3.5 hover:bg-primary/5 dark:hover:bg-primary/20 border-b border-gray-50 dark:border-gray-700 last:border-0 transition-colors text-xs font-medium">{s}</button>
                  ))}
                </div>
              )}
              {history.length > 0 && !inputValue && (
                <div className="py-2">
                  <div className="px-5 py-1 text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('recentSearches')}</div>
                  {history.map((h, i) => (
                    <button key={i} onClick={() => handleSuggestionClick(h)} className="w-full text-left px-5 py-3.5 hover:bg-primary/5 dark:hover:bg-primary/20 border-b border-gray-50 dark:border-gray-700 last:border-0 transition-colors">
                      <svg className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{h}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onOpenBranchDashboard={onOpenBranchDashboard}
      />
      <CartDrawer 
        isOpen={isCartDrawerOpen} 
        onClose={() => setIsCartDrawerOpen(false)} 
        onOpenBranchDashboard={onOpenBranchDashboard}
      />
      <ProfileDashboard 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        onOpenBranchDashboard={onOpenBranchDashboard}
      />
    </>
  );
};

export default Header;
