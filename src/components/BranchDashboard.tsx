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
  const { user, orders, updateOrderStatus, pickupBranch, updateStockAmount, getProductQuantity } = useStore();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<DashboardTab>('orders');
  const [inventorySearch, setInventorySearch] = useState('');
  const selectedBranch = pickupBranch || user?.branch || 'Simba Supermarket Remera';
  const role = user?.repRole || 'staff';

  const filteredOrders = orders.filter(order => order.branch === selectedBranch);

  const filteredInventory = useMemo(() => {
    const query = inventorySearch.toLowerCase();
    return productsData.products.filter(p => {
      const name = ((p as any)[`name_${language}`] || p.name).toLowerCase();
      return name.includes(query) || p.id.toString().includes(query);
    }).slice(0, 50); // Show first 50 results for performance
  }, [inventorySearch, language]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] overflow-hidden">
      <div className="absolute inset-0 bg-primary/20 backdrop-blur-xl" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 w-full max-w-4xl bg-gray-50 dark:bg-gray-900 shadow-2xl flex flex-col transform transition-transform duration-500">
        <div className="px-6 py-8 bg-primary text-white flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
              <span className="bg-secondary text-primary px-3 py-1 rounded-xl text-sm">{selectedBranch.split(' ').pop()}</span>
              {t('branchDashboard')}
            </h2>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg ${role === 'manager' ? 'bg-secondary text-primary' : 'bg-white/20 text-white border border-white/10'}`}>
                {role === 'manager' ? 'Branch Manager' : 'Branch Staff'}
              </span>
              {!hideClose && (
                <button onClick={onClose} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <div className="flex justify-end items-end">
            <div className="flex gap-6 border-b border-white/10 w-full md:w-auto">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex-1 md:flex-none pb-2 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'orders' ? 'border-secondary text-secondary' : 'border-transparent opacity-40 hover:opacity-100'}`}
              >
                Orders
              </button>
              <button 
                onClick={() => setActiveTab('inventory')}
                className={`flex-1 md:flex-none pb-2 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'inventory' ? 'border-secondary text-secondary' : 'border-transparent opacity-40 hover:opacity-100'}`}
              >
                Inventory
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === 'orders' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.length === 0 ? (
                <div className="col-span-full py-20 text-center opacity-30 italic font-bold text-gray-400">
                  No orders found for this branch.
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-gray-800 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Order ID</span>
                        <span className="font-black text-primary dark:text-secondary">#{order.id}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'ready' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="border-t border-b border-gray-50 dark:border-gray-700 py-4 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400 font-bold uppercase">Customer</span>
                        <span className="font-black dark:text-white">{order.customerName}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400 font-bold uppercase">Time</span>
                        <span className="font-black text-primary dark:text-secondary">{order.pickupTime}</span>
                      </div>
                    </div>

                    <div className="space-y-1 max-h-24 overflow-y-auto pr-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-[10px] font-bold text-gray-500">
                          <span>{item.quantity}x {item.name}</span>
                          <span>{(item.price * item.quantity).toLocaleString()} RWF</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 flex flex-col gap-2">
                      {order.assignedStaff && (
                        <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                          <span className="text-[10px]">👤</span>
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Assigned: {order.assignedStaff}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        {role === 'manager' && order.status === 'pending' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'assigned', user?.name || 'Staff Member')}
                            className="flex-1 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-md active:scale-95"
                          >
                            {t('assign')} To Me
                          </button>
                        )}
                        {(role === 'staff' || role === 'manager') && order.status === 'assigned' && order.assignedStaff === user?.name && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="flex-1 py-3 bg-secondary text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-md active:scale-95"
                          >
                            {t('markReady')}
                          </button>
                        )}
                        {order.status === 'ready' && role === 'manager' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="flex-1 py-3 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-md active:scale-95"
                          >
                            Complete Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-[32px] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-black text-gray-800 dark:text-white uppercase tracking-tighter">Branch Inventory</h3>
                  <p className="text-xs text-gray-400 font-bold">Manage product availability for {selectedBranch}</p>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search products..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl text-xs font-bold focus:ring-2 focus:ring-secondary outline-none w-full md:w-64 transition-all"
                  />
                  <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-700 max-h-[60vh] overflow-y-auto">
                {filteredInventory.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 italic font-bold">No products found.</div>
                ) : (
                  filteredInventory.map(product => {
                    const quantity = getProductQuantity(selectedBranch, product.id);
                    return (
                      <div key={product.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 dark:border-gray-700">
                            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" />
                          </div>
                          <div>
                            <p className="font-black text-xs md:text-sm dark:text-white text-gray-800 uppercase tracking-tight line-clamp-1">
                              {(product as any)[`name_${language}`] || product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[9px] font-black text-primary dark:text-secondary bg-primary/5 px-1.5 py-0.5 rounded">#{product.id}</span>
                              <span className={`text-[9px] font-black uppercase tracking-widest ${quantity === 0 ? 'text-red-500' : quantity < 5 ? 'text-orange-500' : 'text-green-500'}`}>
                                {quantity === 0 ? 'Out of Stock' : `${quantity} in stock`}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1 border border-gray-200 dark:border-gray-600">
                            <button 
                              onClick={() => updateStockAmount(selectedBranch, product.id, quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all font-black text-primary dark:text-secondary"
                            >
                              -
                            </button>
                            <input 
                              type="number" 
                              value={quantity}
                              onChange={(e) => updateStockAmount(selectedBranch, product.id, parseInt(e.target.value) || 0)}
                              className="w-12 bg-transparent text-center font-black text-xs text-primary dark:text-secondary outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button 
                              onClick={() => updateStockAmount(selectedBranch, product.id, quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all font-black text-primary dark:text-secondary"
                            >
                              +
                            </button>
                          </div>
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
    </div>
  );
};

export default BranchDashboard;
