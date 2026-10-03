import React from 'react';
import { Language, Category } from '../types';
import heroBannerImg from '../assets/images/agri_hero_banner_1791027689167.jpg';
import { Search, MapPin, CheckCircle, ShieldCheck, Star } from 'lucide-react';
import { CITIES } from '../data/mockData';

interface HeroProps {
  language: Language;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedCategory: Category | 'all';
  setSelectedCategory: (cat: Category | 'all') => void;
  listingTypeFilter: 'all' | 'sale' | 'rent';
  setListingTypeFilter: (type: 'all' | 'sale' | 'rent') => void;
  totalListingsCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  selectedCategory,
  setSelectedCategory,
  listingTypeFilter,
  setListingTypeFilter,
  totalListingsCount,
}) => {
  const isUrdu = language === 'ur';

  return (
    <div className="relative overflow-hidden bg-stone-900 text-white">
      {/* Background Image with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBannerImg}
          alt={isUrdu ? 'زرعی کھیت اور ٹریکٹر' : 'Agricultural tractor in farmland'}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-stone-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20">
        {/* Main Content */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs sm:text-sm font-semibold mb-3 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{isUrdu ? 'پاکستان کا سب سے بڑا کسان پورٹل' : 'Pakistan Premier Agriculture Hub'}</span>
          </div>

          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-tight ${isUrdu ? 'urdu-font font-semibold' : ''}`}>
            {isUrdu 
              ? 'زرعی مشینری اور سامان کی بااعتماد خرید و فروخت' 
              : 'Buy & Sell Farm Equipment, Tractors & Agri Supplies'}
          </h1>

          <p className="text-base sm:text-lg text-stone-200 mb-8 max-w-2xl leading-relaxed">
            {isUrdu
              ? 'ٹریکٹر، ہارویسٹر، سولر ٹیوب ویل، بیج اور کھاد براہ راست بااعتماد کسانوں اور ڈیلرز سے حاصل کریں۔ تصدیق شدہ جائزے اور جائز منڈی ریٹس۔'
              : 'Massey Ferguson, New Holland, Solar Tube Wells, Harvester rentals, and certified seeds directly from trusted local farmers and dealers.'}
          </p>

          {/* Search Box Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-stone-900 shadow-xl border border-white/20">
            {/* Segmented Buy / Rent / All filter buttons */}
            <div className="flex items-center gap-1 mb-3 pb-3 border-b border-stone-200/80">
              <button
                type="button"
                onClick={() => setListingTypeFilter('all')}
                className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  listingTypeFilter === 'all'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {isUrdu ? 'تمام سامان' : 'All Listings'}
              </button>
              <button
                type="button"
                onClick={() => setListingTypeFilter('sale')}
                className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  listingTypeFilter === 'sale'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {isUrdu ? 'برائے فروخت (خریدیں)' : 'For Sale'}
              </button>
              <button
                type="button"
                onClick={() => setListingTypeFilter('rent')}
                className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  listingTypeFilter === 'rent'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {isUrdu ? 'کرایہ پر حاصل کریں' : 'For Rent'}
              </button>

              <span className="text-stone-400 text-xs mr-auto ml-2 hidden sm:inline tabular-nums">
                {isUrdu ? `${totalListingsCount} اشتہارات دستیاب` : `${totalListingsCount} Available`}
              </span>
            </div>

            {/* Inputs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              {/* Keyword Search */}
              <div className="sm:col-span-6 relative">
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-stone-400">
                  <Search className="w-4 h-4 text-stone-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isUrdu
                      ? 'کیا تلاش کر رہے ہیں؟ (مثلاً میسی 385، سولر پمپ، بیج...)'
                      : 'Search equipment (e.g. Massey 385, Solar Pump, Seeds...)'
                  }
                  className="w-full pr-10 pl-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white placeholder:text-stone-400"
                />
              </div>

              {/* City Selector */}
              <div className="sm:col-span-3 relative">
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-stone-400">
                  <MapPin className="w-4 h-4 text-stone-400" />
                </div>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full pr-9 pl-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white appearance-none cursor-pointer"
                >
                  {CITIES.map((c) => (
                    <option key={c.en} value={c.en}>
                      {isUrdu ? c.ur : c.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Selector */}
              <div className="sm:col-span-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as Category | 'all')}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="all">{isUrdu ? 'تمام زمرہ جات' : 'All Categories'}</option>
                  <option value="tractors">{isUrdu ? 'ٹریکٹر اور مشینری' : 'Tractors & Heavy Machinery'}</option>
                  <option value="solar_tubewells">{isUrdu ? 'سولر اور ٹیوب ویل' : 'Solar & Tube Wells'}</option>
                  <option value="harvesters">{isUrdu ? 'ہارویسٹر اور تھریشر' : 'Harvesters & Threshers'}</option>
                  <option value="seeds_fertilizers">{isUrdu ? 'بیج اور کھاد' : 'Seeds & Fertilizers'}</option>
                  <option value="implements">{isUrdu ? 'زرعی اوزار و ٹرالی' : 'Farm Implements & Trolleys'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Trust proof elements adjacent to hero */}
          <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-stone-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isUrdu ? 'تصدیق شدہ کسان اور ڈیلرز' : '100% Verified Sellers'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{isUrdu ? 'حقیقی کسانوں کے جائزے و ریٹنگز' : 'Authentic Reviews & Ratings'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{isUrdu ? 'بغیر کسی کمیشن کے براہ راست رابطہ' : 'Direct Call & WhatsApp Deal'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
