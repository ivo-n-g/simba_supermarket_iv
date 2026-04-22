import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  unit: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image, unit }) => {
  const { addToCart } = useStore();
  const { t } = useLanguage();
  const [localQuantity, setLocalQuantity] = useState(1);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, name, price, image }, localQuantity);
    setLocalQuantity(1); // Reset after adding
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
    <div className="bg-white dark:bg-gray-800 p-2 md:p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md dark:hover:shadow-primary/10 transition-all relative group flex flex-col h-full">
      <div className="aspect-square mb-2 md:mb-3 relative overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-700/50">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2"
        />
      </div>
      
      <div className="flex flex-col flex-1">
        <span className="text-primary dark:text-secondary font-bold text-sm md:text-lg">
          {price.toLocaleString()} RWF
        </span>
        <h3 className="text-gray-800 dark:text-gray-100 font-semibold text-[11px] md:text-sm line-clamp-2 min-h-[2rem] md:min-h-[2.5rem] mt-0.5 md:mt-1 leading-tight">
          {name}
        </h3>
        <span className="text-gray-400 dark:text-gray-500 text-[10px] md:text-sm pt-1">
          {unit}
        </span>

        {/* Quantity Selector and Add Button */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden h-9 md:h-10">
            <button 
              onClick={decrement}
              className="px-2 md:px-3 h-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors font-bold"
            >
              -
            </button>
            <span className="px-2 md:px-3 text-xs md:text-sm font-bold min-w-[1.5rem] text-center dark:text-gray-200">
              {localQuantity}
            </span>
            <button 
              onClick={increment}
              className="px-2 md:px-3 h-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors font-bold"
            >
              +
            </button>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-primary text-white h-9 md:h-10 rounded-lg shadow-sm hover:bg-opacity-90 transition-all active:scale-95 flex items-center justify-center gap-1 md:gap-2 px-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{t('addToCart')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
