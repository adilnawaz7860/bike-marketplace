/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { FilterState, Language, TranslationDict } from '../types';

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  brands: string[];
  lang: Language;
  t: TranslationDict;
  totalCount: number;
}

export default function Filters({
  filters,
  onFilterChange,
  brands,
  lang,
  t,
  totalCount,
}: FiltersProps) {
  const categoriesList = [
    { value: 'sports', label: t.catSports },
    { value: 'commuter', label: t.catCommuter },
    { value: 'cruiser', label: t.catCruiser },
    { value: 'scooter', label: t.catScooter },
  ];

  const conditionsList = [
    { value: 'excellent', label: t.conditionExcellent },
    { value: 'very_good', label: t.conditionVeryGood },
    { value: 'good', label: t.conditionGood },
    { value: 'fair', label: t.conditionFair },
  ];

  const hasActiveFilters = 
    filters.searchQuery !== '' ||
    filters.brand !== '' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.category !== '' ||
    filters.condition !== '';

  const handleReset = () => {
    onFilterChange({
      searchQuery: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      category: '',
      condition: '',
      sortBy: 'recent'
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col gap-6">
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 transition-all text-sm outline-none"
            placeholder={t.searchPlaceholder}
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            id="main-search-input"
          />
        </div>

        {/* Filters Header & Reset */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold text-sm">
            <SlidersHorizontal size={18} className="text-amber-500" />
            <span>{t.resultsCount.replace('{count}', totalCount.toString())}</span>
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors cursor-pointer"
              id="reset-filters-btn"
            >
              <RotateCcw size={14} />
              <span>{t.resetFilters}</span>
            </button>
          )}
        </div>

        {/* Fields Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Brand */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
              {t.brandFilter}
            </label>
            <select
              value={filters.brand}
              onChange={(e) => onFilterChange({ brand: e.target.value })}
              className="block w-full py-2.5 px-3 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
              id="brand-filter-select"
            >
              <option value="">{t.allBrands}</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
              {t.categoryFilter}
            </label>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
              className="block w-full py-2.5 px-3 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
              id="category-filter-select"
            >
              <option value="">{t.allCategories}</option>
              {categoriesList.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
              {t.conditionFilter}
            </label>
            <select
              value={filters.condition}
              onChange={(e) => onFilterChange({ condition: e.target.value })}
              className="block w-full py-2.5 px-3 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
              id="condition-filter-select"
            >
              <option value="">{t.allConditions}</option>
              {conditionsList.map((cond) => (
                <option key={cond.value} value={cond.value}>{cond.label}</option>
              ))}
            </select>
          </div>

          {/* Sorter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
              {t.sortBy}
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="block w-full py-2.5 px-3 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
              id="sort-by-select"
            >
              <option value="recent">{t.newestAdded}</option>
              <option value="price_low">{t.priceLowToHigh}</option>
              <option value="price_high">{t.priceHighToLow}</option>
              <option value="year_new">{t.newestFirst}</option>
              <option value="km_low">{t.lowestKm}</option>
            </select>
          </div>

        </div>

        {/* Price Slider/Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-50 dark:border-zinc-800 pt-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
              {t.minPrice}
            </label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => onFilterChange({ minPrice: e.target.value })}
              placeholder="e.g. 50000"
              className="block w-full py-2 px-3 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              id="min-price-input"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
              {t.maxPrice}
            </label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
              placeholder="e.g. 200000"
              className="block w-full py-2 px-3 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              id="max-price-input"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
