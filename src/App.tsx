/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Bike as BikeIcon, AlertCircle, Sparkles, Sun, Moon, Phone, Clock, MapPin, MessageSquare, Award, ShieldCheck, Instagram, Facebook, Twitter, Youtube, Users, CheckCircle, ChevronLeft, ChevronRight, Star } from 'lucide-react';

import { Bike, FilterState, Language } from './types';
import { translations } from './translations';
import { initialBikes } from './data/bikes';

import LanguageSelector from './components/LanguageSelector';
import Filters from './components/Filters';
import BikeCard from './components/BikeCard';
import SellBikeModal from './components/SellBikeModal';

// Static Import Reference of our beautiful generated Sunset Motorcycle Hero Banner
const heroPng = '/src/assets/images/bike_marketplace_hero_1780634328875.png';
const ownerPng = '/src/assets/images/owner_roopam_1780674085518.png';

// Authentic Hindu & Muslim customer reviews reflecting Lucknow clientele appreciative of Roopam
const customerReviews = [
  {
    id: 1,
    name: "Rohan Sharma",
    location: "Aliganj, Lucknow",
    rating: 5,
    bike: "Royal Enfield Classic 350",
    reviewEn: "Met Mr. Roopam directly and got an amazing deal on a Classic 350. Transparency at its best. The registration transfer was handled completely by them automatically within 7 days. Best pre-owned bike showroom in Lucknow!",
    reviewHi: "रूपम जी से मिलकर सीधे बातचीत हुई और बुलेट 350 पर बेहतरीन डील मिली। लखनऊ का सबसे पारदर्शी और ईमानदार शो-रूम। आरसी ट्रांसफर की जिम्मेदारी शोरूम ने खुद लेकर 7 दिन में काम पूरा करा दिया।"
  },
  {
    id: 2,
    name: "Mohammad Anas",
    location: "Hazratganj, Lucknow",
    rating: 5,
    bike: "Yamaha R15 V4",
    reviewEn: "I was highly skeptical about buying a second hand sports bike, but Roopam Auto Sales gave me a fully certified bike with 45 mechanical check points. Absolutely satisfied with the transparent engine report offered.",
    reviewHi: "सेकंड हैंड स्पोर्ट्स बाइक लेने में काफी संकोच था, पर रूपम ऑटो सेल्स पर मुझे 45 पॉइंट्स मैकेनिकली सर्टिफाइड यामाहा मिली। इंजन रिपोर्ट और पारदर्शी बातचीत से पूरी तरह से संतुष्ट हूँ।"
  },
  {
    id: 3,
    name: "Anjali Mishra",
    location: "Gomti Nagar, Lucknow",
    rating: 5,
    bike: "Honda Activa 6G",
    reviewEn: "Bought an Activa 6G for my daily office commute. The pricing was completely direct and without any hidden middleman charges. Mr. Roopam personally verified the battery and double-checked the brakes before delivery.",
    reviewHi: "रोजाना ऑफिस जाने के लिए एक्टिवा 6G खरीदी। बिना किसी दलाली या छिपे हुए खर्च के सीधे मालिक वाली डील मिली। रूपम जी ने खुद गाड़ी की बैटरी और नए ब्रेक चेक कर डिलीवरी दी।"
  },
  {
    id: 4,
    name: "Vikramaditya Singh",
    location: "Indira Nagar, Lucknow",
    rating: 5,
    bike: "KTM Duke 250",
    reviewEn: "The collection here is genuinely superior and very clean. Got a mint condition KTM Duke 250. Trustworthy documents, verified insurance, and Mr. Roopam's welcoming demeanor makes this the place to buy bikes.",
    reviewHi: "यहाँ उपलब्ध गाड़ियों का कलेक्शन वाकई बहुत शानदार और साफ़-सुथरा है। बिल्कुल ब्रांड न्यू जैसी हालत में KTM ड्यूक मिली। सारे कागजात पक्के और रूपम भाई का व्यवहार बहुत ही बढ़िया है।"
  }
];

