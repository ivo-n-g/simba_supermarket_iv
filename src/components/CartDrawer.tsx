import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import LoginModal from './LoginModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutStep = 'cart' | 'identity' | 'payment' | 'success';

const branches = [
  { name: 'Simba Supermarket Gishushu', address: 'KG 8 Ave, Gishushu, Kigali' },
  { name: 'Simba Supermarket Town', address: 'KN 2 St, Kigali City Center' },
  { name: 'Simba Supermarket Kimironko', address: 'KG 11 Ave, Kimironko, Kigali' },
  { name: 'Simba Supermarket Kicukiro', address: 'KK 15 Rd, Kicukiro, Kigali' },
];

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    cart, removeFromCart, updateQuantity, checkout, 
    deliveryMethod, setDeliveryMethod, pickupBranch, setPickupBranch, user 
  } = useStore();
  
  const { t } = useLanguage();
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card' | 'cash'>('cash');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [branchError, setBranchError] = useState(false);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'delivery' ? 2000 : 0;
  const totalPrice = subtotal + deliveryFee;

  const handleNextStep = () => {
    if (step === 'cart') {
      if (deliveryMethod === 'pickup' && !pickupBranch) {
        setBranchError(true);
        return;
      }
      setBranchError(false);
      
      if (!user) {
        setIsLoginModalOpen(true);
        return;
      }
      setStep('identity');
    } else if (step === 'identity') {
      setStep('payment');
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    await checkout();
    setIsProcessing(false);
    setStep('success');
    setTimeout(() => {
      setStep('cart');
      onClose();
    }, 4000);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] overflow-hidden transition-all duration-300">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
        
        <div className="absolute inset-y-0 right-0 max-w-full flex">
          <div className="w-screen max-w-md bg-white dark:bg-gray-800 shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-0">
            <div className="flex-1 flex flex-col py-6 overflow-y-scroll border-t-8 border-primary">
              <div className="px-4 sm:px-6 flex items-start justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-primary dark:text-secondary uppercase tracking-tight">{t('shoppingCart')}</h2>
                  {step !== 'success' && (
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-widest font-black">
                      {t('step')} {step === 'cart' ? '1' : step === 'identity' ? '2' : '3'} / 3
                    </p>
                  )}
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 px-4 sm:px-6">
                {step === 'success' ? (
                  <div className="flex flex-col items-center justify-center py-20 text-green-600 animate-in fade-in zoom-in duration-500 text-center">
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-3xl font-black text-primary dark:text-secondary mb-2 uppercase tracking-tight">{t('orderSuccess')}</p>
                    <p className="text-gray-500 dark:text-gray-400 font-bold">{t('thankYou')}</p>
                  </div>
                ) : step === 'cart' ? (
                  cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400 text-center">
                      <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <p className="text-xl font-black uppercase tracking-tight">{t('cartEmpty')}</p>
                      <button onClick={onClose} className="mt-4 text-primary dark:text-secondary font-black hover:underline uppercase text-sm tracking-widest">{t('continueShopping')}</button>
                    </div>
                  ) : (
                    <div className="flow-root">
                      <ul className="-my-6 divide-y divide-gray-100 dark:divide-gray-700">
                        {cart.map((product) => (
                          <li key={product.id} className="py-6 flex group">
                            <div className="flex-shrink-0 w-20 h-20 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-700/50 group-hover:scale-105 transition-transform duration-300">
                              <img src={product.image} alt={product.name} className="w-full h-full object-center object-contain p-2" />
                            </div>
                            <div className="ml-4 flex-1 flex flex-col justify-center">
                              <div className="flex justify-between text-base font-black text-gray-900 dark:text-gray-100 uppercase tracking-tighter">
                                <h3 className="line-clamp-1 text-xs">{product.name}</h3>
                                <p className="ml-4 whitespace-nowrap text-primary dark:text-secondary">{product.price.toLocaleString()} RWF</p>
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm mt-3">
                                <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 p-0.5">
                                  <button onClick={() => updateQuantity(product.id, product.quantity - 1)} className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors font-black">-</button>
                                  <span className="px-3 font-black text-xs dark:text-gray-100">{product.quantity}</span>
                                  <button onClick={() => updateQuantity(product.id, product.quantity + 1)} className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors font-black">+</button>
                                </div>
                                <button onClick={() => removeFromCart(product.id)} className="font-black text-red-500 hover:text-red-600 text-[10px] uppercase tracking-widest">{t('remove')}</button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                ) : step === 'identity' ? (
                  <div className="space-y-6">
                    <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-[32px] border border-primary/10 dark:border-primary/20 shadow-inner">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-primary dark:bg-secondary dark:text-primary text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg">
                          {user?.photoURL ? (
                            <img src={user.photoURL} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
                          ) : user?.name?.[0]}
                        </div>
                        <div>
                          <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">{user?.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">{user?.email}</p>
                        </div>
                      </div>
                      <div className="bg-white/50 dark:bg-white/5 p-2 px-3 rounded-xl inline-flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] text-primary dark:text-secondary font-black uppercase tracking-widest">Verified Session</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="font-black text-gray-800 dark:text-white text-xs uppercase tracking-[0.2em] ml-2">{t('confirmDetails')}</h4>
                      <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Delivery Address</label>
                          <input type="text" defaultValue="Kigali, Rwanda" className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 dark:text-white transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                          <input type="text" placeholder="+250..." className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 dark:text-white transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <h4 className="font-black text-gray-800 dark:text-white text-xs uppercase tracking-[0.2em] ml-2">{t('paymentMethod')}</h4>
                    <div className="space-y-4">
                      {[
                        { id: 'momo', label: t('momo'), icon: '📱', disabled: true },
                        { id: 'card', label: t('card'), icon: '💳', disabled: true },
                        { id: 'cash', label: t('cash'), icon: '💵', disabled: false }
                      ].map((m) => (
                        <button
                          key={m.id}
                          disabled={m.disabled}
                          onClick={() => !m.disabled && setPaymentMethod(m.id as any)}
                          className={`w-full flex items-center justify-between p-5 rounded-[28px] border-2 transition-all relative ${
                            paymentMethod === m.id ? 'border-primary dark:border-secondary bg-primary/5 dark:bg-secondary/5 ring-4 ring-primary/5 dark:ring-secondary/5' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 bg-gray-50/30 dark:bg-transparent'
                          } ${m.disabled ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-3xl filter drop-shadow-md">{m.icon}</span>
                            <div className="flex flex-col items-start">
                              <span className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">{m.label}</span>
                              {m.disabled && (
                                <span className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-1">
                                  {t('comingSoon')}
                                </span>
                              )}
                            </div>
                          </div>
                          {paymentMethod === m.id && (
                            <div className="w-7 h-7 bg-primary dark:bg-secondary text-white dark:text-primary rounded-full flex items-center justify-center shadow-lg">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    {paymentMethod === 'cash' && (
                      <div className="p-5 bg-green-50 dark:bg-green-900/20 rounded-[28px] border border-green-100 dark:border-green-900/30">
                        <p className="text-[11px] text-green-700 dark:text-green-400 leading-relaxed font-bold italic">
                          Payment will be collected upon delivery or branch pickup.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {cart.length > 0 && step !== 'success' && (
              <div className="border-t border-gray-100 dark:border-gray-700 py-8 px-4 sm:px-6 bg-gray-50/50 dark:bg-gray-900/50">
                {step === 'cart' && (
                  <div className="mb-8 space-y-8">
                    <div>
                      <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 ml-2">{t('deliveryMethod')}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setDeliveryMethod('pickup')} className={`p-4 rounded-[28px] border-2 text-left transition-all ${deliveryMethod === 'pickup' ? 'border-primary bg-white dark:bg-gray-800 shadow-xl shadow-primary/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 opacity-60'}`}>
                          <div className="font-black text-primary dark:text-secondary text-sm uppercase tracking-tighter">{t('pickup')}</div>
                          <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-1 leading-tight font-bold">{t('pickupNote')}</p>
                        </button>
                        <button 
                          disabled 
                          className="p-4 rounded-[28px] border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 opacity-40 cursor-not-allowed text-left relative overflow-hidden"
                        >
                          <div className="font-black text-gray-400 text-sm uppercase tracking-tighter">{t('delivery')}</div>
                          <p className="text-[9px] text-gray-400 mt-1 leading-tight font-bold">{t('comingSoon')}</p>
                        </button>
                      </div>
                    </div>

                    {deliveryMethod === 'pickup' && (
                      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                        <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 ml-2">{t('selectBranch')}</h3>
                        <div className="grid grid-cols-1 gap-2.5">
                          {branches.map((branch) => (
                            <button
                              key={branch.name}
                              onClick={() => { setPickupBranch(branch.name); setBranchError(false); }}
                              className={`w-full p-5 rounded-[24px] border-2 text-left transition-all flex flex-col gap-1 ${
                                pickupBranch === branch.name
                                  ? 'border-primary dark:border-secondary bg-primary/5 dark:bg-secondary/5 ring-2 ring-primary/10'
                                  : 'border-gray-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50'
                              }`}
                            >
                              <span className={`text-xs font-black uppercase tracking-tight ${pickupBranch === branch.name ? 'text-primary dark:text-secondary' : 'text-gray-800 dark:text-white'}`}>
                                {branch.name}
                              </span>
                              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{branch.address}</span>
                            </button>
                          ))}
                        </div>
                        {branchError && (
                          <p className="text-[10px] text-red-500 font-black mt-3 ml-2 animate-shake flex items-center gap-2">
                            <span>⚠️</span> {t('pleaseSelectBranch')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-3 mb-8 bg-white dark:bg-gray-800/50 p-6 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <p>{t('subtotal')}</p>
                    <p className="text-gray-900 dark:text-white">{subtotal.toLocaleString()} RWF</p>
                  </div>
                  {deliveryMethod === 'delivery' && (
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <p>{t('delivery')}</p>
                      <p className="text-primary dark:text-secondary">+ 2,000 RWF</p>
                    </div>
                  )}
                  <div className="flex justify-between text-2xl font-black text-primary dark:text-secondary pt-4 border-t-2 border-gray-50 dark:border-gray-700 tracking-tighter">
                    <p>TOTAL</p>
                    <p>{totalPrice.toLocaleString()} RWF</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  {step !== 'cart' && (
                    <button onClick={() => setStep(step === 'payment' ? 'identity' : 'cart')} className="px-8 py-5 rounded-3xl border-2 border-gray-200 dark:border-gray-700 font-black text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      ←
                    </button>
                  )}
                  <button 
                    onClick={step === 'payment' ? handleCheckout : handleNextStep}
                    disabled={isProcessing}
                    className="flex-1 flex justify-center items-center px-6 py-5 rounded-3xl shadow-[0_20px_40px_-8px_rgba(0,0,0,0.2)] text-xl font-black text-primary bg-secondary hover:bg-yellow-400 transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-tighter"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-3">
                        <svg className="animate-spin h-6 w-6 text-primary" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t('processing')}
                      </div>
                    ) : (
                      step === 'payment' ? t('completePayment') : step === 'identity' ? t('paymentVerification') : t('checkout')
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default CartDrawer;
