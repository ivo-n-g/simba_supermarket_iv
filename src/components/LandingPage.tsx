import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useStore, Location } from '../context/StoreContext';
import productsData from '../../simba_products.json';
import PriceRangeSlider from './PriceRangeSlider';

interface LandingPageProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
  minPrice: number;
  maxPrice: number;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  onlyInStock: boolean;
  setOnlyInStock: (val: boolean) => void;
}

const categoryIcons: Record<string, string> = {
  'All': '🛒',
  'Alcoholic Drinks': '🍷',
  'Baby Products': '👶',
  'Cleaning & Sanitary': '🧼',
  'Cosmetics & Personal Care': '💄',
  'Food Products': '🍎',
  'General': '📦',
  'Kitchen Storage': '🏺',
  'Kitchenware & Electronics': '🔌',
  'Pet Care': '🐶',
  'Sports & Wellness': '🏃',
};

const LandingPage: React.FC<LandingPageProps> = ({ 
  categories, 
  onSelectCategory,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  onlyInStock,
  setOnlyInStock
}) => {
  const { t, language } = useLanguage();
  const { pickupBranch, setPickupBranch, locations, closestBranchName, userLocation, calculateDistance } = useStore();
  
  const sortedLocations = useMemo(() => {
    if (!userLocation) return locations;
    return [...locations].sort((a, b) => {
      const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
      const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
      return distA - distB;
    });
  }, [locations, userLocation, calculateDistance]);

  const [selectedLoc, setSelectedLoc] = useState<Location>(
    locations.find(l => l.name === pickupBranch) || locations[0]
  );

  useEffect(() => {
    if (pickupBranch) {
      const current = locations.find(l => l.name === pickupBranch);
      if (current) setSelectedLoc(current);
    }
  }, [pickupBranch, locations]);

  // Force update selectedLoc once closestBranch is identified for the first time
  useEffect(() => {
    if (closestBranchName && !pickupBranch) {
       const closest = locations.find(l => l.name === closestBranchName);
       if (closest) setSelectedLoc(closest);
    }
  }, [closestBranchName, pickupBranch, locations]);

  const translateCategory = (category: string) => {
    if (language === 'rw') {
      const rwCategories: Record<string, string> = {
        'Food Products': 'Ibiribwa',
        'Baby Products': 'Ibikoresho by-abana',
        'Cleaning & Sanitary': 'Isuku',
        'Cosmetics & Personal Care': 'Ibirungo',
        'General': 'Rusange',
        'Kitchen Storage': 'Ububiko bwo mu gikoni',
        'Kitchenware & Electronics': 'Ibikoresho byo mu gikoni',
        'Pet Care': 'Ibitungwa',
        'Sports & Wellness': 'Siporo',
        'Alcoholic Drinks': 'Ibinyobwa bisindisha',
        'All': 'Byose'
      };
      return rwCategories[category] || category;
    }
    return t(category);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Trust Bar */}
      <div className="bg-primary/5 dark:bg-white/5 py-4 overflow-hidden border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-6 flex justify-around items-center gap-8 whitespace-nowrap animate-pulse">
          <div className="flex items-center gap-2">
            <span className="text-primary dark:text-secondary font-black text-lg">{productsData.products.length}+</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t('premiumProducts')}</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-primary dark:text-secondary font-black text-lg">{locations.length}</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t('kigaliBranches')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary dark:text-secondary font-black text-lg">4.9/5</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t('customerRating')}</span>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section id="explore-categories" className="py-12 md:py-24 container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 md:mb-16 gap-8 text-center md:text-left">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-black text-primary dark:text-secondary uppercase tracking-tighter mb-3">
              {t('exploreCategories')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm md:text-lg">
              {t('exploreCategoriesDesc')}
            </p>
          </div>
          
          {/* Quick Filters on Landing Page */}
          <div className="bg-white dark:bg-gray-800/50 p-6 md:p-8 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col gap-6 w-full md:w-auto shrink-0 min-w-[320px]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-primary dark:text-secondary uppercase tracking-[0.2em]">{t('filters')}</h3>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('onlyInStock')}</span>
                <button 
                  onClick={() => setOnlyInStock(!onlyInStock)}
                  className={`w-10 h-5 rounded-full relative transition-all duration-300 ${onlyInStock ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${onlyInStock ? 'left-6' : 'left-1'}`}></div>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <PriceRangeSlider 
                min={100}
                max={500000}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onMinChange={setMinPrice}
                onMaxChange={setMaxPrice}
              />
            </div>
            
            <button 
              onClick={() => onSelectCategory('All')}
              className="w-full py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
            >
              {t('viewAllProducts')} →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-8">
          {categories.map((category) => (
            <div 
              key={category}
              data-testid={`category-card-${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
              onClick={() => onSelectCategory(category)}
              className="group cursor-pointer bg-white dark:bg-gray-800 p-6 md:p-10 rounded-[32px] md:rounded-[48px] shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="text-4xl md:text-6xl mb-4 md:mb-6 transform group-hover:scale-110 transition-transform duration-500 filter drop-shadow-lg">
                {categoryIcons[category] || '📦'}
              </span>
              <h3 className="text-xs md:text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest relative z-10">
                {translateCategory(category)}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Location Section */}
      <section className="py-12 md:py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full -translate-x-1/2 -translate-y-1/2 blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-translate-y-1/2 blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter mb-4 md:mb-6 leading-none">
              {t('visitUs')} <span className="text-secondary">{t('acrossKigali')}</span>
            </h2>
            <p className="text-gray-300 font-bold text-sm md:text-xl max-w-2xl mx-auto leading-relaxed">
              {t('findNearest')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">
            {/* Branch List */}
            <div className="lg:col-span-5 space-y-3 md:space-y-4 max-h-[400px] md:max-h-[600px] overflow-y-auto pr-4 scrollbar-hide">
              {sortedLocations.map((loc: Location) => {
                const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, loc.lat, loc.lng) : null;
                return (
                  <div 
                    key={loc.name}
                    onClick={() => {
                      setSelectedLoc(loc);
                      setPickupBranch(loc.name);
                    }}
                    className={`p-5 md:p-8 rounded-[32px] cursor-pointer transition-all duration-500 border-2 flex items-center justify-between group ${
                      selectedLoc.name === loc.name 
                      ? 'bg-white text-primary border-secondary shadow-2xl' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm md:text-lg font-black uppercase tracking-tight">{loc.name.replace('Simba Supermarket ', '')}</h3>
                        {loc.name === closestBranchName && (
                          <span className="bg-secondary text-primary text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse">{t('nearest')}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <p className={`text-xs md:text-sm font-semibold ${selectedLoc.name === loc.name ? 'text-primary' : 'text-gray-500'}`}>
                          {loc.address}
                        </p>
                        {distance !== null && (
                          <>
                            <div className={`w-1 h-1 rounded-full ${selectedLoc.name === loc.name ? 'bg-primary/20' : 'bg-white/20'}`}></div>
                            <p className={`text-[10px] md:text-xs font-black tracking-tight ${selectedLoc.name === loc.name ? 'text-primary' : 'text-secondary'}`}>
                              {distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    {selectedLoc.name === loc.name && (
                      <div className="w-8 h-8 bg-primary text-secondary rounded-full flex items-center justify-center animate-in zoom-in font-bold">✓</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Map Preview - REAL Google Maps Iframe */}
            <div className="lg:col-span-7 relative group h-[400px] md:h-[600px]">
              <div className="w-full h-full bg-gray-900 rounded-[48px] md:rounded-[60px] overflow-hidden shadow-2xl border-4 md:border-8 border-white/10 relative transition-all duration-700">
                <iframe 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }}
                  loading="lazy" 
                  allowFullScreen 
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyChU55xEAwN3hGKTA2nGa_apqfZ_ExVB9w&q=${selectedLoc.lat},${selectedLoc.lng}&zoom=15`}
                  className="grayscale hover:grayscale-0 transition-all duration-700"
                ></iframe>
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-primary/40 to-transparent"></div>
                
                {/* Branch Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 bg-white dark:bg-gray-800 p-6 md:p-10 rounded-[32px] md:rounded-[48px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border-2 md:border-4 border-white/20 dark:border-gray-700/50 pointer-events-auto">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="text-left">
                      <p className="text-[10px] font-black text-primary dark:text-secondary uppercase tracking-[0.2em] mb-1">{t('selectedBranch')}</p>
                      <p className="text-base md:text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">{selectedLoc.name}</p>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-bold mt-1 mb-4 leading-relaxed">{selectedLoc.address}</p>
                      
                      {selectedLoc.name === closestBranchName && (
                        <div className="inline-flex items-center gap-2 mb-4 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-800">
                          <span className="text-sm">📍</span>
                          <span className="text-[9px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest">
                            {t('locatedClosest')} 
                            {userLocation && ` (${calculateDistance(userLocation.lat, userLocation.lng, selectedLoc.lat, selectedLoc.lng).toFixed(1)}km)`}
                          </span>
                        </div>
                      )}

                      {/* Branch Reviews Varied */}
                      <div className="flex items-center gap-1">
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="text-xs">
                              {selectedLoc.rating >= star ? '★' : selectedLoc.rating >= star - 0.5 ? '½' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-primary dark:text-secondary ml-1">{selectedLoc.rating}</span>
                        <span className="text-[10px] text-gray-400 font-bold ml-1">({selectedLoc.reviewCount} {t('reviews')})</span>
                      </div>
                    </div>

                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLoc.lat},${selectedLoc.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-secondary text-primary px-8 py-4 rounded-3xl font-black text-xs md:text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all text-center shadow-lg whitespace-nowrap"
                    >
                      {t('getDirections')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="py-24 md:py-40 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
          {[
            { title: t('freshEveryday'), desc: t('sourcedDirectly'), icon: "🍃" },
            { title: t('kigaliDelivery'), desc: t('doorstepDelivery'), icon: "⚡" },
            { title: t('trustedBrand'), desc: t('servingRwandan'), icon: "💎" }
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center md:items-start gap-5 group">
              <div className="w-20 h-20 bg-primary/5 dark:bg-white/5 rounded-3xl flex items-center justify-center text-5xl group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 shadow-xl border border-white dark:border-gray-800">
                {f.icon}
              </div>
              <h4 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{f.title}</h4>
              <p className="text-gray-500 dark:text-gray-400 font-bold text-sm md:text-lg max-w-xs leading-relaxed italic opacity-80">
                "{f.desc}"
              </p>
            </div>
          ))}
        </div>

        {/* Premium Promise Card */}
        <div className="mt-24 md:mt-40 bg-gradient-to-br from-primary to-orange-600 p-1 md:p-2 rounded-[60px] shadow-2xl overflow-hidden group">
          <div className="bg-white dark:bg-gray-900 rounded-[56px] p-10 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-20 -translate-y-20 blur-[100px]"></div>
            <div className="max-w-2xl relative z-10 text-center md:text-left">
              <div className="inline-block px-4 py-2 bg-secondary text-primary rounded-full font-black text-[10px] uppercase tracking-[0.4em] mb-8">{t('premiumPromise')}</div>
              <h2 className="text-4xl md:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-[0.9] mb-8">
                {t('qualityTrust')}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg md:text-2xl font-bold italic leading-relaxed">
                "{t('guaranteeNote')}"
              </p>
            </div>
            <div className="w-48 h-48 md:w-80 md:h-80 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-8xl md:text-9xl shadow-inner relative group-hover:scale-110 transition-transform duration-700">
               🥇
               <div className="absolute -bottom-4 bg-primary text-white px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">{t('verified')}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
