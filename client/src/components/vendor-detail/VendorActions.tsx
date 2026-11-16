import React from 'react';
import { Phone, Navigation, ShieldAlert } from 'lucide-react';
import { Vendor } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface VendorActionsProps {
  vendor: Vendor;
}

export const VendorActions: React.FC<VendorActionsProps> = ({ vendor }) => {
  const { t } = useLanguage();
  const canCall = vendor.isPhonePublic && vendor.contactPhone;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}&travelmode=walking`;

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      {/* Call Trigger (Native tel: URI or privacy-compliant disabled state) */}
      {canCall ? (
        <a
          id="btn-call-vendor"
          data-testid="btn-call-vendor"
          href={`tel:${vendor.contactPhone}`}
          className="px-2.5 py-2.5 sm:px-4 sm:py-3 bg-aubergine text-white rounded-xl font-bold text-xs tracking-wide shadow-street-sm hover:bg-aubergine-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 text-center min-h-[44px] touch-action-manipulation"
        >
          <Phone className="w-4 h-4 text-marigold flex-shrink-0" />
          <span className="truncate">{t('drawer.callVendor')}</span>
        </a>
      ) : (
        <button
          id="btn-call-vendor"
          data-testid="btn-call-vendor"
          disabled
          title={t('drawer.phonePrivacyNotice')}
          className="px-2.5 py-2.5 sm:px-4 sm:py-3 bg-icesilver-100 text-on-surface-variant/80 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 border border-icesilver-300 text-center select-none cursor-not-allowed opacity-80 min-h-[44px] touch-action-manipulation"
        >
          <ShieldAlert className="w-4 h-4 text-on-surface-variant/60 flex-shrink-0" />
          <span className="truncate">{t('drawer.inPersonOnly')}</span>
        </button>
      )}

      {/* Walking Directions Trigger (Zero-cost Universal Google Maps deep link) */}
      <a
        id="btn-get-directions"
        data-testid="btn-get-directions"
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-2.5 py-2.5 sm:px-4 sm:py-3 bg-marigold text-aubergine-900 rounded-xl font-bold text-xs tracking-wide shadow-street-sm hover:bg-marigold-400 active:bg-marigold-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 text-center border border-marigold-600/30 min-h-[44px] touch-action-manipulation"
      >
        <Navigation className="w-4 h-4 text-aubergine flex-shrink-0" />
        <span className="truncate">{t('drawer.getDirections')}</span>
      </a>
    </div>
  );
};
