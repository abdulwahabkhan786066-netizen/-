import React from 'react';
import { Listing, Language } from '../types';
import { X, Heart, Trash2 } from 'lucide-react';

interface SavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  savedListings: Listing[];
  onSelectListing: (listing: Listing) => void;
  onRemoveSaved: (id: string, e: React.MouseEvent) => void;
}

export const SavedModal: React.FC<SavedModalProps> = ({
  isOpen,
  onClose,
  language,
  savedListings,
  onSelectListing,
  onRemoveSaved,
}) => {
  if (!isOpen) return null;

  const isUrdu = language === 'ur';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className={`text-lg sm:text-xl font-bold text-stone-900 ${isUrdu ? 'urdu-font' : ''}`}>
              {isUrdu ? 'پسندیدہ اشتہارات' : 'Saved Equipment'}
            </h2>
            <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-semibold tabular-nums">
              {savedListings.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-6">
          {savedListings.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-semibold text-stone-700 mb-1">
                {isUrdu ? 'کوئی اشتہار محفوظ نہیں کیا گیا' : 'No Saved Listings Yet'}
              </h3>
              <p className="text-xs text-stone-500">
                {isUrdu
                  ? 'سامان کے کارڈ پر موجود دل کے نشان پر کلک کر کے اسے بعد کے لیے محفوظ کریں۔'
                  : 'Click the heart icon on any tractor or machinery to save for later.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedListings.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onClose();
                    onSelectListing(item);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-emerald-300 transition-all cursor-pointer gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={isUrdu ? item.titleUrdu : item.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-stone-900 truncate">
                        {isUrdu ? item.titleUrdu : item.title}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {isUrdu ? item.cityUrdu : item.city} · {item.seller.name}
                      </div>
                      <div className="text-sm font-bold text-emerald-900 tabular-nums mt-1">
                        Rs. {item.price.toLocaleString('en-PK')}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => onRemoveSaved(item.id, e)}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title={isUrdu ? 'حذف کریں' : 'Remove'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
