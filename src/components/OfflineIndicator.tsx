import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Language } from '../types';
import { WifiOff } from 'lucide-react';

interface OfflineIndicatorProps {
  language: Language;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ language }) => {
  const isOnline = useOnlineStatus();
  const isUrdu = language === 'ur';

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-medium text-white shadow-xl backdrop-blur-xs border border-amber-500/40">
      <WifiOff className="w-4 h-4 shrink-0 animate-pulse text-amber-200" />
      <span>
        {isUrdu
          ? 'آف لائن موڈ — محفوظ شدہ ڈیٹا اور کیش دستیاب ہے۔'
          : 'Offline Mode — Saved listings cached.'}
      </span>
    </div>
  );
};
