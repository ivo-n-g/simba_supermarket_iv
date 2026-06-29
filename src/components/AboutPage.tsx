import React from 'react';

const AboutPage: React.FC = () => {

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
            About Simba
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium">
            Rwanda's premier shopping destination since 2007
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-black text-primary dark:text-secondary uppercase mb-6">Our History</h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
            <p>
              Founded in 2007, Simba Supermarket has grown to become one of the most trusted and recognized retail brands in Rwanda. What started as a single store in the heart of Kigali has expanded into a network of modern supermarkets serving thousands of customers daily.
            </p>
            <p>
              Our mission is to provide high-quality products at competitive prices while delivering an exceptional shopping experience. We pride ourselves on our wide selection of local and imported goods, fresh produce, bakery items, and household essentials.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary text-white p-8 rounded-[32px] shadow-lg flex flex-col items-center text-center group hover:scale-[1.02] transition-transform">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">📧</span>
            </div>
            <h3 className="text-xl font-black uppercase mb-2">Email Us</h3>
            <p className="text-white/80 mb-4 text-sm">For general inquiries and support</p>
            <a href="mailto:info@simbasupermarket.rw" className="text-base font-bold text-secondary hover:underline">
              info@simbasupermarket.rw
            </a>
          </div>

          <div className="bg-gray-900 text-white p-8 rounded-[32px] shadow-lg flex flex-col items-center text-center group hover:scale-[1.02] transition-transform">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">📞</span>
            </div>
            <h3 className="text-xl font-black uppercase mb-2">Call Us</h3>
            <p className="text-white/80 mb-4 text-sm">Available 08:00 AM - 10:00 PM</p>
            <a href="tel:+250788307200" className="text-base font-bold text-secondary hover:underline">
              +250 788 307 200
            </a>
          </div>

          <div className="bg-primary/5 dark:bg-gray-800 text-gray-900 dark:text-white p-8 rounded-[32px] shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center group hover:scale-[1.02] transition-transform">
            <div className="w-16 h-16 bg-primary/10 dark:bg-white/10 rounded-full flex items-center justify-center mb-4 text-primary dark:text-white">
              <span className="text-3xl">📍</span>
            </div>
            <h3 className="text-xl font-black uppercase mb-2">Head Office</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Nyarugenge District, Kigali</p>
            <address className="not-italic text-sm font-bold text-gray-700 dark:text-gray-300">
              U.T.C Building, 5th Floor<br />
              KN 34 Street, Kiyovu<br />
              Kigali, Rwanda
            </address>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
