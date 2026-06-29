import React from 'react';
import { useStore } from '../context/StoreContext';

const BranchesPage: React.FC = () => {
  const { locations } = useStore();

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">
          Our Branches
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-12">
          Visit any of our Simba Supermarket locations across Kigali for the best shopping experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations.map((loc) => (
            <div key={loc.name} className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-[24px] shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group">
              <h3 className="text-xl md:text-2xl font-black text-primary dark:text-secondary uppercase mb-2 group-hover:scale-[1.02] transition-transform transform origin-left">
                {loc.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-medium mb-4 flex items-start gap-2">
                <span className="mt-1">📍</span>
                {loc.address}
              </p>
              
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Opening Hours</h4>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span className="font-bold">Monday - Saturday</span>
                    <span>08:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Sunday</span>
                    <span>09:00 AM - 09:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BranchesPage;
