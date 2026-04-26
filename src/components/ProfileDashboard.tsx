import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

interface ProfileDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBranchDashboard: () => void;
}

type DashboardTab = 'profile' | 'wishlist' | 'orders' | 'branch';

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ isOpen, onClose, onOpenBranchDashboard }) => {
  const { user, logout, wishlist, toggleWishlist, addToCart, orders } = useStore();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<DashboardTab>('profile');

  if (!isOpen || !user) return null;

  const handleLogout = () => {
    if (window.confirm(t('logoutConfirm'))) {
      logout();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row transform transition-all duration-300 scale-100 opacity-100">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-900/50 p-6 border-r border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-primary dark:bg-secondary text-white dark:text-primary rounded-full flex items-center justify-center font-black text-3xl mb-3 shadow-lg">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : user.name[0]}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{user.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{user.email}</p>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'profile', label: t('profile'), icon: '👤' },
              { id: 'wishlist', label: t('wishlist'), icon: '❤️' },
              { id: 'orders', label: t('myOrders'), icon: '📦' },
              { id: 'branch', label: t('branchDashboard'), icon: '🏪' }
            ].filter(tab => tab.id !== 'branch' || user.role === 'representative').map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'branch') {
                    onOpenBranchDashboard();
                    onClose();
                  } else {
                    setActiveTab(tab.id as DashboardTab);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-md shadow-primary/20' 
                    : 'text-gray-500 hover:bg-primary/5 dark:hover:bg-primary/10'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all mt-8"
            >
              <span>🚪</span>
              {t('logout')}
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800">
          <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight">
              {activeTab === 'profile' ? t('personalInfo') : activeTab === 'wishlist' ? t('wishlist') : t('myOrders')}
            </h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{t('fullName')}</label>
                    <p className="font-bold text-gray-800 dark:text-white">{user.name}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{t('emailAddress')}</label>
                    <p className="font-bold text-gray-800 dark:text-white">{user.email}</p>
                  </div>
                  {user.role === 'representative' && user.branch && (
                    <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10 dark:border-primary/20 md:col-span-2">
                      <label className="text-[10px] font-black text-primary dark:text-secondary uppercase tracking-widest block mb-1">Assigned Branch</label>
                      <p className="font-black text-gray-800 dark:text-white uppercase tracking-tight">{user.branch}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                {wishlist.length === 0 ? (
                  <div className="text-center py-20">
                    <span className="text-6xl mb-4 block">💝</span>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{t('emptyWishlist')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map((product) => (
                      <div key={product.id} className="p-3 flex gap-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-700 group">
                        <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-800 dark:text-white text-sm line-clamp-1 mb-1">{product.name}</h4>
                          <p className="text-primary dark:text-secondary font-black text-sm mb-3">{product.price.toLocaleString()} RWF</p>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => addToCart(product)}
                              className="flex-1 bg-primary text-white text-[10px] font-bold py-2 rounded-lg hover:opacity-90 transition-all"
                            >
                              {t('addToCart')}
                            </button>
                            <button 
                              onClick={() => toggleWishlist(product)}
                              className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg hover:bg-red-100 transition-all"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                {orders.filter(o => o.customerName === user.name).length === 0 ? (
                  <div className="text-center py-20">
                    <span className="text-6xl mb-4 block">📦</span>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{t('noOrdersFound') || 'No orders yet.'}</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.filter(o => o.customerName === user.name).map(order => (
                      <div key={order.id} className="bg-gray-50 dark:bg-gray-900/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Order #{order.id}</span>
                            <span className="font-bold text-gray-800 dark:text-white">{order.branch}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'ready' ? 'bg-green-100 text-green-700' :
                            'bg-gray-200 text-gray-700'
                          }`}>
                            {t(order.status) || order.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-300">{item.quantity}x {item.name}</span>
                              <span className="font-bold">{(item.price * item.quantity).toLocaleString()} RWF</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
                          <span className="font-black uppercase text-xs tracking-widest text-primary dark:text-secondary">Total: {order.total.toLocaleString()} RWF</span>
                          {order.status === 'completed' && (
                            <button 
                              onClick={() => alert(t('reviewSubmitted') || 'Review Submitted!')}
                              className="px-4 py-2 bg-secondary text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md"
                            >
                              {t('leaveReview') || 'Leave a Review'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
