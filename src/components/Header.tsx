import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import LoginModal from './LoginModal';
import CartDrawer from './CartDrawer';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const { user, logout, cartCount } = useStore();
  const { language, setLanguage, t } = useLanguage();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  const handleAuthClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      if (window.confirm(t('logoutConfirm'))) {
        logout();
      }
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-8">
            <h1 className="text-xl md:text-2xl font-bold text-secondary tracking-tight cursor-pointer">
              Simba
            </h1>
            
            {/* Search Bar (Hidden on small/medium screens) */}
            <form onSubmit={handleSubmit} className="hidden lg:flex relative w-64 xl:w-96">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={inputValue}
                onChange={handleSearch}
                className="w-full py-2 px-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary transition-all text-sm"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-6">
            {/* Language Switcher */}
            <div className="flex items-center gap-0.5 bg-white/10 p-1 rounded-lg">
              {(['en', 'rw', 'fr'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-1.5 py-1 rounded text-[10px] md:text-xs font-bold uppercase transition-all ${
                    language === lang ? 'bg-secondary text-primary' : 'hover:bg-white/10'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <button onClick={handleAuthClick} className="flex items-center gap-1.5 hover:text-secondary transition-colors font-medium">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="h-6 w-6 rounded-full border border-secondary" />
              ) : (
                <div className="bg-white/10 p-1.5 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <span className="hidden sm:inline text-sm">{user ? user.name : t('login')}</span>
            </button>
            <button 
              onClick={() => setIsCartDrawerOpen(true)} 
              className="flex items-center gap-1.5 bg-secondary text-primary px-3 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors relative group shadow-sm active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="hidden xs:inline text-sm">{cartCount}</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full border border-primary animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="lg:hidden bg-white px-4 py-2 border-b border-gray-100">
          <div className="relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={inputValue}
              onChange={handleSearch}
              className="w-full py-2 pl-4 pr-10 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-gray-50"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <CartDrawer isOpen={isCartDrawerOpen} onClose={() => setIsCartDrawerOpen(false)} />
    </>
  );
};

export default Header;
