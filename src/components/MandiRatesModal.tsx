import React, { useState } from 'react';
import { MandiRate, Language } from '../types';
import { X, TrendingUp, TrendingDown, Minus, Search, Calendar, MapPin } from 'lucide-react';

interface MandiRatesModalProps {
  rates: MandiRate[];
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const MandiRatesModal: React.FC<MandiRatesModalProps> = ({
  rates,
  isOpen,
  onClose,
  language,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const isUrdu = language === 'ur';

  const filteredRates = rates.filter((r) => {
    const text = `${r.commodity} ${r.commodityUrdu} ${r.mandi} ${r.mandiUrdu}`.toLowerCase();
    return text.includes(filterQuery.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-emerald-900 text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h2 className={`text-lg sm:text-xl font-bold ${isUrdu ? 'urdu-font' : ''}`}>
                {isUrdu ? 'آج کے غلہ منڈی اور کھاد کے ریٹس' : 'Daily Mandi & Fertilizer Rates'}
              </h2>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              {isUrdu ? 'پنجاب اور سندھ کی مرکزی غلہ منڈیوں کے سرکاری و مارکیٹ ریٹ (فی 40 کلو / من)' : 'Official & market commodity rates per 40 KG (Maund)'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder={isUrdu ? 'اجناس تلاش کریں (گندم، کپاس، چاول، کھاد...)' : 'Search commodity (Wheat, Cotton, Rice, DAP...)'}
              className="w-full pr-9 pl-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <div className="text-xs text-stone-500 hidden sm:flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>{isUrdu ? 'تازہ ترین اپ ڈیٹ' : 'Live Update'}</span>
          </div>
        </div>

        {/* Rates Table */}
        <div className="overflow-y-auto p-4 sm:p-6">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-semibold">
                <th className="pb-3 text-right">{isUrdu ? 'جنس / سامان' : 'Commodity'}</th>
                <th className="pb-3 text-right">{isUrdu ? 'منڈی' : 'Mandi Location'}</th>
                <th className="pb-3 text-center">{isUrdu ? 'قیمت (فی من)' : 'Rate / 40kg'}</th>
                <th className="pb-3 text-center">{isUrdu ? 'تبدیلی' : 'Change'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredRates.map((rate) => {
                const isUp = rate.change > 0;
                const isDown = rate.change < 0;

                return (
                  <tr key={rate.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 text-right">
                      <div className="font-semibold text-stone-900">
                        {isUrdu ? rate.commodityUrdu : rate.commodity}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        {rate.date}
                      </div>
                    </td>

                    <td className="py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-stone-600">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {isUrdu ? rate.mandiUrdu : rate.mandi}
                      </span>
                    </td>

                    <td className="py-3 text-center font-bold text-emerald-950 tabular-nums text-sm sm:text-base">
                      Rs. {rate.pricePerMaund.toLocaleString()}
                    </td>

                    <td className="py-3 text-center tabular-nums">
                      {isUp && (
                        <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded">
                          <TrendingUp className="w-3 h-3" />
                          +{rate.change}
                        </span>
                      )}
                      {isDown && (
                        <span className="inline-flex items-center gap-0.5 text-rose-600 font-semibold text-xs bg-rose-50 px-2 py-0.5 rounded">
                          <TrendingDown className="w-3 h-3" />
                          {rate.change}
                        </span>
                      )}
                      {!isUp && !isDown && (
                        <span className="inline-flex items-center gap-0.5 text-stone-500 text-xs bg-stone-100 px-2 py-0.5 rounded">
                          <Minus className="w-3 h-3" />
                          مستحکم
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-6 p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs text-amber-900 leading-relaxed">
            <strong>{isUrdu ? 'نوٹ برائے کسان بھائی:' : 'Important Note:'}</strong>{' '}
            {isUrdu
              ? 'یہ ریٹس متعلقہ مارکیٹ کمیٹیوں اور غلہ منڈیوں کے سرکاری اور بولی ڈیٹا کے مطابق ہیں، مال کے معیار اور نمی کی بنیاد پر فی من نرخ میں معمولی فرق ہو سکتا ہے۔'
              : 'Rates are gathered from official market committees and prevailing auctions. Actual rates may vary based on moisture and grade.'}
          </div>
        </div>
      </div>
    </div>
  );
};
