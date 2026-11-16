import React, { useEffect } from 'react';
import { QrCode } from 'lucide-react';
import { Vendor } from '../types';
import { VendorHeader } from './vendor-detail/VendorHeader';
import { VendorActions } from './vendor-detail/VendorActions';
import { LandmarkCard } from './vendor-detail/LandmarkCard';
import { OperatingScheduleTable } from './vendor-detail/OperatingScheduleTable';
import { useLanguage } from '../context/LanguageContext';

interface VendorDetailDrawerProps {
  vendor: Vendor | null;
  onClose: () => void;
}

export const VendorDetailDrawer: React.FC<VendorDetailDrawerProps> = ({ vendor, onClose }) => {
  const { language, t } = useLanguage();

  // Listen for Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!vendor) return null;

  const handleShare = () => {
    const shareTitle = `${vendor.name} — GaliGuide`;
    const shareText = `${vendor.name} (${vendor.category?.name}), ${vendor.landmark} — GaliGuide`;

    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}`
      );
      alert(t('drawer.shareCopied'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:flex-row md:justify-end bg-aubergine-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Background dismissal backdrop */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} aria-label="Dismiss backdrop" />

      {/* Slide-over Drawer Panel (Bottom Sheet on Mobile, Slide-Over on Desktop) */}
      <div
        id="vendor-detail-drawer"
        data-testid="vendor-detail-drawer"
        className="relative w-full max-w-lg h-[88dvh] md:h-full bg-white rounded-t-3xl md:rounded-none shadow-street-lg flex flex-col z-10 border-t md:border-t-0 md:border-l border-icesilver-300 overflow-hidden animate-in slide-in-from-bottom md:slide-in-from-right duration-300"
      >
        {/* Mobile Pull-bar Handle */}
        <div className="md:hidden pt-2 pb-1 flex justify-center bg-white cursor-pointer select-none" onClick={onClose}>
          <div className="w-12 h-1.5 bg-icesilver-400 rounded-full" />
        </div>

        {/* Modular Header */}
        <VendorHeader vendor={vendor} onClose={onClose} onShare={handleShare} />

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 bg-canvas">
          {/* Street Landmark Guidance Card */}
          <LandmarkCard vendor={vendor} />

          {/* About this Street Stall */}
          {vendor.description && (
            <div>
              <h3 className="font-display font-bold text-base text-aubergine mb-2">
                {t('drawer.aboutTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed bg-white p-4 rounded-xl border border-icesilver-300 shadow-street-sm">
                {vendor.description}
              </p>
            </div>
          )}

          {/* Payment & Digital Trust */}
          <div className="p-4 rounded-xl bg-white border border-icesilver-300 flex items-center justify-between shadow-street-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-marigold-100 text-aubergine flex items-center justify-center flex-shrink-0">
                <QrCode className="w-5 h-5 text-marigold-900" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-aubergine">{t('drawer.paymentTitle')}</span>
                <span className="text-[11px] text-on-surface-variant">
                  {t('drawer.paymentDesc')}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-aubergine text-marigold rounded-lg text-[10px] font-black uppercase tracking-wider">
              {t('drawer.upiActive')}
            </span>
          </div>

          {/* Full 7-Day Operating Hours Table */}
          <OperatingScheduleTable vendor={vendor} />
        </div>

        {/* Sticky Action Footer (Directions & Call) */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-3 sm:p-4 border-t border-icesilver-300 shadow-street-md z-20 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <VendorActions vendor={vendor} />
        </div>
      </div>
    </div>
  );
};
