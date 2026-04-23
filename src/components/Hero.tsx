import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="relative h-[450px] md:h-[600px] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover brightness-[0.7]"
      >
        <source src="/banner.mp4" type="video/mp4" />
      </video>

      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary/80 to-transparent"></div>

      {/* Content Container */}
      <div className="container mx-auto px-6 relative z-20 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="text-left text-white max-w-2xl animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="inline-block px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 backdrop-blur-md mb-6">
            <span className="text-secondary text-xs font-black uppercase tracking-widest">Official Store</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter leading-none">
            Simba <br/>
            <span className="text-secondary">{t('supermarket')}</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-100 font-medium mb-8 opacity-90 max-w-lg leading-tight">
            {t('slogan')}
          </p>
          
          {/* App Store Badges Mockup */}
          <div className="flex gap-4 items-center">
            <div className="h-12 w-36 bg-black rounded-lg border border-gray-700 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
              <span className="text-[10px] text-gray-400 font-bold uppercase mr-2">Download on</span>
              <span className="text-white font-black">App Store</span>
            </div>
            <div className="h-12 w-36 bg-black rounded-lg border border-gray-700 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
              <span className="text-[10px] text-gray-400 font-bold uppercase mr-2">Get it on</span>
              <span className="text-white font-black">Google Play</span>
            </div>
          </div>
        </div>

        {/* Central Search/CTA Area */}
        <div className="hidden lg:block w-[400px] bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-2xl animate-in fade-in slide-in-from-right-8 duration-700">
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-6 text-center">
            {t('login')} or {t('signUp')}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600">
              <span className="text-2xl">🇷🇼</span>
              <input type="text" placeholder="+250 780 000 000" className="bg-transparent outline-none font-bold text-gray-700 dark:text-white w-full" />
            </div>
            <button className="w-full py-4 bg-secondary text-primary font-black rounded-2xl hover:bg-yellow-400 transition-all shadow-lg shadow-secondary/20">
              {t('continueShopping')}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-6 text-center leading-relaxed">
            By continuing, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
          </p>
        </div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] fill-white dark:fill-gray-900 transition-colors duration-300">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V46.29C80.7,35.1,191.13,67,321.39,56.44Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