export default function App() {
  // Theme state (defaulting to dark mode)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('bike_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  // Screen/Tab state
  const [activeTab, setActiveTab] = useState<'catalog' | 'about' | 'contact'>('catalog');

  // 1. Language State (default English)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('bike_lang');
    return (saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('bike_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('bike_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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
  const [addressCopied, setAddressCopied] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);

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

    // d. Condition Dropdown
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
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-[1.01]" onClick={() => setActiveTab('catalog')}>
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <BikeIcon size={22} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
              {t.appName}
            </span>
          </div>

          {/* DESKTOP NAVIGATION TABS */}
          <nav className="hidden md:flex items-center gap-1.5 bg-gray-100/80 dark:bg-zinc-800/60 p-1.5 rounded-2xl border border-gray-200/50 dark:border-zinc-700/40 shadow-inner">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4.5 py-2 rounded-xl text-sm font-extrabold tracking-tight transition-all duration-200 cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/25'
                  : 'text-gray-650 dark:text-zinc-350 hover:text-gray-950 dark:hover:text-white'
              }`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4.5 py-2 rounded-xl text-sm font-extrabold tracking-tight transition-all duration-200 cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/25'
                  : 'text-gray-650 dark:text-zinc-350 hover:text-gray-950 dark:hover:text-white'
              }`}
            >
              {t.navAbout}
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-4.5 py-2 rounded-xl text-sm font-extrabold tracking-tight transition-all duration-200 cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/25'
                  : 'text-gray-650 dark:text-zinc-350 hover:text-gray-950 dark:hover:text-white'
              }`}
            >
              {t.navContact}
            </button>
          </nav>

          {/* Settings & CTAs */}
          <div className="flex items-center gap-2.5">
            {/* Bilingual language switcher */}
            <LanguageSelector currentLanguage={lang} onLanguageChange={setLang} />

            {/* Theme toggle switch */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-gray-700 dark:text-zinc-200 shadow-xs transition-all duration-200 cursor-pointer flex items-center justify-center border border-gray-200/40 dark:border-zinc-700/60"
              aria-label={t.themeModeLabel}
              title={t.themeModeLabel}
              id="theme-switcher-toggle"
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-amber-400 animate-pulse" />
              ) : (
                <Moon size={18} className="text-zinc-700" />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE SCROLLABLE NAVIGATION */}
      <div className="md:hidden sticky top-[72px] z-30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-gray-150/80 dark:border-zinc-800/80 px-4 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none transition-all duration-200">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/10'
              : 'bg-gray-100 dark:bg-zinc-850 text-gray-600 dark:text-zinc-350 border border-gray-200/20 dark:border-zinc-800'
          }`}
        >
          {t.navHome}
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
            activeTab === 'about'
              ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/10'
              : 'bg-gray-100 dark:bg-zinc-850 text-gray-600 dark:text-zinc-350 border border-gray-200/20 dark:border-zinc-800'
          }`}
        >
          {t.navAbout}
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
            activeTab === 'contact'
              ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/10'
              : 'bg-gray-100 dark:bg-zinc-850 text-gray-600 dark:text-zinc-350 border border-gray-200/20 dark:border-zinc-800'
          }`}
        >
          {t.navContact}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'catalog' && (
          <motion.div
            key="catalog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* HERO BANNER SECTION */}
            <section className="relative overflow-hidden bg-zinc-900 text-white py-16 sm:py-24 animate-fade-in">
              {/* Background Overlay with sunset photo */}
              <div className="absolute inset-0 z-0 select-none pointer-events-none">
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
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900/95 to-transparent" />
              </div>

              {/* Hero Content container */}
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                <div className="max-w-2xl">
                  
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4"
                  >
                    <Sparkles size={12} />
                    <span>{lang === 'en' ? 'Direct Owner Deals' : 'सीधे मालिक से डील'}</span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.08 }}
                    className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight"
                  >
                    {t.heroTitle}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-lg mb-8 font-light"
                  >
                    {t.heroSubtitle}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.22 }}
                    className="flex flex-wrap gap-4"
                  >
                    <button
                      onClick={() => {
                        const element = document.getElementById('search-listings-section');
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-white hover:bg-gray-100 text-zinc-900 font-extrabold px-6 py-3 rounded-xl shadow-md transition-all text-sm cursor-pointer"
                    >
                      {lang === 'en' ? 'Browse Bikes' : 'बाईक देखें'}
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('contact');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-6 py-3 rounded-xl shadow-md shadow-amber-500/15 hover:shadow-amber-500/20 hover:scale-[1.02] transition-colors text-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <MapPin size={16} />
                      <span>{lang === 'en' ? 'Store Location' : 'शोरूम स्थान'}</span>
                    </button>
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
                      <p className="text-sm text-gray-550 dark:text-zinc-400 mb-6 leading-relaxed">
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
          </motion.div>
        )}

        {activeTab === 'about' && (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
          >
            {/* About Dealership Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
              <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-amber-500 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-5">
                <Award size={14} className="text-amber-500" />
                <span>{lang === 'en' ? 'Established Since 2016' : 'साल 2016 से स्थापित'}</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white tracking-tight mb-4 sm:leading-tight">
                {t.aboutTitle}
              </h2>
              <p className="text-gray-500 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
                {lang === 'en'
                  ? "More than just a dealership—we are Lucknow's gold standard for premium selected certified pre-owned bikes for over 10 years."
                  : 'सिर्फ एक डीलरशिप नहीं - हम 10 से अधिक वर्षों से लखनऊ में प्रीमियम चुनी हुई और प्रमाणित सेकंड-हैंड बाइकों के नंबर वन विश्वसनीय शोरूम हैं।'}
              </p>
              <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mx-auto my-6" />
            </div>

            {/* Bento Grid Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {[
                { label: lang === 'en' ? 'Years Of Trust' : 'वर्षों का अटूट विश्वास', val: "10+", icon: <Award className="text-amber-500" /> },
                { label: lang === 'en' ? 'Satisfied Deliveries' : 'संतुष्ट राइडर्स', val: "10,000+", icon: <Users className="text-emerald-500" /> },
                { label: lang === 'en' ? 'Certified Quality' : 'सत्यापित गाड़ियां', val: "100%", icon: <ShieldCheck className="text-blue-500" /> },
                { label: lang === 'en' ? 'Direct Dealings' : 'ऑटो ट्रांसपेरेंट डील्स', val: "P2P Best", icon: <CheckCircle className="text-purple-500" /> },
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 shadow-xs text-center flex flex-col items-center justify-center hover:scale-[1.03] hover:shadow-md transition-all duration-200">
                  <div className="p-2.5 bg-gray-50 dark:bg-zinc-950 rounded-xl mb-3 border border-gray-100 dark:border-zinc-800">
                    {stat.icon}
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white mb-1">
                    {stat.val}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Grid Split Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
              <div className="space-y-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white mb-2 tracking-tight flex items-center gap-2">
                  <Sparkles className="text-amber-500" size={20} />
                  <span>{t.aboutYearsHeading}</span>
                </h3>
                <p className="text-gray-500 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
                  {t.aboutText1}
                </p>
                <p className="text-gray-555 dark:text-zinc-400 text-sm sm:text-base leading-relaxed font-light">
                  {t.aboutText2}
                </p>
              </div>

              {/* Dynamic visual representation block */}
              <div className="relative rounded-3xl overflow-hidden bg-zinc-900 aspect-video md:aspect-square flex items-center justify-center p-6 text-center shadow-lg border border-gray-200/50 dark:border-zinc-800/80">
                <img
                  src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600"
                  alt="Premium Royal Enfield Classic Cruiser in store"
                  className="absolute inset-0 w-full h-full object-cover opacity-45 select-none pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/80 to-transparent" />
                <div className="relative z-10 max-w-sm">
                  <span className="bg-amber-500/20 text-amber-300 font-bold text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border border-amber-500/30">
                    {t.establishedSince}
                  </span>
                  <p className="text-white text-xl sm:text-2xl font-black mt-4 mb-5 leading-snug tracking-tight">
                    {lang === 'en' 
                      ? "Lucknow's Gold Standard for Pre-owned Two Wheelers" 
                      : "पुरानी दोपहिया गाड़ियों के लिए लखनऊ का सर्वश्रेठ शोरूम"}
                  </p>
                  <button 
                    onClick={() => {
                      setActiveTab('catalog');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer hover:scale-[1.02] transition-all"
                  >
                    <span>{lang === 'en' ? 'Explore Bikes Catalog' : 'गाड़ियां देखें'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Owner Section */}
            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 shadow-xs mb-16 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shrink-0 border-4 border-amber-500 shadow-lg">
                <img
                  src={ownerPng}
                  alt="Roopam - Owner of Roopam Auto Sales"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3 flex-1 text-center md:text-left">
                <span className="inline-block text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 font-extrabold uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                  {lang === 'en' ? 'Store Owner & Founder' : 'शोरूम मालिक और संस्थापक'}
                </span>
                <h3 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">
                  Mr. Roopam
                </h3>
                <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500">
                  {lang === 'en' ? 'Pioneering Trust in Pre-Owned Vehicles Since 2016' : 'साल 2016 से पुरानी गाड़ियों में लखनऊ का नंबर 1 भरोसा'}
                </p>
                <p className="text-sm text-gray-550 dark:text-zinc-400 leading-relaxed italic">
                  {lang === 'en'
                    ? '"At Roopam Auto Sales, our principle is simple: transparent direct dealings (P2P) and thorough verification. Every ride has a story, and we guarantee that yours will be secure, smooth, and highly satisfying. Come visit our store and test drive your dream bike today!"'
                    : '"रूपम ऑटो सेल्स में, हमारा सीधा और सरल सिद्धांत है: प्रत्यक्ष एवं पारदर्शी लेन-देन और गाड़ियों की पूर्ण मैकेनिक जांच। हर राइड की अपनी एक कहानी होती है, और हम गारंटी देते हैं कि आपका सफर सुरक्षित, आसान और सुखद होगा। शोरूम आकर सीधे अपनी पसंदीदा बाइक का अनुभव लें।"'}
                </p>
              </div>
            </div>

            {/* Testimonials Slider */}
            <div className="mb-16 bg-gradient-to-br from-amber-505/[0.02] to-yellow-500/[0.04] dark:from-zinc-900/60 dark:to-zinc-850/60 border border-gray-150 dark:border-zinc-800 rounded-3xl p-8 shadow-xs relative overflow-hidden">
              <div className="text-center max-w-xl mx-auto mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500 block mb-1">
                  {lang === 'en' ? 'Real Customer Testimonials' : 'ग्राहकों के सच्चे अनुभव'}
                </span>
                <h3 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">
                  {lang === 'en' ? 'Our Reviews & Trust' : 'हमारा भरोसा, फीडबैक'}
                </h3>
              </div>

              {/* Slider Viewport with AnimatePresence */}
              <div className="min-h-[220px] sm:min-h-[160px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={reviewIdx}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 max-w-2xl text-center"
                  >
                    {/* Stars */}
                    <div className="flex items-center justify-center gap-1">
                      {[...Array(customerReviews[reviewIdx].rating)].map((_, i) => (
                        <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Review text */}
                    <p className="text-base sm:text-lg text-gray-700 dark:text-zinc-200 leading-relaxed font-sans font-medium italic">
                      {lang === 'en' ? customerReviews[reviewIdx].reviewEn : customerReviews[reviewIdx].reviewHi}
                    </p>

                    {/* Author credit details */}
                    <div>
                      <div className="font-extrabold text-gray-950 dark:text-white text-sm">
                        {customerReviews[reviewIdx].name}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-zinc-500 font-semibold mt-0.5">
                        {customerReviews[reviewIdx].bike} &bull; {customerReviews[reviewIdx].location}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slider controls */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-150 dark:border-zinc-800">
                <button
                  onClick={() => setReviewIdx(prev => (prev === 0 ? customerReviews.length - 1 : prev - 1))}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200/50 dark:border-zinc-800 hover:bg-gray-105 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 transition-colors shadow-xs cursor-pointer"
                  title="Previous testimonial"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Bullets indicators */}
                <div className="flex items-center gap-1.5">
                  {customerReviews.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setReviewIdx(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === reviewIdx
                          ? 'w-6 bg-amber-500'
                          : 'bg-gray-300 dark:bg-zinc-700 hover:bg-gray-400'
                      }`}
                      title={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setReviewIdx(prev => (prev === customerReviews.length - 1 ? 0 : prev + 1))}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200/50 dark:border-zinc-800 hover:bg-gray-105 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 transition-colors shadow-xs cursor-pointer"
                  title="Next testimonial"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Social Media Widget block */}
            <div className="p-8 rounded-3xl bg-amber-500/[0.03] dark:bg-amber-500/[5%] border border-amber-500/20 dark:border-amber-500/10 text-center shadow-xs">
              <h3 className="text-xl font-bold text-gray-950 dark:text-white tracking-tight mb-2">
                {lang === 'en' ? 'Get Daily Arrival Updates & Reviews' : 'रोजाना अपडेट्स और वीडियो रिव्यू पाएं'}
              </h3>
              <p className="text-gray-550 dark:text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto mb-8 leading-relaxed">
                {lang === 'en' 
                  ? 'We post high-fidelity video walkarounds, exhaust note checks, and exclusive pricing alerts across our official handles. Follow us to never miss the perfect ride!'
                  : 'हम रोजाना आने वाली बेहतरीन बाइकों की वीडियो वॉकअराउंड, हॉर्न व साउंड टेस्ट और प्राइज़ अलर्ट्स सोशल मीडिया पर शेयर करते हैं। आज ही जुड़ें!'}
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-3.5">
                <a
                  href="https://wa.me/919598022402?text=Hello%20Roopam%20Auto%20Sales,%20I%20am%20interested%20in%20knowing%20about%20your%20latest%20bike%20arrivals."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <MessageSquare size={16} />
                  <span>{lang === 'en' ? 'WhatsApp Helpline' : 'व्हाट्सएप सहायता'}</span>
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Instagram size={16} />
                  <span>Instagram</span>
                </a>

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-750 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Facebook size={16} />
                  <span>Facebook</span>
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-red-650 hover:bg-red-750 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Youtube size={16} />
                  <span>YouTube</span>
                </a>
              </div>
            </div>

          </motion.div>
        )}

        {activeTab === 'contact' && (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="py-8"
          >
            {/* CONTACT & MAP LOCATION SECTION */}
            <section id="contact-map-section" className="bg-transparent py-6 transition-colors scroll-mt-20 animate-fade-in">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <h2 className="text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight mb-3">
                    {t.contactHeading}
                  </h2>
                  <p className="text-gray-550 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
                    {t.contactSubheading}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  
                  {/* Contact Information Cards */}
                  <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                    
                    {/* Address Card */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-850 shadow-xs flex flex-col justify-between h-full group hover:border-amber-500/20 transition-all duration-200">
                      <div className="flex gap-4 items-start">
                        <div className="p-3 bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded-xl group-hover:scale-105 transition-transform">
                          <MapPin size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-950 dark:text-white text-base mb-1">
                            {t.storeAddressLabel}
                          </h4>
                          <p className="text-gray-505 dark:text-zinc-400 text-sm leading-relaxed mb-3">
                            {t.storeAddressValue}
                          </p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(t.storeAddressValue);
                              setAddressCopied(true);
                              setTimeout(() => setAddressCopied(false), 2500);
                            }}
                            className="text-xs font-bold text-amber-500 hover:text-amber-600 dark:text-amber-400 cursor-pointer flex items-center gap-1 bg-amber-500/5 px-2.5 py-1 rounded-md max-w-fit hover:bg-amber-500/10 transition-colors"
                          >
                            <span>{addressCopied ? (lang === 'en' ? 'Copied!' : 'कॉपी हो गया!') : (lang === 'en' ? 'Copy Address' : 'पता कॉपी करें')}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Call & WhatsApp Card */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-850 shadow-xs flex flex-col justify-between h-full group hover:border-emerald-550/20 transition-all duration-200">
                      <div className="flex gap-4 items-start">
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-xl group-hover:scale-105 transition-transform">
                          <Phone size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-950 dark:text-white text-base mb-1">
                            {t.storePhoneLabel}
                          </h4>
                          <p className="text-2xl font-black text-gray-950 dark:text-white mb-3 tracking-none">
                            +91 95980 22402
                          </p>
                          <div className="flex flex-wrap gap-2.5">
                            <a
                              href="tel:+919598022402"
                              className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-750 text-gray-800 dark:text-zinc-200 text-xs font-extrabold rounded-xl transition-all cursor-pointer border border-gray-200/10"
                            >
                              {lang === 'en' ? 'Call Store' : 'स्टोर पर कॉल करें'}
                            </a>
                            <a
                              href="https://wa.me/919598022402?text=Hello%20Roopam%20Auto%2520Sales,%20I%20am%20interested%20in%20checking%20out%20your%20available%20bike%20inventory."
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10"
                            >
                              <MessageSquare size={14} />
                              <span>{lang === 'en' ? 'Chat on WhatsApp' : 'व्हाट्सएप चैट'}</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timing Card */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-850 shadow-xs flex flex-col justify-between h-full hover:border-blue-500/20 transition-all duration-200 animate-slide-in">
                      <div className="flex gap-4 items-start">
                        <div className="p-3 bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-xl">
                          <Clock size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-950 dark:text-white text-base mb-1">
                            {t.storeHoursLabel}
                          </h4>
                          <p className="text-gray-550 dark:text-zinc-400 text-sm leading-relaxed">
                            {t.storeHoursValue}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Interactive Map Block */}
                  <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-gray-150 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex flex-col h-full min-h-[350px]">
                    
                    <div className="bg-gray-50 dark:bg-zinc-950/40 px-5 py-4 border-b border-gray-150 dark:border-zinc-800/80 flex items-center justify-between text-xs font-bold text-gray-750 dark:text-zinc-300">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-amber-500 animate-bounce" />
                        {t.mapTitle}
                      </span>
                      <span className="bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-semibold">
                        {lang === 'en' ? 'Live Store Location' : 'शोरूम की वर्तमान स्थिति'}
                      </span>
                    </div>

                    <div className="flex-1 relative w-full h-full min-h-[325px]">
                      <iframe
                        title="Roopam Auto Sales Store Location Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.013726502197!2d80.95410107522282!3d26.871304976671755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd6fe4f2fff1%3A0xf371912be15caa55!2sRoopam%20auto%20sales!5e0!3m2!1sen!2sin!4v1780673996251!5m2!1sen!2sin"
                        className="w-full h-full border-0 absolute inset-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>

                  </div>

                </div>

              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800/80 mt-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-400 dark:text-zinc-400">
          <div className="flex flex-col gap-1 sm:text-left text-center">
            <span className="font-bold text-gray-905 dark:text-white mb-0.5 text-sm">{t.appName}</span>
            <span>&copy; {new Date().getFullYear()} Roopam Auto Sales. {lang === 'en' ? 'All rights reserved.' : 'सर्वाधिकार सुरक्षित।'}</span>
            <span className="text-[10px] text-gray-400">{t.establishedSince}</span>
          </div>
          
          {/* Social Media Links in Footer */}
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://wa.me/919598022402"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white text-emerald-500 dark:text-emerald-400 transition-all shadow-xs border border-gray-200/50 dark:border-zinc-800/40 cursor-pointer"
              title="Chat on WhatsApp"
            >
              <MessageSquare size={16} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 hover:bg-pink-500 hover:text-white dark:hover:bg-pink-600 dark:hover:text-white text-pink-500 dark:text-pink-400 transition-all shadow-xs border border-gray-200/50 dark:border-zinc-800/40 cursor-pointer"
              title="Follow Instagram"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-gray-55/60 dark:bg-zinc-800/60 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-750 dark:hover:text-white text-blue-600 dark:text-indigo-400 transition-all shadow-xs border border-gray-200/50 dark:border-zinc-800/40 cursor-pointer"
              title="Like Facebook Page"
            >
              <Facebook size={16} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 hover:bg-red-650 hover:text-white dark:hover:bg-red-750 dark:hover:text-white text-red-600 dark:text-red-400 transition-all shadow-xs border border-gray-200/50 dark:border-zinc-800/40 cursor-pointer"
              title="Subscribe YouTube channel"
            >
              <Youtube size={16} />
            </a>
          </div>

          <div className="flex flex-col sm:items-end items-center gap-1 font-semibold text-gray-500 dark:text-zinc-400 text-center sm:text-right">
            <span>Direct WhatsApp P2P Handles</span>
            <span>English / हिन्दी Bilingual</span>
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
