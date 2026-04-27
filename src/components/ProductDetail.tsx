import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';

import productsData from '../../simba_products.json';

interface ProductDetailProps {
  productId: number;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack }) => {
  const { t, language } = useLanguage();
  const { customProducts, addToCart, getProductQuantity, pickupBranch, isProductInStock } = useStore();
  const [isAdded, setIsAdded] = React.useState(false);
  
  // Find product in either custom products or base productsData
  const product = useMemo(() => {
    const all = [...customProducts, ...productsData.products];
    return all.find(p => p.id === productId);
  }, [productId, customProducts]);

  if (!product) return null;

  const quantity = getProductQuantity(pickupBranch || 'Simba Supermarket Remera', productId);
  const inStock = isProductInStock(pickupBranch || 'Simba Supermarket Remera', productId);

  const getTranslatedName = () => {
    return (product as any)[`name_${language}`] || product.name;
  };

  const getTranslatedCategory = () => {
    return (product as any)[`category_${language}`] || product.category;
  };

  const handleAddToCart = () => {
    if (!product || !inStock) return;
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Realistic mock data generator
  const details = useMemo(() => {
    const isFood = product.category.includes('Food') || product.category.includes('Drink');
    const isBeauty = product.category.includes('Cosmetics');
    
    return {
      description: language === 'rw' 
        ? `Iki gicuruzwa cya ${product.category} kiza cyane kandi kigezweho muri Simba Supermarket. Cyakozwe mu buryo bwizewe kugira ngo kiguhe serivisi nziza.`
        : language === 'fr'
        ? `Ce produit de la catégorie ${product.category} est l'un de nos meilleurs articles. Qualité garantie par Simba Supermarché.`
        : `This high-quality product from the ${product.category} category is a top choice at Simba Supermarket. Carefully selected to ensure the best value for our customers.`,
      specs: [
        { label: 'SKU', value: `#${product.id}` },
        { label: t('unit'), value: product.unit },
        { label: t('category'), value: getTranslatedCategory() },
        { label: 'Origin', value: 'Imported' }
      ],
      features: isFood 
        ? ['Freshly Stocked', 'Premium Quality', 'Hygienically Packed']
        : isBeauty
        ? ['Skin Friendly', 'Dermatologically Tested', 'Authentic Brand']
        : ['Durable', 'Authentic Simba Quality', 'Customer Favorite']
    };
  }, [product, language, t]);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen animate-fade-in-up pb-20">
      {/* Navigation Header */}
      <div className="sticky top-20 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <span className="font-bold text-gray-500 uppercase text-xs tracking-widest">
            {t('backToResults')}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
          {/* Product Image Section */}
          <div className="relative group">
            <div className="aspect-square rounded-[48px] bg-gray-50 dark:bg-gray-800/50 p-10 md:p-20 overflow-hidden border border-gray-100 dark:border-gray-800 shadow-inner flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            {!inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm rounded-[48px]">
                <span className="bg-red-500 text-white px-8 py-3 rounded-full font-black uppercase tracking-[0.2em] shadow-2xl">
                  {t('soldOut')}
                </span>
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col gap-8 text-center md:text-left">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="bg-primary/5 dark:bg-secondary/10 text-primary dark:text-secondary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">
                  {getTranslatedCategory()}
                </span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  SKU: #{product.id}
                </span>
              </div>
              <h1 className="text-3xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-[0.9] mb-4">
                {getTranslatedName()}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <span className="text-3xl md:text-4xl font-black text-primary dark:text-secondary">
                  {product.price.toLocaleString()} RWF
                </span>
                <span className="text-gray-400 font-bold">/ {product.unit}</span>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-800/50 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-black uppercase text-xs tracking-widest mb-4 opacity-40">{t('description')}</h3>
              <p className="text-gray-600 dark:text-gray-300 font-bold leading-relaxed text-lg italic">
                "{details.description}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {details.specs.map((spec, i) => (
                <div key={i} className="p-4 border border-gray-100 dark:border-gray-800 rounded-2xl">
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{spec.label}</span>
                  <span className="font-black text-gray-800 dark:text-white uppercase">{spec.value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-4">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Availability</span>
                <span className={`text-xs font-black uppercase tracking-[0.2em] ${inStock ? 'text-green-500' : 'text-red-500'}`}>
                  {inStock ? `${quantity} ${t('inStock')}` : t('soldOut')}
                </span>
              </div>
              <button
                data-testid="add-to-cart-detail"
                onClick={handleAddToCart}
                disabled={!inStock || isAdded}
                className={`w-full py-6 rounded-[32px] font-black text-xl uppercase tracking-tighter transition-all shadow-xl active:scale-95 ${
                  isAdded
                    ? 'bg-green-500 text-white animate-in zoom-in duration-300'
                    : inStock 
                      ? 'bg-secondary text-primary hover:scale-[1.02] shadow-secondary/20' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed grayscale'
                }`}
              >
                {isAdded ? (
                   <div className="flex items-center justify-center gap-3">
                     <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                     </svg>
                     <span>{t('added')}</span>
                   </div>
                ) : (
                  inStock ? t('addToCart') : t('outOfStock')
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Features Row */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {details.features.map((f, i) => (
            <div key={i} className="flex items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center text-xl shrink-0">✓</div>
              <span className="font-black uppercase text-xs tracking-widest text-gray-800 dark:text-white">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
