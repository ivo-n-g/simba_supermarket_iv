import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
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

const locations = [
  { name: 'Simba Supermarket Gishushu', lat: -1.9546, lng: 30.1039, address: 'KG 8 Ave, Gishushu, Kigali' },
  { name: 'Simba Supermarket Town', lat: -1.9441, lng: 30.0619, address: 'KN 2 St, Kigali City Center' },
  { name: 'Simba Supermarket Kimironko', lat: -1.9351, lng: 30.1265, address: 'KG 11 Ave, Kimironko, Kigali' },
  { name: 'Simba Supermarket Kicukiro', lat: -1.9774, lng: 30.1044, address: 'KK 15 Rd, Kicukiro, Kigali' },
  { name: 'Simba Supermarket Nyarutarama', lat: -1.9311, lng: 30.0984, address: 'KG 9 Ave, Nyarutarama, Kigali' },
  { name: 'Simba Supermarket Nyamirambo', lat: -1.9723, lng: 30.0456, address: 'KN 162 St, Nyamirambo, Kigali' },
  { name: 'Simba Supermarket Remera', lat: -1.9587, lng: 30.1189, address: 'KG 11 Ave, Remera, Kigali' },
];

const LandingPage: React.FC<LandingPageProps> = ({ categories, onSelectCategory }) => {
  const { t, language } = useLanguage();
  const [selectedLoc, setSelectedLoc] = useState(locations[1]);

  const getCategoryName = (category: string) => {
    const product = productsData.products.find(p => p.category === category) as any;
    if (product) return product[`category_${language}`] || category;
    return t(category);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Categories Section */}
      <section className="py-12 md:py-24 container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 gap-4 text-center md:text-left">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-black text-primary dark:text-secondary uppercase tracking-tighter mb-3">
              {t('exploreCategories')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-sm md:text-base">
              Choose from our wide variety of premium products.
            </p>
          </div>
          <button 
            onClick={() => onSelectCategory('All')}
            className="w-full md:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95"
          >
            Shop All Products
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-8">
          {categories.sort().map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className="group bg-white dark:bg-gray-800 p-6 md:p-8 rounded-[32px] md:rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all flex flex-col items-center text-center gap-3 md:gap-4 hover:-translate-y-1"
            >
              <div className="text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300">
                {categoryIcons[category] || '📦'}
              </div>
              <span className="font-black text-gray-800 dark:text-white text-[10px] md:text-sm uppercase tracking-tight leading-tight">
                {getCategoryName(category)}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-12 md:py-24 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-primary dark:text-secondary uppercase tracking-tighter mb-3">
              {t('ourLocations')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-bold italic text-sm md:text-base">
              {t('findUs')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
            <div className="space-y-3 max-h-[400px] md:max-h-[500px] overflow-y-auto pr-2 scrollbar-hide order-2 lg:order-1">
              {locations.map((loc, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedLoc(loc)}
                  className={`p-5 md:p-6 rounded-3xl border-2 transition-all cursor-pointer group ${
                    selectedLoc.name === loc.name 
                    ? 'bg-primary/5 border-primary shadow-inner' 
                    : 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-700 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-black text-sm md:text-base transition-colors ${selectedLoc.name === loc.name ? 'text-primary dark:text-secondary' : 'text-gray-900 dark:text-white'}`}>
                      {loc.name}
                    </h4>
                    {selectedLoc.name === loc.name && (
                      <span className="w-2 h-2 bg-primary dark:bg-secondary rounded-full animate-ping"></span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">{loc.address}</p>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2 relative h-[350px] md:h-[500px] rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl border-4 md:border-8 border-gray-100 dark:border-gray-700 transition-all duration-500 order-1 lg:order-2">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight={0} 
                marginWidth={0} 
                src={`https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${selectedLoc.lat},${selectedLoc.lng}+(${encodeURIComponent(selectedLoc.name)})&t=&z=16&ie=UTF8&iwloc=B&output=embed`}
                className="grayscale dark:invert contrast-[1.2] opacity-90"
                key={selectedLoc.name}
              />
              <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]"></div>
              
              <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 p-4 md:p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-xl md:max-w-xs border border-white/20 animate-in fade-in slide-in-from-left-4">
                <p className="text-[10px] font-black text-primary dark:text-secondary uppercase tracking-[0.2em] mb-1">Selected Branch</p>
                <p className="text-xs md:text-sm font-bold text-gray-800 dark:text-white">{selectedLoc.name}</p>
                <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase">{selectedLoc.address}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-16 md:py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
            { title: 'Super Fast', desc: 'Delivery within 30 minutes in Kigali', icon: '⚡' },
            { title: 'Always Fresh', desc: 'Hand-picked premium quality products', icon: '🍃' },
            { title: '24/7 Service', desc: 'Order anytime, day or night', icon: '🕙' },
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 md:p-8 transition-colors duration-300">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/5 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6 md:mb-8">
                <span className="text-4xl md:text-5xl drop-shadow-lg">{f.icon}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tighter mb-3 md:mb-4">{f.title}</h3>
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
