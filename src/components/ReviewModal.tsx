import React, { useState } from 'react';
import { Review, Language, Listing, Seller } from '../types';
import { Star, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing?: Listing | null;
  seller?: Seller | null;
  language: Language;
  onSubmitReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  listing,
  seller,
  language,
  onSubmitReview,
}) => {
  const isUrdu = language === 'ur';

  // Review target can be 'product' or 'seller'
  const [reviewType, setReviewType] = useState<'product' | 'seller'>('product');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState<string>('');
  const [authorCity, setAuthorCity] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [verifiedFarmer, setVerifiedFarmer] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const targetSeller = seller || listing?.seller;

  const getRatingDescription = (stars: number) => {
    switch (stars) {
      case 5:
        return isUrdu ? 'بہترین معیار اور مکمل ایمانداری' : 'Exceptional quality & honesty';
      case 4:
        return isUrdu ? 'اچھا تجربہ، قابلِ اعتماد' : 'Good experience, reliable';
      case 3:
        return isUrdu ? 'مناسب، گزارا ہو گیا' : 'Average, satisfactory';
      case 2:
        return isUrdu ? 'کچھ خامیاں یا تاخیر تھی' : 'Had some issues or delays';
      case 1:
        return isUrdu ? 'غیر تسلی بخش تجربہ' : 'Disappointing experience';
      default:
        return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    const targetId = reviewType === 'product' && listing ? listing.id : (targetSeller ? targetSeller.id : 'unknown');

    onSubmitReview({
      targetId,
      targetType: reviewType,
      authorName: authorName.trim(),
      authorCity: authorCity.trim() || (isUrdu ? 'پنجاب' : 'Punjab'),
      rating,
      comment: comment.trim(),
      commentUrdu: isUrdu ? comment.trim() : undefined,
      verifiedFarmer,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      // Reset form
      setAuthorName('');
      setComment('');
      setAuthorCity('');
      setRating(5);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className={`text-xl font-bold text-stone-900 mb-2 ${isUrdu ? 'urdu-font' : ''}`}>
              {isUrdu ? 'آپ کا جائزہ کامیابی سے شامل ہو گیا!' : 'Review Submitted Successfully!'}
            </h3>
            <p className="text-sm text-stone-600">
              {isUrdu
                ? 'کسان برادری کے ساتھ سچی رائے شیئر کرنے کا شکریہ۔'
                : 'Thank you for sharing verified feedback with the farming community.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="mb-5 text-right">
              <h2 className={`text-xl font-bold text-stone-900 ${isUrdu ? 'urdu-font' : ''}`}>
                {isUrdu ? 'اپنی رائے اور ریٹنگ درج کریں' : 'Leave a Rating & Review'}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {isUrdu
                  ? 'آپ کی رائے سے دیگر کسان بھائیوں کو بااعتماد فیصلہ کرنے میں مدد ملے گی'
                  : 'Your honest feedback helps fellow farmers make informed equipment decisions.'}
              </p>
            </div>

            {/* Target Selector: Product or Seller (if both available) */}
            {listing && targetSeller && (
              <div className="mb-4 p-1 bg-stone-100 rounded-xl flex items-center gap-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setReviewType('product')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all text-center ${
                    reviewType === 'product'
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {isUrdu ? `مصنوعات کا جائزہ (${listing.titleUrdu.slice(0, 20)}...)` : 'Review This Equipment'}
                </button>
                <button
                  type="button"
                  onClick={() => setReviewType('seller')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all text-center ${
                    reviewType === 'seller'
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {isUrdu ? `بیچنے والے کا جائزہ (${targetSeller.nameUrdu})` : 'Review Seller'}
                </button>
              </div>
            )}

            {/* Interactive Star Rating */}
            <div className="mb-5 bg-stone-50 p-4 rounded-xl border border-stone-200/80 text-center">
              <label className="block text-xs font-medium text-stone-700 mb-2">
                {isUrdu ? 'ستارے منتخب کریں:' : 'Select Star Rating:'}
              </label>

              <div className="flex items-center justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none transition-transform hover:scale-120"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-semibold text-emerald-800 h-4">
                {getRatingDescription(hoverRating || rating)}
              </div>
            </div>

            {/* Reviewer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {isUrdu ? 'آپ کا نام *' : 'Your Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder={isUrdu ? 'مثلاً: ملک کاشف یا چوہدری اصغر' : 'e.g. Tariq Mehmood'}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {isUrdu ? 'آپ کا شہر یا علاقہ' : 'Your City / Tehsil'}
                </label>
                <input
                  type="text"
                  value={authorCity}
                  onChange={(e) => setAuthorCity(e.target.value)}
                  placeholder={isUrdu ? 'مثلاً: اوکاڑہ، خانیوال، ملتان' : 'e.g. Sahiwal'}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Comment Text Area */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-stone-700 mb-1">
                {isUrdu ? 'تفصیلی رائے / تجربہ بیان کریں *' : 'Detailed Review / Feedback *'}
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  isUrdu
                    ? 'سامان کی کارکردگی، حالت، کاغذات کی درستی اور بیچنے والے کے رویے کے بارے میں سچائی سے لکھیں...'
                    : 'Describe machine condition, performance, paperwork, and seller reliability...'
                }
                className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder:text-stone-400"
              />
            </div>

            {/* Verified Farmer Badge Checkbox */}
            <div className="mb-6 flex items-start gap-2.5 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/60">
              <input
                type="checkbox"
                id="verifiedCheck"
                checked={verifiedFarmer}
                onChange={(e) => setVerifiedFarmer(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
              />
              <label htmlFor="verifiedCheck" className="text-xs text-stone-700 cursor-pointer">
                <span className="font-semibold text-emerald-900 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {isUrdu ? 'تصدیق شدہ کسان جائزہ' : 'Verified Farmer Purchase'}
                </span>
                <span className="text-stone-500 block mt-0.5">
                  {isUrdu
                    ? 'میں تصدیق کرتا ہوں کہ میں نے یہ سامان خریدا، دیکھا یا ذاتی طور پر استعمال کیا ہے۔'
                    : 'I confirm that I have personally bought, tested, or utilized this equipment.'}
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg"
              >
                {isUrdu ? 'منسوخ کریں' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
              >
                {isUrdu ? 'جائزہ جمع کروائیں' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
