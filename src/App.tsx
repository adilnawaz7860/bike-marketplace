/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Bike as BikeIcon, AlertCircle, Sparkles } from 'lucide-react';

import { Bike, FilterState, Language } from './types';
import { translations } from './translations';
import { initialBikes } from './data/bikes';

import LanguageSelector from './components/LanguageSelector';
import Filters from './components/Filters';
import BikeCard from './components/BikeCard';
import SellBikeModal from './components/SellBikeModal';

// Static Import Reference of our beautiful generated Sunset Motorcycle Hero Banner
const heroPng = '/src/assets/images/bike_marketplace_hero_1780634328875.png';

export default function App() {
  // 1. Language State (default English)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('bike_lang');
    return (saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('bike_lang', lang);
  }, [lang]);

  // 2. Bikes Listings State with localStorage persistence
  const [bikes, setBikes] = useState<Bike[]>(() => {
    const saved = localStorage.getItem('bike_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved bikes", e);
      }
    }
    return initialBikes;
  });

  useEffect(() => {
    localStorage.setItem('bike_list', JSON.stringify(bikes));
  }, [bikes]);

  // 3. Filter States
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    category: '',
    condition: '',
    sortBy: 'recent'
  });

  // 4. Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dynamic list of unique Brands from available inventory
  const uniqueBrands = Array.from(new Set(bikes.map(b => b.brand))).sort() as string[];

  // Handle adding custom bike from form
  const handleAddBike = (newBikeData: Omit<Bike, 'id' | 'dateAdded'>) => {
    const newBike: Bike = {
      ...newBikeData,
      id: `custom-bike-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
      isPremium: false // User generated listings are organic
    };
    setBikes([newBike, ...bikes]);
  };

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updated }));
  };

  // 5. Processing, filtering, and sorting
  const filteredBikes = bikes.filter(bike => {
    // A. Brand Search / Name Keyword
    const query = filters.searchQuery.toLowerCase().trim();
    if (query) {
      const matchBrand = bike.brand.toLowerCase().includes(query);
      const matchModel = bike.model.toLowerCase().includes(query);
      const matchDesc = bike.description.toLowerCase().includes(query);
      const matchLocation = bike.location.toLowerCase().includes(query);
      if (!matchBrand && !matchModel && !matchDesc && !matchLocation) return false;
    }

    // B. Brand Dropdown
    if (filters.brand && bike.brand !== filters.brand) return false;

    // C. Category Dropdown
    if (filters.category && bike.category !== filters.category) return false;

    // D. Condition Dropdown
    if (filters.condition && bike.condition !== filters.condition) return false;

    // E. Min price
    if (filters.minPrice) {
      const minNum = parseFloat(filters.minPrice);
      if (!isNaN(minNum) && bike.price < minNum) return false;
    }

    // F. Max price
    if (filters.maxPrice) {
      const maxNum = parseFloat(filters.maxPrice);
      if (!isNaN(maxNum) && bike.price > maxNum) return false;
    }

    return true;
  });

  // Sorting
  const sortedBikes = [...filteredBikes].sort((a, b) => {
    // Sort logic
    switch (filters.sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'year_new':
        return b.year - a.year;
      case 'km_low':
        return a.kmRun - b.kmRun;
      case 'recent':
      default:
        // Featured / Premium listings always stay at the very top of sorting as priority
        if (a.isPremium && !b.isPremium) return -1;
        if (!a.isPremium && b.isPremium) return 1;
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gray-50/70 dark:bg-zinc-950 text-gray-800 dark:text-zinc-150 transition-colors duration-300">
      
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <BikeIcon size={22} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
              {t.appName}
            </span>
          </div>

          {/* Settings & CTAs */}
          <div className="flex items-center gap-3">
            {/* Bilingual language switcher */}
            <LanguageSelector currentLanguage={lang} onLanguageChange={setLang} />

            {/* Sell Post Button commented out for now
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-bold text-sm rounded-full shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
              id="sell-my-bike-header-btn"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>{t.sellBtn}</span>
            </button>
            */}
          </div>

        </div>
      </header>

      {/* HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-zinc-900 text-white py-16 sm:py-24">
        {/* Background Overlay with sunset photo */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroPng}
            alt="Motorcycle on sunset route"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35"
            onError={(e) => {
              // local fallback photo if dynamic generated image fails path resolution
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900/90 to-transparent" />
        </div>

        {/* Hero Content container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-2xl">
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4"
            >
              <Sparkles size={12} />
              <span>{lang === 'en' ? 'Direct Owner Deals' : 'सीधे मालिक से डील'}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight"
            >
              {t.heroTitle}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-lg mb-8"
            >
              {t.heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => {
                  const element = document.getElementById('search-listings-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white hover:bg-gray-100 text-zinc-900 font-bold px-6 py-3 rounded-xl shadow-md transition-all text-sm cursor-pointer"
              >
                {lang === 'en' ? 'Browse Bikes' : 'बाईक देखें'}
              </button>
              
              {/* Commented out Sell button for now
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-amber-500/15 hover:shadow-amber-500/20 transition-all text-sm cursor-pointer"
              >
                {t.sellBtn}
              </button>
              */}
            </motion.div>

          </div>
        </div>
      </section>

      {/* SEARCH AND BIKE LISTINGS SECTION */}
      <main id="search-listings-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
        
        {/* Filters Panel component */}
        <Filters
          filters={filters}
          onFilterChange={handleFilterChange}
          brands={uniqueBrands}
          lang={lang}
          t={t}
          totalCount={sortedBikes.length}
        />

        {/* Dynamic Bike Grid Layout */}
        <div className="mt-8">
          <AnimatePresence mode="popLayout">
            {sortedBikes.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {sortedBikes.map((bike) => (
                  <BikeCard
                    key={bike.id}
                    bike={bike}
                    lang={lang}
                    t={t}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-16 text-center max-w-md mx-auto"
              >
                <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-4 border border-gray-100 dark:border-zinc-700">
                  <AlertCircle size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-150 mb-1">
                  {lang === 'en' ? 'No Matches Found' : 'कोई मिलान नहीं मिला'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6 leading-relaxed">
                  {t.noBikesFound}
                </p>
                <button
                  onClick={() => handleFilterChange({
                    searchQuery: '',
                    brand: '',
                    minPrice: '',
                    maxPrice: '',
                    category: '',
                    condition: '',
                    sortBy: 'recent'
                  })}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {t.resetFilters}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 mt-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            &copy; {new Date().getFullYear()} {t.appName}. {lang === 'en' ? 'All rights reserved.' : 'सर्वाधिकार सुरक्षित।'}
          </div>
          <div className="flex items-center gap-6 text-gray-500 dark:text-zinc-400 font-semibold">
            <span>Direct WhatsApp Owners P2P Handles</span>
            <span>&bull;</span>
            <span>English / हिन्दी bilingual interface</span>
          </div>
        </div>
      </footer>

      {/* SELL MODAL COMPONENT */}
      <SellBikeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddBike={handleAddBike}
        t={t}
        lang={lang}
      />

    </div>
  );
}
