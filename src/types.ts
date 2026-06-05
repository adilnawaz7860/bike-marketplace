/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BikeCategory = 'sports' | 'commuter' | 'cruiser' | 'scooter';

export type BikeCondition = 'excellent' | 'very_good' | 'good' | 'fair';

export interface Bike {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  kmRun: number;
  category: BikeCategory;
  condition: BikeCondition;
  location: string;
  ownerName: string;
  whatsappNumber: string; // international format without + or spaces, e.g. "919876543210"
  description: string;
  imageUrl: string;
  isPremium?: boolean;
  dateAdded: string;
}

export interface FilterState {
  searchQuery: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  category: string;
  condition: string;
  sortBy: 'price_low' | 'price_high' | 'year_new' | 'km_low' | 'recent';
}

export type Language = 'en' | 'hi';

export interface TranslationDict {
  appName: string;
  heroTitle: string;
  heroSubtitle: string;
  sellBtn: string;
  buyNow: string;
  searchPlaceholder: string;
  brandFilter: string;
  categoryFilter: string;
  conditionFilter: string;
  minPrice: string;
  maxPrice: string;
  allBrands: string;
  allCategories: string;
  allConditions: string;
  sortBy: string;
  priceLowToHigh: string;
  priceHighToLow: string;
  newestFirst: string;
  lowestKm: string;
  newestAdded: string;
  kmShort: string;
  yearLabel: string;
  ownerLabel: string;
  locationLabel: string;
  conditionExcellent: string;
  conditionVeryGood: string;
  conditionGood: string;
  conditionFair: string;
  catSports: string;
  catCommuter: string;
  catCruiser: string;
  catScooter: string;
  noBikesFound: string;
  resetFilters: string;
  resultsCount: string;
  // Sell Form Translations
  sellFormTitle: string;
  ownerNameLabel: string;
  ownerPhoneLabel: string;
  ownerPhoneHelp: string;
  bikeBrandLabel: string;
  bikeModelLabel: string;
  bikeYearLabel: string;
  bikePriceLabel: string;
  kmRunLabel: string;
  categoryLabel: string;
  conditionLabel: string;
  locationCityLabel: string;
  imageUrlLabel: string;
  imageUrlPlaceholder: string;
  descriptionLabel: string;
  submitPostBtn: string;
  cancelBtn: string;
  successMsg: string;
  // Theme & New Contact section translations
  themeModeLabel: string;
  contactHeading: string;
  contactSubheading: string;
  storeAddressLabel: string;
  storeAddressValue: string;
  storePhoneLabel: string;
  storeHoursLabel: string;
  storeHoursValue: string;
  mapTitle: string;
  findUsOnMap: string;
  // Navigation & About Translations
  navHome: string;
  navAbout: string;
  navContact: string;
  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
  aboutYearsHeading: string;
  establishedSince: string;
}
