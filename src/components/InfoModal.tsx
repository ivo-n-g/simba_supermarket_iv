import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, content }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300 border-4 border-white/20">
        <div className="p-8 md:p-12">
          <div className="flex justify-between items-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-primary dark:text-secondary uppercase tracking-tight">{title}</h2>
            <button 
              onClick={onClose} 
              className="p-3 bg-gray-50 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-full transition-all"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-200 text-lg md:text-xl font-bold leading-relaxed">
              {content}
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 flex justify-center">
            <button
              onClick={onClose}
              className="px-10 py-4 bg-primary text-white rounded-[24px] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              {t('continueShopping')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
