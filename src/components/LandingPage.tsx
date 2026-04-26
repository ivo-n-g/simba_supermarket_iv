import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useStore, Location } from '../context/StoreContext';
import productsData from '../../simba_products.json';

interface LandingPageProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
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

const LandingPage: React.FC<LandingPageProps> = ({ categories, onSelectCategory }) => {
  const { t, language } = useLanguage();
  const { pickupBranch, setPickupBranch, locations } = useStore();
  
  const [selectedLoc, setSelectedLoc] = useState<Location>(
    locations.find(l => l.name === pickupBranch) || locations[1]
  );

  useEffect(() => {
    const current = locations.find(l => l.name === pickupBranch);
    if (current) setSelectedLoc(current);
  }, [pickupBranch, locations]);

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
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Premium Products</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-primary dark:text-secondary font-black text-lg">{locations.length}</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Kigali Branches</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary dark:text-secondary font-black text-lg">4.9/5</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Customer Rating</span>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section id="explore-categories" className="py-12 md:py-24 container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-6 text-center md:text-left">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-black text-primary dark:text-secondary uppercase tracking-tighter mb-3">
              {t('exploreCategories')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm md:text-lg">
              Fresh quality products from Simba Supermarket, now closer to you than ever.
            </p>
          </div>
          <button 
            onClick={() => onSelectCategory('All')}
            className="text-primary dark:text-secondary font-black text-xs md:text-sm uppercase tracking-widest hover:underline whitespace-nowrap"
          >
            {t('viewAllProducts')} →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-8">
          {categories.map((category) => (
            <div 
              key={category}
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
              Visit Us <span className="text-secondary">Across Kigali</span>
            </h2>
            <p className="text-gray-300 font-bold text-sm md:text-xl max-w-2xl mx-auto leading-relaxed">
              Find your nearest Simba branch for fresh products, premium quality, and the best shopping experience in Rwanda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">
            {/* Branch List */}
            <div className="lg:col-span-5 space-y-3 md:space-y-4 max-h-[400px] md:max-h-[600px] overflow-y-auto pr-4 scrollbar-hide">
              {locations.map((loc) => (
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
                    <h3 className="text-sm md:text-lg font-black uppercase tracking-tight">{loc.name.replace('Simba Supermarket ', '')}</h3>
                    <p className={`text-[9px] md:text-[11px] font-bold uppercase tracking-widest mt-1 opacity-60 ${selectedLoc.name === loc.name ? 'text-primary' : 'text-gray-400'}`}>
                      {loc.address}
                    </p>
                  </div>
                  {selectedLoc.name === loc.name && (
                    <div className="w-8 h-8 bg-primary text-secondary rounded-full flex items-center justify-center animate-in zoom-in font-bold">✓</div>
                  )}
                </div>
              ))}
            </div>

            {/* Map Preview Mock */}
            <div className="lg:col-span-7 relative group">
              <div className="aspect-video bg-gray-900 rounded-[48px] md:rounded-[60px] overflow-hidden shadow-2xl border-4 md:border-8 border-white/10 relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                
                {/* Branch Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 bg-white dark:bg-gray-800 p-6 md:p-10 rounded-[32px] md:rounded-[48px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in duration-1000 border-2 md:border-4 border-white/20 dark:border-gray-700/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="text-left">
                      <p className="text-[10px] font-black text-primary dark:text-secondary uppercase tracking-[0.2em] mb-1">Selected Branch</p>
                      <p className="text-base md:text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">{selectedLoc.name}</p>
                      <p className="text-[9px] md:text-xs text-gray-400 font-bold mt-1 uppercase leading-tight mb-4 tracking-widest">{selectedLoc.address}</p>
                      
                      {/* Branch Reviews Varied */}
                      <div className="flex items-center gap-1 mb-4">
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
                      Get Directions
                    </a>
                  </div>
                </div>

                {/* Pulsing Pin Mock */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 bg-secondary rounded-full animate-ping opacity-20"></div>
                  <div className="w-4 h-4 bg-secondary rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="py-20 md:py-32 container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-around gap-12 text-center md:text-left">
          {[
            { title: "Fresh Everyday", desc: "Sourced directly from local farmers across Rwanda.", icon: "🍃" },
            { title: "Kigali Delivery", desc: "Doorstep delivery within 45 minutes of ordering.", icon: "⚡" },
            { title: "Trusted Brand", desc: "Serving the Rwandan community for over 20 years.", icon: "💎" }
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center md:items-start gap-4">
              <span className="text-5xl md:text-6xl filter drop-shadow-xl">{f.icon}</span>
              <h4 className="text-xl md:text-2xl font-black text-primary dark:text-secondary uppercase tracking-tighter">{f.title}</h4>
              <p className="text-gray-500 dark:text-gray-400 font-bold text-xs md:text-base max-w-xs leading-relaxed italic opacity-80">
                "{f.desc}"
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
