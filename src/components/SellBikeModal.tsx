/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { Bike, BikeCategory, BikeCondition, Language, TranslationDict } from '../types';

interface SellBikeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBike: (bike: Omit<Bike, 'id' | 'dateAdded'>) => void;
  t: TranslationDict;
  lang: Language;
}

export default function SellBikeModal({
  isOpen,
  onClose,
  onAddBike,
  t,
  lang,
}: SellBikeModalProps) {
  // Form States
  const [ownerName, setOwnerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [price, setPrice] = useState('');
  const [kmRun, setKmRun] = useState('');
  const [category, setCategory] = useState<BikeCategory>('commuter');
  const [condition, setCondition] = useState<BikeCondition>('excellent');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  
  // UI Flow States
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pick default fallback image based on category
  const getFallbackImageByCategory = (cat: BikeCategory) => {
    switch (cat) {
      case 'cruiser':
        return 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600';
      case 'sports':
        return 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=600';
      case 'scooter':
        return 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=600';
      case 'commuter':
      default:
        return 'https://images.unsplash.com/photo-1616244624476-80d80c6c8d4f?auto=format&fit=crop&q=80&w=600';
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!ownerName.trim()) newErrors.ownerName = lang === 'en' ? 'Name is required' : 'नाम आवश्यक है';
    
    // Validate Phone - should be numbers, at least 10 digits
    const cleanedPhone = whatsappNumber.replace(/\D/g, '');
    if (!whatsappNumber.trim()) {
      newErrors.whatsappNumber = lang === 'en' ? 'WhatsApp number is required' : 'व्हाट्सएप नंबर आवश्यक है';
    } else if (cleanedPhone.length < 10) {
      newErrors.whatsappNumber = lang === 'en' ? 'Enter a valid whatsapp number with country code' : 'कंट्री कोड के साथ सही नंबर दर्ज करें';
    }

    if (!brand.trim()) newErrors.brand = lang === 'en' ? 'Brand is required' : 'ब्रांड आवश्यक है';
    if (!model.trim()) newErrors.model = lang === 'en' ? 'Model is required' : 'मॉडल आवश्यक है';
    
    if (!year || year < 1980 || year > 2027) {
      newErrors.year = lang === 'en' ? 'Enter a valid manufacturing year' : 'निर्माण का सही वर्ष दर्ज करें';
    }

    if (!price || parseFloat(price) <= 0) {
      newErrors.price = lang === 'en' ? 'Enter a valid price' : 'सही कीमत दर्ज करें';
    }

    if (!kmRun || parseInt(kmRun) < 0) {
      newErrors.kmRun = lang === 'en' ? 'Enter non-negative kilometers' : 'सही किलोमीटर दर्ज करें';
    }

    if (!location.trim()) newErrors.location = lang === 'en' ? 'City/Location is required' : 'स्थान आवश्यक है';
    if (!description.trim()) newErrors.description = lang === 'en' ? 'Description is required' : 'विवरण आवश्यक है';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Clean whatsapp phone number to make direct URL-friendly. 
    // If user enters +91 98765-43210, save it as 919876543210
    const cleanedPhone = whatsappNumber.replace(/[^0-9]/g, '');

    const finalImage = imageUrl.trim() || getFallbackImageByCategory(category);

    onAddBike({
      ownerName: ownerName.trim(),
      whatsappNumber: cleanedPhone,
      brand: brand.trim(),
      model: model.trim(),
      year: Number(year),
      price: Number(price),
      kmRun: Number(kmRun),
      category,
      condition,
      location: location.trim(),
      imageUrl: finalImage,
      description: description.trim(),
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      resetForm();
      onClose();
    }, 1800);
  };

  const resetForm = () => {
    setOwnerName('');
    setWhatsappNumber('');
    setBrand('');
    setModel('');
    setYear(new Date().getFullYear());
    setPrice('');
    setKmRun('');
    setCategory('commuter');
    setCondition('excellent');
    setLocation('');
    setImageUrl('');
    setDescription('');
    setErrors({});
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Box */}
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden z-10"
              id="sell-bike-modal-container"
            >
              
              {/* Success Notification overlay */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/95 dark:bg-zinc-900/95 flex flex-col items-center justify-center z-50"
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                      className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-4 shadow-lg text-2xl"
                    >
                      <Check size={32} strokeWidth={3} />
                    </motion.div>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center px-4">
                      {t.successMsg}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Title Header */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                  {t.sellFormTitle}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  id="close-modal-btn"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                
                {/* Section A: Owner Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest border-b border-gray-100 dark:border-zinc-800 pb-1">
                    {lang === 'en' ? 'Seller Contact info' : 'विक्रेता संपर्क जानकारी'}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Owner Name */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                        {t.ownerNameLabel} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="e.g. Aman Verma"
                        className={`py-2 px-3 border rounded-xl bg-gray-50 dark:bg-zinc-800/45 text-sm text-gray-900 dark:text-gray-150 focus:ring-2 focus:ring-amber-500 outline-none transition-all ${
                          errors.ownerName ? 'border-rose-400 focus:ring-rose-500' : 'border-gray-200 dark:border-zinc-700'
                        }`}
                        id="form-owner-name"
                      />
                      {errors.ownerName && <span className="text-xs font-medium text-rose-500">{errors.ownerName}</span>}
                    </div>

                    {/* Owner Phone */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                        {t.ownerPhoneLabel} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="e.g. 919876543210"
                        className={`py-2 px-3 border rounded-xl bg-gray-50 dark:bg-zinc-800/45 text-sm text-gray-900 dark:text-gray-150 focus:ring-2 focus:ring-amber-500 outline-none transition-all ${
                          errors.whatsappNumber ? 'border-rose-400 focus:ring-rose-500' : 'border-gray-200 dark:border-zinc-700'
                        }`}
                        id="form-owner-phone"
                      />
                      <span className="text-[10px] text-gray-400 leading-tight">
                        {t.ownerPhoneHelp}
                      </span>
                      {errors.whatsappNumber && <span className="text-xs font-medium text-rose-500">{errors.whatsappNumber}</span>}
                    </div>
                  </div>
                </div>

                {/* Section B: Bike Details */}
                <div className="space-y-4 pt-3">
                  <h3 className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest border-b border-gray-100 dark:border-zinc-800 pb-1">
                    {lang === 'en' ? 'Two-Wheeler Details' : 'दो-पहिया वाहन विवरण'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Brand */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                        {t.bikeBrandLabel} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="e.g. Royal Enfield"
                        className={`py-2 px-3 border rounded-xl bg-gray-50 dark:bg-zinc-800/45 text-sm text-gray-900 dark:text-gray-150 focus:ring-2 focus:ring-amber-500 outline-none transition-all ${
                          errors.brand ? 'border-rose-400 focus:ring-rose-500' : 'border-gray-200 dark:border-zinc-700'
                        }`}
                        id="form-bike-brand"
                      />
                      {errors.brand && <span className="text-xs font-medium text-rose-500">{errors.brand}</span>}
                    </div>

                    {/* Model */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                        {t.bikeModelLabel} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="e.g. Classic 350"
                        className={`py-2 px-3 border rounded-xl bg-gray-50 dark:bg-zinc-800/45 text-sm text-gray-900 dark:text-gray-150 focus:ring-2 focus:ring-amber-500 outline-none transition-all ${
                          errors.model ? 'border-rose-400 focus:ring-rose-500' : 'border-gray-200 dark:border-zinc-700'
                        }`}
                        id="form-bike-model"
                      />
                      {errors.model && <span className="text-xs font-medium text-rose-500">{errors.model}</span>}
                    </div>

                    {/* Year */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                        {t.bikeYearLabel} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        min="1980"
                        max="2027"
                        className={`py-2 px-3 border rounded-xl bg-gray-50 dark:bg-zinc-800/45 text-sm text-gray-900 dark:text-gray-150 focus:ring-2 focus:ring-amber-500 outline-none transition-all ${
                          errors.year ? 'border-rose-400 focus:ring-rose-500' : 'border-gray-200 dark:border-zinc-700'
                        }`}
                        id="form-bike-year"
                      />
                      {errors.year && <span className="text-xs font-medium text-rose-500">{errors.year}</span>}
                    </div>

                    {/* Price */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                        {t.bikePriceLabel} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 125000"
                        className={`py-2 px-3 border rounded-xl bg-gray-50 dark:bg-zinc-800/45 text-sm text-gray-900 dark:text-gray-150 focus:ring-2 focus:ring-amber-500 outline-none transition-all ${
                          errors.price ? 'border-rose-400 focus:ring-rose-500' : 'border-gray-200 dark:border-zinc-700'
                        }`}
                        id="form-bike-price"
                      />
                      {errors.price && <span className="text-xs font-medium text-rose-500">{errors.price}</span>}
                    </div>

                    {/* KM run */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                        {t.kmRunLabel} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={kmRun}
                        onChange={(e) => setKmRun(e.target.value)}
                        placeholder="e.g. 15000"
                        className={`py-2 px-3 border rounded-xl bg-gray-50 dark:bg-zinc-800/45 text-sm text-gray-900 dark:text-gray-150 focus:ring-2 focus:ring-amber-500 outline-none transition-all ${
                          errors.kmRun ? 'border-rose-400 focus:ring-rose-500' : 'border-gray-200 dark:border-zinc-700'
                        }`}
                        id="form-bike-km"
                      />
                      {errors.kmRun && <span className="text-xs font-medium text-rose-500">{errors.kmRun}</span>}
                    </div>

                    {/* Location */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                        {t.locationCityLabel} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Saket, New Delhi"
                        className={`py-2 px-3 border rounded-xl bg-gray-50 dark:bg-zinc-800/45 text-sm text-gray-900 dark:text-gray-150 focus:ring-2 focus:ring-amber-500 outline-none transition-all ${
                          errors.location ? 'border-rose-400 focus:ring-rose-500' : 'border-gray-200 dark:border-zinc-700'
                        }`}
                        id="form-bike-location"
                      />
                      {errors.location && <span className="text-xs font-medium text-rose-500">{errors.location}</span>}
                    </div>

                    {/* Category */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                        {t.categoryLabel}
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as BikeCategory)}
                        className="py-2 px-3 border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/45 rounded-xl text-sm text-gray-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                        id="form-bike-category"
                      >
                        <option value="commuter">{t.catCommuter}</option>
                        <option value="sports">{t.catSports}</option>
                        <option value="cruiser">{t.catCruiser}</option>
                        <option value="scooter">{t.catScooter}</option>
                      </select>
                    </div>

                    {/* Condition */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                        {t.conditionLabel}
                      </label>
                      <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value as BikeCondition)}
                        className="py-2 px-3 border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/45 rounded-xl text-sm text-gray-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                        id="form-bike-condition"
                      >
                        <option value="excellent">{t.conditionExcellent}</option>
                        <option value="very_good">{t.conditionVeryGood}</option>
                        <option value="good">{t.conditionGood}</option>
                        <option value="fair">{t.conditionFair}</option>
                      </select>
                    </div>
                  </div>

                  {/* Photo URL */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300 font-medium">
                      {t.imageUrlLabel}
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder={t.imageUrlPlaceholder}
                      className="py-2 px-3 border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/45 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      id="form-bike-image"
                    />
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                      {t.descriptionLabel} <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder={lang === 'en' ? 'Describe key features, modifications, body state...' : 'मुख्य विशेषताएं, बदलाव, बॉडी की स्थिति के बारे में बताएं...'}
                      className={`py-2 px-3 border rounded-xl bg-gray-50 dark:bg-zinc-800/45 text-sm text-gray-900 dark:text-gray-150 focus:ring-2 focus:ring-amber-500 outline-none transition-all ${
                        errors.description ? 'border-rose-400 focus:ring-rose-500' : 'border-gray-200 dark:border-zinc-700'
                      }`}
                      id="form-bike-desc"
                    />
                    {errors.description && <span className="text-xs font-medium text-rose-500">{errors.description}</span>}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-100 dark:border-zinc-800 pt-5 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      onClose();
                    }}
                    className="px-5 py-2.5 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    id="cancel-modal-btn"
                  >
                    {t.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                    id="submit-modal-btn"
                  >
                    {t.submitPostBtn}
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
