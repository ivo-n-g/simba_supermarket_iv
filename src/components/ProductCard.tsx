import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  unit: string;
  category: string;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image, unit, category, onClick }) => {
  const { addToCart, toggleWishlist, isInWishlist, pickupBranch, isProductInStock, getProductQuantity } = useStore();
  const { t } = useLanguage();
  const [localQuantity, setLocalQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = isInWishlist(id);
  const currentBranch = pickupBranch || 'Simba Supermarket Remera';
  const inStock = isProductInStock(currentBranch, id);
  const stockAmount = getProductQuantity(currentBranch, id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addToCart({ id, name, price, image, category, unit }, localQuantity);
    setLocalQuantity(1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({ id, name, price, image, category, unit });
  };

  const increment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalQuantity(prev => prev + 1);
  };

  const decrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (localQuantity > 1) {
      setLocalQuantity(prev => prev - 1);
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-700/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-primary/5 hover:scale-[1.02] transition-all duration-500 relative group flex flex-col h-full cursor-pointer overflow-hidden"
    >
      <div className="aspect-square mb-5 md:mb-6 relative overflow-hidden rounded-[24px] bg-gray-50 dark:bg-gray-700/30 flex items-center justify-center p-6">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ${!inStock ? 'opacity-40 grayscale' : ''}`}
        />
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
            <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full shadow-xl">
              {t('outOfStock')}
            </span>
          </div>
        )}
        {/* Top Right Heart Icon (Quick toggle) */}
        <button 
          onClick={handleToggleWishlist}
          className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all z-10 hover:scale-110 active:scale-90 ${
            isWishlisted 
              ? 'bg-red-500 text-white' 
              : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-400 hover:text-red-500'
          }`}
        >
          <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-primary dark:text-secondary font-black text-lg md:text-2xl tracking-tighter">
            {price.toLocaleString()} <span className="text-xs font-bold">RWF</span>
          </span>
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl ${stockAmount === 0 ? 'bg-red-50 text-red-500' : stockAmount < 5 ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-600'}`}>
            {stockAmount === 0 ? t('outOfStock') : `${stockAmount} ${t('left')}`}
          </span>
        </div>
        <h3 className="text-gray-900 dark:text-gray-100 font-bold text-sm md:text-base line-clamp-2 min-h-[3rem] mt-1 leading-tight tracking-tight group-hover:text-primary transition-colors">
          {name}
        </h3>
        <span className="text-gray-400 dark:text-gray-500 text-xs md:text-sm font-bold uppercase tracking-widest mt-1 opacity-60">
          {unit}
        </span>

        {/* Action Controls */}
        <div className="mt-6 space-y-4">
          {/* Quantity and Add to Cart Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4 w-full shrink-0" onClick={e => e.stopPropagation()}>
              <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-xl md:rounded-2xl overflow-hidden h-11 md:h-14 border border-gray-100 dark:border-gray-800 shrink-0">
                <button 
                  data-testid="quantity-decrement"
                  onClick={decrement}
                  className="w-8 md:w-10 h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors font-black text-lg md:text-xl"
                >
                  -
                </button>
                <span 
                  data-testid="quantity-display"
                  className="w-6 md:w-8 flex items-center justify-center text-sm md:text-base font-black text-primary dark:text-secondary"
                >
                  {localQuantity}
                </span>
                <button 
                  data-testid="quantity-increment"
                  onClick={increment}
                  className="w-8 md:w-10 h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors font-black text-lg md:text-xl"
                >
                  +
                </button>
              </div>
            
            <button 
              data-testid="add-to-cart-button"
              onClick={handleAddToCart}
              disabled={!inStock || isAdded}
              className={`flex-1 h-12 md:h-14 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 px-5 ${
                isAdded
                  ? 'bg-green-500 text-white animate-in zoom-in duration-300'
                  : inStock 
                    ? 'bg-primary text-white hover:bg-opacity-90 shadow-primary/20' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed grayscale shadow-none'
              }`}
            >
              {isAdded ? (
                <>
                  <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs font-black uppercase tracking-widest">{t('added')}</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-xs font-black uppercase tracking-widest">{t('addToCart')}</span>
                </>
              )}
            </button>
          </div>

          {/* Secondary Buy Now and Wishlist Row */}
          <div className="flex gap-4" onClick={e => e.stopPropagation()}>
            <button 
              data-testid="buy-now-button"
              onClick={(e) => {
                handleAddToCart(e);
                // We'll use the window event or state to open cart instantly
                setTimeout(() => {
                  const cartBtn = document.querySelector('[data-testid="cart-button"]') as HTMLButtonElement;
                  cartBtn?.click();
                }, 100);
              }}
              disabled={!inStock}
              className={`flex-[2] h-12 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 ${
                inStock 
                  ? 'bg-secondary text-primary hover:bg-yellow-400' 
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              🚀 {t('buyNow')}
            </button>
            <button 
              onClick={handleToggleWishlist}
              className={`flex-1 h-12 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center border-2 transition-all active:scale-95 ${
                isWishlisted 
                  ? 'bg-red-50 border-red-100 text-red-500 dark:bg-red-900/10 dark:border-red-900/30' 
                  : 'border-gray-100 text-gray-400 hover:border-red-100 hover:text-red-500 dark:border-gray-700 dark:hover:border-red-900/30'
              }`}
            >
              <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
