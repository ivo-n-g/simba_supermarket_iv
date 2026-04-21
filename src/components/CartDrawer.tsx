import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import LoginModal from './LoginModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutStep = 'cart' | 'identity' | 'payment' | 'success';

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, checkout, deliveryMethod, setDeliveryMethod, user } = useStore();
  const { t } = useLanguage();
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card' | 'cash'>('momo');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'delivery' ? 2000 : 0;
  const totalPrice = subtotal + deliveryFee;

  const handleNextStep = () => {
    if (step === 'cart') {
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
    // Simulate payment verification
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
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-0">
            <div className="flex-1 flex flex-col py-6 overflow-y-scroll">
              <div className="px-4 sm:px-6 flex items-start justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-primary">{t('shoppingCart')}</h2>
                  {step !== 'success' && (
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">
                      {t('step')} {step === 'cart' ? '1' : step === 'identity' ? '2' : '3'} / 3
                    </p>
                  )}
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 px-4 sm:px-6">
                {step === 'success' ? (
                  <div className="flex flex-col items-center justify-center py-20 text-green-600 animate-in fade-in zoom-in duration-500 text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-3xl font-black text-primary mb-2">{t('orderSuccess')}</p>
                    <p className="text-gray-500 font-medium">{t('thankYou')}</p>
                  </div>
                ) : step === 'cart' ? (
                  cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-center">
                      <svg className="w-20 h-20 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <p className="text-xl font-medium">{t('cartEmpty')}</p>
                      <button onClick={onClose} className="mt-4 text-secondary font-bold hover:underline">{t('continueShopping')}</button>
                    </div>
                  ) : (
                    <div className="flow-root">
                      <ul className="-my-6 divide-y divide-gray-100">
                        {cart.map((product) => (
                          <li key={product.id} className="py-6 flex">
                            <div className="flex-shrink-0 w-20 h-20 border border-gray-100 rounded-xl overflow-hidden bg-gray-50">
                              <img src={product.image} alt={product.name} className="w-full h-full object-center object-contain p-2" />
                            </div>
                            <div className="ml-4 flex-1 flex flex-col">
                              <div className="flex justify-between text-base font-bold text-gray-900">
                                <h3 className="line-clamp-2 text-sm">{product.name}</h3>
                                <p className="ml-4 whitespace-nowrap text-primary">{product.price.toLocaleString()} RWF</p>
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm mt-2">
                                <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100">
                                  <button onClick={() => updateQuantity(product.id, product.quantity - 1)} className="px-2 py-1 hover:bg-gray-200 transition-colors">-</button>
                                  <span className="px-3 py-1 font-bold text-xs">{product.quantity}</span>
                                  <button onClick={() => updateQuantity(product.id, product.quantity + 1)} className="px-2 py-1 hover:bg-gray-200 transition-colors">+</button>
                                </div>
                                <button onClick={() => removeFromCart(product.id)} className="font-bold text-red-500 hover:text-red-600 text-xs">{t('remove')}</button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                ) : step === 'identity' ? (
                  <div className="space-y-6">
                    <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-black text-xl">
                          {user?.name?.[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{user?.name}</h3>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                      <p className="text-xs text-primary font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {t('identityVerification')} Successful
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wider">{t('confirmDetails')}</h4>
                      <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-bold text-gray-400">Delivery Address</label>
                          <input type="text" defaultValue="Kigali, Rwanda" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-bold text-gray-400">Phone Number</label>
                          <input type="text" placeholder="+250..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wider">{t('paymentMethod')}</h4>
                    <div className="space-y-3">
                      {[
                        { id: 'momo', label: t('momo'), icon: '📱' },
                        { id: 'card', label: t('card'), icon: '💳' },
                        { id: 'cash', label: t('cash'), icon: '💵' }
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setPaymentMethod(m.id as any)}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                            paymentMethod === m.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{m.icon}</span>
                            <span className="font-bold text-gray-800">{m.label}</span>
                          </div>
                          {paymentMethod === m.id && (
                            <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    {paymentMethod === 'momo' && (
                      <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                        <p className="text-xs text-yellow-700 leading-relaxed font-medium">
                          You will receive a prompt on your phone to confirm the payment after clicking complete.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {cart.length > 0 && step !== 'success' && (
              <div className="border-t border-gray-100 py-6 px-4 sm:px-6 bg-gray-50/50">
                {step === 'cart' && (
                  <div className="mb-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('deliveryMethod')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setDeliveryMethod('pickup')} className={`p-3 rounded-xl border-2 text-left transition-all ${deliveryMethod === 'pickup' ? 'border-primary bg-white shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                        <div className="font-bold text-primary text-sm">{t('pickup')}</div>
                        <p className="text-[10px] text-gray-400 mt-1">{t('pickupNote')}</p>
                      </button>
                      <button onClick={() => setDeliveryMethod('delivery')} className={`p-3 rounded-xl border-2 text-left transition-all ${deliveryMethod === 'delivery' ? 'border-primary bg-white shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                        <div className="font-bold text-primary text-sm">{t('delivery')}</div>
                        <p className="text-[10px] text-gray-400 mt-1">{t('deliveryNote')}</p>
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm text-gray-500">
                    <p>{t('subtotal')}</p>
                    <p>{subtotal.toLocaleString()} RWF</p>
                  </div>
                  {deliveryMethod === 'delivery' && (
                    <div className="flex justify-between text-sm text-gray-500">
                      <p>{t('delivery')}</p>
                      <p>2,000 RWF</p>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-black text-primary pt-3 border-t border-gray-100">
                    <p>Total</p>
                    <p>{totalPrice.toLocaleString()} RWF</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  {step !== 'cart' && (
                    <button onClick={() => setStep(step === 'payment' ? 'identity' : 'cart')} className="px-6 py-4 rounded-2xl border-2 border-gray-200 font-bold text-gray-500 hover:bg-gray-50">
                      ←
                    </button>
                  )}
                  <button 
                    onClick={step === 'payment' ? handleCheckout : handleNextStep}
                    disabled={isProcessing}
                    className="flex-1 flex justify-center items-center px-6 py-4 rounded-2xl shadow-lg text-lg font-black text-primary bg-secondary hover:bg-yellow-400 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
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
