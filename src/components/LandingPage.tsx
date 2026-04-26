import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import productsData from '../../simba_products.json';

interface LandingPageProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
}

interface Location {
  name: string;
  lat: number;
  lng: number;
  address: string;
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

const locations: Location[] = [
  { name: 'Simba Supermarket Gishushu', lat: -1.9546, lng: 30.1039, address: 'KG 8 Ave, Gishushu, Kigali' },
  { name: 'Simba Supermarket Town', lat: -1.9441, lng: 30.0619, address: 'KN 2 St, Kigali City Center' },
  { name: 'Simba Supermarket Kimironko', lat: -1.9351, lng: 30.1265, address: 'KG 11 Ave, Kimironko, Kigali' },
  { name: 'Simba Supermarket Kicukiro', lat: -1.9774, lng: 30.1044, address: 'KK 15 Rd, Kicukiro, Kigali' },
  { name: 'Simba Supermarket Nyarutarama', lat: -1.9311, lng: 30.0984, address: 'KG 9 Ave, Nyarutarama, Kigali' },
  { name: 'Simba Supermarket Nyamirambo', lat: -1.9723, lng: 30.0456, address: 'KN 162 St, Nyamirambo, Kigali' },
  { name: 'Simba Supermarket Remera', lat: -1.9587, lng: 30.1189, address: 'KG 11 Ave, Remera, Kigali' },
  { name: 'Simba Supermarket Kacyiru', lat: -1.9395, lng: 30.0877, address: 'KG 7 Ave, Kacyiru, Kigali' },
  { name: 'Simba Supermarket Gikondo', lat: -1.9719, lng: 30.0761, address: 'KK 12 Rd, Gikondo, Kigali' },
  { name: 'Simba Supermarket Kanombe', lat: -1.9635, lng: 30.1548, address: 'KK 1 Ave, Kanombe, Kigali' },
  { name: 'Simba Supermarket Kinyinya', lat: -1.9162, lng: 30.1107, address: 'KG 19 Ave, Kinyinya, Kigali' },
  { name: 'Simba Supermarket Kibagabaga', lat: -1.9318, lng: 30.1167, address: 'KG 14 Ave, Kibagabaga, Kigali' },
  { name: 'Simba Supermarket Nyanza', lat: -2.0005, lng: 30.0858, address: 'KK 15 Rd, Nyanza, Kigali' },
];

const LandingPage: React.FC<LandingPageProps> = ({ categories, onSelectCategory }) => {
  const { t, language } = useLanguage();
  const [selectedLoc, setSelectedLoc] = useState<Location>(locations[1]);
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const deg2rad = (deg: number) => deg * (Math.PI / 180);

  const findClosestBranch = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsFindingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        let minDistance = Infinity;
        let closest = locations[0];

        locations.forEach((loc) => {
          const distance = calculateDistance(latitude, longitude, loc.lat, loc.lng);
          if (distance < minDistance) {
            minDistance = distance;
            closest = loc;
          }
        });

        setSelectedLoc(closest);
        setIsFindingLocation(false);
        // Smooth scroll to map if needed
        const mapElement = document.getElementById('locations-section');
        mapElement?.scrollIntoView({ behavior: 'smooth' });
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Could not get your location. Please select a branch manually.');
        setIsFindingLocation(false);
      }
    );
  };

  const getCategoryName = (category: string) => {
    const product = productsData.products.find(p => p.category === category) as any;
    if (product) return product[`category_${language}`] || category;
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
      <section id="locations-section" className="py-12 md:py-24 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-primary dark:text-secondary uppercase tracking-tighter mb-3">
              {t('ourLocations')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-bold italic text-sm md:text-base mb-6">
              {t('findUs')}
            </p>
            <button 
              onClick={findClosestBranch}
              disabled={isFindingLocation}
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-primary rounded-full font-black text-xs uppercase tracking-widest shadow-lg hover:bg-yellow-400 transition-all disabled:opacity-50"
            >
              {isFindingLocation ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              Find Closest Branch
            </button>
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
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest leading-tight">{loc.address}</p>
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
              {/* Floating Info */}
              <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 p-4 md:p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-xl md:max-w-xs border border-white/20 animate-in fade-in slide-in-from-left-4">
                <p className="text-[10px] font-black text-primary dark:text-secondary uppercase tracking-[0.2em] mb-1">Selected Branch</p>
                <p className="text-xs md:text-sm font-bold text-gray-800 dark:text-white">{selectedLoc.name}</p>
                <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase leading-tight mb-2">{selectedLoc.address}</p>
                
                {/* Branch Reviews Mock */}
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className="text-yellow-400 text-xs">★</span>
                  ))}
                  <span className="text-[10px] text-gray-400 font-bold ml-1">(24 {t('reviews')})</span>
                </div>

                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLoc.lat},${selectedLoc.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Get Directions
                </a>
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
