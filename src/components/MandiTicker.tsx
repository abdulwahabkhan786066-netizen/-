import React from 'react';
import { MandiRate, Language } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MandiTickerProps {
  rates: MandiRate[];
  language: Language;
  onOpenMandiRates: () => void;
}

export const MandiTicker: React.FC<MandiTickerProps> = ({
  rates,
  language,
  onOpenMandiRates,
}) => {
  const isUrdu = language === 'ur';

  return (
    <div className="bg-emerald-950 text-white text-xs border-b border-emerald-900/60 py-2.5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Title Tag */}
        <button
          onClick={onOpenMandiRates}
          className="shrink-0 flex items-center gap-1.5 text-amber-400 font-semibold hover:text-amber-300 transition-colors uppercase tracking-wider text-[11px]"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{isUrdu ? 'آج کے منڈی ریٹس:' : 'LIVE MANDI RATES:'}</span>
        </button>

        {/* Scrolling or Flex Ticker Items */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5">
          {rates.map((rate) => {
            const isUp = rate.change > 0;
            const isDown = rate.change < 0;

            return (
              <div
                key={rate.id}
                onClick={onOpenMandiRates}
                className="flex items-center gap-2 shrink-0 cursor-pointer text-stone-200 hover:text-white transition-colors"
              >
                <span className="font-medium text-stone-300">
                  {isUrdu ? rate.commodityUrdu : rate.commodity}:
                </span>
                <span className="font-semibold text-white tabular-nums">
                  Rs. {rate.pricePerMaund.toLocaleString()}
                  <span className="text-[10px] text-stone-400 font-normal ml-0.5">
                    {isUrdu ? '/من' : '/maund'}
                  </span>
                </span>

                {isUp && (
                  <span className="flex items-center text-emerald-400 text-[11px] font-medium tabular-nums">
                    <TrendingUp className="w-3 h-3 inline mr-0.5" />
                    +{rate.change}
                  </span>
                )}
                {isDown && (
                  <span className="flex items-center text-rose-400 text-[11px] font-medium tabular-nums">
                    <TrendingDown className="w-3 h-3 inline mr-0.5" />
                    {rate.change}
                  </span>
                )}
                {!isUp && !isDown && (
                  <span className="flex items-center text-stone-400 text-[11px]">
                    <Minus className="w-3 h-3 inline mr-0.5" />
                    0
                  </span>
                )}
                <span className="text-emerald-800 text-xs select-none">|</span>
              </div>
            );
          })}
        </div>

        {/* View all button */}
        <button
          onClick={onOpenMandiRates}
          className="shrink-0 hidden lg:inline-flex items-center text-stone-300 hover:text-white underline text-xs decoration-emerald-600 hover:decoration-white transition-colors"
        >
          {isUrdu ? 'مکمل ریٹ لسٹ' : 'View All Rates'}
        </button>
      </div>
    </div>
  );
};
