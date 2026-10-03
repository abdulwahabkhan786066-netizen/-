import React, { useState } from 'react';
import { Language, Category, ItemCondition, Listing, ListingType } from '../types';
import { X, Upload, CheckCircle2, ShieldAlert } from 'lucide-react';
import { CITIES } from '../data/mockData';

import tractorImg from '../assets/images/tractor_massey_red_1791027703890.jpg';
import solarPumpImg from '../assets/images/solar_tubewell_pump_1791027717588.jpg';
import harvesterImg from '../assets/images/combine_harvester_agri_1791027728916.jpg';
import seedsFertilizerImg from '../assets/images/fertilizer_seeds_sacks_1791027740027.jpg';

interface PostAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAddListing: (listing: Listing) => void;
}

export const PostAdModal: React.FC<PostAdModalProps> = ({
  isOpen,
  onClose,
  language,
  onAddListing,
}) => {
  const isUrdu = language === 'ur';

  const [adListingType, setAdListingType] = useState<ListingType>('sale');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('tractors');
  const [price, setPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [rentUnit, setRentUnit] = useState('فی ایکڑ');
  const [condition, setCondition] = useState<ItemCondition>('used');
  const [city, setCity] = useState('Faisalabad');
  const [cityUrdu, setCityUrdu] = useState('فیصل آباد');
  const [description, setDescription] = useState('');
  const [hp, setHp] = useState('85 HP');
  const [modelYear, setModelYear] = useState('2022');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [selectedImagePreset, setSelectedImagePreset] = useState<string>(tractorImg);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCity(val);
    const found = CITIES.find((c) => c.en === val);
    if (found) setCityUrdu(found.ur);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !sellerName.trim() || !sellerPhone.trim()) return;

    const newListing: Listing = {
      id: `custom-list-${Date.now()}`,
      title: title.trim(),
      titleUrdu: title.trim(),
      category,
      price: Number(price),
      priceType: isNegotiable ? 'negotiable' : 'fixed',
      type: adListingType,
      rentRateUnit: adListingType === 'rent' ? rentUnit : undefined,
      condition,
      city,
      cityUrdu,
      image: selectedImagePreset,
      description: description.trim() || 'No detailed description provided.',
      descriptionUrdu: description.trim() || 'تفصیلات کے لیے براہ راست کال یا واٹس ایپ پر رابطہ کریں۔',
      specs: [
        { label: 'Model Year', labelUrdu: 'ماڈل سال', value: modelYear || '2023', valueUrdu: modelYear || '2023' },
        { label: 'Horse Power', labelUrdu: 'ہارس پاور', value: hp || 'Standard', valueUrdu: hp || 'معیاری' },
        { label: 'Condition', labelUrdu: 'حالت', value: condition === 'new' ? 'Brand New' : 'Used Clean', valueUrdu: condition === 'new' ? 'بالکل نیا' : 'استعمال شدہ صاف' },
      ],
      seller: {
        id: `seller-custom-${Date.now()}`,
        name: sellerName.trim(),
        nameUrdu: sellerName.trim(),
        phone: sellerPhone.trim(),
        whatsapp: sellerPhone.replace(/\D/g, ''),
        city,
        cityUrdu,
        verified: true,
        memberSince: '2026',
        totalDeals: 1,
        rating: 5.0,
        totalReviews: 1,
        responseTime: 'Under 15 mins',
        responseTimeUrdu: '15 منٹ کے اندر',
      },
      rating: 5.0,
      reviewsCount: 1,
      createdAt: new Date().toISOString().split('T')[0],
      featured: true,
    };

    onAddListing(newListing);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className={`text-lg sm:text-xl font-bold text-stone-900 ${isUrdu ? 'urdu-font' : ''}`}>
              {isUrdu ? 'نیا زرعی اشتہار لگائیں (مفت)' : 'Post Free Agriculture Ad'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {isUrdu ? 'اپنا سامان پورے پاکستان کے کسانوں کو دکھائیں' : 'Reach thousands of farmers and buyers across Pakistan'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-12 text-center my-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className={`text-xl font-bold text-stone-900 mb-2 ${isUrdu ? 'urdu-font' : ''}`}>
              {isUrdu ? 'آپ کا اشتہار کامیابی سے شامل ہو گیا!' : 'Ad Published Successfully!'}
            </h3>
            <p className="text-sm text-stone-600">
              {isUrdu
                ? 'اب خریدار براہ راست آپ کے نمبر اور واٹس ایپ پر رابطہ کر سکتے ہیں۔'
                : 'Your equipment is now live on Kisan Bazaar. Buyers will contact you directly.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
            {/* Type: Sale or Rent */}
            <div>
              <label className="block text-stone-700 font-semibold mb-1.5">
                {isUrdu ? 'اشتہار کی قسم:' : 'Listing Type:'}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAdListingType('sale')}
                  className={`flex-1 py-2 px-4 rounded-xl border text-center font-medium transition-all ${
                    adListingType === 'sale'
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {isUrdu ? 'برائے فروخت (بیچنا ہے)' : 'For Sale'}
                </button>
                <button
                  type="button"
                  onClick={() => setAdListingType('rent')}
                  className={`flex-1 py-2 px-4 rounded-xl border text-center font-medium transition-all ${
                    adListingType === 'rent'
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {isUrdu ? 'کرایہ پر دینا ہے' : 'For Rent'}
                </button>
              </div>
            </div>

            {/* Ad Title */}
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {isUrdu ? 'اشتہار کا عنوان *' : 'Ad Title *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isUrdu ? 'مثلاً: میسی فرگوسن 385 ماڈل 2023 صاف حالت' : 'e.g. Massey Ferguson 385 Model 2023 clean'}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  {isUrdu ? 'سامان کا زمرہ *' : 'Category *'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="tractors">{isUrdu ? 'ٹریکٹر اور زرعی مشینری' : 'Tractors & Heavy Machinery'}</option>
                  <option value="solar_tubewells">{isUrdu ? 'سولر اور ٹیوب ویل' : 'Solar & Tube Wells'}</option>
                  <option value="harvesters">{isUrdu ? 'ہارویسٹر اور تھریشر' : 'Harvesters & Threshers'}</option>
                  <option value="seeds_fertilizers">{isUrdu ? 'بیج اور کھاد' : 'Seeds & Fertilizers'}</option>
                  <option value="implements">{isUrdu ? 'زرعی اوزار اور ٹرالیاں' : 'Farm Implements & Trolleys'}</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  {isUrdu ? 'سامان کی حالت *' : 'Condition *'}
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as ItemCondition)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="used">{isUrdu ? 'استعمال شدہ (Used)' : 'Used'}</option>
                  <option value="new">{isUrdu ? 'بالکل نیا (Brand New)' : 'Brand New'}</option>
                  <option value="reconditioned">{isUrdu ? 'ری کنڈیشنڈ (Reconditioned)' : 'Reconditioned'}</option>
                </select>
              </div>
            </div>

            {/* Price & Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  {isUrdu ? 'قیمت یا کرایہ (روپے میں) *' : 'Price / Rent in PKR *'}
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 2500000"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white tabular-nums"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-stone-700">
                  <input
                    type="checkbox"
                    checked={isNegotiable}
                    onChange={(e) => setIsNegotiable(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                  />
                  <span>{isUrdu ? 'قیمت میں رعایت ممکن ہے (قابلِ بحث)' : 'Price is Negotiable'}</span>
                </label>
              </div>
            </div>

            {/* City & Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  {isUrdu ? 'شہر / مقام *' : 'City / Location *'}
                </label>
                <select
                  value={city}
                  onChange={handleCityChange}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {CITIES.filter((c) => c.en !== 'All Cities').map((c) => (
                    <option key={c.en} value={c.en}>
                      {isUrdu ? c.ur : c.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  {isUrdu ? 'ماڈل سال' : 'Model Year'}
                </label>
                <input
                  type="text"
                  value={modelYear}
                  onChange={(e) => setModelYear(e.target.value)}
                  placeholder="2022"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  {isUrdu ? 'ہارس پاور / طاقت' : 'Horse Power'}
                </label>
                <input
                  type="text"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  placeholder="85 HP"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Photo Preset Selector */}
            <div>
              <label className="block text-stone-700 font-semibold mb-1.5">
                {isUrdu ? 'سامان کی تصویر منتخب کریں:' : 'Select Machinery Image Preset:'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { img: tractorImg, label: isUrdu ? 'ٹریکٹر' : 'Tractor' },
                  { img: solarPumpImg, label: isUrdu ? 'سولر پمپ' : 'Solar Pump' },
                  { img: harvesterImg, label: isUrdu ? 'ہارویسٹر' : 'Harvester' },
                  { img: seedsFertilizerImg, label: isUrdu ? 'بیج و کھاد' : 'Seeds' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImagePreset(item.img)}
                    className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-4/3 ${
                      selectedImagePreset === item.img
                        ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={item.img}
                      alt={item.label}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-1 right-1 text-[10px] bg-stone-900/80 text-white px-1.5 py-0.2 rounded backdrop-blur-xs">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {isUrdu ? 'تفصیلی بیان (حالت، کاغذات، ٹائر، انجن...)' : 'Detailed Description'}
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={isUrdu ? 'سامان کے بارے میں ضروری معلومات درج کریں...' : 'Mention tires, registration, mechanical condition...'}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder:text-stone-400"
              />
            </div>

            {/* Seller Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200/60">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  {isUrdu ? 'آپ کا نام *' : 'Seller Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  placeholder={isUrdu ? 'مثلاً: ملک سجاد احمد' : 'e.g. Malik Sajjad'}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  {isUrdu ? 'موبائل نمبر / واٹس ایپ *' : 'Phone / WhatsApp *'}
                </label>
                <input
                  type="text"
                  required
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 tabular-nums"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-medium text-stone-600 hover:text-stone-900 rounded-lg"
              >
                {isUrdu ? 'منسوخ کریں' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-all"
              >
                {isUrdu ? 'اشتہار شائع کریں' : 'Publish Ad Now'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
