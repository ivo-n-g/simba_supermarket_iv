import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import productsData from '../../simba_products.json';

interface BranchDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  hideClose?: boolean;
}

type DashboardTab = 'orders' | 'inventory' | 'tasks' | 'reports' | 'calendar' | 'messages';

const BranchDashboard: React.FC<BranchDashboardProps> = ({ isOpen, onClose, hideClose }) => {
  const { user, logout, orders, updateOrderStatus, pickupBranch, updateStockAmount, getProductQuantity, addNewProduct } = useStore();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<DashboardTab>(() => {
    return (localStorage.getItem('simba_dash_tab') as DashboardTab) || 'orders';
  });
  const [inventorySearch, setInventorySearch] = useState(() => {
    return localStorage.getItem('simba_dash_search') || '';
  });
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Persist dashboard state
  React.useEffect(() => {
    localStorage.setItem('simba_dash_tab', activeTab);
    localStorage.setItem('simba_dash_search', inventorySearch);
  }, [activeTab, inventorySearch]);
  
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

  const allOrders = useMemo(() => {
    return orders;
  }, [orders]);

  const filteredOrders = allOrders.filter(order => order.branch === selectedBranch);

  const stats = useMemo(() => {
    return {
      pending: filteredOrders.filter(o => o.status === 'pending').length,
      ready: filteredOrders.filter(o => o.status === 'ready').length,
      total: filteredOrders.length,
      sales: filteredOrders.reduce((sum, o) => sum + (o.status === 'completed' ? o.total : 0), 0).toLocaleString()
    };
  }, [filteredOrders]);

  const filteredInventory = useMemo(() => {
    const query = inventorySearch.toLowerCase();
    return productsData.products.filter(p => {
      const name = ((p as any)[`name_${language}`] || p.name).toLowerCase();
      return name.includes(query) || p.id.toString().includes(query);
    }).slice(0, 15);
  }, [inventorySearch, language]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;
    addNewProduct({ name: newProductName, price: parseInt(newProductPrice), image: newProductImage, category: newProductCategory, unit: newProductUnit });
    setNewProductName(''); setNewProductPrice(''); setIsAddProductModalOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans selection:bg-primary selection:text-white" data-testid="branch-dashboard-view">
      {/* Sidebar Navigation - Ultra Clean */}
      <aside className="hidden lg:flex w-80 bg-white dark:bg-gray-900 shrink-0 flex-col border-r border-gray-100 dark:border-gray-800 relative z-20">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-16 px-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <img src="/logo.png" alt="Simba" className="h-6 w-auto object-contain" />
            </div>
            <div>
              <h2 className="text-gray-900 dark:text-white font-black text-xl tracking-tight leading-none">Simba<span className="text-primary">Ops</span></h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Enterprise Console</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            {[
              { id: 'orders', label: t('orders'), icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              ), testid: 'orders-tab-button' },
              { id: 'inventory', label: t('inventory'), icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              ), testid: 'inventory-tab-button' },
              { id: 'tasks', label: 'Workforce', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ), testid: 'tasks-tab-button' },
              { id: 'reports', label: 'Analytics', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
              ), testid: 'reports-tab-button' },
              { id: 'calendar', label: 'Schedule', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              ), testid: 'calendar-tab-button' }
            ].map(item => (
              <button
                key={item.id}
                data-testid={item.testid}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all ${activeTab === item.id ? 'bg-primary/5 text-primary' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                <div className={`p-2 rounded-xl ${activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-transparent'}`}>
                  {item.icon}
                </div>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-gray-100 dark:border-gray-800">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-6 mb-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform"></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('shiftStatus')}</p>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-black text-gray-900 dark:text-white">{t('activeNow')}</p>
            </div>
          </div>
          
          <button 
            data-testid="logout-button"
            onClick={() => { if(window.confirm(t('logoutConfirm'))) logout(); }}
            className="w-full flex items-center justify-between gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group"
          >
            <span>{t('endSession')}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area - Airy & Pro */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-950">
        <header className="h-20 lg:h-24 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl flex items-center justify-between px-6 lg:px-12 shrink-0 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <div className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">☰</div>
             <div>
                <h1 className="text-xl lg:text-2xl font-black text-gray-900 dark:text-white tracking-tight">Overview</h1>
                <nav className="flex items-center gap-2 text-[8px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <span>Dashboard</span>
                  <span>/</span>
                  <span className="text-primary">{activeTab}</span>
                </nav>
             </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-8">
            <div className="relative group hidden xl:block">
              <input 
                type="text" 
                data-testid="dashboard-search-input"
                placeholder="Find anything..." 
                className="pl-12 pr-6 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-xs font-black w-80 outline-none focus:ring-4 focus:ring-primary/5 border border-transparent focus:border-primary/20 transition-all" 
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            
            <div className="flex items-center gap-3 lg:gap-6 pl-4 lg:pl-8 lg:border-l border-gray-100 dark:border-gray-800">
              <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
              </button>

              <div className="flex items-center gap-3 lg:gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-xs font-black text-gray-900 dark:text-white uppercase leading-none">{user?.name}</p>
                  <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mt-1">{role} @ {selectedBranch.split(' ')[2]}</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-white dark:border-gray-800 shadow-lg flex items-center justify-center text-gray-400 font-black text-lg">
                  {user?.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover" /> : user?.name[0]}
                </div>
              </div>

              {!hideClose && (
                <button 
                  data-testid="close-dashboard-button"
                  onClick={onClose}
                  className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-red-500 rounded-xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8 lg:space-y-12">
            
            {/* Elegant Welcome Card */}
            <div className="bg-gradient-to-br from-gray-900 to-primary p-8 lg:p-12 rounded-[40px] lg:rounded-[48px] shadow-2xl relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-[120px]"></div>
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-3xl lg:text-5xl font-black tracking-tighter mb-4 leading-none">{t('managementConsole')}.</h2>
                    <p className="text-sm lg:text-lg font-bold text-white/60 mb-8 leading-relaxed italic">"{t('welcomeBack')}, {user?.name.split(' ')[0]}. {t('monitoringPipelines')} {selectedBranch}."</p>
                    <div className="flex flex-wrap gap-4">
                       <div className="px-5 lg:px-6 py-2.5 lg:py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-3">
                          <span className="text-lg lg:text-xl">📊</span>
                          <div>
                             <p className="text-[8px] lg:text-[10px] font-black uppercase text-white/40 leading-none mb-1">{t('successRate')}</p>
                             <p className="text-xs lg:text-sm font-black">98.2%</p>
                          </div>
                       </div>
                       <div className="px-5 lg:px-6 py-2.5 lg:py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-3">
                          <span className="text-lg lg:text-xl">⏱️</span>
                          <div>
                             <p className="text-[8px] lg:text-[10px] font-black uppercase text-white/40 leading-none mb-1">{t('avgFulfillment')}</p>
                             <p className="text-xs lg:text-sm font-black">14 mins</p>
                          </div>
                       </div>
                    </div>
                </div>
                <div className="absolute bottom-6 right-6 lg:bottom-12 lg:right-12 text-6xl lg:text-9xl opacity-10 font-black tracking-tighter select-none">SIMBA</div>
            </div>

            {/* Top Stats Row - Refined */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                { label: t('awaitingPickup'), value: stats.pending, color: 'text-primary', bg: 'bg-primary/5', icon: '📦', testid: 'pending-orders-count' },
                { label: t('dispatchedUnits'), value: stats.ready, color: 'text-green-500', bg: 'bg-green-500/5', icon: '⚡', testid: 'ready-orders-count' },
                { label: t('revenueToday'), value: stats.sales, color: 'text-gray-900 dark:text-white', bg: 'bg-gray-50 dark:bg-gray-800', icon: '💰', testid: 'branch-sales-total' }
              ].map((stat, i) => (
                <div key={i} className={`${stat.bg} p-6 lg:p-8 rounded-[32px] lg:rounded-[40px] border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:scale-[1.02] transition-all`}>
                  <div>
                    <p className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                    <p className={`text-4xl lg:text-5xl font-black ${stat.color}`} data-testid={stat.testid}>{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl lg:rounded-3xl bg-white dark:bg-gray-900 shadow-xl flex items-center justify-center text-2xl lg:text-3xl group-hover:rotate-12 transition-transform">
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Content - Pro Table Style */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-8">
                {activeTab === 'orders' ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-4">
                      <h3 className="text-lg lg:text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">{t('workflowQueue')}</h3>
                      <button className="flex items-center gap-2 text-[9px] lg:text-[10px] font-black uppercase text-primary tracking-widest hover:translate-x-1 transition-transform">{t('viewArchive')} →</button>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-[40px] lg:rounded-[48px] shadow-[0_24px_48px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-gray-800 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left" data-testid="orders-table">
                          <thead>
                            <tr className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50/50 dark:bg-gray-800/50">
                              <th className="px-6 lg:px-10 py-5 lg:py-6">{t('reference')}</th>
                              <th className="px-6 lg:px-10 py-5 lg:py-6">{t('clientIdentity')}</th>
                              <th className="px-6 lg:px-10 py-5 lg:py-6 text-center">{t('status')}</th>
                              <th className="px-6 lg:px-10 py-5 lg:py-6 text-right">{t('operation')}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {filteredOrders.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="py-24 lg:py-32 text-center">
                                  <div className="flex flex-col items-center gap-6">
                                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-3xl lg:text-4xl grayscale opacity-30">📭</div>
                                    <p className="font-black uppercase tracking-widest text-[10px] lg:text-xs text-gray-300">{t('queueEmpty')}</p>
                                  </div>
                                </td>
                              </tr>
                            ) : filteredOrders.map(order => (
                              <tr key={order.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors" data-testid={`order-row-${order.id}`}>
                                <td className="px-6 lg:px-10 py-6 lg:py-8">
                                  <span className="font-mono text-xs font-black text-gray-300 group-hover:text-primary transition-colors">#{order.id.toUpperCase()}</span>
                                </td>
                                <td className="px-6 lg:px-10 py-6 lg:py-8">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center font-black text-gray-400 text-xs uppercase group-hover:bg-primary group-hover:text-white transition-all">{order.customerName[0]}</div>
                                    <div>
                                      <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{order.customerName}</p>
                                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{order.pickupTime}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 lg:px-10 py-6 lg:py-8 text-center">
                                  <span className={`px-4 py-1.5 rounded-full text-[8px] lg:text-[9px] font-black uppercase tracking-widest ${
                                    order.status === 'pending' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20' :
                                    order.status === 'ready' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' :
                                    'bg-gray-100 text-gray-600 dark:bg-gray-800'
                                  }`}>
                                    {t(order.status)}
                                  </span>
                                </td>
                                <td className="px-6 lg:px-10 py-6 lg:py-8 text-right">
                                  <div className="flex justify-end gap-2">
                                    {order.status === 'pending' && role === 'manager' && (
                                      <button 
                                        data-testid="assign-order-button"
                                        onClick={() => updateOrderStatus(order.id, 'assigned', user?.name || 'Staff')} 
                                        className="w-8 h-8 lg:w-10 lg:h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                      </button>
                                    )}
                                    {order.status === 'assigned' && order.assignedStaff === user?.name && (
                                      <button 
                                        data-testid="mark-ready-button"
                                        onClick={() => updateOrderStatus(order.id, 'ready')} 
                                        className="px-4 lg:px-6 py-2 bg-green-500 text-white rounded-xl text-[8px] lg:text-[9px] font-black uppercase tracking-widest hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                                      >
                                        {t('markReady')}
                                      </button>
                                    )}
                                    {order.status === 'ready' && role === 'manager' && (
                                      <button 
                                        data-testid="complete-order-button"
                                        onClick={() => updateOrderStatus(order.id, 'completed')} 
                                        className="px-4 lg:px-6 py-2 bg-gray-900 text-white rounded-xl text-[8px] lg:text-[9px] font-black uppercase tracking-widest hover:bg-black transition-colors"
                                      >
                                        {t('finishOrder')}
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                     <div className="flex items-center justify-between px-4">
                      <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">{t('allProducts')}</h3>
                      <div className="relative group">
                        <input 
                          type="text" 
                          data-testid="inventory-search-input"
                          value={inventorySearch} 
                          onChange={(e) => setInventorySearch(e.target.value)} 
                          placeholder={t('searchItems')} 
                          className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-[10px] font-black w-48 lg:w-64 outline-none border border-transparent focus:border-primary/20 transition-all uppercase tracking-widest" 
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="inventory-grid">
                      {filteredInventory.map(product => {
                        const qty = getProductQuantity(selectedBranch, product.id);
                        return (
                          <div key={product.id} className="p-6 bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:shadow-2xl hover:shadow-gray-900/5 transition-all" data-testid={`inventory-item-${product.id}`}>
                            <div className="flex items-center gap-6">
                              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center p-3 shadow-inner group-hover:scale-110 transition-transform"><img src={product.image} className="w-full h-full object-contain" /></div>
                              <div>
                                <p className="text-xs lg:text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight line-clamp-1">{(product as any)[`name_${language}`] || product.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className={`w-1.5 h-1.5 rounded-full ${qty === 0 ? 'bg-red-500' : (qty < 10 ? 'bg-primary' : 'bg-green-500')}`}></div>
                                  <p className="text-[8px] lg:text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                    {qty} {t('unitsInStock')}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-1 lg:p-1.5 rounded-xl border border-gray-100 dark:border-gray-700">
                              <button 
                                data-testid="stock-decrement-button"
                                onClick={() => updateStockAmount(selectedBranch, product.id, qty - 1)} 
                                className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all font-black text-gray-400 hover:text-red-500"
                              >
                                -
                              </button>
                              <span className="px-2 font-black text-[10px] lg:text-xs min-w-[1rem] lg:min-w-[1.5rem] text-center dark:text-white" data-testid="stock-count-display">{qty}</span>
                              <button 
                                data-testid="stock-increment-button"
                                onClick={() => updateStockAmount(selectedBranch, product.id, qty + 1)} 
                                className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all font-black text-gray-400 hover:text-primary"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-4 space-y-8 lg:space-y-12">
                {/* Visual Identity Section */}
                <div className="bg-gray-50 dark:bg-gray-900 p-8 lg:p-10 rounded-[40px] lg:rounded-[48px] border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-lg lg:text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white mb-8">{t('performance')}</h3>
                    <div className="flex items-baseline gap-2 mb-2">
                       <span className="text-3xl lg:text-4xl font-black text-primary">84%</span>
                       <span className="text-[10px] font-black text-green-500 uppercase">↑ High</span>
                    </div>
                    <p className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10 leading-relaxed italic">"Optimal processing efficiency achieved in the last 24h cycle."</p>
                    
                    <div className="space-y-6">
                       {[
                         { label: t('freshnessIndex'), val: 92, color: 'bg-primary' },
                         { label: t('logisticsFlow'), val: 78, color: 'bg-gray-900 dark:bg-white' },
                         { label: t('staffLoad'), val: 45, color: 'bg-green-500' }
                       ].map(metric => (
                         <div key={metric.label}>
                            <div className="flex justify-between text-[9px] font-black uppercase mb-2">
                               <span className="text-gray-400">{metric.label}</span>
                               <span className="dark:text-white">{metric.val}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                               <div className={`${metric.color} h-full rounded-full`} style={{ width: `${metric.val}%` }}></div>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-tr from-primary to-orange-400 p-8 lg:p-10 rounded-[40px] lg:rounded-[48px] shadow-2xl shadow-primary/20 group relative overflow-hidden">
                   <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <h3 className="text-white text-lg lg:text-xl font-black uppercase tracking-tight mb-4">{t('updateStock')}</h3>
                   <p className="text-white/70 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest mb-10 leading-relaxed">{t('expandCatalog')}</p>
                   <button 
                     data-testid="add-product-open-button"
                     onClick={() => setIsAddProductModalOpen(true)} 
                     className="w-full py-4 lg:py-5 bg-white text-primary rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                   >
                     {t('addNewProduct')}
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Product Modal - Surgical & Clean */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-900 rounded-[40px] lg:rounded-[48px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 lg:p-12">
              <div className="flex justify-between items-center mb-10 lg:mb-12">
                <h2 className="text-xl lg:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{t('addNewProduct')}</h2>
                <button 
                  data-testid="close-modal-button"
                  onClick={() => setIsAddProductModalOpen(false)} 
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-8 lg:space-y-10">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">{t('productTitle')}</label>
                  <input 
                    type="text" 
                    required 
                    data-testid="new-product-name-input"
                    value={newProductName} 
                    onChange={(e) => setNewProductName(e.target.value)} 
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none outline-none font-black text-base lg:text-lg dark:text-white focus:ring-4 focus:ring-primary/5 transition-all" 
                    placeholder="e.g. Organic Avocados" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block ml-1">{t('category')}</label>
                    <select 
                      data-testid="new-product-category-select"
                      value={newProductCategory} 
                      onChange={(e) => setNewProductCategory(e.target.value)} 
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-black text-[10px] lg:text-xs dark:text-white border-none outline-none focus:ring-4 focus:ring-primary/5"
                    >
                      {['Food Products', 'Baby Products', 'Cleaning & Sanitary', 'Cosmetics & Personal Care'].map(c => <option key={c} value={c}>{t(c)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block ml-1">{t('unitType')}</label>
                    <input 
                      type="text" 
                      required 
                      data-testid="new-product-unit-input"
                      value={newProductUnit} 
                      onChange={(e) => setNewProductUnit(e.target.value)} 
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-black text-[10px] lg:text-xs dark:text-white border-none outline-none focus:ring-4 focus:ring-primary/5" 
                      placeholder="Pcs / Kg"
                    />
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 lg:p-8 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center">
                    <div className="flex flex-col items-center gap-4 lg:gap-6">
                        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center p-3 shadow-lg">
                            {newProductImage ? <img src={newProductImage} alt="Preview" className="w-full h-full object-contain" /> : <span className="text-2xl grayscale opacity-20">🖼️</span>}
                        </div>
                        <label className="cursor-pointer">
                            <span className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline">{t('uploadIdentity')}</span>
                            <input data-testid="new-product-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                    </div>
                </div>
                <button 
                  type="submit" 
                  data-testid="add-product-submit-button"
                  className="w-full bg-primary text-white py-5 lg:py-6 rounded-2xl font-black uppercase text-[10px] lg:text-xs tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {t('syncCatalog')}
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
