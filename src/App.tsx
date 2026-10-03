/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Language, Listing, Review, Seller, Category 
} from './types';
import { 
  INITIAL_LISTINGS, INITIAL_REVIEWS, MANDI_RATES, CATEGORIES_LIST 
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { MandiTicker } from './components/MandiTicker';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ReviewModal } from './components/ReviewModal';
import { SellerProfileModal } from './components/SellerProfileModal';
import { PostAdModal } from './components/PostAdModal';
import { MandiRatesModal } from './components/MandiRatesModal';
import { AgriCalculatorModal } from './components/AgriCalculatorModal';
import { SavedModal } from './components/SavedModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

import { 
  ShieldCheck, Star, Sparkles, Filter, SlidersHorizontal, 
  HelpCircle, CheckCircle, Wheat, MessageSquare, Plus, ArrowUpDown 
} from 'lucide-react';

export default function App() {
  // 1. Language State
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('kisan_lang') as Language) || 'ur';
  });

  const isUrdu = language === 'ur';

  // Sync HTML dir & lang attributes
  useEffect(() => {
    localStorage.setItem('kisan_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  // 2. Listings State with LocalStorage persistence
  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const stored = localStorage.getItem('kisan_listings');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_LISTINGS;
  });

  useEffect(() => {
    localStorage.setItem('kisan_listings', JSON.stringify(listings));
  }, [listings]);

  // 3. Reviews State with LocalStorage persistence
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const stored = localStorage.getItem('kisan_reviews');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem('kisan_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // 4. Saved/Favorites IDs
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('kisan_saved_ids');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return ['list-1'];
  });

  useEffect(() => {
    localStorage.setItem('kisan_saved_ids', JSON.stringify(savedIds));
  }, [savedIds]);

  // 5. Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [listingTypeFilter, setListingTypeFilter] = useState<'all' | 'sale' | 'rent'>('all');
  const [activeSort, setActiveSort] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');

  // 6. Modals
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewModalTarget, setReviewModalTarget] = useState<{
    listing?: Listing | null;
    seller?: Seller | null;
  }>({});
  const [sellerModalOpen, setSellerModalOpen] = useState(false);
  const [activeSeller, setActiveSeller] = useState<Seller | null>(null);
  const [postAdModalOpen, setPostAdModalOpen] = useState(false);
  const [mandiModalOpen, setMandiModalOpen] = useState(false);
  const [calculatorModalOpen, setCalculatorModalOpen] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);

  // Toggle Save
  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add Listing
  const handleAddListing = (newListing: Listing) => {
    setListings((prev) => [newListing, ...prev]);
  };

  // Submit Review
  const handleSubmitReview = (
    newRevData: Omit<Review, 'id' | 'date' | 'helpfulCount'>
  ) => {
    const newRev: Review = {
      ...newRevData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
    };

    setReviews((prev) => [newRev, ...prev]);

    // Update product rating if product review
    if (newRevData.targetType === 'product') {
      setListings((prev) =>
        prev.map((l) => {
          if (l.id === newRevData.targetId) {
            const currentTotal = l.rating * l.reviewsCount;
            const newCount = l.reviewsCount + 1;
            const newRating = Number(((currentTotal + newRevData.rating) / newCount).toFixed(1));
            return {
              ...l,
              reviewsCount: newCount,
              rating: newRating,
            };
          }
          return l;
        })
      );
    }
  };

  // Helpful Review Upvote
  const handleHelpfulReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
      )
    );
  };

  // Filter & Sort Logic
  const filteredListings = listings.filter((item) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (item.title + ' ' + item.titleUrdu).toLowerCase().includes(q);
      const matchCity = (item.city + ' ' + item.cityUrdu).toLowerCase().includes(q);
      const matchDesc = (item.description + ' ' + item.descriptionUrdu).toLowerCase().includes(q);
      if (!matchTitle && !matchCity && !matchDesc) return false;
    }

    // City
    if (selectedCity !== 'All Cities' && item.city !== selectedCity) {
      return false;
    }

    // Category
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }

    // Listing Type (Sale / Rent)
    if (listingTypeFilter !== 'all' && item.type !== listingTypeFilter) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (activeSort === 'price_low') return a.price - b.price;
    if (activeSort === 'price_high') return b.price - a.price;
    if (activeSort === 'rating') return b.rating - a.rating;
    // default featured
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const savedListings = listings.filter((l) => savedIds.includes(l.id));

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-900 selection:bg-emerald-200 selection:text-emerald-950 font-sans">
      {/* 1. Mandi Rates Live Ticker */}
      <MandiTicker
        rates={MANDI_RATES}
        language={language}
        onOpenMandiRates={() => setMandiModalOpen(true)}
      />

      {/* 2. Top Navigation Bar (Constitution Compliant) */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        onOpenPostAd={() => setPostAdModalOpen(true)}
        onOpenMandiRates={() => setMandiModalOpen(true)}
        onOpenCalculator={() => setCalculatorModalOpen(true)}
        onOpenSaved={() => setSavedModalOpen(true)}
        savedCount={savedIds.length}
        activeNavTab={listingTypeFilter}
        setActiveNavTab={setListingTypeFilter}
      />

      {/* 3. Hero Showcase with High-Res Farm Imagery & Search */}
      <Hero
        language={language}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        listingTypeFilter={listingTypeFilter}
        setListingTypeFilter={setListingTypeFilter}
        totalListingsCount={filteredListings.length}
      />

      {/* 4. Main Marketplace Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Category Filter Pills (Functional Buttons) & Sort Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            {/* Category Segmented Controls */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {CATEGORIES_LIST.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as Category | 'all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {isUrdu ? cat.ur : cat.en}
                  </button>
                );
              })}
            </div>

            {/* Sort & Count */}
            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
              <span className="text-xs text-stone-500 tabular-nums">
                {isUrdu 
                  ? `${filteredListings.length} سامان کے اشتہارات`
                  : `Showing ${filteredListings.length} results`}
              </span>

              <div className="flex items-center gap-1 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                <select
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value as any)}
                  className="bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="featured">{isUrdu ? 'نمایاں (Featured)' : 'Featured'}</option>
                  <option value="rating">{isUrdu ? 'اعلیٰ ریٹنگ (Highest Rated)' : 'Highest Rated'}</option>
                  <option value="price_low">{isUrdu ? 'قیمت: کم سے زیادہ' : 'Price: Low to High'}</option>
                  <option value="price_high">{isUrdu ? 'قیمت: زیادہ سے کم' : 'Price: High to Low'}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 shadow-2xs">
            <Wheat className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className={`text-lg font-bold text-stone-900 mb-1 ${isUrdu ? 'urdu-font' : ''}`}>
              {isUrdu ? 'کوئی زرعی سامان نہیں ملا' : 'No agricultural equipment found'}
            </h3>
            <p className="text-stone-500 text-sm max-w-md mx-auto mb-5">
              {isUrdu
                ? 'براہ کرم سرچ کے الفاظ تبدیل کریں یا فلٹرز صاف کریں، یا اپنا سامان خود فروخت کرنے کے لیے مفت اشتہار لگائیں۔'
                : 'Try adjusting your search criteria or post your equipment ad to sell.'}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCity('All Cities');
                  setSelectedCategory('all');
                  setListingTypeFilter('all');
                }}
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                {isUrdu ? 'تمام فلٹرز صاف کریں' : 'Clear All Filters'}
              </button>
              <button
                onClick={() => setPostAdModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
              >
                {isUrdu ? '+ اپنا اشتہار لگائیں' : '+ Post Your Ad'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => (
              <ProductCard
                key={item.id}
                listing={item}
                language={language}
                onSelect={(listing) => setSelectedListing(listing)}
                isSaved={savedIds.includes(item.id)}
                onToggleSave={handleToggleSave}
                onOpenSeller={(seller, e) => {
                  e.stopPropagation();
                  setActiveSeller(seller);
                  setSellerModalOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {/* 4.5 Google Play / Mobile App Installation Banner */}
        <div className="mt-12">
          <PWAInstallButton language={language} variant="banner" />
        </div>

        {/* 5. Reviews & Farmer Community Trust Section */}
        <section className="mt-16 pt-12 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{isUrdu ? 'ریٹنگز اور جائزے' : 'Verified Community Reviews'}</span>
              </div>
              <h2 className={`text-2xl font-bold text-stone-900 ${isUrdu ? 'urdu-font font-semibold' : ''}`}>
                {isUrdu ? 'کسانوں کے حقیقی تاثرات اور تجربات' : 'What Local Farmers Say About Sellers'}
              </h2>
            </div>

            <button
              onClick={() => {
                setReviewModalTarget({ listing: listings[0] });
                setReviewModalOpen(true);
              }}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors self-start sm:self-auto"
            >
              {isUrdu ? '+ نئی رائے یا جائزہ لکھیں' : '+ Write Feedback'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                        {rev.authorName[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-stone-900 text-xs sm:text-sm">
                          {rev.authorName}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {rev.authorCity}
                        </div>
                      </div>
                    </div>

                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            rev.rating >= s ? 'fill-amber-400' : 'text-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className={`text-stone-700 text-xs sm:text-sm leading-relaxed mb-4 ${isUrdu ? 'urdu-font' : ''}`}>
                    "{isUrdu && rev.commentUrdu ? rev.commentUrdu : rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isUrdu ? 'تصدیق شدہ کسان' : 'Verified Farmer'}
                  </span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Farmer Safety Notice Banner */}
        <section className="mt-12 bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 text-stone-800 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="flex-1 text-xs sm:text-sm">
            <h4 className="font-bold text-amber-950 mb-0.5">
              {isUrdu ? 'کسان بھائیوں کے لیے اہم حفاظتی ہدایات:' : 'Safety Guidelines for Buyers:'}
            </h4>
            <p className="text-amber-900/90 leading-relaxed">
              {isUrdu
                ? 'ٹریکٹر یا کوئی بھی مشینری خریدنے سے پہلے موقع پر جا کر انجن، ٹیسٹ ڈرائیو اور مکمل رجسٹریشن کاغذات خود چیک کریں۔ کبھی بھی پیشگی آن لائن رقم یا بیعانہ نہ بھیجیں۔'
                : 'Always inspect tractors and equipment physically before payment. Verify engine number, chassis, and registration book in person.'}
            </p>
          </div>
        </section>
      </main>

      {/* 7. Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs pt-12 pb-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-stone-800">
            {/* Col 1 */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
                  <Wheat className="w-4 h-4 text-amber-300" />
                </div>
                <span className="text-lg font-bold text-white">
                  {isUrdu ? 'کِسان بازار' : 'Kisan Bazaar'}
                </span>
              </div>
              <p className="text-stone-400 text-xs max-w-md leading-relaxed">
                {isUrdu
                  ? 'پاکستان کا قابلِ اعتماد زرعی پورٹل۔ زرعی ٹریکٹر، ہارویسٹر، سولر ٹیوب ویل، بیج اور کھاد کی محفوظ اور براہ راست خرید و فروخت۔ ریٹنگ اور تجزیہ سسٹم کے ساتھ۔'
                  : 'Pakistan dedicated agricultural equipment marketplace. Connect directly with farmers and equipment dealers with verified ratings and reviews.'}
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-stone-200 font-semibold mb-3">
                {isUrdu ? 'اہم زمرہ جات' : 'Categories'}
              </h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setSelectedCategory('tractors')} className="hover:text-white transition-colors">
                    {isUrdu ? 'میسی و الغازی ٹریکٹر' : 'Massey & Al-Ghazi Tractors'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setSelectedCategory('solar_tubewells')} className="hover:text-white transition-colors">
                    {isUrdu ? 'سولر ٹیوب ویل سسٹمز' : 'Solar Tube Wells'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setSelectedCategory('harvesters')} className="hover:text-white transition-colors">
                    {isUrdu ? 'ہارویسٹر اور کٹائی سروسز' : 'Harvester Rentals'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setSelectedCategory('seeds_fertilizers')} className="hover:text-white transition-colors">
                    {isUrdu ? 'منظور شدہ بیج اور کھاد' : 'Certified Seeds & Fertilizer'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-stone-200 font-semibold mb-3">
                {isUrdu ? 'کسان سہولیات' : 'Farmer Tools'}
              </h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setMandiModalOpen(true)} className="hover:text-white transition-colors">
                    {isUrdu ? 'آج کے غلہ منڈی ریٹس' : 'Daily Mandi Rates'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCalculatorModalOpen(true)} className="hover:text-white transition-colors">
                    {isUrdu ? 'کھاد کا فی ایکڑ کیلکولیٹر' : 'Fertilizer Calculator'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCalculatorModalOpen(true)} className="hover:text-white transition-colors">
                    {isUrdu ? 'سولر پمپ سائزنگ ٹول' : 'Solar Pump Sizing'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setPostAdModalOpen(true)} className="hover:text-white transition-colors">
                    {isUrdu ? 'مفت اشتہار لگائیں' : 'Post Free Ad'}
                  </button>
                </li>
                <li className="pt-1 border-t border-stone-800">
                  <PWAInstallButton language={language} variant="footer" />
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
            <div>
              © 2026 {isUrdu ? 'کِسان بازار۔ جملہ حقوق محفوظ ہیں۔' : 'Kisan Bazaar. All rights reserved.'}
            </div>
            <div className="flex gap-4">
              <span>{isUrdu ? 'پنجاب، سندھ، خیبرپختونخوا، بلوچستان' : 'Punjab · Sindh · KP · Balochistan'}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 8. Modals Container */}
      <ProductDetailModal
        listing={selectedListing}
        isOpen={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        language={language}
        reviews={reviews}
        onOpenReviewModal={(listing) => {
          setReviewModalTarget({ listing, seller: listing.seller });
          setReviewModalOpen(true);
        }}
        onOpenSellerModal={(seller) => {
          setActiveSeller(seller);
          setSellerModalOpen(true);
        }}
        isSaved={selectedListing ? savedIds.includes(selectedListing.id) : false}
        onToggleSave={handleToggleSave}
        onHelpfulReview={handleHelpfulReview}
      />

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        listing={reviewModalTarget.listing}
        seller={reviewModalTarget.seller}
        language={language}
        onSubmitReview={handleSubmitReview}
      />

      <SellerProfileModal
        seller={activeSeller}
        isOpen={sellerModalOpen}
        onClose={() => setSellerModalOpen(false)}
        language={language}
        reviews={reviews}
        allListings={listings}
        onOpenReviewModal={() => {
          if (activeSeller) {
            setReviewModalTarget({ seller: activeSeller });
            setReviewModalOpen(true);
          }
        }}
        onSelectListing={(listing) => setSelectedListing(listing)}
      />

      <PostAdModal
        isOpen={postAdModalOpen}
        onClose={() => setPostAdModalOpen(false)}
        language={language}
        onAddListing={handleAddListing}
      />

      <MandiRatesModal
        rates={MANDI_RATES}
        isOpen={mandiModalOpen}
        onClose={() => setMandiModalOpen(false)}
        language={language}
      />

      <AgriCalculatorModal
        isOpen={calculatorModalOpen}
        onClose={() => setCalculatorModalOpen(false)}
        language={language}
      />

      <SavedModal
        isOpen={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
        language={language}
        savedListings={savedListings}
        onSelectListing={(listing) => setSelectedListing(listing)}
        onRemoveSaved={handleToggleSave}
      />

      {/* 9. Offline Status Indicator */}
      <OfflineIndicator language={language} />
    </div>
  );
}
