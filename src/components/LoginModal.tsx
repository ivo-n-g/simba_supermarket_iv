import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { GoogleLogin } from '@react-oauth/google';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const branches = [
  'Simba Supermarket Remera',
  'Simba Supermarket Kimironko',
  'Simba Supermarket Kacyiru',
  'Simba Supermarket Nyamirambo',
  'Simba Supermarket Gikondo',
  'Simba Supermarket Kanombe',
  'Simba Supermarket Kinyinya',
  'Simba Supermarket Kibagabaga',
  'Simba Supermarket Nyanza',
];

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, signup, forgotPassword, handleGoogleSuccess } = useStore();
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'customer' | 'representative'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetSent, setIsResetSent] = useState(false);

  if (!isOpen) return null;

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const exists = await forgotPassword(email);
    if (exists) {
      setIsResetSent(true);
      setTimeout(() => {
        setIsForgotPassword(false);
        setIsResetSent(false);
      }, 3000);
    } else {
      setError('No account found with this email.');
    }
    setIsLoading(false);
  };

  const validateForm = () => {
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    if (!isLogin && !fullName.trim()) {
      setError('Please enter your full name.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isLogin) {
        const success = await login(email, password, role, role === 'representative' ? selectedBranch : undefined);
        if (success) {
          onClose();
        } else {
          setError(`Invalid ${role === 'representative' ? 'representative' : ''} email or password.`);
        }
      } else {
        const success = await signup(fullName, email, password, role, role === 'representative' ? selectedBranch : undefined);
        if (success) {
          onClose();
        } else {
          setError('User with this email already exists.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary dark:text-secondary">
              {isForgotPassword ? t('forgotPassword') : (isLogin ? t('login') : t('signUp'))} to Simba
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!isForgotPassword && (
            <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-xl mb-6">
              <button
                onClick={() => setRole('customer')}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${role === 'customer' ? 'bg-white dark:bg-gray-600 text-primary dark:text-secondary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Customer
              </button>
              <button
                onClick={() => setRole('representative')}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${role === 'representative' ? 'bg-white dark:bg-gray-600 text-primary dark:text-secondary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Representative
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2 animate-shake">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {isResetSent ? (
            <div className="py-10 text-center space-y-4 animate-in fade-in zoom-in">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-bold text-gray-900 dark:text-white">{t('resetLinkSent')}</p>
            </div>
          ) : isForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('emailAddress')}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white"
                  placeholder={t('emailAddress')}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-lg flex justify-center items-center gap-2"
              >
                {isLoading && (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {t('sendMessage')}
              </button>
              <button 
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="w-full text-sm font-bold text-gray-500 hover:text-primary transition-colors"
              >
                Back to {t('login')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {role === 'representative' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned Branch</label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white text-sm"
                  >
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              )}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('fullName')}</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white"
                    placeholder={t('fullName')}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('emailAddress')}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white"
                  placeholder={t('emailAddress')}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('password')}</label>
                  {isLogin && (
                    <button 
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-xs font-bold text-secondary hover:underline"
                    >
                      {t('forgotPassword')}
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isLoading && (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {isLogin ? t('signIn') : t('createAccount')}
              </button>
            </form>
          )}

          {!isForgotPassword && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200 dark:border-gray-700"></span>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 uppercase">{t('orContinueWith')}</span>
                </div>
              </div>

              <div className="flex justify-center w-full">
                <GoogleLogin
                  onSuccess={(res) => {
                    handleGoogleSuccess(res);
                    onClose();
                  }}
                  onError={() => setError('Google Login Failed')}
                  useOneTap
                  theme="filled_blue"
                  shape="pill"
                  width="350px"
                />
              </div>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
                {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}{' '}
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="text-secondary font-bold hover:underline"
                >
                  {isLogin ? t('signUp') : t('login')}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
