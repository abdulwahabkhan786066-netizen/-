import React from 'react';
import { Listing, Language } from '../types';
import { Star, MapPin, Heart, Phone, MessageCircle } from 'lucide-react';

interface ProductCardProps {
  listing: Listing;
  language: Language;
  onSelect: (listing: Listing) => void;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onOpenSeller: (seller: Listing['seller'], e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  listing,
  language,
  onSelect,
  isSaved,
  onToggleSave,
  onOpenSeller,
}) => {
  const isUrdu = language === 'ur';

  // Format price
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PK');
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'tractors':
        return isUrdu ? 'ٹریکٹر' : 'Tractor';
      case 'solar_tubewells':
        return isUrdu ? 'سولر پمپ' : 'Solar Pump';
      case 'harvesters':
        return isUrdu ? 'ہارویسٹر' : 'Harvester';
      case 'seeds_fertilizers':
        return isUrdu ? 'بیج و کھاد' : 'Seeds & Fertilizer';
      case 'implements':
        return isUrdu ? 'زرعی اوزار' : 'Farm Tools';
      default:
        return isUrdu ? 'زرعی سامان' : 'Agri Goods';
    }
  };

  const getConditionLabel = (cond: string) => {
    switch (cond) {
      case 'new':
        return isUrdu ? 'نیا' : 'New';
      case 'used':
        return isUrdu ? 'استعمال شدہ' : 'Used';
      case 'reconditioned':
        return isUrdu ? 'ری کنڈیشنڈ' : 'Reconditioned';
      default:
        return cond;
    }
  };

  return (
    <div
      onClick={() => onSelect(listing)}
      className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Product Image Slot (65% visual weight) */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
        <img
          src={listing.image}
          alt={isUrdu ? listing.titleUrdu : listing.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
        />

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => onToggleSave(listing.id, e)}
          className="absolute top-2.5 left-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-sm backdrop-blur-xs transition-colors"
          title={isUrdu ? 'پسندیدہ میں شامل کریں' : 'Save to favorites'}
        >
          <Heart
            className={`w-4 h-4 ${
              isSaved ? 'text-rose-500 fill-rose-500' : 'text-stone-600 hover:text-rose-500'
            }`}
          />
        </button>

        {/* Quiet Single Type Tag */}
        <div className="absolute bottom-2.5 right-2.5">
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded bg-stone-900/80 text-white backdrop-blur-xs">
            {listing.type === 'rent'
              ? isUrdu ? 'کرایہ پر' : 'For Rent'
              : isUrdu ? 'برائے فروخت' : 'For Sale'}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Unboxed Metadata Line with typographic separators */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5 flex-wrap">
            <span className="font-medium text-emerald-800">{getCategoryLabel(listing.category)}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-0.5">
              <MapPin className="w-3 h-3 text-stone-400 inline" />
              {isUrdu ? listing.cityUrdu : listing.city}
            </span>
            <span aria-hidden="true">·</span>
            <span>{getConditionLabel(listing.condition)}</span>
          </div>

          {/* Title */}
          <h3 className={`text-base font-semibold text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-2 mb-2 leading-snug ${isUrdu ? 'urdu-font' : ''}`}>
            {isUrdu ? listing.titleUrdu : listing.title}
          </h3>

          {/* Rating and Reviews Counter */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600 mb-3">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="ml-1 font-semibold text-stone-900 tabular-nums">{listing.rating.toFixed(1)}</span>
            </div>
            <span aria-hidden="true">·</span>
            <span className="text-stone-500 tabular-nums">
              {isUrdu ? `${listing.reviewsCount} جائزے` : `(${listing.reviewsCount} reviews)`}
            </span>
          </div>
        </div>

        {/* Footer Area: Price & Action */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          {/* Price */}
          <div>
            <div className="text-xs text-stone-500 font-medium">
              {listing.type === 'rent' ? (isUrdu ? 'کرایہ' : 'Rent Rate') : (isUrdu ? 'قیمت' : 'Price')}
            </div>
            <div className="text-lg font-bold text-emerald-900 tabular-nums">
              Rs. {formatPrice(listing.price)}
              {listing.type === 'rent' && listing.rentRateUnit && (
                <span className="text-xs text-stone-500 font-normal ml-1">
                  {listing.rentRateUnit}
                </span>
              )}
            </div>
          </div>

          {/* Seller / Contact Button */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => onOpenSeller(listing.seller, e)}
              className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              title={isUrdu ? 'بیچنے والے کی معلومات' : 'View Seller'}
            >
              <Phone className="w-3.5 h-3.5" />
            </button>
            <a
              href={`https://wa.me/${listing.seller.whatsapp}?text=${encodeURIComponent(
                isUrdu
                  ? `السلام علیکم، میں آپ کا اشتہار "${listing.titleUrdu}" کسان بازار پر دیکھ کر رابطہ کر رہا ہوں۔ کیا یہ دستیاب ہے؟`
                  : `Hello, I am contacting you regarding your listing "${listing.title}" on Kisan Bazaar.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1 transition-colors"
              title={isUrdu ? 'واٹس ایپ پر رابطہ کریں' : 'WhatsApp'}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isUrdu ? 'رابطہ' : 'Chat'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
