import React from 'react';
import { Seller, Language, Review, Listing } from '../types';
import { X, Star, ShieldCheck, Phone, MessageCircle, Calendar, CheckCircle2, UserCheck } from 'lucide-react';

interface SellerProfileModalProps {
  seller: Seller | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  reviews: Review[];
  allListings: Listing[];
  onOpenReviewModal: () => void;
  onSelectListing: (listing: Listing) => void;
}

export const SellerProfileModal: React.FC<SellerProfileModalProps> = ({
  seller,
  isOpen,
  onClose,
  language,
  reviews,
  allListings,
  onOpenReviewModal,
  onSelectListing,
}) => {
  if (!isOpen || !seller) return null;

  const isUrdu = language === 'ur';

  // Seller specific reviews
  const sellerReviews = reviews.filter(
    (r) => r.targetType === 'seller' && r.targetId === seller.id
  );

  // Listings by this seller
  const sellerListings = allListings.filter((l) => l.seller.id === seller.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-700 border-2 border-white/30 flex items-center justify-center text-2xl font-bold text-white shadow-md">
              {seller.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-xl font-bold text-white ${isUrdu ? 'urdu-font' : ''}`}>
                  {isUrdu ? seller.nameUrdu : seller.name}
                </h2>
                {seller.verified && (
                  <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isUrdu ? 'تصدیق شدہ تاجر' : 'Verified Dealer'}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200/90 mt-1">
                {isUrdu ? `شہر: ${seller.cityUrdu} · رکنیت: ${seller.memberSince} سے` : `Location: ${seller.city} · Member since ${seller.memberSince}`}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 divide-x divide-stone-200 border-b border-stone-200 bg-stone-50 py-3 text-center text-xs">
          <div>
            <div className="text-stone-500">{isUrdu ? 'اوسط ریٹنگ' : 'Average Rating'}</div>
            <div className="font-bold text-stone-900 text-sm flex items-center justify-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="tabular-nums">{seller.rating}</span>
            </div>
          </div>
          <div>
            <div className="text-stone-500">{isUrdu ? 'کامیاب ڈیلز' : 'Total Deals'}</div>
            <div className="font-bold text-stone-900 text-sm mt-0.5 tabular-nums">
              {seller.totalDeals}+ {isUrdu ? 'ڈیلز' : 'deals'}
            </div>
          </div>
          <div>
            <div className="text-stone-500">{isUrdu ? 'جواب کا وقت' : 'Response Time'}</div>
            <div className="font-bold text-stone-900 text-sm mt-0.5">
              {isUrdu ? seller.responseTimeUrdu : seller.responseTime}
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Contact Direct */}
          <div className="flex gap-2">
            <a
              href={`https://wa.me/${seller.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isUrdu ? 'واٹس ایپ پر میسج بھیجیں' : 'Chat on WhatsApp'}</span>
            </a>
            <a
              href={`tel:${seller.phone}`}
              className="flex-1 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{isUrdu ? `کال کریں (${seller.phone})` : `Call ${seller.phone}`}</span>
            </a>
          </div>

          {/* Active Listings by Seller */}
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center justify-between">
              <span>{isUrdu ? 'اس ڈیلر کے دیگر فعال اشتہارات' : 'Active Equipment by this Seller'}</span>
              <span className="text-xs text-stone-500 tabular-nums">
                ({sellerListings.length})
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sellerListings.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onClose();
                    onSelectListing(item);
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-emerald-300 transition-all cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={isUrdu ? item.titleUrdu : item.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-stone-900 truncate">
                      {isUrdu ? item.titleUrdu : item.title}
                    </div>
                    <div className="text-xs font-bold text-emerald-900 tabular-nums mt-0.5">
                      Rs. {item.price.toLocaleString('en-PK')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seller Feedback Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-stone-900">
                {isUrdu ? 'خریداروں کی آراء اور فیڈ بیک' : 'Farmer Feedback on this Seller'}
              </h3>
              <button
                type="button"
                onClick={onOpenReviewModal}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                {isUrdu ? '+ اپنی رائے دیں' : '+ Leave Feedback'}
              </button>
            </div>

            <div className="space-y-3">
              {sellerReviews.length === 0 ? (
                <div className="text-center py-6 bg-stone-50 rounded-xl border border-stone-200 text-stone-500 text-xs">
                  {isUrdu
                    ? 'اس ڈیلر کے بارے میں کسانوں نے مثبت ریٹنگ دی ہے۔ تفصیلی تبصرہ شامل کرنے کے لیے اوپر کلک کریں۔'
                    : 'Verified good standing. Click above to leave a specific comment for this seller.'}
                </div>
              ) : (
                sellerReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{rev.authorName}</span>
                        <span className="text-stone-400 font-normal">({rev.authorCity})</span>
                      </div>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3 h-3 ${rev.rating >= s ? 'fill-amber-400' : 'text-stone-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className={`text-stone-700 leading-relaxed mt-1 ${isUrdu ? 'urdu-font' : ''}`}>
                      {isUrdu && rev.commentUrdu ? rev.commentUrdu : rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
