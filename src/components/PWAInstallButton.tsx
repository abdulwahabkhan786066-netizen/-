import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types';
import { Download, Smartphone, X, CheckCircle, ShieldCheck, Share, ArrowRight } from 'lucide-react';

interface PWAInstallButtonProps {
  language: Language;
  variant?: 'navbar' | 'banner' | 'footer';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  language,
  variant = 'navbar',
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const isUrdu = language === 'ur';

  // If already installed in standalone mode, do not clutter
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      {/* 1. Navbar Variant */}
      {variant === 'navbar' && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-100/80 hover:bg-emerald-200/90 border border-emerald-300 rounded-lg shadow-2xs transition-all whitespace-nowrap cursor-pointer"
          title={isUrdu ? 'موبائل میں انسٹال کریں (Play Store ایپ کی طرح)' : 'Install as Mobile App'}
        >
          {/* Play Store / Smartphone Badge */}
          <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
          <span>{isUrdu ? 'موبائل ایپ' : 'App'}</span>
          <span className="hidden lg:inline text-[10px] bg-emerald-800 text-white px-1.5 py-0.2 rounded font-bold">
            {isUrdu ? 'انسٹال' : 'Install'}
          </span>
        </button>
      )}

      {/* 2. Banner Variant */}
      {variant === 'banner' && (
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md border border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-800 flex items-center justify-center shrink-0 border border-emerald-700">
              <Smartphone className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className={`font-bold text-sm sm:text-base text-white ${isUrdu ? 'urdu-font' : ''}`}>
                  {isUrdu ? 'کسان بازار موبائل ایپ اپنے فون میں انسٹال کریں' : 'Install Kisan Bazaar on your phone'}
                </h4>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold">
                  Google Play Ready
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                {isUrdu
                  ? 'بغیر انٹرنیٹ منڈی ریٹس چیک کریں، فون کی ہوم اسکرین سے ایک کلک پر براہ راست خرید و فروخت کریں۔'
                  : 'Fast access from your home screen, offline caching, and instant equipment alerts.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isUrdu ? 'ابھی ایپ ڈاؤن لوڈ / انسٹال کریں' : 'Install App Now'}</span>
          </button>
        </div>
      )}

      {/* 3. Footer Variant */}
      {variant === 'footer' && (
        <button
          onClick={handleInstallClick}
          className="text-stone-400 hover:text-white flex items-center gap-1.5 transition-colors text-xs"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isUrdu ? 'پلے اسٹور / موبائل ایپ انسٹال کریں' : 'Install Android / iOS App'}</span>
        </button>
      )}

      {/* Guided Install Modal for Mobile & Desktop */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 left-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                <Smartphone className="w-7 h-7 text-amber-300" />
              </div>
              <h3 className={`text-lg font-bold text-stone-900 ${isUrdu ? 'urdu-font' : ''}`}>
                {isUrdu ? 'کسان بازار موبائل ایپ انسٹال کریں' : 'Install Kisan Bazaar App'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {isUrdu ? 'گوگل پلے اسٹور معیار کے مطابق آفیشل ویب ایپ' : 'Official Progressive App for Android & iPhone'}
              </p>
            </div>

            {/* App Features Checklist */}
            <div className="space-y-2 mb-5 p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/70 text-xs text-stone-700">
              <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isUrdu ? 'محفوظ اور تصدیق شدہ (Google Play Protect Compliant)' : '100% Safe & Instant'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isUrdu ? 'فون میں کوئی میموری نہیں بھرتی (Zero Storage Footprint)' : 'Runs instantly without taking phone storage'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isUrdu ? 'آف لائن اور کمزور سگنل پر بھی فعال' : 'Works offline on weak rural cellular network'}</span>
              </div>
            </div>

            {/* Direct Trigger Button if supported */}
            {isInstallable ? (
              <div className="mb-4">
                <button
                  onClick={async () => {
                    await install();
                    setShowGuide(false);
                  }}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isUrdu ? 'ابھی فون میں شامل کریں (Install Now)' : 'Install Now'}</span>
                </button>
              </div>
            ) : null}

            {/* Platform Specific Steps */}
            {isIOS ? (
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-2">
                <div className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                  <Share className="w-4 h-4 text-emerald-600" />
                  <span>{isUrdu ? 'آئی فون (iPhone / Safari) پر انسٹال کرنے کا طریقہ:' : 'iPhone / iPad Installation:'}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <span>{isUrdu ? 'سفاری براؤزر میں نیچے موجود Share (شیئر) کا بٹن دبائیں۔' : 'Tap the Share icon in Safari bottom bar.'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <span>{isUrdu ? 'فہرست میں نیچے آ کر "Add to Home Screen" منتخب کریں۔' : 'Scroll down and tap "Add to Home Screen".'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <span>{isUrdu ? 'اوپر کونے میں "Add" پر کلک کریں۔ ایپ آپ کی ہوم اسکرین پر آ جائے گی!' : 'Tap Add. The app icon will appear on your Home Screen!'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-2">
                <div className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>{isUrdu ? 'اینڈرائیڈ اور کروم براؤزر (Android / Chrome) پر طریقہ:' : 'Android / Chrome Installation:'}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <span>{isUrdu ? 'براؤزر کے اوپر دائیں کونے میں 3 نقطوں (Menu) پر کلک کریں۔' : 'Tap the 3 dots menu in Chrome/browser.'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <span>{isUrdu ? '"Install app" یا "Add to Home screen" پر کلک کریں۔' : 'Select "Install app" or "Add to Home screen".'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <span>{isUrdu ? 'کسان بازار ایپ آپ کے موبائل کی مین اسکرین پر انسٹال ہو جائے گی۔' : 'Kisan Bazaar will be added as a standalone mobile app.'}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors"
            >
              {isUrdu ? 'سمجھ آ گیا (بند کریں)' : 'Got it (Close)'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
