import React from 'react';
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
  { name: 'Simba Supermarket Gishushu', lat: -1.9546, lng: 30.1039, address: 'KG 8 Ave, Kigali' },
  { name: 'Simba Supermarket Town', lat: -1.9441, lng: 30.0619, address: 'KN 2 St, Kigali City Center' },
  { name: 'Simba Supermarket Kimironko', lat: -1.9351, lng: 30.1265, address: 'KG 11 Ave, Kigali' },
  { name: 'Simba Supermarket Kicukiro', lat: -1.9774, lng: 30.1044, address: 'KK 15 Rd, Kigali' },
];

const LandingPage: React.FC<LandingPageProps> = ({ categories, onSelectCategory }) => {
  const { t, language } = useLanguage();

  const getCategoryName = (category: string) => {
    const product = productsData.products.find(p => p.category === category) as any;
    if (product) return product[`category_${language}`] || category;
    return t(category);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Categories Section */}
      <section className="py-16 md:py-24 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black text-primary dark:text-secondary uppercase tracking-tighter mb-4">
              {t('exploreCategories')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-bold">
              Choose from our wide variety of premium products delivered straight to your door.
            </p>
          </div>
          <button 
            onClick={() => onSelectCategory('All')}
            className="px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95"
          >
            Shop All Products
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
          {categories.sort().map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className="group bg-white dark:bg-gray-800 p-8 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:border-primary dark:hover:border-secondary transition-all flex flex-col items-center text-center gap-4 hover:-translate-y-2"
            >
              <div className="text-5xl group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
                {categoryIcons[category] || '📦'}
              </div>
              <span className="font-black text-gray-800 dark:text-white text-sm uppercase tracking-tight leading-tight">
                {getCategoryName(category)}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-primary dark:text-secondary uppercase tracking-tighter mb-4">
              {t('ourLocations')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-bold italic">
              {t('findUs')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Location Cards */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 scrollbar-hide">
              {locations.map((loc, i) => (
                <div key={i} className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-[32px] border border-gray-100 dark:border-gray-700 hover:border-primary transition-colors cursor-pointer group">
                  <h4 className="font-black text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{loc.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">{loc.address}</p>
                </div>
              ))}
            </div>

            {/* Interactive Map Mockup */}
            <div className="lg:col-span-2 relative h-[500px] rounded-[40px] overflow-hidden shadow-2xl border-8 border-gray-100 dark:border-gray-700">
              {/* Using a real Google Maps Iframe for a professional look */}
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight={0} 
                marginWidth={0} 
                src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=-1.9441,30.0619+(Simba%20Supermarket)&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                className="grayscale dark:invert contrast-[1.2] opacity-80"
              />
              <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]"></div>
              
              {/* Floating Info */}
              <div className="absolute bottom-8 left-8 p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-xl max-w-xs border border-white/20">
                <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">Currently Open</p>
                <p className="text-sm font-bold text-gray-800 dark:text-white">All our branches are ready to serve you 24/7 across Kigali.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: 'Super Fast', desc: 'Delivery within 30 minutes in Kigali', icon: '⚡' },
            { title: 'Always Fresh', desc: 'Hand-picked premium quality products', icon: '🍃' },
            { title: '24/7 Service', desc: 'Order anytime, day or night', icon: '🕙' },
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center p-8 bg-white dark:bg-gray-800 rounded-[40px] shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700">
              <span className="text-5xl mb-6">{f.icon}</span>
              <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase mb-2">{f.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
