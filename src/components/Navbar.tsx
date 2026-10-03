import React from 'react';
import { Language } from '../types';
import { PlusCircle, Globe, Heart, Wheat, Sparkles } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenPostAd: () => void;
  onOpenMandiRates: () => void;
  onOpenCalculator: () => void;
  onOpenSaved: () => void;
  savedCount: number;
  activeNavTab: 'all' | 'rent' | 'sale';
  setActiveNavTab: (tab: 'all' | 'rent' | 'sale') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  setLanguage,
  onOpenPostAd,
  onOpenMandiRates,
  onOpenCalculator,
  onOpenSaved,
  savedCount,
  activeNavTab,
  setActiveNavTab,
}) => {
  const isUrdu = language === 'ur';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand Wordmark */}
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); setActiveNavTab('all'); }}
          className="flex items-center gap-2 group shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-emerald-800 transition-colors">
            <Wheat className="w-5 h-5 text-amber-300" />
          </div>
          <span className={`text-xl font-bold tracking-tight text-emerald-950 ${isUrdu ? 'font-semibold urdu-font' : ''}`}>
            {isUrdu ? 'کِسان بازار' : 'Kisan Bazaar'}
          </span>
        </a>

        {/* Zone 2: 4-6 Nav links with subtle hover underlines */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveNavTab('all')}
            className={`transition-colors hover:text-emerald-700 pb-0.5 ${
              activeNavTab === 'all' ? 'text-emerald-800 font-semibold border-b-2 border-emerald-600' : ''
            }`}
          >
            {isUrdu ? 'تمام زرعی سامان' : 'All Machinery'}
          </button>

          <button
            onClick={() => setActiveNavTab('rent')}
            className={`transition-colors hover:text-emerald-700 pb-0.5 ${
              activeNavTab === 'rent' ? 'text-emerald-800 font-semibold border-b-2 border-emerald-600' : ''
            }`}
          >
            {isUrdu ? 'کرایہ پر سامان' : 'Rent Equipment'}
          </button>

          <button
            onClick={onOpenMandiRates}
            className="transition-colors hover:text-emerald-700 flex items-center gap-1.5"
          >
            <span>{isUrdu ? 'منڈی کے ریٹس' : 'Mandi Rates'}</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          <button
            onClick={onOpenCalculator}
            className="transition-colors hover:text-emerald-700 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isUrdu ? 'زرعی کیلکولیٹر' : 'Agri Calculator'}</span>
          </button>

          <button
            onClick={onOpenSaved}
            className="transition-colors hover:text-emerald-700 flex items-center gap-1.5"
          >
            <Heart className={`w-4 h-4 ${savedCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-stone-400'}`} />
            <span>{isUrdu ? 'پسندیدہ' : 'Saved'}</span>
            {savedCount > 0 && (
              <span className="text-xs bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-semibold tabular-nums">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary actions & PWA Install */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* In-App Mobile PWA / Play Store Install Button */}
          <PWAInstallButton language={language} variant="navbar" />

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(isUrdu ? 'en' : 'ur')}
            className="px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:text-emerald-800 border border-stone-200 hover:border-emerald-300 rounded-md transition-all flex items-center gap-1.5 bg-white shadow-2xs whitespace-nowrap"
            title={isUrdu ? 'Switch to English' : 'اردو میں دیکھیں'}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isUrdu ? 'English' : 'اردو'}</span>
          </button>

          {/* Post Ad CTA */}
          <button
            onClick={onOpenPostAd}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isUrdu ? 'اشتہار لگائیں' : 'Post Free Ad'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
