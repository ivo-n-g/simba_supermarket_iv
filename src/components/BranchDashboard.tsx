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
    <div className="fixed inset-0 z-[110] flex bg-[#f8f9fe] dark:bg-gray-950 overflow-hidden font-sans" data-testid="branch-dashboard-view">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-primary shrink-0 flex flex-col relative z-20">
        <div className="p-10">
          <div className="flex flex-col items-center mb-12">
            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-4 border border-white/10 shadow-xl">
              <img src="/logo.png" alt="Simba" className="h-8 w-auto object-contain filter drop-shadow-lg" />
            </div>
            <h2 className="text-white font-black text-xl tracking-tighter uppercase">Simba Ops</h2>
          </div>
          
          <nav className="space-y-2">
            {[
              { id: 'orders', label: t('orders'), icon: '📊', testid: 'orders-tab-button' },
              { id: 'inventory', label: t('inventory'), icon: '📦', testid: 'inventory-tab-button' },
              { id: 'tasks', label: 'Task', icon: '📋', testid: 'tasks-tab-button' },
              { id: 'reports', label: 'Report', icon: '🏳️', testid: 'reports-tab-button' },
              { id: 'calendar', label: 'Calendar', icon: '📅', testid: 'calendar-tab-button' },
              { id: 'messages', label: 'Messages', icon: '💬', testid: 'messages-tab-button' }
            ].map(item => (
              <button
                key={item.id}
                data-testid={item.testid}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-white text-primary shadow-2xl scale-[1.02]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-10 space-y-6">
          <div className="bg-white/10 rounded-[32px] p-6 text-center border border-white/10">
            <p className="text-white text-[10px] font-black uppercase tracking-widest mb-4">Shift Timer</p>
            <div className="text-2xl font-black text-secondary">08:24:12</div>
          </div>
          
          <button 
            data-testid="logout-button"
            onClick={() => { if(window.confirm(t('logoutConfirm'))) logout(); }}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-red-500/20 text-red-100 hover:bg-red-500 hover:text-white transition-all group"
          >
            <span>🚪 Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#f8f9fe] dark:bg-gray-950">
        <header className="h-28 bg-white dark:bg-gray-900 flex items-center justify-between px-12 shrink-0 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">Hello, {user?.name.split(' ')[0]}!</h1>
            <p className="text-sm text-gray-400 font-bold mt-1 tracking-wide">Operational Control Center • {selectedBranch}</p>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative">
              <input 
                type="text" 
                data-testid="dashboard-search-input"
                placeholder="Search operational data..." 
                className="pl-14 pr-8 py-4 bg-[#f8f9fe] dark:bg-gray-800 rounded-[20px] text-sm font-bold w-96 outline-none focus:ring-4 focus:ring-primary/5 transition-all" 
              />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
            </div>
            
            <div className="flex items-center gap-4 pl-8 border-l border-gray-100 dark:border-gray-800">
              <div className="text-right">
                <p className="text-sm font-black uppercase text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">{role}</p>
              </div>
              <div className="w-14 h-14 bg-primary rounded-[20px] overflow-hidden border-4 border-white shadow-xl flex items-center justify-center text-white font-black text-xl">
                {user?.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover" /> : user?.name[0]}
              </div>
              {!hideClose && (
                <button 
                  data-testid="close-dashboard-button"
                  onClick={onClose}
                  className="ml-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:text-red-500 transition-colors font-black"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-primary p-10 rounded-[48px] shadow-2xl relative overflow-hidden text-white group transform hover:scale-[1.02] transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10 transition-transform group-hover:scale-125"></div>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">Pending Orders</p>
                <p className="text-6xl font-black" data-testid="pending-orders-count">{stats.pending}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-900 p-10 rounded-[48px] shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden group transform hover:scale-[1.02] transition-all">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Ready to Pickup</p>
                <p className="text-6xl font-black text-gray-900 dark:text-white" data-testid="ready-orders-count">{stats.ready}</p>
                <div className="mt-8 w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-10 rounded-[48px] shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden group transform hover:scale-[1.02] transition-all">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Branch Sales</p>
                <p className="text-6xl font-black text-gray-900 dark:text-white" data-testid="branch-sales-total">{stats.sales}</p>
                <p className="mt-8 text-[11px] font-black text-green-500 uppercase flex items-center gap-2">
                  <span className="p-1 bg-green-50 rounded-lg">↑ 12%</span>
                  <span className="text-gray-400 font-bold lowercase tracking-normal">increase from yesterday</span>
                </p>
              </div>
            </div>

            {/* Feature Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-10">
                {activeTab === 'orders' ? (
                  <div className="bg-white dark:bg-gray-900 p-10 rounded-[56px] shadow-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">Active Queue</h3>
                      <div className="flex gap-4">
                        <button className="px-5 py-2.5 bg-[#f8f9fe] dark:bg-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100 dark:border-gray-700">Filter ⚡</button>
                        <button className="px-5 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">📥 Reports</button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left" data-testid="orders-table">
                        <thead>
                          <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-gray-800">
                            <th className="pb-6">Customer Name</th>
                            <th className="pb-6">Pick-up Time</th>
                            <th className="pb-6 text-center">Items</th>
                            <th className="pb-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="py-20 text-center">
                                <div className="flex flex-col items-center gap-4 opacity-30">
                                  <span className="text-6xl">📦</span>
                                  <p className="font-black uppercase tracking-widest text-xs">{t('noOrdersFoundBranch')}</p>
                                </div>
                              </td>
                            </tr>
                          ) : filteredOrders.map(order => (
                            <tr key={order.id} className="group transition-all hover:bg-gray-50/50 dark:hover:bg-gray-800/30" data-testid={`order-row-${order.id}`}>
                              <td className="py-8">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center font-black text-primary text-sm shadow-inner uppercase">{order.customerName[0]}</div>
                                  <div>
                                    <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{order.customerName}</p>
                                    <p className="text-[10px] font-bold text-gray-400 tracking-widest">ID: {order.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-8 text-xs font-black text-primary uppercase">{order.pickupTime}</td>
                              <td className="py-8 text-center">
                                <span className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-[11px] font-black dark:text-white">{order.items.length}</span>
                              </td>
                              <td className="py-8 text-right">
                                <div className="flex justify-end gap-3">
                                  {order.status === 'pending' && role === 'manager' && (
                                    <button 
                                      data-testid="assign-order-button"
                                      onClick={() => updateOrderStatus(order.id, 'assigned', user?.name || 'Staff')} 
                                      className="px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md"
                                    >
                                      Assign
                                    </button>
                                  )}
                                  {order.status === 'assigned' && order.assignedStaff === user?.name && (
                                    <button 
                                      data-testid="mark-ready-button"
                                      onClick={() => updateOrderStatus(order.id, 'ready')} 
                                      className="px-6 py-2.5 bg-secondary text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md"
                                    >
                                      Ready
                                    </button>
                                  )}
                                  {order.status === 'ready' && role === 'manager' && (
                                    <button 
                                      data-testid="complete-order-button"
                                      onClick={() => updateOrderStatus(order.id, 'completed')} 
                                      className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md"
                                    >
                                      Finish
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
                ) : (
                  <div className="bg-white dark:bg-gray-900 p-10 rounded-[56px] shadow-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                      <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">Inventory Control</h3>
                      <div className="relative flex-1 max-w-md">
                        <input 
                          type="text" 
                          data-testid="inventory-search-input"
                          value={inventorySearch} 
                          onChange={(e) => setInventorySearch(e.target.value)} 
                          placeholder="Search catalog..." 
                          className="w-full pl-12 pr-6 py-4 bg-[#f8f9fe] dark:bg-gray-800 rounded-2xl text-xs font-bold border-none outline-none focus:ring-4 focus:ring-primary/5 transition-all" 
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20">🔍</span>
                      </div>
                    </div>
                    {inventorySearch && (
                      <div className="mb-4 text-[10px] font-black uppercase text-primary" data-testid="search-results-summary">
                        {t('searchResults')}: <span className="text-gray-900 dark:text-white">"{inventorySearch}"</span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="inventory-grid">
                      {filteredInventory.map(product => {
                        const qty = getProductQuantity(selectedBranch, product.id);
                        return (
                          <div key={product.id} className="p-6 bg-[#f8f9fe] dark:bg-gray-800/50 rounded-[32px] border border-gray-100 dark:border-gray-700 flex items-center justify-between group transition-all hover:bg-white dark:hover:bg-gray-800 shadow-sm hover:shadow-xl" data-testid={`inventory-item-${product.id}`}>
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-[20px] flex items-center justify-center p-3 shadow-inner"><img src={product.image} className="w-full h-full object-contain" /></div>
                              <div>
                                <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight line-clamp-1">{product.name}</p>
                                <p className={`text-[10px] font-black uppercase mt-1 ${qty === 0 ? 'text-red-500' : (qty < 10 ? 'text-[#ff6b00]' : 'text-green-500')}`} data-testid="stock-status">
                                  {qty === 0 ? '0 left' : `${qty} left`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-1.5 rounded-xl shadow-inner scale-90">
                              <button 
                                data-testid="stock-decrement-button"
                                onClick={() => updateStockAmount(selectedBranch, product.id, qty - 1)} 
                                className="w-8 h-8 flex items-center justify-center hover:bg-primary hover:text-white rounded-lg transition-all font-black text-primary"
                              >
                                -
                              </button>
                              <span className="px-2 font-black text-xs min-w-[1.5rem] text-center dark:text-white" data-testid="stock-count-display">{qty}</span>
                              <button 
                                data-testid="stock-increment-button"
                                onClick={() => updateStockAmount(selectedBranch, product.id, qty + 1)} 
                                className="w-8 h-8 flex items-center justify-center hover:bg-primary hover:text-white rounded-lg transition-all font-black text-primary"
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

              <div className="lg:col-span-4 space-y-10">
                {/* Distribution Chart Style */}
                <div className="bg-white dark:bg-gray-900 p-10 rounded-[56px] shadow-2xl border border-gray-100 dark:border-gray-800">
                  <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white mb-10">Usage Distribution</h3>
                  <div className="flex justify-center mb-10 relative">
                    <div className="w-52 h-52 rounded-full border-[18px] border-primary flex items-center justify-center">
                       <div className="absolute inset-0 rounded-full border-r-[18px] border-secondary transform rotate-45"></div>
                       <div className="absolute inset-0 rounded-full border-b-[18px] border-green-500 transform -rotate-12"></div>
                       <div className="text-center">
                          <p className="text-4xl font-black text-gray-900 dark:text-white">72%</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase">Load</p>
                       </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'Food Products', color: 'bg-primary', val: '60%' },
                      { label: 'Staff Efficiency', color: 'bg-green-500', val: '25%' },
                      { label: 'Client Feedback', color: 'bg-secondary', val: '15%' }
                    ].map(i => (
                      <div key={i.label} className="flex items-center justify-between text-[10px] font-black uppercase">
                        <div className="flex items-center gap-3"><div className={`w-2.5 h-2.5 rounded-full ${i.color}`}></div><span className="text-gray-400">{i.label}</span></div>
                        <span className="dark:text-white">{i.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary p-10 rounded-[56px] shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615719413546-198b25453f85?auto=format&fit=crop&q=80&w=600')] bg-cover opacity-10 group-hover:scale-110 transition-transform duration-700"></div>
                   <h3 className="text-white text-xl font-black uppercase tracking-tight mb-4 relative z-10">Add Catalog</h3>
                   <p className="text-white/60 text-xs font-bold mb-8 relative z-10 leading-relaxed italic">"Instantly add new items to the branch stock database."</p>
                   <button 
                     data-testid="add-product-open-button"
                     onClick={() => setIsAddProductModalOpen(true)} 
                     className="w-full py-5 bg-white text-primary rounded-[28px] font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all relative z-10"
                   >
                     Open Creator Form
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Product Modal */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-primary/30 backdrop-blur-xl">
          <div className="bg-white dark:bg-gray-800 rounded-[64px] shadow-[0_64px_128px_-24px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden animate-in zoom-in duration-500 border-[12px] border-white/10">
            <div className="p-12 md:p-16">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-3xl font-black text-primary dark:text-secondary uppercase tracking-tight">New Inventory Item</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Global catalog expansion</p>
                </div>
                <button 
                  data-testid="close-modal-button"
                  onClick={() => setIsAddProductModalOpen(false)} 
                  className="text-gray-400 hover:text-red-500 p-4 bg-[#f8f9fe] dark:bg-gray-900 rounded-full transition-all"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-10">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Display Name</label>
                  <input 
                    type="text" 
                    required 
                    data-testid="new-product-name-input"
                    value={newProductName} 
                    onChange={(e) => setNewProductName(e.target.value)} 
                    className="w-full px-10 py-6 bg-[#f8f9fe] dark:bg-gray-900 border-none rounded-[32px] focus:ring-8 focus:ring-primary/5 outline-none font-black text-lg dark:text-white" 
                    placeholder="e.g. Fresh Mangoes" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Category</label>
                    <select 
                      data-testid="new-product-category-select"
                      value={newProductCategory} 
                      onChange={(e) => setNewProductCategory(e.target.value)} 
                      className="px-8 py-6 bg-[#f8f9fe] dark:bg-gray-900 border-none rounded-[32px] font-black text-sm dark:text-white outline-none focus:ring-4 focus:ring-primary/5"
                    >
                      {['Food Products', 'Baby Products', 'Cleaning & Sanitary', 'Cosmetics & Personal Care'].map(c => <option key={c} value={c}>{t(c)}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Unit</label>
                    <input 
                      type="text" 
                      required 
                      data-testid="new-product-unit-input"
                      value={newProductUnit} 
                      onChange={(e) => setNewProductUnit(e.target.value)} 
                      className="px-10 py-6 bg-[#f8f9fe] dark:bg-gray-900 border-none rounded-[32px] font-black text-sm dark:text-white outline-none focus:ring-4 focus:ring-primary/5" 
                    />
                  </div>
                </div>
                <div className="bg-[#f8f9fe] dark:bg-gray-900 p-10 rounded-[48px] border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl overflow-hidden flex items-center justify-center border-4 border-white dark:border-gray-700 shrink-0">
                            {newProductImage ? <img src={newProductImage} alt="Preview" className="w-full h-full object-contain p-4" /> : <span className="text-4xl opacity-20">🖼️</span>}
                        </div>
                        <label className="flex-1 w-full cursor-pointer">
                            <div className="w-full px-10 py-6 bg-primary text-white rounded-[32px] text-center font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all">Upload Product Image</div>
                            <input 
                              type="file" 
                              data-testid="new-product-image-upload"
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleImageUpload} 
                            />
                        </label>
                    </div>
                </div>
                <button 
                  type="submit" 
                  data-testid="add-product-submit-button"
                  className="w-full bg-secondary text-primary py-8 rounded-[32px] font-black text-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] active:scale-95 transition-all uppercase tracking-tighter border-b-8 border-black/10"
                >
                  Confirm Catalog Sync
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
