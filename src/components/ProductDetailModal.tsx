import React, { useState } from 'react';
import { Listing, Language, Review, Seller } from '../types';
import { 
  X, Star, MapPin, Phone, MessageCircle, ShieldCheck, 
  ThumbsUp, Calendar, Heart, Share2, Tag, CheckCircle2 
} from 'lucide-react';

interface ProductDetailModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  reviews: Review[];
  onOpenReviewModal: (listing: Listing) => void;
  onOpenSellerModal: (seller: Seller) => void;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onHelpfulReview: (reviewId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  listing,
  isOpen,
  onClose,
  language,
  reviews,
  onOpenReviewModal,
  onOpenSellerModal,
  isSaved,
  onToggleSave,
  onHelpfulReview,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [offerAmount, setOfferAmount] = useState<string>('');
  const [offerSent, setOfferSent] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);

  if (!isOpen || !listing) return null;

  const isUrdu = language === 'ur';

  // Filter reviews matching this product
  const productReviews = reviews.filter(
    (r) => r.targetType === 'product' && r.targetId === listing.id
  );

  // Rating counts
  const totalReviews = productReviews.length;
  const avgRating = totalReviews > 0 
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : listing.rating.toFixed(1);

  const fiveStarCount = productReviews.filter((r) => r.rating === 5).length;
  const fourStarCount = productReviews.filter((r) => r.rating === 4).length;
  const threeStarCount = productReviews.filter((r) => r.rating === 3).length;

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerAmount) return;
    setOfferSent(true);
    setTimeout(() => {
      setOfferSent(false);
      setOfferAmount('');
    }, 3000);
  };

  const copyToClipboardFallback = async (text: string, url: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text}\n${url}`);
      }
      setCopiedLink(true);
      setShareSuccess(true);
      setTimeout(() => {
        setCopiedLink(false);
        setShareSuccess(false);
      }, 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleWebShare = async () => {
    const shareTitle = isUrdu 
      ? `${listing.titleUrdu} | کسان بازار` 
      : `${listing.title} | Kisan Bazaar`;
    const sharePrice = `Rs. ${listing.price.toLocaleString('en-PK')}${listing.type === 'rent' && listing.rentRateUnit ? ` (${listing.rentRateUnit})` : ''}`;
    const shareLocation = isUrdu ? listing.cityUrdu : listing.city;
    const shareText = isUrdu
      ? `کسان بازار پر زرعی سامان کا اشتہار دیکھیں:\n🚜 ${listing.titleUrdu}\n💰 قیمت: ${sharePrice}\n📍 مقام: ${shareLocation}\n📞 رابطہ: ${listing.seller.phone}`
      : `Check out this farm machinery on Kisan Bazaar:\n🚜 ${listing.title}\n💰 Price: ${sharePrice}\n📍 Location: ${shareLocation}\n📞 Contact: ${listing.seller.phone}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2500);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          await copyToClipboardFallback(shareText, shareUrl);
        }
      }
    } else {
      await copyToClipboardFallback(shareText, shareUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between gap-3 bg-stone-50/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <span className="px-2 py-0.5 rounded bg-emerald-100 uppercase tracking-wide">
              {listing.type === 'rent'
                ? isUrdu ? 'کرایہ پر دستیاب' : 'For Rent'
                : isUrdu ? 'برائے فروخت' : 'For Sale'}
            </span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              {isUrdu ? listing.cityUrdu : listing.city}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWebShare}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition-colors flex items-center gap-1.5"
              title={isUrdu ? 'سوشل میڈیا یا دیگر کسانوں کے ساتھ شیئر کریں' : 'Share listing'}
            >
              {shareSuccess || copiedLink ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
              <span className="hidden sm:inline text-xs font-medium text-stone-600">
                {shareSuccess || copiedLink ? (isUrdu ? 'شیئر ہو گیا' : 'Shared!') : (isUrdu ? 'شیئر' : 'Share')}
              </span>
            </button>
            <button
              onClick={(e) => onToggleSave(listing.id, e)}
              className="p-2 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-stone-200/60 transition-colors"
              title={isUrdu ? 'پسندیدہ' : 'Save'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'text-rose-500 fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main Grid: Left Gallery & Right Primary Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Gallery Column */}
            <div className="md:col-span-7 space-y-3">
              <div className="aspect-4/3 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-2xs relative">
                <img
                  src={listing.image}
                  alt={isUrdu ? listing.titleUrdu : listing.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 right-3 bg-stone-900/80 text-white text-xs px-2.5 py-1 rounded backdrop-blur-xs flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-semibold tabular-nums">{avgRating}</span>
                  <span>({totalReviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Price & Purchase Module (Right) */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold text-stone-900 mb-2 leading-snug ${isUrdu ? 'urdu-font' : ''}`}>
                  {isUrdu ? listing.titleUrdu : listing.title}
                </h1>

                {/* Price Display */}
                <div className="mb-4 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/70">
                  <div className="text-xs text-emerald-800 font-medium mb-0.5">
                    {listing.type === 'rent'
                      ? (isUrdu ? 'کرایہ کی شرح' : 'Rental Rate')
                      : (isUrdu ? 'مطالبہ کی گئی قیمت' : 'Asking Price')}
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tabular-nums">
                    Rs. {listing.price.toLocaleString('en-PK')}
                    {listing.type === 'rent' && listing.rentRateUnit && (
                      <span className="text-sm font-normal text-stone-600 ml-1">
                        / {listing.rentRateUnit}
                      </span>
                    )}
                  </div>
                  {listing.priceType === 'negotiable' && (
                    <span className="inline-block mt-1 text-xs text-emerald-700 font-medium">
                      ✓ {isUrdu ? 'قیمت میں موقع پر رعایت ممکن ہے (قابلِ بحث)' : 'Price is negotiable'}
                    </span>
                  )}
                </div>

                {/* Seller Quick Card */}
                <div 
                  onClick={() => onOpenSellerModal(listing.seller)}
                  className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-100/80 transition-colors cursor-pointer mb-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-stone-500 font-medium">
                        {isUrdu ? 'بیچنے والا کسان / ڈیلر:' : 'Seller Profile:'}
                      </div>
                      <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5 mt-0.5">
                        <span>{isUrdu ? listing.seller.nameUrdu : listing.seller.name}</span>
                        {listing.seller.verified && (
                          <span title="Verified Seller">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 inline" />
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="ml-1 text-stone-900">{listing.seller.rating}</span>
                      </div>
                      <span className="text-[11px] text-stone-500">
                        {isUrdu ? `${listing.seller.totalReviews} جائزے` : `${listing.seller.totalReviews} reviews`}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-stone-500 flex items-center justify-between pt-2 border-t border-stone-200/60">
                    <span>{isUrdu ? `شہر: ${listing.seller.cityUrdu}` : `Location: ${listing.seller.city}`}</span>
                    <span className="text-emerald-700 font-medium">
                      {isUrdu ? 'مکمل پروفائل دیکھیں →' : 'View Profile →'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Action Buttons */}
              <div className="space-y-2">
                <a
                  href={`https://wa.me/${listing.seller.whatsapp}?text=${encodeURIComponent(
                    isUrdu
                      ? `السلام علیکم، میں آپ کا اشتہار "${listing.titleUrdu}" (قیمت: Rs. ${listing.price.toLocaleString()}) کسان بازار پر دیکھ کر رابطہ کر رہا ہوں۔ کیا یہ ابھی دستیاب ہے؟`
                      : `Hello, I saw your listing "${listing.title}" for Rs. ${listing.price.toLocaleString()} on Kisan Bazaar. Is it still available?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isUrdu ? 'واٹس ایپ پر رابطہ کریں' : 'Chat on WhatsApp'}</span>
                </a>

                <a
                  href={`tel:${listing.seller.phone}`}
                  className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{isUrdu ? `براہ راست کال کریں (${listing.seller.phone})` : `Call Seller (${listing.seller.phone})`}</span>
                </a>

                <button
                  type="button"
                  onClick={handleWebShare}
                  className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 border border-stone-300 hover:border-emerald-600 text-stone-800 hover:text-emerald-900 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                  title={isUrdu ? 'واٹس ایپ، فیس بک یا میسج پر شیئر کریں' : 'Share on WhatsApp, Facebook, or Social platforms'}
                >
                  {shareSuccess || copiedLink ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-800">
                        {isUrdu ? 'کامیابی سے شیئر ہو گیا / لنک کاپی ہو گیا!' : 'Shared / Link Copied!'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-emerald-700" />
                      <span>{isUrdu ? 'دیگر کسان بھائیوں کے ساتھ شیئر کریں' : 'Share with Other Farmers'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs: Specs/Description vs Reviews */}
          <div className="border-b border-stone-200">
            <div className="flex gap-6 text-sm font-semibold">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-3 transition-colors ${
                  activeTab === 'details'
                    ? 'border-b-2 border-emerald-600 text-emerald-800'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {isUrdu ? 'تفصیلات اور خصوصیات' : 'Specs & Details'}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-emerald-600 text-emerald-800'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <span>{isUrdu ? 'کسانوں کے جائزے اور ریٹنگز' : 'Customer Reviews'}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs tabular-nums">
                  {totalReviews}
                </span>
              </button>
            </div>
          </div>

          {/* Tab 1: Details & Specs */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-stone-900 mb-2">
                  {isUrdu ? 'تفصیلی تفصیلات' : 'Description'}
                </h3>
                <p className={`text-stone-700 text-sm leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200 ${isUrdu ? 'urdu-font' : ''}`}>
                  {isUrdu ? listing.descriptionUrdu : listing.description}
                </p>
              </div>

              {/* Technical Specifications Grid */}
              {listing.specs && listing.specs.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 mb-2">
                    {isUrdu ? 'تکنیکی معلومات اور تصریحات' : 'Technical Specifications'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {listing.specs.map((spec, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200/80 text-xs sm:text-sm"
                      >
                        <span className="text-stone-500 font-medium">
                          {isUrdu ? spec.labelUrdu : spec.label}
                        </span>
                        <span className="font-semibold text-stone-900">
                          {isUrdu ? spec.valueUrdu : spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Make an Offer Section */}
              <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-4">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm mb-1">
                  <Tag className="w-4 h-4 text-amber-600" />
                  <span>{isUrdu ? 'کیا آپ مناسب قیمت کی پیشکش کرنا چاہتے ہیں؟' : 'Make an Offer'}</span>
                </div>
                <p className="text-xs text-stone-600 mb-3">
                  {isUrdu
                    ? 'اپنی مطلوبہ قیمت درج کریں، ہم بیچنے والے کو فوری مطلع کریں گے۔'
                    : 'Submit your price offer. The seller will be notified directly.'}
                </p>

                {offerSent ? (
                  <div className="bg-emerald-100 text-emerald-800 text-xs font-semibold p-3 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      {isUrdu
                        ? `آپ کی پیشکش (Rs. ${offerAmount}) بیچنے والے کو بھیج دی گئی ہے!`
                        : `Your offer of Rs. ${offerAmount} has been sent to the seller!`}
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleSendOffer} className="flex gap-2">
                    <input
                      type="number"
                      required
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      placeholder={isUrdu ? 'اپنی پیشکش درج کریں (مثلاً 3200000)' : 'Enter offer (e.g. 3200000)'}
                      className="flex-1 px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors whitespace-nowrap"
                    >
                      {isUrdu ? 'پیشکش بھیجیں' : 'Send Offer'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Reviews & Ratings */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Review Overview Bar */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Score & Stars */}
                <div className="text-center sm:text-right">
                  <div className="text-4xl font-extrabold text-stone-900 tabular-nums">
                    {avgRating}
                    <span className="text-lg font-normal text-stone-400">/5</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1 my-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          Number(avgRating) >= s ? 'fill-amber-400' : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-stone-500">
                    {isUrdu ? `مجموعی طور پر ${totalReviews} جائزے` : `Based on ${totalReviews} reviews`}
                  </div>
                </div>

                {/* Rating Distribution Bars */}
                <div className="w-full sm:w-64 space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-stone-500">5 {isUrdu ? 'ستارے' : 'star'}</span>
                    <div className="flex-1 bg-stone-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full"
                        style={{ width: `${totalReviews ? (fiveStarCount / totalReviews) * 100 : 80}%` }}
                      />
                    </div>
                    <span className="w-6 text-right tabular-nums">{fiveStarCount}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-12 text-stone-500">4 {isUrdu ? 'ستارے' : 'star'}</span>
                    <div className="flex-1 bg-stone-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full"
                        style={{ width: `${totalReviews ? (fourStarCount / totalReviews) * 100 : 20}%` }}
                      />
                    </div>
                    <span className="w-6 text-right tabular-nums">{fourStarCount}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-12 text-stone-500">3 {isUrdu ? 'ستارے' : 'star'}</span>
                    <div className="flex-1 bg-stone-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full"
                        style={{ width: `${totalReviews ? (threeStarCount / totalReviews) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="w-6 text-right tabular-nums">{threeStarCount}</span>
                  </div>
                </div>

                {/* CTA to Write Review */}
                <button
                  type="button"
                  onClick={() => onOpenReviewModal(listing)}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors shrink-0 whitespace-nowrap"
                >
                  {isUrdu ? '+ اپنی رائے درج کریں' : '+ Write a Review'}
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {productReviews.length === 0 ? (
                  <div className="text-center py-8 bg-stone-50 rounded-xl border border-stone-200 text-stone-500 text-sm">
                    {isUrdu
                      ? 'اس سامان کے لیے ابھی کوئی تفصیلی جائزہ نہیں لکھا گیا۔ پہلے کسان بن کر اپنی رائے دیں!'
                      : 'No detailed reviews yet for this listing. Be the first farmer to leave feedback!'}
                  </div>
                ) : (
                  productReviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 rounded-xl border border-stone-200 bg-white hover:border-emerald-200 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                            {review.authorName[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-stone-900 text-sm flex items-center gap-1.5">
                              <span>{review.authorName}</span>
                              {review.verifiedFarmer && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-medium border border-emerald-200">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  {isUrdu ? 'تصدیق شدہ کسان' : 'Verified Farmer'}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-stone-400">
                              {review.authorCity}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  review.rating >= s ? 'fill-amber-400' : 'text-stone-200'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3 inline" />
                            {review.date}
                          </div>
                        </div>
                      </div>

                      {/* Comment text */}
                      <p className={`text-stone-700 text-sm leading-relaxed mb-3 ${isUrdu ? 'urdu-font' : ''}`}>
                        {isUrdu && review.commentUrdu ? review.commentUrdu : review.comment}
                      </p>

                      {/* Helpful Button */}
                      <div className="flex items-center gap-3 pt-2 border-t border-stone-100 text-xs text-stone-500">
                        <span>{isUrdu ? 'کیا یہ رائے مفید تھی؟' : 'Was this review helpful?'}</span>
                        <button
                          type="button"
                          onClick={() => onHelpfulReview(review.id)}
                          className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium px-2 py-0.5 rounded hover:bg-emerald-50 transition-colors tabular-nums"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{review.helpfulCount}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
