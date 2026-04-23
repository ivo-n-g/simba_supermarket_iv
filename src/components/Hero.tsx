import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { GoogleLogin } from '@react-oauth/google';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const { user, handleGoogleSuccess } = useStore();
  
  return (
    <div className="relative h-[500px] md:h-[650px] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover brightness-[0.6]"
      >
        <source src="/banner.mp4" type="video/mp4" />
      </video>

      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary/90 via-primary/40 to-transparent"></div>

      {/* Content Container */}
      <div className="container mx-auto px-6 relative z-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="text-center lg:text-left text-white max-w-2xl animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 border border-secondary/30 backdrop-blur-md mb-6">
            <span className="text-secondary text-xs font-black uppercase tracking-[0.3em]">Premium Quality</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.9]">
            Simba <br/>
            <span className="text-secondary">{t('supermarket')}</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 font-medium mb-8 opacity-90 max-w-lg leading-tight italic">
            "{t('slogan')}"
          </p>
        </div>

        {/* Central Auth Area (Simplified) */}
        {!user && (
          <div className="w-full max-w-[400px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl animate-in fade-in zoom-in duration-700 border border-white/20">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 text-center uppercase tracking-tight">
              {t('getStarted')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-8 text-sm font-medium">
              Join the Simba family for a better shopping experience.
            </p>
            
            <div className="flex flex-col gap-4">
              <div className="flex justify-center w-full scale-110 origin-center">
                <GoogleLogin
                  onSuccess={(res) => handleGoogleSuccess(res)}
                  onError={() => console.log('Login Failed')}
                  theme="filled_blue"
                  shape="pill"
                  text="continue_with"
                  width="300"
                />
              </div>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200 dark:border-gray-700"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="px-3 bg-transparent text-gray-400 font-black tracking-widest">Simba Online</span></div>
              </div>
            </div>
            
            <p className="text-[10px] text-gray-400 mt-6 text-center leading-relaxed font-bold uppercase tracking-tighter">
              Secure Authentication powered by Google Cloud
            </p>
          </div>
        )}
      </div>

      {/* Decorative Bottom Edge */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[80px] fill-gray-50 dark:fill-gray-900 transition-colors duration-300">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V46.29C80.7,35.1,191.13,67,321.39,56.44Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
