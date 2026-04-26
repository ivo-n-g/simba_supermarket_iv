import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import productsData from '../../simba_products.json';

interface BranchDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  hideClose?: boolean;
}

type DashboardTab = 'orders' | 'inventory';

const BranchDashboard: React.FC<BranchDashboardProps> = ({ isOpen, onClose, hideClose }) => {
  const { user, logout, orders, updateOrderStatus, pickupBranch, updateStockAmount, getProductQuantity, addNewProduct } = useStore();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<DashboardTab>('orders');
  const [inventorySearch, setInventorySearch] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  
  // New Product Form State
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Food Products');
  const [newProductUnit, setNewProductUnit] = useState('Pcs');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductImage, setNewProductImage] = useState('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedBranch = user?.branch || pickupBranch || 'Simba Supermarket Remera';
  const role = user?.repRole || 'staff';

  const filteredOrders = orders.filter(order => order.branch === selectedBranch);

  const filteredInventory = useMemo(() => {
    const query = inventorySearch.toLowerCase();
    return productsData.products.filter(p => {
      const name = ((p as any)[`name_${language}`] || p.name).toLowerCase();
      return name.includes(query) || p.id.toString().includes(query);
    }).slice(0, 50); // Show first 50 results for performance
  }, [inventorySearch, language]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;
    
    addNewProduct({
      name: newProductName,
      price: parseInt(newProductPrice),
      image: newProductImage,
      category: newProductCategory,
      unit: newProductUnit
    });
    
    // Reset form
    setNewProductName('');
    setNewProductPrice('');
    setNewProductUnit('Pcs');
    setIsAddProductModalOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] overflow-hidden flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Centered Header */}
      <div className="px-6 py-10 bg-primary text-white flex flex-col gap-8 shadow-2xl shrink-0">
        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-2">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
              <span className="bg-secondary text-primary px-4 py-1.5 rounded-2xl text-base">{selectedBranch.split(' ').pop()}</span>
              {t('branchDashboard')}
            </h2>
            <p className="text-white/50 text-xs font-bold uppercase tracking-[0.3em] ml-1">{t('operationalControlCenter')}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center md:items-end">
              <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg mb-1 ${role === 'manager' ? 'bg-secondary text-primary' : 'bg-white/10 text-white border border-white/10'}`}>
                {role === 'manager' ? t('branchManager') : t('branchStaff')}
              </span>
              <p className="text-[10px] text-white/40 font-black uppercase">{user?.name}</p>
            </div>
            
            <button 
              onClick={() => { if(window.confirm(t('logoutConfirm') || 'Are you sure you want to logout?')) logout(); }}
              className="p-4 bg-red-500/20 text-red-100 rounded-3xl hover:bg-red-500 hover:text-white transition-all border border-red-500/30 shadow-xl group"
              title={t('logout')}
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>

            {!hideClose && (
              <button onClick={onClose} className="p-4 bg-white/10 rounded-3xl hover:bg-white/20 transition-all border border-white/10">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Centered Tabs */}
        <div className="flex justify-center items-end">
          <div className="flex gap-12 border-b border-white/10 w-full max-w-2xl px-10">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`flex-1 pb-4 text-sm font-black uppercase tracking-[0.2em] transition-all border-b-4 ${activeTab === 'orders' ? 'border-secondary text-secondary' : 'border-transparent opacity-30 hover:opacity-100'}`}
            >
              {t('orders')}
            </button>
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 pb-4 text-sm font-black uppercase tracking-[0.2em] transition-all border-b-4 ${activeTab === 'inventory' ? 'border-secondary text-secondary' : 'border-transparent opacity-30 hover:opacity-100'}`}
            >
              {t('inventory')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Centered */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-20">
        <div className="max-w-6xl mx-auto w-full h-full">
          {activeTab === 'orders' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
              {filteredOrders.length === 0 ? (
                <div className="col-span-full py-40 text-center flex flex-col items-center gap-6">
                  <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-6xl opacity-20">📦</div>
                  <p className="opacity-20 italic font-black text-2xl text-gray-400 uppercase tracking-[0.3em]">
                    {t('noOrdersFoundBranch')}
                  </p>
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-gray-800 p-8 rounded-[48px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-700 flex flex-col gap-6 w-full transform hover:scale-[1.03] transition-all duration-500">
                    <div className="flex justify-between items-start">
                      <div className="text-left">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{t('refId')}</span>
                        <span className="font-black text-2xl text-primary dark:text-secondary">#{order.id}</span>
                      </div>
                      <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'ready' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-[32px] space-y-3">
                      <div className="flex justify-between text-xs items-center">
                        <span className="text-gray-400 font-bold uppercase tracking-widest">{t('customer')}</span>
                        <span className="font-black dark:text-white text-sm">{order.customerName}</span>
                      </div>
                      <div className="flex justify-between text-xs items-center">
                        <span className="text-gray-400 font-bold uppercase tracking-widest">{t('time')}</span>
                        <span className="font-black text-primary dark:text-secondary text-sm">{order.pickupTime}</span>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs font-bold text-gray-500 bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-50 dark:border-gray-700 shadow-sm">
                          <span className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-primary/5 rounded-lg flex items-center justify-center text-[10px] text-primary">{item.quantity}</span>
                            {item.name}
                          </span>
                          <span className="font-black">{(item.price * item.quantity).toLocaleString()} RWF</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-6 flex flex-col gap-4">
                      {order.assignedStaff && (
                        <div className="flex items-center justify-center gap-3 p-4 bg-primary text-white rounded-[24px] shadow-lg">
                          <span className="text-sm">👤</span>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-center">{t('assigned')}: {order.assignedStaff}</span>
                        </div>
                      )}
                      <div className="flex gap-3">
                        {role === 'manager' && order.status === 'pending' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'assigned', user?.name || 'Staff Member')}
                            className="flex-1 py-5 bg-primary text-white rounded-[24px] text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl active:scale-95 border-b-4 border-black/20"
                          >
                            {t('assignToMe')}
                          </button>
                        )}
                        {(role === 'staff' || role === 'manager') && order.status === 'assigned' && order.assignedStaff === user?.name && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="flex-1 py-5 bg-secondary text-primary rounded-[24px] text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl active:scale-95 border-b-4 border-black/10"
                          >
                            {t('markAsReady')}
                          </button>
                        )}
                        {order.status === 'ready' && role === 'manager' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="flex-1 py-5 bg-green-600 text-white rounded-[24px] text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl active:scale-95 border-b-4 border-green-800/30"
                          >
                            {t('finishOrder')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-[60px] overflow-hidden shadow-[0_64px_128px_-24px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-700 flex flex-col">
              <div className="p-10 md:p-14 border-b border-gray-50 dark:border-gray-700 flex flex-col items-center justify-center gap-10 text-center">
                <div className="flex flex-col items-center gap-3">
                  <h3 className="text-4xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">{t('inventoryControl')}</h3>
                  <p className="text-base text-gray-400 font-bold uppercase tracking-widest opacity-60">{t('manageProductAvailability')} {selectedBranch}</p>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-4xl">
                  <div className="relative flex-1 w-full">
                    <input 
                      type="text" 
                      placeholder={t('searchItems')}
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="pl-16 pr-8 py-6 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-[32px] text-lg font-bold focus:ring-8 focus:ring-secondary/10 outline-none w-full transition-all shadow-inner"
                    />
                    <svg className="w-6 h-6 absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <button 
                    onClick={() => setIsAddProductModalOpen(true)}
                    className="w-full md:w-auto px-12 py-6 bg-primary text-white rounded-[32px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] flex items-center justify-center gap-4"
                  >
                    <span className="text-2xl">+</span> {t('addNewProduct')}
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-50 dark:divide-gray-700 overflow-y-auto max-h-[50vh] px-4 md:px-10">
                {filteredInventory.length === 0 ? (
                  <div className="p-20 text-center text-gray-400 italic font-black text-xl uppercase tracking-widest opacity-20">{t('catalogIsEmpty')}</div>
                ) : (
                  filteredInventory.map(product => {
                    const quantity = getProductQuantity(selectedBranch, product.id);
                    return (
                      <div key={product.id} className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-10 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-all rounded-[40px] my-2">
                        <div className="flex flex-col md:flex-row items-center gap-10 flex-1">
                          <div className="w-32 h-32 bg-gray-50 dark:bg-gray-950 rounded-[40px] overflow-hidden flex items-center justify-center border-8 border-white dark:border-gray-800 shadow-2xl p-4 shrink-0 transform -rotate-3">
                            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex flex-col items-center md:items-start gap-3">
                            <p className="font-black text-xl md:text-3xl dark:text-white text-gray-800 uppercase tracking-tighter line-clamp-2 leading-none">
                              {(product as any)[`name_${language}`] || product.name}
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                              <span className="text-[10px] font-black text-primary dark:text-secondary bg-primary/5 dark:bg-secondary/10 px-4 py-1.5 rounded-full border border-primary/10 tracking-widest">{t('sku')}: #{product.id}</span>
                              <span className={`text-[11px] font-black uppercase tracking-[0.2em] px-5 py-1.5 rounded-full shadow-sm ${quantity === 0 ? 'bg-red-50 text-red-500 border border-red-100' : quantity < 5 ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                                {quantity === 0 ? t('soldOut') : `${quantity} ${t('inStock')}`}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center gap-4 bg-gray-50 dark:bg-gray-900 p-2 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-inner scale-125 md:scale-150">
                          <button 
                            onClick={() => updateStockAmount(selectedBranch, product.id, quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 hover:bg-primary hover:text-white dark:hover:bg-primary rounded-full transition-all font-black text-primary dark:text-secondary shadow-md"
                          >
                            -
                          </button>
                          <input 
                            type="number" 
                            value={quantity}
                            onChange={(e) => updateStockAmount(selectedBranch, product.id, parseInt(e.target.value) || 0)}
                            className="w-12 bg-transparent text-center font-black text-sm text-primary dark:text-secondary outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button 
                            onClick={() => updateStockAmount(selectedBranch, product.id, quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 hover:bg-primary hover:text-white dark:hover:bg-primary rounded-full transition-all font-black text-primary dark:text-secondary shadow-md"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal - Centered */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-primary/20 backdrop-blur-xl">
          <div className="bg-white dark:bg-gray-800 rounded-[60px] shadow-[0_64px_128px_-24px_rgba(0,0,0,0.4)] w-full max-w-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500 border-[12px] border-white/10">
            <div className="p-10 md:p-16">
              <div className="flex justify-between items-center mb-12">
                <div className="text-left">
                  <h2 className="text-3xl font-black text-primary dark:text-secondary uppercase tracking-tight">{t('newInventory')}</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{t('fillProductDetails')}</p>
                </div>
                <button onClick={() => setIsAddProductModalOpen(false)} className="text-gray-400 hover:text-red-500 p-4 bg-gray-50 dark:bg-gray-900 rounded-full transition-all text-xl">✕</button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-10">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">{t('displayName')}</label>
                  <input
                    type="text"
                    required
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="w-full px-8 py-6 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-[32px] focus:ring-8 focus:ring-secondary/10 outline-none transition-all font-black text-lg dark:text-white placeholder:opacity-30"
                    placeholder="e.g. Premium Basmati Rice"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Category</label>
                    <select
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      className="w-full px-8 py-6 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-[32px] focus:ring-8 focus:ring-secondary/10 outline-none font-black dark:text-white text-sm"
                    >
                      {['Food Products', 'Baby Products', 'Cleaning & Sanitary', 'Cosmetics & Personal Care', 'Kitchenware & Electronics'].map(c => (
                        <option key={c} value={c}>{t(c)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">{t('saleUnit')}</label>
                    <input
                      type="text"
                      required
                      value={newProductUnit}
                      onChange={(e) => setNewProductUnit(e.target.value)}
                      className="w-full px-8 py-6 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-[32px] focus:ring-8 focus:ring-secondary/10 outline-none font-black dark:text-white text-sm"
                      placeholder="e.g. Pcs, Kg, L"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">{t('unitPrice')}</label>
                    <input
                      type="number"
                      required
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      className="w-full px-8 py-6 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-[32px] focus:ring-8 focus:ring-secondary/10 outline-none font-black text-xl text-primary dark:text-secondary"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-[40px] border-2 border-dashed border-gray-100 dark:border-gray-700">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">{t('visualIdentity')}</label>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl overflow-hidden flex items-center justify-center border-4 border-white dark:border-gray-700 shrink-0">
                      {newProductImage ? (
                        <img src={newProductImage} alt="Preview" className="w-full h-full object-contain p-4" />
                      ) : (
                        <span className="text-4xl grayscale opacity-20">🖼️</span>
                      )}
                    </div>
                    <label className="flex-1 w-full cursor-pointer">
                      <div className="w-full px-10 py-6 bg-primary text-white rounded-[32px] text-center hover:scale-[1.02] transition-all shadow-lg active:scale-95 font-black uppercase text-xs tracking-widest">
                        {t('uploadImageFile')}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-secondary text-primary py-8 rounded-[32px] font-black text-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-tighter border-b-8 border-black/10"
                >
                  {t('confirmSyncCatalog')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchDashboard;
