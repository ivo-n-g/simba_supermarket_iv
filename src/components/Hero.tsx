import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { GoogleLogin } from '@react-oauth/google';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const { user, handleGoogleSuccess } = useStore();
  
  return (
    <div className="relative h-[550px] md:h-[700px] flex items-center justify-center overflow-hidden bg-primary">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover brightness-[0.4] contrast-[1.2]"
        >
          <source src="/banner.mp4" type="video/mp4" />
        </video>
      </div>

      {/* High-End Gradient Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-tr from-primary/95 via-primary/20 to-transparent"></div>
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-primary/30"></div>

      {/* Content Container */}
      <div className="container mx-auto px-6 relative z-20 flex flex-col lg:flex-row items-center justify-between gap-16">
        <div className="text-center lg:text-left text-white max-w-2xl animate-in fade-in slide-in-from-left-12 duration-1000">
          <div className="inline-block px-5 py-2 rounded-full bg-secondary text-primary border-2 border-secondary/50 shadow-2xl mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Premium Shopping</span>
          </div>
          <h2 className="text-6xl md:text-9xl font-black mb-6 tracking-tighter leading-[0.85] drop-shadow-2xl">
            Simba <br/>
            <span className="text-secondary">{t('supermarket')}</span>
          </h2>
          <p className="text-2xl md:text-3xl text-gray-200 font-bold mb-10 opacity-95 max-w-lg leading-tight italic drop-shadow-lg">
            "{t('slogan')}"
          </p>
        </div>

        {/* Action Card */}
        {!user && (
          <div className="w-full max-w-[420px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-10 rounded-[48px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in duration-1000 border-4 border-white/20 dark:border-gray-700/50">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">
                {t('getStarted')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-bold opacity-80 uppercase tracking-widest">
                Safe & Fast Sign-in
              </p>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="flex justify-center w-full transform scale-125 transition-transform hover:scale-[1.3] origin-center">
                <GoogleLogin
                  onSuccess={(res) => handleGoogleSuccess(res)}
                  onError={() => console.log('Login Failed')}
                  theme="filled_blue"
                  shape="pill"
                  text="continue_with"
                  size="large"
                  width="300"
                />
              </div>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t-2 border-gray-100 dark:border-gray-700"></span></div>
                <div className="relative flex justify-center"><span className="px-4 bg-white/95 dark:bg-gray-800/95 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em]">Simba Connect</span></div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-700 flex items-center justify-center gap-6 opacity-30 grayscale">
              <span className="text-2xl font-black tracking-tighter">VISA</span>
              <span className="text-2xl font-black tracking-tighter">MoMo</span>
              <span className="text-2xl font-black tracking-tighter">CASH</span>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-30 translate-y-[1px]">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px] fill-gray-50 dark:fill-gray-900 transition-colors duration-500"
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,155.47-9.23,283.82,128.47,462.5,12.5C923.29,13.27,1048.4,18,1200,46.29V120H0Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
