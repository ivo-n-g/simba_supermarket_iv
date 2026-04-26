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
      className="bg-white dark:bg-gray-800 p-2 md:p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md dark:hover:shadow-primary/10 transition-all relative group flex flex-col h-full cursor-pointer overflow-hidden"
    >
      <div className="aspect-square mb-2 md:mb-3 relative overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-700/50">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2 ${!inStock ? 'opacity-40 grayscale' : ''}`}
        />
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
              {t('outOfStock')}
            </span>
          </div>
        )}
        {/* Top Right Heart Icon (Quick toggle) */}
        <button 
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-all z-10 ${
            isWishlisted 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-400 hover:text-red-500'
          }`}
        >
          <svg className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start">
          <span className="text-primary dark:text-secondary font-bold text-sm md:text-lg">
            {price.toLocaleString()} RWF
          </span>
          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${stockAmount === 0 ? 'bg-red-50 text-red-500' : stockAmount < 5 ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-600'}`}>
            {stockAmount === 0 ? t('outOfStock') : `${stockAmount} ${t('left')}`}
          </span>
        </div>
        <h3 className="text-gray-800 dark:text-gray-100 font-semibold text-[11px] md:text-sm line-clamp-2 min-h-[2rem] md:min-h-[2.5rem] mt-0.5 md:mt-1 leading-tight">
          {name}
        </h3>
        <span className="text-gray-400 dark:text-gray-500 text-[10px] md:text-sm pt-1">
          {unit}
        </span>

        {/* Action Controls */}
        <div className="mt-3 space-y-2">
          {/* Quantity and Add to Cart Row */}
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden h-8 md:h-10">
              <button 
                onClick={decrement}
                className="px-1.5 md:px-3 h-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors font-bold"
              >
                -
              </button>
              <span className="px-1.5 md:px-3 text-[10px] md:text-sm font-bold min-w-[1rem] md:min-w-[1.5rem] text-center dark:text-gray-200">
                {localQuantity}
              </span>
              <button 
                onClick={increment}
                className="px-1.5 md:px-3 h-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors font-bold"
              >
                +
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={!inStock || isAdded}
              className={`flex-1 h-8 md:h-10 rounded-lg shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1 px-2 ${
                isAdded
                  ? 'bg-green-500 text-white animate-in zoom-in duration-300'
                  : inStock 
                    ? 'bg-primary text-white hover:bg-opacity-90' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed grayscale'
              }`}
            >
              {isAdded ? (
                <>
                  <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('added')}</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t('addToCart')}</span>
                </>
              )}
            </button>
          </div>

          {/* Secondary Wishlist Button */}
          <button 
            onClick={handleToggleWishlist}
            className={`w-full h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-2 transition-all active:scale-95 ${
              isWishlisted 
                ? 'bg-red-50 border-red-100 text-red-500 dark:bg-red-900/10 dark:border-red-900/30' 
                : 'border-gray-100 text-gray-400 hover:border-red-100 hover:text-red-500 dark:border-gray-700 dark:hover:border-red-900/30'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {t('addToWishlist')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
