/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, User, Gauge, Calendar, MessageCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Bike, Language, TranslationDict } from '../types';

interface BikeCardProps {
  key?: React.Key;
  bike: Bike;
  lang: Language;
  t: TranslationDict;
}

export default function BikeCard({ bike, lang, t }: BikeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Formatting Price in Indian Rupees
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(bike.price);

  // Formatting KM in Indian style
  const formattedKm = new Intl.NumberFormat('en-IN').format(bike.kmRun);

  // Condition Badge Color Config
  const getConditionColor = (cond: Bike['condition']) => {
    switch (cond) {
      case 'excellent':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/35 dark:text-emerald-400 dark:border-emerald-900';
      case 'very_good':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/35 dark:text-blue-400 dark:border-blue-900';
      case 'good':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/35 dark:text-amber-400 dark:border-amber-900';
      case 'fair':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/35 dark:text-rose-400 dark:border-rose-900';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
    }
  };

  const getConditionLabel = (cond: Bike['condition']) => {
    switch (cond) {
      case 'excellent': return t.conditionExcellent;
      case 'very_good': return t.conditionVeryGood;
      case 'good': return t.conditionGood;
      case 'fair': return t.conditionFair;
    }
  };

  const getCategoryLabel = (cat: Bike['category']) => {
    switch (cat) {
      case 'sports': return t.catSports;
      case 'commuter': return t.catCommuter;
      case 'cruiser': return t.catCruiser;
      case 'scooter': return t.catScooter;
    }
  };

  // Compose Custom WhatsApp Message
  const buildWhatsAppUrl = () => {
    const textMsg = lang === 'en'
      ? `Hello ${bike.ownerName}, I saw your listing for the second-hand ${bike.brand} ${bike.model} (${bike.year} model) listed for ₹${bike.price.toLocaleString('en-IN')} on BikeMarket. Is this bike still available for sale? I'd like to discuss the details.`
      : `नमस्ते ${bike.ownerName}, मैंने बाईक मार्केट पर आपकी सेकंड-हैंड ${bike.brand} ${bike.model} (${bike.year} मॉडल), जिसकी कीमत ₹${bike.price.toLocaleString('en-IN')} है, का विज्ञापन देखा है। क्या यह बाइक अभी बिकाऊ है? मैं इसके बारे में बात करना चाहता हूँ।`;

    return `https://wa.me/${bike.whatsappNumber}?text=${encodeURIComponent(textMsg)}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`relative flex flex-col bg-white dark:bg-zinc-900 border ${
        bike.isPremium ? 'border-amber-400 ring-1 ring-amber-400/20' : 'border-gray-100 dark:border-zinc-800'
      } rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full`}
      id={`bike-card-${bike.id}`}
    >
      {/* Premium Badge */}
      {bike.isPremium && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm z-10">
          <Sparkles size={12} />
          <span>Featured</span>
        </div>
      )}

      {/* Category Tag */}
      <div className="absolute top-3 right-3 bg-zinc-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2.5 py-1 rounded-full z-10">
        {getCategoryLabel(bike.category)}
      </div>

      {/* Image Handler */}
      <div className="relative aspect-4/3 w-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
        <img
          src={bike.imageUrl || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600"}
          alt={`${bike.brand} ${bike.model}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // fallback image if custom url fails to load
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600";
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/55 to-transparent flex items-end p-3 pointer-events-none">
          <span className="text-white text-lg font-bold tracking-tight">
            {formattedPrice}
          </span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-tight mb-2">
          {bike.brand} <span className="font-medium text-amber-600 dark:text-amber-500">{bike.model}</span>
        </h3>

        {/* Essential Running/Year Specs Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 bg-gray-50 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-gray-100/50 dark:border-zinc-800">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-zinc-300">
            <Calendar size={14} className="text-gray-400" />
            <span className="font-semibold">{bike.year}</span>
            <span className="text-gray-400 text-[10px] uppercase font-medium">({t.yearLabel})</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-zinc-300">
            <Gauge size={14} className="text-gray-400" />
            <span className="font-semibold">{formattedKm}</span>
            <span className="text-gray-400 text-xs">{t.kmShort}</span>
          </div>
        </div>

        {/* Location / Owner Row */}
        <div className="space-y-2 text-xs text-gray-500 dark:text-zinc-400 mb-4 flex-1">
          <div className="flex items-start gap-1 pb-1">
            <MapPin size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <span className="leading-tight"><strong className="text-gray-600 dark:text-zinc-300">{t.locationLabel}:</strong> {bike.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <User size={14} className="text-amber-500 shrink-0" />
            <span><strong className="text-gray-600 dark:text-zinc-300">{t.ownerLabel}:</strong> {"ROOPAM Auto Sales"}</span>
          </div>
          
          {/* Condition Badge */}
          <div className="pt-2 flex items-center gap-2">
            <span className={`text-[11px] font-semibold border px-2.5 py-0.5 rounded-md ${getConditionColor(bike.condition)}`}>
              {getConditionLabel(bike.condition)}
            </span>
          </div>
        </div>

        {/* Collapsible / Expandable Description */}
        <div className="mb-4 text-xs text-gray-600 dark:text-zinc-400 border-t border-gray-100 dark:border-zinc-800 pt-3">
          <p className={isExpanded ? '' : 'line-clamp-2'}>
            {bike.description}
          </p>
          {bike.description.length > 80 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-amber-600 dark:text-amber-400 font-bold mt-1 inline-flex items-center gap-0.5 hover:underline cursor-pointer"
            >
              <span>{isExpanded ? (lang === 'en' ? 'Show Less' : 'कम दिखाएं') : (lang === 'en' ? 'Read More' : 'अधिक पढ़ें')}</span>
              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
        </div>

        {/* Redirect Button */}
        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-md transition-all text-center cursor-pointer"
          id={`buy-now-btn-${bike.id}`}
        >
          <MessageCircle size={18} className="fill-current text-white shrink-0" />
          <span>{t.buyNow}</span>
        </a>

      </div>
    </motion.div>
  );
}
