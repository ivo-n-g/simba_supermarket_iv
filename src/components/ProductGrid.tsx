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
    <div className="flex-1 p-4 md:p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
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
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {t('noProductsFound')} {searchQuery && `"${searchQuery}"`} {selectedCategory !== 'All' && `${t('in')} ${t(selectedCategory)}`}.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
