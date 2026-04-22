import React from 'react';
import ProductCard from './ProductCard';
import { useLanguage } from '../context/LanguageContext';

interface Product {
  id: number;
  name: string;
  name_en?: string;
  name_rw?: string;
  name_fr?: string;
  price: number;
  category: string;
  image: string;
  unit: string;
}

interface ProductGridProps {
  products: Product[];
  selectedCategory: string;
  searchQuery: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, selectedCategory, searchQuery }) => {
  const { t, language } = useLanguage();

  const getProductName = (product: Product) => {
    if (language === 'rw' && product.name_rw) return product.name_rw;
    if (language === 'fr' && product.name_fr) return product.name_fr;
    return product.name_en || product.name;
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-white dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        {searchQuery 
          ? `${t('searchResults')} "${searchQuery}"` 
          : (selectedCategory === 'All' ? t('allProducts') : t(selectedCategory))}
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={getProductName(product)}
            price={product.price}
            image={product.image}
            unit={product.unit}
          />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            {t('noProductsFound')} {searchQuery && `"${searchQuery}"`} {selectedCategory !== 'All' && `${t('in')} ${t(selectedCategory)}`}.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
